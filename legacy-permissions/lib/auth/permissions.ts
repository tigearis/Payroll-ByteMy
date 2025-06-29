// types/permissions.ts - Single source of truth for all permission and role types

// Permission string literals
export type PayrollPermission =
  | "payroll:read"
  | "payroll:write"
  | "payroll:delete"
  | "payroll:assign"
  | "payroll:approve";

export type StaffPermission =
  | "staff:read"
  | "staff:write"
  | "staff:delete"
  | "staff:invite"
  | "staff:bulk_update";

export type ClientPermission = "client:read" | "client:write" | "client:delete" | "client:archive";

export type AdminPermission =
  | "admin:manage"
  | "settings:write"
  | "billing:manage";

// Security permissions
export type SecurityPermission =
  | "security:read"
  | "security:write"
  | "security:manage";

export type ReportingPermission =
  | "reports:read"
  | "reports:export"
  | "reports:schedule"
  | "audit:read"
  | "audit:write"
  | "audit:export";

// Combined permission type
export type Permission =
  | PayrollPermission
  | StaffPermission
  | ClientPermission
  | AdminPermission
  | SecurityPermission
  | ReportingPermission;

// Role type
export type Role =
  | "developer"
  | "org_admin"
  | "manager"
  | "consultant"
  | "viewer";

// Role permissions interface
export interface RoleConfig {
  level: number;
  permissions: Permission[];
}

export interface RolePermissions {
  [key: string]: RoleConfig;
}

// ================================
// CONSOLIDATED PERMISSION SYSTEM
// ================================

// 23 specific permissions across 5 hierarchical roles
export const ALL_PERMISSIONS = [
  // Payroll permissions
  "payroll:read",
  "payroll:write",
  "payroll:delete",
  "payroll:assign",
  "payroll:approve",

  // Staff permissions
  "staff:read",
  "staff:write",
  "staff:delete",
  "staff:invite",
  "staff:bulk_update",

  // Client permissions
  "client:read",
  "client:write",
  "client:delete",
  "client:archive",

  // Admin permissions
  "admin:manage",
  "settings:write",
  "billing:manage",

  // Security permissions
  "security:read",
  "security:write",
  "security:manage",

  // Reporting permissions
  "reports:read",
  "reports:export",
  "reports:schedule",
  "audit:read",
  "audit:write",
  "audit:export",
] as const;

// Role hierarchy: developer(5) > org_admin(4) > manager(3) > consultant(2) > viewer(1)
// SINGLE SOURCE OF TRUTH for all role hierarchy operations
export const ROLE_HIERARCHY: Record<Role, number> = {
  developer: 5,
  org_admin: 4,
  manager: 3,
  consultant: 2,
  viewer: 1,
};

// Role permissions mapping - combines hierarchy with granular permissions
export const ROLE_PERMISSIONS: RolePermissions = {
  developer: {
    level: 5,
    permissions: [...ALL_PERMISSIONS] as Permission[], // All permissions
  },
  org_admin: {
    level: 4,
    permissions: [
      // Payroll permissions - full access
      "payroll:read",
      "payroll:write",
      "payroll:delete",
      "payroll:assign",
      "payroll:approve",

      // Staff permissions - full access
      "staff:read",
      "staff:write",
      "staff:delete",
      "staff:invite",
      "staff:bulk_update",

      // Client permissions - full access
      "client:read",
      "client:write",
      "client:delete",
      "client:archive",

      // Admin permissions - full access
      "admin:manage",
      "settings:write",
      "billing:manage",

      // Security permissions - full access
      "security:read",
      "security:write",
      "security:manage",

      // Reporting permissions - full access
      "reports:read",
      "reports:export",
      "reports:schedule",
      "audit:read",
      "audit:write",
      "audit:export",
    ] as Permission[],
  },
  manager: {
    level: 3,
    permissions: [
      // Payroll permissions - read and limited write
      "payroll:read",
      "payroll:write",
      "payroll:assign",

      // Staff permissions - read and manage
      "staff:read",
      "staff:write",
      "staff:invite",
      "staff:bulk_update",

      // Client permissions - read and write
      "client:read",
      "client:write",

      // Security permissions - read access for monitoring
      "security:read",

      // Reporting permissions - read and export
      "reports:read",
      "reports:export",
      "reports:schedule",
      "audit:read",
    ] as Permission[],
  },
  consultant: {
    level: 2,
    permissions: [
      // Payroll permissions - read only and assign
      "payroll:read",
      "payroll:assign",

      // Staff permissions - read only
      "staff:read",

      // Client permissions - read only
      "client:read",

      // Reporting permissions - read only
      "reports:read",
    ] as Permission[],
  },
  viewer: {
    level: 1,
    permissions: [
      // Very limited read access
      "payroll:read",
      "client:read",
      "reports:read",
    ] as Permission[],
  },
};

