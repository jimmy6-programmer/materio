const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

function parseDotEnv(filePath) {
  const txt = fs.readFileSync(filePath, 'utf8')
  const out = {}
  for (const line of txt.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq)
    const val = trimmed.slice(eq + 1)
    out[key] = val
  }
  return out
}

async function main() {
  const envPath = path.resolve(__dirname, '..', '.env')
  if (!fs.existsSync(envPath)) {
    console.error('.env not found at', envPath)
    process.exit(2)
  }

  const env = parseDotEnv(envPath)
  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
    process.exit(2)
  }

  const supabase = createClient(url, key)

  console.log('Querying orders (latest 10)')
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (ordersError) {
    console.error('orders query error:', ordersError)
    process.exitCode = 1
  } else {
    console.log('orders count:', (orders || []).length)
    if (orders && orders.length > 0) console.log('first order id:', orders[0].id)
  }

  const orderIds = (orders || []).map(o => o.id)
  if (orderIds.length === 0) {
    console.log('No orders found; skipping order_items query')
    process.exit(0)
  }

  console.log('Querying order_items for returned order IDs')
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .in('order_id', orderIds)

  if (itemsError) {
    console.error('order_items query error:', itemsError)
    process.exitCode = 1
  } else {
    console.log('order_items count:', (items || []).length)
    if (items && items.length > 0) console.log('sample item:', items[0])
  }

  // Fetch product names for items
  const productIds = Array.from(new Set((items || []).map(i => i.product_id).filter(Boolean)))
  if (productIds.length > 0) {
    const { data: products, error: prodErr } = await supabase
      .from('products')
      .select('id, name')
      .in('id', productIds)

    if (prodErr) {
      console.error('products query error:', prodErr)
    } else {
      const map = (products || []).reduce((a, p) => ({ ...a, [p.id]: p.name }), {})
      console.log('Mapped sample item with product_name:', {
        ...items[0],
        product_name: map[items[0].product_id] || 'Unknown Product'
      })
    }
  }
}

main().catch(err => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
