"use client";

import { useState } from "react";
import Image from "next/image";

const services = [
  {
    id: "meeting",
    name: "Meeting",
    image: "/meeting_services_details.png",
    description:
      "AI-first video conferencing for team collaboration lets you work together without friction using high-quality video, audio, and screen sharing, all built into EduStream.",
    features: [
      "Unify how teams connect: High-quality video, audio, and screen sharing are all in one platform, so communication feels seamless and natural.",
      "Consolidate your tools: Replace scattered apps with an all-in-one solution that saves time, reduces costs, and keeps work in sync across all devices.",
      "Support hybrid and remote learning: Keep even global classrooms engaged with reliable video conferencing and interactive features that bridge distances.",
      "Keep workflows moving: From lectures to Q&A sessions to quick check-ins, EduStream helps educators cut friction and avoid lessons stalling unexpectedly.",
      "Do more with AI: Built-in AI summarizes sessions, drafts follow-ups, and shares next steps automatically, so your team spends more time teaching effectively.",
    ],
  },
  {
    id: "online-classroom",
    name: "Online Classroom",
    image: "/onlineclassroom_services_details.png",
    description:
      "A comprehensive virtual classroom solution designed for education, featuring real-time video, interactive tools, breakout rooms, and complete teacher control.",
    features: [
      "Virtual classroom environment: Create dedicated spaces for your classes with persistent rooms and organized sessions that students can access easily.",
      "Interactive learning tools: Engage students with polls, quizzes, hand raising, and real-time feedback mechanisms that make learning more dynamic.",
      "Breakout rooms: Facilitate group work and discussions with easy-to-manage breakout rooms for collaborative learning and peer interaction.",
      "Attendance tracking: Monitor student participation and attendance automatically with detailed analytics that help you understand engagement patterns.",
      "Recording and playback: Record sessions for students who miss class or need to review material later, ensuring no one falls behind.",
    ],
  },
  {
    id: "whiteboard",
    name: "Whiteboard",
    image: "/whiteboard_services_details.png",
    description:
      "Interactive digital whiteboard for collaborative learning, featuring drawing tools, shapes, text, and real-time collaboration for teachers and students.",
    features: [
      "Real-time collaboration: Multiple users can draw, write, and annotate simultaneously on the same canvas, making group work seamless and interactive.",
      "Rich drawing tools: Use pens, markers, shapes, text, and colors to create engaging visual content that enhances understanding and retention.",
      "Save and share: Save whiteboard sessions and share them with students for review and reference, creating a valuable learning resource library.",
      "Template library: Access pre-made templates for common educational scenarios and lesson plans that save time and improve consistency.",
      "Integration: Seamlessly integrate whiteboard sessions with your video meetings and classroom recordings for a complete learning experience.",
    ],
  },
  {
    id: "chat",
    name: "Chat",
    image: "/chat_services_details.png",
    description:
      "Real-time messaging platform for seamless text-based communication between teachers and students during and outside class sessions.",
    features: [
      "Real-time messaging: Instant text communication that keeps conversations flowing smoothly during live sessions and beyond the classroom.",
      "Message history: Access complete chat logs and conversation history for review and reference at any time, ensuring important information is never lost.",
      "File sharing: Share documents, images, and other educational materials directly through the chat interface, making collaboration effortless.",
      "Private and group chats: Support both one-on-one conversations and group discussions for flexible communication that adapts to different needs.",
      "Notifications: Stay informed with smart notifications that alert you to important messages without disrupting your workflow or teaching time.",
    ],
  },
  {
    id: "recap",
    name: "Recap",
    image: "/recording_services_details.png",
    description:
      "Record sessions and get AI-powered summaries that capture key moments and insights for better learning outcomes and improved student success.",
    features: [
      "High-quality recording: Capture video, audio, and screen sharing with professional-grade quality that ensures every detail is preserved clearly.",
      "AI summaries: Get instant AI-generated summaries of key points and important moments that help students quickly understand session highlights.",
      "Smart playback: Navigate recordings with chapter markers and searchable transcripts that make finding specific content fast and efficient.",
      "Meeting insights: Track attendance and participation metrics to understand student engagement and identify areas that need more attention.",
      "Easy sharing: Share recordings and recaps with students instantly, ensuring everyone has access to learning materials whenever they need them.",
    ],
  },
];

export default function ServicesDetails() {
  const [activeService, setActiveService] = useState(services[0]);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title and Subtext */}
        <div className="mx-auto max-w-4xl text-center mb-12">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="text-black">Built for education.</span>
              <br />
              <span className="text-[#6B46C1]">EduStream keeps learning connected.</span>
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 sm:text-xl leading-relaxed">
              A lightweight virtual classroom built for education, featuring real-time video,
              <br className="hidden sm:block" />
              interactive tools, and complete teacher control, without downloads or distractions.
            </p>
          </div>
        </div>

        {/* Service Tabs */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveService(service)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeService?.id === service.id
                  ? "bg-[#6B46C1] text-white border-2 border-[#6B46C1]"
                  : "bg-white text-gray-700 border-2 border-gray-300 hover:border-[#6B46C1] hover:text-[#6B46C1]"
              }`}
            >
              {service.name}
            </button>
          ))}
        </div>

        {/* Service Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              {activeService?.description}
            </p>
            <ul className="space-y-4">
              {activeService?.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-[#6B46C1] mt-1">•</span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <button className="inline-flex h-12 items-center justify-center rounded-lg bg-[#6B46C1] px-8 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#5B21B6]">
                Get started
              </button>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={activeService?.image || ""}
              alt={activeService?.name || "Service"}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
