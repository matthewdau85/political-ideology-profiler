// Vercel Serverless Function — collects anonymized quiz results
// Stores minimal aggregate data only: scores, cluster, country, timestamp
// No IP logging, no personal data, no individual answers
//
// Requires Upstash Redis. Add a Redis integration from the Vercel Marketplace,
// or set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in environment variables.

import { Redis } from '@upstash/redis';

const STATS_KEY = 'ideology_stats';
const RESULTS_KEY = 'ideology_results';
const MAX_RESULTS = 50000;

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { economic, social, cluster, country } = req.body || {};

    // Validate input
    if (typeof economic !== 'number' || typeof social !== 'number') {
      return res.status(400).json({ error: 'Invalid scores' });
    }
    if (economic < -10 || economic > 10 || social < -10 || social > 10) {
      return res.status(400).json({ error: 'Scores out of range' });
    }
    if (typeof cluster !== 'string' || cluster.length > 100) {
      return res.status(400).json({ error: 'Invalid cluster' });
    }

    const sanitizedCountry = typeof country === 'string' ? country.slice(0, 60) : 'Unknown';

    const entry = {
      economic: Math.round(economic * 10) / 10,
      social: Math.round(social * 10) / 10,
      cluster: cluster.slice(0, 100),
      country: sanitizedCountry,
      timestamp: new Date().toISOString(),
    };

    const redis = getRedis();

    // Append to results list (capped)
    await redis.lpush(RESULTS_KEY, JSON.stringify(entry));
    await redis.ltrim(RESULTS_KEY, 0, MAX_RESULTS - 1);

    // Update running stats
    const stats = (await redis.get(STATS_KEY)) || {
      totalResponses: 0,
      totalEconomic: 0,
      totalSocial: 0,
      clusters: {},
      countries: {},
    };

    stats.totalResponses += 1;
    stats.totalEconomic += entry.economic;
    stats.totalSocial += entry.social;
    stats.clusters[entry.cluster] = (stats.clusters[entry.cluster] || 0) + 1;

    if (!stats.countries[entry.country]) {
      stats.countries[entry.country] = { count: 0, totalEconomic: 0, totalSocial: 0 };
    }
    stats.countries[entry.country].count += 1;
    stats.countries[entry.country].totalEconomic += entry.economic;
    stats.countries[entry.country].totalSocial += entry.social;

    await redis.set(STATS_KEY, stats);

    return res.status(200).json({ ok: true });
  } catch (err) {
    if (err.message?.includes('UPSTASH') || err.message?.includes('Redis') || !process.env.UPSTASH_REDIS_REST_URL) {
      return res.status(503).json({
        error: 'Data collection not yet configured. Add an Upstash Redis integration in your Vercel dashboard.',
      });
    }
    console.error('collect error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
