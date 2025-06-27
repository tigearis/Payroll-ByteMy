// types/global.d.ts
// Global type declarations for the Payroll ByteMy system
// Re-exports Hasura-generated enums and defines global utility types

import type { 
  CustomPermission, 
  Role as AuthRole,
  UserMetadata as AuthUserMetadata 
} from "./permissions";

// Import generated GraphQL types (these will include Hasura enum types)
// Note: Update these import paths based on your actual generated types location
import type {
  PayrollStatus as GraphQLPayrollStatus,
  PayrollCycleType as GraphQLPayrollCycleType,
  PayrollDateType as GraphQLPayrollDateType,
  LeaveStatus as GraphQLLeaveStatus,
  UserRole as GraphQLUserRole,
  PermissionAction as GraphQLPermissionAction,
  Status as GraphQLStatus
} from "../shared/types/generated/graphql";

export {};

declare global {
  // ===========================
  // Re-export Hasura Enums Globally
  // ===========================
  
  // Business enums from Hasura
  type PayrollStatus = GraphQLPayrollStatus;
  type PayrollCycleType = GraphQLPayrollCycleType;
  type PayrollDateType = GraphQLPayrollDateType;
  type LeaveStatus = GraphQLLeaveStatus;
  type Role = AuthRole; // Use auth system Role type
  type PermissionAction = GraphQLPermissionAction;
  type Status = GraphQLStatus;
  
  // Weekday enums (from Hasura custom types)
  type BusinessWeekday = "1" | "2" | "3" | "4" | "5";
  type FortnightlyWeek = "A" | "B";
  
  // ===========================
  // Global Scalar Type Aliases
  // ===========================
  
  type UUID = string;
  type Timestamp = string;
  type Timestamptz = string;
  type DateString = string;
  type JSONValue = any;
  type Numeric = number | string;
  
  // ===========================
  // Clerk Integration Types
  // ===========================
  
  interface ClerkAuthorization {
    role: Role;
    permission: CustomPermission;
  }

  // Enhanced JWT claims structure for custom permissions
  interface CustomJwtSessionClaims {
    "https://hasura.io/jwt/claims": {
      metadata: UserPublicMetadata;
      "x-hasura-role": Role;
      "x-hasura-user-id": string;
      "x-hasura-default-role": "viewer";
      "x-hasura-allowed-roles": Role[];
      "x-hasura-clerk-user-id": string;
    };
    metadata: UserPublicMetadata;
  }

  interface UserPublicMetadata extends AuthUserMetadata {
    // Additional UI-specific fields
    onboardingComplete?: boolean;
    department?: string;
    employeeId?: string;
    startDate?: string;
  }

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

  // ===========================
  // Common Entity Types
  // ===========================
  
  // Note entity type enum (should be added to Hasura)
  type EntityType = "payroll" | "client";
  
  // Event type enum (should be added to Hasura)
  type EventType = "payroll" | "holiday" | "leave";
  
  // Leave type enum (already in Hasura)
  type LeaveType = "Annual" | "Sick" | "Other";

  // ===========================
  // Global Interfaces
  // ===========================
  
  /**
   * PayrollDate interface (used globally)
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
}