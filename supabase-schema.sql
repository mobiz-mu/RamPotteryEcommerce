create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text unique not null,
  phone text,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  menu_svg_key text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text,
  description text,
  sku text,
  price numeric(10,2) not null default 0,
  sale_price numeric(10,2),
  stock_qty integer not null default 0,
  category_id uuid references public.categories(id) on delete set null,
  featured boolean not null default false,
  best_seller boolean not null default false,
  new_arrival boolean not null default false,
  active boolean not null default true,
  dimensions text,
  material text,
  care_instructions text,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  is_primary boolean not null default false,
  sort_order integer not null default 0
);

create table if not exists public.hero_banners (
  id uuid primary key default gen_random_uuid(),
  title text,
  subtitle text,
  cta_label text,
  cta_link text,
  secondary_cta_label text,
  secondary_cta_link text,
  desktop_image_url text,
  mobile_image_url text,
  text_align text default 'left',
  overlay_opacity integer default 25,
  active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  featured_image_url text,
  author text,
  published_at timestamptz,
  active boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text not null unique,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  address_line text not null,
  area text,
  notes text,
  subtotal numeric(10,2) not null default 0,
  delivery_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'completed', 'cancelled')),
  whatsapp_sent boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null default 1,
  unit_price numeric(10,2) not null default 0,
  line_total numeric(10,2) not null default 0
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  brand_name text,
  support_phone text,
  whatsapp_number text,
  support_email text,
  address text,
  facebook_url text,
  instagram_url text,
  linkedin_url text,
  tiktok_url text,
  footer_text text
);

create table if not exists public.announcement_bars (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  link text,
  background_color text default '#f8f8f8',
  text_color text default '#111111',
  active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.workshop_content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text,
  image_url text,
  active boolean not null default true
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.hero_banners enable row level security;
alter table public.blogs enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.site_settings enable row level security;
alter table public.announcement_bars enable row level security;
alter table public.workshop_content enable row level security;
alter table public.contact_messages enable row level security;

create policy "public read categories"
on public.categories for select
using (true);

create policy "public read active products"
on public.products for select
using (active = true);

create policy "public read product images"
on public.product_images for select
using (true);

create policy "public read active hero banners"
on public.hero_banners for select
using (active = true);

create policy "public read active blogs"
on public.blogs for select
using (active = true);

create policy "public read site settings"
on public.site_settings for select
using (true);

create policy "public read active announcement bars"
on public.announcement_bars for select
using (active = true);

create policy "public read active workshop content"
on public.workshop_content for select
using (active = true);

create policy "public insert newsletter"
on public.newsletter_subscribers for insert
with check (true);

create policy "public insert contact"
on public.contact_messages for insert
with check (true);

create policy "public insert orders"
on public.orders for insert
with check (true);

create policy "public insert order items"
on public.order_items for insert
with check (true);


create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users read own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "users update own profile"
on public.profiles for update
using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'customer'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();