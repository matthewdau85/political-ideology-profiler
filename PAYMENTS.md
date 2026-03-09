# PAYMENTS

## Products
- Deep analysis: $5
- Political personality report: $12
- Country comparison: $5
- Friend comparison: $3
- Annual membership: $25/year

## Flow
1. Frontend calls `/api/stripe/create-checkout-session`.
2. Checkout session is created with feature + user metadata.
3. Stripe hosted checkout handles payment.
4. `/api/stripe/webhook` grants/revokes entitlements.
5. Frontend validates access via `/api/entitlements/verify`.

## Lifecycle Events Handled
- `checkout.session.completed`
- `charge.refunded`
- `customer.subscription.deleted`
- `invoice.payment_failed`

## Required Env Vars
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, feature-specific `STRIPE_PRICE_*` values, `APP_ORIGIN`.
