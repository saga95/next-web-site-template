import { hasAhrefsConfig, loadConfig } from '../../config/env.js';
import { AhrefsApiError, ConfigError } from '../../shared/errors.js';
import { createLogger } from '../../shared/logger.js';
import type {
  AhrefsErrorResponse,
  AhrefsKeywordsResponse,
  AhrefsQuestionKeywordsResponse,
  AhrefsRelatedKeywordsResponse,
} from './ahrefs-types.js';

const logger = createLogger('ahrefs-client');

function getHeaders(): Record<string, string> {
  const config = loadConfig();
  if (!config.AHREFS_API_KEY) {
    throw new ConfigError(
      'AHREFS_API_KEY is not configured. Set it in your environment or mcp.json to enable Ahrefs-powered features.'
    );
  }

  return {
    Authorization: `Bearer ${config.AHREFS_API_KEY}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit
): Promise<Response> {
  const config = loadConfig();
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    config.SEO_MCP_TIMEOUT_MS
  );

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Ahrefs API error: ${response.status} ${response.statusText}`;

    try {
      const errorBody = (await response.json()) as AhrefsErrorResponse;
      if (errorBody.message) {
        errorMessage = `Ahrefs API: ${errorBody.message}`;
      }
    } catch {
      // Could not parse error body
    }

    if (response.status === 401) {
      throw new AhrefsApiError(
        'Invalid Ahrefs API key. Check your AHREFS_API_KEY configuration.',
        401
      );
    }
    if (response.status === 429) {
      throw new AhrefsApiError(
        'Ahrefs API rate limit exceeded. Try again later.',
        429
      );
    }
    throw new AhrefsApiError(errorMessage, response.status);
  }

  return (await response.json()) as T;
}

export function isAhrefsAvailable(): boolean {
  return hasAhrefsConfig();
}

export async function getKeywordMetrics(
  keyword: string,
  country = 'us'
): Promise<AhrefsKeywordsResponse> {
  const config = loadConfig();
  const url = `${config.AHREFS_BASE_URL}/keywords-explorer/overview?keyword=${encodeURIComponent(keyword)}&country=${country}`;

  logger.info(`Fetching keyword metrics for: ${keyword}`);

  const response = await fetchWithTimeout(url, {
    method: 'GET',
    headers: getHeaders(),
  });

  return handleResponse<AhrefsKeywordsResponse>(response);
}

export async function getRelatedKeywords(
  keyword: string,
  country = 'us',
  limit = 20
): Promise<AhrefsRelatedKeywordsResponse> {
  const config = loadConfig();
  const url = `${config.AHREFS_BASE_URL}/keywords-explorer/related-terms?keyword=${encodeURIComponent(keyword)}&country=${country}&limit=${limit}`;

  logger.info(`Fetching related keywords for: ${keyword}`);

  const response = await fetchWithTimeout(url, {
    method: 'GET',
    headers: getHeaders(),
  });

  return handleResponse<AhrefsRelatedKeywordsResponse>(response);
}

export async function getQuestionKeywords(
  keyword: string,
  country = 'us',
  limit = 10
): Promise<AhrefsQuestionKeywordsResponse> {
  const config = loadConfig();
  const url = `${config.AHREFS_BASE_URL}/keywords-explorer/questions?keyword=${encodeURIComponent(keyword)}&country=${country}&limit=${limit}`;

  logger.info(`Fetching question keywords for: ${keyword}`);

  const response = await fetchWithTimeout(url, {
    method: 'GET',
    headers: getHeaders(),
  });

  return handleResponse<AhrefsQuestionKeywordsResponse>(response);
}
