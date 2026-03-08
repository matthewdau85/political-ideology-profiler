# On-Call Runbook

## Daily Checks
- API error rates
- Stripe webhook delivery status
- Auth/signup anomaly checks

## Incident Decision Tree
1. Is billing affected? If yes, treat as high priority.
2. Is auth affected? If yes, verify Supabase health and token validation path.
3. Is data persistence affected? Check `/api/me/results` errors and Supabase availability.

## Immediate Mitigations
- Roll back deployment
- Disable checkout temporarily
- Restrict origins/rate limits during abuse events

## Escalation Contacts
Populate with:
- Engineering on-call
- Security contact
- Legal/privacy contact
- Product owner
