import { requireRedis } from './_lib/redis';
import { applyCors } from './_lib/cors';
import { checkRateLimit } from './_lib/rateLimit';

const STATS_KEY = 'ideology_stats';
const RESULTS_KEY = 'ideology_results';
const MAX_RESULTS = 50000;
const COUNTRY_VALUES_KEY_PREFIX = 'ideology_country_values';
const MAX_COUNTRY_VALUES = 2000;

// Whitelist of valid issue strings to prevent pollution
const VALID_ISSUE_PATTERN = /^[a-zA-Z0-9 &',()-]{1,80}$/;

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

    // Sanitize topIssues: only allow well-formed strings
    const sanitizedIssues = Array.isArray(topIssues)
      ? topIssues.filter(i => typeof i === 'string' && VALID_ISSUE_PATTERN.test(i)).slice(0, 5)
      : [];

    const entry = {
      result_id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      created_at: new Date().toISOString(),
      economic_score: Math.round(economic * 10) / 10,
      social_score: Math.round(social * 10) / 10,
      ideological_cluster: cluster.slice(0, 100),
      typology: String(typology).slice(0, 80),
      top_issues: sanitizedIssues,
      country: typeof country === 'string' ? country.slice(0, 60) : 'Unknown',
      age_band: String(ageBand || 'Unknown').slice(0, 20),
      methodology_version: String(methodologyVersion).slice(0, 20),
      quiz_version: String(quizVersion).slice(0, 20),
    };

    const redis = requireRedis();

    // Store raw result (append-only, no race condition)
    await redis.lpush(RESULTS_KEY, JSON.stringify(entry));
    await redis.ltrim(RESULTS_KEY, 0, MAX_RESULTS - 1);

    // Store per-country score values in separate Redis lists (avoids bloating the stats object)
    const countryEconKey = `${COUNTRY_VALUES_KEY_PREFIX}:${entry.country}:economic`;
    const countrySocialKey = `${COUNTRY_VALUES_KEY_PREFIX}:${entry.country}:social`;
    await Promise.all([
      redis.lpush(countryEconKey, entry.economic_score),
      redis.lpush(countrySocialKey, entry.social_score),
    ]);
    await Promise.all([
      redis.ltrim(countryEconKey, 0, MAX_COUNTRY_VALUES - 1),
      redis.ltrim(countrySocialKey, 0, MAX_COUNTRY_VALUES - 1),
    ]);

    // Atomic stats updates using Redis hash increments (no read-modify-write race)
    const pipeline = redis.pipeline();
    pipeline.hincrby(STATS_KEY, 'totalResponses', 1);
    pipeline.hincrbyfloat(STATS_KEY, 'totalEconomic', entry.economic_score);
    pipeline.hincrbyfloat(STATS_KEY, 'totalSocial', entry.social_score);
    pipeline.hincrby(STATS_KEY, `cluster:${entry.ideological_cluster}`, 1);
    pipeline.hincrby(STATS_KEY, `typology:${entry.typology}`, 1);
    pipeline.hincrby(STATS_KEY, `country:${entry.country}:count`, 1);
    pipeline.hincrbyfloat(STATS_KEY, `country:${entry.country}:totalEconomic`, entry.economic_score);
    pipeline.hincrbyfloat(STATS_KEY, `country:${entry.country}:totalSocial`, entry.social_score);
    pipeline.hincrby(STATS_KEY, `ageBand:${entry.age_band}:count`, 1);
    pipeline.hincrbyfloat(STATS_KEY, `ageBand:${entry.age_band}:totalEconomic`, entry.economic_score);
    pipeline.hincrbyfloat(STATS_KEY, `ageBand:${entry.age_band}:totalSocial`, entry.social_score);

    for (const issue of sanitizedIssues) {
      pipeline.hincrby(STATS_KEY, `topIssue:${entry.country}:${issue}`, 1);
    }

    await pipeline.exec();

    return res.status(200).json({ ok: true, result_id: entry.result_id });
  } catch (err) {
    console.error('collect error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
