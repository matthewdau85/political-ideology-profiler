# Supabase Code Audit

## Findings Before This Change

1. **Auth was not using the Supabase JS auth API contract.**
   - Client auth used custom REST helpers in `src/utils/supabaseClient.js` and state in `src/utils/authStore.js`.
   - Session and access token were persisted in localStorage and reused as app truth.
2. **App state was fragmented.**
   - `App`, `ProfilePage`, and `QuizPage` each fetched session data independently.
3. **Profile/result/entitlement state was not modeled as one coherent authenticated state layer.**
   - Result save and profile hydration were mixed into `authStore` with ad-hoc fallback behavior.
4. **Premium auth header flow depended on authStore token helper.**
   - `src/utils/premiumApi.js` read auth token from `authStore` directly.

## What Changed

1. **Introduced a dedicated Supabase client module and auth API surface** in `src/lib/supabaseClient.js` with:
   - `supabase.auth.signUp`
   - `supabase.auth.signInWithPassword`
   - `supabase.auth.signOut`
   - `supabase.auth.getSession`
   - `supabase.auth.onAuthStateChange`
2. **Added modular service layer**:
   - `src/lib/auth.js`
   - `src/lib/profile.js`
   - `src/lib/results.js`
   - `src/lib/entitlements.js`
   - `src/lib/supabaseRest.js`
3. **Added centralized authenticated app state**:
   - `src/context/AuthContext.jsx`
   - `src/hooks/useAuth.js`
   - `src/hooks/useResults.js`
   - `src/hooks/useEntitlements.js`
4. **Updated UI integration to use real Supabase-backed auth state**:
   - `src/App.jsx` now reads auth state from context.
   - `src/components/ProfilePage.jsx` now performs real signup/login/logout and profile updates.
   - `src/components/QuizPage.jsx` now saves signed-in results via Supabase service layer.
   - `src/components/PrivacyPage.jsx` uses context-backed data/account deletion actions.
5. **Removed old auth store implementation**:
   - Deleted `src/utils/authStore.js`.
6. **Updated premium API token access**:
   - `src/utils/premiumApi.js` now gets token from Supabase session via `src/lib/supabaseClient.js`.

## What Remains (Stripe / Server-only work)

1. **Stripe webhook remains server-authoritative** (already on API routes) and is still responsible for writing canonical entitlement transitions.
2. **Premium gate final authority remains server-side** via `/api/entitlements/verify` and should continue to be enforced there.
3. **Operational work still needed outside frontend code**:
   - Vercel production/preview env parity.
   - Supabase redirect URL correctness.
   - Stripe live-mode lifecycle validation (refunds/cancellations/retries).
