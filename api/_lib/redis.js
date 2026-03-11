import { Redis } from '@upstash/redis';

/**
 * Shared Redis client factory.
 * Returns null when credentials are missing (allows graceful fallback).
 */
export function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

/**
 * Returns a Redis client or throws if not configured.
 * Use when Redis is required (collect, stats endpoints).
 */
export function requireRedis() {
  const redis = getRedis();
  if (!redis) throw new Error('Redis is not configured');
  return redis;
}
