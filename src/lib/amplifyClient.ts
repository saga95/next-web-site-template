import { generateClient } from 'aws-amplify/data';

/**
 * Dual Amplify Data clients.
 * Pattern from uwu-sri-lanka/website.
 *
 * publicClient — uses the default API-key auth mode for unauthenticated reads
 *                (storefront product listing, category browsing, etc.).
 *
 * authClient   — uses Cognito userPool auth for authenticated operations
 *                (placing orders, admin CRUD, profile updates).
 *
 * To enable full type safety, uncomment the Schema import below.
 * Requires `@aws-amplify/backend` in root devDependencies.
 *
 * ```ts
 * import type { Schema } from '../../amplify/data/resource';
 * export const publicClient = generateClient<Schema>({ authMode: 'apiKey' });
 * ```
 *
 * Usage:
 * ```ts
 * import { publicClient, authClient } from '@/lib/amplifyClient';
 *
 * // Public read
 * const { data } = await publicClient.models.Product.list();
 *
 * // Authenticated write
 * await authClient.models.Order.create({ ... });
 * ```
 */
export const publicClient = generateClient({
  authMode: 'apiKey',
});

export const authClient = generateClient({
  authMode: 'userPool',
});
