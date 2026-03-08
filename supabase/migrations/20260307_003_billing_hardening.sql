-- Billing hardening: canonical webhook event store + payment/entitlement audit columns

alter table if exists public.payments
  add column if not exists product_key text,
  add column if not exists amount_cents bigint,
  add column if not exists stripe_checkout_session_id text,
  add column if not exists raw_event jsonb not null default '{}'::jsonb,
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_payments_product_key on public.payments(product_key);
create index if not exists idx_payments_checkout_session on public.payments(stripe_checkout_session_id);
create index if not exists idx_payments_subscription on public.payments(stripe_subscription_id);
create index if not exists idx_payments_payment_intent on public.payments(stripe_payment_intent_id);

update public.payments
set
  product_key = coalesce(product_key, feature),
  amount_cents = coalesce(amount_cents, amount_total),
  stripe_checkout_session_id = coalesce(stripe_checkout_session_id, stripe_session_id),
  raw_event = case
    when raw_event = '{}'::jsonb and metadata is not null then metadata
    else raw_event
  end,
  updated_at = coalesce(updated_at, created_at, now());

alter table if exists public.entitlements
  add column if not exists feature_key text,
  add column if not exists status text;

update public.entitlements
set
  feature_key = coalesce(feature_key, feature),
  status = coalesce(status, case when active then 'active' else 'revoked' end);

create table if not exists public.processed_webhook_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  stripe_event_type text not null,
  status text not null,
  error_message text,
  raw_event jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_processed_webhook_events_status on public.processed_webhook_events(status);
create index if not exists idx_processed_webhook_events_updated_at on public.processed_webhook_events(updated_at desc);

alter table public.processed_webhook_events enable row level security;

drop policy if exists "processed_webhook_events_no_client_access" on public.processed_webhook_events;
create policy "processed_webhook_events_no_client_access"
on public.processed_webhook_events
for select
using (false);

revoke all on public.processed_webhook_events from authenticated, anon;
