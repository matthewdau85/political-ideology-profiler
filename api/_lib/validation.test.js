import { describe, expect, it } from 'vitest';
import { hasUnexpectedKeys, inRangeNumber, isValidEmail, parseIsoDate } from './validation';

describe('validation helpers', () => {
  it('detects unexpected keys', () => {
    expect(hasUnexpectedKeys({ a: 1, b: 2 }, ['a'])).toEqual(['b']);
  });

  it('validates numeric range', () => {
    expect(inRangeNumber(0.5, 0, 1)).toBe(true);
    expect(inRangeNumber(2, 0, 1)).toBe(false);
  });

  it('validates email shape', () => {
    expect(isValidEmail('valid@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
  });

  it('parses ISO dates safely', () => {
    expect(parseIsoDate('2026-03-08T00:00:00.000Z')).toBeInstanceOf(Date);
    expect(parseIsoDate('not-a-date')).toBeNull();
  });
});
