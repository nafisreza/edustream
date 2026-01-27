'use client';

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if we're on the landing page
  const isLandingPage = pathname === "/";
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

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
    <header
      className={`fixed left-0 top-0 z-50 w-full ${
        isLandingPage
          ? "bg-transparent border-b border-white/20"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src={isLandingPage ? "/EduStreamLogo.png?v=2" : "/EduStreamLogo_purple.png"}
            alt="EduStream Logo"
            width={100}
            height={30}
            className={`h-7 w-auto ${isLandingPage ? "brightness-0 invert" : ""}`}
            priority
            unoptimized
          />
        </Link>

        <div className="flex items-center gap-4 ml-auto">
          {user ? (
            <>
              <Link
                href="/create"
                className={`text-sm font-medium transition-colors ${
                  isLandingPage ? "text-white hover:text-white/80" : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Create Room
              </Link>
              <Link
                href="/join"
                className={`text-sm font-medium transition-colors ${
                  isLandingPage ? "text-white hover:text-white/80" : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Join Room
              </Link>
              <Link
                href="/profile"
                aria-label="Profile"
                className="flex items-center"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                    isLandingPage ? "bg-white/20 text-white" : "bg-[#6B46C1] text-white"
                  }`}
                >
                  {userInitials}
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className={`text-sm font-medium transition-colors ${
                  isLandingPage ? "text-white hover:text-white/80" : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {isLandingPage ? (
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
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-lg bg-[#6B46C1] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5B21B6]"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
