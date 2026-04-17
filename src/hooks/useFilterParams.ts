/**
 * useFilterParams — keep filter/sort/pagination state in the URL query string.
 *
 * Syncs React state ↔ URL search params so filtered views are shareable,
 * bookmarkable, and survive page refreshes.
 *
 * @example
 * ```tsx
 * const { filters, setFilter, resetFilters } = useFilterParams({
 *   status: 'all',
 *   search: '',
 *   page: '1',
 * });
 * ```
 */

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

export function useFilterParams<T extends Record<string, string>>(
  defaults: T
): {
  filters: T;
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  setFilters: (updates: Partial<T>) => void;
  resetFilters: () => void;
} {
  const router = useRouter();

  const filters = useMemo(() => {
    const result = { ...defaults };
    for (const key of Object.keys(defaults) as Array<keyof T>) {
      const qVal = router.query[key as string];
      if (typeof qVal === 'string') {
        (result as Record<string, string>)[key as string] = qVal;
      }
    }
    return result;
  }, [defaults, router.query]);

  const setFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      const query = { ...router.query, [key]: value };
      // Remove default-valued params to keep URLs clean
      if (value === defaults[key]) {
        delete query[key as string];
      }
      void router.replace({ pathname: router.pathname, query }, undefined, {
        shallow: true,
      });
    },
    [router, defaults]
  );

  const setFilters = useCallback(
    (updates: Partial<T>) => {
      const query = { ...router.query, ...updates };
      for (const [key, value] of Object.entries(updates)) {
        if (value === defaults[key as keyof T]) {
          delete query[key];
        }
      }
      void router.replace({ pathname: router.pathname, query }, undefined, {
        shallow: true,
      });
    },
    [router, defaults]
  );

  const resetFilters = useCallback(() => {
    void router.replace({ pathname: router.pathname }, undefined, {
      shallow: true,
    });
  }, [router]);

  return { filters, setFilter, setFilters, resetFilters };
}
