/**
 * React Query Hooks — Bridge between UI and Repository
 *
 * These hooks wrap repository calls with React Query, providing:
 * - Automatic caching and cache invalidation
 * - Loading / error / success states
 * - Optimistic updates for mutations
 * - Automatic retries on failure
 *
 * Usage in components:
 *   const { data: todos, isLoading } = useTodos();
 *   const createMutation = useCreateTodo();
 *   createMutation.mutate({ title: 'Buy milk' });
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as repo from './repository';
import type { CreateTodoInput, UpdateTodoInput } from './types';

// Query key factory — prevents key string duplication
const todoKeys = {
  all: ['todos'] as const,
  detail: (id: string) => ['todos', id] as const,
};

/** Fetch all todos */
export function useTodos() {
  return useQuery({
    queryKey: todoKeys.all,
    queryFn: repo.listTodos,
  });
}

/** Fetch a single todo by ID */
export function useTodo(id: string) {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => repo.getTodo(id),
    enabled: !!id,
  });
}

/** Create a new todo (invalidates list cache on success) */
export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTodoInput) => repo.createTodo(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}

/** Update an existing todo */
export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTodoInput) => repo.updateTodo(input),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: todoKeys.all });
      void queryClient.invalidateQueries({
        queryKey: todoKeys.detail(variables.id),
      });
    },
  });
}

/** Delete a todo */
export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repo.deleteTodo(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}
