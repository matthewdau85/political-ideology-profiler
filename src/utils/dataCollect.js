// Sends anonymized quiz results to the server for aggregate statistics.
// Only runs if the user has accepted cookies/data collection.

const CONSENT_KEY = 'cookie_consent';

export async function submitAnonymousResult({ economic, social, cluster, country, typology, topIssues = [], ageBand = 'Unknown', methodologyVersion = '2026.1', quizVersion = '2.1' }) {
  try {
    if (localStorage.getItem(CONSENT_KEY) !== 'accepted') {
      return;
    }
  } catch {
    return;
  }

  const payload = {
    economic: Math.round(economic * 10) / 10,
    social: Math.round(social * 10) / 10,
    cluster: String(cluster).slice(0, 100),
    country: String(country || 'Unknown').slice(0, 60),
    typology: String(typology || 'Unknown').slice(0, 80),
    topIssues: Array.isArray(topIssues) ? topIssues.slice(0, 5).map((v) => String(v).slice(0, 160)) : [],
    ageBand: String(ageBand || 'Unknown').slice(0, 20),
    methodologyVersion: String(methodologyVersion || '2026.1').slice(0, 20),
    quizVersion: String(quizVersion || '2.1').slice(0, 20),
  };

  try {
    await fetch('/api/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Non-critical telemetry path
  }
}
