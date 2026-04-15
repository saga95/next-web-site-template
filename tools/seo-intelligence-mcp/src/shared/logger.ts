import { loadConfig } from '../config/env.js';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function getMinLevel(): LogLevel {
  try {
    return loadConfig().SEO_MCP_LOG_LEVEL;
  } catch {
    return 'info';
  }
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[getMinLevel()];
}

function formatMessage(
  level: LogLevel,
  context: string,
  message: string
): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}`;
}

function redactSecrets(message: string): string {
  return message.replace(
    /(AHREFS_API_KEY|api_key|authorization|token)[=:]\s*["']?[^\s"',]+["']?/gi,
    '$1=[REDACTED]'
  );
}

export interface Logger {
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string, error?: unknown): void;
  child(childContext: string): Logger;
}

export function createLogger(context: string): Logger {
  const log = (level: LogLevel, message: string, err?: unknown): void => {
    if (!shouldLog(level)) return;

    const safe = redactSecrets(message);
    const formatted = formatMessage(level, context, safe);
    const stream = level === 'error' ? process.stderr : process.stdout;

    stream.write(`${formatted}\n`);

    if (err instanceof Error) {
      stream.write(`  ${redactSecrets(err.message)}\n`);
      if (err.stack && level === 'debug') {
        stream.write(`  ${redactSecrets(err.stack)}\n`);
      }
    }
  };

  return {
    debug: msg => log('debug', msg),
    info: msg => log('info', msg),
    warn: msg => log('warn', msg),
    error: (msg, err?) => log('error', msg, err),
    child: childContext => createLogger(`${context}:${childContext}`),
  };
}
