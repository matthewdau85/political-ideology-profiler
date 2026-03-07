# ANALYTICS

## Event Taxonomy
- `quiz_started`
- `question_answered`
- `quiz_completed`
- `report_viewed`
- `premium_clicked`
- `purchase_completed`
- `share_clicked`

## Funnel
`quiz_started -> quiz_completed -> share_clicked -> premium_clicked -> purchase_completed`

## Providers
- Plausible: `window.plausible`
- PostHog: `window.posthog.capture`

## Next Steps
- Add UTM persistence.
- Add cohort dashboards for completion and paid conversion.
