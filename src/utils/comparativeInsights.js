import figures from '../data/figures';

function pct(n) {
  return `${Math.max(0, Math.min(100, Math.round(n)))}%`;
}

function percentileAgainst(values, value) {
  if (!values.length) return null;
  const less = values.filter((v) => v < value).length;
  return (less / values.length) * 100;
}

export function generateComparativeInsights(result, allResults = []) {
  const insights = [];
  const econValues = allResults.map((r) => r.economic).filter((v) => typeof v === 'number');
  const socialValues = allResults.map((r) => r.social).filter((v) => typeof v === 'number');

  const econPct = percentileAgainst(econValues, result.economic);
  if (econPct != null) {
    insights.push(`You are more economically left than ${pct(100 - econPct)} of users in the dataset.`);
  }

  const socialPct = percentileAgainst(socialValues, result.social);
  if (socialPct != null) {
    insights.push(`You are more socially progressive than ${pct(100 - socialPct)} of users in the dataset.`);
  }

  const nearest = figures
    .map((f) => ({ ...f, distance: Math.sqrt((f.economic - result.economic) ** 2 + (f.social - result.social) ** 2) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 2);

  if (nearest.length) {
    insights.push(`Your profile is closest to ${nearest.map((n) => n.name).join(' and ')} in our historical figure map.`);
  }

  return insights.slice(0, 3);
}
