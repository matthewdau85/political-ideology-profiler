# OWNER OPS

## Daily checks
- Verify webhook delivery success in Stripe dashboard.
- Check API error rates (collect/contact/entitlements).
- Review abuse signals (429 spikes, repeated bot attempts).

## Weekly checks
- Validate conversion funnel (`quiz_started -> purchase_completed`).
- Review suppressed subgroup stats to confirm thresholding behavior.
- Rotate and verify backup access credentials.

## Incident controls
- Disable checkout by removing Stripe price env vars.
- Roll back deployment from Vercel.
- Update `ALLOWED_ORIGINS` immediately if CORS abuse is detected.
