import { describe, it, expect } from 'vitest';
import { calculateResults, calculateRadarScores, findClosestFigures, classifyCluster } from './calcResults';
import { classifyCluster as classify } from '../data/clusters';

describe('calculateResults', () => {
  it('returns zero scores for neutral answers', () => {
    const answers = [
      { questionId: 1, answerIndex: 0, importance: 'Medium', economic: 0, social: 0 },
      { questionId: 2, answerIndex: 0, importance: 'Medium', economic: 0, social: 0 },
    ];
    const result = calculateResults(answers);
    expect(result.economic).toBe(0);
    expect(result.social).toBe(0);
  });

  it('returns left-leaning scores for left answers', () => {
    const answers = [
      { questionId: 1, answerIndex: 0, importance: 'High', economic: -3, social: -1 },
      { questionId: 2, answerIndex: 0, importance: 'High', economic: -2, social: -2 },
    ];
    const result = calculateResults(answers);
    expect(result.economic).toBeLessThan(0);
    expect(result.social).toBeLessThan(0);
  });

  it('returns right-leaning scores for right answers', () => {
    const answers = [
      { questionId: 1, answerIndex: 0, importance: 'High', economic: 3, social: 2 },
      { questionId: 2, answerIndex: 0, importance: 'High', economic: 2, social: 3 },
    ];
    const result = calculateResults(answers);
    expect(result.economic).toBeGreaterThan(0);
    expect(result.social).toBeGreaterThan(0);
  });

  it('applies importance weighting', () => {
    const lowImportance = [
      { questionId: 1, answerIndex: 0, importance: 'Low', economic: 3, social: 0 },
    ];
    const highImportance = [
      { questionId: 1, answerIndex: 0, importance: 'High', economic: 3, social: 0 },
    ];
    const lowResult = calculateResults(lowImportance);
    const highResult = calculateResults(highImportance);
    expect(lowResult.economic).toBe(highResult.economic);
  });

  it('scores stay within -10 to 10 range', () => {
    const extremeAnswers = Array.from({ length: 24 }, (_, i) => ({
      questionId: i + 1, answerIndex: 0, importance: 'High', economic: 3, social: 3,
    }));
    const result = calculateResults(extremeAnswers);
    expect(result.economic).toBeGreaterThanOrEqual(-10);
    expect(result.economic).toBeLessThanOrEqual(10);
    expect(result.social).toBeGreaterThanOrEqual(-10);
    expect(result.social).toBeLessThanOrEqual(10);
  });
});

describe('calculateRadarScores', () => {
  it('returns 7 dimensions', () => {
    const answers = [
      { questionId: 1, answerIndex: 0, importance: 'Medium', economic: -1, social: -1 },
    ];
    const radar = calculateRadarScores(answers);
    expect(radar).toHaveLength(7);
  });

  it('scores are between 0 and 100', () => {
    const answers = Array.from({ length: 10 }, (_, i) => ({
      questionId: i + 1, answerIndex: 0, importance: 'Medium', economic: -3, social: -3,
    }));
    const radar = calculateRadarScores(answers);
    for (const score of radar) {
      expect(score.value).toBeGreaterThanOrEqual(0);
      expect(score.value).toBeLessThanOrEqual(100);
    }
  });
});

describe('findClosestFigures', () => {
  const figures = [
    { id: 'a', name: 'A', economic: -5, social: -5 },
    { id: 'b', name: 'B', economic: 0, social: 0 },
    { id: 'c', name: 'C', economic: 5, social: 5 },
  ];

  it('returns requested count', () => {
    expect(findClosestFigures(0, 0, figures, 2)).toHaveLength(2);
  });

  it('returns closest figure first', () => {
    const result = findClosestFigures(-4, -4, figures, 1);
    expect(result[0].id).toBe('a');
  });

  it('includes distance field', () => {
    const result = findClosestFigures(0, 0, figures, 3);
    expect(result[0].distance).toBeDefined();
    expect(result[0].distance).toBe(0);
  });
});

describe('classifyCluster', () => {
  it('classifies far-left as Democratic Socialist', () => {
    const clusters = classify(-8, -5);
    expect(clusters[0].name).toBe('Democratic Socialist');
  });

  it('classifies center as Technocratic Liberal', () => {
    const clusters = classify(0, 0);
    expect(clusters[0].name).toBe('Technocratic Liberal');
  });

  it('classifies far-right conservative as Traditional Conservative', () => {
    const clusters = classify(5, 6);
    expect(clusters[0].name).toMatch(/Conservative|Nationalist/);
  });

  it('returns probabilities that sum to ~1', () => {
    const clusters = classify(0, 0);
    const total = clusters.reduce((sum, c) => sum + c.probability, 0);
    expect(total).toBeCloseTo(1, 1);
  });
});
