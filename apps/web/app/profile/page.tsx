'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Mail, User as UserIcon, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

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

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-6 mb-8 pb-8 border-b">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#6B46C1] text-white">
                  <UserIcon className="h-10 w-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
                  <p className="text-sm text-gray-500 mt-1 capitalize">{user.role}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="mt-1 text-base text-gray-900">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <Mail className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="mt-1 text-base text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <Shield className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">Role</label>
                    <p className="mt-1 text-base text-gray-900 capitalize">
                      {user.role}
                      <span className="ml-2 inline-flex items-center rounded-full bg-[#6B46C1] px-2.5 py-0.5 text-xs font-medium text-white">
                        {user.role === 'teacher' ? 'Educator' : 'Student'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">User ID</label>
                    <p className="mt-1 text-sm text-gray-600 font-mono">{user.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
