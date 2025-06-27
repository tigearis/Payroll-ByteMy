/**
 * Payroll Domain Types
 * Only contains domain-specific types, not core entities
 */

// Import and re-export core types from main types for domain convenience
import type { 
  Payroll, 
  PayrollCycle, 
  PayrollDateTypeEntity,
  PayrollVersionData,
  AdjustmentRule
} from "@/types";

export type { 
  Payroll, 
  PayrollCycle, 
  PayrollDateTypeEntity,
  PayrollVersionData,
  AdjustmentRule
};

export type { 
  PayrollInput,
  PayrollCreationData 
} from "@/types/components";

export type { 
  GeneratePayrollDatesArgs 
} from "@/types/api";

// ===========================
// Domain-Specific Calendar Types
// ===========================

/**
 * Enhanced calendar props interface for payroll scheduling
 */
export interface EnhancedCalendarProps {
  mode: "fortnightly" | "fixed";
  selectedWeek?: string;
  selectedDay?: string;
  onWeekSelect?: (week: string) => void;
  onDaySelect: (day: string) => void;
}

// ===========================
// Component Props (Domain-Specific)
// ===========================

/**
 * Props for payrolls table component
 */
export interface PayrollsTableProps {
  payrolls: any[]; // TODO: Type this properly with Payroll[]
  loading?: boolean;
  onRefresh?: () => void;
  selectedPayrolls?: UUID[];
  onSelectPayroll?: (payrollId: UUID, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  visibleColumns?: string[];
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
  onSort?: (field: string) => void;
}

/**
 * Props for payroll details card component
 */
export interface PayrollDetailsCardProps {
  payroll: {
    status: PayrollStatus;
    processingDaysBeforeEft: number;
    payrollSystem?: string;
  };
  className?: string;
}

/**
 * View mode for payroll list/grid
 */
export type ViewMode = "cards" | "table" | "list";

// ===========================
// Legacy Compatibility Types
// ===========================

/**
 * @deprecated Use PayrollDateTypeEntity from main types
 */
export type PayrollDateType = PayrollDateTypeEntity;