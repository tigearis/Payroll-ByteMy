/**
 * Simplified Permission System
 * 
 * Replaces the complex 23-permission RBAC system with a simple 5-role hierarchy.
 * Focuses on basic authentication and admin/manager access control.
 */

// Simplified role hierarchy (same roles, simplified logic)
export type SimpleRole = "developer" | "org_admin" | "manager" | "consultant" | "viewer";

// Role hierarchy levels (higher number = more privileges)
export const SIMPLE_ROLE_HIERARCHY: Record<SimpleRole, number> = {
  developer: 5,    // Full system access
  org_admin: 4,    // Organization administration  
  manager: 3,      // Staff and operations management
  consultant: 2,   // Basic business operations
  viewer: 1,       // Read-only access
};

// Simple access categories
export interface SimpleAccessLevels {
  isAuthenticated: boolean;
  isAdmin: boolean;         // org_admin or developer
  isManager: boolean;       // manager or higher
  isDeveloper: boolean;     // developer only
  canManageUsers: boolean;  // manager or higher
  canManageSystem: boolean; // org_admin or developer
}

/**
 * Check if user has required role level or higher
 */
export function hasRoleLevel(userRole: SimpleRole, requiredRole: SimpleRole): boolean {
  const userLevel = SIMPLE_ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = SIMPLE_ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
}

/**
 * Check if user is admin (org_admin or developer)
 */
export function isAdmin(role: SimpleRole): boolean {
  return hasRoleLevel(role, "org_admin");
}

/**
 * Check if user is manager or higher
 */
export function isManager(role: SimpleRole): boolean {
  return hasRoleLevel(role, "manager");
}

/**
 * Check if user is developer (highest privilege)
 */
export function isDeveloper(role: SimpleRole): boolean {
  return role === "developer";
}

/**
 * Check if user can manage other users
 */
export function canManageUsers(role: SimpleRole): boolean {
  return hasRoleLevel(role, "manager");
}

/**
 * Check if user can manage system settings
 */
export function canManageSystem(role: SimpleRole): boolean {
  return hasRoleLevel(role, "org_admin");
}

/**
 * Get access levels for a role
 */
export function getAccessLevels(role: SimpleRole): SimpleAccessLevels {
  return {
    isAuthenticated: true, // If we have a role, user is authenticated
    isAdmin: isAdmin(role),
    isManager: isManager(role),
    isDeveloper: isDeveloper(role),
    canManageUsers: canManageUsers(role),
    canManageSystem: canManageSystem(role),
  };
}

/**
 * Validate role string
 */
export function isValidRole(role: string): role is SimpleRole {
  return Object.keys(SIMPLE_ROLE_HIERARCHY).includes(role);
}

/**
 * Sanitize role with fallback
 */
export function sanitizeRole(role: unknown): SimpleRole {
  if (typeof role === "string" && isValidRole(role)) {
    return role;
  }
  return "viewer"; // Safe default
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: SimpleRole): string {
  const displayNames: Record<SimpleRole, string> = {
    developer: "Developer",
    org_admin: "Administrator", 
    manager: "Manager",
    consultant: "Consultant",
    viewer: "Viewer",
  };
  return displayNames[role];
}

/**
 * Get roles that current role can assign to others
 */
export function getAssignableRoles(currentRole: SimpleRole): SimpleRole[] {
  const currentLevel = SIMPLE_ROLE_HIERARCHY[currentRole] || 0;
  
  return Object.entries(SIMPLE_ROLE_HIERARCHY)
    .filter(([_, level]) => level < currentLevel) // Can only assign lower roles
    .map(([role, _]) => role as SimpleRole)
    .sort((a, b) => SIMPLE_ROLE_HIERARCHY[b] - SIMPLE_ROLE_HIERARCHY[a]); // Highest first
}

/**
 * Route access requirements (simplified from complex config/routes.ts)
 */
export const SIMPLE_ROUTE_REQUIREMENTS: Record<string, SimpleRole> = {
  // Developer-only routes
  "/developer": "developer",
  "/api/developer": "developer",
  
  // Admin routes
  "/admin": "org_admin",
  "/security": "org_admin",
  "/api/admin": "org_admin",
  
  // Manager routes  
  "/staff": "manager",
  "/api/staff": "manager",
  "/invitations": "manager",
  "/api/invitations": "manager",
  
  // Default authenticated routes (consultant+)
  "/dashboard": "consultant",
  "/clients": "consultant", 
  "/payrolls": "consultant",
};

/**
 * Get required role for a route
 */
export function getRequiredRole(pathname: string): SimpleRole | null {
  // Check for exact matches first
  if (SIMPLE_ROUTE_REQUIREMENTS[pathname]) {
    return SIMPLE_ROUTE_REQUIREMENTS[pathname];
  }
  
  // Check for prefix matches
  for (const [routePrefix, requiredRole] of Object.entries(SIMPLE_ROUTE_REQUIREMENTS)) {
    if (pathname.startsWith(routePrefix)) {
      return requiredRole;
    }
  }
  
  // Public routes (no auth required)
  const publicRoutes = ["/", "/sign-in", "/sign-up", "/accept-invitation"];
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + "/"))) {
    return null;
  }
  
  // Default to consultant level for authenticated routes
  return "consultant";
}

/**
 * Check if route is public (no auth required)
 */
export function isPublicRoute(pathname: string): boolean {
  return getRequiredRole(pathname) === null;
}

/**
 * Basic audit event types (simplified from complex audit system)
 */
export type SimpleAuditEvent = 
  | "auth_login"
  | "auth_logout" 
  | "auth_failed"
  | "role_changed"
  | "user_created"
  | "user_deleted"
  | "access_denied";

/**
 * Simple audit logging (replaces complex SOC2 system)
 */
export interface SimpleAuditLog {
  timestamp: string;
  event: SimpleAuditEvent;
  userId?: string;
  userRole?: SimpleRole;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Create audit log entry
 */
export function createAuditLog(
  event: SimpleAuditEvent,
  details?: Record<string, any>
): SimpleAuditLog {
  return {
    timestamp: new Date().toISOString(),
    event,
    details,
    // Additional fields can be added by the logging system
  };
}

// Export all role checking functions for easy access
export const roleCheckers = {
  hasRoleLevel,
  isAdmin,
  isManager, 
  isDeveloper,
  canManageUsers,
  canManageSystem,
  getAccessLevels,
};