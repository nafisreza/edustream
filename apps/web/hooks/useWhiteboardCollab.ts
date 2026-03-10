'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import * as Y from 'yjs';
import { createSocketClient } from '@/lib/socket';

const AWARENESS_COLORS = ['#4f46e5', '#db2777', '#059669', '#ea580c', '#0891b2', '#7c3aed'];

type ExcalidrawApiLike = {
  updateScene: (sceneData: { elements?: any[] }) => void;
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

const safeParseElements = (raw: string | undefined): any[] => {
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
const sortElementsByIndex = (elements: any[]): any[] =>
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
}: {
  roomId: string;
  user: WhiteboardUser;
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [presenceUsers, setPresenceUsers] = useState<PresenceUser[]>([
    { userId: user.userId, name: user.name, color: AWARENESS_COLORS[0] ?? '#4f46e5' },
  ]);
  const socketRef = useRef<Socket | null>(null);
  const apiRef = useRef<ExcalidrawApiLike | null>(null);
  const isApplyingRemoteRef = useRef(false);
  const pendingElementsRef = useRef<readonly any[] | null>(null);
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
        const yElements = ydoc.getMap<any>('elements');
        yElements.clear();
        for (const el of elements) {
          if (el?.id) {
            yElements.set(el.id, el);
          }
        }
      });
    }

    lastSyncedSceneRef.current = elementsJson ?? '';
    // Suppress local onChange echo right after remote state application.
    suppressOutgoingUntilRef.current = Date.now() + 350;
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

    const elements = sortElementsByIndex(Array.from(ydoc.getMap<any>('elements').values()));
    lastSyncedSceneRef.current = JSON.stringify(elements);
    suppressOutgoingUntilRef.current = Date.now() + 350;
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
      const yElements = ydoc.getMap<any>('elements');
      const existingIds = new Set(yElements.keys());
      const newIds = new Set<string>();

      for (const el of pendingElements) {
        if (el?.id) {
          newIds.add(el.id);
          // Only write to the Y.Map when the element actually changed.
          // Use the Excalidraw `version` counter as a cheap fast path; fall
          // back to a full JSON comparison for elements that lack a version.
          const current = yElements.get(el.id);
          const sameVersion =
            current !== undefined &&
            typeof el.version === 'number' &&
            typeof current.version === 'number' &&
            el.version === current.version;
          if (!sameVersion && JSON.stringify(current) !== JSON.stringify(el)) {
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

    // `encodeStateAsUpdate(doc, sv)` returns only the operations that are in
    // `doc` but not reflected in `sv` — i.e., the incremental delta.
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
    if (!roomId) {
      return;
    }

    const socket = createSocketClient();
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      isHydratedRef.current = false;
      socket.emit('join-whiteboard-room', {
        roomId,
        userId: user.userId,
        name: user.name,
        color: localColor,
      });
      // Request the full Yjs CRDT state so the local Y.Doc starts from the
      // same baseline as the rest of the room.
      socket.emit('whiteboard-yjs-sync', { roomId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Full JSON snapshot sent automatically on join (backward compat / initial
    // state for rooms that were populated before Yjs was introduced).
    socket.on('whiteboard-scene-state', ({ elementsJson }: { elementsJson: string }) => {
      applySceneFromJson(elementsJson);
      isHydratedRef.current = true;
    });

    // Full Yjs state response — seeds the local Y.Doc and updates Excalidraw
    // if the server doc already contains elements (overrides the JSON snapshot).
    socket.on('whiteboard-yjs-sync', ({ update }: { update: number[] }) => {
      const ydoc = ydocRef.current;
      if (!ydoc || !update?.length) {
        return;
      }
      Y.applyUpdate(ydoc, new Uint8Array(update));
      const yElements = ydoc.getMap<any>('elements');
      if (yElements.size > 0) {
        applyYjsElementsToScene();
        isHydratedRef.current = true;
      }
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

    return () => {
      if (socket.connected) {
        socket.emit('leave-whiteboard-room', { roomId });
      }
      socket.disconnect();
      socketRef.current = null;
      isHydratedRef.current = false;
    };
  }, [applySceneFromJson, applyYjsElementsToScene, localColor, roomId, user.name, user.userId]);

  const handleSceneChange = useCallback((elements: readonly any[]) => {
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
    if (syncTimerRef.current) {
      return;
    }

    // Throttle CRDT delta writes — 150 ms gives a good balance between
    // collaboration responsiveness and reduced bandwidth vs the old 80 ms
    // full-scene JSON approach.
    syncTimerRef.current = setTimeout(() => {
      syncTimerRef.current = null;
      flushPendingSceneToServer();
    }, 150);
  }, [flushPendingSceneToServer]);

  const setExcalidrawApi = useCallback((api: ExcalidrawApiLike | null) => {
    apiRef.current = api;
  }, []);

  const clearBoard = useCallback(() => {
    const ydoc = ydocRef.current;
    if (ydoc) {
      const stateVectorBefore = Y.encodeStateVector(ydoc);
      ydoc.transact(() => {
        ydoc.getMap<any>('elements').clear();
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
  };
};
