'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSocket } from '@/contexts/SocketContext';

type Tab = 'participants' | 'chat';

interface Participant {
  userId: string;
  name: string;
  role: 'host' | 'participant';
  handRaised?: boolean;
}

interface Message {
  userId: string;
  name: string;
  message: string;
  timestamp: Date;
}

interface RoomSidebarProps {
  roomId: string;
  userId: string;
  userName: string;
  isHost: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export default function RoomSidebar({
  roomId,
  userId,
  userName,
  isHost,
  isOpen,
  onToggle,
}: RoomSidebarProps) {
  const { socket } = useSocket();
  const [activeTab, setActiveTab] = useState<Tab>('participants');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [unreadChat, setUnreadChat] = useState(0);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /* ── Close dropdown on outside click ─────────────────── */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* ── Socket: participants ─────────────────────────────── */
  useEffect(() => {
    if (!socket) return;

    socket.on('room-participants', (list: Participant[]) => {
      setParticipants(list);
    });

    socket.on('user-joined', ({ userId: uid, name, role }: Participant) => {
      setParticipants((prev) => {
        if (prev.find((p) => p.userId === uid)) return prev;
        return [...prev, { userId: uid, name, role, handRaised: false }];
      });
      toast(`${name} joined`, { duration: 2500, position: 'bottom-left' });
    });

    socket.on('user-left', ({ userId: uid, name }: { userId: string; name: string }) => {
      setParticipants((prev) => prev.filter((p) => p.userId !== uid));
      toast(`${name} left`, {
        duration: 2500,
        position: 'bottom-left',
        style: { color: '#6b7280' },
      });
    });

    socket.on('hand-raised', ({ userId: uid }: { userId: string; name: string }) => {
      setParticipants((prev) =>
        prev.map((p) => (p.userId === uid ? { ...p, handRaised: true } : p))
      );
    });

    socket.on('hand-lowered', ({ userId: uid }: { userId: string; name: string }) => {
      setParticipants((prev) =>
        prev.map((p) => (p.userId === uid ? { ...p, handRaised: false } : p))
      );
    });

    return () => {
      socket.off('room-participants');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('hand-raised');
      socket.off('hand-lowered');
    };
  }, [socket]);

  /* ── Socket: chat ─────────────────────────────────────── */
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data: Message) => {
      setMessages((prev) => [...prev, { ...data, timestamp: new Date(data.timestamp) }]);
      if (activeTab !== 'chat' || !isOpen) {
        setUnreadChat((n) => n + 1);
      }
    };

