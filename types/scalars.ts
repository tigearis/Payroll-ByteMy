/**
 * GraphQL Scalars
 *
 * TypeScript type definitions for GraphQL scalars from the schema
 */

// Custom scalar mappings for codegen
export const SHARED_SCALARS = {
  UUID: "string",
  uuid: "string",
  timestamptz: "string",
  timestamp: "string",
  date: "string",
  jsonb: "any",
  numeric: "number",
  bpchar: "string",
  _Any: "any",
  Int: "number",
  Float: "number",
  String: "string",
  Boolean: "boolean",
  ID: "string",
  leaveStatusEnum: "@/types/enums#leave_status_enum",
  payrollStatus: "@/types/enums#payroll_status",
  payrollCycleType: "@/types/enums#payroll_cycle_type",
  payrollDateType: "@/types/enums#payroll_date_type",
  permissionAction: "@/types/enums#permission_action",
  userRole: "@/lib/auth/permissions#userrole",
};
