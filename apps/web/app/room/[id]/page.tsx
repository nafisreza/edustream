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
import Whiteboard from "@/components/Whiteboard";
import WaitingRoomView from "@/components/WaitingRoomView";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);
  const [isLoadingRoom, setIsLoadingRoom] = useState(true);
  const [waitingRoom, setWaitingRoom] = useState(false);
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

  // Waiting for host approval — must be checked before the livekitToken guard because
  // the token is intentionally empty while the student is pending.
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

  if (!user || !roomData || !livekitToken) return null;

  return (
    <SocketProvider
      roomId={roomId}
      userId={user.id}
      name={user.name}
      role={isHost ? 'host' : 'participant'}
    >
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* Video area */}
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
          <LiveKitRoom
            token={livekitToken}
            serverUrl={livekitUrl}
            connect={true}
            video={{ resolution: VideoPresets.h720.resolution }}
            audio={true}
            onConnected={() => { wasConnectedRef.current = true; }}
            onDisconnected={handleDisconnect}
            onError={handleError}
            data-lk-theme="default"
            style={{ height: '100vh' }}
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
        </div>

        {/* Whiteboard panel — inline, toggled by control bar */}
        {whiteboardOpen && (
          <div style={{ width: '45%', minWidth: 0, height: '100vh' }}>
            <Whiteboard
              roomId={roomId}
              userId={user.id}
              userName={user.name}
              isHost={isHost}
              onClose={() => setWhiteboardOpen(false)}
            />
          </div>
        )}

        {/* Sidebar — participants + chat, visible to everyone */}
        <RoomSidebar
          roomId={roomId}
          userId={user.id}
          userName={user.name}
          isHost={isHost}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
        />
      </div>
    </SocketProvider>
  );
}
