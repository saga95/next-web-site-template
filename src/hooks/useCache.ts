/**
 * useCache — lightweight in-memory cache with TTL.
 *
 * Useful for caching computed values, API-adjacent lookups, or any data
 * that is expensive to compute but doesn't need React Query's full power.
 *
 * @example
 * ```tsx
 * const cache = useCache<UserProfile>({ ttl: 60_000, maxSize: 100 });
 * cache.set('user-123', profile);
 * const cached = cache.get('user-123'); // UserProfile | undefined
 * ```
 */

import { useCallback, useRef } from 'react';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

interface UseCacheOptions {
  /** Time-to-live in milliseconds. Default: 5 minutes. */
  ttl?: number;
  /** Maximum entries. Oldest are evicted when exceeded (LRU). Default: 200. */
  maxSize?: number;
}

export function useCache<T>(options: UseCacheOptions = {}) {
  const { ttl = 5 * 60 * 1000, maxSize = 200 } = options;
  const cacheRef = useRef(new Map<string, CacheEntry<T>>());

  const evictExpired = useCallback(() => {
    const now = Date.now();
    for (const [key, entry] of cacheRef.current) {
      if (entry.expiresAt <= now) {
        cacheRef.current.delete(key);
      }
    }
  }, []);

  const get = useCallback((key: string): T | undefined => {
    const entry = cacheRef.current.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
      cacheRef.current.delete(key);
      return undefined;
    }
    // Move to end for LRU ordering
    cacheRef.current.delete(key);
    cacheRef.current.set(key, entry);
    return entry.value;
  }, []);

  const set = useCallback(
    (key: string, value: T, customTtl?: number) => {
      // Evict expired entries first
      evictExpired();

      // Evict oldest if at capacity
      if (cacheRef.current.size >= maxSize && !cacheRef.current.has(key)) {
        const oldest = cacheRef.current.keys().next().value;
        if (oldest !== undefined) {
          cacheRef.current.delete(oldest);
        }
      }

      cacheRef.current.set(key, {
        value,
        expiresAt: Date.now() + (customTtl ?? ttl),
      });
    },
    [ttl, maxSize, evictExpired]
  );

  const remove = useCallback((key: string) => {
    cacheRef.current.delete(key);
  }, []);

  const clear = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  const has = useCallback((key: string): boolean => {
    const entry = cacheRef.current.get(key);
    if (!entry) return false;
    if (entry.expiresAt <= Date.now()) {
      cacheRef.current.delete(key);
      return false;
    }
    return true;
  }, []);

  const size = useCallback(() => {
    evictExpired();
    return cacheRef.current.size;
  }, [evictExpired]);

  return { get, set, remove, clear, has, size };
}
