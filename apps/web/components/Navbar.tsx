'use client';

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="bg-transparent border-b border-white/20">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/EduStreamLogo.png?v=2"
            alt="EduStream Logo"
            width={100}
            height={30}
            className="h-7 w-auto"
            priority
            unoptimized
          />
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30 border border-white/30"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#6B46C1] transition-colors hover:bg-gray-50"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
