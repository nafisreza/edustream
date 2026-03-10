'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { roomApi } from '@/lib/room';
import { useWhiteboardCollab } from '@/hooks/useWhiteboardCollab';

const Excalidraw = dynamic(
  async () => (await import('@excalidraw/excalidraw')).Excalidraw,
  { ssr: false }
);

interface WhiteboardPageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default function WhiteboardPage({ params }: WhiteboardPageProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [roomId, setRoomId] = useState<string>('');
  const [isValidatingRoom, setIsValidatingRoom] = useState(true);

  useEffect(() => {
    params.then(({ roomId: resolvedRoomId }) => setRoomId(resolvedRoomId));
  }, [params]);

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error('Please login to access whiteboard');
      router.push('/login');
      return;
    }

    if (!roomId || !user) {
      return;
    }

    const validateRoom = async () => {
      try {
        await roomApi.getRoom(roomId);
      } catch {
        toast.error('Room not found or unavailable');
        router.push('/');
      } finally {
        setIsValidatingRoom(false);
      }
    };

    validateRoom();
  }, [isLoading, roomId, router, user]);

  const { isConnected, presenceUsers, handleSceneChange, setExcalidrawApi, clearBoard } =
    useWhiteboardCollab({
      roomId,
      user: {
        userId: user?.id ?? '',
        name: user?.name ?? 'Anonymous',
      },
    });

  if (isLoading || isValidatingRoom) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading whiteboard...</div>
      </div>
    );
  }

  if (!user || !roomId) {
    return null;
  }

  return (
    <div className="h-screen bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/room/${roomId}`}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Back to Room
          </Link>
          <div>
            <p className="text-sm font-semibold text-gray-900">Realtime Whiteboard</p>
            <p className="text-xs text-gray-500">Room: {roomId}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          <span className="text-xs text-gray-600">{presenceUsers.length} participant(s) online</span>
          <button
            type="button"
            onClick={clearBoard}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Clear Board
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh-61px)]">
        <Excalidraw
          excalidrawAPI={setExcalidrawApi as any}
          onChange={(elements) => handleSceneChange(elements as readonly any[])}
        />
      </div>
    </div>
  );
}
