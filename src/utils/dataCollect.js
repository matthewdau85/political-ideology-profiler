// Sends anonymized quiz results to the server for aggregate statistics.
// Only sends: economic score, social score, cluster name, country.
// No personal data, no individual answers, no IP logging.
// Only runs if the user has accepted cookies/data collection.

const CONSENT_KEY = 'cookie_consent';

export async function submitAnonymousResult({ economic, social, cluster, country }) {
  // Only submit if user has given consent
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
  };

  try {
    await fetch('/api/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silently fail — data collection is non-critical
  }
}
