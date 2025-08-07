/**
 * 🛡️ PROTECTION SUITE TEST SETUP
 * 
 * Setup file for component protection tests.
 * Configures testing environment for React component testing.
 */

import '@testing-library/jest-dom';
import 'jest-environment-jsdom';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  },
}));

// Mock Next.js Router
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  basePath: '',
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Clerk authentication
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    isSignedIn: true,
    user: {
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      primaryEmailAddress: {
        emailAddress: 'test@example.com',
      },
      publicMetadata: {
        role: 'consultant',
        organizationId: 'test-org-id',
      },
    },
  }),
  useAuth: () => ({
    isSignedIn: true,
    userId: 'test-user-id',
    sessionId: 'test-session-id',
    orgId: 'test-org-id',
    orgRole: 'org:member',
    getToken: jest.fn().mockResolvedValue('test-token'),
  }),
  useOrganization: () => ({
    organization: {
      id: 'test-org-id',
      name: 'Test Organization',
    },
    isLoaded: true,
  }),
  ClerkProvider: ({ children }: any) => children,
  SignIn: () => <div>Mock SignIn</div>,
  SignUp: () => <div>Mock SignUp</div>,
}));

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL = 'http://localhost:8080/v1/graphql';
process.env.HASURA_GRAPHQL_ADMIN_SECRET = 'test-admin-secret';

// Mock Window.matchMedia (for responsive components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver (for responsive components)
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

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 120,
  height: 120,
  top: 0,
  left: 0,
  bottom: 120,
  right: 120,
  x: 0,
  y: 0,
  toJSON: jest.fn(),
}));

// Mock DragEvent for drag and drop testing
global.DragEvent = class extends Event {
  constructor(type: string, eventInitDict?: DragEventInit) {
    super(type, eventInitDict);
    this.dataTransfer = eventInitDict?.dataTransfer || {
      dropEffect: 'none',
      effectAllowed: 'all',
      files: [] as any,
      items: [] as any,
      types: [],
      clearData: jest.fn(),
      getData: jest.fn(),
      setData: jest.fn(),
      setDragImage: jest.fn(),
    };
  }
  dataTransfer: DataTransfer;
};

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockResolvedValue(undefined),
    readText: jest.fn().mockResolvedValue(''),
  },
});

// Console protection - fail tests on console errors
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  // Suppress known warnings in test environment
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    
    // Allow certain expected warnings/errors
    const allowedPatterns = [
      'Warning: ReactDOM.render is deprecated',
      'Warning: React.FC is deprecated',
      'Warning: Function components cannot be given refs',
      'Failed to load resource', // Network errors in tests
      'NetworkError', // Apollo Client network errors
    ];
    
    const isAllowed = allowedPatterns.some(pattern => 
      message.includes(pattern)
    );
    
    if (!isAllowed) {
      originalError(...args);
      throw new Error(`Test failed due to console.error: ${message}`);
    }
  };
  
  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    
    // Allow certain warnings
    const allowedWarnings = [
      'componentWillReceiveProps has been renamed',
      'componentWillMount has been renamed',
      'deprecated', // General deprecation warnings
    ];
    
    const isAllowed = allowedWarnings.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (!isAllowed) {
      originalWarn(...args);
    }
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Global test utilities
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(min: number, max: number): R;
    }
  }
}

// Custom matchers
expect.extend({
  toBeWithinRange(received: number, min: number, max: number) {
    const pass = received >= min && received <= max;
    return {
      pass,
      message: () =>
        pass
          ? `Expected ${received} not to be within range ${min} - ${max}`
          : `Expected ${received} to be within range ${min} - ${max}`,
    };
  },
});

// Increase timeout for protection tests
jest.setTimeout(30000);

console.log('🛡️ Protection test suite setup complete');