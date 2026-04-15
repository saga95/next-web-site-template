import { z } from 'zod';

const emptyToUndefined = (val: unknown) =>
  typeof val === 'string' && val.trim() === '' ? undefined : val;

const envSchema = z.object({
  AHREFS_API_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  AHREFS_BASE_URL: z.string().url().default('https://api.ahrefs.com/v3'),
  SEO_MCP_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  SEO_MCP_TIMEOUT_MS: z.coerce.number().positive().default(30_000),
  SEO_MCP_CACHE_TTL: z.coerce.number().nonnegative().default(3_600_000),
});

export type EnvConfig = z.infer<typeof envSchema>;

let cachedConfig: EnvConfig | null = null;

export function loadConfig(): EnvConfig {
  if (cachedConfig) return cachedConfig;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues
      .map(i => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(
      `SEO Intelligence MCP — environment validation failed:\n${formatted}\n\nSee the README for required environment variables.`
    );
  }

  cachedConfig = result.data;
  return cachedConfig;
}

export function hasAhrefsConfig(): boolean {
  const config = loadConfig();
  return !!config.AHREFS_API_KEY;
}

export function resetConfigCache(): void {
  cachedConfig = null;
}
