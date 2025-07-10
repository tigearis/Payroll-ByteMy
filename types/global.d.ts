// types/global.d.ts
// Global type declarations for the Payroll ByteMy system
// Centralised type definitions for consistency across the application

// Import generated GraphQL types from Hasura
import type {
  PayrollStatus as GraphQLPayrollStatus,
  PayrollCycleType as GraphQLPayrollCycleType,
  PayrollDateType as GraphQLPayrollDateType,
  LeaveStatus as GraphQLLeaveStatus,
  PermissionAction as GraphQLPermissionAction,
  Status as GraphQLStatus,
} from "../shared/types/generated/graphql";

// Import auth-specific types
import type {
  Permission,
  Role as AuthRole,
  UserMetadata as AuthUserMetadata,
} from "./permissions";

export {};

declare global {
  // ===========================
  // HASURA ENUM RE-EXPORTS
  // ===========================

  // Business domain enums from Hasura GraphQL schema
  type PayrollStatus = GraphQLPayrollStatus;
  type PayrollCycleType = GraphQLPayrollCycleType;
  type PayrollDateType = GraphQLPayrollDateType;
  type LeaveStatus = GraphQLLeaveStatus;
  type PermissionAction = GraphQLPermissionAction;
  type Status = GraphQLStatus;
  type Role = AuthRole;

  // Custom business enums
  type BusinessWeekday = "1" | "2" | "3" | "4" | "5";
  type FortnightlyWeek = "A" | "B";
  type EntityType = "payroll" | "client";
  type EventType = "payroll" | "holiday" | "leave";
  type LeaveType = "Annual" | "Sick" | "Other";

  // ===========================
  // SCALAR TYPE ALIASES
  // ===========================

  type UUID = string;
  type Timestamp = string;
  type Timestamptz = string;
  type DateString = string;
  type JSONValue = any;
  type Numeric = number | string;

  // ===========================
  // CLERK AUTHENTICATION TYPES
  // ===========================

  /**
   * User public metadata structure (stored in Clerk and used in JWT)
   * This data is accessible client-side and included in JWT tokens
   */
  interface UserPublicMetadata extends AuthUserMetadata {
    // Database identifier (used as x-hasura-user-id)
    databaseId?: string;

    // Role and permissions (used in JWT claims)
    role?: Role;
    allowedRoles?: Role[] | string;
    
    // Enhanced permission overrides (included in JWT template)
    permissionOverrides?: Permission[];

    // Additional business fields
    onboardingComplete?: boolean;
    department?: string;
    employeeId?: string;
    startDate?: string;
  }

  /**
   * User private metadata structure (stored in Clerk, not in JWT)
   * This data is only accessible server-side
   */
  interface UserPrivateMetadata {
    securitySettings?: {
      mfaEnabled: boolean;
      lastPasswordChange?: string;
      securityQuestions?: boolean;
    };
    auditInfo?: {
      lastLogin?: string;
      loginCount?: number;
      createdBy?: string;
    };
  }

  /**
   * Hasura JWT claims structure (matches your Clerk template exactly)
   * This is what gets embedded in the JWT token
   */
  interface HasuraJWTClaims {
    "x-hasura-user-id": string; // {{user.publicmetadata.databaseId}}
    "x-hasura-default-role": string; // {{user.publicmetadata.role || 'viewer'}}
    "x-hasura-allowed-roles": string; // {{user.publicmetadata.allowedRoles || 'viewer'}}
    "x-hasura-clerk-user-id": string; // {{user.id}}
    "x-hasura-permission-overrides": string; // {{user.publicmetadata.permissionOverrides}} as JSON string
  }

  /**
   * Complete session claims structure from Clerk
   * This is what you get from auth() or useAuth()
   */
  interface ClerkSessionClaims {
    "https://hasura.io/jwt/claims": HasuraJWTClaims;
    publicMetadata: UserPublicMetadata;
    privateMetadata: UserPrivateMetadata;
    // Additional Clerk standard claims
    sub: string;
    iat: number;
    exp: number;
    iss: string;
    aud: string;
  }

  // ===========================
  // TOKEN & AUTH UTILITY TYPES
  // ===========================

  /**
   * Result type for token operations
   */
  interface TokenResult {
    token: string | null;
    userId: string | null; // Database ID (from publicmetadata.databaseId)
    clerkUserId: string | null; // Clerk user ID
    error?: string;
  }


  /**
   * Authorization headers for API requests
   */
  interface AuthHeaders {
    authorization?: string;
  }

  /**
   * Complete authorization context
   */
  interface AuthorizationContext {
    userId: string | null;
    clerkUserId: string | null;
    role: string;
    allowedRoles: string[];
    permissionOverrides: Permission[] | null;
  }

  /**
   * Enhanced claims result with permission overrides
   */
  interface ClaimsResult {
    userId: string | null; // Database ID
    clerkUserId: string | null; // Clerk user ID
    claims: any;
    role: string;
    allowedRoles: string[];
    permissionOverrides?: Permission[] | null;
    hasuraClaims?: HasuraJWTClaims;
    hasCompleteData?: boolean;
    error?: string;
  }

  /**
   * Enhanced permission context for contextual permission checking
   */
  interface PermissionContext {
    clientId?: string;
    payrollId?: string;
    userId?: string;
    organizationId?: string;
    resourceType?: 'client' | 'payroll' | 'user' | 'organization';
    resourceId?: string;
  }

  /**
   * Permission validation result with detailed feedback
   */
  interface PermissionValidationResult {
    hasPermission: boolean;
    reason?: string;
    suggestedAction?: string;
    requiredRole?: Role;
    currentRole?: Role;
    missingPermissions?: string[];
  }

  /**
   * Enhanced permission check result for UI components
   */
  interface PermissionResult {
    granted: boolean;
    reason?: string | undefined;
    requiredRole?: string;
    currentRole?: string;
    suggestions?: string[];
    context?: Record<string, any>;
  }

  // ===========================
  // BUSINESS ENTITY INTERFACES
  // ===========================

  /**
   * PayrollDate interface for scheduling
   * @security MEDIUM - Internal scheduling data
   */
  interface PayrollDate {
    id: UUID;
    payrollId: UUID;
    originalEftDate: DateString;
    adjustedEftDate: DateString;
    processingDate: DateString;
    notes?: string;
    createdAt: Timestamptz;
    updatedAt: Timestamptz;
  }

  /**
   * Base entity interface for common fields
   */
  interface BaseEntity {
    id: UUID;
    createdAt: Timestamptz;
    updatedAt: Timestamptz;
    createdBy?: UUID;
    updatedBy?: UUID;
  }

  /**
   * Audit trail interface
   */
  interface AuditLog extends BaseEntity {
    entityType: EntityType;
    entityId: UUID;
    action: string;
    oldValues?: JSONValue;
    newValues?: JSONValue;
    userId: UUID;
  }

  // ===========================
  // UTILITY HELPER TYPES
  // ===========================

  /**
   * Make specific properties optional
   */
  type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

  /**
   * Make specific properties required
   */
  type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

  /**
   * Extract enum values as union type
   */
  type EnumValues<T> = T[keyof T];

  /**
   * API response wrapper
   */
  interface ApiResponse<T = any> {
    data?: T;
    error?: {
      message: string;
      code?: string;
      details?: any;
    };
    success: boolean;
  }

  /**
   * Pagination metadata
   */
  interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }

  /**
   * Paginated response
   */
  interface PaginatedResponse<T> extends ApiResponse<T[]> {
    meta: PaginationMeta;
  }

  // ===========================
  // FORM & VALIDATION TYPES
  // ===========================

  /**
   * Form field error
   */
  interface FieldError {
    field: string;
    message: string;
    code?: string;
  }

  /**
   * Validation result
   */
  interface ValidationResult {
    isValid: boolean;
    errors: FieldError[];
  }

  /**
   * Form state for complex forms
   */
  interface FormState<T = any> {
    data: T;
    errors: FieldError[];
    isSubmitting: boolean;
    isValid: boolean;
    isDirty: boolean;
  }
}
