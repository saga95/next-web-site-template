import { act, renderHook, waitFor } from '@testing-library/react';
import { useAsyncOperation } from '../useAsyncOperation';

describe('useAsyncOperation', () => {
  it('should execute an async function and return data', async () => {
    const { result } = renderHook(() => useAsyncOperation<string>());

    await act(async () => {
      await result.current.execute(async () => 'hello');
    });

    expect(result.current.data).toBe('hello');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set isLoading during execution', async () => {
    const { result } = renderHook(() => useAsyncOperation<string>());

    let resolvePromise: (v: string) => void;
    const promise = new Promise<string>(resolve => {
      resolvePromise = resolve;
    });

    act(() => {
      void result.current.execute(async () => promise);
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolvePromise!('done');
      await promise;
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should handle errors', async () => {
    const { result } = renderHook(() => useAsyncOperation<string>());

    await act(async () => {
      await result.current.execute(async () => {
        throw new Error('test error');
      });
    });

    expect(result.current.error?.message).toBe('test error');
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should retry on failure', async () => {
    const fn = jest
      .fn<Promise<string>, [AbortSignal]>()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockResolvedValueOnce('success');

    const { result } = renderHook(() =>
      useAsyncOperation<string>({ retries: 1, retryDelay: 10 })
    );

    await act(async () => {
      await result.current.execute(fn);
    });

    expect(fn).toHaveBeenCalledTimes(2);
    expect(result.current.data).toBe('success');
    expect(result.current.error).toBeNull();
  });

  it('should reset state', async () => {
    const { result } = renderHook(() => useAsyncOperation<string>());

    await act(async () => {
      await result.current.execute(async () => 'data');
    });

    expect(result.current.data).toBe('data');

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});
