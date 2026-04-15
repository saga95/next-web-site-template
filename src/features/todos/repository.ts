/**
 * Repository — Data Access Layer
 *
 * This abstracts all data operations behind a clean interface.
 * Components and hooks never import Amplify/fetch directly.
 *
 * To swap data sources:
 * 1. Replace the implementation inside each function
 * 2. The rest of the feature module stays untouched
 *
 * Current implementation: Local mock (replace with Amplify generateClient())
 */

import type { CreateTodoInput, Todo, UpdateTodoInput } from './types';

// ─── Amplify Implementation (uncomment when backend is deployed) ─────────────
//
// import { generateClient } from 'aws-amplify/data';
// import type { Schema } from '../../../amplify/data/resource';
// const client = generateClient<Schema>();
//
// export async function listTodos(): Promise<Todo[]> {
//   const { data } = await client.models.Todo.list();
//   return data as Todo[];
// }

// ─── Mock Implementation (for development without backend) ───────────────────

let mockStore: Todo[] = [];

export async function listTodos(): Promise<Todo[]> {
  return [...mockStore];
}

export async function getTodo(id: string): Promise<Todo | null> {
  return mockStore.find(t => t.id === id) ?? null;
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const now = new Date().toISOString();
  const todo: Todo = {
    id: crypto.randomUUID(),
    title: input.title,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
  mockStore = [...mockStore, todo];
  return todo;
}

export async function updateTodo(input: UpdateTodoInput): Promise<Todo> {
  const existing = mockStore.find(t => t.id === input.id);
  if (!existing) throw new Error(`Todo ${input.id} not found`);

  const updated: Todo = {
    id: existing.id,
    title: input.title ?? existing.title,
    completed: input.completed ?? existing.completed,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };
  mockStore = mockStore.map(t => (t.id === input.id ? updated : t));
  return updated;
}

export async function deleteTodo(id: string): Promise<void> {
  mockStore = mockStore.filter(t => t.id !== id);
}
