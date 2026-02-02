"use client";

import React, { useState } from "react";
import { Tag, X } from "lucide-react";

/**
 * FloatingCTA Component
 *
 * A sticky bottom-left floating blue CTA banner that mimics the Materio promotional tab.
 * It contains a tag icon, promotional text, and a close button.
 *
 * Design matches:
 * - Primary Navy (#004990) and Action Blue (#0076CE) color scheme.
 * - Rounded corners (4px - 8px).
 * - High legibility typography (Inter/Sans-serif).
 * - Responsive placement (fixed at bottom-left).
 */
const FloatingCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex items-stretch overflow-hidden rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      {/* Light Blue Tag Section */}
      <div 
        className="flex items-center justify-center bg-[#0076CE] px-3 md:px-4"
        style={{ backgroundColor: "#0076CE" }}
      >
        <Tag className="h-6 w-6 text-white" aria-hidden="true" />
      </div>

      {/* Main Navy Content Section */}
      <div 
        className="relative flex flex-col justify-center bg-[#004990] py-2.5 pl-4 pr-12 text-white sm:py-3"
        style={{ backgroundColor: "#004990" }}
      >
        <div className="flex flex-col">
          <span className="text-[14px] font-bold leading-tight md:text-[16px]">
            Get up to $5 off $50
          </span>
          <span className="text-[11px] font-normal leading-tight opacity-90 md:text-[12px]">
            when you sign up for Text Messaging
          </span>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 transition-colors hover:bg-white/10"
          aria-label="Close promotion"
        >
          <X className="h-4 w-4 text-white" />
        </button>
      </div>

      {/* Optional: clickable overlay logic could be added to the entire container if it's meant to be a link */}
      <a 
        href="#" 
        className="absolute inset-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0076CE]"
        aria-label="Sign up for Text Messaging to get up to $5 off $50"
      >
        <span className="sr-only">Get up to $5 off $50 when you sign up for Text Messaging</span>
      </a>
    </div>
  );
};

export default FloatingCTA;