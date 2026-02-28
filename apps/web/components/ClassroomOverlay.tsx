'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { useSocket } from '@/contexts/SocketContext';

/**
 * Rendered INSIDE <LiveKitRoom> — handles side-effects only:
 *  - Mutes local mic when teacher fires mute-all or mute-user
 *  - Redirects when kicked
 * UI controls (mic, camera, raise hand, leave) live in CustomControlBar.
 */
export default function ClassroomOverlay() {
  const router = useRouter();
  const { socket } = useSocket();
  const { localParticipant } = useLocalParticipant();
  const room = useRoomContext();

  useEffect(() => {
    if (!socket) return;

    const handleMuted = async () => {
      try {
        await localParticipant.setMicrophoneEnabled(false);
      } catch (err) {
        console.error('Failed to mute mic:', err);
      }
      toast('🔇 You were muted by the teacher', {
        duration: 5000,
        position: 'top-center',
        style: { background: '#fee2e2', color: '#991b1b', fontWeight: 500 },
      });
    };

    const handleKicked = async () => {
      toast.error('You were removed from the room', { duration: 4000 });
      await room.disconnect();
    };

    const handleMeetingEnded = async () => {
      toast('Meeting has ended', {
        duration: 4000,
        position: 'top-center',
        style: { background: '#1e293b', color: '#f8fafc', fontWeight: 500 },
      });
      await room.disconnect();
    };

    socket.on('muted-by-host', handleMuted);
    socket.on('kicked-from-room', handleKicked);
    socket.on('meeting-ended', handleMeetingEnded);

    return () => {
      socket.off('muted-by-host', handleMuted);
      socket.off('kicked-from-room', handleKicked);
      socket.off('meeting-ended', handleMeetingEnded);
    };
  }, [socket, localParticipant, room, router]);

  return null;
}

