-- Onboarding migration for existing Rivan Supabase projects.
-- Paste into Supabase SQL Editor if schema.sql was already applied before onboarding existed.

alter table public.profiles
add column if not exists onboarding_completed boolean not null default false;

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

create index if not exists customer_preferences_user_id_idx on public.customer_preferences(user_id);

drop trigger if exists customer_preferences_set_updated_at on public.customer_preferences;
create trigger customer_preferences_set_updated_at
before update on public.customer_preferences
for each row execute function public.set_updated_at();

alter table public.customer_preferences enable row level security;

drop policy if exists "customer preferences read own" on public.customer_preferences;
create policy "customer preferences read own" on public.customer_preferences
for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "customer preferences insert own" on public.customer_preferences;
create policy "customer preferences insert own" on public.customer_preferences
for insert with check (user_id = auth.uid());

drop policy if exists "customer preferences update own" on public.customer_preferences;
create policy "customer preferences update own" on public.customer_preferences
for update using (user_id = auth.uid()) with check (user_id = auth.uid());
