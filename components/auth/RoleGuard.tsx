import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?:
    | "canManageUsers"
    | "canManageStaff"
    | "isAdmin"
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
    isAdmin,
    isManager,
    permissions,
  } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (!isLoadingRole) {
      let hasAccess = true;

      if (requiredRole) {
        hasAccess = hasRole([requiredRole]);
      }

      if (requiredPermission) {
        switch (requiredPermission) {
          case "canManageUsers":
            hasAccess = canManageUsers;
            break;
          case "canManageStaff":
            hasAccess = permissions.canManageStaff;
            break;
          case "isAdmin":
            hasAccess = isAdmin;
            break;
          case "isManager":
            hasAccess = isManager;
            break;
        }
      }

      if (!hasAccess && redirectTo) {
        console.log(
          `🔒 Access denied for role ${role}. Redirecting to ${redirectTo}`
        );
        router.push(redirectTo);
      }
    }
  }, [
    isLoadingRole,
    role,
    requiredRole,
    requiredPermission,
    redirectTo,
    router,
    hasRole,
    canManageUsers,
    permissions.canManageStaff,
    isAdmin,
    isManager,
  ]);

  if (isLoadingRole) {
    return <div>Loading...</div>;
  }

  let hasAccess = true;

  if (requiredRole) {
    hasAccess = hasRole([requiredRole]);
  }

  if (requiredPermission) {
    switch (requiredPermission) {
      case "canManageUsers":
        hasAccess = canManageUsers;
        break;
      case "canManageStaff":
        hasAccess = permissions.canManageStaff;
        break;
      case "isAdmin":
        hasAccess = isAdmin;
        break;
      case "isManager":
        hasAccess = isManager;
        break;
    }
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
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 mt-2">Current role: {role}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
