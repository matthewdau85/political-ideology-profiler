# Docs Completion Matrix

Last updated: 2026-03-07
Owner: Documentation Lead

Purpose: single source of truth for documentation production status beyond file existence.

## Status definitions
- **Drafted**: document exists with baseline structure/content.
- **Reviewed**: reviewed by functional owner (engineering/product/security/etc.).
- **Approved**: approved by decision owner (e.g., Head of Product, Security Lead, Counsel).
- **Published**: approved and linked in user/operator-facing navigation where required.

## Evidence requirements
For any document marked Reviewed/Approved/Published, attach one evidence link:
- PR/commit link
- review sign-off note
- legal sign-off ticket
- dashboard/report URL
- release note entry

## Matrix

| Document | Audience | Status | Owner | Reviewer | Approver | Launch Blocker? | Evidence |
|---|---|---|---|---|---|---:|---|
| README.md | Engineers/operators | Drafted | Eng Lead |  |  | ✅ |  |
| ARCHITECTURE.md | Engineering | Drafted | Eng Lead |  |  | ✅ |  |
| CODE_AUDIT.md | Engineering leadership | Drafted | Eng Lead |  |  | ❌ |  |
| SECURITY_MODEL.md | Security/engineering | Drafted | Security Lead |  |  | ✅ |  |
| PAYMENTS.md | Billing/product | Drafted | Billing Owner |  |  | ✅ |  |
| STRIPE_SETUP.md | Operators | Drafted | Billing Owner |  |  | ✅ |  |
| BILLING_ARCHITECTURE.md | Billing/engineering | Drafted | Billing Owner |  |  | ✅ |  |
| ENTITLEMENTS.md | Engineering/support | Drafted | Billing Owner |  |  | ✅ |  |
| OWNER_OPS.md | Operations | Drafted | Ops Owner |  |  | ✅ |  |
| ANALYTICS.md | Growth/product | Drafted | Growth Owner |  |  | ❌ |  |
| AD_SYSTEM.md | Ad ops/growth | Drafted | Ad Ops Owner |  |  | ❌ |  |
| PERFORMANCE.md | Engineering | Drafted | Frontend Lead |  |  | ❌ |  |
| REPORT_ENGINE.md | Product/research | Drafted | Product Owner |  |  | ❌ |  |
| METHODOLOGY.md | Public/research | Drafted | Research Owner |  |  | ✅ |  |
| DATA_DICTIONARY.md | Data/privacy | Drafted | Data Owner |  |  | ✅ |  |
| INSIGHTS_METHODS.md | Research/public | Drafted | Research Owner |  |  | ❌ |  |
| TYPOLOGY_MODEL.md | Research/public | Drafted | Research Owner |  |  | ❌ |  |
| PERSONA_REVIEW_SUMMARY.md | Leadership | Drafted | Product Owner |  |  | ❌ |  |
| DEPLOYMENT.md | DevOps/operators | Drafted | Ops Owner |  |  | ✅ |  |
| LAUNCH_CHECKLIST.md | Launch owner | Drafted | Product Owner |  |  | ✅ |  |
| PRICING_STRATEGY.md | Product/finance | Drafted | Product Owner |  |  | ❌ |  |
| SHARING_SYSTEM.md | Growth | Drafted | Growth Owner |  |  | ❌ |  |
| SUPABASE_SETUP.md | Engineering/operators | Drafted | Backend Lead |  |  | ✅ |  |
| SUPABASE_PRODUCTION_CHECKLIST.md | Ops/security | Drafted | Security Lead |  |  | ✅ |  |
| PRIVACY_POLICY.md | Users/legal | Drafted | Legal Owner |  |  | ✅ |  |
| TERMS.md | Users/legal | Drafted | Legal Owner |  |  | ✅ |  |
| CONSENT_AND_DATA_USE.md | Legal/engineering | Drafted | Legal Owner |  |  | ✅ |  |
| CONSENT_MODE_GUIDE.md | Legal/ad ops | Drafted | Ad Ops Owner |  |  | ❌ |  |
| INCIDENT_RESPONSE.md | Ops/security | Drafted | Security Lead |  |  | ✅ |  |
| KEY_ROTATION_RUNBOOK.md | Security/ops | Drafted | Security Lead |  |  | ✅ |  |
| SECURITY_MONITORING.md | Security/ops | Drafted | Security Lead |  |  | ✅ |  |
| SLO_AND_ALERTING.md | Engineering/ops | Drafted | Ops Owner |  |  | ✅ |  |
| ONCALL_RUNBOOK.md | Operations | Drafted | Ops Owner |  |  | ✅ |  |
| METHODOLOGY_VERSIONING.md | Research/public | Drafted | Research Owner |  |  | ✅ |  |
| RESEARCH_LIMITATIONS.md | Research/public | Drafted | Research Owner |  |  | ✅ |  |
| VALIDATION_STATUS.md | Research/public | Drafted | Research Owner |  |  | ✅ |  |
| PWA_READINESS_ASSESSMENT.md | Engineering/product | Drafted | Frontend Lead |  |  | ❌ |  |
| PWA_OPERATIONS.md | Frontend/ops | Drafted | Frontend Lead |  |  | ❌ |  |
| LIGHTHOUSE_BASELINES.md | Frontend/ops | Drafted | Frontend Lead |  |  | ❌ |  |
| AD_PARTNER_READINESS_ASSESSMENT.md | Ad ops/product | Drafted | Ad Ops Owner |  |  | ❌ |  |
| AD_POLICY_COMPLIANCE.md | Ad ops/legal | Drafted | Ad Ops Owner |  |  | ✅ |  |
| AD_INCIDENT_RUNBOOK.md | Ad ops/ops | Drafted | Ad Ops Owner |  |  | ✅ |  |
| DOCUMENTATION_LAUNCH_AUDIT.md | Leadership | Drafted | Documentation Lead |  |  | ❌ |  |
| DOCUMENTATION_REMEDIATION_PLAN_AND_RERUN.md | Leadership | Drafted | Documentation Lead |  |  | ❌ |  |
| PRODUCTION_GAP_CLOSURE_ASSESSMENT.md | Leadership | Drafted | Documentation Lead |  |  | ❌ |  |

## Minimum go-live documentation gate
All items marked **Launch Blocker = ✅** must be at least:
- Status = Reviewed
- Approver field populated
- Evidence link provided

## Weekly operating cadence
1. Documentation Lead posts matrix delta weekly.
2. Owners update status + evidence links.
3. Launch owner verifies blockers before release window.
