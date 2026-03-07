# Documentation Remediation Plan + Audit Rerun

Date: 2026-03-07
Scope: Resolve findings from `DOCUMENTATION_LAUNCH_AUDIT.md` and rerun the same audit framework against current documentation.

---

## 1) Master plan to resolve all findings

## 1.1 Program structure
- **Program owner:** Documentation Lead (or PM delegate).
- **Working group:** Security owner, billing owner, analytics owner, legal reviewer, methodology owner.
- **Cadence:** Daily async updates + weekly review.
- **Definition of done:**
  1) each launch-blocking doc exists,
  2) each claim has evidence or qualified wording,
  3) cross-doc endpoint/terminology consistency is validated,
  4) legal pages pass counsel review,
  5) rerun audit score >= 8/10 for all high-risk docs.

## 1.2 Prioritized workstreams

### WS1 — Legal/Privacy Hardening (P0, before launch)
**Goal:** remove over-absolute claims, create contract-grade policy docs, and align consent language with data flows.

Deliverables:
1. `PRIVACY_POLICY.md` (canonical policy).
2. `TERMS.md` (paid services + refunds + cancellations + legal clauses).
3. `CONSENT_AND_DATA_USE.md` (consent states mapped to actual data flows).
4. Update in-product pages (`PrivacyPage`, `TermsPage`) to link canonical docs and use non-absolute wording.

Acceptance criteria:
- No absolute claims like “cannot be traced back” or “no data sent at all.”
- Includes controller details, processors/subprocessors, retention windows, rights workflow.
- Legal review sign-off attached in changelog.

### WS2 — API/Billing Consistency + Lifecycle Contracts (P0, before launch)
**Goal:** eliminate endpoint mismatch and establish auditable billing/entitlement state machine.

Deliverables:
1. `API_REFERENCE.md` with canonical endpoint list and compatibility aliases.
2. Update `README.md`, `ARCHITECTURE.md`, `PAYMENTS.md`, `STRIPE_SETUP.md`, `ENTITLEMENTS.md`, `BILLING_ARCHITECTURE.md` to match canonical endpoints.
3. Billing lifecycle state machine (checkout, completion, refund, cancellation, payment failure, retry).
4. Reconciliation + idempotency runbook in billing architecture/ops docs.

Acceptance criteria:
- Zero endpoint mismatch across docs.
- Entitlement transitions defined per Stripe event.
- Includes customer-facing refund/cancellation policy references.

### WS3 — Security/Operations Governance (P0, before launch)
**Goal:** move from generic controls to operationally testable security/incident posture.

Deliverables:
1. Expanded `SECURITY_MODEL.md` with STRIDE-style table.
2. `INCIDENT_RESPONSE.md` with severity, paging, escalation, communication templates.
3. `OWNER_OPS.md` updated with measurable SLO thresholds and response actions.
4. `DEPLOYMENT.md` updated with preflight/post-deploy verification and rollback validation.

Acceptance criteria:
- Every control maps to owner + monitoring + residual risk.
- Incident runbook includes SLA for triage and postmortem.
- Operator checks are measurable (threshold-based, not subjective).

### WS4 — Methodology Credibility and Claims Discipline (P0/P1)
**Goal:** reduce pseudo-scientific risk and improve reproducibility.

Deliverables:
1. `METHODOLOGY_VERSIONING.md`.
2. `RESEARCH_LIMITATIONS.md`.
3. Rename “confidence” → “fit score” where not statistically validated.
4. Add model/version/date and change history references in methodology-facing docs.
5. Add dataset/calibration disclosure placeholders with current limits.

Acceptance criteria:
- No “research-grade” language without evidence package.
- Methodology pages clearly identify heuristic status.
- Version traceability exists for all methodology changes.

### WS5 — Measurement, Ads, and Growth Operations (P1, soon after launch)
**Goal:** make analytics/ad/sharing docs operational and defensible.

Deliverables:
1. `ANALYTICS.md` tracking plan table (schema, owner, QA query, alert).
2. `PERFORMANCE.md` budgets and SLOs (LCP/INP/JS weight).
3. `AD_SYSTEM.md` policy checklist + fallback/error handling.
4. `SHARING_SYSTEM.md` KPIs, anti-misuse guidance, metadata QA.
5. `PRICING_STRATEGY.md` unit economics assumptions + experiment roadmap.

Acceptance criteria:
- Every critical event has schema + QA test.
- Performance and ad policies have pass/fail launch gates.
- Pricing hypotheses are measurable.

### WS6 — Governance + Change Traceability (P1)
**Goal:** keep docs trustworthy over time.

Deliverables:
1. `CHANGELOG.md` for docs and methodology updates.
2. `PRESS_AND_CITATION_GUIDE.md` for allowed/prohibited claims.
3. Status banner in `docs/production-readiness-assessment.md` with supersession metadata.

Acceptance criteria:
- Stakeholders can identify latest source of truth quickly.
- Media/research-facing claims are standardized.

## 1.3 Implementation timeline

### Phase 0 (Days 1–3)
- Create canonical legal docs and API reference skeleton.
- Run consistency sweep for endpoint names.
- Add risk-language hotfixes for privacy and methodology wording.

### Phase 1 (Days 4–7)
- Complete billing/entitlement state machine docs.
- Expand security model + incident response runbook.
- Update launch checklist to pass/fail format with evidence links.

### Phase 2 (Week 2)
- Add analytics schema governance, performance budgets, ad compliance matrix.
- Publish research limitations + methodology versioning.

