import { getEnvironment } from '../env';

const KEYS = [
  'NEXT_PUBLIC_VERCEL_ENV',
  'NEXT_PUBLIC_NETLIFY_ENV',
  'NEXT_PUBLIC_AWS_BRANCH',
  'NEXT_PUBLIC_PROD_BRANCH',
] as const;

describe('getEnvironment', () => {
  const original = { ...process.env };

  beforeEach(() => {
    KEYS.forEach(k => delete process.env[k]);
  });

  afterAll(() => {
    process.env = original;
  });

  const setNodeEnv = (value: string) => {
    (process.env as Record<string, string>)['NODE_ENV'] = value;
  };

  it('reports production for the main branch', () => {
    setNodeEnv('production');
    process.env['NEXT_PUBLIC_AWS_BRANCH'] = 'main';
    expect(getEnvironment()).toBe('production');
  });

  it('reports development for a non-main Amplify branch even when NODE_ENV=production', () => {
    setNodeEnv('production');
    process.env['NEXT_PUBLIC_AWS_BRANCH'] = 'development';
    expect(getEnvironment()).toBe('development');
  });

  it('honours NEXT_PUBLIC_PROD_BRANCH', () => {
    process.env['NEXT_PUBLIC_AWS_BRANCH'] = 'release';
    process.env['NEXT_PUBLIC_PROD_BRANCH'] = 'release';
    expect(getEnvironment()).toBe('production');
  });

  it('falls back to NODE_ENV when no branch is set', () => {
    setNodeEnv('production');
    expect(getEnvironment()).toBe('production');
    setNodeEnv('development');
    expect(getEnvironment()).toBe('development');
  });
});
