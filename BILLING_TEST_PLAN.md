# Billing Test Plan

## Automated tests

1. Product mapping tests (`api/_lib/billingConfig.test.js`)
   - valid product key returns price id
   - legacy aliases normalize correctly
   - unknown product key rejected
2. Webhook signature tests (`api/_lib/stripe.test.js`)
   - valid signature accepted
   - invalid signature rejected
   - expired timestamp rejected

## Manual integration tests (Stripe test mode)

### Preconditions
- Vercel env vars set for all Stripe prices and webhook secret.
- Supabase migration `20260307_003_billing_hardening.sql` applied.
- Stripe webhook endpoint configured: `https://<domain>/api/stripe/webhook`.

### Test cases

1. **Checkout success (one-time product)**
   - Start purchase for `deep_analysis`.
   - Complete Stripe Checkout with test card.
   - Verify:
     - `payments` row inserted with status `checkout_completed`.
     - `entitlements` row(s) active for product.
     - `/api/entitlements/verify?feature=deep_analysis` returns `entitled: true`.

2. **Checkout success (membership subscription)**
   - Start purchase for `premium_membership`.
   - Complete checkout.
   - Verify:
     - payment rows for checkout + invoice flow.
     - `premium_membership` and `premium_all` entitlements active.

3. **Invoice payment failed**
   - Use Stripe test clock or failing card for recurring invoice.
   - Verify entitlement revocation and payment status `invoice_payment_failed`.

4. **Subscription updated/deleted**
   - Cancel subscription in Stripe test dashboard.
   - Verify entitlement revocation and webhook processed status.

5. **Refund flow**
   - Refund a test payment.
   - Verify payment status `charge_refunded` and entitlement revocation according to policy.

6. **Idempotency**
   - Replay same Stripe event from dashboard.
   - Verify:
     - no duplicate grants/revokes.
     - `processed_webhook_events` prevents duplicate processing.

7. **Owner operations API**
   - Call `/api/admin/billing-overview` with valid `Authorization: Bearer <ADMIN_API_TOKEN>`.
   - Verify summaries and records are returned.
   - Confirm 403 without token.

## Go-live checklist

- [ ] All required env vars present in Production and Preview.
- [ ] Webhook signing secret set and endpoint active.
- [ ] Manual tests 1–7 completed in test mode.
- [ ] Billing owner has runbook and API access token.
