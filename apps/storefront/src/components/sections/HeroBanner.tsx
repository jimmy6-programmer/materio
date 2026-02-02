import React from 'react';
import Image from 'next/image';

/**
 * HeroBanner Component
 * 
 * Clones the high-contrast dark blue hero section featuring "December Deal Drops" branding,
 * promotional copy, and a "Shop Now" call-to-action button.
 * 
 * Theme: Light (Styles based on Light theme requirement)
 */
const HeroBanner: React.FC = () => {

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <section 
      className="relative w-full overflow-hidden bg-[#004990]"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 73, 144, 0.95), rgba(0, 51, 102, 1))',
        minHeight: '240px',
      }}
    >
      {/* Decorative Stars/Sparkles - replicating the visual treatment in the screenshot */}
      <div className="absolute top-8 right-[15%] opacity-60">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M12 0l3 9h9l-7 5 3 10-8-6-8 6 3-10-7-5h9z" />
        </svg>
      </div>
      <div className="absolute bottom-12 right-[10%] opacity-40 scale-75">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M12 0l3 9h9l-7 5 3 10-8-6-8 6 3-10-7-5h9z" />
        </svg>
      </div>
      <div className="absolute top-20 right-[5%] opacity-50 scale-50">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M12 0l3 9h9l-7 5 3 10-8-6-8 6 3-10-7-5h9z" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          
          {/* Logo/Branding Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="relative mb-2">
              {/* House/Roof outline decoration for the logo */}
              <div className="mb-[-10px] ml-[-4px]">
                <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 35 L40 5 L140 5 L180 35" stroke="white" strokeWidth="3" fill="none" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span 
                  className="text-[2.25rem] md:text-[2.75rem] font-bold text-white leading-none tracking-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {currentMonth}
                </span>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-[1.8rem] md:text-[2.2rem] font-bold text-[#C8102E] uppercase"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    DEAL
                  </span>
                  <span 
                    className="text-[1.8rem] md:text-[2.2rem] font-bold text-white uppercase"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Drops
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Copy and CTA Section */}
          <div className="flex flex-col items-center text-center max-w-2xl">
            <h1 
              className="text-white text-[2.25rem] md:text-[3rem] font-bold mb-4 leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Get deals on last-minute gifts.
            </h1>
            <p className="text-white text-[0.875rem] md:text-[1rem] font-normal mb-8 max-w-lg leading-relaxed opacity-90">
              Order online from everywhere <span className="font-bold">in Rwanda</span> and choose in-store pickup or same-day delivery.
            </p>
            
            <a 
              href="products-list"
              className="bg-white text-[#004990] hover:bg-gray-100 transition-colors duration-200 px-10 py-3 rounded-[4px] font-semibold text-[1rem] shadow-md"
            >
              Shop Now
            </a>
          </div>

          {/* Gift Box Graphic Placeholder - As seen in the right side of hero */}
          <div className="hidden lg:block relative w-[250px] h-[180px]">
             <div className="absolute bottom-0 right-0 w-[180px] h-[140px] bg-[#0076CE] rounded-sm transform rotate-[-2deg]">
                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-full h-[20px] bg-[#004990] opacity-50"></div>
                {/* Visual representation of a lid/box ribbon */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[30px] bg-white/20"></div>
             </div>
             <div className="absolute bottom-4 left-0 w-[120px] h-[100px] bg-[#28823F] rounded-sm transform rotate-[5deg] shadow-lg">
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[20px] bg-white/20"></div>
             </div>
          </div>
        </div>

        {/* Bottom Small Text Notification */}
        <div className="mt-12 text-center">
            <p className="text-white/80 text-[0.75rem] font-medium tracking-wide">
                Get your orders anytime at <span className="font-bold">Materio Rwanda.</span>
            </p>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;