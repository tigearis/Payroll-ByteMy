// Storage state paths for authenticated sessions
export const STORAGE_STATE_DEVELOPER = 'e2e/fixtures/.auth/developer.json';
export const STORAGE_STATE_ORG_ADMIN = 'e2e/fixtures/.auth/org-admin.json';
export const STORAGE_STATE_MANAGER = 'e2e/fixtures/.auth/manager.json';
export const STORAGE_STATE_CONSULTANT = 'e2e/fixtures/.auth/consultant.json';
export const STORAGE_STATE_VIEWER = 'e2e/fixtures/.auth/viewer.json';

// Role hierarchy levels for testing
export const ROLE_LEVELS = {
  developer: 5,
  org_admin: 4,
  manager: 3,
  consultant: 2,
  viewer: 1,
} as const;

// Routes that should be accessible by different roles
export const PROTECTED_ROUTES = {
  // Routes accessible by all authenticated users
  dashboard: '/dashboard',
  
  // Developer-only routes
  developer: [
    '/developer',
  ],
  
  // Org admin and above
  admin: [
    '/settings',
    '/users',
    '/billing',
  ],
  
  // Manager and above
  management: [
    '/payrolls',
    '/clients',
    '/reports',
  ],
  
  // Consultant and above
  operational: [
    '/payroll/view',
    '/client/view',
  ],
  
  // Viewer (read-only)
  readonly: [
    '/dashboard',
  ],
} as const;

// Test data selectors
export const TEST_SELECTORS = {
  // Authentication
  signInForm: 'form',
  emailInput: 'input[name="email"]',
  passwordInput: 'input[name="password"]',
  signInButton: 'button[type="submit"]',
  signOutButton: '[data-testid="sign-out-button"]',
  userMenu: '[data-testid="user-menu"]',
  
  // Navigation
  sidebar: '[data-testid="sidebar"]',
  mainContent: '[data-testid="main-content"]',
  
  // Role-specific elements
  developerPanel: '[data-testid="developer-panel"]',
  adminSettings: '[data-testid="admin-settings"]',
  payrollActions: '[data-testid="payroll-actions"]',
  
  // Error states
  accessDenied: '[data-testid="access-denied"]',
  notFound: '[data-testid="not-found"]',
  errorMessage: '[data-testid="error-message"]',
} as const;

// GraphQL operation names to test
export const GRAPHQL_OPERATIONS = {
  // User operations
  GET_CURRENT_USER: 'GetCurrentUser',
  UPDATE_USER_ROLE: 'UpdateUserRole',
  
  // Payroll operations
  GET_PAYROLLS: 'GetPayrolls',
  CREATE_PAYROLL: 'CreatePayroll',
  UPDATE_PAYROLL: 'UpdatePayroll',
  DELETE_PAYROLL: 'DeletePayroll',
  
  // Client operations
  GET_CLIENTS: 'GetClients',
  CREATE_CLIENT: 'CreateClient',
  UPDATE_CLIENT: 'UpdateClient',
  DELETE_CLIENT: 'DeleteClient',
  
  // Staff operations
  GET_STAFF: 'GetStaff',
  CREATE_STAFF: 'CreateStaff',
  UPDATE_STAFF: 'UpdateStaff',
  DELETE_STAFF: 'DeleteStaff',
  
  // Admin operations
  GET_SETTINGS: 'GetSettings',
  UPDATE_SETTINGS: 'UpdateSettings',
  GET_AUDIT_LOGS: 'GetAuditLogs',
} as const;