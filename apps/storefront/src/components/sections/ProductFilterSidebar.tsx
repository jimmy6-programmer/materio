import React, { useState } from 'react';
import { ChevronDown, Filter, RotateCcw } from 'lucide-react';

interface ProductFilterSidebarProps {
  categories: { id: string; name: string; icon: string }[];
  selectedCategories: string[];
  priceRange: { min: string; max: string };
  onCategoryChange: (category: string, checked: boolean) => void;
  onPriceRangeChange: (min: string, max: string) => void;
  onClearAll: () => void;
}

const ProductFilterSidebar = ({
  categories,
  selectedCategories,
  priceRange,
  onCategoryChange,
  onPriceRangeChange,
  onClearAll,
}: ProductFilterSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside className="w-72 flex-shrink-0 hidden lg:block sticky top-8 h-fit">
      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border flex items-center justify-between bg-brand-navy/5">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-brand-navy" />
            <h2 className="text-lg font-black text-brand-navy tracking-tight">Refine By</h2>
          </div>
          <button
            onClick={onClearAll}
            className="text-[11px] font-bold uppercase tracking-tighter text-muted-foreground flex items-center hover:text-brand-action transition-colors"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Clear All
          </button>
        </div>
        
        <div className="divide-y divide-border">
          {/* Category Filter */}
          <div className="p-5 group">
            <button
              onClick={() => toggleSection('category')}
              className="flex items-center justify-between w-full text-left py-1 group/btn"
            >
              <span className="font-bold text-[13px] uppercase tracking-widest text-[#222] group-hover/btn:text-brand-action transition-colors">Category</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${expandedSections.category ? 'rotate-180' : ''}`} />
            </button>
            {expandedSections.category && (
              <div className="mt-4 space-y-3">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center group/label cursor-pointer">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={(e) => onCategoryChange(category.id, e.target.checked)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border bg-white transition-all checked:bg-brand-action checked:border-brand-action"
                      />
                      <svg className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none stroke-current stroke-2" fill="none" viewBox="0 0 24 24">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="ml-3 text-[14px] font-medium text-[#444] group-hover/label:text-brand-action transition-colors">
                      {category.icon} {category.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Filter */}
          <div className="p-5 group">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-left py-1 group/btn"
            >
              <span className="font-bold text-[13px] uppercase tracking-widest text-[#222] group-hover/btn:text-brand-action transition-colors">Price Range</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${expandedSections.price ? 'rotate-180' : ''}`} />
            </button>
            {expandedSections.price && (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium text-gray-600 mb-1">Min Price</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => onPriceRangeChange(e.target.value, priceRange.max)}
                      placeholder="0"
                      className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-action"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-gray-600 mb-1">Max Price</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => onPriceRangeChange(priceRange.min, e.target.value)}
                      placeholder="1000"
                      className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-action"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </aside>
  );
};

export default ProductFilterSidebar;
