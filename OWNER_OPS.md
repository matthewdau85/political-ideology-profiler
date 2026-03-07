# OWNER OPS

## Billing operations

### Daily
- Verify Stripe webhook delivery success in Stripe dashboard.
- Check `/api/admin/billing-overview` summary for:
  - failed webhook events
  - failed payments
  - unexpected entitlement revocations

### Weekly
- Reconcile Stripe dashboard totals with `payments` table totals.
- Review `processed_webhook_events` for failed entries and replay as needed.
- Confirm active subscriptions align with active membership entitlements.

## Owner API usage

`GET /api/admin/billing-overview`

Headers:
- `Authorization: Bearer <ADMIN_API_TOKEN>`

Response includes:
- payment records
- entitlement records
- webhook processing records
- summary counts

## Incident response

1. If webhook failures spike:
   - check `processed_webhook_events.status = failed`
   - inspect `error_message`
   - replay failed events from Stripe dashboard
2. If entitlement drift is found:
   - inspect related payment and webhook rows
   - patch entitlement row using admin SQL runbook
3. If checkout endpoint abuse occurs:
   - tighten rate limits
   - rotate `ADMIN_API_TOKEN` and Stripe keys if compromise suspected
