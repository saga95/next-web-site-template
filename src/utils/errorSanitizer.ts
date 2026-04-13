/**
 * Error sanitization utility.
 *
 * Maps internal error messages/codes to safe user-facing messages.
 * NEVER expose stack traces, SQL errors, internal paths, or auth details to users.
 */

interface SanitizedError {
  /** Safe message suitable for displaying to end users */
  message: string;
  /** Original error code (if available) for logging / support tickets */
  code?: string | undefined;
}

/**
 * Pattern → safe message mapping.
 * Order matters — first match wins.
 */
const ERROR_PATTERNS: Array<{ pattern: RegExp; message: string }> = [
  // Network / connectivity
  { pattern: /network|fetch|ECONNREFUSED|ENOTFOUND|ERR_NETWORK/i, message: 'Unable to connect. Please check your internet connection and try again.' },
  { pattern: /timeout|ETIMEDOUT|ESOCKETTIMEDOUT/i, message: 'The request timed out. Please try again.' },

  // Authentication / authorization
  { pattern: /unauthorized|401|not authenticated/i, message: 'Your session has expired. Please sign in again.' },
  { pattern: /forbidden|403|not authorized|access denied/i, message: 'You do not have permission to perform this action.' },

  // Not found
  { pattern: /not found|404/i, message: 'The requested resource was not found.' },

  // Rate limiting
  { pattern: /too many requests|429|rate limit/i, message: 'Too many requests. Please wait a moment and try again.' },

  // Validation
  { pattern: /validation|invalid|malformed/i, message: 'The submitted data is invalid. Please check your input and try again.' },

  // Server errors
  { pattern: /internal server|500|502|503|504/i, message: 'Something went wrong on our end. Please try again later.' },

  // Storage
  { pattern: /quota|storage|QUOTA_EXCEEDED/i, message: 'Storage limit reached. Please free up space and try again.' },
];

/** Default fallback — never expose the real error */
const DEFAULT_MESSAGE = 'Something went wrong. Please try again later.';

/**
 * Sanitize an error for safe display to end users.
 *
 * @example
 * ```ts
 * try {
 *   await api.fetchData();
 * } catch (err) {
 *   const { message } = sanitizeError(err);
 *   showToast(message);
 *   logger.error('fetchData failed', err); // log the REAL error
 * }
 * ```
 */
export function sanitizeError(error: unknown): SanitizedError {
  const raw = extractMessage(error);
  const code = extractCode(error);

  for (const { pattern, message } of ERROR_PATTERNS) {
    if (pattern.test(raw)) {
      return { message, code };
    }
  }

  return { message: DEFAULT_MESSAGE, code };
}

/**
 * Check whether an error is a specific HTTP status code.
 */
export function isHttpError(error: unknown, status: number): boolean {
  if (error && typeof error === 'object') {
    const e = error as Record<string, unknown>;
    return e['status'] === status || e['statusCode'] === status;
  }
  return false;
}

// ── Helpers ──────────────────────────────────────────────

function extractMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object') {
    const e = error as Record<string, unknown>;
    if (typeof e['message'] === 'string') return e['message'];
  }
  return '';
}

function extractCode(error: unknown): string | undefined {
  if (error && typeof error === 'object') {
    const e = error as Record<string, unknown>;
    if (typeof e['code'] === 'string') return e['code'];
    if (typeof e['status'] === 'number') return String(e['status']);
    if (typeof e['statusCode'] === 'number') return String(e['statusCode']);
  }
  return undefined;
}
