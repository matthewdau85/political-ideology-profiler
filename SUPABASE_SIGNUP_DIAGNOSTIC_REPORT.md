# SUPABASE_SIGNUP_DIAGNOSTIC_REPORT

## Summary
The signup flow in this repository **does call Supabase Auth directly** (REST API), and it is wired from the UI to `POST /auth/v1/signup`. There is no mock auth path in the current codebase.

Based on code and config investigation, the most likely reason “account exists after signup but user is not visible in Supabase Auth dashboard” is a **Supabase project mismatch at deployment time** (wrong `VITE_SUPABASE_URL` / stale Vercel build-time env / checking a different Supabase project than the one the deployed frontend is using).

A secondary issue exists: there is currently **no `handle_new_user()` trigger** to auto-create `public.profiles` rows on Auth user creation, so profile rows may be missing even when Auth users exist.

---

## Root Cause
### Primary root cause (highest probability)
**Deployed frontend is likely pointed at a different Supabase project than the one being checked in the dashboard.**

Why this is the strongest conclusion:
1. Signup path is real and points to Supabase Auth endpoint.
2. No local/mock signup implementation was found.
3. Vite env vars are build-time injected; stale deployments can keep old Supabase URL/key until redeploy.
4. Docs/checklists already warn that Preview and Production should target different projects and env changes require redeploy.

### Secondary gap
`public.profiles` is not auto-populated from Auth creation because no `auth.users -> public.profiles` trigger is defined. This does **not** explain missing users in Auth dashboard, but it does explain “Auth user exists but no profile row” behavior.

---

## Evidence

## 1) Authentication code locations
- Supabase signup request:
  - `src/utils/supabaseClient.js` calls:
    - `fetch(`${supabaseUrl}/auth/v1/signup`, ...)`
- Supabase login request:
  - `src/utils/supabaseClient.js` calls:
    - `fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, ...)`
- UI signup/login wiring:
  - `src/components/ProfilePage.jsx`:
    - signup: `await createAccount(email, password)`
    - login: `await login(email, password)`
- Account creation function:
  - `src/utils/authStore.js`:
    - `createAccount()` calls `supabaseSignUp(email, password)`

**Important:** There is no `@supabase/supabase-js` `createClient(...)` usage in this repo; auth is done with direct REST fetch calls.

## 2) Supabase client configuration
- Frontend env reads:
  - `src/utils/env.js` reads:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
- Frontend auth client:
  - `src/utils/supabaseClient.js` derives endpoint from `getClientConfig()`.
- Server auth/admin env reads:
  - `api/_lib/auth.js` reads `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
  - `api/_lib/supabaseAdmin.js` reads `SUPABASE_URL` (+ fallback `VITE_SUPABASE_URL`) + `SUPABASE_SERVICE_ROLE_KEY`

Configuration pattern is structurally valid, but it is sensitive to cross-environment mismatch (frontend `VITE_*` vs server `SUPABASE_*`).

## 3) Environment variable verification
### Repository-level values
Only `.env.example` exists in repository (no real `.env` committed). Values are placeholders:
- `VITE_SUPABASE_URL=https://your-project.supabase.co`
- `VITE_SUPABASE_ANON_KEY=your-supabase-anon-key`
- `SUPABASE_URL=https://your-project.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`

### Vercel project settings
Not directly accessible from this environment. Must be verified in Vercel dashboard (Project → Settings → Environment Variables), for **Preview** and **Production** separately.

### Masking format (expected when checked live)
- `VITE_SUPABASE_URL = https://<project-ref>.supabase.co`
- `VITE_SUPABASE_ANON_KEY = eyJ...***...<suffix>`
- `SUPABASE_SERVICE_ROLE_KEY = eyJ...***...<suffix>`

## 4) Signup implementation audit
The signup implementation actually performs Supabase signup and returns parsed API errors.
No bypass patterns found (e.g., no `mockSignup()` and no localStorage-only fake user creation path for signup).

## 5) Frontend network behavior
From code-level analysis, signup is expected to call:
- `https://<VITE_SUPABASE_URL>/auth/v1/signup`

If browser Network tab does not show this request, then UI wiring/runtime JS is broken. In current source, wiring is present.

## 6) Redirect URL configuration
Actual Supabase dashboard redirect settings are not visible from repository.
Expected allowed URLs should include:
- `http://localhost:5173`
- `http://localhost:5173/auth/callback`
- `https://<your-production-domain>`
- `https://<your-production-domain>/auth/callback`
- `https://<your-preview>.vercel.app`
- `https://<your-preview>.vercel.app/auth/callback`

For email/password signup, redirect mismatch usually impacts verification/callback/login flow, but **should not prevent user row creation in `auth.users`**.

## 7) Email confirmation behavior
If email confirmation is enabled, signup may return without `access_token` (already handled by `createAccount()` via `needsEmailVerification`).
Even then, user should still appear under Supabase Auth Users.

## 8) Database trigger check (`handle_new_user`)
Current migration (`supabase/migrations/20260307_001_core_schema.sql`) defines only `set_updated_at()` triggers for table updates.
No `handle_new_user()` trigger exists for inserting into `public.profiles` from `auth.users`.

Implication:
- Auth user can exist without a `public.profiles` row unless profile is created through API PATCH flow.

## 9) Deployment build configuration
- Build command in `package.json`: `vite build`
- Vite env vars are build-time injected.
- Repo docs explicitly note redeploy is required after env changes.

This strongly supports stale/mismatched env as the likely production failure mode.

---

## Fix

### A) Fix likely project/env mismatch (required)
1. In Vercel Production envs, set:
   - `VITE_SUPABASE_URL = https://<PROD_PROJECT_REF>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY = <PROD_ANON_KEY>`
   - `SUPABASE_URL = https://<PROD_PROJECT_REF>.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY = <PROD_SERVICE_ROLE_KEY>`
2. Ensure Preview envs point to preview/dev Supabase project (not prod).
3. Redeploy (new build required for `VITE_*` values).
4. Confirm browser Network signup request host matches intended project ref.

### B) Add `handle_new_user` trigger so profiles are created automatically (recommended)
Apply the SQL below in a new migration:

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
```

---

## Validation
1. Redeploy with corrected env values.
2. Open deployed app, run signup with fresh email.
3. Browser DevTools Network should show:
   - `POST https://<expected-project-ref>.supabase.co/auth/v1/signup` (200/201).
4. In Supabase dashboard for that exact project:
   - Confirm user appears in **Authentication → Users**.
5. If trigger added:
   - Confirm row appears in `public.profiles` with same `id`.
6. Run login and `/api/me/profile` request; verify no auth mismatch errors.

---

## Scenario classification checklist
- Signup form not calling Supabase Auth: **No (it does call Supabase REST Auth).**
- App using mock/local auth: **No evidence found.**
- Connected to wrong Supabase project: **Likely yes in deployment.**
- Supabase env vars misconfigured: **Likely yes (or stale build).**
- Signup call failing silently: **No; errors are parsed and returned.**
- Supabase client misconfigured: **No code-level misconfig detected; direct REST usage is valid.**
- Redirect URLs blocking auth: **Possible for callback/login UX, not likely for missing Auth user creation.**
- Frontend bundle using stale env vars: **Likely contributing factor.**
- Deployed build not using intended Supabase config: **Likely yes.**
