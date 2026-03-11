import { hasSupabaseConfig, supabaseSignIn, supabaseSignUp, supabaseGetUser, supabaseRefreshToken } from './supabaseClient';

const SESSION_CACHE_KEY = 'ideology_supabase_session_cache';
const ACCESS_TOKEN_KEY = 'ideology_supabase_access_token';
const REFRESH_TOKEN_KEY = 'ideology_supabase_refresh_token';
const USER_RESULTS_PREFIX = 'ideology_user_results';

function getCachedSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_CACHE_KEY) || 'null');
  } catch {
    return null;
  }
}

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function setAccessToken(token) {
  if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
  else localStorage.removeItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function setRefreshToken(token) {
  if (token) localStorage.setItem(REFRESH_TOKEN_KEY, token);
  else localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function cacheSession(user) {
  if (!user) {
    localStorage.removeItem(SESSION_CACHE_KEY);
    return;
  }

  localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify({
    id: user.id,
    email: user.email,
    createdAt: user.created_at,
  }));
}

function resultsKey(userId) {
  return `${USER_RESULTS_PREFIX}:${userId}`;
}

function getResultsForUser(userId) {
  try {
    return JSON.parse(localStorage.getItem(resultsKey(userId)) || '[]');
  } catch {
    return [];
  }
}

function setResultsForUser(userId, results) {
  localStorage.setItem(resultsKey(userId), JSON.stringify(results));
}

function toSessionUser(user) {
  if (!user) return null;
  const results = getResultsForUser(user.id);
  const latest = results[results.length - 1] || null;

  return {
    id: user.id,
    email: user.email,
    createdAt: user.created_at,
    results,
    profile: latest ? {
      latestCluster: latest.cluster,
      latestEconomic: latest.economic,
      latestSocial: latest.social,
      closestFigures: latest.closestFigures || [],
      topIssues: latest.topIssues || [],
    } : null,
  };
}

export function getSession() {
  return getCachedSession();
}

export async function hydrateSession() {
  if (!hasSupabaseConfig) return getCachedSession();
  const accessToken = getAccessToken();
  if (!accessToken) return null;

  let user = await supabaseGetUser(accessToken);

  // If access token expired, try refreshing
  if (!user) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      const refreshed = await supabaseRefreshToken(refreshToken);
      if (refreshed.access_token) {
        setAccessToken(refreshed.access_token);
        if (refreshed.refresh_token) setRefreshToken(refreshed.refresh_token);
        user = refreshed.user || await supabaseGetUser(refreshed.access_token);
      }
    }
  }

  if (!user) {
    setAccessToken(null);
    setRefreshToken(null);
    cacheSession(null);
    return null;
  }

  cacheSession(user);
  return toSessionUser(user);
}

export async function createAccount(email, password) {
  if (!hasSupabaseConfig) {
    return { error: 'Authentication is not configured. Set Supabase environment variables.' };
  }

  const data = await supabaseSignUp(email, password);
  if (data.error) return { error: data.error_description || data.msg || 'Unable to create account' };

  if (data.access_token) setAccessToken(data.access_token);
  if (data.refresh_token) setRefreshToken(data.refresh_token);
  cacheSession(data.user || null);
  return { user: toSessionUser(data.user), needsEmailVerification: !data.access_token };
}

export async function login(email, password) {
  if (!hasSupabaseConfig) {
    return { error: 'Authentication is not configured. Set Supabase environment variables.' };
  }

  const data = await supabaseSignIn(email, password);
  if (data.error) return { error: data.error_description || data.msg || 'Invalid email or password' };

  setAccessToken(data.access_token);
  if (data.refresh_token) setRefreshToken(data.refresh_token);
  const user = data.user || await supabaseGetUser(data.access_token);
  cacheSession(user || null);
  return { user: toSessionUser(user) };
}

export async function logout() {
  setAccessToken(null);
  setRefreshToken(null);
  cacheSession(null);
}

export function getAccessTokenForApi() {
  return getAccessToken();
}

export function saveUserResult(result) {
  const session = getCachedSession();
  if (!session?.id) return null;

  const entry = {
    id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
    economic: result.economic,
    social: result.social,
    cluster: result.cluster,
    typology: result.typology,
    timestamp: new Date().toISOString(),
    topIssues: result.topIssues || [],
    radarScores: result.radarScores || [],
    closestFigures: result.closestFigures || [],
  };

  // Save locally
  const results = getResultsForUser(session.id);
  results.push(entry);
  setResultsForUser(session.id, results);

  // Persist server-side (fire-and-forget)
  const token = getAccessToken();
  if (token) {
    fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ result: entry }),
    }).catch(() => {});
  }

  return entry;
}

export async function loadServerResults() {
  const session = getCachedSession();
  const token = getAccessToken();
  if (!session?.id || !token) return [];

  try {
    const res = await fetch('/api/results', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const { results } = await res.json();
    if (Array.isArray(results) && results.length > 0) {
      // Merge server results with local, deduplicating by id
      const local = getResultsForUser(session.id);
      const ids = new Set(local.map(r => r.id));
      const merged = [...local];
      for (const r of results) {
        if (!ids.has(r.id)) merged.push(r);
      }
      merged.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setResultsForUser(session.id, merged);
      return merged;
    }
    return [];
  } catch {
    return [];
  }
}

export function getUserResults() {
  const session = getCachedSession();
  if (!session?.id) return [];
  return getResultsForUser(session.id);
}

export function deleteUserData() {
  const session = getCachedSession();
  if (!session?.id) return;
  setResultsForUser(session.id, []);
}

export async function deleteAccount() {
  const accessToken = getAccessToken();
  if (accessToken) {
    try {
      await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch {
      // Continue with local cleanup even if server call fails
    }
  }
  deleteUserData();
  await logout();
}
