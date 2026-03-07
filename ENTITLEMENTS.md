# ENTITLEMENTS

## Model
Each user has entitlement records keyed by feature id.

Fields stored:
- `active`
- `grantedAt` / `revokedAt`
- Stripe metadata (session id, charge id, source event)

## Verification paths
- Frontend premium gates call `/api/entitlements/verify?feature=...`
- Profile and admin tooling can call `/api/entitlements/me`

## Membership behavior
If `premium_membership.active=true`, all premium feature checks pass.
