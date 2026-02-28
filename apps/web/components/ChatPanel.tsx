'use client';

import { useEffect, useRef, useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';

interface Message {
  userId: string;
  name: string;
  message: string;
  timestamp: Date;
}

interface ChatPanelProps {
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatPanel({ currentUserId, isOpen, onClose }: ChatPanelProps) {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data: Message) => {
      setMessages((prev) => [...prev, { ...data, timestamp: new Date(data.timestamp) }]);
    };

    socket.on('receive-message', handleMessage);
    return () => {
      socket.off('receive-message', handleMessage);
    };
  }, [socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!socket || !input.trim()) return;
    socket.emit('send-message', { message: input.trim() });
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl flex flex-col z-50 border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="font-semibold text-gray-800">Chat</h2>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-200 transition-colors text-gray-500"
          aria-label="Close chat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-8">No messages yet. Say hello!</p>
        )}
        {messages.map((msg, i) => {
          const isOwn = msg.userId === currentUserId;
          return (
            <div key={i} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
              {!isOwn && (
                <span className="text-xs text-gray-500 mb-1 ml-1">{msg.name}</span>
              )}
              <div
                className={`max-w-55 px-3 py-2 rounded-2xl text-sm wrap-break-word ${
                  isOwn
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                }`}
              >
                {msg.message}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 mx-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
