# SLO and Alerting Baselines

## Core SLOs
- Auth success rate: >= 99.5%
- Entitlement verification success rate: >= 99.9%
- Quiz result write success rate: >= 99.5%
- Stripe webhook processing success rate: >= 99.9%

## Latency Objectives
- `/api/entitlements/verify` p95 < 400ms
- `/api/me/results` p95 < 600ms

## Alert Rules
- Trigger alert when SLO error budget burn exceeds agreed threshold.
- SEV-1 if billing/entitlement path unavailable > 5 minutes.

## Dashboards
Create dashboards segmented by environment:
- Preview
- Production
