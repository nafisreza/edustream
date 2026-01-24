'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { authApi } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.forgotPassword(email);
      toast.success(response.message);
      setOtpSent(true);
      setStep(2);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.verifyOTP(email, otp);
      toast.success(response.message);
      setResetToken(response.resetToken);
      setStep(3);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.resetPassword(resetToken, newPassword);
      toast.success(response.message);
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-sm border">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#6B46C1]/10">
              <Mail className="h-6 w-6 text-[#6B46C1]" />
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Reset Password</h1>
            <p className="mt-2 text-sm text-gray-600">
              {step === 1 && "Enter your email to receive an OTP"}
              {step === 2 && "Enter the OTP sent to your email"}
              {step === 3 && "Create a new password"}
            </p>
          </div>

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#6B46C1] focus:outline-none focus:ring-2 focus:ring-[#6B46C1]"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-[#6B46C1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6B46C1] disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  6-Digit OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 text-center tracking-widest font-mono text-xl focus:border-[#6B46C1] focus:outline-none focus:ring-2 focus:ring-[#6B46C1]"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Check your email for the OTP. It expires in 10 minutes.
                </p>
              </div>
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full rounded-lg bg-[#6B46C1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6B46C1] disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-gray-600 hover:text-gray-900"
              >
                Resend OTP
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#6B46C1] focus:outline-none focus:ring-2 focus:ring-[#6B46C1]"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters long
                </p>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#6B46C1] focus:outline-none focus:ring-2 focus:ring-[#6B46C1]"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-[#6B46C1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6B46C1] disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-[#6B46C1] hover:text-[#5B21B6] font-medium"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
