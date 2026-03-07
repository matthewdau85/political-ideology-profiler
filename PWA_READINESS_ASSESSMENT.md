# PWA Readiness Assessment

Date: 2026-03-07
Assessor: production engineering review

## Executive verdict
**Partially ready before this update; now baseline PWA-ready for installability with remaining hardening items.**

### Current status after remediation
- ✅ Web App Manifest exists and is linked in `index.html`.
- ✅ Install icons (192/512) and standalone display mode configured.
- ✅ Apple mobile web app tags present.
- ✅ Service worker registration is now enabled in production builds.
- ✅ Service worker caches app shell and runtime same-origin GET requests, excluding `/api`.
- ⚠️ No explicit in-app install prompt UX yet (`beforeinstallprompt` handling not implemented).
- ⚠️ No Lighthouse PWA CI gate is configured yet.
- ⚠️ Offline UX is generic (fallback response) rather than route-specific offline page.

## Detailed checks

## 1) Installability
- Manifest linked from `index.html`.
- `display: standalone` and `start_url`/`scope` are set.
- Required icons present.

**Status: PASS**

## 2) Service worker
- `public/sw.js` now handles install/activate/fetch.
- App shell resources are precached.
- Runtime cache for same-origin GET requests enabled.
- API routes are intentionally excluded from caching.

**Status: PASS (baseline)**

## 3) HTTPS and domain requirements
- On Vercel custom domain, HTTPS is supported by default.
- PWA install requires HTTPS on production domain.

**Status: PASS (infra-dependent)**

## 4) UX and reliability
- No install CTA logic or update prompt yet.
- No explicit offline route page.

**Status: PARTIAL**

## 5) Production hardening recommendations
1. Add `beforeinstallprompt` capture and install CTA component.
2. Add service-worker update notification UI.
3. Add dedicated `/offline` fallback page.
4. Add Lighthouse CI with PWA score threshold.
5. Add cache versioning policy in release checklist.

## Domain rollout checklist for full PWA download readiness
1. Configure custom domain in Vercel.
2. Ensure HTTPS redirect is enforced.
3. Deploy production build containing manifest + service worker.
4. Verify manifest at `https://<domain>/manifest.json`.
5. Verify service worker active in browser devtools.
6. On Android Chrome: verify "Install app" appears.
7. On iOS Safari: verify Add to Home Screen instructions work.
8. Run Lighthouse PWA audit and record results.

