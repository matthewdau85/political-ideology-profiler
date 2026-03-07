# Consent and Data Use Matrix

## Purpose
Defines consent states, data processing behavior, and user controls.

## Consent States
- `accepted`: user consented to non-essential analytics/ads data processing.
- `declined`: user declined non-essential processing.
- `unset`: no explicit choice yet.

## Data Flow Matrix
| Data Flow | Essential | Requires consent | Notes |
|---|---:|---:|---|
| Authentication/session APIs | ✅ | ❌ | Required for account features |
| Quiz result persistence for logged-in user | ✅ | ❌ | Product functionality |
| Aggregate analytics submission | ❌ | ✅ | Controlled by consent state |
| Ad personalization | ❌ | ✅ | Provider-dependent behavior |
| Security logs/abuse detection | ✅ | ❌ | Legitimate security need |

## User Controls
- Banner controls for consent state
- Browser cookie controls
- Account deletion and support request pathways

## Operational Requirements
- Consent state must be respected in telemetry/ads paths.
- Consent changes should apply on next request cycle.
- Regional legal requirements (e.g., GDPR/EEA/UK) must be reflected in CMP behavior.
