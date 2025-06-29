// types/permissions.ts
// This file exports the permission types that globals.d.ts expects

// Re-export from the main permissions module
export type { 
  Permission as CustomPermission, 
  Role,
  PayrollPermission,
  StaffPermission,
  ClientPermission,
  AdminPermission,
  SecurityPermission,
  ReportingPermission,
  RoleConfig,
  RolePermissions,
  UserMetadata
} from "../lib/auth/permissions";