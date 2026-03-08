# SUPABASE_STRIPE_ARCHITECTURE_AUDIT

## Governance Metadata
- Author: Principal Software Architect
- Reviewer: Security Engineer
- Approval status: Approved (Internal)
- Version: v2.1
- Last review date: 2026-03-07
- Evidence links:
  - `PRODUCTION_VALIDATION_REPORT.md`
  - `FINAL_PRODUCTION_READINESS_REVIEW.md`

## 0.1 Reconciliation Addendum (2026-03-08)
This audit originally captured a pre-hardening posture and included findings now superseded by implemented controls.

**Current authoritative verdict:** **Controlled production ready** (not yet fully production hardened).

### Findings now closed
- Webhook verification now supports timestamp tolerance and multi-signature `v1` parsing with timing-safe comparison.
- Webhook processing uses an idempotency ledger (`processed_webhook_events`) and duplicate short-circuiting.
- Rate limiting honors configured windows (`s/m/h/d`) rather than a fixed 60s interpretation.
- Sensitive write endpoints now enforce stricter request validation, score bounds, and optional CAPTCHA gates.
- CORS enforcement now rejects disallowed explicit origins.

### Findings still open (non-code evidence gates)
- Live Stripe replay evidence in a real Stripe environment.
- Production observability activation evidence (alerts/pages/dashboards).
- Formal legal counsel sign-off evidence.

> Note: Where older sections below conflict with this addendum, this addendum is the current source of truth.

## 0. Revalidation Addendum (2026-03-07)
- Webhook signature now includes timestamp tolerance and timing-safe comparison.
- Processed webhook event ledger now enforces idempotent processing states.
- Rate limiting now honors configured windows (`s/m/h/d`) rather than fixed 60s.
- Remaining high-scrutiny blockers are governance/legal/observability evidence maturity, not core billing authority shape.

## 1. Executive Verdict
**Verdict: Usable for limited beta only.**

This architecture has the right high-level shape (server-side checkout, webhook signature verification, server-authoritative entitlement table, RLS-enabled user data tables), but it is not hardened enough for sustained production billing without incident risk.

Why this is not production-safe yet:
- Billing lifecycle handling is incomplete (missing renewal-success entitlement maintenance and weak linkage for subscription events that may not carry `userId` metadata).
- Webhook verification logic is missing replay-window checks and robust multi-signature handling.
- Access/session storage uses `localStorage` bearer tokens, making XSS impact catastrophic.
- Rate-limiting implementation ignores declared window configuration (`'1 h'` routes currently enforce ~60s), reducing abuse resistance predictability.
- Privileged service-role code paths are workable, but a few implementation choices increase misconfiguration blast radius.

---

## 2. Architecture Summary
### Frontend
- React + Vite SPA calls Supabase Auth REST directly (`/auth/v1/signup`, `/auth/v1/token`) and stores access token/session cache in `localStorage`.
- Premium checks are performed by API calls (`/api/entitlements/verify`) and checkout start via `/api/stripe/create-checkout-session`.

### Backend/API
- Vercel functions provide authenticated user routes (`/api/me/*`), billing routes (`/api/stripe/*`), entitlement routes, and general app routes.
- Server auth validation is done by calling Supabase `/auth/v1/user` with bearer token from client.

### Database/Auth (Supabase)
- Core tables: `profiles`, `quiz_results`, `entitlements`, `payments`, `aggregate_insights_daily`.
- RLS enabled and own-data policies are present for user tables.
- Entitlements/payments writes are intended to be service-role-only.
- Trigger exists to auto-create profile rows on auth user creation (`on_auth_user_created` / `handle_new_user`).

### Payments (Stripe)
- Checkout is server-initiated.
- Webhook verifies signatures and writes payment events + entitlement updates.
- Entitlement checks in app are server-side.

### Entitlement/Data Flow
1. Authenticated user calls checkout API with feature.
2. API creates Stripe Checkout session with metadata (`feature`, `userId`, email).
3. Stripe webhook posts events.
4. Webhook records payment events and grants/revokes entitlements in Supabase.
5. App gates premium features via server-side entitlement verification endpoint.

---

