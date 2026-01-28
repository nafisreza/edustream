'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface RoomHeaderProps {
  roomId: string;
  roomName: string;
}

export default function RoomHeader({ roomId, roomName }: RoomHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      toast.success('Room code copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className="absolute bottom-32 left-4 z-50 bg-white rounded-lg shadow-lg p-4 max-w-xs">
      <div className="flex flex-col gap-2">
        <p className="text-gray-600 text-xs font-medium uppercase">Room Code</p>
        <div className="flex items-center gap-2">
          <code className="text-sm font-bold text-gray-900">{roomId}</code>
          <button
            onClick={handleCopyCode}
            className={`flex-shrink-0 p-1 rounded transition-all ${
              copied
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Copy room code"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
