'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { roomApi } from "@/lib/room";
import { useAuth } from "@/contexts/AuthContext";
import type { RoomResponse } from "@edustream/types";
import { SocketProvider } from "@/contexts/SocketContext";
import ClassroomOverlay from "@/components/ClassroomOverlay";
import CustomVideoConference from "@/components/CustomVideoConference";
import RoomSidebar from "@/components/RoomSidebar";
import WaitingRoomView from "@/components/WaitingRoomView";
import PreJoinPreview from "@/components/PreJoinPreview";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { VideoPresets } from "livekit-client";
import "@livekit/components-styles/index.css";

interface RoomPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RoomPage({ params }: RoomPageProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [roomId, setRoomId] = useState<string>("");
  const [roomData, setRoomData] = useState<RoomResponse | null>(null);
  const [livekitToken, setLivekitToken] = useState<string>("");
  const [livekitUrl, setLivekitUrl] = useState<string>("");
  const [isHost, setIsHost] = useState(false);
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);
  const [isLoadingRoom, setIsLoadingRoom] = useState(true);
  const [waitingRoom, setWaitingRoom] = useState(false);
  const [shouldConnect, setShouldConnect] = useState(false);
  const [joinPreferences, setJoinPreferences] = useState({
    audioEnabled: true,
    videoEnabled: true,
  });
  // Track whether a LiveKit connection was ever successfully established.
  // Prevents transient first-join PC errors from immediately redirecting away.
  const wasConnectedRef = useRef(false);

  useEffect(() => {
    params.then(({ id }) => setRoomId(id));
  }, [params]);

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Please login to access this room");
      router.push("/login");
      return;
    }

    if (roomId && user) {
      loadRoom();
    }
  }, [roomId, user, isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadRoom = async () => {
    setIsLoadingRoom(true);
    try {
      const response = await roomApi.getRoom(roomId);
      setRoomData(response.room);

      // Get LiveKit token
      const tokenResponse = await roomApi.getRoomToken(roomId);

      // Host has waiting room enabled for this participant — show waiting UI.
      if (tokenResponse.pending) {
        setWaitingRoom(true);
        return;
      }

      setWaitingRoom(false);
      console.log('LiveKit connection details:', {
        url: tokenResponse.url,
        roomName: tokenResponse.roomName,
        participantName: tokenResponse.participantName,
        isHost: tokenResponse.isHost,
      });
      setLivekitToken(tokenResponse.token!);
      setLivekitUrl(tokenResponse.url!);
      setIsHost(tokenResponse.isHost!);
    } catch (error: unknown) {
      console.error('Failed to load room:', error);
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 404) {
        toast.error("Room not found or has been closed");
      } else if (axiosError.response?.status === 403) {
        toast.error("You must join the room first");
        router.push(`/join?roomId=${roomId}`);
        return;
      } else {
        toast.error("Failed to load room");
      }
      router.push("/");
    } finally {
      setIsLoadingRoom(false);
    }
  };

  const handleDisconnect = () => {
    console.log('Disconnected from room');
    // Only navigate away if we were previously connected.
    // On initial connection failures (e.g. ICE/PC errors), LiveKit fires
    // onDisconnected before the session is established — we should stay on
    // the page so the user can retry rather than being ejected.
    if (wasConnectedRef.current) {
      router.push('/');
    }
  };

  const handleError = (error: Error) => {
    console.error('LiveKit error:', error);
    toast.error(`Connection error: ${error.message}`);
  };

  if (isLoading || isLoadingRoom) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading room...</div>
      </div>
    );
  }

  if (!user || !roomData) return null;

  if (!shouldConnect) {
    return (
      <PreJoinPreview
        roomId={roomId}
        userName={user.name}
        defaultAudioEnabled={!(roomData.settings.autoMuteOnJoin && !isHost)}
        defaultVideoEnabled={true}
        onJoin={(preferences) => {
          setJoinPreferences(preferences);
          setShouldConnect(true);
        }}
        onCancel={() => router.push('/')}
      />
    );
  }

  // Waiting for host approval should happen only after the participant confirms
  // joining from the preview screen.
  if (waitingRoom && user && roomId) {
    return (
      <WaitingRoomView
        roomId={roomId}
        onApproved={() => {
          setWaitingRoom(false);
          loadRoom();
        }}
      />
    );
  }

  if (!livekitToken) return null;

  return (
    <SocketProvider
      roomId={roomId}
      userId={user.id}
      name={user.name}
      role={isHost ? 'host' : 'participant'}
    >
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#000' }}>
        <LiveKitRoom
          token={livekitToken}
          serverUrl={livekitUrl}
          connect={shouldConnect}
          video={joinPreferences.videoEnabled ? { resolution: VideoPresets.h720.resolution } : false}
          audio={joinPreferences.audioEnabled}
          onConnected={() => { wasConnectedRef.current = true; }}
          onDisconnected={handleDisconnect}
          onError={handleError}
          data-lk-theme="default"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}
        >
          <CustomVideoConference
            roomId={roomId}
            userId={user.id}
            userName={user.name}
            isHost={isHost}
            whiteboardOpen={whiteboardOpen}
            onToggleWhiteboard={() => setWhiteboardOpen(v => !v)}
            initialSettings={roomData?.settings}
          />
          <RoomAudioRenderer />
          <ClassroomOverlay />
        </LiveKitRoom>

        {/* Sidebar — always visible, dark themed */}
        <RoomSidebar
          roomId={roomId}
          userId={user.id}
          userName={user.name}
          isHost={isHost}
        />
      </div>
    </SocketProvider>
  );
}