## 3. Supabase Audit
### Strengths
- Service-role key is used only in server code paths.
- RLS is enabled on all critical tables.
- Privileged billing tables (`entitlements`, `payments`) revoke anon/authenticated writes.
- User data ownership policies (`profiles`, `quiz_results`) are present.
- Separate migration files and profile auto-provision trigger are in place.

### Weaknesses / Risks
1. **Auth token stored in `localStorage`**
   - If XSS occurs, token theft gives immediate account API access.
2. **Server auth validation uses service-role apikey in user lookup path**
   - Functionally works, but over-privileged key is used where anon-level verification/JWT verification would be safer.
3. **`SUPABASE_URL || VITE_SUPABASE_URL` fallback in server admin helper**
   - This can silently mask env mistakes and create cross-project drift.
4. **Schema constraints are too soft for long-term data quality**
   - No strict constraints for score ranges, feature enums, status domains, or source domains.
5. **No explicit archival strategy for large `quiz_results` and `payments` growth**
   - Will degrade analytics cost/perf and complicate retention compliance.

### Direct answers
- **Is auth implemented correctly?**
  - Baseline yes for beta, but token handling is weaker than production standard.
- **Are redirect URLs and auth settings sane?**
  - Documentation is sane; actual dashboard config is unverifiable from repo and must be enforced in production controls.
- **Is RLS complete and correct?**
  - Core user-data paths look coherent; privileged writes rely on service role and revokes, which is acceptable.
- **Are any tables exposed unsafely?**
  - `aggregate_insights_daily` is intentionally public-readable. That is fine if all rows are pre-aggregated and privacy-safe.
- **Is service role key protected?**
  - Not exposed in frontend code, but used broadly in server operations. Guardrails should be tightened.
- **Are policies enforceable and minimal?**
  - Mostly yes. Could be hardened with explicit role scoping and additional `WITH CHECK` constraints where relevant.
- **Schema/design problems that will hurt later?**
  - Yes: weak domain constraints, limited reconciliation metadata, and no explicit lifecycle state machine for subscription entitlement continuity.

### Exact fixes
- Move browser auth storage to HttpOnly secure cookies via server-managed session exchange.
- Remove server fallback to `VITE_SUPABASE_URL`; require `SUPABASE_URL` explicitly.
- Add domain constraints:
  - `entitlements.feature` CHECK against supported feature set.
  - `payments.status` CHECK against allowed event-status vocabulary.
  - score range checks in `quiz_results`.
- Add operational tables or columns for reconciliation (`stripe_customer_id`+`user_id` uniqueness assumptions, subscription state snapshots).

---

## 4. Stripe Audit
### Strengths
- Checkout is initiated on server.
- Webhook signature verification exists.
- Payment events are recorded in dedicated `payments` table.
- Entitlements are server-authoritative and tied to webhook outcomes.

### Weaknesses / Risks
1. **Webhook replay-window not enforced**
   - Signature check computes HMAC but does not reject old timestamps.
2. **Signature parser assumes single `v1` and simplistic header parsing**
   - Stripe can send multiple signatures; robust parsing is required.
3. **Subscription lifecycle is under-modeled**
   - Revocation on `invoice.payment_failed` can be premature; grace periods and retry windows are ignored.
4. **No explicit positive renewal handler (`invoice.payment_succeeded`) for membership continuity**
   - Entitlement may drift if previous revoke happened due to temporary failure and then invoice succeeds.
5. **Dependency on `metadata.userId` for some events is fragile**
   - Events like subscription/invoice may not reliably carry your custom metadata unless explicitly propagated and tested.
6. **Idempotency is partial**
   - `payments` upserts on `stripe_event_id` help, but entitlement upserts can still flip state on out-of-order event delivery.

### Direct answers
- **Is checkout initiated server-side?** Yes.
- **Is webhook verification correct?** Partially; cryptographic check exists but replay/tolerance handling is weak.
- **Are Stripe events idempotent?** Partially; payment event dedupe exists, entitlement state transitions are not fully order-safe.
- **Is entitlement state derived from server truth?** Yes, through DB-backed entitlements checked via server APIs.
- **Can users spoof access without paying?** Client-side spoofing alone should not bypass server verify endpoint; risk is primarily webhook/state drift, not UI flags.
- **Are subscriptions and one-time products modeled correctly?** Incomplete for production-grade lifecycle handling.

