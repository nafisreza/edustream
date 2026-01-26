'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { roomApi } from "@/lib/room";
import { useAuth } from "@/contexts/AuthContext";
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from "@livekit/components-react";
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
  const [roomData, setRoomData] = useState<any>(null);
  const [livekitToken, setLivekitToken] = useState<string>("");
  const [livekitUrl, setLivekitUrl] = useState<string>("");
  const [isLoadingRoom, setIsLoadingRoom] = useState(true);

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
  }, [roomId, user, isLoading]);

  const loadRoom = async () => {
    try {
      const response = await roomApi.getRoom(roomId);
      setRoomData(response.room);

      // Get LiveKit token
      const tokenResponse = await roomApi.getRoomToken(roomId);
      console.log('LiveKit connection details:', {
        url: tokenResponse.url,
        roomName: tokenResponse.roomName,
        participantName: tokenResponse.participantName,
        isHost: tokenResponse.isHost,
      });
      setLivekitToken(tokenResponse.token);
      setLivekitUrl(tokenResponse.url);
    } catch (error: any) {
      console.error('Failed to load room:', error);
      if (error.response?.status === 404) {
        toast.error("Room not found or has been closed");
      } else if (error.response?.status === 403) {
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
    toast.success("Left the room");
    router.push("/");
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

  if (!user || !roomData || !livekitToken) return null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <LiveKitRoom
        token={livekitToken}
        serverUrl={livekitUrl}
        connect={true}
        video={{ resolution: VideoPresets.h720.resolution }}
        audio={true}
        onDisconnected={handleDisconnect}
        onError={handleError}
        data-lk-theme="default"
        style={{ height: '100vh' }}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}
