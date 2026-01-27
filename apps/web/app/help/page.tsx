"use client";
import React, { useState } from 'react';

// Common questions for auto-suggestions
const suggestions = [
  // How questions
  "How to create a room",
  "How to join a room", 
  "How to use video features",
  "How to share screen",
  "How to mute microphone",
  "How to use whiteboard",
  "How to send chat messages",
  "How to create polls",
  "How to manage participants",
  "How to record sessions",
  "How to troubleshoot connection issues",
  "How to get started",
  "How to contact support",
  "How do I create an account",
  "How do I join without an account",
  "How do I enable camera",
  "How do I change video quality",
  "How do I use breakout rooms",
  "How do I share my screen",
  "How do I mute participants",
  "How do I start recording",
  "How do I fix audio problems",
  "How do I access settings",
  "How do I leave a room",
  "How do I invite students",
  "How do I use the chat",
  "How do I draw on whiteboard",
  "How do I create quizzes",
  "How do I manage permissions",
  "How do I check system requirements",
  
  // What questions
  "What is EduStream",
  "What are the features",
  "What browsers are supported",
  "What is a room ID",
  "What are teacher controls",
  "What is screen sharing",
  "What is the whiteboard",
  "What are breakout rooms",
  "What is video quality",
  "What happens to my data",
  "What are the system requirements",
  "What is peer-to-peer",
  "What are the privacy settings",
  "What is the waiting room",
  "What are participant roles",
  
  // Why questions
  "Why can't I join a room",
  "Why is my video not working",
  "Why is my audio not working",
  "Why can't I share screen",
  "Why am I muted",
  "Why is the connection slow",
  "Why do I need permissions",
  "Why can't I access features",
  "Why is recording not working",
  "Why do I need an account",
  "Why is the room full",
  "Why can't I see participants",
  "Why is the whiteboard not loading",
  "Why do I need to wait",
  
  // Can/Is questions
  "Can I use without account",
  "Can students create rooms",
  "Is EduStream free",
  "Is my data secure",
  "Can I record sessions",
  "Is screen sharing private",
  "Can I use on mobile",
  "Is video encrypted",
  "Can I save whiteboard",
  "Is chat moderated",
  "Can I customize settings",
  "Is EduStream accessible",
  "Can I use multiple devices",
  "Is there a time limit",
  "Can I share files",
  
  // Other common questions
  "Getting started guide",
  "Video not working",
  "Audio not working",
  "Connection problems",
  "Permission denied",
  "Room not found",
  "Browser compatibility",
  "System requirements",
  "Privacy policy",
  "Contact support",
  "Troubleshooting guide",
  "Feature overview",
  "Account setup",
  "Room management"
];

