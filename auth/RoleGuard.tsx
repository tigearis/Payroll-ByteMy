import { useRoleHierarchy, type UserRole } from "@/lib/auth/soc2-auth";

interface RoleGuardProps {
  children: React.ReactNode;
  minimumRole?: UserRole;
  fallback?: React.ReactNode;
}

export function RoleGuard({
  children,
  minimumRole = "viewer",
  fallback,
}: RoleGuardProps) {
  const { userRole, hasMinimumRole } = useRoleHierarchy();

  const hasAccess = hasMinimumRole(minimumRole);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You need {minimumRole} access or higher.
          </p>
          <p className="text-sm text-gray-500 mt-2">Current role: {userRole}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
