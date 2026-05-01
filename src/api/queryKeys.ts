/**
 * React Query key factory.
 *
 * Centralises query keys so cache invalidation, optimistic updates, and
 * devtools filtering all use the same canonical keys.
 *
 * @example
 * ```ts
 * import { queryKeys } from '@/api/queryKeys';
 *
 * // List with filters
 * useQuery({ queryKey: queryKeys.todos.list({ status: 'active' }), queryFn: fetchTodos });
 *
 * // Detail
 * useQuery({ queryKey: queryKeys.todos.detail('abc-123'), queryFn: fetchTodo });
 *
 * // Invalidate all todos
 * queryClient.invalidateQueries({ queryKey: queryKeys.todos.all });
 * ```
 */

function createQueryKeys<T extends string>(scope: T) {
  return {
    /** Root key for the entire scope — invalidates everything. */
    all: [scope] as const,
    /** Lists with optional filters. */
    lists: () => [scope, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [scope, 'list', filters ?? {}] as const,
    /** Single entity by ID. */
    details: () => [scope, 'detail'] as const,
    detail: (id: string) => [scope, 'detail', id] as const,
  };
}

/**
 * Central query key registry.
 *
 * Add new resource scopes here as the app grows.
 */
export const queryKeys = {
  todos: createQueryKeys('todos'),
  users: createQueryKeys('users'),
  products: createQueryKeys('products'),
  orders: createQueryKeys('orders'),
} as const;

export type QueryScope = keyof typeof queryKeys;
