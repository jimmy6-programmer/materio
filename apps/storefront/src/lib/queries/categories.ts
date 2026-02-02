import { supabase } from '@/lib/supabaseClient';

export interface Category {
  id: string;
  name: string;
  description: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');

  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }

  return data as Category[];
};