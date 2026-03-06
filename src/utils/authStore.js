// Auth system — localStorage mock compatible with Supabase migration
// Stores user accounts and profiles for ideology tracking

const USERS_KEY = 'ideology_users';
const SESSION_KEY = 'ideology_session';

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

function setUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function createAccount(email, password) {
  const users = getUsers();
  if (users[email]) {
    return { error: 'Account already exists' };
  }
  users[email] = {
    id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
    email,
    passwordHash: btoa(password), // mock hash — use bcrypt/Supabase in production
    createdAt: new Date().toISOString(),
    results: [],
    profile: null,
  };
  setUsers(users);
  setSession(users[email]);
  return { user: sanitizeUser(users[email]) };
}

export function login(email, password) {
  const users = getUsers();
  const user = users[email];
  if (!user || btoa(password) !== user.passwordHash) {
    return { error: 'Invalid email or password' };
  }
  setSession(user);
  return { user: sanitizeUser(user) };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    return session ? sanitizeUser(session) : null;
  } catch {
    return null;
  }
}

function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(sanitizeUser(user)));
}

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    results: user.results || [],
    profile: user.profile,
  };
}

export function saveUserResult(result) {
  const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if (!session) return null;

  const users = getUsers();
  const user = users[session.email];
  if (!user) return null;

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

  user.results = user.results || [];
  user.results.push(entry);
  user.profile = {
    latestCluster: result.cluster,
    latestEconomic: result.economic,
    latestSocial: result.social,
    closestFigures: result.closestFigures || [],
    topIssues: result.topIssues || [],
  };

  users[session.email] = user;
  setUsers(users);
  setSession(user);
  return entry;
}

export function getUserResults() {
  const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if (!session) return [];
  return session.results || [];
}

export function deleteUserData() {
  const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if (!session) return;

  const users = getUsers();
  if (users[session.email]) {
    users[session.email].results = [];
    users[session.email].profile = null;
    setUsers(users);
    setSession(users[session.email]);
  }
}

export function deleteAccount() {
  const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if (!session) return;

  const users = getUsers();
  delete users[session.email];
  setUsers(users);
  logout();
}
