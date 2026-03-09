# Observability Setup

Date: 2026-03-07

## Monitoring stack
- Application/runtime errors: Sentry (frontend + API).
- Structured API logs: Vercel log drains / Logflare.
- Data/backend logs: Supabase logs + Postgres query stats.
- Billing: Stripe webhook delivery dashboard + internal webhook event table.

## Dashboards
1. API reliability dashboard
   - `5xx` rate by endpoint
   - p95 latency by endpoint
   - auth failure rate (`401/403`)
2. Billing dashboard
   - checkout session creations
   - webhook failures (`processed_webhook_events.status=failed`)
   - payment failures/refunds
3. Entitlement integrity dashboard
   - active entitlements by feature
   - entitlement mismatches (payment success with missing entitlement)

## Alerts and thresholds
- API error rate > 2% for 5m: page on-call.
- `processed_webhook_events.status=failed` > 0 for 10m: page billing owner.
- `invoice_payment_failed` events > baseline + 3σ daily: investigate payment processing.
- `429` spikes > 5x baseline on checkout/contact: trigger bot-abuse runbook.

## Runbooks
- Webhook failure: see `WEBHOOK_EVENTS.md` and `OWNER_OPS.md`.
- Security incident: see `INCIDENT_RESPONSE.md`.
- Key rotation: see `KEY_ROTATION_RUNBOOK.md`.

## Implementation checklist
- [ ] Sentry DSN configured in Vercel.
- [ ] Log drain configured.
- [ ] Supabase log retention verified.
- [ ] Pager routing tested.
