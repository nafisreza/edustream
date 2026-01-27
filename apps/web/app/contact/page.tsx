"use client";
import React, { useState } from 'react';
import Link from 'next/link'; // Added this import for the contact link

const sections = [
  {
    title: 'Introduction',
    content: (
      <>
        <p className="mb-4">
          EduStream is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our virtual classroom platform.
        </p>
      </>
    ),
  },
  {
    title: 'Information We Collect',
    content: (
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li><b>Account Information:</b> Teachers may create accounts. Students can join rooms without accounts, but may provide a name for identification.</li>
        <li><b>Room Data:</b> Room IDs, participant names, and roles (Teacher/Student) are stored for session management.</li>
        <li><b>Audio/Video Data:</b> Media streams are transmitted peer-to-peer using WebRTC and are <b>not recorded or stored</b> by EduStream servers.</li>
        <li><b>Chat & Whiteboard:</b> Messages and whiteboard data are transmitted in real-time and may be stored temporarily for session continuity.</li>
        <li><b>Technical Data:</b> Browser type, device information, and connection logs for troubleshooting and analytics.</li>
      </ul>
    ),
  },
  {
    title: 'How We Use Your Information',
    content: (
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>To provide and maintain the EduStream platform.</li>
        <li>To manage rooms, participants, and roles.</li>
        <li>To improve user experience and platform security.</li>
        <li>To comply with legal obligations.</li>
      </ul>
    ),
  },
  {
    title: 'Data Sharing & Disclosure',
    content: (
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>We do <b>not</b> sell or rent your personal information.</li>
        <li>We may share data with service providers (e.g., database, analytics) strictly for platform operation.</li>
        <li>We may disclose information if required by law or to protect our rights.</li>
      </ul>
    ),
  },
  {
    title: 'Data Security',
    content: (
      <p className="mb-4">We use industry-standard security measures to protect your data. Peer-to-peer media streams are encrypted via WebRTC. Account and room data are stored securely.</p>
    ),
  },
  {
    title: "Children's Privacy", // Fixed: Used double quotes to avoid parsing error
    content: (
      <p className="mb-4">EduStream is designed for educational use. We do not knowingly collect personal information from children under 13 without parental consent.</p>
    ),
  },
  {
    title: 'Changes to This Policy',
    content: (
      <p className="mb-4">We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</p>
    ),
  },
  {
    title: 'Contact Us',
    content: (
      <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:support@edustream.com" className="text-purple-600 underline hover:text-purple-800">support@edustream.com</a>.</p>
    ),
  },
];

export default function PrivacyPolicy() {
  const [open, setOpen] = useState(Array(sections.length).fill(false));

  const toggle = (idx: number) => {
    setOpen(prev => prev.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50">
      {/* Main Content */}
      <div className="flex-1 px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-bold mb-4" style={{ color: '#6B46C1' }}>
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-700 font-medium">
              Last updated: January 20, 2026
            </p>
          </div>

          {/* Introduction Section with Image */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#6B46C1' }}>
                  Your Privacy Matters
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  At EduStream, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data while you use our browser-based virtual classroom platform.
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  By using EduStream, you agree to the collection and use of your information as described in this policy.
                </p>
              </div>
              
              <div className="lg:w-80 flex justify-center">
                <img
                  src="/privacyphoto.png"
                  alt="Privacy Policy Illustration"
                  className="w-72 h-72 object-contain rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="space-y-4">
            {sections.slice(1).map((section, idx) => (
              <div 
                key={section.title} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <button
                  className="flex items-center w-full justify-between text-left px-8 py-6 focus:outline-none hover:bg-purple-50 transition-colors"
                  onClick={() => toggle(idx + 1)}
                  aria-expanded={open[idx + 1]}
                >
                  <span 
                    className="text-2xl font-bold"
                    style={{ color: [1, 3, 5, 7].includes(idx + 1) ? '#6B46C1' : '#1F2937' }}
                  >
                    {section.title}
                  </span>
                  <span 
                    className="text-3xl font-light transition-transform duration-300"
                    style={{ 
                      color: '#6B46C1',
                      transform: open[idx + 1] ? 'rotate(180deg)' : 'rotate(0deg)',
                      display: 'inline-block'
                    }}
                  >
                    {open[idx + 1] ? '−' : '+'}
                  </span>
                </button>
                
                {open[idx + 1] && (
                  <div className="px-8 pb-6 text-gray-700 border-t border-gray-100">
                    <div className="pt-4">
                      {section.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Updated Bottom CTA */}
          <div className="text-center mt-12 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-3" style={{ color: '#6B46C1' }}>
              Have Questions?
            </h3>
            <p className="text-gray-700 mb-6">
              We're here to help you understand how we protect your privacy.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors font-semibold shadow-md hover:shadow-lg"
            >
              Contact Privacy Team
              <svg className="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

        </div> {/* max-w-5xl */}
      </div> {/* flex-1 */}
/*footer*/
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <a href="/" className="inline-block mb-4">
                <img 
                  src="/EduStreamLogo_purple.png" 
                  alt="EduStream Logo" 
                  className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                />
              </a>
              <p className="text-gray-600">
                Transform learning with interactive streaming. Connect educators and learners in real-time sessions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/create-room" className="text-gray-600 hover:text-purple-600">Create Room</Link></li>
                <li><Link href="/join-room" className="text-gray-600 hover:text-purple-600">Join Room</Link></li>
                <li><Link href="/features" className="text-gray-600 hover:text-purple-600">Features</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-600 hover:text-purple-600">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-purple-600">Contact Us</Link></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-purple-600">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-gray-600">© 2026 EduStream. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}