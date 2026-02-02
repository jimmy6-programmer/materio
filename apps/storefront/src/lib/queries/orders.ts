import { supabase } from '@/lib/supabaseClient';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total_price: number;
  delivery_address: {
    district: string;
    village: string;
    cell: string;
    phone: string;
    notes?: string;
  };
  created_at: string;
  profiles?: {
    email: string | null;
  }[];
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name?: string;
  product_image?: string;
  quantity: number;
  price: number;
  product?: {
    id?: string;
    name?: string;
    image?: string;
    images?: string[];
  };
}

export const getOrders = async (userId?: string): Promise<Order[]> => {
  let query = supabase
    .from('orders')
    .select(`
      id,
      user_id,
      status,
      total_price,
      delivery_address,
      created_at,
      profiles (
        email
      ),
      order_items (
        id
      )
    `)
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }

  return data as Order[];
};

export const getOrderById = async (id: string, client?: SupabaseClient): Promise<OrderWithItems | null> => {
  const sb = client ?? supabase
  const { data: order, error: orderError } = await sb
    .from('orders')
    .select(`
      id,
      user_id,
      status,
      total_price,
      delivery_address,
      created_at,
      profiles (
        email
      )
    `)
    .eq('id', id)
    .single();

  if (orderError) {
    if (orderError.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching order:', orderError);
    throw new Error('Failed to fetch order');
  }

  const { data: items, error: itemsError } = await sb
    .from('order_items')
    .select(
      `
      id,
      order_id,
      product_id,
      quantity,
      price,
      products ( id, name, image )
    `
    )
    .eq('order_id', id);

  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    throw new Error('Failed to fetch order items');
  }

  // Map joined `products` field (returned by Supabase) to a `product` prop
  const mappedItems = (items ?? []).map((it: any) => ({
    id: it.id,
    order_id: it.order_id,
    product_id: it.product_id,
    product_name: it.products?.name ?? undefined,
    product_image: it.products?.image ?? undefined,
    quantity: it.quantity,
    price: it.price,
    product: it.products ?? undefined,
  }));

  return {
    ...order,
    order_items: mappedItems as OrderItem[],
  } as OrderWithItems;
};
