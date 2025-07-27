// lib/config/loading-messages.ts
export interface LoadingMessage {
  title: string;
  description: string;
}

export interface LoadingConfig {
  routes: Record<string, LoadingMessage>;
  queries: Record<string, LoadingMessage>;
  components: Record<string, LoadingMessage>;
  actions: Record<string, LoadingMessage>;
  defaults: {
    page: LoadingMessage;
    component: LoadingMessage;
    query: LoadingMessage;
    mutation: LoadingMessage;
  };
}

export const LOADING_MESSAGES: LoadingConfig = {
  // Route-based loading messages
  routes: {
    "/dashboard": {
      title: "Loading Dashboard...",
      description: "Getting your overview and recent activity",
    },
    "/payrolls": {
      title: "Loading Payrolls...",
      description: "Getting payroll data and schedules",
    },
    "/payrolls/[id]": {
      title: "Loading Payroll Details...",
      description: "Getting comprehensive payroll information",
    },
    "/payrolls/new": {
      title: "Initializing Payroll Setup...",
      description: "Preparing payroll creation form",
    },
    "/clients": {
      title: "Loading Clients...",
      description: "Fetching client information and settings",
    },
    "/clients/[id]": {
      title: "Loading Client Details...",
      description: "Getting comprehensive client information",
    },
    "/clients/new": {
      title: "Initializing Client Setup...",
      description: "Preparing client creation form",
    },
    "/staff": {
      title: "Loading Staff...",
      description: "Retrieving staff information and roles",
    },
    "/invitations": {
      title: "Loading Invitations...",
      description: "Fetching invitation status and history",
    },
    "/settings": {
      title: "Loading Settings...",
      description: "Getting account preferences and configuration",
    },
    "/settings/account": {
      title: "Loading Account Settings...",
      description: "Getting your account information and preferences",
    },
    "/profile": {
      title: "Loading Profile...",
      description: "Getting your profile information",
    },
    "/payroll-schedule": {
      title: "Loading Payroll Schedule...",
      description: "Getting schedule configuration and dates",
    },
  },

  // GraphQL query-based loading messages
  queries: {
    GetPayrollById: {
      title: "Loading Payroll...",
      description: "Fetching payroll details and configuration",
    },
    GetPayrollForEdit: {
      title: "Loading Payroll Editor...",
      description: "Preparing payroll for editing",
    },
    GetPayrolls: {
      title: "Loading Payrolls...",
      description: "Fetching payroll list and summaries",
    },
    GetPayrollDashboardStats: {
      title: "Loading Payroll Statistics...",
      description: "Calculating payroll metrics and summaries",
    },
    GetPayrollDates: {
      title: "Loading Payroll Dates...",
      description: "Fetching schedule dates and processing timeline",
    },
    GetAllClients: {
      title: "Loading Clients...",
      description: "Fetching client list and information",
    },
    GetClientById: {
      title: "Loading Client...",
      description: "Fetching client details and settings",
    },
    GetClientDashboardStats: {
      title: "Loading Client Statistics...",
      description: "Calculating client metrics and summaries",
    },
    GetAllUsers: {
      title: "Loading Users...",
      description: "Fetching user accounts and permissions",
    },
    GetAllUsersWithRoles: {
      title: "Loading Staff Members...",
      description: "Fetching staff information and role assignments",
    },
    GetAllUsersList: {
      title: "Loading User Directory...",
      description: "Fetching user list for assignments",
    },
    GetInvitations: {
      title: "Loading Invitations...",
      description: "Fetching invitation status and details",
    },
    GetCurrentUser: {
      title: "Loading Profile...",
      description: "Getting your account information",
    },
    GetPayrollCycles: {
      title: "Loading Payroll Cycles...",
      description: "Fetching available payroll frequency options",
    },
    GetPayrollDateTypes: {
      title: "Loading Date Types...",
      description: "Fetching payroll date configuration options",
    },
  },

  // Component-based loading messages
  components: {
    PayrollsTable: {
      title: "Loading Payrolls...",
      description: "Preparing payroll data table",
    },
    PayrollsTableUnified: {
      title: "Loading Payrolls...",
      description: "Preparing comprehensive payroll view",
    },
    PayrollDetailsCard: {
      title: "Loading Payroll Details...",
      description: "Fetching payroll information",
    },
    ClientsTable: {
      title: "Loading Clients...",
      description: "Preparing client data table",
    },
    UsersTable: {
      title: "Loading Users...",
      description: "Preparing user data table",
    },
    UsersTableUnified: {
      title: "Loading Staff...",
      description: "Preparing staff management interface",
    },
    StaffManagementContent: {
      title: "Loading Staff Management...",
      description: "Preparing staff administration tools",
    },
    UserTable: {
      title: "Loading User Directory...",
      description: "Preparing user information table",
    },
    InvitationManagementTable: {
      title: "Loading Invitations...",
      description: "Preparing invitation management interface",
    },
    PayrollSchedule: {
      title: "Loading Schedule...",
      description: "Preparing payroll schedule configuration",
    },
    AdvancedPayrollScheduler: {
      title: "Loading Scheduler...",
      description: "Preparing advanced scheduling interface",
    },
    PayrollDatesView: {
      title: "Loading Payroll Dates...",
      description: "Preparing date management interface",
    },
    PayrollVersionHistory: {
      title: "Loading Version History...",
      description: "Fetching payroll change history",
    },
    NotesListWithAdd: {
      title: "Loading Notes...",
      description: "Fetching notes and comments",
    },
  },

  // Action-based loading messages (for mutations and operations)
  actions: {
    creating_payroll: {
      title: "Creating Payroll...",
      description: "Setting up new payroll configuration",
    },
    updating_payroll: {
      title: "Updating Payroll...",
      description: "Saving payroll changes",
    },
    deleting_payroll: {
      title: "Deleting Payroll...",
      description: "Removing payroll and associated data",
    },
    creating_client: {
      title: "Creating Client...",
      description: "Setting up new client account",
    },
    updating_client: {
      title: "Updating Client...",
      description: "Saving client changes",
    },
    creating_user: {
      title: "Creating User...",
      description: "Setting up new user account",
    },
    updating_user: {
      title: "Updating User...",
      description: "Saving user changes",
    },
    sending_invitation: {
      title: "Sending Invitation...",
      description: "Processing invitation delivery",
    },
    resending_invitation: {
      title: "Resending Invitation...",
      description: "Processing invitation resend",
    },
    accepting_invitation: {
      title: "Accepting Invitation...",
      description: "Completing account setup",
    },
    generating_dates: {
      title: "Generating Payroll Dates...",
      description: "Calculating payroll schedule dates",
    },
    syncing_user: {
      title: "Syncing User Data...",
      description: "Updating user information across systems",
    },
    exportingdata: {
      title: "Exporting Data...",
      description: "Preparing data export file",
    },
    importingdata: {
      title: "Importing Data...",
      description: "Processing data import",
    },
  },

  // Default fallback messages
  defaults: {
    page: {
      title: "Loading...",
      description: "Please wait while we fetch your data",
    },
    component: {
      title: "Loading Component...",
      description: "Preparing interface elements",
    },
    query: {
      title: "Loading Data...",
      description: "Fetching information from database",
    },
    mutation: {
      title: "Processing...",
      description: "Saving your changes",
    },
  },
};

