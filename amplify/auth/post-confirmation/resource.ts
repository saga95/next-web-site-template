import { defineFunction } from '@aws-amplify/backend';

/**
 * Post-confirmation Lambda trigger.
 * Pattern from uwu-sri-lanka/website.
 *
 * Automatically assigns newly confirmed users to the default "Shopper" group.
 * Admins must be promoted manually via the AWS Console or admin API.
 */
export const postConfirmation = defineFunction({
  name: 'post-confirmation',
});
