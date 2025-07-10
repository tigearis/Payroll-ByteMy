/**
 * Role Utilities
 * 
 * Centralized role handling that integrates with database types and 
 * provides consistent role display and validation throughout the application.
 * 
 * This replaces the scattered role.replace() usages with proper type-safe utilities.
 */

import { Role } from "@/types/enums";

// Type for role values that come from the database
export type UserRole = "developer" | "org_admin" | "manager" | "consultant" | "viewer";

// Type for position values that come from the database
export type UserPosition = string; // user_position is a scalar in the schema

// Role hierarchy levels (higher number = more permissions)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  developer: 5,
  org_admin: 4,
  manager: 3,
  consultant: 2,
  viewer: 1,
};

// Role display names with proper formatting
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  developer: "Developer",
  org_admin: "Organization Admin",
  manager: "Manager", 
  consultant: "Consultant",
  viewer: "Viewer",
};

// Role descriptions for tooltips/help text
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  developer: "Full system access and development capabilities",
  org_admin: "Administrative access across the organization",
  manager: "Team management and payroll oversight",
  consultant: "Client work and payroll processing",
  viewer: "Read-only access to assigned data",
};

// Role color schemes for UI components
export const ROLE_COLORS: Record<UserRole, string> = {
  developer: "bg-purple-100 text-purple-800",
  org_admin: "bg-red-100 text-red-800", 
  manager: "bg-blue-100 text-blue-800",
  consultant: "bg-green-100 text-green-800",
  viewer: "bg-gray-100 text-gray-800",
};

/**
 * Get the display name for a role
 * Replaces role.replace("_", " ") usages
 */
export function getRoleDisplayName(role: string | UserRole): string {
  if (!role) return "Unknown Role";
  
  const normalizedRole = role.toLowerCase() as UserRole;
  return ROLE_DISPLAY_NAMES[normalizedRole] || role;
}

/**
 * Get the display name in uppercase
 * For components that need uppercase formatting
 */
export function getRoleDisplayNameUpper(role: string | UserRole): string {
  return getRoleDisplayName(role).toUpperCase();
}

/**
 * Get CSS color classes for role badges
 */
export function getRoleColor(role: string | UserRole): string {
  if (!role) return "bg-gray-100 text-gray-800";
  
  const normalizedRole = role.toLowerCase() as UserRole;
  return ROLE_COLORS[normalizedRole] || "bg-gray-100 text-gray-800";
}

/**
 * Get role description
 */
export function getRoleDescription(role: string | UserRole): string {
  if (!role) return "No role assigned";
  
  const normalizedRole = role.toLowerCase() as UserRole;
  return ROLE_DESCRIPTIONS[normalizedRole] || "Custom role";
}

/**
 * Check if a role is valid
 */
export function isValidRole(role: string): role is UserRole {
  return Object.keys(ROLE_HIERARCHY).includes(role.toLowerCase());
}

/**
 * Sanitize role input from database or API
 */
export function sanitizeRole(role: unknown): UserRole {
  if (typeof role === "string" && isValidRole(role)) {
    return role.toLowerCase() as UserRole;
  }
  return "viewer"; // Safe default
}

/**
 * Get all available roles
 */
export function getAllRoles(): UserRole[] {
  return Object.keys(ROLE_HIERARCHY) as UserRole[];
}

/**
 * Get role hierarchy level
 */
export function getRoleLevel(role: string | UserRole): number {
  if (!role) return 0;
  
  const normalizedRole = role.toLowerCase() as UserRole;
  return ROLE_HIERARCHY[normalizedRole] || 0;
}

/**
 * Check if user role has sufficient level for required role
 */
export function hasRoleLevel(userRole: string | UserRole, requiredRole: string | UserRole): boolean {
  const userLevel = getRoleLevel(userRole);
  const requiredLevel = getRoleLevel(requiredRole);
  
  return userLevel >= requiredLevel;
}

/**
 * Get roles that can be assigned by the current user
 * Users can only assign roles at their level or below
 */
export function getAssignableRoles(currentUserRole: string | UserRole): UserRole[] {
  const currentLevel = getRoleLevel(currentUserRole);
  
  return getAllRoles().filter(role => {
    const roleLevel = getRoleLevel(role);
    return roleLevel <= currentLevel;
  });
}

/**
 * Format role for select options
 */
export interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  disabled?: boolean;
}

export function getRoleOptions(currentUserRole?: string | UserRole): RoleOption[] {
  const assignableRoles = currentUserRole 
    ? getAssignableRoles(currentUserRole)
    : getAllRoles();
  
  return assignableRoles.map(role => ({
    value: role,
    label: getRoleDisplayName(role),
    description: getRoleDescription(role),
  }));
}

/**
 * Format position for display
 * Converts position codes/identifiers to readable format
 */
export function getPositionDisplayName(position: string | UserPosition | null | undefined): string {
  if (!position) return "Not specified";
  
  // Handle common position formats
  const normalizedPosition = position.toLowerCase().trim();
  
  // Convert snake_case or kebab-case to proper case
  const formatted = normalizedPosition
    .replace(/[_-]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return formatted;
}

/**
 * Get combined role and position display for comprehensive employee info
 */
export function getRoleAndPositionDisplay(
  role: string | UserRole | null | undefined,
  position: string | UserPosition | null | undefined
): string {
  const roleDisplay = getRoleDisplayName(role || "");
  const positionDisplay = getPositionDisplayName(position);
  
  if (roleDisplay === "Unknown Role" && positionDisplay === "Not specified") {
    return "Role and position not specified";
  }
  
  if (roleDisplay === "Unknown Role") {
    return positionDisplay;
  }
  
  if (positionDisplay === "Not specified") {
    return roleDisplay;
  }
  
  return `${roleDisplay} - ${positionDisplay}`;
}

/**
 * Check if position information is available
 */
export function hasPositionInfo(position: string | UserPosition | null | undefined): boolean {
  return !!(position && position.trim());
}

/**
 * Legacy compatibility - matches existing function signature
 * @deprecated Use getRoleDisplayName instead
 */
export function getRoleDisplayNameLegacy(role: string): string {
  return getRoleDisplayName(role);
}