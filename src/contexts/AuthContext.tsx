import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import {
  signIn,
  signOut,
  signUp,
  confirmSignUp,
  getCurrentUser,
  fetchAuthSession,
  type SignInInput,
  type SignUpInput,
  type ConfirmSignUpInput,
} from 'aws-amplify/auth';
import type { UserProfile, UserRole, AuthState } from '@/types';

// ─── Context types ──────────────────────────────────────────────────────────────

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    input: SignUpInput
  ) => Promise<{ isSignUpComplete: boolean; nextStep: unknown }>;
  confirmRegistration: (input: ConfirmSignUpInput) => Promise<void>;
  refreshSession: () => Promise<void>;
}

// ─── Reducer ────────────────────────────────────────────────────────────────────

type AuthAction =
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isShopper: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER': {
      const groups = action.payload.groups;
      return {
        user: action.payload,
        isAuthenticated: true,
        isAdmin: groups.includes('Admin'),
        isShopper: groups.includes('Shopper'),
        isLoading: false,
      };
    }
    case 'CLEAR_USER':
      return { ...initialState, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Extract UserProfile from the current Cognito session.
 */
async function fetchUserProfile(): Promise<UserProfile> {
  const { username, signInDetails } = await getCurrentUser();
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken;

  const groups = ((idToken?.payload?.['cognito:groups'] as string[]) ??
    []) as UserRole[];

  const givenName = idToken?.payload?.['given_name'] as string | undefined;
  const familyName = idToken?.payload?.['family_name'] as string | undefined;
  const phoneNumber = idToken?.payload?.['phone_number'] as string | undefined;

  return {
    sub: username,
    email:
      signInDetails?.loginId ?? (idToken?.payload?.['email'] as string) ?? '',
    ...(givenName !== undefined && { givenName }),
    ...(familyName !== undefined && { familyName }),
    ...(phoneNumber !== undefined && { phoneNumber }),
    groups,
    emailVerified: (idToken?.payload?.['email_verified'] as boolean) ?? false,
  };
}

// ─── Provider ───────────────────────────────────────────────────────────────────

/**
 * AuthProvider — wraps the app with Cognito-backed authentication state.
 * Pattern from uwu-sri-lanka/website.
 *
 * Provides:
 * - login / logout / register / confirmRegistration / refreshSession
 * - user profile with Cognito group detection (isAdmin, isShopper)
 *
 * Usage:
 * ```tsx
 * <AuthProvider>
 *   <Component />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Hydrate session on mount
  useEffect(() => {
    const hydrate = async () => {
      try {
        const profile = await fetchUserProfile();
        dispatch({ type: 'SET_USER', payload: profile });
      } catch {
        dispatch({ type: 'CLEAR_USER' });
      }
    };
    hydrate();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const input: SignInInput = { username: email, password };
    await signIn(input);
    const profile = await fetchUserProfile();
    dispatch({ type: 'SET_USER', payload: profile });
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    dispatch({ type: 'CLEAR_USER' });
  }, []);

  const register = useCallback(async (input: SignUpInput) => {
    const result = await signUp(input);
    return {
      isSignUpComplete: result.isSignUpComplete,
      nextStep: result.nextStep,
    };
  }, []);

  const confirmRegistration = useCallback(async (input: ConfirmSignUpInput) => {
    await confirmSignUp(input);
  }, []);

  const refreshSession = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const profile = await fetchUserProfile();
      dispatch({ type: 'SET_USER', payload: profile });
    } catch {
      dispatch({ type: 'CLEAR_USER' });
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      register,
      confirmRegistration,
      refreshSession,
    }),
    [state, login, logout, register, confirmRegistration, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ───────────────────────────────────────────────────────────────────────

/**
 * Access auth state and actions.
 *
 * ```ts
 * const { user, isAdmin, login, logout } = useAuth();
 * ```
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
