import { supabase } from '../supabaseClient';

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  status: 'draft' | 'published';
  image: string;
  created_at: string;
}

export const getArticles = async (): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    throw new Error('Failed to fetch articles');
  }

  return data as Article[];
};

export const getPublishedArticles = async (limit = 4): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching published articles:', error);
    throw new Error('Failed to fetch published articles');
  }

  return data as Article[];
};

export const getArticleById = async (id: string): Promise<Article | null> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching article:', error);
    throw new Error('Failed to fetch article');
  }

  return data as Article;
};

export const createArticle = async (article: Omit<Article, 'id' | 'created_at'>): Promise<Article> => {
  const { data, error } = await supabase
    .from('articles')
    .insert([article])
    .select()
    .single();

  if (error) {
    console.error('Error creating article:', error);
    throw new Error('Failed to create article');
  }

  return data as Article;
};

export const updateArticle = async (id: string, article: Partial<Omit<Article, 'id' | 'created_at'>>): Promise<void> => {
  const { error } = await supabase
    .from('articles')
    .update(article)
    .eq('id', id);

  if (error) {
    console.error('Error updating article:', error);
    throw new Error('Failed to update article');
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting article:', error);
    throw new Error('Failed to delete article');
  }
};