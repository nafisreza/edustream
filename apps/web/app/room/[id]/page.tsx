'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { roomApi } from "@/lib/room";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

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
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error("Room not found or has been closed");
      } else {
        toast.error("Failed to load room");
      }
      router.push("/");
    } finally {
      setIsLoadingRoom(false);
    }
  };

  const handleLeaveRoom = () => {
    toast.success("Left the room");
    router.push("/");
  };

  const handleCloseRoom = async () => {
    if (!confirm("Are you sure you want to close this room? All participants will be disconnected.")) {
      return;
    }

    try {
      await roomApi.closeRoom(roomId);
      toast.success("Room closed successfully");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to close room");
    }
  };

  if (isLoading || isLoadingRoom) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading room...</div>
      </div>
    );
  }

  if (!user || !roomData) return null;

  const isHost = roomData.hostId === user.id;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{roomData.name}</h1>
            <p className="text-xs text-gray-500">Room ID: {roomId}</p>
          </div>
          <div className="flex items-center gap-2">
            {isHost && (
              <button
                onClick={handleCloseRoom}
                className="rounded-lg border border-red-600 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Close Room
              </button>
            )}
            <button
              onClick={handleLeaveRoom}
              className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
            >
              <LogOut className="h-4 w-4" />
              Leave
            </button>
          </div>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-4xl space-y-4 text-center">
          <div className="rounded-lg border bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">Room Session</h2>
            <p className="mt-2 text-gray-600">
              {roomData.description || "No description"}
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-500">
                Host: <span className="font-medium text-gray-900">{roomData.hostName}</span>
              </p>
              <p className="text-sm text-gray-500">
                Participants: <span className="font-medium text-gray-900">{roomData.participantCount || 0}</span>
              </p>
            </div>
            <div className="mt-8 rounded-lg border bg-gray-50 p-8">
              <p className="text-gray-600">
                WebRTC video/audio streaming will be implemented here
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
