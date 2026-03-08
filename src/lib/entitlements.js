import { restRequest } from './supabaseRest';

export async function fetchEntitlements(userId) {
  const rows = await restRequest(
    `entitlements?user_id=eq.${userId}&active=is.true&select=feature,active,expires_at,updated_at`,
  );

  return rows || [];
}

export function hasFeature(entitlements, feature) {
  return (entitlements || []).some((entry) => entry.feature === feature && entry.active);
}
