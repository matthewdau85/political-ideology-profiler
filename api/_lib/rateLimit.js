import { Redis } from '@upstash/redis';

const memoryHits = new Map();

function getIdentifier(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
}

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function inMemoryLimit(key, limit = 30, windowMs = 60_000) {
  const now = Date.now();
  const entry = memoryHits.get(key) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count += 1;
  memoryHits.set(key, entry);
  return { success: entry.count <= limit, reset: entry.resetAt };
}

async function redisLimit(key, limit = 30, windowSeconds = 60) {
  const redis = getRedis();
  if (!redis) return null;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, windowSeconds);
  }
  return { success: count <= limit, reset: Date.now() + windowSeconds * 1000 };
}

export async function checkRateLimit(req, res, keyPrefix, options = { limit: 30, window: '1 m' }) {
  const identifier = getIdentifier(req);
  const key = `${keyPrefix}:${identifier}`;

  const limit = options.limit || 30;
  const windowSeconds = 60;

  const redisResult = await redisLimit(key, limit, windowSeconds);
  const result = redisResult || inMemoryLimit(key, limit, windowSeconds * 1000);

  if (!result.success) {
    res.setHeader('Retry-After', String(Math.ceil((result.reset - Date.now()) / 1000)));
    res.status(429).json({ error: 'Too many requests' });
    return false;
  }

  return true;
}
