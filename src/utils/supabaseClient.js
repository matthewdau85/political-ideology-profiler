import { getClientConfig } from './env';

const { supabaseUrl, supabaseAnonKey } = getClientConfig();

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

function requireSupabaseConfig() {
  if (!hasSupabaseConfig) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY and rebuild.');
  }
}

function authHeaders(token) {
  return {
    apikey: supabaseAnonKey,
    Authorization: token ? `Bearer ${token}` : `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
  };
}

async function parseResponse(res, fallbackMessage) {
  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    return {
      error: data?.error_description || data?.error || data?.msg || fallbackMessage,
      status: res.status,
    };
  }

  return data;
}

export async function supabaseSignUp(email, password) {
  requireSupabaseConfig();
  const res = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return parseResponse(res, 'Unable to create account');
}

export async function supabaseSignIn(email, password) {
  requireSupabaseConfig();
  const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return parseResponse(res, 'Unable to sign in');
}

export async function supabaseGetUser(accessToken) {
  requireSupabaseConfig();
  const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: 'GET',
    headers: authHeaders(accessToken),
  });
  if (!res.ok) return null;

  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function supabaseRefreshToken(refreshToken) {
  requireSupabaseConfig();
  const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  return parseResponse(res, 'Unable to refresh session');
}
