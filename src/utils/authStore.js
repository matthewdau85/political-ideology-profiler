import { hasSupabaseConfig, supabaseSignIn, supabaseSignUp, supabaseGetUser } from './supabaseClient';

const SESSION_CACHE_KEY = 'ideology_supabase_session_cache';
const ACCESS_TOKEN_KEY = 'ideology_supabase_access_token';

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

function cacheSession(session) {
  if (!session) {
    localStorage.removeItem(SESSION_CACHE_KEY);
    return;
  }
  localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(session));
}

async function apiRequest(path, { method = 'GET', body } = {}) {
  const token = getAccessToken();
  if (!token) throw new Error('Authentication required');

  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload.error || 'Request failed');
  }

  return payload;
}

function mapResultRow(row) {
  return {
    id: row.id,
    economic: row.economic_score,
    social: row.social_score,
    cluster: row.ideological_cluster,
    typology: row.typology,
    secondaryTypology: row.secondary_typology,
    typologyConfidence: row.typology_fit_score,
    radarScores: row.radar_scores || [],
    topIssues: row.top_issues || [],
    country: row.country || 'Unknown',
    ageBand: row.age_band || 'Unknown',
    closestFigures: row.closest_figures || [],
    methodologyVersion: row.methodology_version,
    quizVersion: row.quiz_version,
    timestamp: row.occurred_at || row.created_at,
  };
}

function buildSession(user, profile, results) {
  const latest = results[results.length - 1] || null;
  return {
    id: user.id,
    email: user.email,
    createdAt: user.created_at,
    profile: {
      displayName: profile?.display_name || null,
      country: profile?.country || null,
      ageBand: profile?.age_band || null,
      latestCluster: latest?.cluster || null,
      latestEconomic: latest?.economic ?? null,
      latestSocial: latest?.social ?? null,
      closestFigures: latest?.closestFigures || [],
      topIssues: latest?.topIssues || [],
    },
    results,
  };
}

export function getSession() {
  return getCachedSession();
}

export async function hydrateSession() {
  if (!hasSupabaseConfig) return null;
  const accessToken = getAccessToken();
  if (!accessToken) return null;

  const user = await supabaseGetUser(accessToken);
  if (!user) {
    setAccessToken(null);
    cacheSession(null);
    return null;
  }

  try {
    const [profileRes, resultsRes] = await Promise.all([
      apiRequest('/api/me/profile'),
      apiRequest('/api/me/results'),
    ]);

    const results = (resultsRes.results || []).map(mapResultRow);
    const session = buildSession(user, profileRes.profile, results);
    cacheSession(session);
    return session;
  } catch {
    const fallbackSession = buildSession(user, null, getCachedSession()?.results || []);
    cacheSession(fallbackSession);
    return fallbackSession;
  }
}

export async function createAccount(email, password) {
  if (!hasSupabaseConfig) {
    return { error: 'Authentication is not configured. Set Supabase environment variables.' };
  }

  const data = await supabaseSignUp(email, password);
  if (data.error) return { error: data.error };

  if (data.access_token) {
    setAccessToken(data.access_token);
    const hydrated = await hydrateSession();
    return { user: hydrated, needsEmailVerification: false };
  }

  return { user: null, needsEmailVerification: true };
}

export async function login(email, password) {
  if (!hasSupabaseConfig) {
    return { error: 'Authentication is not configured. Set Supabase environment variables.' };
  }

  const data = await supabaseSignIn(email, password);
  if (data.error) return { error: data.error };

  setAccessToken(data.access_token);
  const hydrated = await hydrateSession();
  return { user: hydrated };
}

export async function logout() {
  setAccessToken(null);
  cacheSession(null);
}

export function getAccessTokenForApi() {
  return getAccessToken();
}

export async function saveUserResult(result) {
  const session = getCachedSession();
  if (!session?.id) return null;

  try {
    const response = await apiRequest('/api/me/results', {
      method: 'POST',
      body: result,
    });
    const mapped = mapResultRow(response.result);
    const updated = {
      ...session,
      results: [...(session.results || []), mapped],
    };
    cacheSession(updated);
    return mapped;
  } catch {
    return null;
  }
}

export function getUserResults() {
  return getCachedSession()?.results || [];
}

export async function deleteUserData() {
  const session = getCachedSession();
  if (!session?.id) return;
  try {
    await apiRequest('/api/me/results', { method: 'DELETE' });
  } catch {
    // no-op
  }
  cacheSession({ ...session, results: [] });
}

export async function deleteAccount() {
  try {
    await apiRequest('/api/me/account', { method: 'DELETE' });
  } catch {
    // no-op
  }
  await logout();
}
