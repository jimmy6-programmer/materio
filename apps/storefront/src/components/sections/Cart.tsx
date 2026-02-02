"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Cart = () => {
  const { items: cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated (only after auth check is complete)
  React.useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please log in to view your cart');
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const subtotal = totalPrice;
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <a
            href="/products-list"
            className="inline-flex items-center px-6 py-3 bg-brand-action text-white rounded-md hover:bg-brand-action/90 transition-colors font-semibold"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 p-4 bg-white border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-secondary rounded-md flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="object-cover rounded-md"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove(
                        "hidden"
                      );
                    }}
                  />
                  <div className="hidden w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="flex-grow">
                <h3 className="font-semibold text-foreground text-lg">
                  {item.name}
                </h3>
                {item.selected_variant && (
                  <p className="text-muted-foreground text-sm mb-2">
                    {item.selected_variant}
                  </p>
                )}
                <p className="font-bold text-brand-action text-lg">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 border border-border rounded-md hover:bg-secondary transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 border border-border rounded-md min-w-[3rem] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 border border-border rounded-md hover:bg-secondary transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-border rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout" className="w-full bg-brand-action text-white py-3 px-4 rounded-md hover:bg-brand-action/90 transition-colors font-semibold mb-4 inline-block text-center">
              Proceed to Checkout
            </Link>

            <a
              href="/products-list"
              className="block text-center text-brand-action hover:underline font-semibold"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;