    socket.on('receive-message', handleMessage);
    return () => {
      socket.off('receive-message', handleMessage);
    };
  }, [socket, activeTab, isOpen]);

  /* ── Auto-scroll chat ─────────────────────────────────── */
  useEffect(() => {
    if (activeTab === 'chat') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'chat') setUnreadChat(0);
  };

  /* ── Actions (teacher only) ───────────────────────────── */
  const muteAll = () => {
    if (!socket) return;
    socket.emit('mute-all', { roomId });
    toast.success('All participants muted', { position: 'top-right' });
  };

  const muteUser = (targetUserId: string, name: string) => {
    if (!socket) return;
    socket.emit('mute-user', { roomId, targetUserId });
    setOpenMenuId(null);
    toast.success(`${name} muted`, { position: 'top-right' });
  };

  const kickUser = (targetUserId: string, name: string) => {
    if (!socket) return;
    socket.emit('kick-user', { roomId, targetUserId });
    setParticipants((prev) => prev.filter((p) => p.userId !== targetUserId));
    setOpenMenuId(null);
    toast.success(`${name} removed`, { position: 'top-right' });
  };

  const lowerHand = (targetUserId: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.userId === targetUserId ? { ...p, handRaised: false } : p))
    );
    setOpenMenuId(null);
    // Also emit so the student's button resets (optional, handled client-side for now)
  };

  /* ── Chat send ────────────────────────────────────────── */
  const sendMessage = () => {
    if (!socket || !chatInput.trim()) return;
    socket.emit('send-message', {
      roomId,
      message: chatInput.trim(),
      userId,
      name: userName,
    });
    setChatInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ── Sort: host first, then hand-raised, then rest ────── */
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.role === 'host' && b.role !== 'host') return -1;
    if (b.role === 'host' && a.role !== 'host') return 1;
    if (a.handRaised && !b.handRaised) return -1;
    if (b.handRaised && !a.handRaised) return 1;
    return a.name.localeCompare(b.name);
  });

  /* ── Collapsed state ─────────────────────────────────── */
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        title="Open panel"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 w-8 h-20 bg-gray-800 text-white flex items-center justify-center rounded-l-lg shadow-lg hover:bg-gray-700 transition-colors"
        style={{ writingMode: 'vertical-rl' }}
      >
        <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  }

  return (
    <div className="flex flex-col w-72 bg-white border-l border-gray-200 shadow-xl h-full shrink-0">
      {/* Header with tabs */}
      <div className="flex items-center border-b border-gray-200">
        <button
          onClick={() => switchTab('participants')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'participants'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          People
          <span className="text-xs text-gray-400">({participants.length})</span>
        </button>

        <button
          onClick={() => switchTab('chat')}
          className={`flex-1 relative flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'chat'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Chat
          {unreadChat > 0 && (
            <span className="absolute top-2 right-4 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
              {unreadChat > 9 ? '9+' : unreadChat}
            </span>
          )}
        </button>

        {/* Collapse button */}
        <button
          onClick={onToggle}
          title="Collapse panel"
          className="p-2 mr-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── PARTICIPANTS TAB ─────────────────────────────── */}
      {activeTab === 'participants' && (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Mute All — teacher only */}
          {isHost && (
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
          )}

          {/* List */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5" ref={menuRef}>
            {sortedParticipants.length === 0 && (
              <p className="text-center text-gray-400 text-sm mt-8">No participants yet</p>
            )}
            {sortedParticipants.map((p) => {
              const isMe = p.userId === userId;
              const menuOpen = openMenuId === p.userId;
              const showMenu = isHost && !isMe && p.role !== 'host';

              return (
                <div
                  key={p.userId}
                  className="group relative flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold shrink-0">
                    {p.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name row */}
                  <div className="flex-1 min-w-0 flex items-center gap-1.5">
                    <span className="text-sm font-medium text-gray-800 truncate">{p.name}</span>
                    {p.role === 'host' && (
                      <span className="text-xs text-blue-500 font-medium shrink-0">(Host)</span>
                    )}
                    {isMe && p.role !== 'host' && (
                      <span className="text-[11px] text-gray-400 shrink-0">(you)</span>
                    )}
                    {p.handRaised && (
                      <span className="text-base shrink-0" title="Hand raised">✋</span>
                    )}
                  </div>

                  {/* 3-dot menu button — teacher only, not on self, not on host */}
                  {showMenu && (
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(menuOpen ? null : p.userId)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 text-gray-500 transition-all"
                        title="More options"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="5" cy="12" r="1.5" />
                          <circle cx="12" cy="12" r="1.5" />
                          <circle cx="19" cy="12" r="1.5" />
                        </svg>
                      </button>

                      {/* Dropdown */}
                      {menuOpen && (
                        <div className="absolute right-0 top-7 z-50 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm">
                          {/* Mute */}
                          <button
                            onClick={() => muteUser(p.userId, p.name)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-gray-50 text-gray-700 transition-colors"
                          >
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                            </svg>
                            Mute
                          </button>

                          {/* Lower hand — only if raised */}
                          {p.handRaised && (
                            <button
                              onClick={() => lowerHand(p.userId)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-gray-50 text-gray-700 transition-colors"
                            >
                              <span className="text-base leading-none">✋</span>
                              Lower hand
                            </button>
                          )}

                          <div className="my-1 border-t border-gray-100" />

                          {/* Kick */}
                          <button
                            onClick={() => kickUser(p.userId, p.name)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-red-50 text-red-600 transition-colors"
                          >
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── CHAT TAB ─────────────────────────────────────── */}
      {activeTab === 'chat' && (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.length === 0 && (
              <p className="text-center text-gray-400 text-sm mt-8">No messages yet. Say hello!</p>
            )}
            {messages.map((msg, i) => {
              const isOwn = msg.userId === userId;
              return (
                <div key={i} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                  {!isOwn && (
                    <span className="text-xs text-gray-500 mb-1 ml-1">{msg.name}</span>
                  )}
                  <div
                    className={`max-w-52 px-3 py-2 rounded-2xl text-sm wrap-break-word ${
                      isOwn
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    }`}
                  >
                    {msg.message}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 mx-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
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
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
              <button
                onClick={sendMessage}
                disabled={!chatInput.trim()}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
