# BILLING ARCHITECTURE

- Checkout API: `/api/stripe/create-checkout-session`
- Webhook API: `/api/stripe/webhook`
- Entitlement APIs: `/api/entitlements/me`, `/api/entitlements/verify`

## Event lifecycle
- `checkout.session.completed` -> grant entitlement
- `charge.refunded` -> revoke entitlement
- `invoice.payment_failed` -> revoke subscription access
- `customer.subscription.deleted` -> revoke subscription access

Entitlements are stored in Upstash Redis keyed by user id.
