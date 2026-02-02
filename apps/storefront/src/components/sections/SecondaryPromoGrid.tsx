import React from 'react';
import Image from 'next/image';

const SecondaryPromoGrid = () => {
  return (
    <section className="bg-[#E9F3FA] py-6 sm:py-8">
      <div className="container mx-auto px-4 max-w-[1440px]">
        {/* Top Two Main Promo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Bath Savings Event */}
          <div className="bg-white rounded-lg flex flex-col sm:flex-row overflow-hidden min-h-[220px]">
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
              <div className="mb-4">
                <svg
                  viewBox="0 0 100 24"
                  className="h-6 text-[#004990]"
                  fill="currentColor"
                  role="img"
                  aria-label="Materio"
                >
                  <path d="M0 0h100v24H0z" fill="none" />
                  <path d="M12.4 4.8L4.8 12l7.6 7.2h6.8l-7.6-7.2 7.6-7.2h-6.8zM24.8 4.8v14.4h11.2V16H28V13.2h6.4V10H28V8h8V4.8H24.8zM43.2 19.2l3.2-14.4H40l-2.4 10.8-2.4-10.8h-6.4l3.2 14.4h8.8zM57.6 4.8L50 12l7.6 7.2h6.8l-7.6-7.2 7.6-7.2h-6.8zM72 19.2h8.8l3.2-14.4h-6.4l-2.4 10.8-2.4-10.8H66.4l3.2 14.4zM86.4 4.8v14.4h11.2V16h-8V13.2h6.4V10h-6.4V8h8V4.8h-11.2z" />
                </svg>
                <h3 className="text-[#004990] font-bold text-xl mt-1">Bath Savings Event</h3>
              </div>
              <h4 className="text-[#222222] text-lg font-semibold leading-tight mb-4">
                Refresh your bathroom with amazing deals.
              </h4>
              <a
                href="#"
                className="text-[#0076CE] font-bold text-sm underline hover:no-underline"
              >
                Shop Now
              </a>
            </div>
            <div className="bg-[#F5F7F8] w-full sm:w-[240px] flex items-center justify-center relative overflow-hidden">
               {/* Pattern overlay is common on Materio banners */}
               <div className="absolute inset-0 opacity-10 pointer-events-none" 
                    style={{ backgroundImage: 'radial-gradient(circle, #004990 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
               <div className="relative z-10 p-4">
                  {/* Bathroom Vanity Placeholder - matching visual from screenshot */}
                  <Image 
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/219f4c1e-c48f-4841-873e-2f80d1aa9560-lowes-com/assets/images/tote-shelves-21.png"
                    alt="Bathroom Vanity"
                    width={200}
                    height={200}
                    className="object-contain"
                  />
               </div>
            </div>
          </div>

          {/* Store and Save Event */}
          <div className="bg-white rounded-lg flex flex-col sm:flex-row overflow-hidden min-h-[220px]">
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
              <div className="mb-4">
                <svg
                  viewBox="0 0 100 24"
                  className="h-6 text-[#004990]"
                  fill="currentColor"
                  role="img"
                >
                  <path d="M0 0h100v24H0z" fill="none" />
                  <path d="M12.4 4.8L4.8 12l7.6 7.2h6.8l-7.6-7.2 7.6-7.2h-6.8zM24.8 4.8v14.4h11.2V16H28V13.2h6.4V10H28V8h8V4.8H24.8zM43.2 19.2l3.2-14.4H40l-2.4 10.8-2.4-10.8h-6.4l3.2 14.4h8.8zM57.6 4.8L50 12l7.6 7.2h6.8l-7.6-7.2 7.6-7.2h-6.8zM72 19.2h8.8l3.2-14.4h-6.4l-2.4 10.8-2.4-10.8H66.4l3.2 14.4zM86.4 4.8v14.4h11.2V16h-8V13.2h6.4V10h-6.4V8h8V4.8h-11.2z" />
                </svg>
                <h3 className="text-[#004990] font-bold text-xl mt-1">Store and Save Event</h3>
              </div>
              <h4 className="text-[#222222] text-lg font-semibold leading-tight mb-4">
                Start here for an organized home.
              </h4>
              <a
                href="#"
                className="text-[#0076CE] font-bold text-sm underline hover:no-underline"
              >
                Shop Now
              </a>
            </div>
            <div className="bg-[#0076CE] w-full sm:w-[240px] flex items-center justify-center relative overflow-hidden">
               <div className="relative z-10 p-4">
                  {/* Storage Totes Image from Assets */}
                  <Image 
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/219f4c1e-c48f-4841-873e-2f80d1aa9560-lowes-com/assets/images/tote-shelves-21.png"
                    alt="Storage Totes"
                    width={220}
                    height={160}
                    className="object-contain drop-shadow-xl"
                  />
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Three Callouts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Holiday Decor Clearance */}
          <div className="bg-white rounded-lg p-6 flex items-center shadow-sm relative overflow-hidden">
            <div className="flex-1 z-10">
              <span className="inline-block bg-[#FCE300] text-[#222222] text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider mb-2">
                Clearance
              </span>
              <div className="flex items-baseline">
                <span className="text-[#222222] text-4xl font-bold tracking-tight leading-none">75</span>
                <span className="flex flex-col ml-1">
                  <span className="text-[#222222] text-xl font-bold leading-none">%</span>
                  <span className="text-[#222222] text-sm font-bold leading-none">Off</span>
                </span>
              </div>
              <p className="text-[#222222] text-sm font-semibold mt-1 mb-2">Select Holiday Décor</p>
              <a href="#" className="text-[#0076CE] font-bold text-xs underline block">Shop Now</a>
            </div>
            <div className="w-24 h-24 relative flex-shrink-0">
               {/* Stormtrooper decoration representation */}
               <div className="absolute top-0 right-0 w-full h-full bg-[#f8f8f8] rounded-full flex items-center justify-center">
                 <Image 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/219f4c1e-c48f-4841-873e-2f80d1aa9560-lowes-com/assets/images/tote-shelves-21.png"
                  alt="Holiday Item"
                  width={80}
                  height={80}
                  className="object-contain opacity-40 grayscale"
                />
               </div>
            </div>
          </div>

          {/* Tools Savings */}
          <div className="bg-white rounded-lg p-6 flex items-center shadow-sm relative overflow-hidden">
            <div className="flex-1 z-10">
              <span className="text-[#C8102E] text-[10px] font-bold uppercase tracking-wider block mb-1">Up to</span>
              <div className="flex items-baseline">
                <span className="text-[#222222] text-4xl font-bold tracking-tight leading-none">45</span>
                <span className="flex flex-col ml-1">
                  <span className="text-[#222222] text-xl font-bold leading-none">%</span>
                  <span className="text-[#222222] text-sm font-bold leading-none">Off</span>
                </span>
              </div>
              <p className="text-[#222222] text-sm font-semibold mt-1 mb-2">Select Tools and Accessories</p>
              <a href="#" className="text-[#0076CE] font-bold text-xs underline block">Shop Now</a>
            </div>
            <div className="w-28 h-28 relative flex-shrink-0">
               <div className="absolute top-0 right-0 w-full h-full bg-[#f8f8f8] rounded-full flex items-center justify-center">
                 {/* Visual representative of Power Drill */}
                  <Image 
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/219f4c1e-c48f-4841-873e-2f80d1aa9560-lowes-com/assets/images/tote-shelves-21.png"
                    alt="Tools"
                    width={90}
                    height={90}
                    className="object-contain opacity-30 grayscale"
                  />
               </div>
            </div>
          </div>

          {/* Gift Card Banner - Full width on mobile/tablet, 1/3 on desktop */}
          <div className="bg-[#D1E6F5] rounded-lg p-6 flex flex-col justify-center sm:col-span-2 lg:col-span-1 border border-[#B8D4E9]">
            <h4 className="text-[#004990] font-bold text-[15px] leading-tight mb-2">
              Receive a bonus Lowe’s E-Gift Card valued at 20% of your purchase when you buy $100 or more in e-gift cards.
            </h4>
            <div className="flex items-center justify-between mt-auto">
              <div className="text-[11px] text-[#555555] font-medium max-w-[70%]">
                While supplies last. <strong>Offer ends 12/24/25.</strong>
                <a href="#" className="text-[#0076CE] font-bold underline ml-2">Buy Now</a>
              </div>
              <div className="flex -space-x-3 opacity-80">
                <div className="w-12 h-8 bg-[#004990] rounded shadow-md transform rotate-[-5deg]"></div>
                <div className="w-12 h-8 bg-[#0076CE] rounded shadow-md transform rotate-[5deg]"></div>
              </div>
            </div>
            <p className="text-[9px] text-[#757575] mt-3 leading-tight opacity-80">
              Bonus card maximum is $40. Limit one per household. E-gift card only. Limited quantities available.
            </p>
          </div>
        </div>

        {/* Bottom Details Link */}
        <div className="flex justify-end mt-4">
          <a href="#" className="text-[#222222] text-[11px] font-bold flex items-center hover:underline">
            Get Details
            <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SecondaryPromoGrid;