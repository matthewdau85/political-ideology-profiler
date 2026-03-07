# Stripe Backend Audit

## What existed before

- Checkout was already server-side (`/api/stripe/create-checkout-session`) and authenticated.
- Webhook signature verification existed.
- Payment and entitlement records were being written to Supabase.

## What was insecure or incomplete

1. Product key/env naming mismatch (`country_comparison` vs requested `country_compare`, etc.) could drift between frontend/backend and Stripe config.
2. Webhook processing was not fully idempotent at an event-processing table level.
3. No canonical processed-webhook event ledger for replay/failure recovery.
4. Subscription lifecycle handling was incomplete (`invoice.paid`, `customer.subscription.updated` missing).
5. Payment records lacked canonical `raw_event` and `updated_at` fields for stronger auditability.
6. No secure owner API for billing/entitlement/webhook state inspection.

## What changed

1. Added canonical product config module with strict mapping + alias support:
   - `api/_lib/billingConfig.js`
2. Added runtime server env validation for billing routes:
   - `api/_lib/serverEnv.js`
3. Hardened checkout creation endpoint:
   - authenticated user required
   - only known product keys accepted
   - server maps product key -> Stripe price id
4. Hardened webhook pipeline with idempotent event handling:
   - `processed_webhook_events` tracking
   - duplicate short-circuit
   - processing/processed/failed state transitions
   - explicit event handlers for checkout/subscription/failure/refund lifecycle
5. Expanded canonical payment and entitlement persistence:
   - payment rows include `product_key`, `amount_cents`, `stripe_checkout_session_id`, `raw_event`, `updated_at`
   - entitlements keep canonical source/status and are updated server-side only
6. Added secure owner inspection API:
   - `/api/admin/billing-overview`
   - protected by `ADMIN_API_TOKEN`
7. Added migration:
   - `supabase/migrations/20260307_003_billing_hardening.sql`

## What remains optional for later

- Stripe API expansion for partial refunds/dispute-specific entitlement policy.
- Dedicated internal admin UI (current implementation provides secure API + docs).
- Advanced reconciliation cron job that cross-checks Stripe API vs local ledger nightly.
