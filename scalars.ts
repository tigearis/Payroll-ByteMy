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
  leave_status_enum: "@/types/enums#LeaveStatus",
  payroll_status: "@/types/enums#PayrollStatus", 
  payroll_cycle_type: "@/types/enums#PayrollCycleType",
  payroll_date_type: "@/types/enums#PayrollDateType",
  permission_action: "@/types/enums#PermissionAction",
  user_role: "@/types/permissions#Role",
};
