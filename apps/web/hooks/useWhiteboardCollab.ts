'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import * as Y from 'yjs';

const AWARENESS_COLORS = ['#4f46e5', '#db2777', '#059669', '#ea580c', '#0891b2', '#7c3aed'];

// Minimal representation of a single Excalidraw element. We only hard-type
// the properties we reference; the rest pass through via the index signature.
type ExcalidrawElementData = {
  id?: string;
  version?: number;
  index?: string;
  [key: string]: unknown;
};

type ExcalidrawApiLike = {
  updateScene: (sceneData: { elements?: ExcalidrawElementData[] }) => void;
};

type WhiteboardUser = {
  userId: string;
  name: string;
};

type PresenceUser = {
  userId: string;
  name: string;
  color: string;
};

const safeParseElements = (raw: string | undefined): ExcalidrawElementData[] => {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Reconstruct an ordered element array from a Y.Map keyed by element ID.
// Excalidraw v0.17+ assigns every element a fractional `index` string used
// for z-ordering (e.g. "a0", "a1", "b0", "Zz"). These are alphanumeric
// tokens designed specifically for lexicographic (string) comparison, so a
// standard string sort produces the correct rendering order.
const sortElementsByIndex = (elements: ExcalidrawElementData[]): ExcalidrawElementData[] =>
  [...elements].sort((a, b) => {
    const ia: string = a?.index ?? '';
    const ib: string = b?.index ?? '';
    if (ia < ib) return -1;
    if (ia > ib) return 1;
    return 0;
  });

export const useWhiteboardCollab = ({
  roomId,
  user,
  socket,
}: {
  roomId: string;
  user: WhiteboardUser;
  socket: Socket | null;
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [presenceUsers, setPresenceUsers] = useState<PresenceUser[]>([
    { userId: user.userId, name: user.name, color: AWARENESS_COLORS[0] ?? '#4f46e5' },
  ]);
  const [studentDrawingAllowed, setStudentDrawingAllowed] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const apiRef = useRef<ExcalidrawApiLike | null>(null);
  const isApplyingRemoteRef = useRef(false);
  const pendingElementsRef = useRef<readonly ExcalidrawElementData[] | null>(null);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncedSceneRef = useRef<string>('');
  const isHydratedRef = useRef(false);
  const suppressOutgoingUntilRef = useRef(0);
  const allowEmptySceneSyncRef = useRef(false);
  const ydocRef = useRef<Y.Doc | null>(null);

  const localColor = useMemo(() => {
    const charCode = user.userId.charCodeAt(0) || 0;
    return AWARENESS_COLORS[charCode % AWARENESS_COLORS.length] ?? '#4f46e5';
  }, [user.userId]);

  const applySceneFromJson = useCallback((elementsJson?: string) => {
    const api = apiRef.current;
    if (!api) {
      return;
    }

    const elements = safeParseElements(elementsJson);

    // Keep the Y.Doc baseline in sync so subsequent local deltas are computed
    // correctly against the received state.
    const ydoc = ydocRef.current;
    if (ydoc) {
      ydoc.transact(() => {
        const yElements = ydoc.getMap<ExcalidrawElementData>('elements');
        yElements.clear();
        for (const el of elements) {
          if (el?.id) {
            yElements.set(el.id, el);
          }
        }
      });
    }

    lastSyncedSceneRef.current = elementsJson ?? '';
    // Brief suppress window to catch any immediate Excalidraw echo after
    // updateScene — 30 ms is enough; 350 ms was silently dropping user strokes.
    suppressOutgoingUntilRef.current = Date.now() + 30;
    // Sync pendingElementsRef so any in-flight flush timer uses merged state.
    pendingElementsRef.current = elements;
    isApplyingRemoteRef.current = true;
    api.updateScene({ elements });
    queueMicrotask(() => {
      isApplyingRemoteRef.current = false;
    });
  }, []);

  // Read the current elements from the Y.Doc and push them into Excalidraw.
  const applyYjsElementsToScene = useCallback(() => {
    const ydoc = ydocRef.current;
    const api = apiRef.current;
    if (!ydoc || !api) {
      return;
    }

    const elements = sortElementsByIndex(Array.from(ydoc.getMap<ExcalidrawElementData>('elements').values()));
    lastSyncedSceneRef.current = JSON.stringify(elements);
    suppressOutgoingUntilRef.current = Date.now() + 30;
    // Sync pendingElementsRef so any in-flight flush timer uses merged state.
    pendingElementsRef.current = elements;
    isApplyingRemoteRef.current = true;
    api.updateScene({ elements });
    queueMicrotask(() => {
      isApplyingRemoteRef.current = false;
    });
  }, []);

  const flushPendingSceneToServer = useCallback(() => {
    const pendingElements = pendingElementsRef.current;
    const ydoc = ydocRef.current;
    const socket = socketRef.current;
    if (!pendingElements || !ydoc || !socket) {
      return;
    }

    // Guard against accidental board wipes when Excalidraw initialises empty.
    if (pendingElements.length === 0 && !allowEmptySceneSyncRef.current) {
      return;
    }

    // Capture the state vector *before* the transaction so we can encode only
    // the incremental CRDT delta that results from this local change.
    const stateVectorBefore = Y.encodeStateVector(ydoc);

    ydoc.transact(() => {
      const yElements = ydoc.getMap<ExcalidrawElementData>('elements');
      const existingIds = new Set(yElements.keys());
      const newIds = new Set<string>();

      for (const el of pendingElements) {
        if (el?.id) {
          newIds.add(el.id);
          // Always write — do NOT skip based on version equality.
          // In-progress elements (active strokes, mid-move text, etc.) update
          // their geometry on every pointer event but only bump `version` when
          // the action is committed; skipping same-version writes means peers
          // never see the element until the user lifts the mouse.
          const current = yElements.get(el.id);
          if (JSON.stringify(current) !== JSON.stringify(el)) {
            yElements.set(el.id, el);
          }
        }
      }

      // Remove elements that were deleted locally.
      for (const id of existingIds) {
        if (!newIds.has(id)) {
          yElements.delete(id);
        }
      }
    });

    const update = Y.encodeStateAsUpdate(ydoc, stateVectorBefore);
    if (update.length > 0) {
      socket.emit('whiteboard-yjs-update', {
        roomId,
        update: Array.from(update),
      });
    }

    allowEmptySceneSyncRef.current = false;
  }, [roomId]);

  // Create a fresh Y.Doc for each room so state from a previous room is not
  // carried over when the user navigates between rooms.
  useEffect(() => {
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;
    return () => {
      ydoc.destroy();
      ydocRef.current = null;
    };
  }, [roomId]);

  useEffect(() => {
    if (!roomId || !socket) {
      return;
    }

    socketRef.current = socket;

    const joinWhiteboard = () => {
      setIsConnected(true);
      isHydratedRef.current = false;
      socket.emit('join-whiteboard-room', {
        roomId,
        color: localColor,
      });
      // The server responds to join-whiteboard-room with whiteboard-yjs-sync
      // containing the full room state — no separate sync request needed.
    };

    // If the socket is already connected when the whiteboard mounts, join immediately.
    if (socket.connected) {
      joinWhiteboard();
    } else {
      socket.on('connect', joinWhiteboard);
    }

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Full JSON snapshot sent on join (backward compat fallback).
    // Only apply it if Yjs hasn't already hydrated the scene.
    socket.on('whiteboard-scene-state', ({ elementsJson }: { elementsJson: string }) => {
      if (!isHydratedRef.current) {
        applySceneFromJson(elementsJson);
        isHydratedRef.current = true;
      }
    });

    // Full Yjs state response — seeds the local Y.Doc and updates Excalidraw.
    // Always mark hydrated so we don't double-apply the JSON fallback.
    socket.on('whiteboard-yjs-sync', ({ update }: { update: number[] }) => {
      const ydoc = ydocRef.current;
      if (!ydoc || !update?.length) {
        // Even an empty sync means the server has processed our request.
        isHydratedRef.current = true;
        return;
      }
      Y.applyUpdate(ydoc, new Uint8Array(update));
      applyYjsElementsToScene();
      isHydratedRef.current = true;
    });

    // Incremental CRDT delta broadcast from a peer.
    socket.on('whiteboard-yjs-update', ({ update }: { update: number[] }) => {
      const ydoc = ydocRef.current;
      if (!ydoc || !update?.length) {
        return;
      }
      Y.applyUpdate(ydoc, new Uint8Array(update));
      applyYjsElementsToScene();
    });

    // Keep the full-scene JSON listener so that clients still on the old code
    // path can interoperate until the migration is complete.
    socket.on('whiteboard-scene-update', ({ elementsJson }: { elementsJson: string }) => {
      applySceneFromJson(elementsJson);
    });

    socket.on(
      'whiteboard-presence-state',
      ({
        participants,
      }: {
        participants: Array<{ userId: string; name: string; color: string }>;
      }) => {
        setPresenceUsers(participants);
      }
    );

    socket.on('whiteboard-draw-permission', ({ allowed }: { allowed: boolean }) => {
      setStudentDrawingAllowed(allowed);
    });

    return () => {
      socket.off('connect', joinWhiteboard);
      socket.off('disconnect');
      socket.off('whiteboard-scene-state');
      socket.off('whiteboard-yjs-sync');
      socket.off('whiteboard-yjs-update');
      socket.off('whiteboard-scene-update');
      socket.off('whiteboard-presence-state');
      socket.off('whiteboard-draw-permission');
      if (socket.connected) {
        socket.emit('leave-whiteboard-room', { roomId });
      }
      socketRef.current = null;
      isHydratedRef.current = false;
    };
  }, [applySceneFromJson, applyYjsElementsToScene, localColor, roomId, socket]);

  const handleSceneChange = useCallback((elements: readonly ExcalidrawElementData[]) => {
    if (isApplyingRemoteRef.current) {
      return;
    }
    if (!isHydratedRef.current) {
      return;
    }
    if (Date.now() < suppressOutgoingUntilRef.current) {
      return;
    }

    pendingElementsRef.current = elements ?? [];

    // Cancel any pending flush and restart the timer so every change
    // (including mid-stroke pointer moves) schedules a fresh flush.
    // 50 ms keeps collaboration snappy without flooding the socket.
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
    }
    syncTimerRef.current = setTimeout(() => {
      syncTimerRef.current = null;
      flushPendingSceneToServer();
    }, 50);
  }, [flushPendingSceneToServer]);

  const setExcalidrawApi = useCallback((api: ExcalidrawApiLike | null) => {
    apiRef.current = api;
  }, []);

  const clearBoard = useCallback(() => {
    const ydoc = ydocRef.current;
    if (ydoc) {
      const stateVectorBefore = Y.encodeStateVector(ydoc);
      ydoc.transact(() => {
        ydoc.getMap<ExcalidrawElementData>('elements').clear();
      });
      const update = Y.encodeStateAsUpdate(ydoc, stateVectorBefore);
      if (update.length > 0) {
        socketRef.current?.emit('whiteboard-yjs-update', {
          roomId,
          update: Array.from(update),
        });
      }
    }

    // Also update the JSON snapshot store so that clients on the old code path
    // see the board cleared correctly.
    const empty = JSON.stringify([]);
    allowEmptySceneSyncRef.current = true;
    lastSyncedSceneRef.current = empty;
    apiRef.current?.updateScene({ elements: [] });
    socketRef.current?.emit('whiteboard-scene-update', {
      roomId,
      elementsJson: empty,
    });
  }, [roomId]);

  useEffect(() => {
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
        syncTimerRef.current = null;
      }
    };
  }, []);

  return {
    isConnected,
    presenceUsers,
    handleSceneChange,
    setExcalidrawApi,
    clearBoard,
    studentDrawingAllowed,
  };
};
