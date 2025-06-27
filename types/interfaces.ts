// types/business.types.ts
// Business logic interfaces and entity definitions
// Uses global Hasura types where applicable

// ===========================
// Core Business Entities
// ===========================

/**
 * Payroll entity with full relationships
 * @security HIGH - Contains employee count and financial data
 */
export interface Payroll {
  id: UUID;
  name: string;
  clientId: UUID;
  client?: Client;
  cycleId: UUID;
  payrollCycle?: PayrollCycle;
  dateTypeId: UUID;
  payrollDateType?: PayrollDateTypeEntity;
  dateValue?: number;
  primaryConsultantId?: UUID;
  primaryConsultant?: User;
  backupConsultantId?: UUID;
  backupConsultant?: User;
  managerId?: UUID;
  manager?: User;
  processingDaysBeforeEft: number;
  payrollSystem?: string;
  status: PayrollStatus; // Using global Hasura enum
  employeeCount?: number;
  supersededById?: UUID;
  supersededDate?: Timestamptz;
  payrollDates?: PayrollDate[];
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

/**
 * Client entity
 * @security HIGH - Contains PII
 */
export interface Client {
  id: UUID;
  name: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  active: boolean;
  payrolls?: Payroll[];
  notes?: Note[];
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

/**
 * User/Staff entity
 * @security CRITICAL - Contains authentication and role data
 */
export interface User {
  id: UUID;
  clerkId: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  role: Role; // Using global Hasura enum
  permissions?: string[]; // Array of CustomPermission strings
  active: boolean;
  isStaff: boolean;
  metadata?: UserPublicMetadata;
  // Relationships
  primaryPayrolls?: Payroll[];
  backupPayrolls?: Payroll[];
  managedPayrolls?: Payroll[];
  consultantAssignments?: ConsultantAssignment[];
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

/**
 * Note entity for clients and payrolls
 * @security MEDIUM - Internal notes
 */
export interface Note {
  id: UUID;
  entityType: EntityType; // Using global type
  entityId: UUID;
  userId?: UUID;
  user?: User;
  content: string;
  isImportant: boolean;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

// ===========================
// Supporting Entities
// ===========================

/**
 * Payroll cycle configuration
 */
export interface PayrollCycle {
  id: UUID;
  name: string;
  type: PayrollCycleType; // Using global Hasura enum
  description?: string;
  active: boolean;
}

/**
 * Payroll date type configuration
 */
export interface PayrollDateTypeEntity {
  id: UUID;
  name: string;
  type: PayrollDateType; // Using global Hasura enum
  description?: string;
  active: boolean;
}

/**
 * Consultant assignment for coverage
 */
export interface ConsultantAssignment {
  id: UUID;
  payrollDateId: UUID;
  payrollDate?: PayrollDate;
  consultantId: UUID;
  consultant?: User;
  assignmentType: "primary" | "backup" | "temporary";
  notes?: string;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

/**
 * Work schedule configuration
 */
export interface WorkSchedule {
  id: UUID;
  userId: UUID;
  user?: User;
  startDate: DateString;
  endDate?: DateString;
  scheduleType: "standard" | "custom";
  weeklyHours: number;
  workDays: BusinessWeekday[]; // Using global type
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

/**
 * Leave request
 * @security HIGH - Employee PII
 */
export interface LeaveRequest {
  id: UUID;
  userId: UUID;
  user?: User;
  leaveType: LeaveType; // Using global type
  startDate: DateString;
  endDate: DateString;
  status: LeaveStatus; // Using global Hasura enum
  reason?: string;
  approvedById?: UUID;
  approvedBy?: User;
  approvedAt?: Timestamptz;
  notes?: string;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

// ===========================
// Audit & Security Entities
// ===========================

/**
 * Audit log entry
 * @security CRITICAL - Audit trail
 */
export interface AuditLog {
  id: UUID;
  userId: UUID;
  user?: User;
  action: string;
  resourceType: string;
  resourceId?: UUID;
  metadata?: JSONValue;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Timestamptz;
}

/**
 * Permission override for custom access
 * @security CRITICAL - Access control
 */
export interface PermissionOverride {
  id: UUID;
  userId: UUID;
  user?: User;
  permission: string; // CustomPermission string
  granted: boolean;
  grantedById: UUID;
  grantedBy?: User;
  reason: string;
  expiresAt?: Timestamptz;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

// ===========================
// Billing Entities
// ===========================

/**
 * Billing invoice
 * @security CRITICAL - Financial data
 */
export interface BillingInvoice {
  id: UUID;
  clientId: UUID;
  client?: Client;
  invoiceNumber: string;
  amount: Numeric;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  dueDate: DateString;
  paidAt?: Timestamptz;
  items?: BillingInvoiceItem[];
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

/**
 * Billing invoice line item
 */
export interface BillingInvoiceItem {
  id: UUID;
  invoiceId: UUID;
  invoice?: BillingInvoice;
  description: string;
  quantity: number;
  unitPrice: Numeric;
  amount: Numeric;
  createdAt: Timestamptz;
}

// ===========================
// Relationship Types
// ===========================

/**
 * Client with aggregated data
 */
export interface ClientWithStats extends Client {
  totalEmployees?: number;
  activePayrollCount?: number;
  lastPayrollDate?: DateString;
}

/**
 * Payroll with full relationships loaded
 */
export interface PayrollWithRelationships extends Payroll {
  client: Client;
  payrollCycle: PayrollCycle;
  payrollDateType: PayrollDateTypeEntity;
  primaryConsultant?: User;
  backupConsultant?: User;
  manager?: User;
}

/**
 * User with role and permissions loaded
 */
export interface UserWithPermissions extends User {
  roleConfig?: {
    level: number;
    permissions: string[];
  };
  permissionOverrides?: PermissionOverride[];
}

/**
 * Client external system integration
 * @security MEDIUM - System integration data
 */
export interface ClientExternalSystem {
  id: UUID;
  clientId: UUID;
  client?: Client;
  systemId: UUID;
  systemClientId?: string;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

/**
 * Payroll versioning data
 * @security HIGH - Financial data versioning
 */
export interface PayrollVersionData {
  id: UUID;
  name: string;
  versionNumber: number;
  status: PayrollStatus;
  createdAt: Timestamptz;
  supersededDate?: Timestamptz;
  goLiveDate?: Timestamptz;
  notes?: string;
  parentPayrollId?: UUID;
}

/**
 * Adjustment rule for payroll processing
 * @security MEDIUM - Business logic rules
 */
export interface AdjustmentRule {
  id: UUID;
  cycleId: UUID;
  dateTypeId: UUID;
  ruleCode: string;
  ruleDescription: string;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}