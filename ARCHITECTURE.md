# ARCHITECTURE

## System Components
- **SPA**: quiz, scoring, visualization, sharing, profile.
- **API layer**: `collect`, `stats`, `contact`, `stripe/create-checkout-session`, `entitlements/verify`, `stripe/webhook`, `me/*`.
- **Auth**: Supabase Auth (REST + JWT bearer).
- **Payments**: Stripe Checkout + webhook updates.
- **Storage**: Supabase (auth, profiles, quiz results, entitlements, payments) + Upstash Redis (rate limiting and selected caches).

## Request Flow
1. User signs up/signs in via Supabase.
2. Premium click calls `/api/stripe/create-checkout-session`.
3. Stripe redirects user to hosted checkout.
4. Stripe webhook posts to `/api/stripe/webhook`.
5. Entitlement written to Supabase (`public.entitlements`) via webhook handling.
6. Frontend calls `/api/entitlements/verify` before showing premium content.
