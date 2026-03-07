# TYPOLOGY MODEL

Eight typologies are inferred from:
- economic axis score
- social axis score
- radar dimensions
- top issue signals

## Outputs
- `primary` typology
- `secondary` typology
- `confidence` (0-100)

## Logic
1. Compute distance from user axis coordinates to typology centroids.
2. Rank nearest typologies.
3. Apply issue/radar-informed adjustments.
4. Return primary/secondary + confidence.

This is a heuristic educational classifier and should not be treated as a clinical or deterministic model.
