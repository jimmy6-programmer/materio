import React from 'react';
import Image from 'next/image';

const HolidayGiftsGrid = () => {
  const giftsByPrice = [
    {
      price: '$10 & Under',
      image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/219f4c1e-c48f-4841-873e-2f80d1aa9560-lowes-com/assets/images/cyber-gifts-10-and-under-9.png',
      link: '#',
    },
    {
      price: '$25 & Under',
      image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/219f4c1e-c48f-4841-873e-2f80d1aa9560-lowes-com/assets/images/gifts-20-and-under-10.png',
      link: '#',
    },
    {
      price: '$50 & Under',
      image: null,
      link: '#',
    },
    {
      price: '$100 & Under',
      image: null,
      link: '#',
    },
  ];

  const giftsByInterest = [
    {
      interest: 'For the NFL Fan',
      image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/219f4c1e-c48f-4841-873e-2f80d1aa9560-lowes-com/assets/images/nfl-fan-dt-12.png',
      link: '#',
    },
    {
      interest: 'For the Outdoor Cook',
      image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/219f4c1e-c48f-4841-873e-2f80d1aa9560-lowes-com/assets/images/outdoor-cook-13.png',
      link: '#',
    },
    {
      interest: 'For the Coffee Lover',
      image: null,
      link: '#',
    },
    {
      interest: 'For the Techie',
      image: null,
      link: '#',
    },
  ];

  return (
    <section className="bg-[#EBF6FB] py-12 px-4 md:px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="hidden md:flex gap-1">
            <span className="w-1.5 h-1.5 bg-[#004990] rotate-45"></span>
            <span className="w-2.5 h-2.5 bg-[#004990] rotate-45"></span>
            <span className="w-1.5 h-1.5 bg-[#004990] rotate-45"></span>
          </div>
          <h2 className="text-[#001D3D] text-[1.75rem] md:text-[2rem] font-bold text-center leading-tight">
            Check off your holiday list the easy way.
          </h2>
          <div className="hidden md:flex gap-1">
            <span className="w-1.5 h-1.5 bg-[#004990] rotate-45"></span>
            <span className="w-2.5 h-2.5 bg-[#004990] rotate-45"></span>
            <span className="w-1.5 h-1.5 bg-[#004990] rotate-45"></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gifts by Price Column */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[#222222] text-sm font-bold">Gifts by Price</h3>
              <a href="#" className="text-[#0076CE] text-sm font-semibold hover:underline">View All</a>
            </div>
            <div className="grid grid-cols-2 gap-4 flex-grow">
              {giftsByPrice.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="bg-[#F5F7F8] rounded-md overflow-hidden aspect-[4/3] flex items-center justify-center mb-2">
                    {item.image ? (
                      <Image 
                        src={item.image} 
                        alt={item.price} 
                        width={180} 
                        height={135} 
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#E0E0E0]/50"></div>
                    )}
                  </div>
                  <p className="text-[#222222] text-sm font-semibold mb-1">{item.price}</p>
                  <a href={item.link} className="text-[#0076CE] text-xs font-bold underline decoration-1 underline-offset-2">Shop Now</a>
                </div>
              ))}
            </div>
          </div>

          {/* Creator Spotlight Column */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col h-full">
            <div className="mb-6">
              <h3 className="text-[#222222] text-sm font-bold">Creator Holiday Picks</h3>
            </div>
            <div className="flex-grow flex flex-col">
              <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-[#00B0F0] mb-4">
                <Image 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/219f4c1e-c48f-4841-873e-2f80d1aa9560-lowes-com/assets/images/mr-beast-11.png" 
                  alt="MrBeast's Top Gifts" 
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-md"
                />
              </div>
              <h4 className="text-[#222222] text-sm font-bold mb-1">MrBeast&apos;s Top Gifts</h4>
              <p className="text-[#757575] text-xs mb-3">Check out his favorite finds, from tools to tech.</p>
              <a href="#" className="text-[#0076CE] text-xs font-bold underline decoration-1 underline-offset-2 mt-auto">Shop Now</a>
            </div>
          </div>

          {/* Gifts by Interest Column */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[#222222] text-sm font-bold">Gifts by Interest</h3>
              <a href="#" className="text-[#0076CE] text-sm font-semibold hover:underline">View All</a>
            </div>
            <div className="grid grid-cols-2 gap-4 flex-grow">
              {giftsByInterest.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="bg-[#F5F7F8] rounded-md overflow-hidden aspect-[4/3] flex items-center justify-center mb-2">
                    {item.image ? (
                      <Image 
                        src={item.image} 
                        alt={item.interest} 
                        width={180} 
                        height={135} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#E0E0E0]/50"></div>
                    )}
                  </div>
                  <p className="text-[#222222] text-sm font-semibold mb-1">{item.interest}</p>
                  <a href={item.link} className="text-[#0076CE] text-xs font-bold underline decoration-1 underline-offset-2">Shop Now</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HolidayGiftsGrid;