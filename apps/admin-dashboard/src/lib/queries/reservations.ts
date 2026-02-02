// Client-side queries call secure admin APIs which use the service_role key on the server.

export interface Reservation {
  id: string;
  service_name: string;
  full_name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  created_at: string;
}

export async function getReservations() {
  const res = await fetch('/api/admin/reservations')
  const payload = await res.json().catch(() => ({}))

  if (!res.ok) {
    console.error('getReservations failed:', payload)
    throw new Error(payload?.error || 'Failed to fetch reservations')
  }

  return (payload.data ?? []) as Reservation[]
}

export async function updateReservationStatus(id: string, status: string) {
  const res = await fetch('/api/reservations/update', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status })
  })

  const payload = await res.json().catch(() => ({}))
  if (!res.ok) {
    console.error('updateReservationStatus failed:', payload)
    throw new Error(payload?.error || 'Failed to update reservation status')
  }

  return payload
}