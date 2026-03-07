# Key Rotation Runbook

## Scope
Covers rotation of:
- Supabase service role key
- Stripe webhook secret
- API provider keys

## Trigger Events
- Scheduled quarterly rotation
- Personnel changes
- Suspected key exposure
- Provider security advisory

## Procedure
1. Generate new key/secret in provider dashboard.
2. Update Vercel environment variables in non-production first.
3. Validate preview deployment behavior.
4. Promote to production env vars.
5. Redeploy production (required for Vite client keys and recommended for consistency).
6. Validate auth, billing, and webhook flows.
7. Revoke old keys.

## Validation Checklist
- Login/signup succeeds
- Premium checkout + webhook succeeds
- Entitlement verification succeeds
- No elevated error rate after deployment
