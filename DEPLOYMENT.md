# DEPLOYMENT

## Vercel Setup
1. Connect GitHub repository.
2. Configure environment variables from `.env.example`.
3. Set the Stripe webhook endpoint to `/api/stripe-webhook`.
4. Deploy.

## Required frontend vars (must exist in Vercel before build)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Critical behavior
- Vite only exposes vars prefixed with `VITE_` to browser code.
- Vite env values are injected at build time.
- If env vars are changed in Vercel, you must redeploy to pick them up.
- Do not expose server secrets (such as `SUPABASE_SERVICE_ROLE_KEY`) in the frontend.

## Verification
- `npm run build`
- `npm test`
- Validate auth, checkout, webhook, and entitlement flows.
- Open deployed app and confirm there is no configuration error page.

## Rollback
- Use Vercel previous deployment rollback.
- Disable Stripe price IDs or webhook if incident affects billing.
