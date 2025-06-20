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
  leave_status_enum: "@/types/enums#leave_status_enum",
  payroll_status: "@/types/enums#payroll_status",
  payroll_cycle_type: "@/types/enums#payroll_cycle_type",
  payroll_date_type: "@/types/enums#payroll_date_type",
  permission_action: "@/types/enums#permission_action",
  user_role: "@/types/enums#user_role",
};
