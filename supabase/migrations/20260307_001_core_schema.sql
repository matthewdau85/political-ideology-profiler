-- Political Ideology Profiler: core Supabase schema
-- Run in Supabase SQL Editor or via `supabase db push`

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  country text,
  age_band text,
  methodology_version text,
  quiz_version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  economic_score numeric(5,2) not null,
  social_score numeric(5,2) not null,
  ideological_cluster text not null,
  typology text,
  secondary_typology text,
  typology_fit_score numeric(5,2),
  radar_scores jsonb not null default '[]'::jsonb,
  top_issues text[] not null default '{}',
  closest_figures jsonb not null default '[]'::jsonb,
  country text,
  age_band text,
  methodology_version text,
  quiz_version text,
  source text not null default 'web',
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feature text not null,
  active boolean not null default false,
  source text,
  stripe_session_id text,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_payment_intent_id text,
  granted_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, feature)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  feature text,
  status text not null,
  amount_total bigint,
  currency text,
  stripe_event_id text unique,
  stripe_session_id text,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_payment_intent_id text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.aggregate_insights_daily (
  id bigserial primary key,
  bucket_date date not null,
  country text not null,
  age_band text not null,
  methodology_version text,
  quiz_version text,
  sample_size integer not null default 0,
  avg_economic_score numeric(6,3),
  avg_social_score numeric(6,3),
  cluster_distribution jsonb not null default '{}'::jsonb,
  typology_distribution jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(bucket_date, country, age_band, methodology_version, quiz_version)
);

-- Indexes
create index if not exists idx_quiz_results_user_occurred on public.quiz_results(user_id, occurred_at desc);
create index if not exists idx_entitlements_user_active on public.entitlements(user_id, active);
create index if not exists idx_payments_user_occurred on public.payments(user_id, occurred_at desc);
create index if not exists idx_payments_stripe_customer on public.payments(stripe_customer_id);
create index if not exists idx_aggregate_insights_bucket on public.aggregate_insights_daily(bucket_date desc);

-- Updated-at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_entitlements_updated_at on public.entitlements;
create trigger trg_entitlements_updated_at
before update on public.entitlements
for each row execute function public.set_updated_at();

drop trigger if exists trg_aggregate_insights_updated_at on public.aggregate_insights_daily;
create trigger trg_aggregate_insights_updated_at
before update on public.aggregate_insights_daily
for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.quiz_results enable row level security;
alter table public.entitlements enable row level security;
alter table public.payments enable row level security;
alter table public.aggregate_insights_daily enable row level security;

-- profiles policies
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

-- quiz_results policies
create policy "quiz_results_select_own"
on public.quiz_results
for select
using (auth.uid() = user_id);

create policy "quiz_results_insert_own"
on public.quiz_results
for insert
with check (auth.uid() = user_id);

create policy "quiz_results_delete_own"
on public.quiz_results
for delete
using (auth.uid() = user_id);

-- entitlements policies
create policy "entitlements_select_own"
on public.entitlements
for select
using (auth.uid() = user_id);

-- payments policies (read own only)
create policy "payments_select_own"
on public.payments
for select
using (auth.uid() = user_id);

-- aggregate insights policy (public readonly)
create policy "aggregate_insights_public_read"
on public.aggregate_insights_daily
for select
using (true);

-- Prevent writes from non-service roles on privileged tables
revoke insert, update, delete on public.entitlements from authenticated, anon;
revoke insert, update, delete on public.payments from authenticated, anon;
revoke insert, update, delete on public.aggregate_insights_daily from authenticated, anon;

