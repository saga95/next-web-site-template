import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient();

/** Default group assigned to every newly confirmed user. */
const DEFAULT_GROUP = 'Shopper';

/**
 * Post-confirmation trigger handler.
 * Pattern from uwu-sri-lanka/website.
 *
 * Adds the user to the "Shopper" group upon email/phone confirmation.
 * This ensures every user has at least one group for RBAC.
 */
export const handler: PostConfirmationTriggerHandler = async event => {
  const command = new AdminAddUserToGroupCommand({
    GroupName: DEFAULT_GROUP,
    UserPoolId: event.userPoolId,
    Username: event.userName,
  });

  await client.send(command);

  return event;
};
