"use client";

import React from 'react';
import Image from 'next/image';
import { ShoppingCart, BookOpen, ChevronRight } from 'lucide-react';

const ProjectForecastCarousel = () => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const projectCards = [
    {
      title: "Seasonal Projects and Inspiration",
      description: "Refresh your home for the coming season.",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/219f4c1e-c48f-4841-873e-2f80d1aa9560-lowes-com/assets/images/weather-widget-brunch-at-home-8.png",
      cta: "Shop Now",
      ctaType: "shop",
      link: "#"
    },
    {
      title: "How to Use a Portable Generator",
      description: "Stay warm and cozy for winter.",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/219f4c1e-c48f-4841-873e-2f80d1aa9560-lowes-com/assets/images/DP18-135131-NPC-HT-UseaPortableGenerator-AH-4.jpg",
      cta: "Read Article",
      ctaType: "read",
      link: "#"
    },
    {
      title: "Stay warm and cozy for winter.",
      description: "Find all you need this season.",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/219f4c1e-c48f-4841-873e-2f80d1aa9560-lowes-com/assets/images/weather-widget-brunch-at-home-8.png", // Reusing fallback since it's a winter theme
      cta: "Shop Now",
      ctaType: "shop",
      link: "#"
    },
    {
      title: "How to Replace a Doorbell Button in 6 Easy Steps",
      description: "Make their house a home.",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/219f4c1e-c48f-4841-873e-2f80d1aa9560-lowes-com/assets/images/how-to-replace-a-doorbell-button-in-6-easy-steps-h-6.png",
      cta: "Read Article",
      ctaType: "read",
      link: "#"
    },
    {
      title: "The perfect housewarming gifts.",
      description: "Make their house a home.",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/219f4c1e-c48f-4841-873e-2f80d1aa9560-lowes-com/assets/images/weather-widget-house-warming-gifts-7.png",
      cta: "Shop Now",
      ctaType: "shop",
      link: "#"
    }
  ];

  return (
    <section className="w-full bg-white py-6 md:py-8 font-display">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#004990] text-[20px] md:text-[24px] font-bold tracking-tight">
            Your Project Forecast
          </h2>
        </div>

        <div className="relative group">
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 scrollbar-hide snap-x snap-mandatory no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {projectCards.map((card, index) => (
              <div 
                key={index}
                className="flex-none w-[280px] md:w-[252px] snap-start border border-[#E0E0E0] rounded-[8px] overflow-hidden flex flex-col h-full bg-white shadow-sm"
              >
                {/* Image Placeholder/Container */}
                <div className="relative h-[160px] w-full bg-[#f5f7f8]">
                    <Image 
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 280px, 252px"
                    />
                </div>

                <div className="p-4 flex flex-col flex-grow min-h-[160px] justify-between">
                  <div>
                    <h3 className="text-[#222222] text-[16px] font-bold leading-tight mb-2 min-h-[38px] line-clamp-2">
                      {card.title}
                    </h3>
                    <p className="text-[#757575] text-[14px] leading-snug line-clamp-2 mb-4">
                      {card.description}
                    </p>
                  </div>

                  <a 
                    href={card.link}
                    className="mt-auto flex items-center justify-center gap-2 border border-[#0076CE] text-[#0076CE] py-[8px] px-4 rounded-[4px] text-[14px] font-bold hover:bg-[#F5F7F8] transition-colors"
                  >
                    {card.ctaType === 'shop' ? (
                      <ShoppingCart className="w-4 h-4" />
                    ) : (
                      <BookOpen className="w-4 h-4" />
                    )}
                    {card.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Navigation - Mobile Scroll Arrows */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-[-12px] top-1/2 -translate-y-1/2 bg-white border border-[#E0E0E0] rounded-full p-2 shadow-lg z-10 hidden md:flex items-center justify-center hover:bg-gray-50"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-[#0076CE]" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ProjectForecastCarousel;