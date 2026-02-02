// Client-side queries call secure admin APIs which use the service_role key on the server.

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total_price: number;
  delivery_address: {
    district: string;
    village: string;
    cell: string;
    phone: string;
    notes?: string;
  };
  created_at: string;
  profiles?: {
    email: string | null;
  }[];
  profile?: {
    email: string | null;
  } | null;
  order_items?: {
    id: string;
    order_id?: string;
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }[];
}
export async function getOrders() {
  const res = await fetch('/api/admin/orders')
  const payload = await res.json().catch(() => ({}))

  if (!res.ok) {
    console.error('getOrders failed:', payload)
    throw new Error(payload?.error || 'Failed to fetch orders')
  }

  const orders = (payload.data ?? []) as Order[]

  // Fetch order_items for these orders separately and merge
  const orderIds = orders.map(o => o.id)
  if (orderIds.length === 0) return orders

  const itemsRes = await fetch('/api/admin/order-items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderIds })
  })

  const itemsPayload = await itemsRes.json().catch(() => ({}))
  if (!itemsRes.ok) {
    console.error('getOrders: failed to fetch order_items:', itemsPayload)
    throw new Error(itemsPayload?.error || 'Failed to fetch order items')
  }

  const items = itemsPayload.data ?? []

  const itemsByOrder: Record<string, any[]> = {}
  for (const it of items) {
    itemsByOrder[it.order_id] = itemsByOrder[it.order_id] || []
    itemsByOrder[it.order_id].push({
      id: it.id,
      order_id: it.order_id,
      product_id: it.product_id,
      product_name: it.product_name || 'Unknown Product',
      quantity: it.quantity,
      price: it.price,
    })
  }

  const merged = orders.map(o => ({ ...o, order_items: itemsByOrder[o.id] || [] }))
  console.log('ORDERS RAW (merged):', merged)
  return merged
}

export async function getOrderById(id: string) {
  const res = await fetch(`/api/admin/orders/${id}`)
  const payload = await res.json().catch(() => ({}))

  if (!res.ok) {
    console.error(`getOrderById ${id} failed:`, payload)
    throw new Error(payload?.error || 'Failed to fetch order')
  }

  // API already returns order with order_items merged server-side
  return (payload.data ?? null) as Order
}

export async function updateOrderStatus(id: string, status: string) {
  const res = await fetch(`/api/admin/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })

  const payload = await res.json().catch(() => ({}))
  if (!res.ok) {
    console.error('updateOrderStatus failed:', payload)
    throw new Error(payload?.error || 'Failed to update order status')
  }

  return payload.data
}