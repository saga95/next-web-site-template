import { describe, expect, it } from 'vitest';
import { toolError, toolSuccess } from '../mcp/types.js';

describe('toolSuccess', () => {
  it('creates a success result', () => {
    const result = toolSuccess('All good');
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toBe('All good');
    expect(result.isError).toBeUndefined();
  });
});

describe('toolError', () => {
  it('creates an error result', () => {
    const result = toolError('Something failed');
    expect(result.content).toHaveLength(1);
    expect(result.content[0].text).toBe('Error: Something failed');
    expect(result.isError).toBe(true);
  });
});
