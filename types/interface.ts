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
};

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

export type Holiday = {
  id: string;
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  region?: string;
  isFixed: boolean;
  isGlobal: boolean;
  launchYear?: number;
  types?: string[];
};

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

export type Note = {
  id: string;
  entityType: "payroll" | "client";
  entityId: string;
  userId?: string;
  content: string;
  isImportant: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Relationships
  user?: User;
};

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
  role: "admin" | "org_admin" | "manager" | "consultant" | "viewer";
  
  // Relationships
  managedPayrolls?: Payroll[];
  primaryPayrolls?: Payroll[];
  backupPayrolls?: Payroll[];
  leaves?: Leave[];
  notes?: Note[];
  workSchedules?: WorkSchedule[];
};

export type WorkSchedule = {
  id: string;
  userId: string;
  workDay: string;
  workHours: number;
  
  // Relationships
  user: User;
};

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
};

export interface Payroll {
  id: string;
  name: string;
  date_value?: number;
  status: "Active" | "Inactive" | "Implementation";
  processing_time?: string;
  processing_days_before_eft?: number;
  payroll_system?: string;
  payroll_cycle?: {
    name: string;
    id: string;
  };
  payroll_date_type?: {
    name: string;
    id: string;
  };
  payroll_dates?: Array<{
    original_eft_date?: string;
    adjusted_eft_date?: string;
    processing_date?: string;
    id: string;
    notes?: string;
  }>;
  userByBackupConsultantUserId?: UserDetails;
  userByManagerUserId?: UserDetails;
  userByPrimaryConsultantUserId?: UserDetails;
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


