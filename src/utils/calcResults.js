import { clamp } from './math.js';
import { importanceWeights, convictionMultipliers } from '../data/questions.js';

export function calculateResults(answers) {
  // answers: [{ questionId, answerIndex, importance, conviction }]
  let totalEconomic = 0;
  let totalSocial = 0;
  let totalWeight = 0;

  for (const ans of answers) {
    const weight = importanceWeights[ans.importance] || 1;
    const conviction = convictionMultipliers[ans.conviction] || 1;
    totalEconomic += ans.economic * weight * conviction;
    totalSocial += ans.social * weight * conviction;
    totalWeight += weight * conviction;
  }

  const maxPossible = 3 * totalWeight; // max score per axis
  const economic = totalWeight > 0
    ? clamp((totalEconomic / maxPossible) * 10, -10, 10)
    : 0;
  const social = totalWeight > 0
    ? clamp((totalSocial / maxPossible) * 10, -10, 10)
    : 0;

  return {
    economic: Math.round(economic * 10) / 10,
    social: Math.round(social * 10) / 10,
  };
}

export function calculateRadarScores(answers) {
  // Derive radar dimensions from answer patterns
  const dimensions = {
    'State Capacity': 0,
    'Labour Power': 0,
    'Anti-Monopoly': 0,
    'Globalism': 0,
    'Progressivism': 0,
    'Economic Left': 0,
    'Movement Orientation': 0,
  };

  let count = 0;
  for (const ans of answers) {
    const weight = importanceWeights[ans.importance] || 1;
    const conviction = convictionMultipliers[ans.conviction] || 1;
    const combined = weight * conviction;
    const e = ans.economic * combined;
    const s = ans.social * combined;

    dimensions['State Capacity'] += (-e + 3) * 0.5;
    dimensions['Labour Power'] += (-e - s * 0.3 + 3) * 0.5;
    dimensions['Anti-Monopoly'] += (-e + 3) * 0.4;
    dimensions['Globalism'] += (-s + 3) * 0.4;
    dimensions['Progressivism'] += (-s + 3) * 0.5;
    dimensions['Economic Left'] += (-e + 3) * 0.5;
    dimensions['Movement Orientation'] += (-e - s + 6) * 0.25;
    count += combined;
  }

  if (count === 0) return Object.keys(dimensions).map(k => ({ dimension: k, value: 50 }));

  return Object.entries(dimensions).map(([dimension, raw]) => ({
    dimension,
    value: Math.round(clamp((raw / count) * 16.67, 0, 100)),
  }));
}

export function findClosestFigures(economic, social, figures, count = 3) {
  return figures
    .map(fig => ({
      ...fig,
      distance: Math.sqrt((fig.economic - economic) ** 2 + (fig.social - social) ** 2),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count);
}

export function findClosestParties(economic, social, parties) {
  const results = {};
  for (const [country, partyList] of Object.entries(parties)) {
    results[country] = partyList
      .map(p => ({
        ...p,
        distance: Math.round(Math.sqrt((p.economic - economic) ** 2 + (p.social - social) ** 2) * 10) / 10,
      }))
      .sort((a, b) => a.distance - b.distance);
  }
  return results;
}

export function deriveTopIssues(answers, questions) {
  // Find issues the user feels strongest about based on extreme answers + high importance
  const issueScores = answers
    .map(ans => {
      const q = questions.find(q => q.id === ans.questionId);
      if (!q) return null;
      const intensity = Math.abs(ans.economic) + Math.abs(ans.social);
      const weight = importanceWeights[ans.importance] || 1;
      return { section: q.section, question: q.text, score: intensity * weight };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  return issueScores.slice(0, 5).map(i => i.question);
}
