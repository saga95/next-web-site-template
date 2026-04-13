/**
 * Feature flags — decouple deployment from release.
 *
 * Pattern from agent-skills/shipping-and-launch:
 *   1. DEPLOY with flag OFF     → Code in production but inactive
 *   2. ENABLE for team/beta     → Internal testing in production
 *   3. GRADUAL ROLLOUT          → 5% → 25% → 50% → 100%
 *   4. MONITOR at each stage    → Watch error rates, performance
 *   5. CLEAN UP                 → Remove flag and dead code path
 *
 * Usage:
 *   import { isFeatureEnabled, FeatureFlag } from '@/lib/featureFlags';
 *
 *   if (isFeatureEnabled('NEW_CHECKOUT')) {
 *     return <NewCheckout />;
 *   }
 *   return <LegacyCheckout />;
 */

/**
 * Register feature flags here.
 * Each flag maps to a NEXT_PUBLIC_FF_<name> environment variable.
 *
 * Lifecycle: add flag → ship behind it → roll out → remove flag + dead code.
 */
export const FEATURE_FLAGS = {
  /** Example: new checkout flow */
  NEW_CHECKOUT: 'NEXT_PUBLIC_FF_NEW_CHECKOUT',
  /** Example: AI-powered search */
  AI_SEARCH: 'NEXT_PUBLIC_FF_AI_SEARCH',
  /** Example: dark mode toggle */
  DARK_MODE: 'NEXT_PUBLIC_FF_DARK_MODE',
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

/**
 * Check if a feature flag is enabled.
 *
 * Reads from environment variables (NEXT_PUBLIC_FF_*).
 * In development, flags default to OFF unless explicitly set to 'true'.
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  const envKey = FEATURE_FLAGS[flag];
  const value = process.env[envKey];
  return value === 'true' || value === '1';
}

/**
 * Get all feature flag states (useful for debugging / admin dashboards).
 */
export function getAllFeatureFlags(): Record<FeatureFlag, boolean> {
  const entries = Object.keys(FEATURE_FLAGS) as FeatureFlag[];
  return Object.fromEntries(
    entries.map(flag => [flag, isFeatureEnabled(flag)])
  ) as Record<FeatureFlag, boolean>;
}
