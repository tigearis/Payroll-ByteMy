import { useEffect } from "react";
import { useUserManagement } from "./use-user-management";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface UseStaffManagementOptions {
  autoFetch?: boolean;
  pageSize?: number;
  role?: string;
}

export function useStaffManagement(options: UseStaffManagementOptions = {}) {
  const { autoFetch = true, pageSize = 10, role } = options;
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  
  const {
    users,
    managers,
    totalCount,
    currentUser,
    permissions,
    currentUserRole,
    loading,
    error,
    fetchUsers,
    updateUser,
    deleteUser,
    createUser,
    canAssignRole,
    canEditUser,
    canDeleteUser,
  } = useUserManagement();

  // Handle authentication state properly
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }
  }, [isLoaded, isSignedIn, router]);

  // Auto-fetch users when ready
  useEffect(() => {
    if (autoFetch && isLoaded && isSignedIn && !loading && !error) {
      const filters: any = {
        limit: pageSize,
        offset: 0,
      };
      if (role) {
        filters.role = role;
      }
      fetchUsers(filters);
    }
  }, [autoFetch, isLoaded, isSignedIn, loading, error, fetchUsers, pageSize, role]);

  // Computed states for UI
  const canCreateStaff = permissions?.canCreate || currentUserRole === "developer" || currentUserRole === "org_admin";
  const canViewStaff = permissions?.canManageUsers || currentUserRole !== "viewer";
  const isReady = isLoaded && isSignedIn && !loading;

  return {
    // State
    staff: users,
    managers,
    totalCount,
    currentUser,
    permissions,
    currentUserRole,
    loading: !isLoaded || loading,
    error,
    isReady,

    // Actions
    fetchStaff: fetchUsers,
    updateStaff: updateUser,
    deleteStaff: deleteUser,
    createStaff: createUser,

    // Permissions
    canCreateStaff,
    canViewStaff,
    canAssignRole,
    canEditUser,
    canDeleteUser,
  };
}