'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSocket } from '@/contexts/SocketContext';

interface Participant {
  userId: string;
  name: string;
  role: 'host' | 'participant';
  handRaised?: boolean;
}

interface TeacherControlsProps {
  roomId: string;
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TeacherControls({ roomId, currentUserId, isOpen, onClose }: TeacherControlsProps) {
  const { socket } = useSocket();
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Initial participant list when joining
    socket.on('room-participants', (list: Participant[]) => {
      setParticipants(list.filter((p) => p.userId !== currentUserId));
    });

    socket.on('user-joined', ({ userId, name, role }: Participant) => {
      if (userId === currentUserId) return;
      setParticipants((prev) => {
        if (prev.find((p) => p.userId === userId)) return prev;
        return [...prev, { userId, name, role, handRaised: false }];
      });
      toast(`${name} joined the room`, { duration: 3000, position: 'bottom-left' });
    });

    socket.on('user-left', ({ userId, name }: { userId: string; name: string }) => {
      setParticipants((prev) => prev.filter((p) => p.userId !== userId));
      toast(`${name} left the room`, { duration: 3000, position: 'bottom-left', style: { color: '#6b7280' } });
    });

    socket.on('hand-raised', ({ userId }: { userId: string; name: string }) => {
      setParticipants((prev) =>
        prev.map((p) => (p.userId === userId ? { ...p, handRaised: true } : p))
      );
    });

    socket.on('hand-lowered', ({ userId }: { userId: string; name: string }) => {
      setParticipants((prev) =>
        prev.map((p) => (p.userId === userId ? { ...p, handRaised: false } : p))
      );
    });

    return () => {
      socket.off('room-participants');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('hand-raised');
      socket.off('hand-lowered');
    };
  }, [socket, currentUserId]);

  const muteAll = () => {
    if (!socket) return;
    socket.emit('mute-all', { roomId });
    toast.success('All participants muted', { position: 'top-right' });
  };

  const kickUser = (targetUserId: string, name: string) => {
    if (!socket) return;
    socket.emit('kick-user', { roomId, targetUserId });
    setParticipants((prev) => prev.filter((p) => p.userId !== targetUserId));
    toast.success(`${name} removed from room`, { position: 'top-right' });
  };

  const acknowledgeHand = (targetUserId: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.userId === targetUserId ? { ...p, handRaised: false } : p))
    );
  };

  if (!isOpen) return null;

  const raisedCount = participants.filter((p) => p.handRaised).length;

  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col z-50 border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div>
          <h2 className="font-semibold text-gray-800">Participants</h2>
          <p className="text-xs text-gray-500">{participants.length} student{participants.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-200 transition-colors text-gray-500"
          aria-label="Close panel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Raised hands alert */}
      {raisedCount > 0 && (
        <div className="mx-3 mt-3 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium">
            ✋ {raisedCount} participant{raisedCount !== 1 ? 's have' : ' has'} raised hand{raisedCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Mute All */}
      <div className="px-3 pt-3">
        <button
          onClick={muteAll}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
          Mute All
        </button>
      </div>

      {/* Participant list */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {participants.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-8">No participants yet</p>
        )}
        {participants.map((p) => (
          <div
            key={p.userId}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors ${
              p.handRaised ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-100'
            }`}
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold shrink-0">
              {p.name.charAt(0).toUpperCase()}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
              {p.handRaised && (
                <p className="text-xs text-yellow-700">✋ Hand raised</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {p.handRaised && (
                <button
                  onClick={() => acknowledgeHand(p.userId)}
                  className="p-1 text-yellow-600 hover:bg-yellow-100 rounded transition-colors"
                  title="Acknowledge hand"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => kickUser(p.userId, p.name)}
                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                title={`Remove ${p.name}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
