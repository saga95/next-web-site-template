// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// ─── Block unmocked network requests ────────────────────────────────────────────
const originalFetch = global.fetch;
global.fetch = jest.fn((...args: Parameters<typeof fetch>) => {
  const url =
    typeof args[0] === 'string'
      ? args[0]
      : ((args[0] as Request)?.url ?? 'unknown');
  throw new Error(
    `Unmocked fetch call to: ${url}\n` +
      'All network requests must be mocked in tests. Use jest.spyOn(global, "fetch") to mock this call.'
  );
}) as typeof fetch;

// Provide escape hatch for integration tests that explicitly need fetch
export { originalFetch };

// ─── Mock localStorage and sessionStorage ───────────────────────────────────────
function createStorageMock(): Storage {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] ?? null),
  };
}

Object.defineProperty(window, 'localStorage', {
  value: createStorageMock(),
  writable: true,
});
Object.defineProperty(window, 'sessionStorage', {
  value: createStorageMock(),
  writable: true,
});

// Mock Next.js router
jest.mock('next/router', () => require('next-router-mock'));

// Mock i18next for tests
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
    },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

// Mock Material UI theme
jest.mock('@mui/material/styles', () => ({
  ...jest.requireActual('@mui/material/styles'),
  useTheme: () => ({
    palette: {
      mode: 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
    },
    breakpoints: {
      up: jest.fn(),
      down: jest.fn(),
    },
  }),
}));

// Suppress console warnings in tests (optional)
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};
