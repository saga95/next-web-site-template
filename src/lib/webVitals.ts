import type { NextWebVitalsMetric } from 'next/app';

/**
 * Report Web Vitals metrics.
 *
 * Next.js calls this function automatically for Core Web Vitals
 * (LCP, INP, CLS) and other page-load metrics (FCP, TTFB).
 *
 * Thresholds (from agent-skills performance checklist):
 *   LCP  ≤ 2.5s (good)  ≤ 4.0s (needs work)  > 4.0s (poor)
 *   INP  ≤ 200ms         ≤ 500ms               > 500ms
 *   CLS  ≤ 0.1           ≤ 0.25                > 0.25
 *
 * Integrate with your analytics provider by replacing the console call below.
 */
export function reportWebVitals(metric: NextWebVitalsMetric): void {
  const { id, name, value, label } = metric;

  // Send to your analytics endpoint
  // Example: Google Analytics
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const { gtag } = window as unknown as Record<
      string,
      ((...args: unknown[]) => void) | undefined
    >;
    if (gtag) {
      gtag('event', name, {
        event_category: label === 'web-vital' ? 'Web Vitals' : 'Next.js Metric',
        event_label: id,
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        non_interaction: true,
      });
      return;
    }
  }

  // Development: log to console for debugging
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(
      `[Web Vitals] ${name}: ${Math.round(value)}${name === 'CLS' ? '' : 'ms'} (${label})`
    );
  }
}
