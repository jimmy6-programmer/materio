import React from 'react';
import { getAdminSupabase } from '@/lib/supabase/admin';
import UpdateReservationStatus from '@/components/UpdateReservationStatus';

interface Props { params: { id: string } }

export default async function ReservationDetail({ params }: Props) {
  const { id } = params;
  const supabase = getAdminSupabase();
  const { data, error } = await supabase.from('reservations').select('*').eq('id', id).single();

  if (error || !data) {
    return <div className="p-6">Reservation not found.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Reservation Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Service:</strong> {data.service_name}</p>
          <p><strong>Full Name:</strong> {data.full_name}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Phone:</strong> {data.phone}</p>
        </div>
        <div>
          <p><strong>Preferred Date:</strong> {data.preferred_date}</p>
          <p><strong>Preferred Time:</strong> {data.preferred_time}</p>
          <p><strong>Address:</strong> {data.service_address}</p>
        </div>
      </div>

      <div className="mt-6">
        <p><strong>Notes:</strong></p>
        <p className="whitespace-pre-wrap">{data.notes || '—'}</p>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Update Status</h3>
        {/* Client component handles calling the admin API route */}
        <UpdateReservationStatus id={data.id} currentStatus={data.status} />
      </div>
    </div>
  );
}
