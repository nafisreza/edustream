"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ServicesCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const services = [
    {
      name: "Meeting",
      image: "/meeting.jpg",
      alt: "Meeting",
    },
    {
      name: "Online Classroom",
      image: "/online classroom.png",
      alt: "Online Classroom",
    },
    {
      name: "Whiteboard",
      image: "/whiteboard.png",
      alt: "Whiteboard",
    },
    {
      name: "Recap",
<<<<<<< HEAD
      image: "/recap.jpg",
      alt: "Recap",
    },
    {
      name: "Chat",
      image: "/chat.png",
      alt: "Chat",
    },
=======
      image: "/recap.webp",
      alt: "Recap",
    },
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f
  ];

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const cardWidth = container.offsetWidth > 640 ? 400 : 320; // Responsive card width
    const gap = 24; // gap-6 = 24px
    const scrollAmount = cardWidth + gap;

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const cardWidth = container.offsetWidth > 640 ? 400 : 320;
    const gap = 24;
    const scrollPosition = index * (cardWidth + gap);

    container.scrollTo({ left: scrollPosition, behavior: "smooth" });
  };

  // Update active index based on scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateActiveIndex = () => {
      const cardWidth = container.offsetWidth > 640 ? 400 : 320;
      const gap = 24;
      const scrollLeft = container.scrollLeft;
      const index = Math.round(scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(index, services.length - 1));
    };

    container.addEventListener("scroll", updateActiveIndex);
    updateActiveIndex(); // Initial update

    return () => {
      container.removeEventListener("scroll", updateActiveIndex);
    };
  }, [services.length]);

  return (
<<<<<<< HEAD
    <div className="relative overflow-visible">
=======
    <div className="relative">
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f
      {/* Left Scroll Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute -left-4 sm:-left-6 lg:-left-8 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg border border-gray-200 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-6 w-6 text-[#6B46C1]" />
      </button>

      {/* Scrollable Cards Container */}
      <div
        ref={scrollContainerRef}
<<<<<<< HEAD
        className="overflow-x-auto overflow-y-visible scrollbar-hide pb-4 pt-2 snap-x snap-mandatory scroll-smooth px-2"
=======
        className="overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth px-2"
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f
      >
        <div className="flex gap-6 min-w-max">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex-shrink-0 w-[320px] sm:w-[400px] rounded-2xl overflow-hidden relative group cursor-pointer snap-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/90 via-black/50 to-transparent" />
              <div className="absolute top-4 left-4 z-20">
                <h3 className="text-3xl font-bold text-white drop-shadow-lg">
                  {service.name}
                </h3>
              </div>
              <div className="aspect-[4/3] relative">
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Scroll Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute -right-4 sm:-right-6 lg:-right-8 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg border border-gray-200 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-6 w-6 text-[#6B46C1]" />
      </button>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
<<<<<<< HEAD
        {[0, 1, 2].map((dotIndex) => {
          // Map dot indices to service indices (0, 2, 4 for 5 services)
          const serviceIndex = dotIndex === 0 ? 0 : dotIndex === 1 ? 2 : 4;
          return (
            <button
              key={dotIndex}
              onClick={() => scrollToIndex(serviceIndex)}
              className={`w-2 h-2 rounded-full transition-colors ${
                serviceIndex === activeIndex
                  ? "bg-white"
                  : "bg-white/50 border-2 border-white/70 hover:border-white"
              }`}
              aria-label={`Go to slide ${serviceIndex + 1}`}
            />
          );
        })}
=======
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === activeIndex
                ? "bg-[#6B46C1]"
                : "bg-white border-2 border-gray-300 hover:border-[#6B46C1]"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f
      </div>
    </div>
  );
}
