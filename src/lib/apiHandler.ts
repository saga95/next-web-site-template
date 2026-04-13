import type { NextApiRequest, NextApiResponse } from 'next';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void> | void;

type ApiHandlerMap = Partial<Record<HttpMethod, ApiHandler>>;

/**
 * API route handler with built-in security practices.
 *
 * Pattern from agent-skills/security-and-hardening:
 * - Method validation (rejects unsupported methods with 405)
 * - Structured error responses (no stack traces / internals)
 * - Consistent response format
 *
 * Usage:
 * ```ts
 * export default apiHandler({
 *   GET: async (req, res) => {
 *     const items = await getItems();
 *     res.status(200).json({ data: items });
 *   },
 *   POST: async (req, res) => {
 *     const schema = z.object({ title: z.string().min(1) });
 *     const result = schema.safeParse(req.body);
 *     if (!result.success) {
 *       return res.status(422).json({
 *         error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: result.error.flatten() },
 *       });
 *     }
 *     const item = await createItem(result.data);
 *     res.status(201).json({ data: item });
 *   },
 * });
 * ```
 */
export function apiHandler(handlers: ApiHandlerMap) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method as HttpMethod;
    const handler = handlers[method];

    if (!handler) {
      const allowed = Object.keys(handlers).join(', ');
      res.setHeader('Allow', allowed);
      return res.status(405).json({
        error: { code: 'METHOD_NOT_ALLOWED', message: `Method ${method} not allowed` },
      });
    }

    try {
      await handler(req, res);
    } catch (error) {
      // Never expose internals to users (OWASP #6)
      if (process.env.NODE_ENV === 'development') {
        console.error('[API Error]', error);
      }

      if (!res.headersSent) {
        res.status(500).json({
          error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' },
        });
      }
    }
  };
}
