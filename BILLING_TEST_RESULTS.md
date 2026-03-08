# Billing Test Results

Date: 2026-03-07
Environment: Local validation + code-path simulation + unit tests; production Stripe dashboard replay pending operator execution.

| Scenario | Expected outcome | Actual outcome | Status |
|---|---|---|---|
| Successful purchase (`checkout.session.completed`) | Payment row written, entitlement granted | Handler writes payment + grant path implemented and validated by code-path/unit review | Pass (code-path) |
| Failed payment (`invoice.payment_failed`) | Payment row written, membership revoked | Handler revocation logic implemented | Pass (code-path) |
| Webhook retry/duplicate | Duplicate ignored via processed event table | `isWebhookEventProcessed` short-circuit + unique event id table | Pass (code-path) |
| Subscription cancellation (`customer.subscription.deleted`) | Membership entitlements revoked | Implemented revoke path | Pass (code-path) |
| Refund (`charge.refunded`) | Refund payment row + entitlement revoke | Implemented with product inference fallback | Pass (code-path) |
| Subscription update (`customer.subscription.updated`) | Active/trialing grant else revoke | Implemented status-driven toggle | Pass (code-path) |

## Automated evidence
- `api/_lib/billingConfig.test.js` passes.
- `api/_lib/stripe.test.js` passes.

## External operator validation still required
1. Stripe dashboard replay for each event type in test mode.
2. Confirm Supabase table mutations in real deployment.
3. Capture screenshot/evidence links in `DOC_APPROVAL_MATRIX.md`.
