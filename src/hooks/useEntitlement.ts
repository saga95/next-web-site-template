import { useMemo } from 'react';
import { useRBAC } from '@/contexts/RBACContext';
import type { Entitlement } from '@/rbac/types';

/**
 * Check whether the current user has a specific entitlement (or set of
 * entitlements).
 *
 * @param entitlement  A single entitlement or an array of entitlements.
 * @param mode         `'every'` (default) — user must have **all** listed
 *                     entitlements.  `'some'` — user needs **at least one**.
 * @returns `true` if the check passes.
 *
 * @example
 * ```tsx
 * import { ENTITLEMENTS } from '@/rbac';
 * import { useEntitlement } from '@/hooks/useEntitlement';
 *
 * function AnalyticsDashboard() {
 *   const canView = useEntitlement(ENTITLEMENTS.VIEW_ANALYTICS_DASHBOARD);
 *   if (!canView) return null;
 *   return <Dashboard />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Check multiple entitlements — user needs at least one
 * const canManage = useEntitlement(
 *   [ENTITLEMENTS.EDIT_USER, ENTITLEMENTS.DELETE_USER],
 *   'some',
 * );
 * ```
 */
export function useEntitlement(
  entitlement: (Entitlement | string) | ReadonlyArray<Entitlement | string>,
  mode: 'every' | 'some' = 'every'
): boolean {
  const { entitlements } = useRBAC();

  return useMemo(() => {
    const list = Array.isArray(entitlement) ? entitlement : [entitlement];
    if (list.length === 0) return true;
    return mode === 'every'
      ? list.every(e => entitlements.has(e))
      : list.some(e => entitlements.has(e));
  }, [entitlement, entitlements, mode]);
}
