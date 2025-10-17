/**
 * Environment detection and configuration utilities
 */

/**
 * Get the current environment
 */
export const getEnvironment = (): 'development' | 'staging' | 'production' => {
  // Vercel-specific environment detection
  if (process.env['NEXT_PUBLIC_VERCEL_ENV'] === 'production') {
    return 'production'
  }
  
  if (process.env['NEXT_PUBLIC_VERCEL_ENV'] === 'preview') {
    return 'staging'
  }

  // Netlify-specific environment detection
  if (process.env['NEXT_PUBLIC_NETLIFY_ENV'] === 'production') {
    return 'production'
  }
  
  if (process.env['NEXT_PUBLIC_NETLIFY_ENV'] === 'preview' || 
      process.env['NEXT_PUBLIC_NETLIFY_ENV'] === 'deploy-preview') {
    return 'staging'
  }

  // AWS Amplify environment detection
  if (process.env['NEXT_PUBLIC_AWS_BRANCH'] === 'main') {
    return 'production'
  }
  
  if (process.env['NEXT_PUBLIC_AWS_BRANCH'] === 'staging') {
    return 'staging'
  }

  // Default to NODE_ENV or development
  if (process.env['NODE_ENV'] === 'production') {
    return 'production'
  }

  return 'development'
}

/**
 * Check if running in development
 */
export const isDevelopment = (): boolean => {
  return getEnvironment() === 'development'
}

/**
 * Check if running in staging
 */
export const isStaging = (): boolean => {
  return getEnvironment() === 'staging'
}

/**
 * Check if running in production
 */
export const isProduction = (): boolean => {
  return getEnvironment() === 'production'
}

/**
 * Check if running on client side
 */
export const isClient = (): boolean => {
  return typeof window !== 'undefined'
}

/**
 * Check if running on server side
 */
export const isServer = (): boolean => {
  return !isClient()
}

/**
 * Get environment variable with type safety
 */
export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key]
  
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    
    if (isDevelopment()) {
      console.warn(`Missing environment variable: ${key}`)
    }
    
    return ''
  }
  
  return value
}

/**
 * Get required environment variable (throws if missing)
 */
export const getRequiredEnvVar = (key: string): string => {
  const value = process.env[key]
  
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  
  return value
}

/**
 * Environment-specific configuration
 */
export const config = {
  app: {
    name: getEnvVar('NEXT_PUBLIC_APP_NAME', 'My Next Template'),
    url: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  },
  
  api: {
    url: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:3001'),
    timeout: parseInt(getEnvVar('NEXT_PUBLIC_API_TIMEOUT', '30000'), 10),
  },
  
  features: {
    analytics: getEnvVar('NEXT_PUBLIC_ENABLE_ANALYTICS', 'false') === 'true',
    errorTracking: getEnvVar('NEXT_PUBLIC_ENABLE_ERROR_TRACKING', 'false') === 'true',
    pwa: getEnvVar('NEXT_PUBLIC_ENABLE_PWA', 'false') === 'true',
    i18n: getEnvVar('NEXT_PUBLIC_ENABLE_I18N', 'true') === 'true',
  },
  
  analytics: {
    gaId: getEnvVar('NEXT_PUBLIC_GA_ID'),
    gtagId: getEnvVar('NEXT_PUBLIC_GTAG_ID'),
  },
  
  sentry: {
    dsn: getEnvVar('NEXT_PUBLIC_SENTRY_DSN'),
    org: getEnvVar('SENTRY_ORG'),
    project: getEnvVar('SENTRY_PROJECT'),
  },
  
  emailjs: {
    serviceId: getEnvVar('NEXT_PUBLIC_EMAILJS_SERVICE_ID'),
    templateId: getEnvVar('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID'),
    publicKey: getEnvVar('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY'),
  },
  
  environment: getEnvironment(),
  isDevelopment: isDevelopment(),
  isStaging: isStaging(),
  isProduction: isProduction(),
  isClient: isClient(),
  isServer: isServer(),
} as const

/**
 * Log environment information (development only)
 */
export const logEnvironmentInfo = (): void => {
  if (!isDevelopment()) return
  
  console.group('🌍 Environment Information')
  console.log('Environment:', config.environment)
  console.log('App URL:', config.app.url)
  console.log('API URL:', config.api.url)
  console.log('Features:', config.features)
  console.groupEnd()
}

/**
 * Validate required environment variables
 */
export const validateEnvironment = (): void => {
  const requiredVars: string[] = []
  
  // Add required variables based on features
  if (config.features.analytics && !config.analytics.gaId) {
    requiredVars.push('NEXT_PUBLIC_GA_ID')
  }
  
  if (config.features.errorTracking && !config.sentry.dsn) {
    requiredVars.push('NEXT_PUBLIC_SENTRY_DSN')
  }
  
  if (requiredVars.length > 0) {
    const message = `Missing required environment variables: ${requiredVars.join(', ')}`
    
    if (isProduction()) {
      throw new Error(message)
    } else {
      console.warn(message)
    }
  }
}

export default config
