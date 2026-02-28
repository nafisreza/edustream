'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSocket } from '@/contexts/SocketContext';

interface RaiseHandButtonProps {
  userId: string;
  userName: string;
  roomId: string;
  isHost: boolean;
}

export default function RaiseHandButton({ userId, userName, roomId, isHost }: RaiseHandButtonProps) {
  const { socket } = useSocket();
  const [handRaised, setHandRaised] = useState(false);

  useEffect(() => {
    if (!socket || !isHost) return;

    const handleHandRaised = ({ name }: { userId: string; name: string }) => {
      toast(`✋ ${name} raised their hand`, {
        duration: 5000,
        position: 'top-right',
        style: { background: '#fef3c7', color: '#92400e', fontWeight: 500 },
      });
    };

    const handleHandLowered = ({ name }: { userId: string; name: string }) => {
      toast(`${name} lowered their hand`, {
        duration: 3000,
        position: 'top-right',
        style: { background: '#f3f4f6', color: '#374151' },
      });
    };

    socket.on('hand-raised', handleHandRaised);
    socket.on('hand-lowered', handleHandLowered);
    return () => {
      socket.off('hand-raised', handleHandRaised);
      socket.off('hand-lowered', handleHandLowered);
    };
  }, [socket, isHost]);

  // Host doesn't need the raise-hand button
  if (isHost) return null;

  const toggleHand = () => {
    if (!socket) return;
    if (handRaised) {
      socket.emit('lower-hand', { roomId, userId, name: userName });
      setHandRaised(false);
    } else {
      socket.emit('raise-hand', { roomId, userId, name: userName });
      setHandRaised(true);
    }
  };

  return (
    <button
      onClick={toggleHand}
      title={handRaised ? 'Lower hand' : 'Raise hand'}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        handRaised
          ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500 shadow-md'
          : 'bg-white/90 text-gray-700 hover:bg-white shadow border border-gray-200'
      }`}
    >
      <span className="text-base">✋</span>
      <span className="hidden sm:inline">{handRaised ? 'Lower Hand' : 'Raise Hand'}</span>
    </button>
  );
}