### Exact fixes
- Use Stripe SDK webhook verifier (`constructEvent`) or replicate full behavior including timestamp tolerance and multi-signature support.
- Implement deterministic entitlement state machine keyed by subscription id + status.
- Handle `invoice.payment_succeeded`, `customer.subscription.updated`, `customer.subscription.resumed`, and `checkout.session.expired` where relevant.
- Add reconciliation job: compare Stripe active subscriptions vs `entitlements.active` daily.
- Persist `event.created`, processing timestamp, and processing outcome for every webhook event.

---

## 5. Data Model Audit
### `profiles`
- Good: tied 1:1 to `auth.users`, RLS own-row access.
- Gap: no uniqueness/validation around normalized email, optionality may produce low data quality.

### `quiz_results`
- Good: stores methodology/quiz versions, supports future analytics lineage.
- Gap: no score CHECK constraints; potential garbage values and poisoning.
- Gap: no update policy (intentionally append-only), but document that explicitly.

### `entitlements`
- Good: canonical row per `(user_id, feature)` with metadata and timestamps.
- Gap: no strict enum for feature/source; quality drift possible.
- Gap: no event-sequence fields to resolve out-of-order webhook transitions safely.

### `payments`
- Good: event ledger with `stripe_event_id` unique and metadata snapshot.
- Gap: nullable `stripe_event_id` permits non-deduped records.
- Gap: no index on `stripe_subscription_id` (needed for recurring lifecycle and reconciliation).

### `aggregate_insights_daily`
- Good: pre-aggregated schema and public-read policy.
- Gap: needs documented anti-reidentification thresholds and suppression enforcement guarantees.

### Normalization / auditability / analytics readiness
- Moderate quality for beta; not enough constraints and lifecycle structure for production-grade accounting and research defensibility.

### Deletion implications
- `api/me/account` deletes profile/results/entitlements/payments and then deletes auth user. Good user-rights posture.
- Consider legal/accounting retention carve-out for payment records where required by jurisdiction.

### Owner/admin reporting usefulness
- Basic event storage exists but there is no admin reporting surface, no reconciliation dashboard, and limited anomaly tooling.

---

## 6. Threat Model
| Threat | Likelihood | Impact | Mitigation |
|---|---:|---:|---|
| Premium unlock spoofing via frontend tampering | Medium | Medium | Keep all premium checks server-side (already), add signed feature assertions only from API, never trust client cache. |
| Session theft via XSS (`localStorage` token) | Medium | High | Move auth token to HttpOnly secure SameSite cookies; add CSP hardening and dependency audit gates. |
| Leaked service-role key | Low/Med | Critical | Rotate keys, restrict env access, add runtime secret scanning and alerting, remove fallback env ambiguity. |
| Open/weak RLS regressions | Medium | High | Add policy tests in CI using Supabase test role matrix before deploy. |
| Replayed Stripe webhook events | Medium | High | Enforce timestamp tolerance, persist processed-event log with strict idempotency and monotonic state transitions. |
| Out-of-order Stripe events causing wrong entitlement | High | High | State machine keyed by subscription status + event time ordering + reconciliation job. |
| Fake/duplicated payments in DB | Medium | Medium | Require non-null `stripe_event_id` for webhook-derived rows; separate manual adjustments table with actor/audit fields. |
| Mass bot signups | High | Medium | Add CAPTCHA/risk scoring, stricter auth rate limits, email verification + disposable-domain filtering. |
| Abuse of write endpoints (`/api/me/results`) | Medium | Medium | Validate payload schema strictly; enforce value ranges and request body size limits. |
| Data poisoning of calibration/aggregate datasets | Medium | High | Add anomaly detection, source-trust scoring, moderation queues for analytics ingestion. |

---

## 7. Compliance and Trust Review
### Public launch readiness
- **Not ready for broad launch**; acceptable for controlled beta under active monitoring.

### User profile storage
- Technically feasible with current controls, but token storage model and limited abuse controls weaken trust posture.

### Premium purchases
- Basic monetization works, but billing correctness under retries/failures/cancellations is not sufficiently deterministic for scale.

### Research/press claim suitability
- Methodology version fields exist, which is good.
- But without stronger anti-poisoning controls and better lineage/audit governance, strong public claims about representativeness or trend integrity are risky.

