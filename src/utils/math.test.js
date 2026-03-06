import { describe, it, expect } from 'vitest';
import { clamp, euclideanDistance, normalize, average, standardDeviation, generateId, percentOverlap } from './math';

describe('clamp', () => {
  it('returns value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps to min', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('clamps to max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('handles negative ranges', () => {
    expect(clamp(-5, -10, -1)).toBe(-5);
    expect(clamp(-15, -10, -1)).toBe(-10);
  });
});

describe('euclideanDistance', () => {
  it('calculates distance between two points', () => {
    expect(euclideanDistance(0, 0, 3, 4)).toBe(5);
  });

  it('returns 0 for same point', () => {
    expect(euclideanDistance(5, 5, 5, 5)).toBe(0);
  });
});

describe('normalize', () => {
  it('normalizes value to new range', () => {
    expect(normalize(5, 0, 10, -10, 10)).toBe(0);
    expect(normalize(0, 0, 10, -10, 10)).toBe(-10);
    expect(normalize(10, 0, 10, -10, 10)).toBe(10);
  });

  it('handles equal min/max', () => {
    expect(normalize(5, 5, 5)).toBe(0);
  });
});

describe('average', () => {
  it('calculates average', () => {
    expect(average([2, 4, 6])).toBe(4);
  });

  it('returns 0 for empty array', () => {
    expect(average([])).toBe(0);
  });
});

describe('standardDeviation', () => {
  it('calculates standard deviation', () => {
    const sd = standardDeviation([2, 4, 4, 4, 5, 5, 7, 9]);
    expect(sd).toBeCloseTo(2, 0);
  });

  it('returns 0 for single element', () => {
    expect(standardDeviation([5])).toBe(0);
  });
});

describe('generateId', () => {
  it('generates id of specified length', () => {
    expect(generateId(12)).toHaveLength(12);
    expect(generateId()).toHaveLength(8);
  });

  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe('percentOverlap', () => {
  it('returns 100 for identical positions', () => {
    expect(percentOverlap({ economic: 5, social: 5 }, { economic: 5, social: 5 }, ['economic', 'social'])).toBe(100);
  });

  it('returns 0 for maximally different positions', () => {
    expect(percentOverlap({ economic: -10, social: -10 }, { economic: 10, social: 10 }, ['economic', 'social'])).toBe(0);
  });
});
