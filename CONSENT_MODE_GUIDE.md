# Consent Mode Guide

## Purpose
Define how consent state controls analytics and ad behavior.

## Consent States and Actions
- Accepted: enable configured analytics and ad personalization flows.
- Declined: disable non-essential tracking/personalization.
- Unset: default to least-privilege non-essential behavior until user action (region-dependent).

## Implementation Notes
- Respect local legal requirements by region.
- Keep consent state auditable in client behavior and documentation.
- Re-evaluate consent setup whenever ad/analytics providers change.
