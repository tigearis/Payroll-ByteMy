import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/use-user-role";

import {
  GetUsersDocument,
  GetManagersDocument,
  CreateUserDocument,
  UpdateUserDocument,
  DeactivateUserDocument,
  GetUserStatsDocument,
} from "@/domains/users/graphql/generated/graphql";

export type UserRole =
  | "developer"
  | "org_admin"
  | "manager"
  | "consultant"
  | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  isStaff: boolean | null;
  isActive: boolean | null;
  managerId?: string | null;
  clerkUserId: string | null;
  username?: string | null;
  image?: string | null;
  managerUser?: {
    id: string;
    name: string;
    email: string;
  };
  subordinates?: User[];
  lastSignIn?: string;
  imageUrl?: string;
  emailVerified?: boolean;
}

export interface Manager {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface UserFilters {
  role?: string;
  search?: string;
  managerId?: string;
  limit?: number;
  offset?: number;
}

export interface UserPermissions {
  canCreate: boolean;
  canManageUsers: boolean;
}

export function useUserManagement() {
  const { getToken, userId } = useAuth();
  const { hasPermission } = useUserRole();
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  // GraphQL queries and mutations
  const { data: usersData, loading: usersLoading, refetch: refetchUsers } = useQuery(GetUsersDocument, {
    fetchPolicy: "cache-and-network"
  });

  const { data: managersData, loading: managersLoading } = useQuery(GetManagersDocument, {
    fetchPolicy: "cache-and-network"
  });

  const { data: statsData } = useQuery(GetUserStatsDocument, {
    fetchPolicy: "cache-first"
  });

  const [createUserMutation] = useMutation(CreateUserDocument);
  const [updateUserMutation] = useMutation(UpdateUserDocument);
  const [deactivateUserMutation] = useMutation(DeactivateUserDocument);

  // Computed state
  const users = usersData?.users || [];
  const managers = managersData?.users?.filter((u: any) => u.role === "manager" || u.role === "org_admin") || [];
  const totalCount = statsData?.usersAggregate?.aggregate?.count || 0;
  const currentUser = users.find((u: any) => u.clerkUserId === userId);
  const loading = usersLoading || managersLoading;

  // Permissions based on role
  const permissions: UserPermissions = {
    canCreate: hasPermission("staff:invite"),
    canManageUsers: hasPermission("staff:write"),
  };

  // Permission checking functions
  const canAssignRole = useCallback((targetRole: string): boolean => {
    // Use permission-based checks instead of hardcoded roles
    if (hasPermission("admin:manage")) return true; // Developer level
    if (hasPermission("settings:write")) return targetRole !== "developer"; // Org admin level
    if (hasPermission("staff:write")) return ["consultant", "viewer"].includes(targetRole); // Manager level
    return false;
  }, [hasPermission]);

  const canEditUser = useCallback((user: User): boolean => {
    // Use permission-based checks instead of hardcoded roles
    if (hasPermission("admin:manage")) return true; // Developer level
    if (hasPermission("settings:write")) return user.role !== "developer"; // Org admin level  
    if (hasPermission("staff:write")) return ["consultant", "viewer"].includes(user.role); // Manager level
    return false;
  }, [hasPermission]);

  const canDeleteUser = useCallback((user: User): boolean => {
    // Use permission-based checks instead of hardcoded roles
    if (hasPermission("admin:manage")) return true; // Developer level
    if (hasPermission("settings:write")) return user.role !== "developer"; // Org admin level
    return false;
  }, [hasPermission]);

  // Actions
  const fetchUsers = useCallback(async (filters: UserFilters = {}) => {
    try {
      await refetchUsers();
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  }, [refetchUsers]);

  const createUser = useCallback(async (userData: Partial<User>) => {
    try {
      const result = await createUserMutation({
        variables: {
          object: {
            name: userData.name!,
            email: userData.email!,
            role: userData.role!,
            isStaff: userData.isStaff || false,
            managerId: userData.managerId || null,
            clerkUserId: userData.clerkUserId!,
          }
        }
      });

      if (result.data?.insertUser) {
        toast.success("User created successfully");
        await refetchUsers();
        return result.data.insertUser;
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
      throw error;
    }
    return null;
  }, [createUserMutation, refetchUsers]);

  const updateUser = useCallback(async (userId: string, updates: Partial<User>) => {
    try {
      const result = await updateUserMutation({
        variables: {
          id: userId,
          set: {
            ...(updates.name && { name: updates.name }),
            ...(updates.email && { email: updates.email }),
            ...(updates.role && { role: updates.role }),
            ...(updates.managerId !== undefined && { managerId: updates.managerId }),
            ...(updates.isStaff !== undefined && { isStaff: updates.isStaff }),
            ...(updates.isActive !== undefined && { isActive: updates.isActive }),
          }
        }
      });

      if (result.data?.updateUserById) {
        toast.success("User updated successfully");
        await refetchUsers();
        return result.data.updateUserById;
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
      throw error;
    }
    return null;
  }, [updateUserMutation, refetchUsers]);

  const updateUserRole = useCallback(async (userId: string, newRole: string) => {
    try {
      const result = await updateUserMutation({
        variables: { 
          id: userId, 
          set: { role: newRole }
        }
      });

      if (result.data?.updateUserById) {
        toast.success(`User role updated to ${newRole}`);
        await refetchUsers();
        return result.data.updateUserById;
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
      throw error;
    }
    return null;
  }, [updateUserMutation, refetchUsers]);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      const result = await deactivateUserMutation({
        variables: { id: userId }
      });

      if (result.data?.updateUserById) {
        toast.success("User deactivated successfully");
        await refetchUsers();
        return result.data.updateUserById;
      }
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast.error("Failed to deactivate user");
      throw error;
    }
    return null;
  }, [deactivateUserMutation, refetchUsers]);

  return {
    // State
    users,
    managers,
    totalCount,
    currentUser,
    permissions,
    currentUserRole,
    loading,
    error: null,

    // Actions
    fetchUsers,
    updateUser,
    deleteUser,
    createUser,
    updateUserRole,

    // Permissions
    canAssignRole,
    canEditUser,
    canDeleteUser,
  };
}