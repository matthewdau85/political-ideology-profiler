const TYPOLOGIES = [
  { id: 'structural_social_democrats', name: 'Structural Social Democrats', economic: -7, social: -2 },
  { id: 'progressive_globalists', name: 'Progressive Globalists', economic: -2, social: -7 },
  { id: 'technocratic_liberals', name: 'Technocratic Liberals', economic: 0, social: -1 },
  { id: 'market_liberals', name: 'Market Liberals', economic: 6, social: -1 },
  { id: 'economic_populists', name: 'Economic Populists', economic: -4, social: 4 },
  { id: 'traditional_conservatives', name: 'Traditional Conservatives', economic: 4, social: 7 },
  { id: 'national_conservatives', name: 'National Conservatives', economic: 2, social: 8 },
  { id: 'libertarian_individualists', name: 'Libertarian Individualists', economic: 8, social: -5 },
];

function distance(a, b) {
  return Math.sqrt((a.economic - b.economic) ** 2 + (a.social - b.social) ** 2);
}

function normalizeConfidence(d) {
  return Math.max(0, Math.min(1, 1 - d / 20));
}

function getTopIssueSignal(topIssues = []) {
  const joined = topIssues.join(' ').toLowerCase();
  if (/union|wage|worker|inequality|tax/.test(joined)) return 'economic-left';
  if (/immigration|rights|climate|inclusion/.test(joined)) return 'progressive';
  if (/tradition|border|law|order|national/.test(joined)) return 'conservative';
  return 'neutral';
}

export function classifyTypology({ economic, social, radarScores = [], topIssues = [] }) {
  const ranked = TYPOLOGIES
    .map((t) => ({ ...t, distance: distance({ economic, social }, t) }))
    .sort((a, b) => a.distance - b.distance);

  let primary = ranked[0];
  let secondary = ranked[1];

  const issueSignal = getTopIssueSignal(topIssues);
  const prog = radarScores.find((r) => r.dimension === 'Progressivism')?.value ?? 50;
  const econLeft = radarScores.find((r) => r.dimension === 'Economic Left')?.value ?? 50;

  if (issueSignal === 'economic-left' && econLeft > 65) {
    const forced = ranked.find((r) => r.id === 'structural_social_democrats' || r.id === 'economic_populists');
    if (forced) primary = forced;
  }
  if (issueSignal === 'progressive' && prog > 65) {
    const forced = ranked.find((r) => r.id === 'progressive_globalists');
    if (forced) primary = forced;
  }
  if (issueSignal === 'conservative' && prog < 40) {
    const forced = ranked.find((r) => r.id === 'traditional_conservatives' || r.id === 'national_conservatives');
    if (forced) primary = forced;
  }

  if (secondary.id === primary.id) {
    secondary = ranked.find((r) => r.id !== primary.id) || secondary;
  }

  return {
    primary: primary.name,
    secondary: secondary.name,
    confidence: Math.round(normalizeConfidence(primary.distance) * 100),
    ranked: ranked.map((r) => ({ name: r.name, distance: Math.round(r.distance * 100) / 100 })),
  };
}

export const allTypologies = TYPOLOGIES.map((t) => t.name);
