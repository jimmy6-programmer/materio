require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function createCartsTable() {
  try {
    console.log('Creating carts table...');

    // First, try to create the table using a simple insert to test if it exists
    const { error: testError } = await supabase
      .from('carts')
      .select('id')
      .limit(1);

    if (testError && testError.code === 'PGRST116') {
      console.log('Carts table does not exist, creating it...');

      // Since we can't execute raw SQL easily, let's create the table manually
      // We'll need to run this SQL in the Supabase dashboard:
      console.log('Please run the following SQL in your Supabase SQL editor:');
      console.log(`
-- Create carts table for user-specific cart persistence
create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id text not null,
  product_name text not null,
  price decimal(10,2) not null,
  quantity integer not null default 1,
  selected_variant text,
  image text,
  discount decimal(5,2),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, product_id, selected_variant)
);

-- Enable RLS
alter table public.carts enable row level security;

-- RLS Policies
create policy "Users can view their own cart items" on public.carts
  for select using (auth.uid() = user_id);

create policy "Users can insert their own cart items" on public.carts
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own cart items" on public.carts
  for update using (auth.uid() = user_id);

create policy "Users can delete their own cart items" on public.carts
  for delete using (auth.uid() = user_id);
      `);
    } else {
      console.log('Carts table already exists');
    }

  } catch (err) {
    console.error('Failed to check/create carts table:', err);
  }
}

createCartsTable();