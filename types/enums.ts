/**
 * Enum definitions for the Payroll ByteMy application
 *
 * These enums match the database schema and are used throughout
 * the application for type safety and consistency.
 */

// Payroll cycle types
export enum PayrollCycleType {
  Weekly = "weekly",
  Fortnightly = "fortnightly",
  BiMonthly = "bi_monthly",
  Monthly = "monthly",
  Quarterly = "quarterly",
}

// Payroll date types
export enum PayrollDateType {
  SOM = "som", // Start of Month
  EOM = "eom", // End of Month
  FixedDate = "fixed_date",
}

// User roles with hierarchy
export enum Role {
  developer = "developer",
  org_admin = "org_admin",
  manager = "manager",
  consultant = "consultant",
  viewer = "viewer",
}

// Payroll status enum
export enum PayrollStatus {
  Draft = "draft",
  DataEntry = "data-entry",
  Review = "review",
  Processing = "processing",
  ManagerReview = "manager-review",
  Approved = "approved",
  Submitted = "submitted",
  Paid = "paid",
  OnHold = "on-hold",
  Cancelled = "cancelled",
  Implementation = "Implementation",
  Active = "Active",
  Inactive = "Inactive",
}

// Permission actions
export enum PermissionAction {
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete",
  Execute = "execute",
}

// Leave status
export enum LeaveStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
  Cancelled = "cancelled",
}

export enum AuditAction {
  InvitationListViewed = "invitation_list_viewed",
  InvitationRevoked = "invitation_revoked",
  InvitationResent = "invitation_resent",
  // ...other actions
}
