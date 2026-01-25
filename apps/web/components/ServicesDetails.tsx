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
      "Unify how teams connect: High-quality video, audio, and screen sharing are all in one platform, so communication feels seamless.",
      "Consolidate your tools: Replace scattered apps with an all-in-one solution that saves time, reduces costs, and keeps work in sync.",
      "Support hybrid and remote learning: Keep even global classrooms engaged with reliable video conferencing and interactive features.",
      "Keep workflows moving: From lectures to Q&A sessions to quick check-ins, EduStream helps educators cut friction and avoid lessons stalling.",
      "Do more with AI: Built-in AI summarizes sessions, drafts follow-ups, and shares next steps, so your team spends more time teaching.",
    ],
  },
  {
    id: "online-classroom",
    name: "Online Classroom",
    image: "/onlineclassroom_services_details.png",
    description:
      "A comprehensive virtual classroom solution designed for education, featuring real-time video, interactive tools, breakout rooms, and complete teacher control.",
    features: [
      "Virtual classroom environment: Create dedicated spaces for your classes with persistent rooms and organized sessions.",
      "Interactive learning tools: Engage students with polls, quizzes, hand raising, and real-time feedback mechanisms.",
      "Breakout rooms: Facilitate group work and discussions with easy-to-manage breakout rooms for collaborative learning.",
      "Attendance tracking: Monitor student participation and attendance automatically with detailed analytics.",
      "Recording and playback: Record sessions for students who miss class or need to review material later.",
    ],
  },
  {
    id: "whiteboard",
    name: "Whiteboard",
    image: "/whiteboard_services_details.png",
    description:
      "Interactive digital whiteboard for collaborative learning, featuring drawing tools, shapes, text, and real-time collaboration for teachers and students.",
    features: [
      "Real-time collaboration: Multiple users can draw, write, and annotate simultaneously on the same canvas.",
      "Rich drawing tools: Use pens, markers, shapes, text, and colors to create engaging visual content.",
      "Save and share: Save whiteboard sessions and share them with students for review and reference.",
      "Template library: Access pre-made templates for common educational scenarios and lesson plans.",
      "Integration: Seamlessly integrate whiteboard sessions with your video meetings and classroom recordings.",
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
                activeService.id === service.id
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
              {activeService.description}
            </p>
            <ul className="space-y-4">
              {activeService.features.map((feature, index) => (
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
              src={activeService.image}
              alt={activeService.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
