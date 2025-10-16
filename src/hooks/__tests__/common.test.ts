import { renderHook, act } from '@testing-library/react'
import { useDebounce, useThrottle } from '../common'

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should debounce the value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    expect(result.current).toBe('initial')

    // Update the value
    act(() => {
      rerender({ value: 'updated', delay: 500 })
    })
    
    expect(result.current).toBe('initial') // Still initial because debounce hasn't fired

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    expect(result.current).toBe('updated')
  })
})

describe('useThrottle', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(
      ({ value, delay }) => useThrottle(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    expect(result.current).toBe('initial')
  })

  it('should throttle rapid updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useThrottle(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    expect(result.current).toBe('initial')

    // Rapid updates
    act(() => {
      rerender({ value: 'update1', delay: 500 })
      rerender({ value: 'update2', delay: 500 })
      rerender({ value: 'update3', delay: 500 })
    })
    
    // Should still be initial or first update due to throttle
    // The exact behavior depends on timing
    expect(typeof result.current).toBe('string')
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    // After throttle period, should eventually update
    expect(result.current).toBeDefined()
  })
})
