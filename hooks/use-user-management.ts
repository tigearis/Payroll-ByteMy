/**
 * User Management Hook
 * 
 * Provides user management functionality with hierarchical permission checking
 */

"use client";

import { useCallback, useState } from "react";
import { useHierarchicalPermissions } from "./use-hierarchical-permissions";
import type { UserRole } from "@/lib/permissions/hierarchical-permissions";

export interface UserManagementHook {
  // Permission checks
  canCreateUser: boolean;
  canUpdateUser: boolean;
  canDeleteUser: boolean;
  canManageRoles: boolean;
  canInviteUsers: boolean;
  
  // User operations
  createUser: (userData: CreateUserData) => Promise<CreateUserResult>;
  updateUser: (userId: string, userData: UpdateUserData) => Promise<UpdateUserResult>;
  deleteUser: (userId: string) => Promise<DeleteUserResult>;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<UpdateRoleResult>;
  inviteUser: (email: string, role: UserRole) => Promise<InviteUserResult>;
  
  // State
  isLoading: boolean;
  error: string | null;
}

export interface CreateUserData {
  name: string;
  email: string;
  role: UserRole;
  managerId?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  isActive?: boolean;
  managerId?: string;
}

export interface CreateUserResult {
  success: boolean;
  user?: any;
  error?: string;
}

export interface UpdateUserResult {
  success: boolean;
  user?: any;
  error?: string;
}

export interface DeleteUserResult {
  success: boolean;
  error?: string;
}

export interface UpdateRoleResult {
  success: boolean;
  error?: string;
}

export interface InviteUserResult {
  success: boolean;
  invitation?: any;
  error?: string;
}

/**
 * User Management Hook with hierarchical permissions
 */
export function useUserManagement(): UserManagementHook {
  const { hasPermission, hasAnyPermission, userRole } = useHierarchicalPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Permission checks
  const canCreateUser = hasPermission("staff.create");
  const canUpdateUser = hasPermission("staff.update");
  const canDeleteUser = hasPermission("staff.delete");
  const canManageRoles = hasAnyPermission(["users.manage", "admin.manage"]);
  const canInviteUsers = hasPermission("invitations.create");

  /**
   * Create a new user
   */
  const createUser = useCallback(async (userData: CreateUserData): Promise<CreateUserResult> => {
    if (!canCreateUser) {
      return { success: false, error: "Insufficient permissions to create users" };
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/staff/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, user: result.user };
      } else {
        const errorMessage = result.error || "Failed to create user";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = "Network error while creating user";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [canCreateUser]);

  /**
   * Update an existing user
   */
  const updateUser = useCallback(async (userId: string, userData: UpdateUserData): Promise<UpdateUserResult> => {
    if (!canUpdateUser) {
      return { success: false, error: "Insufficient permissions to update users" };
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/staff/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, user: result.user };
      } else {
        const errorMessage = result.error || "Failed to update user";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = "Network error while updating user";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [canUpdateUser]);

  /**
   * Delete a user
   */
  const deleteUser = useCallback(async (userId: string): Promise<DeleteUserResult> => {
    if (!canDeleteUser) {
      return { success: false, error: "Insufficient permissions to delete users" };
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/staff/${userId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        const errorMessage = result.error || "Failed to delete user";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = "Network error while deleting user";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [canDeleteUser]);

  /**
   * Update user role
   */
  const updateUserRole = useCallback(async (userId: string, newRole: UserRole): Promise<UpdateRoleResult> => {
    if (!canManageRoles) {
      return { success: false, error: "Insufficient permissions to manage user roles" };
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/staff/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        const errorMessage = result.error || "Failed to update user role";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = "Network error while updating user role";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [canManageRoles]);

  /**
   * Invite a new user
   */
  const inviteUser = useCallback(async (email: string, role: UserRole): Promise<InviteUserResult> => {
    if (!canInviteUsers) {
      return { success: false, error: "Insufficient permissions to invite users" };
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/invitations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role }),
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, invitation: result.invitation };
      } else {
        const errorMessage = result.error || "Failed to send invitation";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = "Network error while sending invitation";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [canInviteUsers]);

  return {
    // Permission checks
    canCreateUser,
    canUpdateUser,
    canDeleteUser,
    canManageRoles,
    canInviteUsers,
    
    // User operations
    createUser,
    updateUser,
    deleteUser,
    updateUserRole,
    inviteUser,
    
    // State
    isLoading,
    error,
  };
}

/**
 * Hook for role-specific user management permissions
 */
export function useUserManagementPermissions() {
  const { hasPermission, hasAnyPermission, userRole } = useHierarchicalPermissions();

  return {
    // Basic permissions
    canViewUsers: hasPermission("staff.read"),
    canCreateUsers: hasPermission("staff.create"),
    canUpdateUsers: hasPermission("staff.update"),
    canDeleteUsers: hasPermission("staff.delete"),
    
    // Advanced permissions
    canManageRoles: hasAnyPermission(["users.manage", "admin.manage"]),
    canInviteUsers: hasPermission("invitations.create"),
    canManageInvitations: hasPermission("invitations.manage"),
    
    // Admin-specific
    canAccessUserAudit: hasPermission("audit.read"),
    canManageUserSecurity: hasPermission("security.manage"),
    
    // Current user info
    userRole,
    isAdmin: userRole === "org_admin" || userRole === "developer",
    isManager: userRole === "manager" || userRole === "org_admin" || userRole === "developer",
  };
}