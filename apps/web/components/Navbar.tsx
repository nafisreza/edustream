'use client';

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
<<<<<<< HEAD
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
=======
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f
import { toast } from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
<<<<<<< HEAD
  const pathname = usePathname();
  
  // Check if we're on the landing page
  const isLandingPage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    if (!isLandingPage) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLandingPage]);
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";
=======
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f

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
<<<<<<< HEAD
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-colors duration-300 ${
        isLandingPage
          ? isScrolled
            ? "bg-white/90 backdrop-blur-md border-b border-gray-200"
            : "bg-transparent border-b border-white/20"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src={
              isLandingPage
                ? isScrolled
                  ? "/EduStreamLogo_purple.png"
                  : "/EduStreamLogo.png?v=2"
                : "/EduStreamLogo_purple.png"
            }
            alt="EduStream Logo"
            width={100}
            height={30}
            className={`h-7 w-auto transition-[filter] duration-300 ${
              isLandingPage && !isScrolled ? "brightness-0 invert" : ""
            }`}
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
                  isLandingPage
                    ? isScrolled
                      ? "text-gray-700 hover:text-gray-900"
                      : "text-white hover:text-white/80"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Create Room
              </Link>
              <Link
                href="/join"
                className={`text-sm font-medium transition-colors ${
                  isLandingPage
                    ? isScrolled
                      ? "text-gray-700 hover:text-gray-900"
                      : "text-white hover:text-white/80"
                    : "text-gray-700 hover:text-gray-900"
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
                    isLandingPage
                      ? isScrolled
                        ? "bg-[#6B46C1] text-white"
                        : "bg-white/20 text-white"
                      : "bg-[#6B46C1] text-white"
                  }`}
                >
                  {userInitials}
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className={`text-sm font-medium transition-colors ${
                  isLandingPage
                    ? isScrolled
                      ? "text-gray-700 hover:text-gray-900"
                      : "text-white hover:text-white/80"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Logout
=======
    <header className="bg-white border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/EduStreamLogo.png"
            alt="EduStream Logo"
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
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
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f
              </button>
            </>
          ) : (
            <>
<<<<<<< HEAD
              {isLandingPage ? (
                <>
                  <Link
                    href="/login"
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      isScrolled
                        ? "border border-gray-200 text-gray-700 hover:bg-gray-50"
                        : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30"
                    }`}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      isScrolled
                        ? "bg-[#6B46C1] text-white hover:bg-[#5B21B6]"
                        : "bg-white text-[#6B46C1] hover:bg-gray-50"
                    }`}
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
=======
              <Link
                href="/login"
                className="rounded-lg bg-[#6B46C1] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5B21B6]"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-[#8B5CF6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#7C3AED]"
              >
                Sign Up
              </Link>
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f
            </>
          )}
        </div>
      </div>
    </header>
  );
}
