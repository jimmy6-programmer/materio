"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabaseClient';

export interface CartItem {
  id: string; // unique cart item id
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  selected_variant: string | null;
  image: string;
  discount?: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Omit<CartItem, 'id' | 'quantity'>, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  buyNow: (product: Omit<CartItem, 'id' | 'quantity'>, quantity?: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, isLoading: authLoading } = useAuth();

  // Load cart from database when user changes
  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    if (user) {
      loadCartFromDatabase();
    } else {
      // Clear cart when user logs out
      setItems([]);
      setIsLoaded(true);
    }
  }, [user, authLoading]);

  const loadCartFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: true });

      if (error) {
        // If table doesn't exist, fall back to localStorage temporarily
        if (error.code === 'PGRST116') {
          console.warn('Carts table not found, using localStorage fallback');
          try {
            const stored = localStorage.getItem('materio-cart');
            if (stored) {
              const parsedItems = JSON.parse(stored);
              setItems(parsedItems);
            }
          } catch (localError) {
            console.error('Failed to load cart from localStorage:', localError);
          }
          setIsLoaded(true);
          return;
        }
        throw error;
      }

      // Group items by product_id and selected_variant to handle duplicates
      const itemMap = new Map<string, CartItem>();

      data.forEach(item => {
        const normalizedVariant = item.selected_variant || null;
        const key = `${item.product_id}-${normalizedVariant}`;
        const existingItem = itemMap.get(key);

        if (existingItem) {
          // If duplicate exists, combine quantities and keep the newer one
          existingItem.quantity += item.quantity;
        } else {
          itemMap.set(key, {
            id: item.id,
            product_id: item.product_id,
            name: item.product_name,
            price: Number(item.price),
            quantity: item.quantity,
            selected_variant: normalizedVariant,
            image: item.image,
            discount: item.discount ? Number(item.discount) : undefined
          });
        }
      });

      const cartItems = Array.from(itemMap.values());
      setItems(cartItems);
    } catch (error) {
      console.error('Failed to load cart from database:', error);
      setItems([]);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveCartItem = async (item: CartItem) => {
    if (!user) return;

    try {
      // First, try to find existing item
      const { data: existingItems, error: selectError } = await supabase
        .from('carts')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', item.product_id)
        .eq('selected_variant', item.selected_variant || null);

      if (selectError) throw selectError;

      if (existingItems && existingItems.length > 0) {
        // Update existing item
        const existingItem = existingItems[0];
        const { error: updateError } = await supabase
          .from('carts')
          .update({
            quantity: item.quantity,
            product_name: item.name,
            price: item.price,
            image: item.image,
            discount: item.discount
          })
          .eq('id', existingItem.id);

        if (updateError) throw updateError;
      } else {
        // Insert new item
        const { error: insertError } = await supabase
          .from('carts')
          .insert({
            user_id: user.id,
            product_id: item.product_id,
            product_name: item.name,
            price: item.price,
            quantity: item.quantity,
            selected_variant: item.selected_variant || null,
            image: item.image,
            discount: item.discount
          });

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Failed to save cart item:', error);
    }
  };

  const removeCartItem = async (itemId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('carts')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    }
  };

  const clearUserCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('carts')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const discountedPrice = item.discount
      ? item.price * (1 - item.discount / 100)
      : item.price;
    return sum + (discountedPrice * item.quantity);
  }, 0);

  const addToCart = async (product: Omit<CartItem, 'id' | 'quantity'>, quantity = 1) => {
    if (!authLoading && !user) {
      toast.error('Please log in to add items to cart');
      window.location.href = '/login';
      return;
    }

    if (!user) return; // Wait for user to be available

    setItems(currentItems => {
      // Normalize selected_variant for comparison
      const normalizedVariant = product.selected_variant || null;

      // Check if item with same product_id and variant already exists
      const existingIndex = currentItems.findIndex(
        item => item.product_id === product.product_id &&
                item.selected_variant === normalizedVariant
      );

      if (existingIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...currentItems];
        updatedItems[existingIndex].quantity += quantity;

        // Save to database
        saveCartItem(updatedItems[existingIndex]);

        toast.success(`Updated ${product.name} quantity in cart`);
        return updatedItems;
      } else {
        // Add new item
        const newItem: CartItem = {
          ...product,
          selected_variant: normalizedVariant,
          id: `${product.product_id}-${normalizedVariant}-${Date.now()}`,
          quantity
        };

        // Save to database
        saveCartItem(newItem);

        toast.success(`Added ${product.name} to cart`);
        return [...currentItems, newItem];
      }
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setItems(currentItems =>
      currentItems.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, quantity };
          // Save to database
          saveCartItem(updatedItem);
          return updatedItem;
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    // Remove from database
    removeCartItem(itemId);

    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    // Clear from database
    clearUserCart();

    setItems([]);
  };

  const buyNow = async (product: Omit<CartItem, 'id' | 'quantity'>, quantity = 1) => {
    if (!authLoading && !user) {
      toast.error('Please log in to purchase items');
      window.location.href = '/login';
      return;
    }

    if (!user) return; // Wait for user to be available

    // Clear cart and add only this item
    await clearUserCart();

    const normalizedVariant = product.selected_variant || null;
    const newItem: CartItem = {
      ...product,
      selected_variant: normalizedVariant,
      id: `${product.product_id}-${normalizedVariant}-${Date.now()}`,
      quantity
    };

    // Save to database
    await saveCartItem(newItem);

    setItems([newItem]);
    toast.success(`Ready to checkout with ${product.name}`);

    // Redirect to checkout
    window.location.href = '/checkout';
  };

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    buyNow
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}