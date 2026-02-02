-- Alter products table to match the required schema

-- Add missing columns if they don't exist
alter table public.products
add column if not exists description text,
add column if not exists category_id uuid references public.categories(id),
add column if not exists stock_quantity integer default 0,
add column if not exists is_active boolean default true,
add column if not exists created_at timestamp with time zone default now(),
add column if not exists rating decimal(3,2) default 0,
add column if not exists reviews integer default 0,
add column if not exists images jsonb default '[]'::jsonb,
add column if not exists stock_status text default 'Available',
add column if not exists discount decimal(5,2),
add column if not exists specifications jsonb default '{}'::jsonb,
add column if not exists features text[] default '{}',
add column if not exists variants text[] default '{}';

-- Ensure id is uuid primary key
-- If id exists as different type, this might need manual handling
-- For now, assume it's already uuid

-- Ensure name and price are not null
alter table public.products
alter column name set not null,
alter column price set not null;

-- Add index on category_id for performance
create index if not exists idx_products_category_id on public.products(category_id);

-- Add index on created_at for ordering
create index if not exists idx_products_created_at on public.products(created_at);