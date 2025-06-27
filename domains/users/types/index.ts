/**
 * Users Domain Types
 * Security Classification: CRITICAL - Employee PII and authentication data
 * SOC2 Compliance: Strict access controls with audit logging
 * 
 * Only contains domain-specific types, not core entities
 */

// Re-export core types from main types for domain convenience
export type { User, Role } from "@/types";
export type { CustomPermission as Permission } from "@/types/permissions";

// ===========================
// Domain-Specific Filter & Search Types
// ===========================

/**
 * User filtering options for user management
 */
export interface UserFilters {
  role?: Role;
  search?: string;
  managerId?: UUID;
  limit?: number;
  offset?: number;
}

/**
 * User permissions summary (domain-specific computation)
 */
export interface UserPermissions {
  canCreate: boolean;
  canManageUsers: boolean;
  canManagePayrolls: boolean;
  canViewReports: boolean;
  canManageClients: boolean;
  canManageSystem: boolean;
}

// ===========================
// Domain-Specific Form Types
// ===========================

/**
 * User creation form data
 */
export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  role?: Role;
  managerId?: UUID;
  isStaff?: boolean;
}

/**
 * User update form data
 */
export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: Role;
  managerId?: UUID;
  isStaff?: boolean;
}

/**
 * Staff creation form (legacy - consider consolidating with CreateUserData)
 */
export interface CreateStaffForm {
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isStaff: boolean;
}

/**
 * Staff edit form (legacy - consider consolidating with UpdateUserData)
 */
export interface StaffEditForm {
  name: string;
  email: string;
  username: string;
  role: Role;
  managerId: UUID;
  isStaff: boolean;
}

/**
 * User profile form data for settings page
 */
export interface UserProfileFormData {
  id: UUID;
  name: string;
  email: string;
  username: string;
  image: string;
  role: Role;
  isStaff: boolean;
  isActive: boolean;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
  clerkUserId: string;
  manager?: {
    id: UUID;
    name: string;
    email: string;
  };
}

// ===========================
// Domain-Specific Data Sync Types
// ===========================

/**
 * User synchronization data from Clerk
 */
export interface UserSyncData {
  clerkId: string;
  name: string;
  email: string;
  role?: Role;
  isStaff?: boolean;
  managerId?: UUID;
  image?: string;
}

// ===========================
// Legacy/Deprecated Types
// ===========================

/**
 * @deprecated Use main User type from @/types/interfaces
 * Manager interface - replace with User type
 */
export interface Manager {
  id: UUID;
  name: string;
  email: string;
  role: Role;
}

/**
 * @deprecated Use main User type from @/types/interfaces
 * Staff interface - this is essentially the same as User
 */
export interface Staff {
  id: UUID;
  email: string;
  name: string;
  role: Role;
  username?: string;
  image?: string;
  isStaff: boolean;
  managerId?: UUID;
  clerkUserId?: string;
  createdAt?: Timestamptz;
  updatedAt?: Timestamptz;
  manager?: {
    name: string;
    id: UUID;
    email: string;
  };
  leaves?: Array<{
    id: UUID;
    startDate: DateString;
    endDate: DateString;
    leaveType: LeaveType;
    reason: string;
    status: LeaveStatus;
  }>;
  label?: string;
}