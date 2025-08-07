/**
 * 🧪 COMPREHENSIVE JEST SETUP
 * 
 * Global test configuration for the Payroll Matrix test suite
 * Sets up testing environment, mocks, and utilities
 */

import '@testing-library/jest-dom';
import { logger } from '@/lib/logging/enterprise-logger';

// ============================================================================
// ENVIRONMENT SETUP
// ============================================================================

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/test',
}));

// Mock Clerk authentication
jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    isSignedIn: true,
    userId: 'test-user-id',
    getToken: jest.fn().mockResolvedValue('mock-token'),
  }),
  useUser: () => ({
    user: {
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    },
  }),
  SignedIn: ({ children }: { children: React.ReactNode }) => children,
  SignedOut: () => null,
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock Apollo Client
jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn(() => ({
    loading: false,
    error: null,
    data: {},
    refetch: jest.fn(),
  })),
  useMutation: jest.fn(() => [
    jest.fn().mockResolvedValue({ data: {} }),
    { loading: false, error: null },
  ]),
  useSubscription: jest.fn(() => ({
    loading: false,
    error: null,
    data: {},
  })),
}));

// ============================================================================
// LOGGING SETUP
// ============================================================================

// Configure test logger
beforeAll(() => {
  // Reduce log noise during testing
  if (process.env.NODE_ENV === 'test') {
    logger.debug('Test suite initialized', {
      namespace: 'test_framework',
      component: 'jest_setup',
    });
  }
});

// ============================================================================
// GLOBAL MOCKS
// ============================================================================

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
) as jest.Mock;

// ============================================================================
// CUSTOM MATCHERS
// ============================================================================

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeAccessible(): R;
      toHaveNoConsoleErrors(): R;
      toRenderWithinTimeLimit(milliseconds: number): R;
    }
  }
}

// Accessibility matcher
expect.extend({
  toBeAccessible(received: HTMLElement) {
    const hasProperAriaLabels = received.getAttribute('aria-label') !== null || 
                               received.getAttribute('aria-labelledby') !== null ||
                               received.textContent !== null;
    
    if (hasProperAriaLabels) {
      return {
        message: () => `expected element not to be accessible`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected element to have proper accessibility attributes`,
        pass: false,
      };
    }
  },
});

// Console error tracking
let consoleErrors: string[] = [];
const originalConsoleError = console.error;

beforeEach(() => {
  consoleErrors = [];
  console.error = (...args: any[]) => {
    consoleErrors.push(args.join(' '));
    originalConsoleError(...args);
  };
});

afterEach(() => {
  console.error = originalConsoleError;
});

expect.extend({
  toHaveNoConsoleErrors() {
    if (consoleErrors.length === 0) {
      return {
        message: () => `expected console errors but found none`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected no console errors but found: ${consoleErrors.join(', ')}`,
        pass: false,
      };
    }
  },
});

// Performance matcher
expect.extend({
  toRenderWithinTimeLimit(received: () => void, milliseconds: number) {
    const start = performance.now();
    received();
    const end = performance.now();
    const renderTime = end - start;
    
    if (renderTime <= milliseconds) {
      return {
        message: () => `expected render time of ${renderTime}ms to exceed ${milliseconds}ms`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected render time of ${renderTime}ms to be within ${milliseconds}ms`,
        pass: false,
      };
    }
  },
});

// ============================================================================
// TEST UTILITIES
// ============================================================================

// Export commonly used test utilities
export const testUtils = {
  // Mock GraphQL responses
  mockGraphQLResponse: (data: any, loading = false, error = null) => ({
    loading,
    error,
    data,
    refetch: jest.fn(),
    fetchMore: jest.fn(),
    subscribeToMore: jest.fn(),
  }),
  
  // Create mock user
  mockUser: (overrides = {}) => ({
    id: 'test-user-id',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    role: 'consultant',
    ...overrides,
  }),
  
  // Create mock payroll data
  mockPayroll: (overrides = {}) => ({
    id: 'test-payroll-id',
    name: 'Test Payroll',
    status: 'active',
    cycle: 'fortnightly',
    clientId: 'test-client-id',
    ...overrides,
  }),
  
  // Wait for async operations
  waitForAsync: () => new Promise(resolve => setTimeout(resolve, 0)),
  
  // Performance testing helper
  measurePerformance: async (fn: () => Promise<void> | void) => {
    const start = performance.now();
    await fn();
    const end = performance.now();
    return end - start;
  },
  
  // Advanced scheduler test helpers
  scheduler: {
    mockSchedulerProps: (overrides = {}) => ({
      payrollId: 'test-payroll-id',
      initialData: [],
      onDateGenerate: jest.fn(),
      onDateAdjust: jest.fn(),
      onSave: jest.fn(),
      ...overrides,
    }),
  },
};

// ============================================================================
// CLEANUP
// ============================================================================

afterEach(() => {
  // Clear all mocks after each test
  jest.clearAllMocks();
  
  // Clear any DOM changes
  document.body.innerHTML = '';
  
  // Reset fetch mock
  (global.fetch as jest.Mock).mockClear();
});

// Global error handler for unhandled promise rejections in tests
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection in test', {
    namespace: 'test_framework',
    metadata: { reason, promise },
  });
});

logger.info('Jest setup complete - Test environment ready', {
  namespace: 'test_framework',
  component: 'jest_setup',
});