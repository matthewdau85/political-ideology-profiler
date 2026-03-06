// Results storage — localStorage with Supabase-ready structure
// All data is anonymized: no names or emails stored in results

const RESULTS_KEY = 'ideology_results';
const DEBATES_KEY = 'ideology_debates';
const PERMALINKS_KEY = 'ideology_permalinks';

export function saveResult(result) {
  const results = getAllResults();
  const entry = {
    id: result.id || crypto.randomUUID?.() || Math.random().toString(36).slice(2),
    economic: result.economic,
    social: result.social,
    cluster: result.cluster,
    timestamp: result.timestamp || new Date().toISOString(),
    topIssues: result.topIssues || [],
    country: result.country || 'Unknown',
    radarScores: result.radarScores || [],
    answers: result.answers || [],
  };
  results.push(entry);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  return entry;
}

export function getAllResults() {
  try {
    return JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getResultById(id) {
  return getAllResults().find(r => r.id === id) || null;
}

export function deleteResult(id) {
  const results = getAllResults().filter(r => r.id !== id);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
}

export function deleteAllResults() {
  localStorage.removeItem(RESULTS_KEY);
}

export function getStats() {
  const results = getAllResults();
  if (results.length === 0) {
    return {
      totalResponses: 0,
      avgEconomic: 0,
      avgSocial: 0,
      clusterDistribution: {},
      countryDistribution: {},
    };
  }

  const avgEconomic = results.reduce((s, r) => s + r.economic, 0) / results.length;
  const avgSocial = results.reduce((s, r) => s + r.social, 0) / results.length;

  const clusterDistribution = {};
  const countryDistribution = {};

  for (const r of results) {
    clusterDistribution[r.cluster] = (clusterDistribution[r.cluster] || 0) + 1;
    if (r.country) {
      if (!countryDistribution[r.country]) {
        countryDistribution[r.country] = { count: 0, totalEconomic: 0, totalSocial: 0 };
      }
      countryDistribution[r.country].count++;
      countryDistribution[r.country].totalEconomic += r.economic;
      countryDistribution[r.country].totalSocial += r.social;
    }
  }

  // Calculate averages per country
  for (const c of Object.keys(countryDistribution)) {
    const cd = countryDistribution[c];
    cd.avgEconomic = Math.round((cd.totalEconomic / cd.count) * 10) / 10;
    cd.avgSocial = Math.round((cd.totalSocial / cd.count) * 10) / 10;
  }

  return {
    totalResponses: results.length,
    avgEconomic: Math.round(avgEconomic * 10) / 10,
    avgSocial: Math.round(avgSocial * 10) / 10,
    clusterDistribution,
    countryDistribution,
  };
}

// === Debate storage ===
export function saveDebate(debate) {
  const debates = getAllDebates();
  debates.push(debate);
  localStorage.setItem(DEBATES_KEY, JSON.stringify(debates));
  return debate;
}

export function getAllDebates() {
  try {
    return JSON.parse(localStorage.getItem(DEBATES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getDebateById(id) {
  return getAllDebates().find(d => d.id === id) || null;
}

export function updateDebate(id, updates) {
  const debates = getAllDebates();
  const index = debates.findIndex(d => d.id === id);
  if (index === -1) return null;
  debates[index] = { ...debates[index], ...updates };
  localStorage.setItem(DEBATES_KEY, JSON.stringify(debates));
  return debates[index];
}

// === Permalink storage ===
export function savePermalink(id, resultData) {
  const links = getAllPermalinks();
  links[id] = resultData;
  localStorage.setItem(PERMALINKS_KEY, JSON.stringify(links));
}

export function getPermalink(id) {
  const links = getAllPermalinks();
  return links[id] || null;
}

export function getLatestPermalink() {
  const all = getAllPermalinks();
  const keys = Object.keys(all);
  return keys.length ? all[keys[keys.length - 1]] : null;
}

export function getAllPermalinkEntries() {
  const all = getAllPermalinks();
  return Object.entries(all).map(([id, data]) => ({ id, ...data }));
}

function getAllPermalinks() {
  try {
    return JSON.parse(localStorage.getItem(PERMALINKS_KEY) || '{}');
  } catch {
    return {};
  }
}
