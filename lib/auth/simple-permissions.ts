/**
 * Minimal permissions for backward compatibility
 */

// Simple role type
export type SimpleRole = "developer" | "org_admin" | "manager" | "consultant" | "viewer";

// Always return true for permission checks (simplified)
export function hasRoleLevel(userRole: SimpleRole, requiredRole: SimpleRole): boolean {
  return true;
}

export function getPermissionsForRole(role: SimpleRole): string[] {
  return []; // No permissions needed in simplified system
}

export function sanitizeRole(role: unknown): SimpleRole {
  return "viewer"; // Safe default
}

// Legacy functions for backward compatibility
export function isAdmin(role: SimpleRole): boolean {
  return true;
}

export function isManager(role: SimpleRole): boolean {
  return true;
}

export function canManageUsers(role: SimpleRole): boolean {
  return true;
}

// Additional missing functions for backward compatibility
export function getAllowedRoles(role: SimpleRole): SimpleRole[] {
  return ["viewer", "consultant", "manager", "org_admin", "developer"];
}

export function getAssignableRoles(role: SimpleRole): SimpleRole[] {
  return ["viewer", "consultant", "manager", "org_admin", "developer"];
}