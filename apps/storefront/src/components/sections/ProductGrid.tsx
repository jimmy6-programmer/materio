"use client";

import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Search, X, ChevronDown } from 'lucide-react';
import { getProducts, Product } from '../../lib/queries/products';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useCart } from '@/hooks/use-cart';

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart, buyNow } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      addToCart({
        product_id: product.id,
        name: product.name,
        price: product.price,
        selected_variant: undefined, // TODO: implement variants
        image: product.images[0] || '/placeholder-image.jpg',
        discount: product.discount
      }, quantity);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    buyNow({
      product_id: product.id,
      name: product.name,
      price: product.price,
      selected_variant: undefined, // TODO: implement variants
      image: product.images[0] || '/placeholder-image.jpg',
      discount: product.discount
    }, quantity);
  };

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 relative group flex flex-col h-full">
      {/* Clickable area: image + name + price link to product details using real id */}
      <Link href={`/products/${product.id}`} className="group block">
        <div className="relative h-56 overflow-hidden bg-[#f9f9f9]">
          {product.images[0] && product.images[0] !== '/placeholder-image.jpg' ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              objectFit="cover"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          {product.discount && (
            <div className="absolute bottom-0 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase">
              Save {product.discount}%
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-[#E4A100] text-[#E4A100]' : 'text-gray-200'}`} 
              />
            ))}
            <span className="text-[11px] text-muted-foreground font-medium ml-1">({product.reviews})</span>
          </div>

          <h3 className="text-[15px] font-bold text-[#222] line-clamp-2 min-h-[44px] group-hover:text-brand-action transition-colors leading-snug mb-3">
            {product.name}
          </h3>

          <div className="mt-auto">
            <div className="flex items-baseline space-x-1 mb-1">
              <span className="text-sm font-bold text-foreground">$</span>
              <span className="text-3xl font-black text-foreground tracking-tighter">{Math.floor(product.price)}</span>
              <span className="text-sm font-bold text-foreground">{(product.price % 1).toFixed(2).substring(2)}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Quantity and Actions */}
      <div className="p-4 space-y-3">
        {/* Quantity Selector */}
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
          >
            +
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={isAddingToCart}
            className="flex-1 bg-brand-action hover:bg-brand-navy disabled:bg-gray-400 text-white font-black py-2 px-3 rounded-full flex items-center justify-center space-x-1 transition-all active:scale-95 shadow-md hover:shadow-lg text-xs"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="w-3 h-3" />
            <span className="uppercase tracking-wider">
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </span>
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleBuyNow();
            }}
            className="flex-1 bg-brand-navy hover:bg-black text-white font-black py-2 px-3 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-md hover:shadow-lg text-xs"
            aria-label={`Buy ${product.name} now`}
          >
            <span className="uppercase tracking-wider">Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProductGridProps {
  selectedCategories: string[];
  priceRange: { min: string; max: string };
}

const ProductGrid = ({ selectedCategories, priceRange }: ProductGridProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter (use `category_id` from Product interface)
    const matchesCategory = selectedCategories.length === 0 || (product.category_id && selectedCategories.includes(product.category_id));

    

    // Price range filter
    const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
    const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, priceRange]);

  if (loading) {
    return (
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-border rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Search and Sort Area */}
      <div className="bg-secondary/50 p-4 rounded-xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between border border-border">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search within this category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-action transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-6 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-hover:rotate-180" />
            <select className="text-sm border-none bg-transparent focus:ring-0 cursor-pointer font-black text-brand-navy appearance-none pr-6 relative">
              <option>Featured</option>
              <option>Best Sellers</option>
              <option>Price: Low-High</option>
              <option>Price: High-Low</option>
            </select>
          </div>
          
          <div className="h-6 w-[1px] bg-border hidden sm:block"></div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">View</span>
            <div className="flex border border-border rounded-lg overflow-hidden">
              <button className="p-2 bg-white text-brand-navy shadow-inner">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3zm0 10h8v8H3zm10-10h8v8h-8zm0 10h8v8h-8z"/></svg>
              </button>
              <button className="p-2 hover:bg-white text-muted-foreground transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3zm0 10h18v2H3zm0 7h18v2H3z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {paginatedProducts.length > 0 ? (
        <div className="flex flex-wrap gap-8 justify-center">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="w-[310px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-secondary/30 rounded-3xl border-2 border-dashed border-border">
          <div className="mb-4 inline-flex p-4 bg-white rounded-full shadow-sm">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-6 font-bold text-brand-action hover:underline"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === page
                    ? 'text-white bg-brand-action border border-brand-action'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;

