// Users Domain Types
// Security Classification: CRITICAL - Employee PII and authentication data
// SOC2 Compliance: Strict access controls with audit logging

// Extracted from inline TypeScript interfaces and types

export type UserRole = "developer" | "org_admin" | "manager" | "consultant" | "viewer";

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

// Extracted from staff page
export interface Staff {
  id: string;
  email: string;
  name: string;
  role: string;
  username?: string;
  image?: string;
  is_staff: boolean;
  manager_id?: string;
  clerk_user_id?: string;
  created_at?: string;
  updated_at?: string;
  manager?: {
    name: string;
    id: string;
    email: string;
  };
  leaves?: Array<{
    id: string;
    start_date: string;
    end_date: string;
    leave_type: string;
    reason: string;
    status: string;
  }>;
  label?: string;
}

export interface StaffEditForm {
  name: string;
  email: string;
  username: string;
  role: string;
  manager_id: string;
  is_staff: boolean;
}

export interface CreateStaffForm {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  is_staff: boolean;
}

// Profile types from settings page
export interface UserProfileFormData {
  id: string;
  name: string;
  email: string;
  username: string;
  image: string;
  role: string;
  is_staff: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  clerk_user_id: string;
  manager?: {
    id: string;
    name: string;
    email: string;
  };
}

// User sync types
export interface UserSyncData {
  clerkId: string;
  name: string;
  email: string;
  role?: UserRole;
  isStaff?: boolean;
  managerId?: string;
  image?: string;
}