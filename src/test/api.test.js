import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Redis
const mockRedis = {
  lpush: vi.fn().mockResolvedValue(1),
  ltrim: vi.fn().mockResolvedValue('OK'),
  pipeline: vi.fn(() => ({
    hincrby: vi.fn(),
    hincrbyfloat: vi.fn(),
    lpush: vi.fn(),
    exec: vi.fn().mockResolvedValue([]),
  })),
  get: vi.fn().mockResolvedValue(null),
  set: vi.fn().mockResolvedValue('OK'),
  hgetall: vi.fn().mockResolvedValue({}),
  lrange: vi.fn().mockResolvedValue([]),
  del: vi.fn().mockResolvedValue(1),
  incr: vi.fn().mockResolvedValue(1),
  expire: vi.fn().mockResolvedValue(1),
};

class MockRedis {
  constructor() {
    Object.assign(this, mockRedis);
  }
}

vi.mock('@upstash/redis', () => ({
  Redis: MockRedis,
}));

// Mock env vars
vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://test.upstash.io');
vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-token');
vi.stubEnv('ALLOWED_ORIGINS', 'http://localhost:3000');
vi.stubEnv('SUPABASE_URL', 'https://test.supabase.co');
vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-service-role');

function mockReq(overrides = {}) {
  return {
    method: 'POST',
    headers: { origin: 'http://localhost:3000', ...overrides.headers },
    body: overrides.body || {},
    query: overrides.query || {},
    socket: { remoteAddress: '127.0.0.1' },
    ...overrides,
  };
}

function mockRes() {
  const res = {
    statusCode: 200,
    _headers: {},
    _body: null,
    setHeader(key, value) { res._headers[key] = value; return res; },
    status(code) { res.statusCode = code; return res; },
    json(body) { res._body = body; return res; },
    end() { return res; },
  };
  return res;
}

describe('collect endpoint', () => {
  let handler;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import('../../api/collect.js');
    handler = mod.default;
  });

  it('rejects non-POST requests', async () => {
    const req = mockReq({ method: 'GET' });
    const res = mockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(405);
  });

  it('rejects missing scores', async () => {
    const req = mockReq({ body: { cluster: 'test' } });
    const res = mockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._body.error).toBe('Invalid scores');
  });

  it('rejects out of range scores', async () => {
    const req = mockReq({ body: { economic: 15, social: 0, cluster: 'test' } });
    const res = mockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._body.error).toBe('Scores out of range');
  });

  it('rejects missing cluster', async () => {
    const req = mockReq({ body: { economic: 5, social: 3 } });
    const res = mockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });

  it('accepts valid submission and returns result_id', async () => {
    const req = mockReq({
      body: {
        economic: 3.5,
        social: -2.1,
        cluster: 'Progressive Liberal',
        country: 'Australia',
        typology: 'Technocratic Liberal',
        topIssues: ['Healthcare', 'Education'],
        ageBand: '25-34',
      },
    });
    const res = mockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._body.ok).toBe(true);
    expect(res._body.result_id).toBeDefined();
  });

  it('filters invalid topIssues entries', async () => {
    const req = mockReq({
      body: {
        economic: 0,
        social: 0,
        cluster: 'Test',
        topIssues: ['Valid Issue', '<script>alert(1)</script>', 'Another Valid'],
      },
    });
    const res = mockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
  });
});

describe('contact endpoint', () => {
  let handler;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import('../../api/contact.js');
    handler = mod.default;
  });

  it('rejects non-POST requests', async () => {
    const req = mockReq({ method: 'GET' });
    const res = mockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(405);
  });

  it('rejects honeypot field (bot detection)', async () => {
    const req = mockReq({ body: { email: 'a@b.com', message: 'hi', website: 'spam' } });
    const res = mockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._body.error).toBe('Bot detected');
  });

  it('rejects missing email', async () => {
    const req = mockReq({ body: { message: 'hello' } });
    const res = mockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });

  it('rejects invalid email format', async () => {
    const req = mockReq({ body: { email: 'notanemail', message: 'hello' } });
    const res = mockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._body.error).toBe('Invalid email format');
  });

  it('rejects messages that are too long', async () => {
    const req = mockReq({ body: { email: 'a@b.com', message: 'x'.repeat(5001) } });
    const res = mockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._body.error).toBe('Message too long');
  });

  it('accepts valid contact submission', async () => {
    const req = mockReq({
      body: { email: 'user@example.com', message: 'Great quiz!', name: 'Test User' },
    });
    const res = mockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._body.ok).toBe(true);
  });
});

describe('verify-entitlement endpoint', () => {
  let handler;

  beforeEach(async () => {
    vi.resetModules();
    // Mock auth to return a user
    vi.doMock('../../api/_lib/auth.js', () => ({
      getAuthenticatedUser: vi.fn().mockResolvedValue({ id: 'user-123', email: 'test@test.com' }),
    }));
    const mod = await import('../../api/verify-entitlement.js');
    handler = mod.default;
  });

  it('rejects non-GET requests', async () => {
    const req = mockReq({ method: 'POST' });
    const res = mockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(405);
  });

  it('rejects invalid feature names', async () => {
    const req = mockReq({ method: 'GET', query: { feature: 'nonexistent' } });
    const res = mockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });

  it('returns entitled status without leaking userId', async () => {
    const req = mockReq({
      method: 'GET',
      query: { feature: 'deep_analysis' },
      headers: { origin: 'http://localhost:3000', authorization: 'Bearer test-token' },
    });
    const res = mockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._body).toHaveProperty('entitled');
    expect(res._body).toHaveProperty('feature');
    expect(res._body).not.toHaveProperty('userId');
  });
});
