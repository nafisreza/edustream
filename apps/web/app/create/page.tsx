'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { createRoomSchema } from "@edustream/types";
import { roomApi } from "@/lib/room";
import { useAuth } from "@/contexts/AuthContext";
<<<<<<< HEAD
=======
import Navbar from "@/components/Navbar";
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f

export default function CreatePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Please login to create a room");
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const validatedData = createRoomSchema.parse(formData);
      const response = await roomApi.createRoom(validatedData);
      
      toast.success("Room created successfully!");
      router.push(`/room/${response.room.roomId}`);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        toast.error(error.errors[0].message);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create room");
      }
    } finally {
      setIsCreating(false);
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
<<<<<<< HEAD
=======
      <Navbar />
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-sm border">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Create Room</h1>
            <p className="mt-2 text-sm text-gray-600">
              Start a new educational streaming session
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Room Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter room name"
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#6B46C1] focus:outline-none focus:ring-2 focus:ring-[#6B46C1]"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter room description"
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#6B46C1] focus:outline-none focus:ring-2 focus:ring-[#6B46C1]"
              />
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="w-full rounded-lg bg-[#6B46C1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6B46C1] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isCreating ? "Creating Room..." : "Create Room"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
