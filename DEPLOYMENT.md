# DEPLOYMENT

## Vercel Setup
1. Connect GitHub repo.
2. Configure environment variables from `.env.example`.
3. Set webhook endpoint to `/api/stripe-webhook`.
4. Deploy.

## Verification
- `npm run build`
- `npm test`
- Validate auth, checkout, webhook, entitlement flows.

## Rollback
- Use Vercel previous deployment rollback.
- Disable Stripe price IDs or webhook if incident affects billing.
