import React from 'react';

export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last updated: January 20, 2026</p>
      <p className="mb-4">
        EduStream ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our virtual classroom platform.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
      <ul className="list-disc pl-6 mb-4">
        <li><b>Account Information:</b> Teachers may create accounts. Students can join rooms without accounts, but may provide a name for identification.</li>
        <li><b>Room Data:</b> Room IDs, participant names, and roles (Teacher/Student) are stored for session management.</li>
        <li><b>Audio/Video Data:</b> Media streams are transmitted peer-to-peer using WebRTC and are <b>not recorded or stored</b> by EduStream servers.</li>
        <li><b>Chat & Whiteboard:</b> Messages and whiteboard data are transmitted in real-time and may be stored temporarily for session continuity.</li>
        <li><b>Technical Data:</b> Browser type, device information, and connection logs for troubleshooting and analytics.</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>To provide and maintain the EduStream platform.</li>
        <li>To manage rooms, participants, and roles.</li>
        <li>To improve user experience and platform security.</li>
        <li>To comply with legal obligations.</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-2">3. Data Sharing & Disclosure</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>We do <b>not</b> sell or rent your personal information.</li>
        <li>We may share data with service providers (e.g., database, analytics) strictly for platform operation.</li>
        <li>We may disclose information if required by law or to protect our rights.</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-2">4. Data Security</h2>
      <p className="mb-4">We use industry-standard security measures to protect your data. Peer-to-peer media streams are encrypted via WebRTC. Account and room data are stored securely.</p>
      <h2 className="text-2xl font-semibold mt-8 mb-2">5. Children’s Privacy</h2>
      <p className="mb-4">EduStream is designed for educational use. We do not knowingly collect personal information from children under 13 without parental consent.</p>
      <h2 className="text-2xl font-semibold mt-8 mb-2">6. Changes to This Policy</h2>
      <p className="mb-4">We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</p>
      <h2 className="text-2xl font-semibold mt-8 mb-2">7. Contact Us</h2>
      <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:support@edustream.com" className="text-blue-600 underline">support@edustream.com</a>.</p>
    </main>
  );
}
