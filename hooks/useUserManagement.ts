import { useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";

export type UserRole =
  | "admin"
  | "org_admin"
  | "manager"
  | "consultant"
  | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  is_staff: boolean;
  manager_id?: string;
  clerk_user_id: string;
  manager?: {
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
  canManagePayrolls: boolean;
  canViewReports: boolean;
  canManageClients: boolean;
  canManageSystem: boolean;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  managerId?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: UserRole;
  managerId?: string;
  isStaff?: boolean;
}

interface UseUserManagementReturn {
  // State
  users: User[];
  managers: Manager[];
  totalCount: number;
  currentUser: User | null;
  permissions: UserPermissions | null;
  currentUserRole: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchUsers: (filters?: UserFilters) => Promise<void>;
  fetchUserById: (id: string) => Promise<User | null>;
  createUser: (userData: CreateUserData) => Promise<boolean>;
  updateUser: (id: string, userData: UpdateUserData) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  clearError: () => void;

  // Utility
  canAssignRole: (targetRole: string) => boolean;
  canEditUser: (user: User) => boolean;
  canDeleteUser: (user: User) => boolean;
}

export function useUserManagement(): UseUserManagementReturn {
  const { getToken, userId } = useAuth();

  // State
  const [users, setUsers] = useState<User[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to make authenticated API requests
  const makeRequest = useCallback(
    async (url: string, options: RequestInit = {}) => {
      try {
        const token = await getToken({ template: "hasura" });
        console.log("🔑 Making API request to:", url);
        console.log("🔑 Token present:", !!token);
        console.log("🔑 Token length:", token?.length || 0);
        
        const response = await fetch(url, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
          },
        });

        console.log("📡 Response status:", response.status);
        console.log("📡 Response redirected:", response.redirected);
        console.log("📡 Response URL:", response.url);

        // Check if the response is a redirect (auth issue)
        if (response.redirected) {
          throw new Error("Authentication required. Please sign in again.");
        }

        // Check if the response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          throw new Error(`Unexpected response: ${text}`);
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || `HTTP ${response.status}: ${response.statusText}`
          );
        }

        return data;
      } catch (err) {
        console.error("API request failed:", err);
        throw err;
      }
    },
    [getToken]
  );

  // Fetch users with filtering and pagination
  const fetchUsers = useCallback(
    async (filters: UserFilters = {}) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (filters.role && filters.role !== "all")
          params.append("role", filters.role);
        if (filters.search) params.append("search", filters.search);
        if (filters.managerId && filters.managerId !== "all")
          params.append("managerId", filters.managerId);
        if (filters.limit) params.append("limit", filters.limit.toString());
        if (filters.offset) params.append("offset", filters.offset.toString());

        const url = `/api/users${
          params.toString() ? `?${params.toString()}` : ""
        }`;
        const data = await makeRequest(url);

        if (data.success) {
          setUsers(data.users || []);
          setManagers(data.managers || []);
          setTotalCount(data.totalCount || 0);
          setPermissions(data.permissions || null);
          setCurrentUserRole(data.currentUserRole || null);
        } else {
          throw new Error(data.error || "Failed to fetch users");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch users";
        setError(errorMessage);
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  // Fetch a specific user by ID
  const fetchUserById = useCallback(
    async (id: string): Promise<User | null> => {
      setLoading(true);
      setError(null);

      try {
        const data = await makeRequest(`/api/users/${id}`);

        if (data.success) {
          const user = data.user;
          setCurrentUser(user);
          return user;
        } else {
          throw new Error(data.error || "Failed to fetch user");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch user";
        setError(errorMessage);
        console.error("Error fetching user:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  // Create a new user
  const createUser = useCallback(
    async (userData: CreateUserData): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        // Prepare data for staff creation endpoint
        const requestData = {
          name: `${userData.firstName} ${userData.lastName}`.trim(),
          email: userData.email,
          role: userData.role || "viewer", // Default to viewer
          managerId: userData.managerId,
          is_staff: true,
          inviteToClerk: true,
        };

        const data = await makeRequest("/api/staff/create", {
          method: "POST",
          body: JSON.stringify(requestData),
        });

        if (data.success) {
          // Refresh the users list
          await fetchUsers();
          return true;
        } else {
          throw new Error(data.error || "Failed to create user");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create user";
        setError(errorMessage);
        console.error("Error creating user:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest, fetchUsers]
  );

  // Update a user
  const updateUser = useCallback(
    async (id: string, userData: UpdateUserData): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const data = await makeRequest(`/api/users/${id}`, {
          method: "PUT",
          body: JSON.stringify(userData),
        });

        if (data.success) {
          // Update the user in local state
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === id || user.clerk_user_id === id
                ? { ...user, ...userData, updated_at: new Date().toISOString() }
                : user
            )
          );

          // Update current user if it's the same user
          if (
            currentUser &&
            (currentUser.id === id || currentUser.clerk_user_id === id)
          ) {
            setCurrentUser((prev) => (prev ? { ...prev, ...userData } : null));
          }

          return true;
        } else {
          throw new Error(data.error || "Failed to update user");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update user";
        setError(errorMessage);
        console.error("Error updating user:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest, currentUser]
  );

  // Delete a user
  const deleteUser = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const data = await makeRequest(`/api/users/${id}`, {
          method: "DELETE",
        });

        if (data.success) {
          // Remove user from local state
          setUsers((prevUsers) =>
            prevUsers.filter(
              (user) => user.id !== id && user.clerk_user_id !== id
            )
          );
          setTotalCount((prev) => Math.max(0, prev - 1));

          return true;
        } else {
          throw new Error(data.error || "Failed to delete user");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete user";
        setError(errorMessage);
        console.error("Error deleting user:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Utility functions
  const canAssignRole = useCallback(
    (targetRole: string): boolean => {
      if (!currentUserRole) return false;

      // Role hierarchy levels
      const roleHierarchy: Record<string, number> = {
        admin: 5, // Developers
        org_admin: 4, // Standard Admins
        manager: 3,
        consultant: 2,
        viewer: 1,
      };

      const currentLevel = roleHierarchy[currentUserRole] || 0;
      const targetLevel = roleHierarchy[targetRole] || 0;

      // Developers (admin) and Standard Admins (org_admin) can assign any role
      if (currentUserRole === "admin" || currentUserRole === "org_admin")
        return true;

      // Managers can assign consultant and viewer roles
      if (
        currentUserRole === "manager" &&
        (targetRole === "consultant" || targetRole === "viewer")
      ) {
        return true;
      }

      return currentLevel > targetLevel;
    },
    [currentUserRole]
  );

  const canEditUser = useCallback(
    (user: User): boolean => {
      if (!permissions || !userId) return false;

      // Users can edit their own profile
      if (user.clerk_user_id === userId) return true;

      // Admins and managers can edit others
      return permissions.canManageUsers;
    },
    [permissions, userId]
  );

  const canDeleteUser = useCallback(
    (user: User): boolean => {
      if (!permissions || !userId) return false;

      // Cannot delete yourself
      if (user.clerk_user_id === userId) return false;

      // Only admins can delete other admins
      if (user.role === "org_admin" && currentUserRole !== "org_admin")
        return false;

      // Must have user management permissions
      return permissions.canManageUsers;
    },
    [permissions, userId, currentUserRole]
  );

  return {
    // State
    users,
    managers,
    totalCount,
    currentUser,
    permissions,
    currentUserRole,
    loading,
    error,

    // Actions
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    clearError,

    // Utility
    canAssignRole,
    canEditUser,
    canDeleteUser,
  };
}
