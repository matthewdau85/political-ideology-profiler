export function applyCors(req, res, methods = ['GET']) {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map((v) => v.trim()).filter(Boolean);
  const origin = req.headers.origin;

  if (origin) {
    if (!allowedOrigins.length || !allowedOrigins.includes(origin)) {
      res.status(403).json({ error: 'Origin not allowed' });
      return false;
    }
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', [...methods, 'OPTIONS'].join(', '));
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Stripe-Signature');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return false;
  }

  return true;
}
