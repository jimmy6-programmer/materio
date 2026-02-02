import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export interface Product {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  category?: string;
  price: number;
  image?: string;
  images: string[];
  rating: number;
  reviews: number;
  discount?: number;
  specifications: { [key: string]: string };
  features: string[];
  variants?: string[];
  stock_quantity?: number;
  stock_status?: string;
  is_active?: boolean;
  created_at?: string;
}

export const getProducts = async (): Promise<Product[]> => {
  // Fetch products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*');

  if (productsError) {
    console.error('Error fetching products:', productsError);
    throw new Error('Failed to fetch products');
  }

  // Fetch categories
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name');

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError);
    throw new Error('Failed to fetch categories');
  }

  // Create category map
  const categoryMap = new Map(categories?.map(cat => [cat.id, cat.name]) || []);

  // Transform the data to include category name
  const transformedData = products?.map(product => ({
    ...product,
    category: categoryMap.get(product.category_id) || 'N/A'
  })) as Product[];

  return transformedData;
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .insert([product]);

  if (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
};

export const updateProduct = async (id: string, product: Partial<Omit<Product, 'id'>>): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id);

  if (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
};