import React, { Component, ErrorInfo } from 'react';
import { logger } from '@/lib/logger';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /** Boundary level for structured logging. */
  level?: 'root' | 'app' | 'route';
  /** Called when an error is caught — use for external reporting (e.g. Sentry). */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const level = this.props.level ?? 'app';
    logger.error(`[ErrorBoundary:${level}] Uncaught error`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      level,
    });
    this.props.onError?.(error, errorInfo);
  }

  override render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role='alert'
          style={{
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h2>Something went wrong</h2>
          <p>Please try refreshing the page.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '0.5rem 1rem',
              marginTop: '1rem',
              cursor: 'pointer',
              border: '1px solid #ccc',
              borderRadius: '4px',
              background: 'transparent',
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// ─── Layered convenience wrappers ───────────────────────────────────────────────

/**
 * Root-level boundary — catches catastrophic failures (broken providers, etc.).
 * Shows a minimal fullscreen message because nothing else can be trusted.
 */
export function RootErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      level='root'
      fallback={
        <div
          role='alert'
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            fontFamily: 'system-ui, sans-serif',
            textAlign: 'center',
            padding: '2rem',
          }}
        >
          <div>
            <h1>Application Error</h1>
            <p>Something unexpected happened. Please refresh the page.</p>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * App-level boundary — wraps providers and layout.
 * Can retry because the shell is still intact.
 */
export function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary level='app'>{children}</ErrorBoundary>;
}

/**
 * Route-level boundary — wraps individual pages.
 * Users can retry or navigate away without losing the full app shell.
 */
export function RouteErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ErrorBoundary level='route'>{children}</ErrorBoundary>;
}
