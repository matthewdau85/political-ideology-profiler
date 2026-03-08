import { restRequest } from './supabaseRest';

export async function fetchProfile(userId) {
  const rows = await restRequest(`profiles?id=eq.${userId}&select=*`);
  return rows?.[0] || null;
}

export async function upsertProfile(userId, profilePatch = {}) {
  const payload = {
    id: userId,
    display_name: profilePatch.display_name ?? null,
    country: profilePatch.country ?? null,
    age_band: profilePatch.age_band ?? null,
    methodology_version: profilePatch.methodology_version ?? null,
    quiz_version: profilePatch.quiz_version ?? null,
  };

  const rows = await restRequest('profiles?on_conflict=id&select=*', {
    method: 'POST',
    body: payload,
    prefer: 'resolution=merge-duplicates,return=representation',
  });

  return rows?.[0] || null;
}
