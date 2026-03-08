# Security Hardening Report

Date: 2026-03-07

## Identified risks (from prior review)
1. Replay and duplicate webhook processing risk.
2. Weak rate-limiting window semantics.
3. Bot abuse on write-heavy/sensitive endpoints.
4. Risk of service-role misuse if leaked.
5. Client-side auth cache misuse risk.

## Implemented fixes
- Stripe webhook verification includes signature + timestamp tolerance checks and timing-safe compare.
- Webhook idempotency ledger implemented through `processed_webhook_events` state (`processing|processed|failed`).
- Rate limiter now parses configured windows (`s/m/h/d`) and enforces bucketized limits correctly.
- Optional Turnstile CAPTCHA verification implemented for sensitive endpoints:
  - `/api/stripe/create-checkout-session`
  - `/api/contact`
  - `POST /api/me/results`
- Service-role key remains server-only; server env validation added to billing paths.
- Entitlement checks remain server-side (`/api/entitlements/verify`) and browser cannot self-grant.

## Remaining risks
- Frontend still keeps session token in local storage for UX continuity; server remains canonical authority.
- CAPTCHA is optional unless `TURNSTILE_SECRET_KEY` is set in deployment.
- No WAF-level bot scoring yet (recommended for scale).

## Risk status
- Critical: 0 open
- High: 2 open (token storage/XSS blast radius, optional CAPTCHA configuration)
- Medium: 2 open (WAF/risk scoring, SIEM centralization)

## Required next controls
1. Configure Turnstile in Preview + Production.
2. Add CSP + strict script hygiene to reduce XSS risk.
3. Add centralized log shipping + anomaly detection on auth/checkout bursts.
