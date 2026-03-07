# Security Monitoring

## Signals to Monitor
- Auth failures and unusual spikes
- Rate-limit hits and abuse signatures
- Entitlement verification anomalies
- Stripe webhook signature failures
- Elevated 4xx/5xx on sensitive endpoints

## Alerting Baseline
- Auth error rate > 5% for 5 minutes
- Webhook failures > 3 consecutive events
- Entitlement API 5xx > 1% for 5 minutes
- Suspicious request burst from single origin/IP fingerprint pattern

## Logging Requirements
- Structured logs for API routes
- Redaction of secrets and sensitive payload fields
- Retention period aligned with policy/legal requirements
