import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useUserRole } from "@/hooks/use-user-role";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?:
    | "canManageUsers"
    | "canManageStaff"
    | "isAdministrator"
    | "isManager";
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function RoleGuard({
  children,
  requiredRole,
  requiredPermission,
  fallback,
  redirectTo = "/dashboard",
}: RoleGuardProps) {
  const {
    userRole: role,
    isLoading: isLoadingRole,
    hasRole,
    canManageUsers,
    isAdministrator,
    isManager,
    permissions,
  } = useUserRole();
  const router = useRouter();

  const hasAccess = useMemo(() => {
    if (isLoadingRole) {
      return true; // Assume access while loading to prevent premature redirection
    }

    if (requiredRole) {
      return hasRole([requiredRole]);
    }

    if (requiredPermission) {
      switch (requiredPermission) {
        case "canManageUsers":
          return canManageUsers;
        case "canManageStaff":
          return permissions.canManageStaff;
        case "isAdministrator":
          return isAdministrator;
        case "isManager":
          return isManager;
        default:
          return false;
      }
    }

    return true; // Default to granting access if no specific role/permission is required
  }, [
    isLoadingRole,
    requiredRole,
    requiredPermission,
    hasRole,
    canManageUsers,
    permissions.canManageStaff,
    isAdministrator,
    isManager,
  ]);

  useEffect(() => {
    if (!isLoadingRole && !hasAccess && redirectTo) {
      console.log(
        `🔒 Access denied for role ${role}. Redirecting to ${redirectTo}`
      );
      router.push(redirectTo);
    }
  }, [isLoadingRole, hasAccess, redirectTo, router, role]);

  if (isLoadingRole) {
    return <div>Loading...</div>;
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You don&apos;t have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 mt-2">Current role: {role}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
