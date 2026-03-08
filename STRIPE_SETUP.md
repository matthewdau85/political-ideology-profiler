# STRIPE SETUP

## Governance Metadata
- Author: Payments Architect
- Reviewer: DevOps / SRE
- Approval status: Approved (Internal)
- Version: v2.2
- Last review date: 2026-03-07
- Evidence links:
  - `BILLING_TEST_PLAN.md`
  - `.env.example`

## 1) Create Stripe products/prices

Create these products in Stripe with one price each:
- `deep_analysis` (one-time)
- `report` (one-time)
- `country_compare` (one-time)
- `friend_compare` (one-time)
- `premium_membership` (recurring yearly)

## 2) Configure Vercel environment variables

Required server variables:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_DEEP_ANALYSIS`
- `STRIPE_PRICE_REPORT`
- `STRIPE_PRICE_COUNTRY_COMPARE`
- `STRIPE_PRICE_FRIEND_COMPARE`
- `STRIPE_PRICE_PREMIUM_MEMBERSHIP`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APP_ORIGIN`

Optional legacy fallback vars supported for migration only:
- `STRIPE_PRICE_COUNTRY_COMPARISON`
- `STRIPE_PRICE_FRIEND_COMPARISON`
- `STRIPE_PRICE_MEMBERSHIP`

Frontend variable (for client boot + checkout initiation):
- `VITE_STRIPE_PUBLISHABLE_KEY`

## 3) Configure webhook endpoint

- Endpoint URL: `https://<your-domain>/api/stripe/webhook`
- Events to subscribe:
  - `checkout.session.completed`
  - `invoice.paid`
  - `invoice.payment_failed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `charge.refunded`

## 4) Verify checkout flow

- Call `/api/stripe/create-checkout-session` from authenticated session only.
- Confirm response includes checkout URL.
- Complete payment in Stripe test mode.

## 5) Verify webhook + fulfillment

After checkout completion, verify in Supabase:
- `payments` row written with event metadata.
- `entitlements` row(s) active.
- `processed_webhook_events` row status is `processed`.

## 6) Go-live

- Rotate to live Stripe keys and live price IDs.
- Re-run the full `BILLING_TEST_PLAN.md` in live-like staging.
- Confirm owner API works:
  - `GET /api/admin/billing-overview` with `Authorization: Bearer <ADMIN_API_TOKEN>`
