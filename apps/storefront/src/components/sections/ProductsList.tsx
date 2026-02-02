"use client";

import { useState, useEffect } from 'react';
import Breadcrumbs from './Breadcrumbs';
import PLPHeaders from './PLPHeaders';
import ProductFilterSidebar from './ProductFilterSidebar';
import ProductGrid from './ProductGrid';
import Header from './Header';
import { getCategories, Category } from '@/lib/queries/categories';
import { toast } from 'sonner';

const ProductsList = () => {
  const [categories, setCategories] = useState<{ id: string; name: string; icon: string }[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        const categoriesWithIcons = data.map(cat => ({ id: cat.id, name: cat.name, icon: '🏷️' })); // Default icon
        setCategories(categoriesWithIcons);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to load categories. Please try again.');
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev =>
      checked ? [...prev, category] : prev.filter(c => c !== category)
    );
  };

  const handlePriceRangeChange = (min: string, max: string) => {
    setPriceRange({ min, max });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
  };

  return (
    <>
      <Header />
      <Breadcrumbs />
      <PLPHeaders />
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <ProductFilterSidebar
            categories={categories}
            selectedCategories={selectedCategories}
            priceRange={priceRange}
            onCategoryChange={handleCategoryChange}
            onPriceRangeChange={handlePriceRangeChange}
            onClearAll={clearAllFilters}
          />
          <ProductGrid
            selectedCategories={selectedCategories}
            priceRange={priceRange}
          />
        </div>
      </div>
      <footer className="bg-brand-navy text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-70">
            © 2025 Materio. All rights reserved. Developed by <a href="https://jimmyprogrammer.vercel.app/" className="underline">Jimmy</a>.
          </p>
        </div>
      </footer>
    </>
  );
};

export default ProductsList;