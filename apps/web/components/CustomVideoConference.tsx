'use client';

import {
  GridLayout,
  LayoutContextProvider,
  ParticipantTile,
  useTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import CustomControlBar from './CustomControlBar';

interface CustomVideoConferenceProps {
  roomId: string;
  userId: string;
  userName: string;
  isHost: boolean;
  whiteboardOpen: boolean;
  onToggleWhiteboard: () => void;
}

export default function CustomVideoConference({
  roomId,
  userId,
  userName,
  isHost,
  whiteboardOpen,
  onToggleWhiteboard,
}: CustomVideoConferenceProps) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <LayoutContextProvider>
      {/* outer container: full height, flex column, relative so the bar can absolute-position to bottom */}
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        {/* video grid fills remaining space above the bar */}
        <div style={{ flex: 1, minHeight: 0, paddingBottom: '56px' }}>
          <GridLayout tracks={tracks} style={{ height: '100%' }}>
            <ParticipantTile />
          </GridLayout>
        </div>
        <CustomControlBar
          roomId={roomId}
          userId={userId}
          userName={userName}
          isHost={isHost}
          whiteboardOpen={whiteboardOpen}
          onToggleWhiteboard={onToggleWhiteboard}
        />
      </div>
    </LayoutContextProvider>
  );
}
