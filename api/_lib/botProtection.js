export async function verifyTurnstileToken(token, remoteIp) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return { ok: true, reason: 'turnstile_not_configured' };
  }

  if (!token) {
    return { ok: false, reason: 'missing_captcha_token' };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteIp) {
    body.append('remoteip', remoteIp);
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) {
    return {
      ok: false,
      reason: (result['error-codes'] || ['captcha_verification_failed']).join(','),
    };
  }

  return { ok: true, reason: 'verified' };
}

export async function requireCaptcha(req, res, { required = false } = {}) {
  const token = req.body?.captchaToken || req.headers['x-captcha-token'];
  const remoteIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '';

  if (!required && !process.env.TURNSTILE_SECRET_KEY) {
    return true;
  }

  const verification = await verifyTurnstileToken(token, remoteIp);
  if (!verification.ok) {
    res.status(400).json({ error: 'CAPTCHA verification failed', reason: verification.reason });
    return false;
  }

  return true;
}
