import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase/admin';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const supabase = getAdminSupabase();
    const { error } = await supabase.from('reservations').update({ status }).eq('id', id);
    if (error) {
      console.error('Failed to update reservation status', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create notification for status update
    try {
      const { createNotification } = await import('@ecommerce-platform/shared');
      await createNotification({
        title: 'Reservation Status Updated',
        message: `Reservation ${id} has been updated to ${status}.`,
        type: 'order', // Using 'order' type since reservations are similar to orders
      });
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Don't throw, as reservation update succeeded
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
