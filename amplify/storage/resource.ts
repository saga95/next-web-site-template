import { defineStorage } from '@aws-amplify/backend';

/**
 * S3 Storage configuration.
 * Pattern from friday.lk and uwu-sri-lanka/website.
 *
 * Paths:
 * - uploads/*  — Admin-managed assets (product images, banners)
 * - assets/*   — Public static assets readable by everyone
 * - user/{entity_id}/* — Per-user private files (avatars, documents)
 *
 * @see https://docs.amplify.aws/gen2/build-a-backend/storage/
 */
export const storage = defineStorage({
  name: 'appStorage',
  access: allow => ({
    'uploads/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['Admin']).to(['read', 'write', 'delete']),
    ],
    'assets/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['Admin']).to(['read', 'write', 'delete']),
    ],
    'user/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.groups(['Admin']).to(['read']),
    ],
  }),
});
