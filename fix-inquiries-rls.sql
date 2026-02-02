-- Fix RLS policies for inquiries table

-- Ensure RLS is enabled
alter table public.inquiries enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Public create inquiry" on public.inquiries;
drop policy if exists "Admins can read inquiries" on public.inquiries;

-- Create public INSERT policy for storefront
create policy "Public create inquiry"
on public.inquiries
for insert
to public
with check (true);

-- Create admin SELECT policy for dashboard
create policy "Admins can read inquiries"
on public.inquiries
for select
to authenticated
using (public.is_admin());