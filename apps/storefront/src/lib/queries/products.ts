import { supabase } from '@/lib/supabaseClient';

export interface Product {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  price: number;
  image?: string;
  images: string[];
  rating: number;
  reviews: number;
  discount?: number;
  stock_quantity?: number;
  is_active?: boolean;
  created_at?: string;
  stockStatus: string;
}

export const getLatestProducts = async (limit = 10): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching latest products:', error);
    throw new Error('Failed to fetch latest products');
  }

  return data as Product[];
};

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }

  console.log("SOURCE: SUPABASE", data.length);
  console.log("FIRST PRODUCT ID:", data[0]?.id);

  return data.map(p => ({ ...p, stockStatus: p.stock_quantity && p.stock_quantity > 0 ? 'In Stock' : 'Out of Stock' })) as Product[];
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }

  return { ...data, stockStatus: data.stock_quantity && data.stock_quantity > 0 ? 'In Stock' : 'Out of Stock' } as Product;
};