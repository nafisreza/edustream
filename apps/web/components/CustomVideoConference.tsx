'use client';

import {
  GridLayout,
  LayoutContextProvider,
  ParticipantTile,
  useTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import CustomControlBar from './CustomControlBar';
import Whiteboard from './Whiteboard';

interface CustomVideoConferenceProps {
  roomId: string;
  userId: string;
  userName: string;
  isHost: boolean;
  whiteboardOpen: boolean;
  onToggleWhiteboard: () => void;
  initialSettings?: {
    maxParticipants: number;
    autoMuteOnJoin: boolean;
    waitingRoomEnabled: boolean;
  };
}

export default function CustomVideoConference({
  roomId,
  userId,
  userName,
  isHost,
  whiteboardOpen,
  onToggleWhiteboard,
  initialSettings,
}: CustomVideoConferenceProps) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const barProps = { roomId, userId, userName, isHost, whiteboardOpen, onToggleWhiteboard, initialSettings };

  // Whiteboard open → tiles strip pinned to the top, whiteboard fills the rest,
  // control bar stays at the absolute bottom (its own absolute positioning handles it).
  if (whiteboardOpen) {
    return (
      <LayoutContextProvider>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', background: '#111' }}>
          {/* Tiles strip — centered single row */}
          <div style={{ height: '120px', flexShrink: 0, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '6px', padding: '6px 12px', overflowX: 'auto', overflowY: 'hidden', background: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {tracks.map((track, i) => (
              // Outer div fixes size; inner div clips LiveKit's internal layout which can overflow when camera is off
              <div
                key={i}
                style={{ width: '160px', height: '90px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', position: 'relative', background: '#000' }}
              >
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                  <ParticipantTile trackRef={track} style={{ width: '100%', height: '100%' }} />
                </div>
              </div>
            ))}
          </div>
          {/* Whiteboard fills remaining space; paddingBottom leaves room for the control bar */}
          <div style={{ flex: 1, minHeight: 0, paddingBottom: '56px' }}>
            <Whiteboard
              roomId={roomId}
              userId={userId}
              userName={userName}
              isHost={isHost}
              onClose={onToggleWhiteboard}
            />
          </div>
          <CustomControlBar {...barProps} />
        </div>
      </LayoutContextProvider>
    );
  }

  return (
    <LayoutContextProvider>
      {/* outer container: fills flex parent column, relative for the bar */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        {/* video grid fills remaining space above the bar */}
        <div style={{ flex: 1, minHeight: 0, paddingBottom: '56px' }}>
          <GridLayout tracks={tracks} style={{ height: '100%' }}>
            <ParticipantTile />
          </GridLayout>
        </div>
        <CustomControlBar {...barProps} />
      </div>
    </LayoutContextProvider>
  );
}
