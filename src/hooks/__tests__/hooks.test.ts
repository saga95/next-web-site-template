import { act, renderHook } from '@testing-library/react';
import { useDebounce, useIsMounted, usePrevious, useThrottle } from '../common';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500));
    expect(result.current).toBe('hello');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 500 } }
    );

    // Update the value
    rerender({ value: 'world', delay: 500 });

    // Should still be the old value before timeout
    expect(result.current).toBe('hello');

    // Fast-forward past debounce delay
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('world');
  });

  it('resets timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 300 } }
    );

    rerender({ value: 'b', delay: 300 });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    rerender({ value: 'c', delay: 300 });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Neither 'b' nor 'c' should have resolved yet (timer was reset)
    expect(result.current).toBe('a');

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Now only the last value resolves
    expect(result.current).toBe('c');
  });
});

describe('useThrottle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useThrottle('initial', 500));
    expect(result.current).toBe('initial');
  });
});

describe('usePrevious', () => {
  it('returns undefined on first render', () => {
    const { result } = renderHook(() => usePrevious(0));
    expect(result.current).toBeUndefined();
  });

  it('returns previous value after update', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    });

    expect(result.current).toBeUndefined();

    rerender({ value: 2 });
    expect(result.current).toBe(1);

    rerender({ value: 3 });
    expect(result.current).toBe(2);
  });
});

describe('useIsMounted', () => {
  it('returns true while mounted', () => {
    const { result } = renderHook(() => useIsMounted());
    expect(result.current.current).toBe(true);
  });

  it('returns false after unmount', () => {
    const { result, unmount } = renderHook(() => useIsMounted());
    expect(result.current.current).toBe(true);

    unmount();
    expect(result.current.current).toBe(false);
  });
});