// Question to answer mapping
const questionAnswers: { [key: string]: { title: string; content: React.ReactNode } } = {
  // How questions
  "How to create a room": {
    title: "Creating a Room",
    content: (
      <div>
        <p className="mb-4">To create a room in EduStream:</p>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>Log in to your teacher account</li>
          <li>Click "Create Room" from the dashboard</li>
          <li>Set room preferences (name, description, participant limits)</li>
          <li>Share the unique room ID with your students</li>
          <li>Start your session when ready</li>
        </ol>
        <p className="text-sm text-gray-600">Note: Only teachers with accounts can create rooms. Students can join existing rooms without accounts.</p>
      </div>
    )
  },
  "How to join a room": {
    title: "Joining a Room",
    content: (
      <div>
        <p className="mb-4">To join an EduStream room:</p>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>Go to the EduStream homepage</li>
          <li>Click "Join Room" and enter the room ID provided by your teacher</li>
          <li>Enter your name for identification</li>
          <li>Grant camera and microphone permissions when prompted</li>
          <li>Wait for the teacher to admit you into the room</li>
        </ol>
        <p className="text-sm text-gray-600">No account required for students to join rooms!</p>
      </div>
    )
  },
  "How to get started": {
    title: "Getting Started",
    content: (
      <div>
        <p className="mb-4">Welcome to EduStream! Getting started is easy:</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold mb-2">For Teachers:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Create an account to manage classrooms</li>
              <li>Set up rooms for your students</li>
              <li>Use teacher controls and features</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">For Students:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Join rooms directly with a room ID</li>
              <li>No account required</li>
              <li>Use all interactive features</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-gray-600">Make sure you have a modern web browser with camera and microphone access.</p>
      </div>
    )
  },
  "How do I create an account": {
    title: "Creating an Account",
    content: (
      <div>
        <p className="mb-4">To create a teacher account:</p>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>Go to the EduStream homepage</li>
          <li>Click "Sign Up" or "Create Account"</li>
          <li>Fill in your details (name, email, password)</li>
          <li>Verify your email address</li>
          <li>Log in and start creating rooms</li>
        </ol>
        <p className="text-sm text-gray-600">Teacher accounts allow you to create and manage virtual classrooms.</p>
      </div>
    )
  },
  "How do I join without an account": {
    title: "Joining Without an Account",
    content: (
      <div>
        <p className="mb-4">Students can join EduStream rooms without creating an account:</p>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>Get the room ID from your teacher</li>
          <li>Go to the EduStream homepage</li>
          <li>Click "Join Room"</li>
          <li>Enter the room ID and your name</li>
          <li>Wait for teacher approval to enter</li>
        </ol>
        <p className="text-sm text-gray-600">This makes it easy for students to quickly join classes without registration.</p>
      </div>
    )
  },
  "How do I enable camera": {
    title: "Enabling Camera",
    content: (
      <div>
        <p className="mb-4">To enable your camera in EduStream:</p>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>Grant camera permissions when prompted</li>
          <li>Look for the camera button (usually a video icon)</li>
          <li>Click to toggle camera on/off</li>
          <li>Check your browser settings if permissions are blocked</li>
        </ol>
        <p className="text-sm text-gray-600">Camera access is required for video conferencing features.</p>
      </div>
    )
  },
  "How to use video features": {
    title: "Video Features",
    content: (
      <div>
        <p className="mb-4">EduStream offers comprehensive video features:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Camera Control:</strong> Toggle video on/off with the camera button</li>
          <li><strong>Screen Sharing:</strong> Share your screen or specific applications</li>
          <li><strong>Quality Settings:</strong> Adjust video quality based on connection</li>
          <li><strong>Background Effects:</strong> Apply virtual backgrounds or blur</li>
        </ul>
        <p className="text-sm text-gray-600">All video is transmitted peer-to-peer for privacy and performance.</p>
      </div>
    )
  },
  "How to share screen": {
    title: "Screen Sharing",
    content: (
      <div>
        <p className="mb-4">To share your screen in EduStream:</p>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>Look for the screen share button (usually a monitor icon)</li>
          <li>Click to start screen sharing</li>
          <li>Choose to share your entire screen, a window, or a tab</li>
          <li>Click "Stop Sharing" when done</li>
        </ol>
        <p className="text-sm text-gray-600">Screen sharing is great for presentations and demonstrations.</p>
      </div>
    )
  },
  "How to mute microphone": {
    title: "Muting Microphone",
    content: (
      <div>
        <p className="mb-4">To control your microphone:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Click the microphone button to mute/unmute yourself</li>
          <li>Teachers can mute individual participants or all participants</li>
          <li>Use push-to-talk if available in your settings</li>
          <li>Check audio levels in settings</li>
        </ul>
        <p className="text-sm text-gray-600">Proper microphone management helps maintain a distraction-free learning environment.</p>
      </div>
    )
  },
  "How to contact support": {
    title: "Contacting Support",
    content: (
      <div>
        <p className="mb-4">Need help? Our support team is here for you:</p>
        <div className="bg-purple-50 p-4 rounded-lg mb-4">
          <p className="font-semibold mb-2">📧 Email Support</p>
          <p><a href="mailto:support@edustream.com" className="text-purple-600 underline">support@edustream.com</a></p>
          <p className="text-sm text-gray-600 mt-1">We typically respond within 24 hours</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="font-semibold mb-2">📚 Documentation</p>
          <p><a href="/docs" className="text-blue-600 underline">docs.edustream.com</a></p>
          <p className="text-sm text-gray-600 mt-1">Comprehensive guides and tutorials</p>
        </div>
      </div>
    )
  },

  // What questions
  "What is EduStream": {
    title: "What is EduStream?",
    content: (
      <div>
        <p className="mb-4">EduStream is a modern virtual classroom platform designed for interactive online learning. It combines:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Real-time Video:</strong> HD video conferencing with peer-to-peer technology</li>
          <li><strong>Interactive Tools:</strong> Whiteboard, chat, polls, and screen sharing</li>
          <li><strong>Easy Access:</strong> Students join without accounts, teachers manage with accounts</li>
          <li><strong>Privacy-Focused:</strong> No recordings stored, encrypted communications</li>
        </ul>
        <p className="text-sm text-gray-600">Perfect for schools, tutors, and educational institutions.</p>
      </div>
    )
  },
  "What are the features": {
    title: "EduStream Features",
    content: (
      <div>
        <p className="mb-4">EduStream offers comprehensive educational tools:</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">🎥 Video & Audio</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>HD video conferencing</li>
              <li>Screen sharing</li>
              <li>Background effects</li>
              <li>Audio controls</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">📝 Interactive Tools</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Collaborative whiteboard</li>
              <li>Real-time chat</li>
              <li>Polls and quizzes</li>
              <li>File sharing</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">👥 Management</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Teacher controls</li>
              <li>Breakout rooms</li>
              <li>Waiting room</li>
              <li>Participant management</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🔒 Security</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Encrypted connections</li>
              <li>Room passwords</li>
              <li>Access controls</li>
              <li>Privacy protection</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  "What browsers are supported": {
    title: "Browser Compatibility",
    content: (
      <div>
        <p className="mb-4">EduStream works best with modern browsers:</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold mb-2 text-green-600">✅ Recommended</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Chrome (latest)</li>
              <li>Firefox (latest)</li>
              <li>Safari (latest)</li>
              <li>Edge (latest)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-yellow-600">⚠️ Limited Support</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Older browser versions</li>
              <li>Internet Explorer</li>
              <li>Mobile browsers (limited features)</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-gray-600">For the best experience, keep your browser updated and enable camera/microphone permissions.</p>
      </div>
    )
  },
  "What are the system requirements": {
    title: "System Requirements",
    content: (
      <div>
        <p className="mb-4">EduStream has minimal system requirements:</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">💻 Minimum Requirements</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Modern web browser</li>
              <li>Stable internet connection</li>
              <li>Camera and microphone</li>
              <li>1GB RAM</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🚀 Recommended</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Chrome/Firefox latest</li>
              <li>5 Mbps internet speed</li>
              <li>HD camera</li>
              <li>4GB+ RAM</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4">No downloads or installations required - works directly in your browser!</p>
      </div>
    )
  },

  // Why questions
  "Why can't I join a room": {
    title: "Can't Join Room - Troubleshooting",
    content: (
      <div>
        <p className="mb-4">Common reasons you can't join a room:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Invalid Room ID:</strong> Double-check the room ID with your teacher</li>
          <li><strong>Room Full:</strong> The room may have reached its participant limit</li>
          <li><strong>Waiting for Approval:</strong> Teachers must admit participants</li>
          <li><strong>Room Ended:</strong> The session may have already finished</li>
          <li><strong>Network Issues:</strong> Check your internet connection</li>
        </ul>
        <p className="text-sm text-gray-600">If problems persist, contact your teacher or try refreshing the page.</p>
      </div>
    )
  },
  "Why is my video not working": {
    title: "Video Not Working - Solutions",
    content: (
      <div>
        <p className="mb-4">If your video isn't working:</p>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>Grant camera permissions when prompted</li>
          <li>Check if another application is using your camera</li>
          <li>Try refreshing the page</li>
          <li>Check your browser settings for camera access</li>
          <li>Try a different browser</li>
        </ol>
        <p className="text-sm text-gray-600">Make sure your camera isn't disabled in system settings.</p>
      </div>
    )
  },
  "Why is my audio not working": {
    title: "Audio Not Working - Solutions",
    content: (
      <div>
        <p className="mb-4">If your audio isn't working:</p>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>Grant microphone permissions when prompted</li>
          <li>Check if you're muted (look for the microphone icon)</li>
          <li>Test your microphone in browser settings</li>
          <li>Try a different audio device if available</li>
          <li>Check system sound settings</li>
        </ol>
        <p className="text-sm text-gray-600">Make sure your microphone isn't muted at the system level.</p>
      </div>
    )
  },
  "Why is the connection slow": {
    title: "Slow Connection - Solutions",
    content: (
      <div>
        <p className="mb-4">To improve connection performance:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Reduce Video Quality:</strong> Lower resolution in settings</li>
          <li><strong>Close Other Apps:</strong> Free up bandwidth and CPU</li>
          <li><strong>Check Internet Speed:</strong> Test your connection</li>
          <li><strong>Move Closer to Router:</strong> Improve WiFi signal</li>
          <li><strong>Use Ethernet:</strong> Wired connection if possible</li>
        </ul>
        <p className="text-sm text-gray-600">EduStream uses peer-to-peer connections, so all participants' connections affect performance.</p>
      </div>
    )
  },

  // Can/Is questions
  "Can I use without account": {
    title: "Using EduStream Without an Account",
    content: (
      <div>
        <p className="mb-4"><strong>Yes!</strong> Students can join EduStream rooms without creating an account.</p>
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <p className="font-semibold mb-2">For Students:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>No registration required</li>
            <li>Join with just a room ID and name</li>
            <li>Full access to all features</li>
            <li>Wait for teacher approval</li>
          </ul>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="font-semibold mb-2">For Teachers:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Account required to create rooms</li>
            <li>Manage participants and settings</li>
            <li>Access teacher-only features</li>
          </ul>
        </div>
      </div>
    )
  },
  "Is EduStream free": {
    title: "Is EduStream Free?",
    content: (
      <div>
        <p className="mb-4">EduStream offers a free tier with core features:</p>
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold mb-2">✅ Free Features</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Unlimited video conferencing</li>
            <li>Interactive whiteboard</li>
            <li>Chat and polls</li>
            <li>Screen sharing</li>
            <li>Breakout rooms</li>
          </ul>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">⭐ Premium Features</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Advanced analytics</li>
            <li>Custom branding</li>
            <li>Priority support</li>
            <li>Extended recordings</li>
          </ul>
        </div>
        <p className="text-sm text-gray-600 mt-4">Contact us for premium pricing and enterprise solutions.</p>
      </div>
    )
  },
  "Is my data secure": {
    title: "Data Security & Privacy",
    content: (
      <div>
        <p className="mb-4">EduStream takes your privacy seriously:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Peer-to-Peer:</strong> Video streams aren't stored on our servers</li>
          <li><strong>Encryption:</strong> All communications are encrypted</li>
          <li><strong>No Recordings:</strong> Sessions aren't automatically recorded</li>
          <li><strong>Minimal Data:</strong> Only room IDs and participant names stored</li>
          <li><strong>GDPR Compliant:</strong> Follows privacy regulations</li>
        </ul>
        <p className="text-sm text-gray-600">Read our full privacy policy for complete details.</p>
      </div>
    )
  }
};

const helpCategories = [
  {
    title: 'Getting Started',
    icon: '🚀',
    description: 'Learn the basics of using EduStream'
  },
  {
    title: 'Video & Audio',
    icon: '🎥',
    description: 'Camera, microphone, and streaming features'
  },
  {
    title: 'Interactive Tools',
    icon: '📝',
    description: 'Whiteboard, chat, polls, and collaboration'
  },
  {
    title: 'Teacher Controls',
    icon: '👨‍🏫',
    description: 'Managing classrooms and participants'
  },
  {
    title: 'Troubleshooting',
    icon: '🔧',
    description: 'Fix common issues and problems'
  },
  {
    title: 'Contact Support',
    icon: '💬',
    description: 'Get help from our support team'
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [reviewResponse, setReviewResponse] = useState<boolean | null>(null);
  const [showReview, setShowReview] = useState(false);

  // Filter suggestions based on search query
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase()) && 
    searchQuery.length > 0 &&
    questionAnswers[suggestion]
  );

  const handleSuggestionClick = (suggestion: string) => {
    if (questionAnswers[suggestion]) {
      setSelectedQuestion(suggestion);
      setSearchQuery('');
      setShowSuggestions(false);
      setReviewResponse(null);
      setShowReview(true);
    }
  };

  const handleBackToHelp = () => {
    setSelectedQuestion(null);
    setSearchQuery('');
    setReviewResponse(null);
    setShowReview(false);
  };

  return (
    <main className="min-h-screen flex flex-col">
      {selectedQuestion && questionAnswers[selectedQuestion] ? (
        // Answer View - Regular layout
        <div className="max-w-3xl mx-auto px-4 py-12 w-full">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBackToHelp}
              className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Help Center
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-bold mb-6" style={{ color: '#6B46C1' }}>
              {questionAnswers[selectedQuestion].title}
            </h1>
            <div className="prose prose-lg max-w-none">
              {questionAnswers[selectedQuestion].content}
            </div>
          </div>

          {showReview && (
            <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
              <div className="text-center">
                {reviewResponse === null ? (
                  <>
                    <div className="mb-4">
                      <span className="text-2xl">🤔</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Was this answer helpful?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Help us improve our help center!
                    </p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => setReviewResponse(true)}
                        className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all transform hover:scale-105 shadow-md"
                      >
                        <span className="text-lg">👍</span>
                        Yes, helpful!
                      </button>
                      <button
                        onClick={() => setReviewResponse(false)}
                        className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 shadow-md"
                      >
                        <span className="text-lg">👎</span>
                        Not really
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="animate-fade-in">
                    <div className="mb-4">
                      <span className="text-3xl">{reviewResponse ? '🎉' : '💡'}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {reviewResponse ? 'Thanks for the feedback!' : 'Thanks for letting us know!'}
                    </h3>
                    <p className="text-gray-600">
                      {reviewResponse 
                        ? 'We\'re glad we could help! 😊' 
                        : 'We\'ll work on making this better. 📈'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Main Help Center - Full screen centered layout
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50 px-4 py-16">
          <div className="w-full max-w-4xl">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-6xl md:text-7xl font-bold mb-4" style={{ color: '#6B46C1' }}>
                Help Center
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 font-medium">
                How can we help you?
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="mb-16">
              <div className="max-w-2xl mx-auto relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for help topics..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full px-6 py-4 pl-14 pr-6 text-lg text-gray-900 bg-white border-2 border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg hover:shadow-xl transition-shadow"
                  />
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* Suggestions Dropdown */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl max-h-80 overflow-y-auto">
                    {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-6 py-4 text-left hover:bg-purple-50 focus:bg-purple-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span className="text-gray-700 font-medium">{suggestion}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Help Categories */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpCategories.map((category, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-200"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{category.title}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              ))}
            </div>

            {/* Bottom Text */}
            <div className="text-center mt-16">
              <p className="text-gray-600 text-lg mb-3">
                Can't find what you're looking for?
              </p>
              <a 
                href="mailto:support@edustream.com"
                className="inline-flex items-center text-purple-600 hover:text-purple-800 font-semibold text-lg transition-colors"
              >
                Contact our support team
                <svg className="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}