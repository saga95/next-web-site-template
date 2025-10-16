import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';

/**
 * Hook that runs a callback on component mount
 */
export function useMount(callback: () => void): void {
  const mountRef = useRef(false);
  
  useEffect(() => {
    if (!mountRef.current) {
      callback();
      mountRef.current = true;
    }
  }, [callback]);
}

/**
 * Hook that runs a callback on component unmount
 */
export function useUnmount(callback: () => void): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return () => {
      callbackRef.current();
    };
  }, []);
}

/**
 * Hook that returns the previous value of a state or prop
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}

/**
 * Hook that forces a component re-render
 */
export function useForceUpdate(): () => void {
  const [, setState] = useState({});
  
  return useCallback(() => setState({}), []);
}

/**
 * Hook that returns whether the component is currently mounted
 */
export function useIsMounted(): React.MutableRefObject<boolean> {
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  return isMountedRef;
}

/**
 * Hook that creates a stable reference to a function
 */
export function useEvent<T extends (...args: unknown[]) => unknown>(callback: T): T {
  const ref = useRef<T>(callback);
  
  useLayoutEffect(() => {
    ref.current = callback;
  });
  
  return useCallback((...args: Parameters<T>) => {
    return ref.current(...args);
  }, []) as T;
}

/**
 * Hook that debounces a value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook that throttles a value
 */
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + interval) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
      return undefined;
    }
    
    const timerId = setTimeout(() => {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    }, interval);

    return () => clearTimeout(timerId);
  }, [value, interval]);

  return throttledValue;
}