import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export interface NotificationData {
  title: string;
  message: string;
  type: 'order' | 'inquiry' | 'product' | 'category' | 'system' | 'reservation';
}

export const createNotification = async (data: NotificationData): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .insert([data]);

  if (error) {
    console.error('Error creating notification:', error);
    throw new Error('Failed to create notification');
  }
};