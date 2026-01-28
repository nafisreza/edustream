"use client";

import { useState, useRef } from "react";
import Image from "next/image";

const customerStories = [
  {
    id: 1,
    image: "/customer_journey_1.PNG",
    title: "Tutors create interactive learning sessions online",
    subtitle:
      "With real-time video, interactive whiteboards, and faster communication, EduStream allows tutors to explain concepts clearly and engage students as if they were in the same room.",
  },
  {
    id: 2,
    image: "/customer_journey_2.PNG",
    title: "Universities streamline virtual lectures with EduStream",
    subtitle:
      "Teachers deliver real-time online lectures with full classroom control—no interruptions, no distractions, all in the browser.",
  },
  {
    id: 3,
    image: "/customer_journey_3.PNG",
    title: "Schools maintain discipline and engagement in virtual classroom",
    subtitle:
      "EduStream helps schools run structured online classes with strict role management, approval-based entry, and teacher-only controls ensuring students stay attentive and learning stays uninterrupted.",
  },
  {
    id: 4,
    image: "/customer_journey_4.png",
    title: "Students revisit lessons through shared whiteboards",
    subtitle:
      "Teachers review concepts and diagrams in real time using collaborative whiteboards, helping students quickly recap and clarify topics.",
  },
];

export default function CustomerJourney() {
  const [hoveredId, setHoveredId] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="text-black">Smarter classrooms.</span>
              <br />
              <span className="text-[#6B46C1]">Built for every learning journey.</span>
            </h2>
        </div>

        {/* Cards Container */}
        <div 
          ref={containerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth px-2"
          onMouseLeave={() => {
            // Keep one card open at all times - default to first card if leaving container
            setHoveredId(1);
          }}
        >
          {customerStories.map((story) => {
            const isHovered = hoveredId === story.id;
            const hasOtherHover = hoveredId !== story.id;

            return (
              <div
                key={story.id}
                className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer snap-center transition-all duration-500 ease-in-out"
                style={{
                  width: isHovered 
                    ? "min(640px, 60vw)" 
                    : hasOtherHover 
                    ? "min(160px, 12vw)" 
                    : "min(260px, 22vw)",
                  minWidth: isHovered 
                    ? "min(640px, 60vw)" 
                    : hasOtherHover 
                    ? "min(120px, 10vw)" 
                    : "min(220px, 18vw)",
                  height: "500px",
                }}
                onMouseEnter={() => setHoveredId(story.id)}
                onTouchStart={() => {
                  // For mobile: ensure one card is always open
                  setHoveredId(story.id);
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out"
                    style={{
                      transform: isHovered ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                </div>

                {/* Gradient Overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 transition-opacity duration-500 ease-in-out md:opacity-30"
                  style={{
                    opacity: isHovered ? 1 : undefined,
                  }}
                />

                {/* Content */}
                <div
                  className={`absolute inset-0 flex flex-col justify-end p-6 sm:p-8 text-white transition-opacity duration-500 ease-in-out md:opacity-0 ${
                    isHovered ? "md:opacity-100" : ""
                  }`}
                >
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 leading-tight">
                    {story.title}
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed max-w-2xl">
                    {story.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
