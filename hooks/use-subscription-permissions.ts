/**
 * Simplified Subscription Permissions Hook
 * 
 * Replaces the complex subscription permission system with basic role checks.
 */

import { useAuthContext, migration } from "@/lib/auth";

export function useSubscriptionPermissions() {
  const { userRole, isAuthenticated } = useAuthContext();

  return {
    // Security-related permissions
    canViewAuditLogs: isAuthenticated && migration.hasPermission("audit:read", userRole),
    canViewSecurityMetrics: isAuthenticated && migration.hasPermission("security:manage", userRole),
    canManageUsers: isAuthenticated && migration.hasPermission("staff:write", userRole),
    
    // Admin-level permissions
    canAccessAdminPanel: isAuthenticated && migration.hasPermission("admin:manage", userRole),
    canManageSystem: isAuthenticated && userRole === "developer",
    
    // Basic access
    isAuthenticated,
    userRole,
    
    // Simplified permission checker
    hasPermission: (permission: string) => {
      if (!isAuthenticated) return false;
      return migration.hasPermission(permission, userRole);
    },
  };
}

// Additional missing export for backward compatibility
export function useSecureSubscription() {
  return useSubscriptionPermissions();
}