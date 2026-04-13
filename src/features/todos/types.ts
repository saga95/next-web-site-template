/**
 * Example Feature Module — Domain-Driven Design Pattern
 *
 * This demonstrates the recommended structure for feature modules:
 *
 *   src/features/<feature>/
 *   ├── types.ts          — Domain types (entities, value objects)
 *   ├── repository.ts     — Data access layer (abstracts Amplify/API)
 *   ├── hooks.ts          — React Query hooks (UI ↔ repository bridge)
 *   └── components/       — Feature-specific UI components
 *
 * Why this pattern?
 * - Components never call Amplify/fetch directly
 * - Swapping data sources (Amplify → REST → mock) only changes repository.ts
 * - React Query handles caching, retries, and loading states
 * - Types are shared across the entire feature boundary
 */

// ─── Domain Types ────────────────────────────────────────────────────────────

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
}

export interface UpdateTodoInput {
  id: string;
  title?: string;
  completed?: boolean;
}
