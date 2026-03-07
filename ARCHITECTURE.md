# ARCHITECTURE

## System Components
- **SPA**: quiz, scoring, visualization, sharing, profile.
- **API layer**: `collect`, `stats`, `contact`, `create-checkout-session`, `verify-entitlement`, `stripe-webhook`.
- **Auth**: Supabase Auth (REST + JWT bearer).
- **Payments**: Stripe Checkout + webhook updates.
- **Storage**: Upstash Redis (stats, queue, entitlements, rate limiting).

## Request Flow
1. User signs up/signs in via Supabase.
2. Premium click calls `/api/create-checkout-session`.
3. Stripe redirects user to hosted checkout.
4. Stripe webhook posts to `/api/stripe-webhook`.
5. Entitlement written to Redis.
6. Frontend calls `/api/verify-entitlement` before showing premium content.
