import { act, renderHook } from '@testing-library/react';
import { useCache } from '../useCache';

describe('useCache', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should store and retrieve values', () => {
    const { result } = renderHook(() => useCache<string>());
    act(() => {
      result.current.set('key1', 'value1');
    });
    expect(result.current.get('key1')).toBe('value1');
  });

  it('should return undefined for missing keys', () => {
    const { result } = renderHook(() => useCache<string>());
    expect(result.current.get('nonexistent')).toBeUndefined();
  });

  it('should expire entries after TTL', () => {
    const { result } = renderHook(() => useCache<string>({ ttl: 1000 }));

    act(() => {
      result.current.set('key1', 'value1');
    });
    expect(result.current.get('key1')).toBe('value1');

    act(() => {
      jest.advanceTimersByTime(1001);
    });
    expect(result.current.get('key1')).toBeUndefined();
  });

  it('should support custom TTL per entry', () => {
    const { result } = renderHook(() => useCache<string>({ ttl: 10000 }));

    act(() => {
      result.current.set('short', 'value', 500);
      result.current.set('long', 'value', 5000);
    });

    act(() => {
      jest.advanceTimersByTime(501);
    });
    expect(result.current.get('short')).toBeUndefined();
    expect(result.current.get('long')).toBe('value');
  });

  it('should evict oldest entries when maxSize is reached', () => {
    const { result } = renderHook(() =>
      useCache<string>({ maxSize: 2, ttl: 60000 })
    );

    act(() => {
      result.current.set('a', '1');
      result.current.set('b', '2');
      result.current.set('c', '3'); // should evict 'a'
    });

    expect(result.current.get('a')).toBeUndefined();
    expect(result.current.get('b')).toBe('2');
    expect(result.current.get('c')).toBe('3');
  });

  it('should support has()', () => {
    const { result } = renderHook(() => useCache<string>());
    act(() => {
      result.current.set('key', 'val');
    });
    expect(result.current.has('key')).toBe(true);
    expect(result.current.has('missing')).toBe(false);
  });

  it('should support remove()', () => {
    const { result } = renderHook(() => useCache<string>());
    act(() => {
      result.current.set('key', 'val');
      result.current.remove('key');
    });
    expect(result.current.get('key')).toBeUndefined();
  });

  it('should support clear()', () => {
    const { result } = renderHook(() => useCache<string>());
    act(() => {
      result.current.set('a', '1');
      result.current.set('b', '2');
      result.current.clear();
    });
    expect(result.current.size()).toBe(0);
  });

  it('should return correct size', () => {
    const { result } = renderHook(() => useCache<string>({ ttl: 60000 }));
    act(() => {
      result.current.set('a', '1');
      result.current.set('b', '2');
    });
    expect(result.current.size()).toBe(2);
  });
});
