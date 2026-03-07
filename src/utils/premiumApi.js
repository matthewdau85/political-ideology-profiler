import { stripePublishableKey } from './env';
import { getAccessTokenForApi } from './authStore';

async function fetchJson(url, options = {}) {
  const token = getAccessTokenForApi();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(url, { ...options, headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || 'Request failed');
  }
  return body;
}

export async function verifyEntitlement(feature) {
  return fetchJson(`/api/entitlements/verify?feature=${encodeURIComponent(feature)}`);
}

export async function startCheckout(feature) {
  const key = stripePublishableKey();
  if (!key) throw new Error('Stripe publishable key is missing');

  const { checkoutUrl } = await fetchJson('/api/stripe/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify({ feature }),
  });

  window.location.href = checkoutUrl;
}
