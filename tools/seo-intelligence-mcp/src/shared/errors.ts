export class SeoMcpError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode = 500
  ) {
    super(message);
    this.name = 'SeoMcpError';
  }
}

export class ConfigError extends SeoMcpError {
  constructor(message: string) {
    super(message, 'CONFIG_ERROR', 400);
    this.name = 'ConfigError';
  }
}

export class AhrefsApiError extends SeoMcpError {
  constructor(message: string, statusCode = 502) {
    super(message, 'AHREFS_API_ERROR', statusCode);
    this.name = 'AhrefsApiError';
  }
}

export class FileNotFoundError extends SeoMcpError {
  constructor(filePath: string) {
    super(`File not found: ${filePath}`, 'FILE_NOT_FOUND', 404);
    this.name = 'FileNotFoundError';
  }
}

export class UnsupportedFileError extends SeoMcpError {
  constructor(filePath: string) {
    super(
      `Unsupported file type: ${filePath}. Only .tsx, .ts, .jsx, .js, .md, and .mdx files are supported.`,
      'UNSUPPORTED_FILE',
      400
    );
    this.name = 'UnsupportedFileError';
  }
}

export function formatErrorForUser(error: unknown): string {
  if (error instanceof SeoMcpError) {
    return error.message;
  }
  if (error instanceof Error) {
    return `Unexpected error: ${error.message}`;
  }
  return 'An unknown error occurred.';
}
