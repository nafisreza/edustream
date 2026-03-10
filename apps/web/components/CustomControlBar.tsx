'use client';

import { useState, useEffect } from 'react';
import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { toast } from 'react-hot-toast';
import { useSocket } from '@/contexts/SocketContext';

interface CustomControlBarProps {
  roomId: string;
  userId: string;
  userName: string;
  isHost: boolean;
  whiteboardOpen: boolean;
  onToggleWhiteboard: () => void;
}

export default function CustomControlBar({
  roomId,
  userId,
  userName,
  isHost,
  whiteboardOpen,
  onToggleWhiteboard,
}: CustomControlBarProps) {
  const room = useRoomContext();
  const { localParticipant, isMicrophoneEnabled, isCameraEnabled, isScreenShareEnabled } = useLocalParticipant();
  const { socket } = useSocket();

  const [handRaised, setHandRaised] = useState(false);
  const [leaving, setLeaving] = useState(false);

  /* ── Notify host when hand raised/lowered ─────────────── */
  useEffect(() => {
    if (!socket || isHost) return;

    const handleHandRaised = ({ name }: { userId: string; name: string }) => {
      toast(`✋ ${name} raised their hand`, {
        duration: 5000,
        position: 'top-right',
        style: { background: '#fef3c7', color: '#92400e', fontWeight: 500 },
      });
    };

    socket.on('hand-raised', handleHandRaised);
    return () => { socket.off('hand-raised', handleHandRaised); };
  }, [socket, isHost]);

  /* ── Controls ─────────────────────────────────────────── */
  const toggleMic = async () => {
    await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
  };

  const toggleCamera = async () => {
    await localParticipant.setCameraEnabled(!isCameraEnabled);
  };

  const toggleScreenShare = async () => {
    try {
      await localParticipant.setScreenShareEnabled(!isScreenShareEnabled);
    } catch {
      toast.error('Could not share screen');
    }
  };

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

  const leaveRoom = async () => {
    setLeaving(true);
    toast.success('Left the room');
    await room.disconnect();
  };

  const endMeeting = async () => {
    if (!socket) return;
    setLeaving(true);
    socket.emit('end-meeting', { roomId });
    toast.success('Meeting ended');
    await room.disconnect();
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between bg-gray-950/90 backdrop-blur-md border-t border-white/10 px-4 py-2">

      {/* Left — room code */}
      <RoomCodeBadge roomId={roomId} />

      {/* Center — media controls */}
      <div className="flex items-center gap-1">
        {/* Mic */}
        <ControlButton
          active={isMicrophoneEnabled}
          onClick={toggleMic}
          label={isMicrophoneEnabled ? 'Mute' : 'Unmute'}
          activeIcon={<MicIcon />}
          inactiveIcon={<MicOffIcon />}
          inactiveClass="bg-red-500/20 text-red-400 hover:bg-red-500/30"
        />

        {/* Camera */}
        <ControlButton
          active={isCameraEnabled}
          onClick={toggleCamera}
          label={isCameraEnabled ? 'Stop video' : 'Start video'}
          activeIcon={<CameraIcon />}
          inactiveIcon={<CameraOffIcon />}
          inactiveClass="bg-red-500/20 text-red-400 hover:bg-red-500/30"
        />

        {/* Screen share */}
        <ControlButton
          active={!isScreenShareEnabled}
          onClick={toggleScreenShare}
          label={isScreenShareEnabled ? 'Stop share' : 'Share screen'}
          activeIcon={<ScreenShareIcon />}
          inactiveIcon={<ScreenShareIcon />}
          inactiveClass="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
          activeClass="text-white hover:bg-white/10"
        />

        {/* Whiteboard */}
        <ControlButton
          active={!whiteboardOpen}
          onClick={onToggleWhiteboard}
          label={whiteboardOpen ? 'Hide board' : 'Whiteboard'}
          activeIcon={<WhiteboardIcon />}
          inactiveIcon={<WhiteboardIcon />}
          inactiveClass="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
          activeClass="text-white hover:bg-white/10"
        />

        {/* Raise hand — students only */}
        {!isHost && (
          <>
            <div className="w-px h-6 bg-white/10 mx-0.5" />
            <ControlButton
              active={!handRaised}
              onClick={toggleHand}
              label={handRaised ? 'Lower hand' : 'Raise hand'}
              activeIcon={<HandIcon />}
              inactiveIcon={<HandIcon />}
              inactiveClass="bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30"
              activeClass="text-white hover:bg-white/10"
            />
          </>
        )}
      </div>

      {/* Right — leave / end */}
      <div className="flex items-center gap-2">
        {isHost && (
          <button
            onClick={endMeeting}
            disabled={leaving}
            title="End meeting for everyone"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 active:bg-red-900 text-white text-sm font-medium transition-all disabled:opacity-50 border border-red-500/40"
          >
            <EndIcon />
            <span>End</span>
          </button>
        )}
        <button
          onClick={leaveRoom}
          disabled={leaving}
          title="Leave room"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-medium transition-all disabled:opacity-50"
        >
          <PhoneOffIcon />
          <span>Leave</span>
        </button>
      </div>
    </div>
  );
}

/* ── Room code badge ───────────────────────────────────── */
function RoomCodeBadge({ roomId }: { roomId: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col">
        <span className="text-[9px] uppercase tracking-widest text-white/40 font-medium leading-none mb-0.5">Room Code</span>
        <span className="text-sm font-mono font-semibold text-white/90 leading-none">{roomId}</span>
      </div>
      <button
        onClick={handleCopy}
        title="Copy room code"
        className={`p-1 rounded-md transition-all ${
          copied
            ? 'text-green-400 bg-green-400/10'
            : 'text-white/50 hover:text-white/80 hover:bg-white/10'
        }`}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  );
}

/* ── Generic toggle button ──────────────────────────────── */
function ControlButton({
  active,
  onClick,
  label,
  activeIcon,
  inactiveIcon,
  activeClass = 'text-white hover:bg-white/10',
  inactiveClass,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  activeClass?: string;
  inactiveClass: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg transition-all min-w-11 ${
        active ? activeClass : inactiveClass
      }`}
    >
      {active ? activeIcon : inactiveIcon}
      <span className="text-[9px] font-medium leading-none opacity-60">{label}</span>
    </button>
  );
}

/* ── Icons ──────────────────────────────────────────────── */
function CopyIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
    </svg>
  );
}

function MicOffIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M12 1a3 3 0 00-3 3v4m0 4a3 3 0 006 0V4M9 9l6 6M19 10v2a7 7 0 01-1.27 4M12 19v4M8 23h8M3 3l18 18" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
    </svg>
  );
}

function CameraOffIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 3l18 18M9.878 9.878A2 2 0 005 12v4a2 2 0 002 2h8a2 2 0 001.946-1.532M3 8a2 2 0 012-2h.5" />
    </svg>
  );
}

function ScreenShareIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function WhiteboardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M9 12h6m-3-3v6M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z" />
    </svg>
  );
}

function HandIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 013 0m-3 6a1.5 1.5 0 000 3h9a5 5 0 005-5V7.5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3" />
    </svg>
  );
}

function EndIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M5.636 5.636a9 9 0 1012.728 12.728M5.636 5.636A9 9 0 0118.364 18.364M5.636 5.636L18.364 18.364" />
    </svg>
  );
}

function PhoneOffIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a16.424 16.424 0 0114.95 9.97M5.75 11.5a16.42 16.42 0 001.25 3.5l2-2a3 3 0 014.24 0l2.12 2.12A16.37 16.37 0 0021 12" />
    </svg>
  );
}
