/**
 * Sentry integration — optional error tracking behind a feature flag.
 *
 * When NEXT_PUBLIC_FF_SENTRY=true and NEXT_PUBLIC_SENTRY_DSN is set,
 * this module initialises Sentry. Otherwise it exports safe no-ops.
 *
 * To fully enable:
 * 1. pnpm add @sentry/nextjs
 * 2. Set NEXT_PUBLIC_FF_SENTRY=true
 * 3. Set NEXT_PUBLIC_SENTRY_DSN=https://…@sentry.io/…
 * 4. Optionally wrap next.config.mjs with withSentryConfig
 */

import { isFeatureEnabled } from '@/lib/featureFlags';

let isInitialised = false;

/**
 * Initialise Sentry if the feature flag and DSN are present.
 * Safe to call multiple times — subsequent calls are no-ops.
 */
export async function initSentry(): Promise<void> {
  if (isInitialised) return;
  if (!isFeatureEnabled('SENTRY')) return;

  const dsn = process.env['NEXT_PUBLIC_SENTRY_DSN'];
  if (!dsn) return;

  try {
    // Dynamic import so @sentry/nextjs is tree-shaken when the flag is off.
    const Sentry = await import('@sentry/nextjs');
    Sentry.init({
      dsn,
      environment: process.env['NODE_ENV'],
      tracesSampleRate: process.env['NODE_ENV'] === 'production' ? 0.1 : 1.0,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 1.0,
    });
    isInitialised = true;
  } catch {
    // @sentry/nextjs not installed — silently skip
  }
}

/**
 * Capture an exception to Sentry (no-op when disabled).
 */
export async function captureException(
  error: Error,
  context?: Record<string, unknown>
): Promise<void> {
  if (!isInitialised) return;
  try {
    const Sentry = await import('@sentry/nextjs');
    Sentry.captureException(error, context ? { extra: context } : {});
  } catch {
    // silent
  }
}

/**
 * Set the current user context in Sentry.
 */
export async function setUser(
  user: { id: string; email?: string } | null
): Promise<void> {
  if (!isInitialised) return;
  try {
    const Sentry = await import('@sentry/nextjs');
    Sentry.setUser(user);
  } catch {
    // silent
  }
}
