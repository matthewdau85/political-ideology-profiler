# Methodology Versioning

## Versioning Scheme
`major.minor.patch`
- major: structural model changes
- minor: scoring/rubric adjustments
- patch: copy/clarification-only updates

## Change Log Format
Each entry must include:
- Version
- Date
- What changed
- Expected impact on comparability
- Migration/re-interpretation notes

## Backward Compatibility
- Preserve `methodology_version` and `quiz_version` with each stored result.
- Do not overwrite historical records with new version labels.
