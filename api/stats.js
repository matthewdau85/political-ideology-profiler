// Vercel Serverless Function — returns anonymized aggregate statistics
// No individual results or personal data are exposed
//
// Requires Upstash Redis. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
// in your Vercel environment variables.

import { Redis } from '@upstash/redis';

const STATS_KEY = 'ideology_stats';

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const redis = getRedis();
    const stats = (await redis.get(STATS_KEY)) || {
      totalResponses: 0,
      totalEconomic: 0,
      totalSocial: 0,
      clusters: {},
      countries: {},
    };

    const avgEconomic = stats.totalResponses > 0
      ? Math.round((stats.totalEconomic / stats.totalResponses) * 10) / 10
      : 0;
    const avgSocial = stats.totalResponses > 0
      ? Math.round((stats.totalSocial / stats.totalResponses) * 10) / 10
      : 0;

    const countryStats = {};
    for (const [name, data] of Object.entries(stats.countries || {})) {
      countryStats[name] = {
        responses: data.count,
        avgEconomic: Math.round((data.totalEconomic / data.count) * 10) / 10,
        avgSocial: Math.round((data.totalSocial / data.count) * 10) / 10,
      };
    }

    return res.status(200).json({
      status: 'ok',
      data: {
        totalResponses: stats.totalResponses,
        averageEconomicScore: avgEconomic,
        averageSocialScore: avgSocial,
        clusterDistribution: stats.clusters,
        responsesByCountry: countryStats,
      },
      meta: {
        anonymized: true,
        generatedAt: new Date().toISOString(),
        description: 'Anonymized aggregate statistics from the Political Ideology Profiler.',
      },
    });
  } catch (err) {
    if (err.message?.includes('UPSTASH') || err.message?.includes('Redis') || !process.env.UPSTASH_REDIS_REST_URL) {
      return res.status(503).json({
        error: 'Statistics not yet available. Add an Upstash Redis integration in your Vercel dashboard.',
      });
    }
    console.error('stats error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
