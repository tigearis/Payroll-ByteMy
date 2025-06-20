/**
 * Leave Domain Types
 */

import type { LeaveStatus } from "@/types/enums";

export type Leave = {
  id: string;
  userId: string;
  startDate: string; // ISO date format
  endDate: string; // ISO date format
  leaveType: "Annual" | "Sick" | "Other"; // Enum for leave types
  status: LeaveStatus;
  reason?: string;

  // Relationships
  user: import("../../users/types").User; // Associated user
};