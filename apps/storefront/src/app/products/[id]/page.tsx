"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, ShoppingCart, ChevronLeft, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react';
import { getProductById } from '@/lib/queries/products';
import { Product } from '@/lib/products';
import Header from '@/components/sections/Header';
import Breadcrumbs from '@/components/sections/Breadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/hooks/use-cart';

const ProductDetailsPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart, buyNow } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const foundProduct = await getProductById(id);
        setProduct(foundProduct);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Header />
        <Breadcrumbs />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Skeleton */}
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                ))}
              </div>
            </div>
            {/* Content Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <Breadcrumbs />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The product you're looking for doesn't exist or may have been removed.
            </p>
            <Link
              href="/products-list"
              className="inline-flex items-center px-6 py-3 bg-brand-action text-white font-bold rounded-full hover:bg-brand-navy transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </div>
        </div>
      </>
    );
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = async () => {
    if (!product) return;
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
    if (!product) return;
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
    <>
      <Header />
      <Breadcrumbs />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-50">
              <img
                src={product.images[selectedImageIndex]}
                alt={`${product.name} - Image ${selectedImageIndex + 1} of ${product.images.length}`}
                className="w-full h-full object-contain transition-opacity duration-300"
                loading="lazy"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-2 overflow-x-auto" role="tablist" aria-label="Product images">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  role="tab"
                  aria-selected={selectedImageIndex === index}
                  aria-label={`View image ${index + 1} of ${product.images.length}`}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-brand-action focus:ring-offset-2 ${
                    selectedImageIndex === index
                      ? 'border-brand-action shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-[#E4A100] text-[#E4A100]'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-2">
              {product.discount && (
                <span className="text-lg text-muted-foreground line-through">
                  ${(product.price * (1 + product.discount / 100)).toFixed(2)}
                </span>
              )}
              <span className="text-4xl font-black text-foreground">
                ${Math.floor(product.price)}
              </span>
              <span className="text-2xl font-bold text-foreground">
                {(product.price % 1).toFixed(2).substring(2)}
              </span>
              {product.discount && (
                <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                  Save {product.discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-bold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-bold mb-3">Specifications</h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-foreground">{key}</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-bold mb-3">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-brand-action mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-bold mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-action focus:ring-offset-2 disabled:opacity-50"
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span
                    className="px-4 py-3 font-medium min-w-[50px] text-center"
                    aria-label={`Quantity: ${quantity}`}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-action focus:ring-offset-2"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.stockStatus.includes('Free') || product.stockStatus.includes('Available')
                    ? 'In stock'
                    : 'Limited stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-1 bg-brand-action hover:bg-brand-navy disabled:bg-gray-400 text-white font-black py-4 px-6 rounded-full flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-lg hover:shadow-xl"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 border-2 border-brand-action text-brand-action hover:bg-brand-action hover:text-white font-black py-4 px-6 rounded-full transition-all"
              >
                Buy Now
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-green-600" />
                <span className="text-sm">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm">2-year warranty included</span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-5 h-5 text-orange-600" />
                <span className="text-sm">30-day return policy</span>
              </div>
            </div>
          </div>
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

export default ProductDetailsPage;