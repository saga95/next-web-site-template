/**
 * useAsyncOperation — manage async operations with retry, timeout, abort, and progress.
 *
 * A general-purpose hook for operations that don't fit neatly into React Query
 * (file uploads, multi-step workflows, imperative async calls).
 *
 * @example
 * ```tsx
 * const op = useAsyncOperation<UploadResult>();
 *
 * const handleUpload = async () => {
 *   const result = await op.execute(async (signal) => {
 *     return uploadFile(file, { signal });
 *   });
 * };
 *
 * // In JSX:
 * op.isLoading && <Spinner />
 * op.error && <Alert>{op.error.message}</Alert>
 * ```
 */

import { useCallback, useRef, useState } from 'react';

interface AsyncOperationState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

interface UseAsyncOperationOptions {
  /** Timeout in ms. 0 = no timeout. Default: 30000. */
  timeout?: number;
  /** Number of retry attempts on failure. Default: 0. */
  retries?: number;
  /** Delay between retries in ms. Doubles each attempt. Default: 1000. */
  retryDelay?: number;
}

export function useAsyncOperation<T>(options: UseAsyncOperationOptions = {}) {
  const { timeout = 30_000, retries = 0, retryDelay = 1000 } = options;

  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  // Track mounted state
  const setStateIfMounted = useCallback(
    (update: Partial<AsyncOperationState<T>>) => {
      if (mountedRef.current) {
        setState(prev => ({ ...prev, ...update }));
      }
    },
    []
  );

  const execute = useCallback(
    async (fn: (signal: AbortSignal) => Promise<T>): Promise<T | null> => {
      // Abort previous operation if still running
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      setStateIfMounted({ isLoading: true, error: null });

      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      if (timeout > 0) {
        timeoutId = setTimeout(() => controller.abort(), timeout);
      }

      let lastError: Error | null = null;
      const maxAttempts = retries + 1;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (controller.signal.aborted) break;

        try {
          const result = await fn(controller.signal);
          clearTimeout(timeoutId);
          setStateIfMounted({ data: result, isLoading: false, error: null });
          return result;
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err));

          if (controller.signal.aborted) break;

          // Wait before retrying (exponential backoff)
          if (attempt < maxAttempts - 1) {
            const delay = retryDelay * 2 ** attempt;
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      clearTimeout(timeoutId);
      setStateIfMounted({
        error: lastError ?? new Error('Operation aborted'),
        isLoading: false,
      });
      return null;
    },
    [timeout, retries, retryDelay, setStateIfMounted]
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    setStateIfMounted({
      isLoading: false,
      error: new Error('Operation aborted'),
    });
  }, [setStateIfMounted]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({ data: null, error: null, isLoading: false });
  }, []);

  return {
    ...state,
    execute,
    abort,
    reset,
  };
}
