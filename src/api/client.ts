/**
 * Custom API client with request/response interceptors.
 *
 * Wraps `fetch` with:
 * - Base URL resolution
 * - Automatic JSON serialisation / deserialisation
 * - Auth token injection (reads Amplify session)
 * - Configurable request/response/error interceptors
 * - Timeout support
 */

import { fetchAuthSession } from 'aws-amplify/auth';
import { logger } from '@/lib/logger';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ApiClientConfig {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  /** Skip automatic auth-token injection for public endpoints. */
  skipAuth?: boolean;
}

export type RequestInterceptor = (
  url: string,
  init: RequestInit
) => RequestInit | Promise<RequestInit>;

export type ResponseInterceptor = (
  response: Response
) => Response | Promise<Response>;

export type ErrorInterceptor = (error: ApiError) => void;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Client ─────────────────────────────────────────────────────────────────────

export class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;
  private defaultHeaders: Record<string, string>;

  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl ?? '/api';
    this.defaultTimeout = config.timeout ?? 30_000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  // ── Interceptors ──────────────────────────────────────────────────────────

  onRequest(fn: RequestInterceptor): () => void {
    this.requestInterceptors.push(fn);
    return () => {
      this.requestInterceptors = this.requestInterceptors.filter(i => i !== fn);
    };
  }

  onResponse(fn: ResponseInterceptor): () => void {
    this.responseInterceptors.push(fn);
    return () => {
      this.responseInterceptors = this.responseInterceptors.filter(
        i => i !== fn
      );
    };
  }

  onError(fn: ErrorInterceptor): () => void {
    this.errorInterceptors.push(fn);
    return () => {
      this.errorInterceptors = this.errorInterceptors.filter(i => i !== fn);
    };
  }

  // ── HTTP methods ──────────────────────────────────────────────────────────

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'POST', body });
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PUT', body });
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PATCH', body });
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  // ── Core ──────────────────────────────────────────────────────────────────

  private async request<T>(
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, body, timeout, skipAuth, ...fetchOptions } = options;

    // Build URL
    let url = `${this.baseUrl}${path}`;
    if (params) {
      const qs = new URLSearchParams(params).toString();
      url = `${url}?${qs}`;
    }

    // Build init
    let init: RequestInit = {
      ...fetchOptions,
      headers: {
        ...this.defaultHeaders,
        ...(fetchOptions.headers as Record<string, string>),
      },
    };

    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    // Auth header
    if (!skipAuth) {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        if (token) {
          init.headers = { ...init.headers, Authorization: `Bearer ${token}` };
        }
      } catch {
        // Not signed in — continue without auth header
      }
    }

    // Run request interceptors
    for (const interceptor of this.requestInterceptors) {
      init = await interceptor(url, init);
    }

    // Timeout
    const controller = new AbortController();
    init.signal = controller.signal;
    const timeoutId = setTimeout(
      () => controller.abort(),
      timeout ?? this.defaultTimeout
    );

    try {
      let response = await fetch(url, init);
      clearTimeout(timeoutId);

      // Run response interceptors
      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response);
      }

      if (!response.ok) {
        let data: unknown;
        try {
          data = await response.json();
        } catch {
          data = await response.text();
        }
        throw new ApiError(
          `API error ${response.status}: ${response.statusText}`,
          response.status,
          data
        );
      }

      // 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);

      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError(
              error instanceof Error ? error.message : 'Unknown error',
              0
            );

      for (const interceptor of this.errorInterceptors) {
        interceptor(apiError);
      }

      logger.error('API request failed', {
        url,
        method: init.method,
        status: apiError.status,
        message: apiError.message,
      });

      throw apiError;
    }
  }
}

/** Pre-configured default API client instance. */
export const apiClient = new ApiClient();
