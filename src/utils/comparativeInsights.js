import figures from '../data/figures';

function pct(n) {
  return `${Math.max(0, Math.min(100, Math.round(n)))}%`;
}

function percentileAgainst(values, value) {
  if (!values.length) return null;
  const less = values.filter((v) => v < value).length;
  return (less / values.length) * 100;
}

function fmt(n) {
  return `${n > 0 ? '+' : ''}${n}`;
}

/**
 * Generate up to 3 comparative insights for a result.
 *
 * @param {object} result       - The user's result object (economic, social, …)
 * @param {Array}  allResults   - Local results array from resultsStore (localStorage)
 * @param {object} [serverStats] - Optional payload from /api/stats:
 *   { totalResponses, averageEconomicScore, averageSocialScore }
 *   When provided, comparisons use the global dataset rather than
 *   the local device history, which is far more meaningful.
 */
export function generateComparativeInsights(result, allResults = [], serverStats = null) {
  const insights = [];

  // --- Economic comparison ---
  if (serverStats && typeof serverStats.averageEconomicScore === 'number' && serverStats.totalResponses > 0) {
    const avg = serverStats.averageEconomicScore;
    const diff = Math.round((result.economic - avg) * 10) / 10;
    if (diff < 0) {
      insights.push(
        `Your economic score (${fmt(result.economic)}) is more left-leaning than the global average of ${fmt(avg)} across ${serverStats.totalResponses.toLocaleString()} responses.`
      );
    } else if (diff > 0) {
      insights.push(
        `Your economic score (${fmt(result.economic)}) is more right-leaning than the global average of ${fmt(avg)} across ${serverStats.totalResponses.toLocaleString()} responses.`
      );
    } else {
      insights.push(
        `Your economic score (${fmt(result.economic)}) is exactly at the global average across ${serverStats.totalResponses.toLocaleString()} responses.`
      );
    }
  } else {
    // Fall back to local percentile comparison
    const econValues = allResults.map((r) => r.economic).filter((v) => typeof v === 'number');
    const econPct = percentileAgainst(econValues, result.economic);
    if (econPct != null) {
      insights.push(`You are more economically left than ${pct(100 - econPct)} of your saved results.`);
    }
  }

  // --- Social comparison ---
  if (serverStats && typeof serverStats.averageSocialScore === 'number' && serverStats.totalResponses > 0) {
    const avg = serverStats.averageSocialScore;
    if (result.social < avg) {
      insights.push(
        `Your social score (${fmt(result.social)}) is more progressive than the global average of ${fmt(avg)}.`
      );
    } else if (result.social > avg) {
      insights.push(
        `Your social score (${fmt(result.social)}) is more conservative than the global average of ${fmt(avg)}.`
      );
    } else {
      insights.push(
        `Your social score (${fmt(result.social)}) matches the global average exactly.`
      );
    }
  } else {
    // Fall back to local percentile comparison
    const socialValues = allResults.map((r) => r.social).filter((v) => typeof v === 'number');
    const socialPct = percentileAgainst(socialValues, result.social);
    if (socialPct != null) {
      insights.push(`You are more socially progressive than ${pct(100 - socialPct)} of your saved results.`);
    }
  }

  // --- Closest historical figures (always available, no auth or server required) ---
  const nearest = figures
    .map((f) => ({ ...f, distance: Math.sqrt((f.economic - result.economic) ** 2 + (f.social - result.social) ** 2) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 2);

  if (nearest.length) {
    insights.push(`Your profile is closest to ${nearest.map((n) => n.name).join(' and ')} in our historical figure map.`);
  }

  return insights.slice(0, 3);
}
