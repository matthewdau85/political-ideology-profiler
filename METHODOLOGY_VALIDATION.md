# Methodology Validation

Date: 2026-03-07
Current model class: heuristic educational classification.

## Scoring formula (current)
- Economic and social scores are derived from weighted answer choices.
- Radar/typology outputs derive from issue-level aggregates and typology heuristics.

## Typology logic
- Primary + secondary typology generated from economic/social + radar + issue vectors.
- Output is a heuristic fit classification, not a clinically validated psychometric diagnosis.

## Calibration design (planned)
1. Assemble stratified sample by country/age-band.
2. Run test-retest interval studies.
3. Compare cluster stability and typology drift metrics.
4. Publish confidence interval and subgroup caveats.

## Reliability discussion
- Current reliability evidence is limited; model should be described as exploratory.
- Planned reliability metrics:
  - test-retest Pearson/Spearman by axis
  - split-half consistency
  - cluster transition rates over short intervals

## Known limitations
- Non-representative sample bias.
- Cultural/political context transferability limitations.
- Self-report bias and response style effects.

## Versioning strategy
- Persist `methodology_version` and `quiz_version` on each result row.
- Maintain changelog entries for any item wording/weight changes.
