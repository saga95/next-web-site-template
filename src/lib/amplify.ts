import { Amplify, type ResourcesConfig } from 'aws-amplify';

/**
 * Amplify client configuration.
 * Pattern from tmsaaokenki-dev/website and friday.lk.
 *
 * amplify_outputs.json is generated during build/deploy by Amplify.
 * In development without sandbox, the app continues without backend.
 */

let amplifyConfig: ResourcesConfig | null = null;
let isConfigured = false;

/**
 * Configure Amplify on the client side.
 * Call this once in your app provider or _app.tsx.
 */
export const configureAmplify = async (): Promise<boolean> => {
  if (isConfigured) return true;

  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const outputs = await import('../../amplify_outputs.json');
    amplifyConfig = outputs.default as ResourcesConfig;
    Amplify.configure(amplifyConfig);
    isConfigured = true;
    return true;
  } catch {
    console.warn(
      'Amplify outputs not found. Running without backend configuration.',
      'Run `npx ampx sandbox` to generate amplify_outputs.json.'
    );
    isConfigured = true; // Don't retry
    return false;
  }
};

export const getAmplifyConfig = () => amplifyConfig;
export const isAmplifyConfigured = () => isConfigured && amplifyConfig !== null;
