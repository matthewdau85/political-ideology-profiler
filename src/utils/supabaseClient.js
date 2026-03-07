import { getEnv } from './env';

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

function authHeaders(token) {
  return {
    apikey: supabaseAnonKey,
    Authorization: token ? `Bearer ${token}` : `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
  };
}

export async function supabaseSignUp(email, password) {
  const res = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function supabaseSignIn(email, password) {
  const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function supabaseGetUser(accessToken) {
  const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: 'GET',
    headers: authHeaders(accessToken),
  });
  if (!res.ok) return null;
  return res.json();
}
