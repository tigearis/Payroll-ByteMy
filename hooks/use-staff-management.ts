/**
 * Simplified Staff Management Hook
 * 
 * Provides staff management functionality with simplified permission checks.
 */

import { useState, useCallback } from "react";
import { useAuthContext, migration } from "@/lib/auth";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  isStaff: boolean;
  createdAt: string;
  updatedAt: string;
  managerId?: string;
}

export interface StaffManagementState {
  staff: StaffMember[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  isReady: boolean;
}

export interface FetchStaffOptions {
  limit?: number;
  offset?: number;
  search?: string;
}

export function useStaffManagement() {
  const { userRole, isAuthenticated } = useAuthContext();
  const [state, setState] = useState<StaffManagementState>({
    staff: [],
    loading: false,
    error: null,
    totalCount: 0,
    isReady: true,
  });

  // Permission checks
  const canViewStaff = isAuthenticated && migration.hasPermission("staff:read", userRole);
  const canCreateStaff = isAuthenticated && migration.hasPermission("staff:write", userRole);
  const canEditUser = useCallback((user: StaffMember) => {
    return isAuthenticated && migration.hasPermission("staff:write", userRole);
  }, [isAuthenticated, userRole]);
  
  const canDeleteUser = useCallback((user: StaffMember) => {
    return isAuthenticated && migration.hasPermission("staff:delete", userRole);
  }, [isAuthenticated, userRole]);

  // Fetch staff function
  const fetchStaff = useCallback(async (options: FetchStaffOptions = {}) => {
    if (!canViewStaff) {
      setState(prev => ({ ...prev, error: "You don't have permission to view staff" }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // In a real implementation, this would call your GraphQL API
      const response = await fetch("/api/staff?" + new URLSearchParams({
        limit: (options.limit || 50).toString(),
        offset: (options.offset || 0).toString(),
        ...(options.search && { search: options.search }),
      }));

      if (!response.ok) {
        throw new Error("Failed to fetch staff");
      }

      const data = await response.json();
      
      setState(prev => ({
        ...prev,
        loading: false,
        staff: data.staff || [],
        totalCount: data.totalCount || 0,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch staff",
      }));
    }
  }, [canViewStaff]);

  // Create staff function
  const createStaff = useCallback(async (staffData: Partial<StaffMember>) => {
    if (!canCreateStaff) {
      setState(prev => ({ ...prev, error: "You don't have permission to create staff" }));
      return false;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch("/api/staff/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(staffData),
      });

      if (!response.ok) {
        throw new Error("Failed to create staff member");
      }

      setState(prev => ({ ...prev, loading: false }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to create staff member",
      }));
      return false;
    }
  }, [canCreateStaff]);

  // Update staff function
  const updateStaff = useCallback(async (staffId: string, updates: Partial<StaffMember>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`/api/staff/${staffId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update staff member");
      }

      setState(prev => ({ ...prev, loading: false }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to update staff member",
      }));
      return false;
    }
  }, []);

  // Delete staff function
  const deleteStaff = useCallback(async (staffId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`/api/staff/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: staffId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete staff member");
      }

      setState(prev => ({ ...prev, loading: false }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to delete staff member",
      }));
      return false;
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    ...state,
    
    // Permissions
    canViewStaff,
    canCreateStaff,
    canEditUser,
    canDeleteUser,
    
    // Actions
    fetchStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    clearError,
    
    // User info
    currentUserRole: userRole,
    isAuthenticated,
  };
}