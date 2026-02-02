import { supabase } from '@/lib/supabaseClient';

export interface Inquiry {
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  date?: string;
  status?: string;
}

export const createInquiry = async (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>): Promise<void> => {
  const payload = {
    name: inquiry.name,
    email: inquiry.email,
    subject: inquiry.subject ?? '',
    message: inquiry.message,
  };
  console.log('[INQUIRY PAYLOAD]', payload);
  const response = await supabase
    .from('inquiries')
    .insert([payload])
    .select();
  console.log('[SUPABASE RESPONSE]', {
    data: response.data,
    error: response.error,
    status: response.status,
    statusText: response.statusText
  });
  if (response.error) {
    console.error('[SUPABASE INSERT ERROR]', {
      message: response.error.message,
      details: response.error.details,
      hint: response.error.hint,
      code: response.error.code,
    });
    throw new Error('Failed to submit inquiry');
  }
};