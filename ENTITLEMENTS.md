# ENTITLEMENTS

## Canonical source of truth

`public.entitlements` is the authoritative access control table.

The frontend may cache UX state, but entitlement truth is server-side only.

## Entitlement keys

- `deep_analysis`
- `report`
- `country_compare`
- `friend_compare`
- `premium_membership`
- `premium_all` (umbrella)

## Grant/revoke rules

- One-time purchase grants feature entitlement.
- Membership purchase grants both `premium_membership` and `premium_all`.
- Failed recurring payment, cancellation, or refund revokes corresponding entitlements.

## Verification APIs

- `GET /api/entitlements/me`: all entitlements for current user.
- `GET /api/entitlements/verify?feature=<key>`: boolean entitlement check.

## Security constraints

- No client endpoint can self-grant entitlements.
- No localStorage-only premium unlock is considered valid.
- Membership entitlement is evaluated server-side and supports umbrella access.
