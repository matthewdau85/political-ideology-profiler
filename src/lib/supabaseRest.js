import { getAccessToken, getSupabaseConfig } from './supabaseClient';

const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

export async function restRequest(path, { method = 'GET', body, token, prefer = '' } = {}) {
  const authToken = token || (await getAccessToken());
  if (!authToken) {
    throw new Error('Authentication required');
  }

  const headers = {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };

  if (prefer) {
    headers.Prefer = prefer;
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || 'Database request failed');
  }

  return payload;
}
