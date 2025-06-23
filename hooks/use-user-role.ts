// hooks/useUserRole.ts
import { useAuthContext } from "@/lib/auth/auth-context";

export function useUserRole() {
  const {
    userRole,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasAdminAccess,
    canManageUsers,
    canManageClients,
    canProcessPayrolls,
    canViewFinancials,
  } = useAuthContext();

  // Legacy compatibility - map to old naming conventions
  const isDeveloper = userRole === "developer"; // Developer = developer in Hasura (has DEVELOPER_TOOLS permission)
  const isAdministrator = userRole === "org_admin"; // Administrator = org_admin in Hasura
  const isManager = userRole === "manager";
  const isConsultant = userRole === "consultant";
  const isViewer = userRole === "viewer";

  // Enhanced permission checks using new permission system
  const permissions = {
    canManageStaff: hasPermission("custom:staff:write"),
    canViewStaff: hasPermission("custom:staff:read"),
    canInviteStaff: hasPermission("custom:staff:invite"),
    canDeleteStaff: hasPermission("custom:staff:delete"),
    canManageClients: hasPermission("custom:client:write"),
    canViewClients: hasPermission("custom:client:read"),
    canDeleteClients: hasPermission("custom:client:delete"),
    canProcessPayrolls: hasPermission("custom:payroll:write"),
    canViewPayrolls: hasPermission("custom:payroll:read"),
    canDeletePayrolls: hasPermission("custom:payroll:delete"),
    canAssignPayrolls: hasPermission("custom:payroll:assign"),
    canViewReports: hasPermission("custom:reports:read"),
    canExportReports: hasPermission("custom:reports:export"),
    canViewAuditLogs: hasPermission("custom:audit:read"),
    canWriteAuditLogs: hasPermission("custom:audit:write"),
    canManageSettings: hasPermission("custom:settings:write"),
    canManageAdmin: hasPermission("custom:admin:manage"),
    canManageBilling: hasPermission("custom:billing:manage"),
  };

  // Role checking functions
  const checkRole = (roles: string[]) => {
    return hasRole(roles as any);
  };

  // Check if user has any of the specified permissions
  const checkPermissions = (permissionList: string[]) => {
    return hasAnyPermission(permissionList);
  };

  return {
    // Role information
    userRole,
    isLoading,

    // Legacy compatibility
    isDeveloper,
    isAdministrator,
    isManager,
    isConsultant,
    isViewer,
    hasAdminAccess,

    // New enhanced capabilities
    permissions,
    hasPermission,
    hasAnyPermission,
    hasRole: checkRole,
    checkPermissions,

    // Specific capabilities
    canManageUsers,
    canManageClients,
    canProcessPayrolls,
    canViewFinancials,
  };
}