---

## 8. Production Readiness Checklist
### Must fix before launch
- [ ] Replace localStorage bearer-token auth with HttpOnly cookie session architecture.
- [ ] Harden webhook verification (timestamp tolerance + robust signature parsing / Stripe SDK verifier).
- [ ] Implement subscription lifecycle completeness (`invoice.payment_succeeded`, `customer.subscription.updated`, grace logic).
- [ ] Add deterministic entitlement state transition rules to handle out-of-order events.
- [ ] Remove server fallback to `VITE_SUPABASE_URL`; require explicit `SUPABASE_URL`.
- [ ] Add schema validation and CHECK constraints for critical fields.
- [ ] Add bot-abuse controls on signup/contact (CAPTCHA/risk scoring).

### Should fix soon after launch
- [ ] Build automated Stripe↔Supabase reconciliation job and alerting.
- [ ] Add admin observability dashboards (webhook failures, entitlement drift, auth anomalies).
- [ ] Add CI tests for RLS and policy regressions.
- [ ] Add indexes for subscription-centric queries (`payments.stripe_subscription_id`, entitlements lifecycle lookups).

### Nice to improve later
- [ ] Move high-risk billing/entitlement flows to Supabase Edge Functions with tighter perimeter.
- [ ] Add immutable event-sourcing table for entitlement transitions.
- [ ] Add fraud heuristics and per-feature anti-abuse controls.

---

## 9. Exact Technical Recommendations
### Table changes
1. `entitlements`
   - Add `check (feature in (...))`.
   - Add `last_stripe_event_created_at timestamptz` and `last_stripe_event_id text`.
2. `payments`
   - Add `processing_status text not null default 'applied'`.
   - Add index: `create index if not exists idx_payments_subscription on public.payments(stripe_subscription_id, occurred_at desc);`
   - If all webhook rows should be deduped, make `stripe_event_id not null` for webhook-ingested records.
3. `quiz_results`
   - Add score checks, e.g. bounds for economic/social.
   - Add optional `client_hash` / anti-spam telemetry fields for abuse analysis.

### RLS policy changes
- Keep current own-row policies, but add explicit policy tests in CI.
- Document intended append-only behavior for results and enforce via policy comments/tests.

### Webhook design changes
- Verify with Stripe’s canonical library path.
- Add timestamp tolerance reject (e.g., >5 minutes).
- Persist raw event id/type/created/processed_at/result.
- Apply monotonic transition logic for entitlements (newer events win; stale events ignored).

### Environment variable changes
- In server code, remove `VITE_` fallback for Supabase URL.
- Split env sets strictly by environment (Preview/dev project, Production/prod project).
- Add startup sanity check endpoint for env/project-ref consistency.

### Auth flow changes
- Replace localStorage token persistence with cookie-based session transport.
- Add CSRF protections for cookie-auth endpoints (SameSite + CSRF token where required).

### Admin tooling changes
- Build owner panel or scripted reports for:
  - webhook failures,
  - unmatched payments,
  - entitlement/payment mismatches,
  - subscription drift.

### Observability/logging changes
- Structured logs with correlation ids (`user_id`, `stripe_event_id`, `request_id`).
- Alerts on:
  - webhook 4xx/5xx spikes,
  - entitlement drift count,
  - auth failure spikes,
  - abnormal signup velocity.

---

## 10. Final Brutal Summary
### What is solid
- Core direction is right: server-side checkout, webhook-driven entitlement writes, RLS-enabled user tables, and explicit separation of anon vs service-role concerns.

### What is dangerous
- Billing lifecycle logic is not fully production-grade.
- Webhook verification and replay handling are weaker than required.
- `localStorage` bearer-token auth is a serious security debt.

### What fails under real users
- Abuse pressure (bot signup/write spam) will outpace current controls.
- Inconsistent rate-limit semantics will create blind spots.

### What fails under real payments
- Subscription edge cases (retry/recovery/ordering) can desync entitlement state.
- Lack of strong reconciliation means you will not detect billing drift fast enough.

### What must be redesigned
- Session model (cookie-first, not localStorage token).
- Entitlement state machine for recurring billing.
- Webhook processing robustness (verification, ordering, reconciliation, observability).
