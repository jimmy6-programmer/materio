import { NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const adminSupabase = getAdminSupabase()
    const { data: reservations, error } = await adminSupabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Admin GET /api/admin/reservations error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: reservations || [] })
  } catch (err) {
    console.error('Admin GET /api/admin/reservations unexpected error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}