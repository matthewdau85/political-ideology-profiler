import { hasSupabaseConfig, supabaseSignIn, supabaseSignUp, supabaseGetUser } from './supabaseClient';

const SESSION_CACHE_KEY = 'ideology_supabase_session_cache';
const ACCESS_TOKEN_KEY = 'ideology_supabase_access_token';
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
  const user = await supabaseGetUser(accessToken);
  if (!user) {
    setAccessToken(null);
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
  const user = data.user || await supabaseGetUser(data.access_token);
  cacheSession(user || null);
  return { user: toSessionUser(user) };
}

export async function logout() {
  setAccessToken(null);
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
    timestamp: new Date().toISOString(),
    topIssues: result.topIssues || [],
    radarScores: result.radarScores || [],
    closestFigures: result.closestFigures || [],
  };

  const results = getResultsForUser(session.id);
  results.push(entry);
  setResultsForUser(session.id, results);
  return entry;
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
