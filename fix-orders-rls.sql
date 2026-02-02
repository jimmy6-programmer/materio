-- Fix RLS policies for orders table

-- Ensure RLS is enabled
alter table public.orders enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can read own orders" on public.orders;
drop policy if exists "Service role can insert orders" on public.orders;
drop policy if exists "Admins can update orders" on public.orders;
drop policy if exists "Users can insert orders" on public.orders;

-- Create policy for users to read their own orders
create policy "Users can read own orders"
on public.orders
for select
to authenticated
using (user_id = auth.uid());

-- Create policies for order_items (only add if they don't exist)
DO $$
BEGIN
    -- Add admin policy for order_items if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'order_items'
        AND policyname = 'Admins can read all order items'
    ) THEN
        CREATE POLICY "Admins can read all order items"
        ON public.order_items
        FOR SELECT
        TO authenticated
        USING (public.is_admin());
    END IF;

    -- Add user policy for order_items if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'order_items'
        AND policyname = 'Users can read their own order items'
    ) THEN
        CREATE POLICY "Users can read their own order items"
        ON public.order_items
        FOR SELECT
        TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
          )
        );
    END IF;
END $$;

-- Create policy for service role to insert orders (for server-side order creation)
create policy "Service role can insert orders"
on public.orders
for insert
to service_role
with check (true);

-- Create policy for users to insert their own orders (alternative to service role)
create policy "Users can insert orders"
on public.orders
for insert
to authenticated
with check (user_id = auth.uid());

-- Create policy for admins to update orders
create policy "Admins can update orders"
on public.orders
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());