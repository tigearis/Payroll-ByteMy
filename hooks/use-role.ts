import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function useRole() {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState<string>("viewer");
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      const userRole = (user.publicMetadata?.role as string) || "viewer";
      setRole(userRole);
      setIsLoadingRole(false);
    } else if (isLoaded && !user) {
      setIsLoadingRole(false);
    }
  }, [isLoaded, user]);

  const hasRole = (requiredRole: string) => {
    // Role hierarchy: org_admin > manager > consultant > viewer
    const roleHierarchy: Record<string, number> = {
      org_admin: 4,
      manager: 3,
      consultant: 2,
      viewer: 1,
    };

    const userLevel = roleHierarchy[role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  };

  const isAdmin = () => role === "org_admin";
  const isManager = () => ["org_admin", "manager"].includes(role);
  const canManageUsers = () => ["org_admin", "manager"].includes(role);
  const canManageStaff = () => ["org_admin", "manager"].includes(role);

  return {
    role,
    isLoadingRole,
    hasRole,
    isAdmin,
    isManager,
    canManageUsers,
    canManageStaff,
  };
}
