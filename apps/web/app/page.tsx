import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="bg-white">
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
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="#features"
                className="text-sm font-medium text-black transition-colors hover:text-[#6B46C1]"
              >
                Our Features
              </Link>
              <Link
                href="#support"
                className="text-sm font-medium text-black transition-colors hover:text-[#6B46C1]"
              >
                Support
              </Link>
            </nav>
            <div className="flex items-center gap-3">
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
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="space-y-8">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="text-black">Where teaching meets</span>
                <br />
                <span className="text-[#6B46C1]">seamless connection</span>
              </h1>
              <div className="flex justify-center">
                <Link
                  href="/signup"
                  className="inline-flex h-14 items-center justify-center rounded-lg bg-[#6B46C1] px-10 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#5B21B6]"
                >
                  Let&apos;s get started!
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="features" className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-black">
              Services we offer
            </h2>
            
            {/* Scrollable Cards Container */}
            <div className="relative">
              <div className="overflow-x-auto scrollbar-hide pb-4">
                <div className="flex gap-6 min-w-max px-2">
                  {/* Calls Card */}
                  <div className="flex-shrink-0 w-[320px] sm:w-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800 relative">
                    <div className="absolute top-4 left-4 z-10">
                      <h3 className="text-3xl font-bold text-white">Calls</h3>
                    </div>
                    <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center">
                      <div className="text-center text-gray-500 p-8">
                        <div className="mb-4">
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            {Array.from({ length: 9 }).map((_, i) => (
                              <div
                                key={i}
                                className="aspect-square bg-purple-300 rounded-lg"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm">Video conference interface</p>
                      </div>
                    </div>
                  </div>

                  {/* Whiteboard Card with Content */}
                  <div className="flex-shrink-0 w-[320px] sm:w-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 to-purple-700 relative">
                    <div className="absolute top-4 left-4 z-10">
                      <h3 className="text-3xl font-bold text-white">Whiteboard</h3>
                    </div>
                    <div className="aspect-[4/3] bg-blue-50 flex items-center justify-center">
                      <div className="text-center text-gray-500 p-8">
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-sm font-semibold mb-2">Product Launch Tasks</p>
                            <div className="space-y-1 text-left">
                              <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span className="text-sm">Update progress</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-300">□</span>
                                <span className="text-sm">Create roadmap</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm">Interactive whiteboard interface</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Placeholder Whiteboard Cards */}
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-[320px] sm:w-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-400 to-white relative"
                    >
                      <div className="absolute top-4 left-4 z-10">
                        <h3 className="text-3xl font-bold text-white">Whiteboard</h3>
                      </div>
                      <div className="aspect-[4/3] bg-gradient-to-br from-purple-200 to-white" />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {[1, 2, 3, 4, 5].map((dot, index) => (
                  <button
                    key={dot}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === 2
                        ? "bg-[#6B46C1]"
                        : "bg-white border-2 border-gray-300"
                    }`}
                    aria-label={`Go to slide ${dot}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="inline-block mb-4">
                <Image
                  src="/EduStreamLogo.png"
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
                    href="#support"
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
