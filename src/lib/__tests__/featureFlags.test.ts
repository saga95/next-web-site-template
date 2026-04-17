import {
  FEATURE_FLAGS,
  getAllFeatureFlags,
  isFeatureEnabled,
} from '../featureFlags';

describe('featureFlags', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('isFeatureEnabled', () => {
    it('should return false when env var is not set', () => {
      delete process.env[FEATURE_FLAGS.NEW_CHECKOUT];
      expect(isFeatureEnabled('NEW_CHECKOUT')).toBe(false);
    });

    it('should return true when env var is "true"', () => {
      process.env[FEATURE_FLAGS.NEW_CHECKOUT] = 'true';
      expect(isFeatureEnabled('NEW_CHECKOUT')).toBe(true);
    });

    it('should return true when env var is "1"', () => {
      process.env[FEATURE_FLAGS.NEW_CHECKOUT] = '1';
      expect(isFeatureEnabled('NEW_CHECKOUT')).toBe(true);
    });

    it('should return false for other values', () => {
      process.env[FEATURE_FLAGS.NEW_CHECKOUT] = 'false';
      expect(isFeatureEnabled('NEW_CHECKOUT')).toBe(false);
    });

    it('should check SENTRY flag', () => {
      process.env[FEATURE_FLAGS.SENTRY] = 'true';
      expect(isFeatureEnabled('SENTRY')).toBe(true);
    });

    it('should check STRIPE flag', () => {
      process.env[FEATURE_FLAGS.STRIPE] = 'true';
      expect(isFeatureEnabled('STRIPE')).toBe(true);
    });
  });

  describe('getAllFeatureFlags', () => {
    it('should return all flags with their states', () => {
      process.env[FEATURE_FLAGS.NEW_CHECKOUT] = 'true';
      process.env[FEATURE_FLAGS.AI_SEARCH] = 'false';
      delete process.env[FEATURE_FLAGS.DARK_MODE];

      const flags = getAllFeatureFlags();
      expect(flags.NEW_CHECKOUT).toBe(true);
      expect(flags.AI_SEARCH).toBe(false);
      expect(flags.DARK_MODE).toBe(false);
    });
  });

  describe('FEATURE_FLAGS', () => {
    it('should have expected flags', () => {
      expect(FEATURE_FLAGS).toHaveProperty('SENTRY');
      expect(FEATURE_FLAGS).toHaveProperty('STRIPE');
      expect(FEATURE_FLAGS.SENTRY).toBe('NEXT_PUBLIC_FF_SENTRY');
      expect(FEATURE_FLAGS.STRIPE).toBe('NEXT_PUBLIC_FF_STRIPE');
    });
  });
});
