import type { ReactNode } from 'react';
import { useEntitlement } from '@/hooks/useEntitlement';
import type { Entitlement } from '@/rbac/types';

interface EntitlementGuardProps {
  /** One or more entitlements to check. */
  entitlement: (Entitlement | string) | ReadonlyArray<Entitlement | string>;
  /** `'every'` (default) — all required. `'some'` — at least one. */
  mode?: 'every' | 'some';
  /** Rendered when the user lacks the required entitlement(s). Defaults to `null`. */
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Declarative entitlement guard.
 *
 * @example
 * ```tsx
 * <EntitlementGuard entitlement={ENTITLEMENTS.VIEW_ANALYTICS_DASHBOARD}>
 *   <AnalyticsDashboard />
 * </EntitlementGuard>
 * ```
 *
 * @example With fallback
 * ```tsx
 * <EntitlementGuard
 *   entitlement={[ENTITLEMENTS.EDIT_USER, ENTITLEMENTS.DELETE_USER]}
 *   mode="some"
 *   fallback={<p>You lack permissions.</p>}
 * >
 *   <UserManagementPanel />
 * </EntitlementGuard>
 * ```
 */
export function EntitlementGuard({
  entitlement,
  mode = 'every',
  fallback = null,
  children,
}: EntitlementGuardProps) {
  const allowed = useEntitlement(entitlement, mode);
  return allowed ? <>{children}</> : <>{fallback}</>;
}
