// lib/auth/soc2-auth.ts - Native Clerk authentication with custom role hierarchy
import { useAuth, useUser } from "@clerk/nextjs";

// ================================
// SOC2 ROLE HIERARCHY
// ================================

// Import from consolidated types
import { 
  ROLE_HIERARCHY, 
  Role, 
  hasRoleLevel,
  sanitizeUserRole,
  isValidUserRole 
} from "@/types/permissions";

// Re-export types for external usage
export type { Role as UserRole };

// ================================
// NATIVE CLERK ROLE EXTRACTION
// ================================

// Native Clerk role extraction using sessionClaims metadata
export function extractUserRole(sessionClaims: any): Role {
  // Use Clerk's native metadata access - no JWT parsing needed!
  return sanitizeUserRole(sessionClaims?.metadata?.role);
}

// Legacy compatibility functions (deprecated - use extractUserRole instead)
export function extractUserRoleFromMetadata(sessionClaims: any): Role {
  return extractUserRole(sessionClaims);
}

export function extractUserRoleFromJWT(sessionClaims: any): Role {
  return extractUserRole(sessionClaims);
}

// Legacy JWT claims extraction (deprecated - use sessionClaims directly)
export function extractJWTClaims(token: string): any {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (error) {
    console.error("Failed to extract JWT claims:", error);
    return null;
  }
}

// Native Clerk database ID extraction
export function extractDatabaseUserId(sessionClaims: any): string | null {
  return sessionClaims?.metadata?.databaseId || null;
}

// Legacy compatibility (deprecated - use extractDatabaseUserId instead)
export function extractDatabaseUserIdFromJWT(
  sessionClaims: any
): string | null {
  return extractDatabaseUserId(sessionClaims);
}

// ================================
// NATIVE CLERK PERMISSION CHECKING
// ================================

// Re-export consolidated functions for backward compatibility
export { hasRoleLevel as hasMinimumRole, sanitizeUserRole, isValidUserRole } from "@/types/permissions";

// Simplified role checking using Clerk's native sessionClaims
export function checkRoleFromClaims(
  sessionClaims: any,
  minimumRole: Role
): boolean {
  const userRole = extractUserRole(sessionClaims);
  return hasRoleLevel(userRole, minimumRole);
}

// Action-based permission checking (simplified)
export function canPerformAction(userRole: Role, action: string): boolean {
  const actionRoleMap: Record<string, Role> = {
    manage_staff: "org_admin",
    manage_payrolls: "manager",
    manage_users: "org_admin",
    system_admin: "developer",
    view_reports: "consultant",
  };

  const requiredRole = actionRoleMap[action];
  return requiredRole ? hasRoleLevel(userRole, requiredRole) : false;
}

// ================================
// AUDIT LOGGING
// ================================

export interface AuditEvent {
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  details?: Record<string, any>;
}

export class AuditLogger {
  static async log(event: AuditEvent): Promise<void> {
    console.log("🔍 AUDIT:", {
      timestamp: event.timestamp.toISOString(),
      userId: event.userId,
      action: event.action,
      resource: event.resource,
      details: event.details,
    });
  }
}

// ================================
// NATIVE CLERK HOOKS
// ================================

// Simplified role hierarchy hook using native Clerk
export function useRoleHierarchy() {
  const { userId, sessionClaims } = useAuth();
  const { user } = useUser();

  const userRole = extractUserRole(sessionClaims);

  return {
    userRole,
    userId,

    // Core hierarchy checks (using consolidated functions)
    hasMinimumRole: (minimumRole: Role) => hasRoleLevel(userRole, minimumRole),
    canPerformAction: (action: string) => canPerformAction(userRole, action),

    // Specific capability checks (using consolidated hierarchy)
    canManageStaff: hasRoleLevel(userRole, "org_admin"),
    canCreateStaff: hasRoleLevel(userRole, "org_admin"),
    canDeleteStaff: hasRoleLevel(userRole, "org_admin"),
    canManagePayrolls: hasRoleLevel(userRole, "manager"),
    canCreatePayrolls: hasRoleLevel(userRole, "manager"),
    canDeletePayrolls: hasRoleLevel(userRole, "org_admin"),
    canManageUsers: hasRoleLevel(userRole, "org_admin"),
    canViewReports: hasRoleLevel(userRole, "consultant"),
    canAccessSecurity: hasRoleLevel(userRole, "org_admin"),
    canAccessDeveloperTools: hasRoleLevel(userRole, "developer"),

    // Navigation access checks
    canAccessDashboard: hasRoleLevel(userRole, "viewer"),
    canAccessClients: hasRoleLevel(userRole, "viewer"),
    canAccessPayrolls: hasRoleLevel(userRole, "viewer"),
    canAccessSchedule: hasRoleLevel(userRole, "viewer"),
    canAccessStaff: hasRoleLevel(userRole, "manager"),
    canAccessSettings: hasRoleLevel(userRole, "developer"),
    canAccessTaxCalculator: hasRoleLevel(userRole, "developer"),

    // Legacy compatibility (computed properties for consistency)
    isDeveloper: userRole === "developer",
    isAdministrator: userRole === "org_admin",
    isManager: userRole === "manager",
    isConsultant: userRole === "consultant",
    isViewer: userRole === "viewer",
    hasAdminAccess: hasRoleLevel(userRole, "org_admin"),
    hasManagerAccess: hasRoleLevel(userRole, "manager"),
    hasConsultantAccess: hasRoleLevel(userRole, "consultant"),
  };
}
