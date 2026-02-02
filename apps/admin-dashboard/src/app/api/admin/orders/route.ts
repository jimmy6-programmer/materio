import { NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const adminSupabase = getAdminSupabase()
    const { data: orders, error } = await adminSupabase
      .from('orders')
      .select('id, user_id, status, total_price, delivery_address, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Admin GET /api/admin/orders error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const userIds = Array.from(new Set((orders || []).map((o: any) => o.user_id).filter(Boolean)))
    let profilesMap: Record<string, any> = {}
    if (userIds.length > 0) {
      const { data: profiles, error: profilesError } = await adminSupabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds)

      if (profilesError) {
        console.error('Admin GET /api/admin/orders profiles fetch error:', profilesError)
      } else {
        profilesMap = (profiles || []).reduce((acc: any, p: any) => ({ ...acc, [p.id]: p }), {})
      }
    }

    const transformed = (orders || []).map((o: any) => ({
      ...o,
      profiles: profilesMap[o.user_id] ? [{ email: profilesMap[o.user_id].email }] : [],
      profile: profilesMap[o.user_id] ? { email: profilesMap[o.user_id].email } : null,
    }))

    return NextResponse.json({ data: transformed })
  } catch (err) {
    console.error('Admin GET /api/admin/orders unexpected error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