### Phase 3 (Week 3+)
- Final legal review.
- Rerun full documentation audit and freeze launch package.

## 1.4 Ownership matrix

| Workstream | Owner role | Backup role | Exit artifact |
|---|---|---|---|
| WS1 Legal/Privacy | Legal reviewer | PM | PRIVACY_POLICY.md, TERMS.md, CONSENT_AND_DATA_USE.md |
| WS2 API/Billing | Backend lead | Finance ops | API_REFERENCE.md + billing state machine |
| WS3 Sec/Ops | Security lead | DevOps lead | SECURITY_MODEL.md + INCIDENT_RESPONSE.md |
| WS4 Methodology | Research lead | Product analyst | METHODOLOGY_VERSIONING.md + RESEARCH_LIMITATIONS.md |
| WS5 Measurement/Growth | Growth lead | Frontend lead | ANALYTICS.md/PERFORMANCE.md/AD_SYSTEM.md updates |
| WS6 Governance | Documentation lead | PM | CHANGELOG.md + PRESS_AND_CITATION_GUIDE.md |

## 1.5 Launch gates (must be green)
1. **Legal gate:** canonical policy docs approved.
2. **Consistency gate:** zero endpoint contradictions in all docs.
3. **Billing gate:** lifecycle + entitlement transitions fully documented.
4. **Security gate:** threat model + incident runbook complete.
5. **Methodology gate:** heuristic status and versioning explicit.

---

## 2) Audit rerun (same framework) — current status snapshot

Method: reviewed current repository docs and in-product policy/methodology pages against the prior audit criteria, then assigned status.

### 2.1 Coverage matrix rerun

| Document | Prior status | Current status | Delta |
|---|---|---|---|
| README.md | weak | weak | no change |
| ARCHITECTURE.md | weak | weak | no change |
| CODE_AUDIT.md | adequate | adequate | no change |
| SECURITY_MODEL.md | weak | weak | no change |
| PAYMENTS.md | weak | weak | no change |
| STRIPE_SETUP.md | adequate | adequate | no change |
| BILLING_ARCHITECTURE.md | weak | weak | no change |
| ENTITLEMENTS.md | weak | weak | no change |
| OWNER_OPS.md | weak | weak | no change |
| ANALYTICS.md | weak | weak | no change |
| AD_SYSTEM.md | weak | weak | no change |
| PERFORMANCE.md | weak | weak | no change |
| REPORT_ENGINE.md | weak | weak | no change |
| METHODOLOGY.md | adequate | adequate | no change |
| DATA_DICTIONARY.md | weak | weak | no change |
| INSIGHTS_METHODS.md | adequate | adequate | no change |
| TYPOLOGY_MODEL.md | adequate | adequate | no change |
| PERSONA_REVIEW_SUMMARY.md | adequate | adequate | no change |
| DEPLOYMENT.md | weak | weak | no change |
| LAUNCH_CHECKLIST.md | weak | weak | no change |
| PRICING_STRATEGY.md | weak | weak | no change |
| SHARING_SYSTEM.md | weak | weak | no change |
| Privacy page | misleading | misleading | no change |
| Terms page | weak | weak | no change |
| Methodology page | adequate | adequate | no change |
| About page | adequate | adequate | no change |
| production-readiness-assessment | adequate | adequate | no change |

### 2.2 Cross-document mismatch rerun
- **Still present:** checkout endpoint naming mismatch.
- **Still present:** webhook endpoint naming mismatch.
- **Still present:** entitlement endpoint naming mismatch.
- **Still present:** privacy absolutes vs infrastructure/third-party processing realities.
- **Still present:** research framing stronger than evidence in select public-facing copy.

### 2.3 Claim-risk rerun
Status of highest-risk claims from previous audit:
1. IP logging absolute claim — **OPEN**
2. “cannot be traced back” absolute claim — **OPEN**
3. “no data sent at all if decline cookies” absolute claim — **OPEN**
4. “every premium gate is server-side enforced” absolute claim — **OPEN**
5. “confidence (0–100)” potentially over-interpreted — **OPEN**

### 2.4 Missing document rerun
All previously recommended missing docs remain **NOT CREATED**:
- `PRIVACY_POLICY.md`
- `TERMS.md`
- `CONSENT_AND_DATA_USE.md`
- `INCIDENT_RESPONSE.md`
- `API_REFERENCE.md`
- `METHODOLOGY_VERSIONING.md`
- `RESEARCH_LIMITATIONS.md`
- `DATA_RETENTION_AND_DELETION.md`
- `PRESS_AND_CITATION_GUIDE.md`
- `CHANGELOG.md`

### 2.5 Rerun verdict
- **Current verdict:** Documentation remains **good for limited beta**, **not** launch-ready for full public scrutiny.
- **Reason:** no material remediation has yet been applied to high-risk legal/privacy consistency and operations-governance gaps.

---

## 3) Immediate next actions (first 72 hours)
1. Create `PRIVACY_POLICY.md`, `TERMS.md`, `CONSENT_AND_DATA_USE.md` drafts and update in-product links.
2. Publish `API_REFERENCE.md` and patch endpoint names in README/architecture/payments/stripe docs.
3. Add billing/entitlement state machine section to `BILLING_ARCHITECTURE.md` and `ENTITLEMENTS.md`.
4. Expand `SECURITY_MODEL.md` + create `INCIDENT_RESPONSE.md`.
5. Re-run this audit and target status upgrades:
   - Privacy page: misleading → adequate
   - Payments/Billing/Entitlements: weak → adequate
   - Security model: weak → adequate

