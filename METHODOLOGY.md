# METHODOLOGY

## Scoring Formulas
- Economic and social axes are normalized to `[-10, +10]`.
- Per-answer contribution:
  - `contribution = axis_value * importance_weight * conviction_multiplier`
- Axis score:
  - `score = clamp((weighted_sum / max_possible) * 10, -10, 10)`

## Classification
- User position is compared to predefined ideological cluster centroids.
- Cluster probabilities are derived from normalized distance metrics.

## Radar Dimensions
- 7 derived dimensions from weighted economic/social responses.
- Radar values are transformed to `[0,100]` for comparability.

## Methodological Limits
- Current model is heuristic and educational, not diagnostic.
- Requires calibration studies for reliability and validity claims.

## Research Anchors
- Downs (spatial competition), Inglehart (value change), two-axis traditions (Compass/Nolan), Pew typology framing.