// Permission categories for easier management
export const PERMISSION_CATEGORIES = {
  PAYROLL: [
    "payroll:read",
    "payroll:write",
    "payroll:delete",
    "payroll:assign",
  ] as Permission[],

  STAFF: [
    "staff:read",
    "staff:write",
    "staff:delete",
    "staff:invite",
  ] as Permission[],

  CLIENT: ["client:read", "client:write", "client:delete"] as Permission[],

  ADMIN: ["admin:manage", "settings:write", "billing:manage"] as Permission[],

  SECURITY: [
    "security:read",
    "security:write",
    "security:manage",
  ] as Permission[],

  REPORTING: [
    "reports:read",
    "reports:export",
    "audit:read",
    "audit:write",
  ] as Permission[],
};

// ================================
// CONSOLIDATED METADATA INTERFACE
// ================================

// Standardized user metadata interface - SINGLE SOURCE OF TRUTH
export interface UserMetadata {
  role: Role;
  permissions: Permission[];
  databaseId?: string;
  assignedBy?: string;
  assignedAt?: string;
  lastUpdated?: string;
  customAccess?: {
    restrictedPayrolls?: string[];
    allowedClients?: string[];
  };
  // Legacy fields for backward compatibility
  onboardingComplete?: boolean;
  department?: string;
  employeeId?: string;
  startDate?: string;
}

// ================================
// CONSOLIDATED UTILITY FUNCTIONS
// ================================

// Function to check if a user has minimum role level - SINGLE IMPLEMENTATION
export function hasRoleLevel(userRole: Role, requiredRole: Role): boolean {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
}

// Utility functions for permission management
export function isValidPermission(
  permission: string
): permission is Permission {
  return ALL_PERMISSIONS.includes(permission as any);
}

export function isValidUserRole(role: string): role is Role {
  return role in ROLE_HIERARCHY;
}

export function getPermissionsForRole(role: Role): Permission[] {
  return [...(ROLE_PERMISSIONS[role]?.permissions || [])];
}

export function getRoleLevel(role: Role): number {
  return ROLE_HIERARCHY[role] || 0;
}

// Check if a role has a specific permission
export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.permissions.includes(permission) || false;
}

// Check if userRole meets minimum level requirement
export function hasMinimumRoleLevel(
  userRole: Role,
  minimumRole: Role
): boolean {
  return hasRoleLevel(userRole, minimumRole);
}

// Validate if current role can assign target role (hierarchy validation)
export function canAssignRole(currentRole: Role, targetRole: Role): boolean {
  return getRoleLevel(currentRole) >= getRoleLevel(targetRole);
}

// Sanitize and validate a role with safe fallback
export function sanitizeUserRole(role: unknown): Role {
  if (typeof role === "string" && isValidUserRole(role)) {
    return role as Role;
  }
  return "viewer";
}

// Get allowed roles based on role hierarchy
// This function returns all roles that a user can assume based on their current role
export function getAllowedRoles(userRole: Role): Role[] {
  const roleLevel = ROLE_HIERARCHY[userRole] || 0;
  
  // User can assume their own role and any role below their level
  const allowedRoles: Role[] = [];
  
  for (const [role, level] of Object.entries(ROLE_HIERARCHY)) {
    if (level <= roleLevel) {
      allowedRoles.push(role as Role);
    }
  }
  
  // Sort by hierarchy level (highest to lowest)
  return allowedRoles.sort((a, b) => ROLE_HIERARCHY[b] - ROLE_HIERARCHY[a]);
}

// Role hierarchy for allowed roles computation
export const ROLE_ALLOWED_ROLES: Record<Role, Role[]> = {
  developer: ["developer", "org_admin", "manager", "consultant", "viewer"],
  org_admin: ["org_admin", "manager", "consultant", "viewer"],
  manager: ["manager", "consultant", "viewer"],
  consultant: ["consultant", "viewer"],
  viewer: ["viewer"],
};

// Define permission action types
export enum PermissionAction {
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete",
  List = "list",
  Manage = "manage",
  Approve = "approve",
  Reject = "reject",
}

// Type for permission validation result
export interface PermissionValidationResult {
  isValid: boolean;
  error?: string;
  requiredRole?: Role;
  userRole?: Role;
}

// Route permissions mapping
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  "/dashboard": [], // All authenticated users can access dashboard
  "/staff": ["staff:read"],
  "/staff/new": ["staff:write"],
  "/clients": ["client:read"],
  "/clients/new": ["client:write"],
  "/payrolls": ["payroll:read"],
  "/payroll-schedule": ["payroll:write"],
  "/settings": ["settings:write"],
  "/developer": ["admin:manage"],
  "/ai-assistant": [], // All authenticated users
  "/calendar": [], // All authenticated users
  "/tax-calculator": [], // All authenticated users
};
