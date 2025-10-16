import {
  cn,
  formatBytes,
  debounce,
  throttle,
  generateId,
  getNestedValue,
} from '../utils'

describe('Utils', () => {
  describe('cn (classnames)', () => {
    it('should merge class names', () => {
      const result = cn('class1', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', false && 'hidden', true && 'visible')
      expect(result).toBe('base visible')
    })

    it('should filter out null and undefined', () => {
      const result = cn('base', null, undefined, 'active')
      expect(result).toBe('base active')
    })
  })

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes')
      expect(formatBytes(1024)).toBe('1 KB')
      expect(formatBytes(1048576)).toBe('1 MB')
      expect(formatBytes(1073741824)).toBe('1 GB')
    })

    it('should handle custom decimals', () => {
      expect(formatBytes(1500, 2)).toBe('1.46 KB')
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should debounce function calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 500)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(500)

      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should throttle function calls', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 500)

      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(1)

      throttledFn()
      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(1) // Still 1 due to throttle

      jest.advanceTimersByTime(500)

      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
    })

    it('should generate ID with custom length', () => {
      const id = generateId(16)
      expect(id.length).toBe(16)
    })
  })

  describe('getNestedValue', () => {
    it('should get nested object values', () => {
      const obj = { user: { name: 'John', address: { city: 'NYC' } } }
      expect(getNestedValue(obj, 'user.name')).toBe('John')
      expect(getNestedValue(obj, 'user.address.city')).toBe('NYC')
    })

    it('should return undefined for non-existent paths', () => {
      const obj = { user: { name: 'John' } }
      expect(getNestedValue(obj, 'user.age')).toBeUndefined()
      expect(getNestedValue(obj, 'nonexistent.path')).toBeUndefined()
    })
  })
})
