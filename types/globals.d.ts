// types/globals.d.ts
import { CustomPermission, Role } from "./permissions";

export {};

declare global {
  interface ClerkAuthorization {
    // Define roles that match your custom RBAC system
    role: Role;

    // Define custom permissions for native Clerk checking
    permission: CustomPermission;
  }

  // Enhanced JWT claims structure for custom permissions
  interface CustomJwtSessionClaims {
    "https://hasura.io/jwt/claims": {
      metadata: UserPublicMetadata;
      "x-hasura-role": Role;
      "x-hasura-user-id": string;
      "x-hasura-default-role": "viewer";
      "x-hasura-allowed-roles": [
        "developer",
        "org_admin",
        "manager",
        "consultant",
        "viewer",
      ];
      "x-hasura-clerk-user-id": string;
    };
    metadata: UserPublicMetadata;
  }

  interface UserPublicMetadata {
    role?: Role;
    databaseId?: string;
    permissions?: CustomPermission[];
    assignedBy?: string;
    assignedAt?: string;
    lastUpdated?: string;
    customAccess?: {
      restrictedPayrolls?: string[];
      allowedClients?: string[];
    };
    // Legacy fields
    onboardingComplete?: boolean;
    department?: string;
    employeeId?: string;
    startDate?: string;
  }

  interface UserPrivateMetadata {
    // any private metadata fields
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
}

// Enum for Payroll Status
export type PayrollStatus = "Active" | "Inactive" | "Implementation";

// Payroll Dates Interface (Matches Hasura Schema)
export interface PayrollDate {
  originalEftDate: string;
  adjustedEftDate: string;
  processingDate: string;
  notes?: string;
}

// Main Payroll Interface for UI & API
export interface Payroll {
  id: string;
  name: string;
  client: { name: string };
  payrollCycle?: { name: string };
  payrollDateType?: { name: string };
  processingDaysBeforeEft: number;
  payrollSystem?: string;
  date_value?: number;
  status: PayrollStatus;
  payroll_dates?: PayrollDate[]; // ✅ Updated type reference
  createdAt: string;
  updatedAt: string;
}

// Payroll Input for API Requests
export interface PayrollInput {
  clientId: string;
  name: string;
  cycleId: string;
  dateTypeId: string;
  dateValue?: number;
  primaryConsultantId?: string;
  backupConsultantId?: string;
  managerId?: string;
  processingDaysBeforeEft: number;
  payrollSystem?: string;
  status: PayrollStatus;
}

// Database Model for Payroll (matches Hasura schema)
export interface PayrollDB {
  id: string;
  name: string;
  clientId: string;
  cycleId: string;
  dateTypeId: string;
  dateValue?: number;
  primaryConsultantId?: string;
  backupConsultantId?: string;
  managerId?: string;
  processingDaysBeforeEft: number;
  payrollSystem?: string;
  status: PayrollStatus;
  createdAt: string;
  updatedAt: string;
}

// Notes for Payrolls or Clients
export interface NoteInput {
  entityType: "payroll" | "client";
  entityId: string;
  userId?: string;
  content: string;
  isImportant?: boolean;
}

// Notes in Database
export interface Note {
  id: string;
  entityType: "payroll" | "client";
  entityId: string;
  userId?: string;
  content: string;
  isImportant: boolean;
  createdAt: string;
  updatedAt: string;
}

// Client Interface
export interface Client {
  id: string;
  name: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Staff Interface
export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// User Interface (For Authentication & Role Management)
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}
