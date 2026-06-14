-- Rivan Supabase schema for Expo web/PWA.
-- Paste this file into the Supabase SQL Editor for a new project.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text unique,
  name text,
  email text,
  address text,
  kyc_status text not null default 'pending',
  is_admin boolean not null default false,
  onboarding_completed boolean not null default false,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  category text,
  location text,
  starting_price numeric(14,2) not null default 0,
  size text,
  image text,
  description text,
  survey_number text,
  facing text,
  road_width text,
  availability text not null default 'Available',
  featured boolean not null default false,
  amenities text[] not null default '{}',
  approvals text[] not null default '{}',
  nearby text[] not null default '{}',
  highlights text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, property_id)
);

create table if not exists public.site_visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  type text not null default 'site',
  centre_id text,
  visit_date date not null,
  visit_time text,
  name text,
  mobile text,
  status text not null default 'confirmed',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  name text not null,
  type text,
  size text,
  url text,
  storage_path text,
  status text not null default 'available',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  amount numeric(14,2) not null default 0,
  currency text not null default 'INR',
  status text not null default 'pending',
  receipt_id text,
  method text,
  paid_at timestamptz,
  due_date date,
  installment_number integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  type text not null default 'info',
  read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  property_id uuid references public.properties(id) on delete set null,
  name text,
  phone text,
  email text,
  message text,
  source text not null default 'web',
  status text not null default 'new',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  location_preference text not null check (location_preference in ('Vizag', 'Vijayawada')),
  property_interest text not null check (property_interest in ('Plot', 'Villa', 'Apartment', 'Commercial')),
  budget_range text not null,
  buying_purpose text not null check (buying_purpose in ('Investment', 'Own use', 'Business', 'Not sure')),
  timeline text not null check (timeline in ('Immediately', '1-3 months', '3-6 months', 'Just exploring')),
  preferred_contact_method text not null check (preferred_contact_method in ('Call', 'WhatsApp', 'Email')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.profiles
add column if not exists onboarding_completed boolean not null default false;

create index if not exists profiles_phone_idx on public.profiles(phone);
create index if not exists properties_category_idx on public.properties(category);
create index if not exists properties_location_idx on public.properties(location);
create index if not exists properties_featured_idx on public.properties(featured);
create index if not exists property_images_property_id_idx on public.property_images(property_id);
create index if not exists wishlist_user_id_idx on public.wishlist(user_id);
create index if not exists wishlist_property_id_idx on public.wishlist(property_id);
create index if not exists site_visits_user_id_idx on public.site_visits(user_id);
create index if not exists site_visits_property_id_idx on public.site_visits(property_id);
create index if not exists documents_user_id_idx on public.documents(user_id);
create index if not exists payments_user_id_idx on public.payments(user_id);
create index if not exists notifications_user_id_read_idx on public.notifications(user_id, read);
create index if not exists leads_user_id_idx on public.leads(user_id);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists customer_preferences_user_id_idx on public.customer_preferences(user_id);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

drop trigger if exists site_visits_set_updated_at on public.site_visits;
create trigger site_visits_set_updated_at
before update on public.site_visits
for each row execute function public.set_updated_at();

drop trigger if exists documents_set_updated_at on public.documents;
create trigger documents_set_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

drop trigger if exists notifications_set_updated_at on public.notifications;
create trigger notifications_set_updated_at
before update on public.notifications
for each row execute function public.set_updated_at();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

drop trigger if exists customer_preferences_set_updated_at on public.customer_preferences;
create trigger customer_preferences_set_updated_at
before update on public.customer_preferences
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select p.is_admin from public.profiles p where p.id = auth.uid()), false);
$$;

alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.wishlist enable row level security;
alter table public.site_visits enable row level security;
alter table public.documents enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;
alter table public.leads enable row level security;
alter table public.customer_preferences enable row level security;

drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own" on public.profiles
for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles
for insert with check (id = auth.uid());

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "properties public read" on public.properties;
create policy "properties public read" on public.properties
for select using (true);

drop policy if exists "properties admin write" on public.properties;
create policy "properties admin write" on public.properties
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "property images public read" on public.property_images;
create policy "property images public read" on public.property_images
for select using (true);

drop policy if exists "property images admin write" on public.property_images;
create policy "property images admin write" on public.property_images
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "wishlist read own" on public.wishlist;
create policy "wishlist read own" on public.wishlist
for select using (user_id = auth.uid());

drop policy if exists "wishlist insert own" on public.wishlist;
create policy "wishlist insert own" on public.wishlist
for insert with check (user_id = auth.uid());

drop policy if exists "wishlist delete own" on public.wishlist;
create policy "wishlist delete own" on public.wishlist
for delete using (user_id = auth.uid());

drop policy if exists "site visits read own" on public.site_visits;
create policy "site visits read own" on public.site_visits
for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "site visits insert own" on public.site_visits;
create policy "site visits insert own" on public.site_visits
for insert with check (user_id = auth.uid());

drop policy if exists "site visits update own" on public.site_visits;
create policy "site visits update own" on public.site_visits
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "documents read own" on public.documents;
create policy "documents read own" on public.documents
for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "documents admin write" on public.documents;
create policy "documents admin write" on public.documents
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "payments read own" on public.payments;
create policy "payments read own" on public.payments
for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "payments admin write" on public.payments;
create policy "payments admin write" on public.payments
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "notifications read own" on public.notifications;
create policy "notifications read own" on public.notifications
for select using (user_id = auth.uid());

drop policy if exists "notifications update own" on public.notifications;
create policy "notifications update own" on public.notifications
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "notifications admin write" on public.notifications;
create policy "notifications admin write" on public.notifications
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "leads public insert" on public.leads;
create policy "leads public insert" on public.leads
for insert with check (true);

drop policy if exists "leads read own" on public.leads;
create policy "leads read own" on public.leads
for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "leads update admin" on public.leads;
create policy "leads update admin" on public.leads
for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "customer preferences read own" on public.customer_preferences;
create policy "customer preferences read own" on public.customer_preferences
for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "customer preferences insert own" on public.customer_preferences;
create policy "customer preferences insert own" on public.customer_preferences
for insert with check (user_id = auth.uid());

drop policy if exists "customer preferences update own" on public.customer_preferences;
create policy "customer preferences update own" on public.customer_preferences
for update using (user_id = auth.uid()) with check (user_id = auth.uid());
