import { useState } from "react";
import { useAuthContext } from "@/lib/auth/auth-context";
import { toast } from "sonner";

export interface UserRoleInfo {
  userId: string;
  role: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  canModify: boolean;
}

export function useUserRoleManagement() {
  const { refreshUserData } = useAuthContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const updateUserRole = async (
    userId: string,
    newRole: string
  ): Promise<boolean> => {
    setIsUpdating(true);
    try {
      const response = await fetch("/api/update-user-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          role: newRole,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update user role");
      }

      const result = await response.json();

      toast.success(result.message || `User role updated to ${newRole}`);

      // Refresh current user data if updating own role
      const currentUserStr = localStorage.getItem("currentUserId");
      if (currentUserStr === userId) {
        await refreshUserData();
      }

      return true;
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

  const fetchUserRoleInfo = async (
    userId: string
  ): Promise<UserRoleInfo | null> => {
    setIsFetching(true);
    try {
      const response = await fetch(`/api/update-user-role?userId=${userId}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch user role information");
      }

      const userInfo = await response.json();
      return userInfo;
    } catch (error) {
      console.error("Error fetching user role info:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to fetch user information"
      );

      return null;
    } finally {
      setIsFetching(false);
    }
  };

  const getAvailableRoles = () => {
    return [
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

  const getRoleColor = (role: string) => {
    const colors = {
      org_admin: "bg-orange-100 text-orange-800 border-orange-200",
      manager: "bg-blue-100 text-blue-800 border-blue-200",
      consultant: "bg-green-100 text-green-800 border-green-200",
      viewer: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[role as keyof typeof colors] || colors.viewer;
  };

  const getRolePermissions = (role: string) => {
    const permissions = {
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

  return {
    updateUserRole,
    fetchUserRoleInfo,
    getAvailableRoles,
    getRoleColor,
    getRolePermissions,
    isUpdating,
    isFetching,
  };
}
