-- Fix RLS policies for categories table

-- Ensure RLS is enabled
alter table public.categories enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Public can read categories" on public.categories;
drop policy if exists "Admins can insert categories" on public.categories;
drop policy if exists "Admins can update categories" on public.categories;
drop policy if exists "Admins can delete categories" on public.categories;

-- Create public SELECT policy for storefront
create policy "Public can read categories"
on public.categories
for select
to public
using (true);

-- Create admin INSERT policy
create policy "Admins can insert categories"
on public.categories
for insert
to authenticated
with check (public.is_admin());

-- Create admin UPDATE policy
create policy "Admins can update categories"
on public.categories
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Create admin DELETE policy
create policy "Admins can delete categories"
on public.categories
for delete
to authenticated
using (public.is_admin());