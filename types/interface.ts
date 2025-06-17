// types/interface.ts
export type PayrollStatus = "Active" | "Inactive" | "Implementation";

export type Account = {
  id: string;
  provider: string;
  type: string;
  refreshToken?: string;
  accessToken?: string;
  expiresAt?: number;
  idToken?: string;
  scope?: string;
  sessionState?: string;
  tokenType?: string;
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

export interface Client {
  id: string;
  name: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;

  // Relationships
  payrolls?: Payroll[];
}

export type ClientExternalSystem = {
  id: string;
  clientId: string;
  systemId: string;
  systemClientId?: string;

  // Relationships
  client: Client;
};

export type ExternalSystem = {
  id: string;
  name: string;
  url?: string;
  description?: string;
  icon?: string;
};

export interface Holiday {
  id: string;
  date: string;
  local_name: string;
  name: string;
  country_code: string;
  region?: string[];
  is_fixed: boolean;
  is_global: boolean;
  launch_year?: number;
  types: string[];
  created_at: string;
  updated_at: string;
}

export type Leave = {
  id: string;
  userId: string;
  startDate: string; // ISO date format
  endDate: string; // ISO date format
  leaveType: "Annual" | "Sick" | "Other"; // Enum for leave types
  status: "Approved" | "Pending" | "Rejected"; // Enum for leave status
  reason?: string;

  // Relationships
  user: User; // Associated user
};

export interface Note {
  id: string;
  entity_id: string;
  entity_type: "payroll" | "client";
  user_id?: string;
  content: string;
  is_important: boolean;
  user?: any; // Using any to avoid circular dependency
  created_at: string;
  updated_at: string;
}

export type PayrollCycle = {
  id: string;
  name: string;
  payrollCycleType: string;
  description?: string;

  // Relationships
  payrolls?: Payroll[];
};

export type PayrollDateType = {
  id: string;
  name: string;
  payrollDateType: string;
  description?: string;

  // Relationships
  payrolls?: Payroll[];
};

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
  client: Client;
  payrollCycle?: PayrollCycle;
  payrollDateType?: PayrollDateType;
  primaryConsultantUser?: User;
  backupConsultantUser?: User;
  managerUser?: User;
  payrollDates?: PayrollDate[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "developer" | "org_admin" | "manager" | "consultant" | "viewer";

  // Relationships
  managedPayrolls?: Payroll[];
  primaryPayrolls?: Payroll[];
  backupPayrolls?: Payroll[];
  leaves?: Leave[];
  notes?: Note[];
  workSchedules?: WorkSchedule[];
}

export interface WorkSchedule {
  id: string;
  user_id: string;
  work_day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  work_hours: number;
  user?: any; // Using any to avoid circular dependency
  work_schedule_user?: any;
  created_at: string;
  updated_at: string;
}

export type Session = {
  id: string;
  expires: string;
};

export type VerificationToken = {
  identifier: string;
  token: string;
  expires: string;
};

export interface GeneratePayrollDatesArgs {
  p_payroll_ids: string[]; // Array of payroll IDs to process
  p_start_date: string; // Start date for generating payroll dates (ISO format)
  p_end_date: string; // End date for generating payroll dates (ISO format)
  p_max_dates: number; // Maximum number of payroll dates to generate
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

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: "payroll" | "holiday" | "leave";
  color: string;
}

export interface FeatureFlag {
  id: string;
  feature_name: string;
  is_enabled: boolean;
  allowed_roles: string[]; // Using string[] to avoid circular dependency
  updated_at: string;
}

export interface AppSettings {
  id: string;
  permissions?: Record<string, any>;
}

// Weekday interface for payroll scheduling
export interface Weekday {
  value: string; // "1" to "5" representing Monday to Friday
  label: string; // "Monday", "Tuesday", etc.
}

// Business weekday type for internal calculations
export type BusinessWeekday = 0 | 1 | 2 | 3 | 4 | 5; // 0 = non-business day, 1-5 = Monday-Friday

// Calendar day info interface for enhanced calendar components
export interface CalendarDayInfo {
  date: Date;
  day: number; // Day of month (1-31)
  businessWeekday: BusinessWeekday; // Business weekday number (0-5)
  isCurrentMonth: boolean;
  isToday: boolean;
  weekType?: "A" | "B"; // For fortnightly payrolls
}

// Enhanced calendar props interface
export interface EnhancedCalendarProps {
  mode: "fortnightly" | "fixed";
  selectedWeek?: string;
  selectedDay?: string;
  onWeekSelect?: (week: string) => void;
  onDaySelect: (day: string) => void;
}
