# Supabase Frontend Integration

## Governance Metadata
- Author: Principal Software Architect
- Reviewer: Backend Engineer
- Approval status: Approved (Internal)
- Version: v2.1
- Last review date: 2026-03-07
- Evidence links:
  - `SUPABASE_CODE_AUDIT.md`
  - `PRODUCTION_VALIDATION_REPORT.md`

## Overview

The frontend now uses a dedicated Supabase integration layer with centralized auth + user-data state.

## Files and Responsibilities

- `src/lib/supabaseClient.js`
  - Initializes Supabase client configuration from Vite env.
  - Implements `supabase.auth.*` methods used by app auth flows.
  - Handles session persistence and auth-state listeners.
- `src/lib/auth.js`
  - Auth service wrappers for sign up, sign in, sign out, session/user retrieval.
- `src/lib/supabaseRest.js`
  - Authenticated REST helper for RLS-safe table operations.
- `src/lib/profile.js`
  - Fetches and updates `public.profiles` by authenticated user id.
- `src/lib/results.js`
  - Saves/fetches/deletes `public.quiz_results` for current user.
- `src/lib/entitlements.js`
  - Fetches `public.entitlements` for current user.
- `src/context/AuthContext.jsx`
  - Canonical frontend state for user/session/profile/results/entitlements.
  - Provides auth and data actions to components.
- `src/hooks/useAuth.js`
  - Primary hook for auth + profile + result + entitlement actions.
- `src/hooks/useResults.js` and `src/hooks/useEntitlements.js`
  - Convenience hooks for modular usage.

## Required Environment Variables

Frontend (Vite build-time):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Notes:
- Vite injects env variables at build time.
- Vercel env changes require a redeploy.
- `SUPABASE_SERVICE_ROLE_KEY` must never be exposed in frontend code.

## Auth Flow

1. App boot (`AuthProvider`) runs:
   - `supabase.auth.getSession`
   - `supabase.auth.getUser`
2. If authenticated:
   - Load profile (`public.profiles`)
   - Load saved results (`public.quiz_results` ordered by `created_at desc`)
   - Load active entitlements (`public.entitlements`)
3. Auth state changes are tracked via `supabase.auth.onAuthStateChange`.

## Result Persistence

When a signed-in user completes the quiz:
- Existing score calculation remains unchanged.
- Result is saved to `public.quiz_results` with:
  - `user_id`
  - `economic_score`
  - `social_score`
  - `ideological_cluster`
  - `typology`
  - `top_issues`
  - `radar_scores`
  - `methodology_version`
  - `quiz_version`

When not signed in:
- Free result UX remains available.
- Result can remain local-only for preview/share UX.

## Entitlements

- Active entitlements are fetched from `public.entitlements` after login.
- UI can read entitlement state through `featureEnabled` in auth context.
- A dev-only fallback exists behind `VITE_DEV_UNLOCK_ALL_PREMIUM=true` and only applies in `import.meta.env.DEV`.

## Stripe / Server-side Completion Status

Still server-side by design:
- Checkout session creation.
- Stripe webhook event processing.
- Canonical entitlement grants/revocations.
- Server-authoritative premium verification endpoint.

The frontend is now ready to consume real entitlement rows and no longer uses fake/local auth as source of truth.
