# Incident Response Runbook

## Severity Levels
- **SEV-1**: Major outage/data exposure/payment failure with active user harm.
- **SEV-2**: Significant degradation without total outage.
- **SEV-3**: Minor issue, workaround available.

## Initial Triage (first 15 minutes)
1. Confirm impact and affected systems.
2. Assign incident commander.
3. Open incident channel and log timeline.
4. Apply immediate containment (rollback, disable affected integration, rate-limit tighten).

## Escalation
- Security/privacy events -> security owner + legal contact.
- Billing/webhook events -> payments owner + operations owner.
- Platform outage -> on-call engineer + infrastructure owner.

## Communications
- Internal update cadence: every 30 min (SEV-1), every 60 min (SEV-2).
- External status updates: as required by impact/legal obligations.

## Recovery and Closure
1. Verify system health and business metrics recovery.
2. Close incident only after monitoring confirms stability.
3. Publish postmortem within 5 business days.

## Postmortem Template
- Summary
- Timeline
- Root cause
- User/business impact
- Corrective/preventive actions with owners and due dates
