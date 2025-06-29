/**
 * Simplified User Management Hook
 * 
 * Provides basic user management functionality with role-based access control.
 */

import { useState, useCallback } from "react";
import { useAuthContext, migration, type SimpleRole } from "@/lib/auth";

export interface UserManagementState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

export function useUserManagement() {
  const { userRole, isAuthenticated } = useAuthContext();
  const [state, setState] = useState<UserManagementState>({
    isLoading: false,
    error: null,
    success: null,
  });

  // Check if user can manage other users
  const canManageUsers = isAuthenticated && migration.hasPermission("staff:write", userRole);
  const canDeleteUsers = isAuthenticated && migration.hasPermission("staff:delete", userRole);
  const canChangeRoles = isAuthenticated && migration.hasPermission("staff:write", userRole);

  // Update user role
  const updateUserRole = useCallback(async (userId: string, newRole: SimpleRole) => {
    if (!canChangeRoles) {
      setState(prev => ({ ...prev, error: "You don't have permission to change user roles" }));
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // In a real implementation, this would call your API
      const response = await fetch(`/api/staff/update-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        success: "User role updated successfully" 
      }));
      return true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to update user role" 
      }));
      return false;
    }
  }, [canChangeRoles]);

  // Delete user
  const deleteUser = useCallback(async (userId: string) => {
    if (!canDeleteUsers) {
      setState(prev => ({ ...prev, error: "You don't have permission to delete users" }));
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`/api/staff/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        success: "User deleted successfully" 
      }));
      return true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to delete user" 
      }));
      return false;
    }
  }, [canDeleteUsers]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, error: null, success: null }));
  }, []);

  return {
    // State
    ...state,
    
    // Permissions
    canManageUsers,
    canDeleteUsers,
    canChangeRoles,
    
    // Actions
    updateUserRole,
    deleteUser,
    clearMessages,
    
    // User info
    currentUserRole: userRole,
    isAuthenticated,
  };
}