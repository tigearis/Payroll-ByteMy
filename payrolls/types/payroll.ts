/**
 * Payroll Domain Types
 */

import type {
  PayrollStatus,
  PayrollCycleType,
  PayrollDateType as PayrollDateTypeEnum,
} from "@/types/enums";

export interface Payroll {
  dayValue:
    | {
        original_eft_date?: string;
        adjusted_eft_date?: string;
        processing_date?: string;
        id: string;
        notes?: string;
      }[]
    | undefined;
  employee_count: undefined;
  id: string;
  name: string;
  clientId: string;
  cycleId: string;
  dateTypeId: string;
  primaryConsultantId: string;
  backupConsultantId?: string;
  managerId: string;
  processingDaysBeforeEft: number;
  payrollSystem?: string;
  dateValue?: number;
  status: PayrollStatus;
  createdAt: string;
  updatedAt: string;
  employeeCount?: number;

  // Relationships
  client: import("../../clients/types").Client;
  payrollCycle?: PayrollCycle;
  payrollDateType?: PayrollDateTypeEntity;
  primaryConsultantUser?: import("../../users/types").User;
  backupConsultantUser?: import("../../users/types").User;
  managerUser?: import("../../users/types").User;
  payrollDates?: PayrollDate[];
}

export type PayrollCycle = {
  id: string;
  name: string;
  payrollCycleType: PayrollCycleType;
  description?: string;

  // Relationships
  payrolls?: Payroll[];
};

export type PayrollDateTypeEntity = {
  id: string;
  name: string;
  payrollDateType: PayrollDateTypeEnum;
  description?: string;

  // Relationships
  payrolls?: Payroll[];
};

// Re-export PayrollDateType interface with the new name to maintain compatibility
export type PayrollDateType = PayrollDateTypeEntity;

export type PayrollDate = {
  id: string;
  payrollId: string;
  originalEftDate: string;
  adjustedEftDate: string;
  processingDate: string;
  notes?: string;

  // Relationships
  payroll: Payroll;
};

export type AdjustmentRule = {
  id: string;
  cycleId: string;
  dateTypeId: string;
  ruleCode: string;
  ruleDescription: string;
  createdAt: string;
  updatedAt: string;
};

export interface GeneratePayrollDatesArgs {
  p_payroll_ids: string[]; // Array of payroll IDs to process
  p_start_date: string; // Start date for generating payroll dates (ISO format)
  p_end_date: string; // End date for generating payroll dates (ISO format)
  p_max_dates: number; // Maximum number of payroll dates to generate
}

// Enhanced calendar props interface for payroll scheduling
export interface EnhancedCalendarProps {
  mode: "fortnightly" | "fixed";
  selectedWeek?: string;
  selectedDay?: string;
  onWeekSelect?: (week: string) => void;
  onDaySelect: (day: string) => void;
}
