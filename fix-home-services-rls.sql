-- Fix RLS policies for home_services table

-- Ensure RLS is enabled
alter table public.home_services enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Public can read home_services" on public.home_services;
drop policy if exists "Admins can insert home_services" on public.home_services;
drop policy if exists "Admins can update home_services" on public.home_services;
drop policy if exists "Admins can delete home_services" on public.home_services;

-- Create public SELECT policy for storefront
create policy "Public can read home_services"
on public.home_services
for select
to public
using (status = 'published');

-- Create admin INSERT policy
create policy "Admins can insert home_services"
on public.home_services
for insert
to authenticated
with check (public.is_admin());

-- Create admin UPDATE policy
create policy "Admins can update home_services"
on public.home_services
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Create admin DELETE policy
create policy "Admins can delete home_services"
on public.home_services
for delete
to authenticated
using (public.is_admin());