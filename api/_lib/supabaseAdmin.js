const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function ensureAdminEnv() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase admin environment is not configured');
  }
}

function adminHeaders(extra = {}) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

async function parseJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function adminSelect(table, query = '', { single = false } = {}) {
  ensureAdminEnv();
  const url = `${supabaseUrl}/rest/v1/${table}${query ? `?${query}` : ''}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: adminHeaders(single ? { Accept: 'application/vnd.pgrst.object+json' } : {}),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.message || `Failed select on ${table}`);
  return data;
}

export async function adminInsert(table, payload, { upsert = false, onConflict = '' } = {}) {
  ensureAdminEnv();
  const query = onConflict ? `?on_conflict=${encodeURIComponent(onConflict)}` : '';
  const url = `${supabaseUrl}/rest/v1/${table}${query}`;
  const prefer = upsert ? 'resolution=merge-duplicates,return=representation' : 'return=representation';
  const res = await fetch(url, {
    method: 'POST',
    headers: adminHeaders({ Prefer: prefer }),
    body: JSON.stringify(Array.isArray(payload) ? payload : [payload]),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.message || `Failed insert on ${table}`);
  return Array.isArray(data) ? data : [data];
}

export async function adminPatch(table, query, payload) {
  ensureAdminEnv();
  const url = `${supabaseUrl}/rest/v1/${table}?${query}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: adminHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify(payload),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.message || `Failed update on ${table}`);
  return Array.isArray(data) ? data : [data];
}

export async function adminDelete(table, query) {
  ensureAdminEnv();
  const url = `${supabaseUrl}/rest/v1/${table}?${query}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: adminHeaders({ Prefer: 'return=representation' }),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.message || `Failed delete on ${table}`);
  return data;
}

export async function adminDeleteAuthUser(userId) {
  ensureAdminEnv();
  const url = `${supabaseUrl}/auth/v1/admin/users/${encodeURIComponent(userId)}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.msg || 'Failed to delete auth user');
  return data;
}
