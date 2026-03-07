# STRIPE SETUP

1. Create five Stripe Prices matching feature SKUs:
   - Deep ideological analysis ($5 one-time)
   - Political personality report ($12 one-time)
   - Country comparison ($5 one-time)
   - Friend comparison ($3 one-time)
   - Annual membership ($25 recurring yearly)
2. Set env vars:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_PRICE_DEEP_ANALYSIS`
   - `STRIPE_PRICE_REPORT`
   - `STRIPE_PRICE_COUNTRY_COMPARISON`
   - `STRIPE_PRICE_FRIEND_COMPARISON`
   - `STRIPE_PRICE_MEMBERSHIP`
3. Configure webhook endpoint to `/api/stripe/webhook`.
4. Verify checkout from `/pricing` and entitlement verification via `/api/entitlements/me`.
