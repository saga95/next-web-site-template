import { ComponentType, lazy, LazyExoticComponent } from 'react';

/**
 * `React.lazy` wrapper that retries on chunk load failure.
 *
 * In production, code-split chunks may fail to load when a new deployment
 * invalidates old chunk hashes. This utility retries the dynamic import
 * before giving up, preventing blank screens for users on stale tabs.
 *
 * @example
 * ```tsx
 * const Dashboard = lazyWithRetry(() => import('@/components/Dashboard'));
 * ```
 */
export function lazyWithRetry<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
  maxRetries = 3,
): LazyExoticComponent<T> {
  return lazy(() => retryImport(factory, maxRetries));
}

async function retryImport<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
  maxRetries: number,
): Promise<{ default: T }> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await factory();
    } catch (error) {
      lastError = error;

      // Only retry on chunk load errors, not syntax errors
      if (!isChunkLoadError(error)) {
        throw error;
      }

      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        await new Promise(resolve =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  // All retries exhausted — reload the page as a last resort
  // (new deployment likely invalidated chunk hashes)
  if (typeof window !== 'undefined') {
    window.location.reload();
  }

  throw lastError;
}

function isChunkLoadError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.name === 'ChunkLoadError' ||
      error.message.includes('Loading chunk') ||
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Importing a module script failed')
    );
  }
  return false;
}
