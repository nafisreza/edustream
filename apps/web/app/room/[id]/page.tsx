<<<<<<< HEAD
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { roomApi } from "@/lib/room";
import { useAuth } from "@/contexts/AuthContext";
import RoomHeader from "@/components/RoomHeader";
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from "@livekit/components-react";
import { VideoPresets } from "livekit-client";
import "@livekit/components-styles/index.css";

=======
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f
interface RoomPageProps {
  params: Promise<{
    id: string;
  }>;
}

<<<<<<< HEAD
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
    <div className="flex min-h-screen flex-col bg-white relative">
      <RoomHeader roomId={roomId} roomName={roomData.name} />
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
=======
export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Room: {id}</h1>
          <button className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            Leave Room
          </button>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-4xl space-y-4 text-center">
          <h2 className="text-2xl font-bold">Room Session</h2>
          <p className="text-muted-foreground">
            Room ID: <span className="font-mono font-semibold">{id}</span>
          </p>
          <div className="mt-8 rounded-lg border bg-muted p-8">
            <p className="text-muted-foreground">
              Room content will be displayed here
            </p>
          </div>
        </div>
      </main>
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f
    </div>
  );
}
