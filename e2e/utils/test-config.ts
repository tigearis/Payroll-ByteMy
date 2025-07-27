// Storage state paths for authenticated sessions
export const STORAGE_STATE_DEVELOPER = 'playwright/.auth/developer.json';
export const STORAGE_STATE_ORG_ADMIN = 'playwright/.auth/orgadmin.json';
export const STORAGE_STATE_ADMIN = 'playwright/.auth/admin.json';
export const STORAGE_STATE_MANAGER = 'playwright/.auth/manager.json';
export const STORAGE_STATE_CONSULTANT = 'playwright/.auth/consultant.json';
export const STORAGE_STATE_VIEWER = 'playwright/.auth/viewer.json';

// Test users configuration - matches your validated database users
export const TEST_USERS = {
  admin: {
    email: process.env.E2E_ORG_ADMIN_EMAIL || 'admin@example.com',
    password: process.env.E2E_ORG_ADMIN_PASSWORD || 'Admin1',
    role: 'org_admin',
    description: 'Admin user with full system access',
    expectedPermissions: ['all']
  },
  manager: {
    email: process.env.E2E_MANAGER_EMAIL || 'manager@example.com',
    password: process.env.E2E_MANAGER_PASSWORD || 'Manager1',
    role: 'manager',
    description: 'Manager user with team management access',
    expectedPermissions: ['users.read', 'payrolls.manage', 'clients.manage']
  },
  consultant: {
    email: process.env.E2E_CONSULTANT_EMAIL || 'consultant@example.com',
    password: process.env.E2E_CONSULTANT_PASSWORD || 'Consultant1',
    role: 'consultant',
    description: 'Consultant user with operational access',
    expectedPermissions: ['payrolls.read', 'clients.read', 'work-schedule.manage']
  },
  viewer: {
    email: process.env.E2E_VIEWER_EMAIL || 'viewer@example.com',
    password: process.env.E2E_VIEWER_PASSWORD || 'Viewer1',
    role: 'viewer',
    description: 'Viewer user with read-only access',
    expectedPermissions: ['read-only']
  }
};

// Role hierarchy levels for testing
export const ROLE_LEVELS = {
  developer: 5,
  org_admin: 4,
  manager: 3,
  consultant: 2,
  viewer: 1,
} as const;

// Page access configuration by role
export const ROLE_PAGE_ACCESS = {
  admin: {
    allowed: [
      '/dashboard', '/staff', '/payrolls', '/clients', '/billing', 
      '/work-schedule', '/email', '/leave', '/admin', '/security',
      '/settings', '/reports', '/invitations', '/developer'
    ],
    forbidden: []
  },
  manager: {
    allowed: [
      '/dashboard', '/staff', '/payrolls', '/clients', '/billing',
      '/work-schedule', '/email', '/leave', '/reports'
    ],
    forbidden: ['/admin', '/security', '/invitations', '/developer']
  },
  consultant: {
    allowed: [
      '/dashboard', '/payrolls', '/clients', '/work-schedule', '/email'
    ],
    forbidden: ['/staff', '/billing', '/admin', '/security', '/invitations', '/leave', '/developer']
  },
  viewer: {
    allowed: ['/dashboard'],
    forbidden: [
      '/staff', '/payrolls', '/clients', '/billing', '/work-schedule',
      '/email', '/leave', '/admin', '/security', '/invitations', '/reports', '/developer'
    ]
  }
} as const;

// Test data selectors for consistent element identification
export const TEST_SELECTORS = {
  // Authentication
  emailInput: 'input[name="email"], input[type="email"], input[name="identifier"]',
  passwordInput: 'input[name="password"], input[type="password"]',
  signInButton: 'button[type="submit"], button:has-text("Sign in"), button:has-text("Continue")',
  signOutButton: 'button:has-text("Sign out"), button:has-text("Logout")',
  
  // Navigation
  navigation: 'nav, [role="navigation"]',
  sidebar: '[data-testid="sidebar"], aside, .sidebar',
  userMenu: '[data-testid="user-menu"], .user-menu',
  
  // Common page elements
  pageTitle: 'h1, [data-testid="page-title"]',
  mainContent: 'main, [role="main"], .main-content',
  loadingSpinner: '[data-testid="loading"], .loading, .spinner',
  errorMessage: '[data-testid="error"], .error, .alert-error',
  
  // Data tables
  dataTable: 'table, [data-testid="data-table"], .table',
  tableRow: 'tr, [data-testid="table-row"]',
  emptyState: '[data-testid="empty-state"], .empty-state, .no-data',
  
  // Forms
  submitButton: 'button[type="submit"], [data-testid="submit"]',
  cancelButton: 'button:has-text("Cancel"), [data-testid="cancel"]',
  
  // Domain-specific selectors
  domains: {
    staff: {
      staffTable: '[data-testid="staff-table"], table:has(th:has-text("Name"))',
      addStaffButton: '[data-testid="add-staff"], button:has-text("Add Staff")',
      staffRow: '[data-testid="staff-row"], tr:has(td)',
    },
    payrolls: {
      payrollTable: '[data-testid="payroll-table"], table:has(th:has-text("Payroll"))',
      createPayrollButton: '[data-testid="create-payroll"], button:has-text("Create Payroll")',
      payrollStatus: '[data-testid="payroll-status"]',
    },
    clients: {
      clientTable: '[data-testid="client-table"], table:has(th:has-text("Client"))',
      addClientButton: '[data-testid="add-client"], button:has-text("Add Client")',
      clientRow: '[data-testid="client-row"], tr:has(td)',
    },
    billing: {
      invoiceTable: '[data-testid="invoice-table"], table:has(th:has-text("Invoice"))',
      generateInvoiceButton: '[data-testid="generate-invoice"], button:has-text("Generate")',
      billingAmount: '[data-testid="billing-amount"]',
    }
  }
} as const;

// Test timeouts
export const TIMEOUTS = {
  short: 5000,
  medium: 10000,
  long: 30000,
  authentication: 45000,
  pageLoad: 30000,
  dataLoad: 15000
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