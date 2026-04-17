import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ErrorBoundary, {
  AppErrorBoundary,
  RootErrorBoundary,
  RouteErrorBoundary,
} from '../ErrorBoundary';

// Suppress console.error for expected errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
  // Suppress jsdom "Error: Uncaught" for error boundary tests
  window.addEventListener('error', e => e.preventDefault());
});
afterAll(() => {
  console.error = originalError;
});

function ThrowingComponent({ error }: { error?: Error }) {
  if (error) throw error;
  return <div>No error</div>;
}

describe('ErrorBoundary', () => {
  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Safe content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('should render fallback on error', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent error={new Error('boom')} />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should render custom fallback', () => {
    render(
      <ErrorBoundary fallback={<div>Custom error UI</div>}>
        <ThrowingComponent error={new Error('boom')} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom error UI')).toBeInTheDocument();
  });

  it('should recover when Try again is clicked', async () => {
    const user = userEvent.setup();

    let shouldThrow = true;
    function Conditional() {
      if (shouldThrow) throw new Error('boom');
      return <div>Recovered</div>;
    }

    render(
      <ErrorBoundary>
        <Conditional />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    shouldThrow = false;
    await user.click(screen.getByText('Try again'));

    expect(screen.getByText('Recovered')).toBeInTheDocument();
  });

  it('should call onError callback', () => {
    const onError = jest.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowingComponent error={new Error('reported')} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'reported' }),
      expect.objectContaining({ componentStack: expect.any(String) })
    );
  });
});

describe('RootErrorBoundary', () => {
  it('should show fullscreen fallback on error', () => {
    render(
      <RootErrorBoundary>
        <ThrowingComponent error={new Error('root crash')} />
      </RootErrorBoundary>
    );
    expect(screen.getByText('Application Error')).toBeInTheDocument();
  });
});

describe('AppErrorBoundary', () => {
  it('should catch errors at app level', () => {
    render(
      <AppErrorBoundary>
        <ThrowingComponent error={new Error('app crash')} />
      </AppErrorBoundary>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

describe('RouteErrorBoundary', () => {
  it('should catch errors at route level', () => {
    render(
      <RouteErrorBoundary>
        <ThrowingComponent error={new Error('route crash')} />
      </RouteErrorBoundary>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
