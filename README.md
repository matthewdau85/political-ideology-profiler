# Political Ideology Profiler

Political Ideology Profiler is a production-focused React + Vercel application for measuring political positioning on economic/social axes, generating shareable outputs, and monetizing premium analysis.

## Stack
- Frontend: React 18 + Vite
- APIs: Vercel Functions
- Auth: Supabase Auth (REST)
- Payments: Stripe Checkout + webhooks
- Data/limits: Upstash Redis
- Analytics: PostHog or Plausible
- Ads: AdSense/Carbon/custom via `AdSlot`

## Quick Start
```bash
npm install
npm run dev
```

## Build & Test
```bash
npm test
npm run build
```

## Environment Variables
Copy `.env.example` and configure all required values.

Critical variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `APP_ORIGIN`
- `ALLOWED_ORIGINS`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## Deployment (Vercel)
1. Import repository into Vercel.
2. Add environment variables.
3. Configure Stripe webhook endpoint: `/api/stripe-webhook`.
4. Deploy and run launch checklist.

## Documentation Index
- `ARCHITECTURE.md`
- `CODE_AUDIT.md`
- `METHODOLOGY.md`
- `TYPOLOGY_MODEL.md`
- `DATA_DICTIONARY.md`
- `INSIGHTS_METHODS.md`
- `SECURITY_MODEL.md`
- `PAYMENTS.md`
- `STRIPE_SETUP.md`
- `BILLING_ARCHITECTURE.md`
- `ENTITLEMENTS.md`
- `OWNER_OPS.md`
- `ANALYTICS.md`
- `AD_SYSTEM.md`
- `SHARING_SYSTEM.md`
- `REPORT_ENGINE.md`
- `PERFORMANCE.md`
- `DEPLOYMENT.md`
- `LAUNCH_CHECKLIST.md`
- `PRICING_STRATEGY.md`
- `PERSONA_REVIEW_SUMMARY.md`

## Roadmap
- Server-side report persistence
- Enterprise/research export APIs
- Expanded localization and country datasets

## Key Routes
- `/insights` — typology, country, age-band dashboard with subgroup suppression
- `/api/stripe/create-checkout-session` — create checkout
- `/api/stripe/webhook` — Stripe webhook
- `/api/entitlements/me` — current user entitlements
- `/api/entitlements/verify` — feature access verification
