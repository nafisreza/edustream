
"use client";
import React, { useState } from 'react';

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
      <ul className="list-disc pl-6 mb-4">
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
      <ul className="list-disc pl-6 mb-4">
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
      <ul className="list-disc pl-6 mb-4">
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
    title: 'Children’s Privacy',
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
      <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:support@edustream.com" className="text-blue-600 underline">support@edustream.com</a>.</p>
    ),
  },
];

export default function PrivacyPolicy() {
  const [open, setOpen] = useState(Array(sections.length).fill(false));

  const toggle = (idx: number) => {
    setOpen(prev => prev.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-gray-900">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-6xl font-bold mb-2 text-center" style={{ color: '#6B46C1' }}>Privacy Policy</h1>
        <p className="mb-4 text-center font-bold">Last updated: January 20, 2026</p>
      </div>
      <div className="mb-8 text-lg text-gray-800">
        At EduStream, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data while you use our browser-based virtual classroom platform. Whether you're a teacher, student, or any other participant, we aim to provide a secure and transparent environment for learning.<br /><br />
        <p className="mb-1">
          At EduStream, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data while you use our browser-based virtual classroom platform. Whether you're a teacher, student, or any other participant, we aim to provide a secure and transparent environment for learning.
        </p>
        <div className="flex flex-col md:flex-row items-center gap-6 mb-1">
          <div className="flex-1">
            We respect your privacy rights and are dedicated to ensuring that any information you provide while using EduStream is handled with the utmost care and in accordance with applicable privacy laws. This policy explains what personal information we collect, how it is used, and the steps we take to protect your data.
          </div>
          <img
            src="/privacyphoto.png"
            alt="Privacy Policy Illustration"
            className="w-72 h-72 object-contain rounded-lg mt-2 md:mt-0"
          />
        </div>
        <p className="mb-1">
          By using EduStream, you agree to the collection and use of your information as described in this policy. If you have any questions or concerns about how we handle your data, please feel free to contact us.
        </p>
      </div>
      <div className="space-y-4">
        {sections.slice(1).map((section, idx) => (
          <div key={section.title}>
            <button
              className="flex items-center w-full justify-between text-left text-2xl font-semibold mt-8 mb-2 focus:outline-none"
              onClick={() => toggle(idx + 1)}
              aria-expanded={open[idx + 1]}
              aria-controls={`section-content-${idx + 1}`}
            >
              <span style={{ color: [1,3,5,7].includes(idx+1) ? '#6B46C1' : undefined }}>{section.title}</span>
              <span className="ml-2 text-3xl">{open[idx + 1] ? '−' : '+'}</span>
            </button>
            {open[idx + 1] && (
              <div id={`section-content-${idx + 1}`} className="pl-2 pt-2 animate-fade-in">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
