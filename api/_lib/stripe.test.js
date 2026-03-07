import crypto from 'crypto';
import { describe, expect, it } from 'vitest';
import { verifyStripeWebhookSignature } from './stripe';

function signPayload(payload, secret, ts = Math.floor(Date.now() / 1000)) {
  const signedPayload = `${ts}.${payload}`;
  const digest = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
  return `t=${ts},v1=${digest}`;
}

describe('verifyStripeWebhookSignature', () => {
  const secret = 'whsec_test_secret';
  const payload = JSON.stringify({ id: 'evt_test', type: 'checkout.session.completed' });

  it('accepts valid signatures', () => {
    const header = signPayload(payload, secret);
    expect(verifyStripeWebhookSignature(Buffer.from(payload), header, secret)).toBe(true);
  });

  it('rejects invalid signatures', () => {
    const header = 't=1700000000,v1=bad_signature';
    expect(verifyStripeWebhookSignature(Buffer.from(payload), header, secret)).toBe(false);
  });

  it('rejects old signatures outside tolerance window', () => {
    const oldTimestamp = Math.floor(Date.now() / 1000) - 3600;
    const header = signPayload(payload, secret, oldTimestamp);
    expect(verifyStripeWebhookSignature(Buffer.from(payload), header, secret)).toBe(false);
  });
});
