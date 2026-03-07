# SUPABASE_SETUP

This guide sets up Supabase for Ideology Compass on Vercel (React + Vite frontend + serverless API routes).

## 0) Architecture boundaries (important)
- **Browser (Vite)** uses only:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- **Server-only (Vercel Functions)** uses:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- **Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code.**
- Vite env vars are injected at build time. **After changing Vercel env vars, redeploy.**

---

## 1) Create dev and prod Supabase projects
1. In Supabase dashboard, create two projects:
   - `ideology-compass-dev`
   - `ideology-compass-prod`
2. Keep regions close to your Vercel region.
3. Record for each project:
   - Project URL
   - anon key
   - service role key

---

## 2) Auth settings to enable
In **Authentication → Providers → Email**:
1. Enable Email provider.
2. Choose either:
   - Confirm email ON (recommended for production), or
   - Confirm email OFF (faster beta onboarding).
3. Disable insecure providers you do not use.

In **Authentication → URL Configuration**:
1. Site URL (prod): `https://<your-prod-domain>`
2. Redirect URLs:
   - `http://localhost:5173/profile`
   - `http://localhost:5173`
   - `https://<your-preview-domain>.vercel.app/profile`
   - `https://<your-preview-domain>.vercel.app`
   - `https://<your-prod-domain>/profile`
   - `https://<your-prod-domain>`

---

## 3) Email options to configure
In **Authentication → Email Templates**:
1. Customize Confirm Signup template.
2. Set sender domain (SPF/DKIM/DMARC) before production.
3. Verify deliverability using test inboxes.

---

## 4) Run SQL migrations
Use either SQL editor or CLI.

### Option A: SQL editor
1. Open **SQL Editor**.
2. Run file: `supabase/migrations/20260307_001_core_schema.sql`.

### Option B: Supabase CLI
1. Install CLI and login:
   - `supabase login`
2. Link project:
   - `supabase link --project-ref <project-ref>`
3. Apply migrations:
   - `supabase db push`

---

## 5) RLS enablement and policies
The migration enables RLS and creates policies for:
- `profiles`: read/update/insert own row only.
- `quiz_results`: read/insert/delete own rows only.
- `entitlements`: read own rows only.
- `payments`: read own rows only.
- `aggregate_insights_daily`: public read-only.

Privileged writes are revoked from `anon`/`authenticated` for:
- `entitlements`
- `payments`
- `aggregate_insights_daily`

Those are written by server-side service-role operations only.

---

## 6) Required indexes
Created by migration:
- `idx_quiz_results_user_occurred`
- `idx_entitlements_user_active`
- `idx_payments_user_occurred`
- `idx_payments_stripe_customer`
- `idx_aggregate_insights_bucket`

---

## 7) Vercel environment variables
Set in Vercel for **both Preview and Production** where relevant.

### Frontend (build-time)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Server-only
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Also required for payments flow:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_DEEP_ANALYSIS`
- `STRIPE_PRICE_REPORT`
- `STRIPE_PRICE_COUNTRY_COMPARISON`
- `STRIPE_PRICE_FRIEND_COMPARISON`
- `STRIPE_PRICE_MEMBERSHIP`
- `APP_ORIGIN`

After env changes: **redeploy**.

---

## 8) Stripe + entitlement sync notes
- Checkout session metadata includes `userId` and `feature`.
- Stripe webhook writes:
  - `payments` rows (event log)
  - `entitlements` upsert rows
- Premium gate always checks `/api/entitlements/verify` server-side.

---

## 9) Settings to change before production
1. Turn on email confirmation (if not already).
2. Enforce stronger password policy.
3. Configure custom SMTP.
4. Review auth rate limits.
5. Restrict redirect URLs to approved domains only.
6. Ensure no test keys in prod.

---

## 10) Key handling rules
- `anon` key may be in browser (`VITE_SUPABASE_ANON_KEY`).
- `service_role` key is server-only.
- Never log service keys in API responses.
- Rotate service role key on incident or team change.

---

## 11) End-to-end test procedure
1. Create account from `/profile`.
2. Confirm login and session hydration.
3. Complete quiz while logged in.
4. Confirm `/api/me/results` returns saved result.
5. Confirm `/api/me/profile` returns profile row.
6. Start Stripe checkout and complete payment (test mode).
7. Trigger webhook and verify:
   - `payments` has event row
   - `entitlements` feature row is active
8. Open premium page and verify access gate passes.
9. Delete user data and confirm `quiz_results` rows removed.
10. Delete account and confirm user can no longer authenticate.

