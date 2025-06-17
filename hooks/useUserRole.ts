// hooks/useUserRole.ts
import { useAuthContext } from "@/lib/auth-context";

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
  const isAdmin = userRole === "org_admin"; // Admin = org_admin in Hasura
  const isManager = userRole === "manager";
  const isConsultant = userRole === "consultant";
  const isViewer = userRole === "viewer";

  // Enhanced permission checks
  const permissions = {
    canViewDashboard: hasPermission("view_dashboard"),
    canManageStaff: hasPermission("manage_staff"),
    canViewStaff: hasPermission("view_staff"),
    canManageClients: hasPermission("manage_clients"),
    canViewClients: hasPermission("view_clients"),
    canProcessPayrolls: hasPermission("process_payrolls"),
    canApprovePayrolls: hasPermission("approve_payrolls"),
    canViewPayrolls: hasPermission("view_payrolls"),
    canViewFinancials: hasPermission("view_financials"),
    canManageBilling: hasPermission("manage_billing"),
    canViewReports: hasPermission("view_reports"),
    canGenerateReports: hasPermission("generate_reports"),
    canManageSettings: hasPermission("manage_settings"),
    canManageRoles: hasPermission("manage_roles"),
    canManageUsers: hasPermission("manage_users"),
    canInviteUsers: hasPermission("invite_users"),
    canUseDeveloperTools: hasPermission("developer_tools"),
    isSystemAdmin: hasPermission("system_admin"),
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
    isAdmin,
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
