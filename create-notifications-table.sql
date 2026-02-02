-- Create notifications table
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  type text not null, -- order | inquiry | product | category | system
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.notifications enable row level security;

-- Create policy for admins to read notifications
create policy "Admins can read notifications"
on public.notifications
for select
to authenticated
using (public.is_admin());

-- Create policy for service role to insert (for backend logic)
create policy "Service role can insert notifications"
on public.notifications
for insert
to service_role
with check (true);

-- Create policy for admins to update notifications
create policy "Admins can update notifications"
on public.notifications
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());