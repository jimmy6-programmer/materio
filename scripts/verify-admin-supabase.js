const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing env vars NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function verify() {
  console.log('Querying orders (admin service role)')
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, user_id, status, total_price, delivery_address, created_at')
    .order('created_at', { ascending: false })

  if (ordersError) {
    console.error('orders query error:', ordersError)
  } else {
    console.log(`orders returned: ${Array.isArray(orders) ? orders.length : 0}`)
  }

  if (!orders || orders.length === 0) return

  const orderIds = orders.map(o => o.id)
  console.log('Fetching order_items for', orderIds.length, 'orders')

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('id, order_id, product_id, quantity, price')
    .in('order_id', orderIds)

  if (itemsError) {
    console.error('order_items query error:', itemsError)
  } else {
    console.log(`order_items returned: ${Array.isArray(items) ? items.length : 0}`)
  }

  // Print small sample
  console.log('orders sample:', orders.slice(0,3))
  console.log('items sample:', (items || []).slice(0,5))
}

verify().catch(err => {
  console.error('unexpected error:', err)
  process.exit(2)
})
