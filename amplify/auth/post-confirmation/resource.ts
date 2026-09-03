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
  // Keep this trigger in the same CloudFormation stack as `auth`. It is both an
  // auth trigger (auth → function) and, via its IAM policy, a consumer of the
  // User Pool ARN (function → auth). Splitting it into the default `function`
  // stack creates a circular dependency between the nested stacks.
  resourceGroupName: 'auth',
});
