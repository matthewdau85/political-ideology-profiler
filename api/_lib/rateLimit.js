import { getRedis } from './redis.js';

const memoryHits = new Map();
const CLEANUP_INTERVAL = 5 * 60_000; // 5 minutes
let lastCleanup = Date.now();

function getIdentifier(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
}

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of memoryHits) {
    if (now > entry.resetAt) memoryHits.delete(key);
  }
}

function inMemoryLimit(key, limit = 30, windowMs = 60_000) {
  cleanupExpiredEntries();
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
