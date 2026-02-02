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

export const createCategory = async (category: Omit<Category, 'id'>): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .insert([category]);

  if (error) {
    console.error('Error creating category:', error);
    throw new Error('Failed to create category');
  }
};

export const updateCategory = async (id: string, category: Partial<Omit<Category, 'id'>>): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id);

  if (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
};