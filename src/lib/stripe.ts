/**
 * Stripe integration — optional payment processing behind a feature flag.
 *
 * When NEXT_PUBLIC_FF_STRIPE=true and the required env vars are set,
 * this module exposes a lazy-loaded Stripe client. Otherwise everything
 * is a safe no-op.
 *
 * To fully enable:
 * 1. pnpm add @stripe/stripe-js @stripe/react-stripe-js
 * 2. Set NEXT_PUBLIC_FF_STRIPE=true
 * 3. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_…
 * 4. Set STRIPE_SECRET_KEY=sk_… (server-side only)
 */

import { isFeatureEnabled } from '@/lib/featureFlags';

/**
 * Check if Stripe is available (feature flag ON + publishable key present).
 */
export function isStripeEnabled(): boolean {
  return (
    isFeatureEnabled('STRIPE') &&
    !!process.env['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY']
  );
}

/**
 * Lazily load the Stripe.js client.
 *
 * Returns `null` when Stripe is disabled, allowing UI to gracefully degrade.
 *
 * @example
 * ```tsx
 * const stripePromise = getStripePromise();
 * // In JSX:
 * {stripePromise && <Elements stripe={stripePromise}>…</Elements>}
 * ```
 */
export async function getStripePromise() {
  if (!isStripeEnabled()) return null;

  try {
    const { loadStripe } = await import('@stripe/stripe-js');
    const key = process.env['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'];
    if (!key) return null;
    return loadStripe(key);
  } catch {
    // @stripe/stripe-js not installed — return null
    return null;
  }
}

/**
 * Format an amount in cents to a display string.
 */
export function formatPrice(
  amountCents: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amountCents / 100);
}
