import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

const MainOffersGrid = () => {
  return (
    <section className="bg-[#f5f7f8] py-6">
      <div className="container mx-auto px-4 max-w-[1440px]">
        {/* Main 3-Column Promo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          
          {/* Tile 1: Up to 40% Off Major Appliances */}
          <div className="bg-white rounded-[8px] p-6 shadow-sm flex flex-col md:flex-row relative overflow-hidden min-h-[400px]">
            <div className="z-10 flex-1 pr-4">
              <span className="text-[#c8102e] font-bold text-[18px]">Up to</span>
              <div className="flex items-start">
                <span className="text-[84px] font-bold leading-[1] tracking-tighter text-[#222222]">40</span>
                <div className="flex flex-col mt-4 ml-1">
                  <span className="text-[42px] font-bold leading-[1] text-[#222222]">%</span>
                  <span className="text-[24px] font-bold leading-[1] text-[#222222]">Off</span>
                </div>
              </div>
              <p className="text-[18px] font-semibold text-[#222222] mt-2 mb-4 leading-tight">
                Select Major Appliances<br />
                <span className="text-[14px] font-normal text-[#757575]">Offer ends 12/24/25.</span>
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-[#004990] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-[12px] font-bold">+</span>
                  </div>
                  <p className="text-[14px] font-bold text-[#004990]">Save an Additional $100</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-[#004990] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-[12px] font-bold">+</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#004990]">Rewards Members Save an Additional $50</p>
                    <p className="text-[12px] text-[#757575]">Select Laundry Pairs</p>
                  </div>
                </div>
              </div>

              <a 
                href="/pl/Appliances" 
                className="inline-block bg-[#0076ce] text-white font-bold py-3 px-6 rounded-[24px] text-[14px] hover:bg-[#005fa6] transition-colors"
              >
                Shop All Deals
              </a>
            </div>
            
            <div className="relative flex-1 min-h-[250px] md:min-h-auto mt-4 md:mt-0">
              <Image 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/219f4c1e-c48f-4841-873e-2f80d1aa9560-lowes-com/assets/images/LV1031292p3silo-3.jpg"
                alt="Major Appliances"
                fill
                className="object-contain object-center scale-110"
                priority
              />
            </div>
          </div>

          {/* Tile 2: MyMaterio Rewards - Members Get More */}
          <div className="bg-[#004990] rounded-[8px] overflow-hidden text-center flex flex-col items-center justify-center p-8 relative min-h-[400px]">
             {/* Logo Placeholder - MyLowes Rewards */}
             <div className="mb-4">
               <Image 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/219f4c1e-c48f-4841-873e-2f80d1aa9560-lowes-com/assets/images/Mobile-MLR-XS-M-New-488px-2.png"
                alt="MyMaterio Rewards"
                width={140}
                height={40}
                className="mx-auto brightness-0 invert"
               />
             </div>
             
             <h3 className="text-white text-[32px] font-bold mb-4">Members Get More</h3>
             <p className="text-white text-[14px] mb-6 opacity-90 max-w-[280px]">
               When you spend $1,999 or more on select Whirlpool®, KitchenAid®, Maytag® or Amana® appliances.*
             </p>
             
             <div className="w-full border-t border-white/20 pt-4 mb-4">
                <p className="text-white font-bold text-[18px]">FREE <span className="font-normal text-[14px]">Delivery and Haul Away</span></p>
             </div>
             <div className="w-full border-t border-white/20 pt-4 mb-6">
                <p className="text-white font-semibold text-[14px]">Basic Installation and Basic Installation Parts</p>
             </div>

             <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 border border-white/30">
                <div className="w-6 h-6 border-2 border-white rounded-md flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">2yr</span>
                </div>
                <span className="text-white font-bold text-[14px]">2-Year Materio Protection Plan</span>
             </div>

             <div className="absolute bottom-4 right-4">
                <a href="/rewards" className="text-white text-[14px] flex items-center hover:underline">
                  Get Details <ChevronRight className="w-4 h-4" />
                </a>
             </div>
          </div>

          {/* Tile 3: Gift Zone */}
          <div className="relative rounded-[8px] overflow-hidden group min-h-[400px]">
            <Image 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/219f4c1e-c48f-4841-873e-2f80d1aa9560-lowes-com/assets/images/LV1031292p3silo-3.jpg" // Note: Reusing high quality asset provided, original Gift Zone image not in filtered list
              alt="Gift Zone"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay to ensure text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
              <div className="bg-white/95 backdrop-blur-sm self-start p-6 rounded-sm max-w-[240px]">
                <h3 className="text-[#222222] text-[32px] font-bold leading-none mb-2">Gift Zone</h3>
                <p className="text-[#555555] text-[14px] mb-4">Materio has your holiday gift lists covered.</p>
                <a href="/l/shop/gift-ideas" className="text-[#0076ce] font-bold text-[16px] underline hover:no-underline">
                  Shop Now
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Secondary Promo Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bath Savings Event */}
            <div className="bg-white rounded-[8px] p-6 shadow-sm flex items-center justify-between border border-[#e0e0e0]">
                <div className="flex-1">
                    <div className="mb-2">
                        <span className="bg-[#004990] text-white px-2 py-1 text-[12px] font-bold uppercase tracking-wider">Materio</span>
                    </div>
                    <h4 className="text-[20px] font-bold text-[#222222] leading-tight mb-2">Bath Savings Event</h4>
                    <p className="text-[16px] text-[#222222] mb-4">Refresh your bathroom with amazing deals.</p>
                    <a href="/pl/Bathroom" className="text-[#0076ce] font-bold underline text-[14px]">Shop Now</a>
                </div>
                <div className="w-[140px] h-[140px] relative bg-[#f5f7f8] rounded-full overflow-hidden flex items-center justify-center">
                    <div className="text-[#004990] font-bold">Bath Icon</div>
                </div>
            </div>

            {/* Store and Save Event */}
            <div className="bg-white rounded-[8px] p-6 shadow-sm flex items-center justify-between border border-[#e0e0e0]">
                <div className="flex-1">
                    <div className="mb-2">
                        <span className="bg-[#004990] text-white px-2 py-1 text-[12px] font-bold uppercase tracking-wider">Materio</span>
                    </div>
                    <h4 className="text-[20px] font-bold text-[#222222] leading-tight mb-2">Store and Save Event</h4>
                    <p className="text-[16px] text-[#222222] mb-4">Start here for an organized home.</p>
                    <a href="/pl/Storage-organization" className="text-[#0076ce] font-bold underline text-[14px]">Shop Now</a>
                </div>
                <div className="w-[140px] h-[140px] relative">
                    <div className="bg-[#0076ce] w-full h-[80%] absolute bottom-0 right-0 -mr-6 -mb-6 rounded-tl-[40px]"></div>
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <div className="text-black font-bold">Storage Icon</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default MainOffersGrid;