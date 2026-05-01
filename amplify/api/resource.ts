import { defineFunction } from '@aws-amplify/backend';

/**
 * REST API router Lambda — fronted by API Gateway HTTP API.
 *
 * Exposed at:
 *   - default URL:    https://<api-id>.execute-api.<region>.amazonaws.com/
 *   - custom domain:  https://api.<your-domain>/         (when API_DOMAIN_NAME is set)
 *
 * See `docs/API_GATEWAY.md` for setup instructions.
 */
export const apiRouter = defineFunction({
  name: 'api-router',
  entry: './handler.ts',
  timeoutSeconds: 10,
  memoryMB: 512,
});
