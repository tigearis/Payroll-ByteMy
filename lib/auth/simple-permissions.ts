/**
 * Simple Permissions - Hierarchical Integration
 * 
 * Bridge between simple auth components and hierarchical permission system.
 * Provides role-level checking with hierarchical role inheritance.
 */

import type { UserRole } from "@/lib/permissions/hierarchical-permissions";

// Simple role type for backward compatibility
export type SimpleRole = UserRole;

/**
 * Role hierarchy levels for comparison
 */
const ROLE_LEVELS: Record<UserRole, number> = {
  viewer: 1,
  consultant: 2,
  manager: 3,
  org_admin: 4,
  developer: 5
};

/**
 * Check if user has a specific role level or higher
 * Uses hierarchical role inheritance
 */
export function hasRoleLevel(userRole: UserRole | null, requiredRole: UserRole): boolean {
  if (!userRole) return false;
  
  const userLevel = ROLE_LEVELS[userRole] || 0;
  const requiredLevel = ROLE_LEVELS[requiredRole] || 0;
  
  return userLevel >= requiredLevel;
}

/**
 * Check if user has admin privileges (org_admin or developer)
 */
export function isAdmin(userRole: UserRole | null): boolean {
  return hasRoleLevel(userRole, 'org_admin');
}

/**
 * Check if user has manager privileges (manager or higher)
 */
export function isManager(userRole: UserRole | null): boolean {
  return hasRoleLevel(userRole, 'manager');
}

/**
 * Check if user has developer privileges
 */
export function isDeveloper(userRole: UserRole | null): boolean {
  return userRole === 'developer';
}

/**
 * Check if user is staff (consultant or higher)
 */
export function isStaff(userRole: UserRole | null): boolean {
  return hasRoleLevel(userRole, 'consultant');
}

/**
 * Get display name for role
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    developer: 'Developer',
    org_admin: 'Administrator',
    manager: 'Manager', 
    consultant: 'Consultant',
    viewer: 'Viewer'
  };
  
  return roleNames[role] || role;
}

/**
 * Get role hierarchy level
 */
export function getRoleLevel(role: UserRole): number {
  return ROLE_LEVELS[role] || 0;
}

/**
 * Get all roles at or below a certain level
 */
export function getRolesAtOrBelow(role: UserRole): UserRole[] {
  const targetLevel = ROLE_LEVELS[role];
  return Object.entries(ROLE_LEVELS)
    .filter(([_, level]) => level <= targetLevel)
    .map(([roleName]) => roleName as UserRole);
}

/**
 * Get all roles at or above a certain level
 */
export function getRolesAtOrAbove(role: UserRole): UserRole[] {
  const targetLevel = ROLE_LEVELS[role];
  return Object.entries(ROLE_LEVELS)
    .filter(([_, level]) => level >= targetLevel)
    .map(([roleName]) => roleName as UserRole);
}