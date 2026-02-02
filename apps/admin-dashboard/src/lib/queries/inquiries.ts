import { supabase } from '@/lib/supabaseClient';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export const getInquiries = async (): Promise<Inquiry[]> => {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inquiries:', error);
    throw new Error('Failed to fetch inquiries');
  }

  return data || [];
};