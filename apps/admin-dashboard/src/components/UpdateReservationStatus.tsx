"use client";

import React, { useState } from 'react';
import { toast } from 'sonner';

export default function UpdateReservationStatus({ id, currentStatus }: { id: string; currentStatus?: string }) {
  const [status, setStatus] = useState(currentStatus || 'pending');
  const [loading, setLoading] = useState(false);

  const update = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reservations/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed');
      toast.success('Status updated');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="border px-2 py-1 rounded">
        <option value="pending">pending</option>
        <option value="confirmed">confirmed</option>
        <option value="completed">completed</option>
        <option value="cancelled">cancelled</option>
      </select>
      <button onClick={update} disabled={loading} className="bg-[#004990] text-white px-3 py-1 rounded">
        {loading ? 'Updating...' : 'Update'}
      </button>
    </div>
  );
}
