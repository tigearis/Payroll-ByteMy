// TypeScript type definitions for the redesigned payroll detail system
// Generated from GraphQL schema and enhanced for type safety

import type {
  GetPayrollDetailRedesignedQuery,
} from "@/domains/payrolls/graphql/generated/graphql";

// Core payroll data type from GraphQL
export type PayrollDetailData = NonNullable<GetPayrollDetailRedesignedQuery["payrollsByPk"]>;

// User type with computed properties
export interface PayrollUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  computedName?: string | null;
  email?: string | null;
  role: string;
  isActive: boolean;
  image?: string | null;
  // Computed display name
  displayName: string;
  // User initials for avatar fallback
  initials: string;
  // Formatted role name
  roleDisplay: string;
}

// Client information interface
export interface PayrollClient {
  id: string;
  name: string;
  active?: boolean | null;
  contactEmail?: string | null;
  contactPerson?: string | null;
}

// Payroll date interface with status information
export interface PayrollDate {
  id: string;
  originalEftDate: string;
  adjustedEftDate: string | null;
  processingDate: string | null;
  notes?: string | null;
  status?: string | null;
  completedAt?: string | null;
  createdAt: string;
  // Computed properties
  isAdjusted: boolean;
  isOverdue: boolean;
  displayDate: string;
  relativeDate: string;
}

// Schedule configuration interface
export interface PayrollSchedule {
  cycle: {
    id: string;
    name: string;
    description?: string | null;
  };
  dateType?: {
    id: string;
    name: string;
    description?: string | null;
  } | null;
  dateValue?: number | null;
  processingDaysBeforeEft?: number | null;
  processingTime?: number | null;
  goLiveDate?: string | null;
  // Computed properties
  scheduleDescription: string;
  cycleDescription: string;
  dateTypeDescription?: string;
}

// Required skills interface
export interface PayrollRequiredSkill {
  skillName: string;
  requiredLevel: string;
}

// Team assignments interface
export interface PayrollAssignments {
  primaryConsultant?: PayrollUser | null;
  backupConsultant?: PayrollUser | null;
  assignedManager?: PayrollUser | null;
  requiredSkills?: PayrollRequiredSkill[];
  // Computed properties
  missingAssignments: string[];
  hasAllAssignments: boolean;
}

// Version information interface
export interface PayrollVersionInfo {
  versionNumber?: number | null;
  parentPayrollId?: string | null;
  supersededDate?: string | null;
  createdAt: string;
  updatedAt: string;
  createdByUserId?: string | null;
  // Computed properties
  isLatestVersion: boolean;
  isSuperseded: boolean;
  hasVersions: boolean;
}

// Statistics interface
export interface PayrollStatistics {
  employeeCount?: number | null;
  fileCount: number;
  dateCount: number;
  upcomingDatesCount: number;
  overdueActionsCount: number;
}

// Main comprehensive payroll interface
export interface PayrollDetail {
  // Core information
  id: string;
  name: string;
  status?: string | null;
  
  // Relationships
  client?: PayrollClient | null;
  assignments: PayrollAssignments;
  schedule: PayrollSchedule;
  
  // Dates and timeline
  dates: PayrollDate[];
  upcomingDates: PayrollDate[];
  nextPayDate?: PayrollDate | null;
  
  // Version information
  version: PayrollVersionInfo;
  
  // Statistics
  stats: PayrollStatistics;
  
  // Computed properties
  statusColor: string;
  statusIcon: string;
  processingProgress: number;
  needsAttention: boolean;
  lastUpdated: string;
}

// Hook return types
export interface UsePayrollDataOptions {
  redirectToLatest?: boolean;
  showErrorToast?: boolean;
  onError?: (error: Error) => void;
  onRedirect?: (latestId: string) => void;
}

export interface UsePayrollDataReturn {
  data: PayrollDetail | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
  
  // Status flags
  isLatestVersion: boolean;
  needsRedirect: boolean;
  hasData: boolean;
  
  // Helper functions
  getLatestVersionId: () => string | null;
  getVersionNumber: () => number | null;
  isSuperseded: () => boolean;
}

// Component prop types
export interface PayrollHeaderProps {
  data: PayrollDetail;
  loading?: boolean;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
}

export interface PayrollOverviewProps {
  data: PayrollDetail;
  loading?: boolean;
}

export interface PayrollAssignmentsProps {
  data: PayrollDetail;
  loading?: boolean;
  onUpdateAssignments?: (assignments: {
    primaryConsultantUserId?: string;
    backupConsultantUserId?: string;
    managerUserId?: string;
  }) => Promise<void>;
}

export interface PayrollScheduleInfoProps {
  data: PayrollDetail;
  loading?: boolean;
  onEditSchedule?: () => void;
  onRegenerateDates?: () => Promise<void>;
}

// Action handler types
export type PayrollActionHandler = (payrollId: string) => void | Promise<void>;
export type AssignmentUpdateHandler = (assignments: Record<string, string>) => Promise<void>;
export type DateRegenerationHandler = (payrollId: string, dateRange?: { start: Date; end: Date }) => Promise<void>;

// Form data types for updates
export interface PayrollUpdateFormData {
  name?: string;
  status?: string;
  employeeCount?: number;
  processingDaysBeforeEft?: number;
  processingTime?: number;
  goLiveDate?: string | null;
}

export interface AssignmentUpdateFormData {
  primaryConsultantUserId?: string | null;
  backupConsultantUserId?: string | null;
  managerUserId?: string | null;
}

export interface ScheduleUpdateFormData {
  cycleId?: string;
  dateTypeId?: string;
  dateValue?: number;
  processingDaysBeforeEft?: number;
  processingTime?: number;
}

// Error types
export enum PayrollErrorType {
  NOT_FOUND = "NOT_FOUND",
  ACCESS_DENIED = "ACCESS_DENIED",
  NETWORK_ERROR = "NETWORK_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface PayrollError extends Error {
  type: PayrollErrorType;
  code?: string;
  details?: Record<string, any>;
}

// Status enums
export enum PayrollStatus {
  DRAFT = "Draft",
  IMPLEMENTATION = "Implementation",
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  ON_HOLD = "On Hold",
  COMPLETED = "Completed",
}

export enum PayrollCycleType {
  WEEKLY = "weekly",
  FORTNIGHTLY = "fortnightly",
  BI_MONTHLY = "bi_monthly",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
}

export enum PayrollDateType {
  SOM = "som",
  EOM = "eom",
  MID_MONTH = "mid_month",
  FIXED_DATE = "fixed_date",
  WEEK_A = "week_a",
  WEEK_B = "week_b",
}

export enum UserRole {
  VIEWER = "viewer",
  CONSULTANT = "consultant",
  MANAGER = "manager",
  ORG_ADMIN = "org_admin",
  DEVELOPER = "developer",
}

// Utility type for partial updates
export type PartialPayrollUpdate<T> = Partial<T> & { id: string };

// Export all types for easy importing
export * from "./payroll.types";

export default PayrollDetail;