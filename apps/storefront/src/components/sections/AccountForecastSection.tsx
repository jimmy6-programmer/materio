import React from 'react';
import Image from 'next/image';
import { Sun, Cloud, User, Gift, Truck, FileText, ShoppingCart, ChevronRight, ChevronLeft } from 'lucide-react';

const AccountForecastSection = () => {
  return (
    <section className="container mx-auto px-4 py-8 max-w-[1440px]">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Widget: Shop. Earn. Save. */}
        <div className="w-full lg:w-1/3 flex flex-col bg-[#002f6c] rounded-lg overflow-hidden border border-[#e0e0e0]">
          {/* Tabs */}
          <div className="flex bg-[#004990] text-white text-sm font-semibold">
            <button className="flex-1 py-3 text-center border-b-2 border-white">Personal</button>
            <button className="flex-1 py-3 text-center border-b-2 border-transparent opacity-70 hover:opacity-100">Business</button>
          </div>
          
          <div className="p-8 flex flex-col items-center justify-center flex-grow text-white">
            <h3 className="text-[24px] font-bold mb-2">Shop. Earn. Save.</h3>
            <p className="text-[14px] mb-8 opacity-90">Account benefits now include:</p>
            
            <ul className="w-full space-y-5 mb-10">
              <li className="flex items-start gap-4">
                <div className="bg-[#0076ce] p-1.5 rounded-sm">
                  <span className="text-[12px] font-bold italic">P</span>
                </div>
                <span className="text-[14px]">Points on every eligible dollar.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-[#0076ce] p-1.5 rounded-sm">
                  <Gift size={16} />
                </div>
                <span className="text-[14px]">Members-only free gifts and offers.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-[#0076ce] p-1.5 rounded-sm">
                  <Truck size={16} />
                </div>
                <span className="text-[14px]">Free Standard Shipping starting with Silver Key Status.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-[#0076ce] p-1.5 rounded-sm">
                  <FileText size={16} />
                </div>
                <span className="text-[14px]">Track in-store and online purchase history.</span>
              </li>
            </ul>
            
            <a 
              href="#" 
              className="w-full bg-white text-[#004990] text-center py-3 rounded-md font-bold text-[16px] hover:bg-gray-100 transition-colors"
            >
              Sign In or Create Account
            </a>
          </div>
        </div>

        {/* Right Section: Forecast and Ideas */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Weather Widget */}
            <div className="flex-grow bg-[#001e44] rounded-lg p-6 text-white border border-[#e0e0e0]">
              <h4 className="text-[18px] font-bold mb-4">Weather Forecast Near Your Store</h4>
              <div className="flex justify-between items-center text-center">
                {/* Today */}
                <div className="flex flex-col items-center bg-[#003366] rounded-md p-3 px-6 border-l-4 border-[#0076ce]">
                  <span className="text-[12px] font-semibold mb-2 underline">Today</span>
                  <Sun size={32} className="mb-2 text-[#0076ce]" />
                  <div className="text-[14px] flex flex-col">
                    <span>Hi: 51°</span>
                    <span className="opacity-80">Lo: 28°</span>
                  </div>
                </div>
                {/* Tue */}
                <div className="flex flex-col items-center p-3">
                  <span className="text-[12px] font-semibold mb-2">Tue</span>
                  <Cloud size={32} className="mb-2" />
                  <div className="text-[14px] flex flex-col">
                    <span>Hi: 64°</span>
                    <span className="opacity-80">Lo: 36°</span>
                  </div>
                </div>
                {/* Wed */}
                <div className="flex flex-col items-center p-3">
                  <span className="text-[12px] font-semibold mb-2">Wed</span>
                  <Sun size={32} className="mb-2" />
                  <div className="text-[14px] flex flex-col">
                    <span>Hi: 68°</span>
                    <span className="opacity-80">Lo: 45°</span>
                  </div>
                </div>
                {/* Thu */}
                <div className="flex flex-col items-center p-3">
                  <span className="text-[12px] font-semibold mb-2">Thu</span>
                  <Sun size={32} className="mb-2" />
                  <div className="text-[14px] flex flex-col">
                    <span>Hi: 69°</span>
                    <span className="opacity-80">Lo: 48°</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inspiration Widget */}
            <div className="w-full md:w-2/5 bg-[#f5f7f8] rounded-lg p-6 border border-[#e0e0e0]">
              <h4 className="text-[#28823f] text-[14px] font-bold mb-2">Explore Ideas, Tips & Inspiration</h4>
              <p className="text-[13px] text-[#222222] leading-relaxed mb-4">
                Upgrade your indoor and outdoor spaces with stylish ideas, DIY tips, and seasonal inspiration. From fresh looks to bold projects, transform every corner of your home with Lowe&apos;s.
              </p>
              <a href="#" className="text-[#0076ce] text-[13px] font-bold underline flex items-center gap-1">
                Get Inspired
              </a>
            </div>
          </div>

          {/* Project Forecast Carousel/Grid */}
          <div className="relative">
            <h4 className="border-t border-[#e0e0e0] pt-6 text-[18px] font-bold text-[#004990] mb-4">Your Project Forecast</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Card 1 */}
              <div className="bg-white border border-[#e0e0e0] rounded-lg p-5 flex flex-col h-full">
                <div className="flex-grow">
                  <h5 className="text-[14px] font-bold mb-2">Seasonal Projects and Inspiration</h5>
                  <p className="text-[12px] text-gray-600 mb-4">Refresh your home for the coming season.</p>
                </div>
                <a href="#" className="flex items-center justify-center gap-2 border border-[#0076ce] text-[#0076ce] text-[12px] font-bold py-2 rounded mt-auto hover:bg-[#f5f7f8]">
                  <ShoppingCart size={14} /> Shop Now
                </a>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-[#e0e0e0] rounded-lg p-5 flex flex-col h-full">
                <div className="flex-grow">
                  <h5 className="text-[14px] font-bold mb-2">How to Use a Portable Generator</h5>
                </div>
                <a href="#" className="flex items-center justify-center gap-2 border border-[#0076ce] text-[#0076ce] text-[12px] font-bold py-2 rounded mt-auto hover:bg-[#f5f7f8]">
                  <FileText size={14} /> Read Article
                </a>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-[#e0e0e0] rounded-lg p-1 flex flex-col h-full overflow-hidden">
                <div className="relative h-24 w-full mb-3">
                   <Image 
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/219f4c1e-c48f-4841-873e-2f80d1aa9560-lowes-com/assets/images/weather-widget-warm-up-for-winter-5.png"
                    alt="Warm up for winter"
                    fill
                    className="object-cover rounded-t-lg"
                   />
                </div>
                <div className="px-4 pb-4 flex-grow">
                  <h5 className="text-[14px] font-bold mb-1">Stay warm and cozy for winter.</h5>
                  <p className="text-[12px] text-gray-600 mb-4">Find all you need this season.</p>
                </div>
                <div className="px-4 pb-4 mt-auto">
                    <a href="#" className="flex items-center justify-center gap-2 border border-[#0076ce] text-[#0076ce] text-[12px] font-bold py-2 rounded hover:bg-[#f5f7f8]">
                        <ShoppingCart size={14} /> Shop Now
                    </a>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white border border-[#e0e0e0] rounded-lg p-5 flex flex-col h-full">
                <div className="flex-grow">
                  <h5 className="text-[14px] font-bold mb-2">How to Replace a Doorbell Button in 6 Easy Steps</h5>
                </div>
                <a href="#" className="flex items-center justify-center gap-2 border border-[#0076ce] text-[#0076ce] text-[12px] font-bold py-2 rounded mt-auto hover:bg-[#f5f7f8]">
                  <FileText size={14} /> Read Article
                </a>
              </div>

              {/* Card 5 (Hidden on tablet, shown on lg) */}
              <div className="hidden lg:flex bg-white border border-[#e0e0e0] rounded-lg p-5 flex-col h-full relative">
                <div className="flex-grow">
                  <h5 className="text-[14px] font-bold mb-2">The perfect housewarming gifts.</h5>
                  <p className="text-[12px] text-gray-600">Make their house a home.</p>
                </div>
                <a href="#" className="flex items-center justify-center gap-2 border border-[#0076ce] text-[#0076ce] text-[12px] font-bold py-2 rounded mt-auto hover:bg-[#f5f7f8]">
                  <ShoppingCart size={14} /> Shop Now
                </a>
                {/* Arrow Navigation Button */}
                <button className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white border border-[#e0e0e0] rounded-full p-2 shadow-md z-10 hover:bg-gray-50 flex items-center justify-center">
                  <ChevronRight size={20} className="text-[#0076ce]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountForecastSection;