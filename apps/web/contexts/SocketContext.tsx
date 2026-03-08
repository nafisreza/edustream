'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import type { Socket } from 'socket.io-client';
import { createSocketClient } from '@/lib/socket';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({
  children,
  roomId,
  userId,
  name,
  role,
}: {
  children: ReactNode;
  roomId: string;
  userId: string;
  name: string;
  role: 'host' | 'participant';
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!roomId || !userId) return;

    const s = createSocketClient();

    setSocket(s);

    s.on('connect', () => {
      setIsConnected(true);
      s.emit('join-room', { roomId, userId, name, role });
    });

    s.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      if (s.connected) {
        s.emit('leave-room', { roomId, userId });
      }
      s.disconnect();
      setSocket(null);
    };
  }, [roomId, userId, name, role]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
