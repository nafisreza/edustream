'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
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
    lastSyncedSceneRef.current = elementsJson ?? '';
    // Suppress local onChange echo right after remote state application.
    suppressOutgoingUntilRef.current = Date.now() + 350;
    isApplyingRemoteRef.current = true;
    api.updateScene({ elements });
    queueMicrotask(() => {
      isApplyingRemoteRef.current = false;
    });
  }, []);

  const flushPendingSceneToServer = useCallback(() => {
    const pendingElements = pendingElementsRef.current;
    if (!pendingElements) {
      return;
    }

    const serialized = JSON.stringify(Array.from(pendingElements));
    if (serialized === lastSyncedSceneRef.current) {
      return;
    }
    if (serialized === '[]' && !allowEmptySceneSyncRef.current) {
      return;
    }

    socketRef.current?.emit('whiteboard-scene-update', {
      roomId,
      elementsJson: serialized,
    });
    lastSyncedSceneRef.current = serialized;
    allowEmptySceneSyncRef.current = false;
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
        color: localColor,
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('whiteboard-scene-state', ({ elementsJson }: { elementsJson: string }) => {
      applySceneFromJson(elementsJson);
      isHydratedRef.current = true;
    });

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
  }, [applySceneFromJson, localColor, roomId, user.name, user.userId]);

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

    // Throttle full-scene socket writes to keep Excalidraw drawing responsive.
    syncTimerRef.current = setTimeout(() => {
      syncTimerRef.current = null;
      flushPendingSceneToServer();
    }, 80);
  }, [flushPendingSceneToServer]);

  const setExcalidrawApi = useCallback((api: ExcalidrawApiLike | null) => {
    apiRef.current = api;
  }, []);

  const clearBoard = useCallback(() => {
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
