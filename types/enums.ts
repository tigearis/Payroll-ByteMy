// types/roles.ts

export enum Role {
  Admin = "org_admin", // Organisation Admin role
  Manager = "manager", // Manager role
  Consultant = "consultant", // Consultant role
  Viewer = "viewer", // Basic viewer role
  Developer = "org_admin", // Developer role (maps to org_admin for database consistency)
}
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

// LeaveStatus enum
export enum leave_status_enum {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

// PayrollCycleType enum
export enum payroll_cycle_type {
  Weekly = "weekly",
  Fortnightly = "fortnightly",
  BiMonthly = "bi_monthly",
  Monthly = "monthly",
  Quarterly = "quarterly",
}

// PayrollDateType enum
export enum payroll_date_type {
  FixedDate = "fixed_date",
  EOM = "eom",
  SOM = "som",
  WeekA = "week_a",
  WeekB = "week_b",
  DOW = "dow",
}

// PayrollStatus enum
export enum payroll_status {
  Active = "Active",
  Implementation = "Implementation",
  Inactive = "Inactive",
}

// PayrollStatusNew enum
export enum payroll_status_new {
  Live = "live",
  Inactive = "inactive",
  Onboarding = "onboarding",
  Possible = "possible",
  Implementation = "implementation",
}

// UserRole enum
export enum user_role {
  Admin = "admin",
  OrgAdmin = "org_admin",
  Manager = "manager",
  Consultant = "consultant",
  Viewer = "viewer",
}

// PermissionAction enum
export enum permission_action {
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete",
  List = "list",
  Manage = "manage",
  Approve = "approve",
  Reject = "reject",
}

// Status enum
export enum status {
  Active = "active",
  Inactive = "inactive",
  Archived = "archived",
}
