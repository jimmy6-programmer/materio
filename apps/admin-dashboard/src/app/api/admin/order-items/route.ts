import { NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderIds } = body

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ data: [] })
    }

    const adminSupabase = getAdminSupabase()
    const { data: items, error } = await adminSupabase
      .from('order_items')
      .select('id, order_id, product_id, quantity, price')
      .in('order_id', orderIds)

    if (error) {
      console.error('Admin POST /api/admin/order-items error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const productIds = Array.from(new Set((items || []).map(i => i.product_id).filter(Boolean)))
    let productsMap = {}
    if (productIds.length > 0) {
      const { data: products, error: prodErr } = await adminSupabase
        .from('products')
        .select('id, name')
        .in('id', productIds)

      if (prodErr) {
        console.error('Admin POST /api/admin/order-items products fetch error:', prodErr)
      } else {
        productsMap = (products || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {})
      }
    }

    const transformed = (items || []).map(it => ({
      ...it,
      product_name: (productsMap[it.product_id] && productsMap[it.product_id].name) || 'Unknown Product'
    }))

    return NextResponse.json({ data: transformed })
  } catch (err) {
    console.error('Admin POST /api/admin/order-items unexpected error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
