import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useAuthContext } from "@/lib/auth";
import { toast } from "sonner";

import {
  UpdateUserDocument,
} from "@/domains/users/graphql/generated/graphql";

export interface UserRoleInfo {
  userId: string;
  role: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  canModify: boolean;
}

export interface RoleOption {
  value: string;
  label: string;
  description: string;
}

export function useUserRole() {
  const {
    userRole,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasRole,
    refreshUserData,
    userId,
    userEmail,
    userName,
  } = useAuthContext();

  const [isUpdating, setIsUpdating] = useState(false);
  
  // GraphQL mutations
  const [updateUserMutation] = useMutation(UpdateUserDocument);

  // Role checking functions
  const checkRole = (roles: string[]) => {
    return hasRole(roles as any);
  };

  const checkPermissions = (permissionList: string[]) => {
    return hasAnyPermission(permissionList);
  };

  // Role update functionality using GraphQL
  const updateUserRole = async (
    userId: string,
    newRole: string
  ): Promise<boolean> => {
    setIsUpdating(true);
    try {
      const result = await updateUserMutation({
        variables: { 
          id: userId, 
          set: { role: newRole }
        }
      });

      if (result.data?.updateUserById) {
        toast.success(`User role updated to ${newRole}`);

        // Refresh current user data if updating own role
        if (userId === userId) {
          await refreshUserData();
        }

        return true;
      } else {
        throw new Error("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update user role"
      );
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Fetch user role info using GraphQL
  const fetchUserRoleInfo = async (
    userId: string
  ): Promise<UserRoleInfo | null> => {
    try {
      // This would use a direct Apollo query instead of the hook pattern
      // Since we need it to be async and not trigger re-renders
      // We'll keep this as a placeholder for now
      return null;
    } catch (error) {
      console.error("Error fetching user role info:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to fetch user information"
      );
      return null;
    }
  };

  // Role utilities
  const getAvailableRoles = (): RoleOption[] => {
    return [
      {
        value: "developer",
        label: "Developer",
        description: "Full system access and development tools",
      },
      {
        value: "org_admin",
        label: "Organization Admin",
        description: "Organization-level administration",
      },
      {
        value: "manager",
        label: "Manager",
        description: "Manages payroll operations and staff",
      },
      {
        value: "consultant",
        label: "Consultant",
        description: "Standard payroll processing capabilities",
      },
      {
        value: "viewer",
        label: "Viewer",
        description: "Read-only access to reports and data",
      },
    ];
  };

  const getRoleColor = (role: string): string => {
    const colors = {
      developer: "bg-purple-100 text-purple-800 border-purple-200",
      org_admin: "bg-orange-100 text-orange-800 border-orange-200",
      manager: "bg-blue-100 text-blue-800 border-blue-200",
      consultant: "bg-green-100 text-green-800 border-green-200",
      viewer: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[role as keyof typeof colors] || colors.viewer;
  };

  const getRolePermissions = (role: string): string[] => {
    const permissions = {
      developer: [
        "Full system access",
        "Development tools",
        "System administration",
        "All payroll operations",
        "Security management",
      ],
      org_admin: [
        "Organization administration",
        "User management (limited)",
        "All payroll operations",
        "Financial oversight",
        "Settings management",
      ],
      manager: [
        "Team management",
        "Client oversight",
        "Payroll approval",
        "Staff management",
        "Report generation",
      ],
      consultant: [
        "Payroll processing",
        "Client data entry",
        "Basic reporting",
        "View assigned clients",
      ],
      viewer: [
        "Read-only access",
        "Basic dashboard",
        "View reports",
        "View clients",
      ],
    };
    return permissions[role as keyof typeof permissions] || [];
  };

  // Navigation permissions
  const navigation = {
    canAccess: {
      dashboard: true,
      staff: hasPermission("staff:read"),
      payrolls: hasPermission("payroll:read"),
      clients: hasPermission("client:read"),
      settings: hasPermission("settings:write"),
      developer: userRole === "developer",
    }
  };

  return {
    // Core functionality
    userRole,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasRole: checkRole,
    checkPermissions,

    // User info
    userId,
    userEmail,
    userName,

    // Role management operations
    updateUserRole,
    fetchUserRoleInfo,
    isUpdating,

    // Role utilities
    getAvailableRoles,
    getRoleColor,
    getRolePermissions,

    // Navigation permissions
    navigation,
    isLoaded: !isLoading,
    canAccessDashboard: true,
  };
}