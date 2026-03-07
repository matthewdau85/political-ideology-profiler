# SECURITY MODEL

## Controls
- Bearer-token authentication validated against Supabase user endpoint on server.
- Server-side entitlement checks for every premium gate.
- Rate limiting middleware on all public APIs.
- Honeypot bot field on contact flow.
- Webhook signature verification for Stripe events.
- Restrictive CORS via `ALLOWED_ORIGINS`.

## Threats Addressed
- Client-side paywall bypass.
- Credential exposure from local reversible storage.
- API spam / low-effort abuse.
- Forged Stripe webhook requests.

## Follow-up Hardening
- Add CAPTCHA/Turnstile for contact and collection endpoints.
- Add centralized security logging and SIEM forwarding.
- Add key rotation runbook and quarterly security review.
