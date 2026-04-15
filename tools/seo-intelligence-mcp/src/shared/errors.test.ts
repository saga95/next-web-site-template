import { describe, expect, it } from 'vitest';
import {
  AhrefsApiError,
  ConfigError,
  FileNotFoundError,
  SeoMcpError,
  UnsupportedFileError,
  formatErrorForUser,
} from '../shared/errors.js';

describe('error classes', () => {
  it('SeoMcpError has correct properties', () => {
    const err = new SeoMcpError('test', 'TEST_CODE', 503);
    expect(err.message).toBe('test');
    expect(err.code).toBe('TEST_CODE');
    expect(err.statusCode).toBe(503);
    expect(err.name).toBe('SeoMcpError');
    expect(err).toBeInstanceOf(Error);
  });

  it('ConfigError defaults', () => {
    const err = new ConfigError('bad config');
    expect(err.code).toBe('CONFIG_ERROR');
    expect(err.statusCode).toBe(400);
    expect(err.name).toBe('ConfigError');
  });

  it('AhrefsApiError defaults', () => {
    const err = new AhrefsApiError('api fail');
    expect(err.code).toBe('AHREFS_API_ERROR');
    expect(err.statusCode).toBe(502);
    expect(err.name).toBe('AhrefsApiError');
  });

  it('AhrefsApiError custom status', () => {
    const err = new AhrefsApiError('rate limited', 429);
    expect(err.statusCode).toBe(429);
  });

  it('FileNotFoundError', () => {
    const err = new FileNotFoundError('/path/to/file.ts');
    expect(err.message).toContain('/path/to/file.ts');
    expect(err.code).toBe('FILE_NOT_FOUND');
    expect(err.statusCode).toBe(404);
  });

  it('UnsupportedFileError', () => {
    const err = new UnsupportedFileError('/file.xyz');
    expect(err.message).toContain('Unsupported file type');
    expect(err.code).toBe('UNSUPPORTED_FILE');
    expect(err.statusCode).toBe(400);
  });
});

describe('formatErrorForUser', () => {
  it('formats SeoMcpError', () => {
    const err = new ConfigError('Missing API key');
    expect(formatErrorForUser(err)).toBe('Missing API key');
  });

  it('formats generic Error', () => {
    const err = new Error('Something broke');
    expect(formatErrorForUser(err)).toBe('Unexpected error: Something broke');
  });

  it('formats unknown value', () => {
    expect(formatErrorForUser('string error')).toBe(
      'An unknown error occurred.'
    );
  });

  it('formats null/undefined', () => {
    expect(formatErrorForUser(null)).toBe('An unknown error occurred.');
    expect(formatErrorForUser(undefined)).toBe('An unknown error occurred.');
  });
});
