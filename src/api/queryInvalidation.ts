/**
 * Query invalidation helpers.
 *
 * Convenience wrappers around QueryClient.invalidateQueries that use
 * the central queryKeys factory, preventing typo-based cache bugs.
 *
 * @example
 * ```ts
 * import { invalidateScope, invalidateList, invalidateDetail } from '@/api/queryInvalidation';
 *
 * // After creating a todo → invalidate all todo lists
 * invalidateList(queryClient, 'todos');
 *
 * // After updating a specific todo
 * invalidateDetail(queryClient, 'todos', todoId);
 *
 * // Nuclear option — invalidate everything for a scope
 * invalidateScope(queryClient, 'todos');
 * ```
 */

import type { QueryClient } from '@tanstack/react-query';
import { type QueryScope, queryKeys } from './queryKeys';

/**
 * Invalidate all queries for a given scope.
 */
export function invalidateScope(
  client: QueryClient,
  scope: QueryScope
): Promise<void> {
  return client.invalidateQueries({ queryKey: queryKeys[scope].all });
}

/**
 * Invalidate all list queries for a given scope.
 */
export function invalidateList(
  client: QueryClient,
  scope: QueryScope
): Promise<void> {
  return client.invalidateQueries({ queryKey: queryKeys[scope].lists() });
}

/**
 * Invalidate a specific detail query.
 */
export function invalidateDetail(
  client: QueryClient,
  scope: QueryScope,
  id: string
): Promise<void> {
  return client.invalidateQueries({ queryKey: queryKeys[scope].detail(id) });
}
