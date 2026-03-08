import { assertClientEnv } from '../utils/env';

const SESSION_KEY = 'ideology_supabase_session_v1';
const listeners = new Set();

const { supabaseUrl, supabaseAnonKey } = assertClientEnv();

function normalizeSession(raw) {
  if (!raw || !raw.access_token || !raw.user) return null;
  return {
    access_token: raw.access_token,
    refresh_token: raw.refresh_token || null,
    expires_in: raw.expires_in || null,
    token_type: raw.token_type || 'bearer',
    user: raw.user,
  };
}

function readStoredSession() {
  try {
    return normalizeSession(JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'));
  } catch {
    return null;
  }
}

function writeStoredSession(session) {
  if (!session) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function emitAuthChange(event, session) {
  listeners.forEach((cb) => {
    try {
      cb(event, session);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[supabaseClient] auth listener error', error);
      }
    }
  });
}

async function parseAuthResponse(res) {
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    return {
      data: { user: null, session: null },
      error: {
        message: body?.msg || body?.error_description || body?.error || 'Auth request failed',
        status: res.status,
      },
    };
  }

  const user = body?.user || body;
  const session = normalizeSession(body?.access_token ? body : body?.session || null);

  return {
    data: { user, session },
    error: null,
  };
}

async function authFetch(path, { method = 'GET', body, token } = {}) {
  const headers = {
    apikey: supabaseAnonKey,
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${supabaseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function getUserFromApi(accessToken) {
  if (!accessToken) {
    return { data: { user: null }, error: null };
  }

  const res = await authFetch('/auth/v1/user', { token: accessToken });
  const parsed = await parseAuthResponse(res);

  if (parsed.error) {
    return { data: { user: null }, error: parsed.error };
  }

  return { data: { user: parsed.data.user }, error: null };
}

export const supabase = {
  auth: {
    async signUp({ email, password }) {
      const res = await authFetch('/auth/v1/signup', {
        method: 'POST',
        body: { email, password },
      });
      const parsed = await parseAuthResponse(res);
      if (!parsed.error && parsed.data.session) {
        writeStoredSession(parsed.data.session);
        emitAuthChange('SIGNED_IN', parsed.data.session);
      }
      return parsed;
    },

    async signInWithPassword({ email, password }) {
      const res = await authFetch('/auth/v1/token?grant_type=password', {
        method: 'POST',
        body: { email, password },
      });
      const parsed = await parseAuthResponse(res);
      if (!parsed.error && parsed.data.session) {
        writeStoredSession(parsed.data.session);
        emitAuthChange('SIGNED_IN', parsed.data.session);
      }
      return parsed;
    },

    async signOut() {
      const current = readStoredSession();
      if (current?.access_token) {
        await authFetch('/auth/v1/logout', {
          method: 'POST',
          token: current.access_token,
        }).catch(() => null);
      }

      writeStoredSession(null);
      emitAuthChange('SIGNED_OUT', null);
      return { error: null };
    },

    async getSession() {
      return { data: { session: readStoredSession() }, error: null };
    },

    async getUser() {
      const { data } = await this.getSession();
      const token = data.session?.access_token;
      const userResult = await getUserFromApi(token);
      if (userResult.error) {
        writeStoredSession(null);
        emitAuthChange('SIGNED_OUT', null);
      }
      return userResult;
    },

    onAuthStateChange(callback) {
      listeners.add(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => listeners.delete(callback),
          },
        },
      };
    },
  },
};

export async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

export function hasSupabaseClientConfig() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function getSupabaseConfig() {
  return { supabaseUrl, supabaseAnonKey };
}
