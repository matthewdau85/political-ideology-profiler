# SUPABASE_PRODUCTION_CHECKLIST

Use this checklist before public launch.

## Access and account security
- [ ] Owner Supabase account has MFA/2FA enabled.
- [ ] At least one backup owner/admin has MFA enabled.
- [ ] No shared root credentials; each operator has own account.

## Environment separation
- [ ] Separate Supabase projects for dev and prod.
- [ ] Vercel Preview points to dev Supabase project.
- [ ] Vercel Production points to prod Supabase project.
- [ ] No cross-environment key reuse.

## Keys and secret handling
- [ ] `SUPABASE_SERVICE_ROLE_KEY` exists only in server-side env vars.
- [ ] Browser only has `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`.
- [ ] Key rotation runbook documented and tested.

## RLS and schema hardening
- [ ] RLS enabled on `profiles`, `quiz_results`, `entitlements`, `payments`, and aggregate tables.
- [ ] Policies verified for own-data access only.
- [ ] Privileged table writes (`entitlements`, `payments`) blocked for anon/authenticated roles.
- [ ] Migrations are versioned under `supabase/migrations/`.

## Auth and email
- [ ] Email auth provider configured for production.
- [ ] Custom SMTP configured with SPF, DKIM, DMARC.
- [ ] Redirect URLs restricted to localhost + approved Vercel/prod domains.
- [ ] Password policies reviewed and enforced.

## Abuse protection and incident resilience
- [ ] API rate limiting active on auth-adjacent and write endpoints.
- [ ] CAPTCHA/risk scoring plan documented for signup/contact abuse.
- [ ] Stripe webhook signature validation enabled.

## Backup and recovery
- [ ] Backups/PITR configured according to RPO/RTO goals.
- [ ] Restore drill performed and documented.
- [ ] Critical tables export strategy validated.

## Monitoring and alerting
- [ ] Supabase logs monitored for auth anomalies and RLS denials.
- [ ] Vercel function error rate alerting enabled.
- [ ] Payment webhook failure alerting configured.

## Network and transport security
- [ ] SSL/TLS enforced (default Supabase/Vercel HTTPS).
- [ ] No plaintext secrets in logs.
- [ ] Access to admin dashboards restricted by org controls.

## Deployment discipline
- [ ] Team understands Vite envs are build-time injected.
- [ ] Any Vercel env var changes trigger a redeploy.
- [ ] Production smoke test run after every deploy.

