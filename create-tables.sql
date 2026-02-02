-- Create categories table
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image text,
  created_at timestamp with time zone default now()
);

-- Create products table
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price decimal(10,2) not null,
  image text,
  category_id uuid references public.categories(id),
  stock_quantity integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Create orders table
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer text not null,
  email text not null,
  status text not null,
  amount text not null,
  date timestamp with time zone default now()
);

-- Create order_items table
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_name text not null,
  quantity integer not null,
  price decimal(10,2) not null
);

-- Create inquiries table
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

-- Create profiles table (if not exists)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  is_admin boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS on all tables
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inquiries enable row level security;
alter table public.profiles enable row level security;