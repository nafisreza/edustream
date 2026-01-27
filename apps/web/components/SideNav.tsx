"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  User, 
  Video, 
  Users, 
  MessageSquare, 
  Settings,
  LogOut 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Create Room", href: "/create", icon: Video },
  { name: "Join Room", href: "/join", icon: Users },
];

export default function SideNav() {
  const pathname = usePathname();
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
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/EduStreamLogo_purple.png"
            alt="EduStream Logo"
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
            unoptimized
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-[#6B46C1] text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-[#6B46C1]"
                }
              `}
            >
              <item.icon
                className={`h-5 w-5 ${
                  isActive ? "text-white" : "text-gray-400 group-hover:text-[#6B46C1]"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      {user && (
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-4 px-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6B46C1] text-white text-sm font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 capitalize truncate">
                {user.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-red-600"
          >
            <LogOut className="h-5 w-5 text-gray-400" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
