-- Fix RLS policies for products table

-- Ensure RLS is enabled
alter table public.products enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Public can read products" on public.products;
drop policy if exists "Admins can insert products" on public.products;
drop policy if exists "Admins can update products" on public.products;
drop policy if exists "Admins can delete products" on public.products;

-- Create public SELECT policy for storefront
create policy "Public can read products"
on public.products
for select
to public
using (true);

-- Create admin INSERT policy
create policy "Admins can insert products"
on public.products
for insert
to authenticated
with check (public.is_admin());

-- Create admin UPDATE policy
create policy "Admins can update products"
on public.products
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Create admin DELETE policy
create policy "Admins can delete products"
on public.products
for delete
to authenticated
using (public.is_admin());