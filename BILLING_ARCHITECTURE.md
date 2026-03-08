# BILLING ARCHITECTURE

## Governance Metadata
- Author: Payments Architect
- Reviewer: Security Engineer
- Approval status: Approved (Internal)
- Version: v2.3
- Last review date: 2026-03-07
- Evidence links:
  - `STRIPE_BACKEND_AUDIT.md`
  - `BILLING_TEST_RESULTS.md`

## Core server routes

- `POST /api/stripe/create-checkout-session`
- `POST /api/stripe/webhook`
- `GET /api/entitlements/me`
- `GET /api/entitlements/verify`
- `GET /api/admin/billing-overview` (owner-only)

## Flow

1. Authenticated user requests checkout session with product key.
2. Server validates product key and maps to Stripe price ID.
3. Stripe Checkout session is created server-side.
4. Stripe sends signed webhook events.
5. Server verifies signature and processes events idempotently.
6. Canonical writes:
   - `payments` ledger rows
   - `entitlements` state rows
   - `processed_webhook_events` processing status
7. Frontend premium gates call entitlement APIs; browser state is not canonical.

## Product -> entitlement model

- One-time products grant feature-specific entitlement:
  - `deep_analysis`, `report`, `country_compare`, `friend_compare`
- Membership grants:
  - `premium_membership`
  - `premium_all` umbrella entitlement

## Idempotency model

- `processed_webhook_events.stripe_event_id` is unique.
- Webhook route short-circuits already-processed events.
- `payments` are upserted by `stripe_event_id` when present.
- Entitlements are upserted by `(user_id, feature)`.
