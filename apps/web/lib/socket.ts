'use client';

import { io, type Socket } from 'socket.io-client';

export const createSocketClient = (): Socket => {
  const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  return io(serverUrl, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
  });
};
