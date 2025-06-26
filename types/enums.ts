// types/custom-enums.ts

// Weekday enum for payroll scheduling (1-5 for Monday-Friday)
export enum BusinessWeekdayEnum {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
}

// Weekday string enum for form values
export enum WeekdayStringEnum {
  Monday = "1",
  Tuesday = "2",
  Wednesday = "3",
  Thursday = "4",
  Friday = "5",
}

// Week type enum for fortnightly payrolls
export enum FortnightlyWeekEnum {
  WeekA = "A",
  WeekB = "B",
}

// LeaveStatus enum (standardized naming)
export enum LeaveStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

// PayrollCycleType enum (standardized naming)
export enum PayrollCycleType {
  Weekly = "weekly",
  Fortnightly = "fortnightly",
  BiMonthly = "bi_monthly",
  Monthly = "monthly",
  Quarterly = "quarterly",
}

// PayrollDateType enum (standardized naming)
export enum PayrollDateType {
  FixedDate = "fixed_date",
  EOM = "eom",
  SOM = "som",
  WeekA = "week_a",
  WeekB = "week_b",
  DOW = "dow",
}

// Consolidated PayrollStatus enum (matches database enum values)
export enum PayrollStatus {
  // Database values (these are the only valid values)
  Active = "Active",
  Implementation = "Implementation",
  Inactive = "Inactive",
}

// PermissionAction enum (standardized naming)
export enum PermissionAction {
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete",
  List = "list",
  Manage = "manage",
  Approve = "approve",
  Reject = "reject",
}

// Status enum (standardized naming)
export enum Status {
  Active = "active",
  Inactive = "inactive",
  Archived = "archived",
}

// Role enum (standardized naming)
export enum Role {
  Developer = "developer",
  Admin = "org_admin",
  Manager = "manager",
  Consultant = "consultant",
  Viewer = "viewer",
}
