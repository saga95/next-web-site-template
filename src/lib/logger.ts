/**
 * Environment-aware Logger Utility
 *
 * Provides a centralized logging utility that:
 * - Only outputs logs in development environment
 * - Provides consistent logging interface
 * - Prevents sensitive information from leaking in production
 * - Supports child loggers for component-specific context
 *
 * Pattern from politica Parliament Tracking System.
 *
 * Usage:
 * ```ts
 * import { logger } from '@/lib/logger';
 *
 * logger.info('User logged in', { userId: user.id });
 * logger.error('Failed to fetch data', error);
 * logger.warn('Deprecated API usage');
 * logger.debug('Debug information', data);
 *
 * // Child loggers for component context
 * const apiLogger = logger.createChild('API');
 * apiLogger.info('Request completed', { status: 200 });
 * // Output: [API] Request completed { status: 200 }
 * ```
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabledInProduction: boolean;
  minLevel: LogLevel;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const isDevelopment = process.env['NODE_ENV'] === 'development';
const isProduction = process.env['NODE_ENV'] === 'production';

const defaultConfig: LoggerConfig = {
  enabledInProduction: false,
  minLevel: isDevelopment ? 'debug' : 'error',
};

class Logger {
  private config: LoggerConfig;
  private prefix: string;

  constructor(config?: Partial<LoggerConfig>, prefix?: string) {
    this.config = { ...defaultConfig, ...config };
    this.prefix = prefix || '';
  }

  private shouldLog(level: LogLevel): boolean {
    if (isProduction && !this.config.enabledInProduction) {
      return false;
    }
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel];
  }

  private formatMessage(message: string): string {
    return this.prefix ? `[${this.prefix}] ${message}` : message;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage(message), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage(message), ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage(message), ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage(message), ...args);
    }
  }

  /**
   * Create a child logger with a prefix for component-specific context.
   */
  createChild(prefix: string): Logger {
    const childPrefix = this.prefix ? `${this.prefix}:${prefix}` : prefix;
    return new Logger(this.config, childPrefix);
  }

  /**
   * Log a group of related messages (dev only).
   */
  group(label: string, fn: () => void): void {
    if (!this.shouldLog('debug')) return;
    console.group(this.formatMessage(label));
    fn();
    console.groupEnd();
  }

  /**
   * Measure execution time (dev only).
   */
  time(label: string): () => void {
    if (!this.shouldLog('debug')) {
      return () => {};
    }
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.debug(`${label}: ${duration.toFixed(2)}ms`);
    };
  }
}

// Export singleton instance
export const logger = new Logger();

// Export class for custom instances
export { Logger };

// Convenience exports for common use cases
export const apiLogger = logger.createChild('API');
export const authLogger = logger.createChild('Auth');
export const uiLogger = logger.createChild('UI');
export const seoLogger = logger.createChild('SEO');
