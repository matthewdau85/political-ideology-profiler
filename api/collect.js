import { Redis } from '@upstash/redis';
import { applyCors } from './_lib/cors';
import { checkRateLimit } from './_lib/rateLimit';

const STATS_KEY = 'ideology_stats';
const RESULTS_KEY = 'ideology_results';
const MAX_RESULTS = 50000;

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_KV_REST_API_URL || process.env.KV_REST_API_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN,
  });
}

export default async function handler(req, res) {
  if (!applyCors(req, res, ['POST'])) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await checkRateLimit(req, res, 'collect', { limit: 30, window: '1 m' }))) return;

  try {
    const {
      economic,
      social,
      cluster,
      country,
      typology = 'Unknown',
      topIssues = [],
      ageBand = 'Unknown',
      methodologyVersion = '2026.1',
      quizVersion = '2.1',
    } = req.body || {};

    if (typeof economic !== 'number' || typeof social !== 'number') {
      return res.status(400).json({ error: 'Invalid scores' });
    }
    if (economic < -10 || economic > 10 || social < -10 || social > 10) {
      return res.status(400).json({ error: 'Scores out of range' });
    }
    if (typeof cluster !== 'string' || cluster.length > 100) {
      return res.status(400).json({ error: 'Invalid cluster' });
    }

    const entry = {
      result_id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      created_at: new Date().toISOString(),
      economic_score: Math.round(economic * 10) / 10,
      social_score: Math.round(social * 10) / 10,
      ideological_cluster: cluster.slice(0, 100),
      typology: String(typology).slice(0, 80),
      top_issues: Array.isArray(topIssues) ? topIssues.slice(0, 5) : [],
      country: typeof country === 'string' ? country.slice(0, 60) : 'Unknown',
      age_band: String(ageBand || 'Unknown').slice(0, 20),
      methodology_version: String(methodologyVersion).slice(0, 20),
      quiz_version: String(quizVersion).slice(0, 20),
    };

    const redis = getRedis();
    await redis.lpush(RESULTS_KEY, JSON.stringify(entry));
    await redis.ltrim(RESULTS_KEY, 0, MAX_RESULTS - 1);

    const stats = (await redis.get(STATS_KEY)) || {
      totalResponses: 0,
      totalEconomic: 0,
      totalSocial: 0,
      clusters: {},
      typologies: {},
      countries: {},
      ageBands: {},
      topIssuesByCountry: {},
    };

    stats.totalResponses += 1;
    stats.totalEconomic += entry.economic_score;
    stats.totalSocial += entry.social_score;
    stats.clusters[entry.ideological_cluster] = (stats.clusters[entry.ideological_cluster] || 0) + 1;
    stats.typologies[entry.typology] = (stats.typologies[entry.typology] || 0) + 1;

    if (!stats.countries[entry.country]) {
      stats.countries[entry.country] = { count: 0, totalEconomic: 0, totalSocial: 0, economicValues: [], socialValues: [] };
    }
    const c = stats.countries[entry.country];
    c.count += 1;
    c.totalEconomic += entry.economic_score;
    c.totalSocial += entry.social_score;
    c.economicValues = [...(c.economicValues || []), entry.economic_score].slice(-2000);
    c.socialValues = [...(c.socialValues || []), entry.social_score].slice(-2000);

    if (!stats.ageBands[entry.age_band]) stats.ageBands[entry.age_band] = { count: 0, totalEconomic: 0, totalSocial: 0 };
    stats.ageBands[entry.age_band].count += 1;
    stats.ageBands[entry.age_band].totalEconomic += entry.economic_score;
    stats.ageBands[entry.age_band].totalSocial += entry.social_score;

    if (!stats.topIssuesByCountry[entry.country]) stats.topIssuesByCountry[entry.country] = {};
    for (const issue of entry.top_issues) {
      stats.topIssuesByCountry[entry.country][issue] = (stats.topIssuesByCountry[entry.country][issue] || 0) + 1;
    }

    await redis.set(STATS_KEY, stats);
    return res.status(200).json({ ok: true, result_id: entry.result_id });
  } catch (err) {
    console.error('collect error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
