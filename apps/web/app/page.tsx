"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import ServicesCarousel from "@/components/ServicesCarousel";
import ServicesDetails from "@/components/ServicesDetails";
import CustomerJourney from "@/components/CustomerJourney";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, isLoading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Gradient Container - Navbar + Hero + Services */}
      <div className="relative hero-gradient min-h-screen">
        <Navbar />
        
        {/* Hero Section */}
        <section className="pb-20 sm:pb-20 lg:pb-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-20 lg:pt-24">
            <div className="mx-auto max-w-4xl text-center">
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="text-white">Where teaching meets</span>
                  <br />
                  <span className="text-white">seamless connection</span>
                </h1>
                <p className="mx-auto max-w-3xl text-lg text-white/90 sm:text-xl leading-relaxed">
                  EduStream brings teachers and students together in real time with smooth video streaming,
                  classroom controls, and a clean interface built for effective online learning.
                </p>
                <div className="flex justify-center">
                  {isLoading ? null : user ? (
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link
                        href="/create"
                        className="inline-flex h-14 items-center justify-center rounded-lg bg-white px-8 text-base font-semibold text-[#6B46C1] shadow-sm transition-colors hover:bg-gray-50"
                      >
                        Create Room
                      </Link>
                      <Link
                        href="/join"
                        className="inline-flex h-14 items-center justify-center rounded-lg bg-white px-8 text-base font-semibold text-[#6B46C1] shadow-sm transition-colors hover:bg-gray-50"
                      >
                        Join Room
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href="/signup"
                      className="inline-flex h-14 items-center justify-center rounded-lg bg-white px-10 text-base font-semibold text-[#6B46C1] shadow-sm transition-colors hover:bg-gray-50"
                    >
                      Let&apos;s get started!
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Carousel Section */}
        <section id="features" className="pt-2 sm:pt-4 lg:pt-6 pb-6 sm:pb-8 lg:pb-10 relative overflow-visible">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-white">
              Services we offer
            </h2> */}
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
            <ServicesCarousel />
          </div>
        </section>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {/* Services Details Section */}
        <ServicesDetails />

        {/* Customer Journey Section */}
        <CustomerJourney />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="inline-block mb-4">
                <Image
                  src="/EduStreamLogo_purple.png"
                  alt="EduStream Logo"
                  width={140}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
              <p className="text-sm text-gray-600 max-w-md">
                Transform learning with interactive streaming. Connect educators
                and learners in real-time sessions.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-black mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/create"
                    className="text-sm text-gray-600 hover:text-[#6B46C1] transition-colors"
                  >
                    Create Room
                  </Link>
                </li>
                <li>
                  <Link
                    href="/join"
                    className="text-sm text-gray-600 hover:text-[#6B46C1] transition-colors"
                  >
                    Join Room
                  </Link>
                </li>
                <li>
                  <Link
                    href="#features"
                    className="text-sm text-gray-600 hover:text-[#6B46C1] transition-colors"
                  >
                    Features
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-black mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/help"
                    className="text-sm text-gray-600 hover:text-[#6B46C1] transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-gray-600 hover:text-[#6B46C1] transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-gray-600 hover:text-[#6B46C1] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-center text-gray-600">
              © {new Date().getFullYear()} EduStream. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
