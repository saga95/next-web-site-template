/**
 * Type stubs for optional dependencies.
 *
 * These modules are dynamically imported behind feature flags
 * and may not be installed. These declarations prevent tsc errors.
 */

declare module '@sentry/nextjs' {
  interface SentryInitOptions {
    dsn: string;
    environment?: string;
    tracesSampleRate?: number;
    replaysSessionSampleRate?: number;
    replaysOnErrorSampleRate?: number;
  }
  export function init(options: SentryInitOptions): void;
  export function captureException(
    error: unknown,
    context?: { extra?: Record<string, unknown> }
  ): void;
  export function setUser(user: { id: string; email?: string } | null): void;
}

declare module '@stripe/stripe-js' {
  interface Stripe {
    // Minimal type — consumers should install @stripe/stripe-js for full types
    [key: string]: unknown;
  }
  export function loadStripe(
    publishableKey: string,
    options?: Record<string, unknown>
  ): Promise<Stripe | null>;
}
