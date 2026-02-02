"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Menu, X, User, ShoppingCart, LayoutGrid, Package, Phone, Search, MapPin, ChevronDown, Truck, LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  const getInitials = (email: string) => {
    const prefix = email.split('@')[0];
    return prefix.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCartClick = (e: React.MouseEvent) => {
    console.log('Cart clicked! Attempting navigation to /cart');
    setIsMobileMenuOpen(false);
  };

  // Static announcements - easy to update/add
  const announcements = [
    "Free Delivery on orders over $500",
    "Year-End Sale: Up to 30% off on selected items",
    "New Cement Collection Arrived!",
    "Limited Time: Buy 10 bags of cement, get 1 free",
    "Shop now and earn double reward points"
  ];

  return (
    <>
      <header className="w-full flex flex-col font-body relative">
        {/* Global Promo Banner */}
        <div className="bg-brand-navy text-white text-sm py-2">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
            <div className="flex-1 text-center md:text-left">
              <a href="#" className="hover:underline font-semibold">
                Get more. Shop more in this week of {currentMonth} Deal Drops now.
              </a>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/#popular-categories" className="hover:underline text-[12px] font-semibold">Categories</a>
              <a href="/products-list" className="hover:underline text-[12px] font-semibold">Products</a>
              <a href="/orders" className="hover:underline text-[12px] font-semibold">Orders</a>
              <a href="/contact" className="hover:underline text-[12px] font-semibold">Contact</a>
            </nav>
          </div>
        </div>

        {/* Main Masthead */}
        <div className="bg-white border-b border-border py-4">
          <div className="container mx-auto flex items-center justify-between gap-4 px-4 relative">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="bg-[#004990] p-2 flex items-center justify-center rounded-sm cursor-pointer">
                  <span className="text-white font-bold text-2xl tracking-tighter italic">MATERIO</span>
                </div>
              </Link>
            </div>

            {/* Mobile Tagline */}
            <div className="absolute left-1/2 -translate-x-1/2 md:hidden pointer-events-none mx-8">
              <p className="text-brand-navy text-lg font-medium italic whitespace-nowrap">
                Building Partner.
              </p>
            </div>

            {/* Desktop: Store Selector + Search */}
            <div className="hidden md:flex items-center flex-1 gap-4">
              <div className="flex flex-col text-[13px] border-r border-border pr-4 min-w-[180px]">
                <button className="flex items-center text-foreground font-semibold">
                  <MapPin className="w-4 h-4 mr-1 text-brand-navy" />
                  <span className="truncate">Online</span>
                </button>
                <div className="flex items-center text-muted-foreground mt-1">
                  <span className="text-[#28823F] font-bold mr-2">Open</span>
                  <span>24/7</span>
                </div>
              </div>

              <div className="flex-1 max-w-[800px]">
                <form className="relative flex items-center w-full">
                  <div className="relative w-full">
                    <input 
                      type="text" 
                      placeholder="What can we help you find?" 
                      className="w-full h-11 pl-10 pr-24 rounded-full border border-[#757575] focus:outline-none focus:ring-2 focus:ring-brand-action focus:border-transparent text-body-small"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center space-x-3">
                      <button type="submit" className="p-1 hover:bg-secondary rounded-full" aria-label="Search">
                        <Search className="w-5 h-5 text-brand-navy" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Desktop Icons */}
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center space-x-4">
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex flex-col items-center justify-center text-foreground hover:text-brand-action transition-colors px-2"
                    >
                      <div className="w-8 h-8 bg-[#004990] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {getInitials(user.email)}
                      </div>
                      <span className="text-[12px] font-semibold mt-1">Account</span>
                    </button>
                    {isUserMenuOpen && (
                      <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[200px]">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm text-gray-700">{user.email}</p>
                        </div>
                        <button
                          onClick={async () => {
                            await signOut();
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login" className="flex flex-col items-center justify-center text-foreground hover:text-brand-action transition-colors px-2">
                    <User className="w-6 h-6" />
                    <span className="text-[12px] font-semibold mt-1">Sign In</span>
                  </Link>
                )}

                <Link href="/cart" onClick={handleCartClick}>
                  <div className="flex flex-col items-center justify-center text-foreground hover:text-brand-action transition-colors px-2">
                    <div className="relative">
                      <ShoppingCart className="w-6 h-6" />
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-brand-action text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                          {totalItems > 99 ? '99+' : totalItems}
                        </span>
                      )}
                    </div>
                    <span className="text-[12px] font-semibold mt-1">Cart</span>
                  </div>
                </Link>
              </nav>

              {/* Mobile Hamburger */}
              <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Announcements Ticker - Now with white background & shadow */}
        <div className="bg-white shadow-md border-b border-border">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden h-12 flex items-center">
              {/* Fade edges - now matching white background */}
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

              <div className="flex items-center whitespace-nowrap animate-scroll">
                {/* Duplicated for seamless infinite loop */}
                <div className="flex items-center gap-8 px-4">
                  {announcements.map((announcement, index) => (
                    <span key={index} className="font-medium text-brand-navy">
                      {announcement}
                      {index < announcements.length - 1 && <span className="mx-8 text-gray-400">•</span>}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-8 px-4">
                  {announcements.map((announcement, index) => (
                    <span key={`dup-${index}`} className="font-medium text-brand-navy">
                      {announcement}
                      {index < announcements.length - 1 && <span className="mx-8 text-gray-400">•</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </header>

      {/* Mobile Menu - unchanged */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white md:hidden">
          {/* ... (rest of mobile menu remains exactly the same as before) */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border">
            <Link href="/">
              <div className="bg-[#004990] p-2 flex items-center justify-center rounded-sm">
                <span className="text-white font-bold text-2xl tracking-tighter italic">MATERIO</span>
              </div>
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-7">
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 text-foreground text-lg font-medium">
                  <div className="w-10 h-10 bg-[#004990] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {getInitials(user.email)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Account</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    await signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-4 text-foreground hover:text-brand-action text-lg font-medium"
                >
                  <LogOut className="w-7 h-7" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-foreground hover:text-brand-action text-lg font-medium">
                <User className="w-7 h-7" />
                <span>Sign In</span>
              </Link>
            )}

            <Link 
              href="/cart" 
              onClick={(e) => {
                handleCartClick(e);
                setIsMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-4 text-foreground hover:text-brand-action text-lg font-medium relative"
            >
              <ShoppingCart className="w-7 h-7" />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="absolute left-9 -top-2 bg-brand-action text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-foreground hover:text-brand-action text-lg font-medium">
              <LayoutGrid className="w-7 h-7" />
              <span>Categories</span>
            </Link>

            <Link href="/products-list" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-foreground hover:text-brand-action text-lg font-medium">
              <Package className="w-7 h-7" />
              <span>Products</span>
            </Link>

            <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-foreground hover:text-brand-action text-lg font-medium">
              <Package className="w-7 h-7" />
              <span>Orders</span>
            </Link>

            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-foreground hover:text-brand-action text-lg font-medium">
              <Phone className="w-7 h-7" />
              <span>Contact</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;