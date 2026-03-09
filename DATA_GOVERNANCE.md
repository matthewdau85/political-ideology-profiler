# Data Governance

Date: 2026-03-07

## Core rules
1. Aggregates are non-causal and exploratory only.
2. No subgroup publication if sample size < 100.
3. Every published aggregate must include sample size and date range.
4. Bot/manipulation screening required before aggregate publication.

## Integrity controls
- Rate limiting on collection endpoints.
- Optional CAPTCHA verification on write-sensitive endpoints.
- Outlier and burst detection on result submissions.
- Audit trail via source + timestamps + methodology/quiz version fields.

## Publication controls
- Suppress small samples.
- Label confidence caveats.
- Version-stamp all published charts/reports.

## Anti-manipulation
- Detect repeated submissions by IP/user agent/session pattern.
- Flag suspicious high-frequency submissions for exclusion from aggregates.
