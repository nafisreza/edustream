'use client';

import dynamic from 'next/dynamic';
import { useSocket } from '@/contexts/SocketContext';
import { useWhiteboardCollab } from '@/hooks/useWhiteboardCollab';

// Excalidraw must be loaded client-side only (uses window internals)
const Excalidraw = dynamic(
  async () => (await import('@excalidraw/excalidraw')).Excalidraw,
  { ssr: false, loading: () => <div className="flex h-full items-center justify-center text-gray-400 text-sm">Loading whiteboard…</div> }
);

interface WhiteboardProps {
  roomId: string;
  userId: string;
  userName: string;
  isHost: boolean;
  onClose: () => void;
}

export default function Whiteboard({
  roomId,
  userId,
  userName,
  isHost,
  onClose,
}: WhiteboardProps) {
  const { socket } = useSocket();

  const { isConnected, presenceUsers, handleSceneChange, setExcalidrawApi, clearBoard, studentDrawingAllowed } =
    useWhiteboardCollab({
      roomId,
      user: { userId, name: userName },
      socket,
    });

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828A2 2 0 019 15.828V13z" />
          </svg>
          <span className="text-sm font-semibold text-gray-800">Whiteboard</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
              isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {isConnected ? 'Live' : 'Offline'}
          </span>
          {presenceUsers.length > 0 && (
            <span className="text-[10px] text-gray-400">{presenceUsers.length} online</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isHost && (
            <>
              <button
                type="button"
                onClick={() =>
                  socket?.emit('whiteboard-set-draw-permission', { roomId, allowed: !studentDrawingAllowed })
                }
                title={studentDrawingAllowed ? 'Lock drawing for students' : 'Allow students to draw'}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  studentDrawingAllowed
                    ? 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
                    : 'text-orange-600 bg-orange-50 hover:text-orange-700 hover:bg-orange-100'
                }`}
              >
                {studentDrawingAllowed ? 'Lock draw' : 'Unlock'}
              </button>
              <button
                type="button"
                onClick={clearBoard}
                title="Clear board"
                className="px-2 py-1 text-xs rounded text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                Clear
              </button>
            </>
          )}
          {!isHost && !studentDrawingAllowed && (
            <span className="px-2 py-0.5 rounded text-[10px] bg-orange-100 text-orange-600 font-medium">
              View only
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            title="Close whiteboard"
            className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 min-h-0">
        <Excalidraw
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          excalidrawAPI={setExcalidrawApi as any}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(elements) => handleSceneChange(elements as readonly any[])}
          viewModeEnabled={!isHost && !studentDrawingAllowed}
        />
      </div>
    </div>
  );
}

