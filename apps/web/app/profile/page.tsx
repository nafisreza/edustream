'use client';

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Users, User as UserIcon, Eye, EyeOff } from "lucide-react";
import SideNav from "@/components/SideNav";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showMeetingId, setShowMeetingId] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Generate Personal Meeting ID from user ID
  const personalMeetingId = useMemo(() => {
    if (!user?.id) return "*** *** ***";
    // Take last 3 characters of user ID and pad if needed
    const lastPart = user.id.slice(-3).padStart(3, '0');
    return `*** *** ${lastPart}`;
  }, [user?.id]);

  // Detect timezone
  const timeZone = useMemo(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const offset = new Date().getTimezoneOffset();
      const hours = Math.floor(Math.abs(offset) / 60);
      const minutes = Math.abs(offset) % 60;
      const sign = offset <= 0 ? '+' : '-';
      return `(GMT${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}) ${tz.split('/').pop()?.replace('_', ' ') || 'UTC'}`;
    } catch {
      return "(GMT+06:00) Dhaka";
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userInitials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex mx-auto container bg-gray-50">
      <div>
        <SideNav/>
      </div>
      <div className="flex-1 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Privacy Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">
                When you join meetings, webinars, chats, or classrooms hosted on EduStream, your profile information, including your name and profile picture, may be visible to other participants or members. Your name and email address will also be visible to the{' '}
                <span className="text-blue-600 underline cursor-pointer">account owner</span>
                {' '}and host when you join meetings, webinars, chats, or classrooms on their account while you&apos;re signed in. The account owner and others in the meeting, webinar, chat, or classroom can share this information with apps and others.
              </p>
            </div>
          </div>

          {/* Profile Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#6B46C1] text-white text-2xl font-semibold">
                  {userInitials}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-lg text-gray-600 mt-1">{user.name}</p>
                </div>
              </div>
              <button className="text-sm font-medium text-[#6B46C1] hover:text-[#5B21B6] transition-colors">
                Edit
              </button>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Personal information</h2>
            
            <div className="space-y-0">
              {/* Phone */}
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500 block mb-1">Phone</label>
                  <p className="text-base text-gray-900">Not set</p>
                </div>
                <button className="text-sm font-medium text-[#6B46C1] hover:text-[#5B21B6] transition-colors ml-4">
                  Edit
                </button>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500 block mb-1">Language</label>
                  <p className="text-base text-gray-900">English</p>
                </div>
                <button className="text-sm font-medium text-[#6B46C1] hover:text-[#5B21B6] transition-colors ml-4">
                  Edit
                </button>
              </div>

              {/* Time Zone */}
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500 block mb-1">Time Zone</label>
                  <p className="text-base text-gray-900">{timeZone}</p>
                </div>
                <button className="text-sm font-medium text-[#6B46C1] hover:text-[#5B21B6] transition-colors ml-4">
                  Edit
                </button>
              </div>

              {/* Date Format */}
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500 block mb-1">Date Format</label>
                  <p className="text-base text-gray-900">mm/dd/yyyy Example: 01/27/2026</p>
                </div>
                <button className="text-sm font-medium text-[#6B46C1] hover:text-[#5B21B6] transition-colors ml-4">
                  Edit
                </button>
              </div>

              {/* Time Format */}
              <div className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500 block mb-1">Time Format</label>
                  <p className="text-base text-gray-900">Use 12-hour time (Example: 02:00 PM)</p>
                </div>
                <button className="text-sm font-medium text-[#6B46C1] hover:text-[#5B21B6] transition-colors ml-4">
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* Meeting Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Meeting</h2>
            
            <div className="flex items-center justify-between py-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-500 block mb-1">Personal Meeting ID</label>
                <p className="text-base text-gray-900 font-mono">
                  {showMeetingId ? personalMeetingId.replace(/\*/g, 'X') : personalMeetingId}
                </p>
              </div>
              <div className="flex items-center gap-4 ml-4">
                <button
                  onClick={() => setShowMeetingId(!showMeetingId)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label={showMeetingId ? "Hide meeting ID" : "Show meeting ID"}
                >
                  {showMeetingId ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                <button className="text-sm font-medium text-[#6B46C1] hover:text-[#5B21B6] transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
