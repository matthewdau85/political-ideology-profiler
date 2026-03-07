# DATA DICTIONARY

## Calibration record schema
- `result_id` (string): anonymized random id
- `created_at` (ISO timestamp)
- `economic_score` (number, -10..10)
- `social_score` (number, -10..10)
- `ideological_cluster` (string)
- `typology` (string)
- `top_issues` (array[string], max 5)
- `country` (string)
- `age_band` (string, optional)
- `methodology_version` (string)
- `quiz_version` (string)

## Aggregate outputs
- `totalResponses`
- `averageEconomicScore`
- `averageSocialScore`
- `clusterDistribution`
- `typologyDistribution`
- `responsesByCountry` (suppressed when n<100)
- `responsesByAgeBand` (suppressed when n<100)
- `topIssuesByCountry` (suppressed when n<100)
