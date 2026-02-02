import { supabase } from '@/lib/supabaseClient';

export interface HomeService {
  id: string;
  image_url?: string;
  category: string;
  title: string;
  description?: string;
  price_from: number;
  status?: string;
  created_at?: string;
}

export const getHomeServices = async (): Promise<HomeService[]> => {
  const { data, error } = await supabase
    .from('home_services')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching home services:', error);
    throw new Error('Failed to fetch home services');
  }

  return data as HomeService[];
};