// hooks/useUserRole.ts
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export function useUserRole() {
  const { isLoaded, userId, getToken } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (!isLoaded) return;
      try {
        if (userId) {
          const token = await getToken({ template: "hasura" });
          if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserRole(payload["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"]);
          }
        }
      } catch (err) {
        console.error("Error getting user role:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserRole();
  }, [isLoaded, userId, getToken]);

  // Helper functions for role checks - mapping Hasura roles to your application roles
  const isDeveloper = userRole === 'admin'; // Developer = admin in Hasura
  const isAdmin = userRole === 'org_admin'; // Admin = org_admin in Hasura
  const isManager = userRole === 'manager';
  const isConsultant = userRole === 'consultant';
  const isViewer = userRole === 'viewer';

  // Check if user has admin-level permissions (either Developer or Admin role)
  const hasAdminAccess = isDeveloper || isAdmin;

  // Function to check if user has one of the specified roles
  const hasRole = (roles: string[]) => {
    return userRole ? roles.includes(userRole) : false;
  };

  return {
    userRole,
    isLoading,
    isDeveloper,
    isAdmin,
    isManager,
    isConsultant,
    isViewer,
    hasAdminAccess,
    hasRole
  };
}
