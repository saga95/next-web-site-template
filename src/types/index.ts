// Common utility types
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Required<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};

export type Nullable<T> = T | null;

export type NonNullable<T> = T extends null | undefined ? never : T;

// API Response Types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form Types
export interface FormFieldError {
  message: string;
  type: string;
}

export interface FormState<T = Record<string, unknown>> {
  data: T;
  errors: Record<keyof T, FormFieldError | undefined>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  touchedFields: Record<keyof T, boolean>;
}

// UI Component Types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface InputProps extends ComponentProps {
  type?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  hint?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  muted: string;
  accent: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
}

export interface Theme {
  colors: ThemeColors;
  radius: string;
  fontFamily: {
    sans: string[];
    mono: string[];
  };
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
}

export interface Breadcrumb {
  title: string;
  href?: string;
  current?: boolean;
}

// Content Types
export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  siteName?: string;
  locale?: string;
  alternateLocales?: string[];
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

// Performance Types
export interface WebVitals {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
}

export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  inp?: number; // Interaction to Next Paint
}

// Error Types
export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: string;
  eventId?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
}

// Analytics Types
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: string;
  userId?: string;
  sessionId?: string;
}

export interface PageView {
  path: string;
  title: string;
  referrer?: string;
  timestamp: string;
  userId?: string;
  sessionId: string;
}

// Search Types
export interface SearchResult<T = unknown> {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: string;
  relevance: number;
  data: T;
}

export interface SearchOptions {
  query: string;
  filters?: Record<string, unknown>;
  sort?: string;
  limit?: number;
  offset?: number;
}

// File Types
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
}

// Configuration Types
export interface AppConfig {
  app: {
    name: string;
    version: string;
    description: string;
    url: string;
    environment: 'development' | 'staging' | 'production';
  };
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  features: {
    analytics: boolean;
    errorTracking: boolean;
    performanceMonitoring: boolean;
    authentication: boolean;
    notifications: boolean;
  };
  external: {
    sentry?: {
      dsn: string;
      environment: string;
    };
    analytics?: {
      googleAnalyticsId?: string;
      segment?: {
        writeKey: string;
      };
    };
  };
}

// Internationalization Types
export interface Locale {
  code: string;
  name: string;
  flag: string;
  rtl?: boolean;
}

export interface TranslationNamespace {
  [key: string]: string | TranslationNamespace;
}

export interface TranslationParams {
  [key: string]: string | number;
}

// State Management Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

// Utility Types for React
export type ComponentWithChildren<P = {}> = React.FC<P & { children: React.ReactNode }>;

export type ComponentPropsWithoutRef<T extends React.ElementType> = React.ComponentPropsWithoutRef<T>;

export type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref'];

export type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & { as?: C }> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof Props>;

export type PolymorphicComponentPropWithRef<
  C extends React.ElementType,
  Props = {}
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };

// Event Types
export type KeyboardEventHandler = (event: React.KeyboardEvent) => void;
export type MouseEventHandler = (event: React.MouseEvent) => void;
export type ChangeEventHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;
export type FocusEventHandler = (event: React.FocusEvent) => void;