// types/permissions.ts - Single source of truth for all permission and role types

// Permission string literals
export type PayrollPermission =
  | "custom:payroll:read"
  | "custom:payroll:write"
  | "custom:payroll:delete"
  | "custom:payroll:assign";

export type StaffPermission =
  | "custom:staff:read"
  | "custom:staff:write"
  | "custom:staff:delete"
  | "custom:staff:invite";

export type ClientPermission =
  | "custom:client:read"
  | "custom:client:write"
  | "custom:client:delete";

export type AdminPermission =
  | "custom:admin:manage"
  | "custom:settings:write"
  | "custom:billing:manage";

export type ReportingPermission =
  | "custom:reports:read"
  | "custom:reports:export"
  | "custom:audit:read"
  | "custom:audit:write";

// Combined permission type
export type CustomPermission =
  | PayrollPermission
  | StaffPermission
  | ClientPermission
  | AdminPermission
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
  permissions: CustomPermission[];
}

export interface RolePermissions {
  [key: string]: RoleConfig;
}

// ================================
// CONSOLIDATED PERMISSION SYSTEM
// ================================

// 18 specific permissions across 5 hierarchical roles
export const CUSTOM_PERMISSIONS = [
  // Payroll permissions
  "custom:payroll:read",
  "custom:payroll:write",
  "custom:payroll:delete",
  "custom:payroll:assign",

  // Staff permissions
  "custom:staff:read",
  "custom:staff:write",
  "custom:staff:delete",
  "custom:staff:invite",

  // Client permissions
  "custom:client:read",
  "custom:client:write",
  "custom:client:delete",

  // Admin permissions
  "custom:admin:manage",
  "custom:settings:write",
  "custom:billing:manage",

  // Reporting permissions
  "custom:reports:read",
  "custom:reports:export",
  "custom:audit:read",
  "custom:audit:write",
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
    permissions: [...CUSTOM_PERMISSIONS] as CustomPermission[], // All permissions
  },
  org_admin: {
    level: 4,
    permissions: [
      "custom:payroll:read",
      "custom:payroll:write",
      "custom:staff:read",
      "custom:staff:write",
      "custom:client:read",
      "custom:client:write",
      "custom:admin:manage",
      "custom:settings:write",
      "custom:reports:read",
    ] as CustomPermission[],
  },
  manager: {
    level: 3,
    permissions: [
      "custom:payroll:read",
      "custom:staff:read",
      "custom:client:read",
      "custom:reports:read",
    ] as CustomPermission[],
  },
  consultant: {
    level: 2,
    permissions: [
      "custom:payroll:read",
      "custom:client:read",
    ] as CustomPermission[],
  },
  viewer: {
    level: 1,
    permissions: ["custom:payroll:read"] as CustomPermission[],
  },
};

// Permission categories for easier management
export const PERMISSION_CATEGORIES = {
  PAYROLL: [
    "custom:payroll:read",
    "custom:payroll:write",
    "custom:payroll:delete",
    "custom:payroll:assign",
  ] as CustomPermission[],

  STAFF: [
    "custom:staff:read",
    "custom:staff:write",
    "custom:staff:delete",
    "custom:staff:invite",
  ] as CustomPermission[],

  CLIENT: [
    "custom:client:read",
    "custom:client:write",
    "custom:client:delete",
  ] as CustomPermission[],

  ADMIN: [
    "custom:admin:manage",
    "custom:settings:write",
    "custom:billing:manage",
  ] as CustomPermission[],

  REPORTING: [
    "custom:reports:read",
    "custom:reports:export",
    "custom:audit:read",
    "custom:audit:write",
  ] as CustomPermission[],
};

// ================================
// CONSOLIDATED METADATA INTERFACE
// ================================

// Standardized user metadata interface - SINGLE SOURCE OF TRUTH
export interface UserMetadata {
  role: Role;
  permissions: CustomPermission[];
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
export function isValidCustomPermission(
  permission: string
): permission is CustomPermission {
  return CUSTOM_PERMISSIONS.includes(permission as any);
}

export function isValidUserRole(role: string): role is Role {
  return role in ROLE_HIERARCHY;
}

export function getPermissionsForRole(role: Role): CustomPermission[] {
  return [...(ROLE_PERMISSIONS[role]?.permissions || [])];
}

export function getRoleLevel(role: Role): number {
  return ROLE_HIERARCHY[role] || 0;
}

// Check if a role has a specific permission
export function roleHasPermission(
  role: Role,
  permission: CustomPermission
): boolean {
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
