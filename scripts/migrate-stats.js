#!/usr/bin/env node

/**
 * One-time migration: converts the legacy JSON-blob stats format
 * (stored as a single Redis STRING key) to the new hash-based format
 * (stored as a Redis HASH with atomic field increments).
 *
 * Also migrates per-country economicValues/socialValues arrays
 * from the stats blob into separate Redis lists.
 *
 * Usage:
 *   UPSTASH_REDIS_REST_URL=... UPSTASH_REDIS_REST_TOKEN=... node scripts/migrate-stats.js
 *
 * Safe to run multiple times — checks if migration already happened.
 */

import { Redis } from '@upstash/redis';

const STATS_KEY = 'ideology_stats';
const LEGACY_STATS_BACKUP = 'ideology_stats_legacy_backup';
const COUNTRY_VALUES_KEY_PREFIX = 'ideology_country_values';

async function main() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN');
    process.exit(1);
  }

  const redis = new Redis({ url, token });

  // Check if already migrated (new format uses HASH, old uses STRING)
  const keyType = await redis.type(STATS_KEY);

  if (keyType === 'hash') {
    console.log('Stats key is already a hash — migration already complete.');
    return;
  }

  if (keyType === 'none') {
    console.log('No stats key found — nothing to migrate.');
    return;
  }

  if (keyType !== 'string') {
    console.error(`Unexpected key type: ${keyType}`);
    process.exit(1);
  }

  console.log('Reading legacy stats blob...');
  const legacy = await redis.get(STATS_KEY);

  if (!legacy || typeof legacy !== 'object') {
    console.error('Legacy stats is empty or not an object');
    process.exit(1);
  }

  // Back up the legacy data
  console.log('Backing up legacy stats to', LEGACY_STATS_BACKUP);
  await redis.set(LEGACY_STATS_BACKUP, JSON.stringify(legacy));

  // Delete the old STRING key so we can create a HASH with the same name
  await redis.del(STATS_KEY);

  // Build the new hash fields
  const pipeline = redis.pipeline();

  pipeline.hset(STATS_KEY, {
    totalResponses: String(legacy.totalResponses || 0),
    totalEconomic: String(legacy.totalEconomic || 0),
    totalSocial: String(legacy.totalSocial || 0),
  });

  // Clusters
  for (const [name, count] of Object.entries(legacy.clusters || {})) {
    pipeline.hset(STATS_KEY, { [`cluster:${name}`]: String(count) });
  }

  // Typologies
  for (const [name, count] of Object.entries(legacy.typologies || {})) {
    pipeline.hset(STATS_KEY, { [`typology:${name}`]: String(count) });
  }

  // Countries
  for (const [name, data] of Object.entries(legacy.countries || {})) {
    pipeline.hset(STATS_KEY, {
      [`country:${name}:count`]: String(data.count || 0),
      [`country:${name}:totalEconomic`]: String(data.totalEconomic || 0),
      [`country:${name}:totalSocial`]: String(data.totalSocial || 0),
    });

    // Migrate per-country value arrays to separate lists
    const econValues = data.economicValues || [];
    const socialValues = data.socialValues || [];
    if (econValues.length > 0) {
      pipeline.del(`${COUNTRY_VALUES_KEY_PREFIX}:${name}:economic`);
      for (const v of econValues) {
        pipeline.rpush(`${COUNTRY_VALUES_KEY_PREFIX}:${name}:economic`, v);
      }
    }
    if (socialValues.length > 0) {
      pipeline.del(`${COUNTRY_VALUES_KEY_PREFIX}:${name}:social`);
      for (const v of socialValues) {
        pipeline.rpush(`${COUNTRY_VALUES_KEY_PREFIX}:${name}:social`, v);
      }
    }
  }

  // Age bands
  for (const [band, data] of Object.entries(legacy.ageBands || {})) {
    pipeline.hset(STATS_KEY, {
      [`ageBand:${band}:count`]: String(data.count || 0),
      [`ageBand:${band}:totalEconomic`]: String(data.totalEconomic || 0),
      [`ageBand:${band}:totalSocial`]: String(data.totalSocial || 0),
    });
  }

  // Top issues by country
  for (const [country, issues] of Object.entries(legacy.topIssuesByCountry || {})) {
    for (const [issue, count] of Object.entries(issues)) {
      pipeline.hset(STATS_KEY, { [`topIssue:${country}:${issue}`]: String(count) });
    }
  }

  console.log('Executing migration pipeline...');
  await pipeline.exec();

  // Verify
  const newType = await redis.type(STATS_KEY);
  const totalResponses = await redis.hget(STATS_KEY, 'totalResponses');
  console.log(`Migration complete. Key type: ${newType}, totalResponses: ${totalResponses}`);
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
