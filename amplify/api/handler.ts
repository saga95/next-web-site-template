import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';

/**
 * HTTP API router Lambda. Reachable at https://api.<your-domain>/<path>
 * once the custom domain is configured (see docs/API_GATEWAY.md).
 *
 * Add new routes by extending the `routes` map below.
 */

type RouteHandler = (
  event: APIGatewayProxyEventV2
) => Promise<APIGatewayProxyResultV2> | APIGatewayProxyResultV2;

const json = (statusCode: number, body: unknown): APIGatewayProxyResultV2 => ({
  statusCode,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  },
  body: JSON.stringify(body),
});

const routes: Record<string, RouteHandler> = {
  'GET /': () =>
    json(200, {
      service: 'api-router',
      message: 'API Gateway is online.',
      docs: '/docs',
    }),

  'GET /health': () =>
    json(200, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }),

  'GET /version': () =>
    json(200, {
      version: process.env['APP_VERSION'] ?? '1.0.0',
      stage: process.env['STAGE'] ?? 'dev',
    }),
};

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const method = event.requestContext.http.method.toUpperCase();
  const path = event.rawPath || '/';
  const key = `${method} ${path}`;

  const route = routes[key];
  if (!route) {
    return json(404, { error: 'Not Found', path: key });
  }

  try {
    return await route(event);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Internal Server Error';
    return json(500, { error: message });
  }
};
