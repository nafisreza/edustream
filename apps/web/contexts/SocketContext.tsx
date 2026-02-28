'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { io, Socket } from 'socket.io-client';

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

    const serverUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const s = io(serverUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

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
