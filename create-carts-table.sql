-- Create carts table for user-specific cart persistence
create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid not null, -- Reference to products table
  product_name text not null,
  price decimal(10,2) not null,
  quantity integer not null default 1,
  selected_variant text,
  image text,
  discount decimal(5,2),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, product_id, selected_variant) -- Prevent duplicate items per user
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

-- Create updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_carts_updated_at
  before update on public.carts
  for each row execute function update_updated_at_column();