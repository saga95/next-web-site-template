import '@/styles/globals.css';
import '@aws-amplify/ui-react/styles.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Amplify } from 'aws-amplify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ToastProvider } from '@/components/Toast';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { RBACProvider } from '@/contexts/RBACContext';
import { resolveProfileFromCognitoGroups } from '@/rbac';
import '@/lib/i18n'; // Initialize i18n
export { reportWebVitals } from '@/lib/webVitals';

// ─── Amplify Provider ──────────────────────────────────────────────────────────

function AmplifyProvider({ children }: { children: React.ReactNode }) {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const configureAmplify = async () => {
      try {
        const outputs = await import('../../amplify_outputs.json');
        Amplify.configure(outputs.default);
        setIsConfigured(true);
      } catch {
        // In development without sandbox, continue without Amplify
        console.warn(
          'Amplify outputs not found. Running without backend configuration.'
        );
        setIsConfigured(true);
      }
    };

    configureAmplify();
  }, []);

  if (!isConfigured) {
    return null;
  }

  return <>{children}</>;
}

// ─── Auth → RBAC Bridge ────────────────────────────────────────────────────────

/**
 * Reads the authenticated user's Cognito groups and maps them to the
 * appropriate RBAC profile, providing entitlements to the whole subtree.
 * When no user is logged in, an empty entitlement set is provided.
 */
function AuthenticatedRBACProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const profile = user
    ? resolveProfileFromCognitoGroups(user.groups) ?? undefined
    : undefined;

  return <RBACProvider profile={profile}>{children}</RBACProvider>;
}

// ─── React Query Client ────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 3,
      retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// ─── App Component ─────────────────────────────────────────────────────────────

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Track page views (integrate with your analytics provider)
  useEffect(() => {
    const handleRouteChange = (_url: string) => {
      // Analytics tracking placeholder
      // Example: trackPageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <ErrorBoundary>
      <AmplifyProvider>
        <AuthProvider>
          <AuthenticatedRBACProvider>
            <QueryClientProvider client={queryClient}>
              <ToastProvider>
                <a href="#main-content" className="skip-link">
                  Skip to main content
                </a>
                <Component {...pageProps} />
              </ToastProvider>
            </QueryClientProvider>
          </AuthenticatedRBACProvider>
        </AuthProvider>
      </AmplifyProvider>
    </ErrorBoundary>
  );
}
