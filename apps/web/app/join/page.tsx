'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { roomApi } from "@/lib/room";
import { useAuth } from "@/contexts/AuthContext";

export default function JoinPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [roomId, setRoomId] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Please login to join a room");
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomId.trim()) {
      toast.error("Please enter a room ID");
      return;
    }

    setIsJoining(true);

    try {
      // Verify room exists
      await roomApi.getRoom(roomId);
      
      // Join the room (adds user to participants)
      await roomApi.joinRoom(roomId, { name: user?.name || 'Anonymous' });
      
      toast.success("Joined room successfully");
      
      // Navigate to room page
      router.push(`/room/${roomId}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error("Room not found or has been closed");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to join room");
      }
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-sm border">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Join Room</h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter a room ID to join an existing session
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
                Room ID
              </label>
              <input
                id="roomId"
                type="text"
                required
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                placeholder="XXX-XXX-XXX"
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#6B46C1] focus:outline-none focus:ring-2 focus:ring-[#6B46C1]"
              />
            </div>
            <button
              type="submit"
              disabled={isJoining}
              className="w-full rounded-lg bg-[#6B46C1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6B46C1] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isJoining ? "Joining Room..." : "Join Room"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
