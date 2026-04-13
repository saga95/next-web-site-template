/**
 * Safe localStorage / sessionStorage wrappers.
 *
 * Handles environments where storage is unavailable:
 * - Firefox Enhanced Tracking Protection (throws SecurityError)
 * - Private/incognito mode in some browsers
 * - Server-side rendering (no `window`)
 *
 * Also includes cross-tab logout listener for auth flows.
 */

const isBrowser = typeof window !== 'undefined';

// ── localStorage wrappers ────────────────────────────────

export function getItem(key: string): string | null {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setItem(key: string, value: string): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Quota exceeded or storage blocked — fail silently
  }
}

export function removeItem(key: string): void {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Storage blocked — fail silently
  }
}

// ── sessionStorage wrappers ──────────────────────────────

export function getSessionItem(key: string): string | null {
  if (!isBrowser) return null;
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setSessionItem(key: string, value: string): void {
  if (!isBrowser) return;
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Quota exceeded or storage blocked
  }
}

export function removeSessionItem(key: string): void {
  if (!isBrowser) return;
  try {
    sessionStorage.removeItem(key);
  } catch {
    // Storage blocked
  }
}

// ── JSON helpers ─────────────────────────────────────────

export function getJsonItem<T>(key: string, fallback: T): T {
  const raw = getItem(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setJsonItem<T>(key: string, value: T): void {
  setItem(key, JSON.stringify(value));
}

// ── Cross-tab logout ─────────────────────────────────────

const LOGOUT_EVENT_KEY = '__logout__';

/**
 * Broadcast a logout event to all other tabs.
 * Call this when the user explicitly logs out.
 */
export function broadcastLogout(): void {
  setItem(LOGOUT_EVENT_KEY, Date.now().toString());
  removeItem(LOGOUT_EVENT_KEY);
}

/**
 * Listen for logout events from other tabs.
 * Returns a cleanup function.
 *
 * @example
 * ```ts
 * useEffect(() => {
 *   return onCrossTabLogout(() => {
 *     signOut();
 *     router.push('/auth/login');
 *   });
 * }, []);
 * ```
 */
export function onCrossTabLogout(callback: () => void): () => void {
  if (!isBrowser) return () => {};

  const handler = (event: StorageEvent) => {
    if (event.key === LOGOUT_EVENT_KEY) {
      callback();
    }
  };

  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}
