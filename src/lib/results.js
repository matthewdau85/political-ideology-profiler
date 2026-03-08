import { restRequest } from './supabaseRest';

export function mapResultRow(row) {
  return {
    id: row.id,
    economic: Number(row.economic_score),
    social: Number(row.social_score),
    cluster: row.ideological_cluster,
    typology: row.typology,
    secondaryTypology: row.secondary_typology,
    typologyConfidence: row.typology_fit_score,
    radarScores: row.radar_scores || [],
    topIssues: row.top_issues || [],
    closestFigures: row.closest_figures || [],
    country: row.country || 'Unknown',
    ageBand: row.age_band || 'Unknown',
    methodologyVersion: row.methodology_version,
    quizVersion: row.quiz_version,
    timestamp: row.occurred_at || row.created_at,
  };
}

export async function fetchQuizResults(userId) {
  const rows = await restRequest(
    `quiz_results?user_id=eq.${userId}&select=*&order=created_at.desc`,
  );
  return (rows || []).map(mapResultRow);
}

export async function saveQuizResult(userId, result) {
  const payload = {
    user_id: userId,
    economic_score: result.economic,
    social_score: result.social,
    ideological_cluster: result.cluster,
    typology: result.typology || null,
    secondary_typology: result.secondaryTypology || null,
    typology_fit_score: result.typologyConfidence || null,
    top_issues: result.topIssues || [],
    radar_scores: result.radarScores || [],
    closest_figures: result.closestFigures || [],
    country: result.country || null,
    age_band: result.ageBand || null,
    methodology_version: result.methodologyVersion || null,
    quiz_version: result.quizVersion || null,
    occurred_at: result.timestamp || new Date().toISOString(),
    source: 'web',
  };

  const rows = await restRequest('quiz_results?select=*', {
    method: 'POST',
    body: payload,
    prefer: 'return=representation',
  });

  return mapResultRow(rows?.[0]);
}

export async function deleteQuizResults(userId) {
  await restRequest(`quiz_results?user_id=eq.${userId}`, {
    method: 'DELETE',
  });
}
