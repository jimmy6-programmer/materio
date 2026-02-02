import { NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    const adminSupabase = getAdminSupabase()
    const { data: order, error: orderError } = await adminSupabase
      .from('orders')
      .select('id, user_id, status, total_price, delivery_address, created_at')
      .eq('id', id)
      .single()

    if (orderError) {
      console.error(`Admin GET /api/admin/orders/${id} order fetch error:`, orderError)
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    const { data: items, error: itemsError } = await adminSupabase
      .from('order_items')
      .select('id, order_id, product_id, quantity, price')
      .eq('order_id', id)

    if (itemsError) {
      console.error(`Admin GET /api/admin/orders/${id} items fetch error:`, itemsError)
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    const productIds = Array.from(new Set((items || []).map(i => i.product_id).filter(Boolean)))
    let productsMap = {}
    if (productIds.length > 0) {
      const { data: products, error: prodErr } = await adminSupabase
        .from('products')
        .select('id, name')
        .in('id', productIds)

      if (prodErr) {
        console.error(`Admin GET /api/admin/orders/${id} products fetch error:`, prodErr)
      } else {
        productsMap = (products || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {})
      }
    }

    const transformedItems = (items || []).map(it => ({
      ...it,
      product_name: (productsMap[it.product_id] && productsMap[it.product_id].name) || 'Unknown Product'
    }))

    // Fetch profile for the order's user_id and expose as object for detail view
    let profileObj = null
    if (order && order.user_id) {
      const { data: profs, error: profErr } = await adminSupabase
        .from('profiles')
        .select('id, email')
        .eq('id', order.user_id)
        .limit(1)

      if (profErr) {
        console.error(`Admin GET /api/admin/orders/${id} profile fetch error:`, profErr)
      } else if (profs && profs.length > 0) {
        profileObj = { email: profs[0].email }
      }
    }

    const orderWithItems = {
      ...order,
      profiles: profileObj ? [profileObj] : [],
      profile: profileObj,
      order_items: transformedItems
    }

    return NextResponse.json({ data: orderWithItems })
  } catch (err) {
    console.error(`Admin GET /api/admin/orders/${params.id} unexpected error:`, err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    const body = await req.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: 'Missing status' }, { status: 400 })
    }

    const adminSupabase = getAdminSupabase()
    const { data, error } = await adminSupabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()

    if (error) {
      console.error(`Admin PATCH /api/admin/orders/${id} update error:`, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error(`Admin PATCH /api/admin/orders/${params.id} unexpected error:`, err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
