# WEBHOOK EVENTS

## Governance Metadata
- Author: Payments Architect
- Reviewer: Security Engineer
- Approval status: Approved (Internal)
- Version: v2.1
- Last review date: 2026-03-07
- Evidence links:
  - `BILLING_TEST_RESULTS.md`
  - `SECURITY_HARDENING_REPORT.md`

## Processed Stripe events

- `checkout.session.completed`
  - records payment (`checkout_completed`)
  - grants product entitlements
- `invoice.paid`
  - records payment (`invoice_paid`)
  - grants membership entitlements
- `invoice.payment_failed`
  - records payment (`invoice_payment_failed`)
  - revokes membership entitlements
- `customer.subscription.updated`
  - records subscription status event
  - grants/revokes membership based on subscription status
- `customer.subscription.deleted`
  - records event
  - revokes membership entitlements
- `charge.refunded`
  - records refund event
  - revokes entitlement per refund policy

## Idempotency and auditability

- Every webhook event is tracked in `processed_webhook_events`.
- Duplicate events are ignored after `status=processed`.
- Payment ledger uses `stripe_event_id` upsert for safe replay.

## Failure recovery

1. Find failed rows in `processed_webhook_events`.
2. Inspect `error_message` and `raw_event`.
3. Fix root cause (env, schema, logic).
4. Replay event from Stripe dashboard.
5. Verify status becomes `processed` and entitlement state is correct.
