/**
 * User Domain Types
 */

import type { Role } from "@/types/permissions";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;

  // Relationships
  managedPayrolls?: import("../../payrolls/types").Payroll[];
  primaryPayrolls?: import("../../payrolls/types").Payroll[];
  backupPayrolls?: import("../../payrolls/types").Payroll[];
  leaves?: import("../../leave/types").Leave[];
  notes?: import("@/types/shared").Note[];
  workSchedules?: import("../../work-schedule/types").WorkSchedule[];
}

export interface UserDetails {
  id: string;
  email: string;
  is_staff: boolean;
  name: string;
  leaves?: Array<{
    start_date?: string; // ISO date format
    end_date?: string; // ISO date format
    id: string;
    leave_type: "Annual" | "Sick" | "Other"; // Enum for leave types
    reason?: string;
    user_id: string;
    status?: "Approved" | "Pending" | "Rejected"; // Enum for leave status
  }>;
}