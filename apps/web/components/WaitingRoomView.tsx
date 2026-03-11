'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { createSocketClient } from '@/lib/socket';

interface WaitingRoomViewProps {
  roomId: string;
  onApproved: () => void;
}

export default function WaitingRoomView({ roomId, onApproved }: WaitingRoomViewProps) {
  const router = useRouter();
  const hasHandledRef = useRef(false);
  // Keep a ref so the socket callback always sees the latest callback without
  // re-running the effect (which would reconnect the socket).
  const onApprovedRef = useRef(onApproved);
  onApprovedRef.current = onApproved;

  useEffect(() => {
    const socket = createSocketClient();

    socket.on('connect', () => {
      socket.emit('waiting-room-request', { roomId });
    });

    socket.on('join-approved', () => {
      if (hasHandledRef.current) return;
      hasHandledRef.current = true;
      socket.disconnect();
      toast.success('You have been admitted to the room');
      onApprovedRef.current();
    });

    socket.on('join-rejected', () => {
      if (hasHandledRef.current) return;
      hasHandledRef.current = true;
      socket.disconnect();
      toast.error('Your join request was declined');
      router.push('/');
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="text-center px-6">
        {/* Spinner */}
        <div className="relative mx-auto mb-6 w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-600/20" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        </div>

        <h2 className="text-xl font-semibold text-white mb-2">Waiting to be admitted</h2>
        <p className="text-gray-400 text-sm mb-1">The host will admit you shortly</p>
        <p className="text-gray-600 text-xs font-mono">{roomId}</p>

        <button
          onClick={() => {
            hasHandledRef.current = true;
            router.push('/');
          }}
          className="mt-8 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
