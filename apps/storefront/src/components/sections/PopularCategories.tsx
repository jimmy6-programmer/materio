import React from 'react';
import Image from 'next/image';

const PopularCategories = () => {
  // Brand promotional big buttons
  

  // Category items with manual icons mimicking the UI
  const categories = [
    { name: "Animal & Pet Care", icon: "🐾" },
    { name: "Appliances", icon: "🗄️" },
    { name: "Automotive", icon: "⚙️" },
    { name: "Bathroom", icon: "🛁" },
    { name: "Blinds & Window Treatments", icon: "⊞" },
    { name: "Building Supplies", icon: "🏗️" },
    { name: "Cleaning Supplies", icon: "🧴" },
    { name: "Doors & Windows", icon: "🚪" },
    { name: "Electrical", icon: "🔌" },
    { name: "Heating & Cooling", icon: "❄️" },
    { name: "Home Décor & Furniture", icon: "🛋️" },
    { name: "Plumbing", icon: "🚰" },
    { name: "Flooring and Mugs", icon: "👣" },
    { name: "Smart Home, Security & Wi-fi", icon: "🏘️" },
    { name: "Painting", icon: "🎨" },
  ];

  return (
    <section id="popular-categories" className="bg-white py-12 px-4 md:px-8">
      <div className="max-w-[1440px] mx-auto">
        <h2 className="text-[24px] font-bold text-[#222222] mb-6 font-display">
          Popular Categories
        </h2>

        {/* Category Icon Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3">
          {categories.map((category, index) => (
            <a
              key={index}
              href="/products-list"
              className="flex items-center gap-3 p-3 bg-white border border-[#e0e0e0] rounded-[6px] hover:border-[#0076ce] hover:shadow-sm transition-all group h-full"
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#f5f7f8] rounded-md group-hover:bg-[#e7f1f7]">
                <span className="text-[20px]">{category.icon}</span>
              </div>
              <span className="text-[13px] font-bold text-[#222222] leading-tight font-body">
                {category.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;