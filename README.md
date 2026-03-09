# Ideology Compass

Ideology Compass is a production-intended React + Vercel application for measuring political positioning on economic/social axes, generating shareable outputs, and monetizing premium analysis.

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

Critical frontend variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`

Critical server variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_DEEP_ANALYSIS`
- `STRIPE_PRICE_REPORT`
- `STRIPE_PRICE_COUNTRY_COMPARE`
- `STRIPE_PRICE_FRIEND_COMPARE`
- `STRIPE_PRICE_PREMIUM_MEMBERSHIP`
- `APP_ORIGIN`
- `ALLOWED_ORIGINS`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `ADMIN_API_TOKEN` (owner endpoint auth)
- `TURNSTILE_SECRET_KEY` (optional bot protection on sensitive endpoints)

### Important env behavior (Vite + Vercel)
- Frontend code can only read variables prefixed with `VITE_`.
- Vite env variables are injected at build time.
- Updating env vars in Vercel **requires a redeploy** before the app can use the new values.
- Never expose server-only secrets (e.g., `SUPABASE_SERVICE_ROLE_KEY`) in frontend code.

## Deployment (Vercel)
1. Import repository into Vercel.
2. Configure environment variables for **Production** and **Preview** environments.
3. Required frontend vars for each environment:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Configure Stripe webhook endpoint: `/api/stripe/webhook`.
5. Redeploy after env changes.
6. Open the deployed app and confirm no configuration error banner appears.

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
- `SUPABASE_SETUP.md`
- `SUPABASE_PRODUCTION_CHECKLIST.md`
- `SUPABASE_FRONTEND_INTEGRATION.md`
- `SUPABASE_CODE_AUDIT.md`
- `AD_PARTNER_READINESS_ASSESSMENT.md`
- `PRODUCTION_GAP_CLOSURE_ASSESSMENT.md`
- `PWA_READINESS_ASSESSMENT.md`
- `PRIVACY_POLICY.md`
- `TERMS.md`
- `CONSENT_AND_DATA_USE.md`
- `INCIDENT_RESPONSE.md`
- `KEY_ROTATION_RUNBOOK.md`
- `SECURITY_MONITORING.md`
- `SLO_AND_ALERTING.md`
- `ONCALL_RUNBOOK.md`
- `METHODOLOGY_VERSIONING.md`
- `RESEARCH_LIMITATIONS.md`
- `VALIDATION_STATUS.md`
- `PWA_OPERATIONS.md`
- `LIGHTHOUSE_BASELINES.md`
- `AD_POLICY_COMPLIANCE.md`
- `AD_INCIDENT_RUNBOOK.md`
- `CONSENT_MODE_GUIDE.md`
- `DOCS_COMPLETION_MATRIX.md`
- `FINAL_PRODUCTION_READINESS_REVIEW.md`
- `PUBLIC_SCRUTINY_HARDENING_REPORT.md`
- `PERSONA_REASSESSMENT.md`
- `PRODUCTION_VALIDATION_REPORT.md`
- `AD_COMPLIANCE_CHECKLIST.md`
- `PWA_READINESS_REPORT.md`
- `DATA_GOVERNANCE.md`
- `METHODOLOGY_VALIDATION.md`
- `LEGAL_REVIEW_SUMMARY.md`
- `BILLING_TEST_RESULTS.md`
- `OBSERVABILITY_SETUP.md`
- `SECURITY_HARDENING_REPORT.md`
- `DOC_APPROVAL_MATRIX.md`

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
- `/api/admin/billing-overview` — owner billing audit endpoint
