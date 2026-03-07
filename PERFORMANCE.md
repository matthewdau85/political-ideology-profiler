# PERFORMANCE

## Existing Optimizations
- Route-level lazy loading.
- Chart and map chunk splitting via Vite manual chunks.

## Current Risks
- Heavy chart/report payload on results route.

## Actions
- Keep charts/report modules code-split.
- Add CI bundle budget checks.
- Measure Web Vitals in production.