// Utility functions for smart loading message detection
export function getRouteLoadingMessage(pathname: string): LoadingMessage {
  // Try exact match first
  if (LOADING_MESSAGES.routes[pathname]) {
    return LOADING_MESSAGES.routes[pathname];
  }

  // Try dynamic route patterns
  for (const [pattern, message] of Object.entries(LOADING_MESSAGES.routes)) {
    if (pattern.includes("[") && matchesDynamicRoute(pathname, pattern)) {
      return message;
    }
  }

  return LOADING_MESSAGES.defaults.page;
}

export function getQueryLoadingMessage(operationName: string): LoadingMessage {
  if (LOADING_MESSAGES.queries[operationName]) {
    return LOADING_MESSAGES.queries[operationName];
  }

  // Try partial matches for generated query names
  for (const [queryName, message] of Object.entries(LOADING_MESSAGES.queries)) {
    if (
      operationName.includes(queryName) ||
      queryName.includes(operationName)
    ) {
      return message;
    }
  }

  return LOADING_MESSAGES.defaults.query;
}

export function getComponentLoadingMessage(
  componentName: string
): LoadingMessage {
  if (LOADING_MESSAGES.components[componentName]) {
    return LOADING_MESSAGES.components[componentName];
  }

  // Try partial matches
  for (const [name, message] of Object.entries(LOADING_MESSAGES.components)) {
    if (componentName.includes(name) || name.includes(componentName)) {
      return message;
    }
  }

  return LOADING_MESSAGES.defaults.component;
}

export function getActionLoadingMessage(actionType: string): LoadingMessage {
  if (LOADING_MESSAGES.actions[actionType]) {
    return LOADING_MESSAGES.actions[actionType];
  }

  return LOADING_MESSAGES.defaults.mutation;
}

// Helper function to match dynamic routes like /payrolls/[id]
function matchesDynamicRoute(pathname: string, pattern: string): boolean {
  const patternParts = pattern.split("/");
  const pathnameParts = pathname.split("/");

  if (patternParts.length !== pathnameParts.length) {
    return false;
  }

  return patternParts.every((part, index) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      return true; // Dynamic segment matches anything
    }
    return part === pathnameParts[index];
  });
}

// Export types for use in other files
export type LoadingContext = "route" | "query" | "component" | "action";
export type LoadingVariant = "page" | "inline" | "overlay" | "minimal";
