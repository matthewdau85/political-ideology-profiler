import { beforeEach, describe, expect, it } from 'vitest';
import { getPriceForProduct, validFeatures } from './entitlements';
import { normalizeProductKey, getProductFromPriceId } from './billingConfig';

describe('billingConfig mapping', () => {
  beforeEach(() => {
    process.env.STRIPE_PRICE_DEEP_ANALYSIS = 'price_deep';
    process.env.STRIPE_PRICE_REPORT = 'price_report';
    process.env.STRIPE_PRICE_COUNTRY_COMPARE = 'price_country';
    process.env.STRIPE_PRICE_FRIEND_COMPARE = 'price_friend';
    process.env.STRIPE_PRICE_PREMIUM_MEMBERSHIP = 'price_membership';
  });

  it('normalizes legacy product aliases', () => {
    expect(normalizeProductKey('country_comparison')).toBe('country_compare');
    expect(normalizeProductKey('friend_comparison')).toBe('friend_compare');
  });

  it('maps product key to configured price id', () => {
    expect(getPriceForProduct('deep_analysis')).toBe('price_deep');
    expect(getPriceForProduct('country_compare')).toBe('price_country');
  });

  it('can reverse-map price id to product', () => {
    expect(getProductFromPriceId('price_membership')?.normalizedKey).toBe('premium_membership');
  });

  it('exposes allowed product keys', () => {
    expect(validFeatures()).toEqual(
      expect.arrayContaining(['deep_analysis', 'report', 'country_compare', 'friend_compare', 'premium_membership']),
    );
  });
});
