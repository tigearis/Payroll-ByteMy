/**
 * Entity Relationships and Extended Types
 * Complex types that combine multiple entities or add computed properties
 * Priority 3 Technical Debt: Optimized TypeScript export structure
 */

import type {
  User,
  Client,
  Payroll,
  Note,
  AuditLog,
  WorkSchedule,
  LeaveRequest,
  PermissionOverride,
  BillingInvoice,
  BillingInvoiceItem
} from './entities';

// ===========================
// Extended User Types
// ===========================

/**
 * User with manager relationship
 */
export interface UserWithManager extends User {
  manager?: Pick<User, 'id' | 'name' | 'email' | 'role'>;
}

/**
 * User with direct reports
 */
export interface UserWithTeam extends UserWithManager {
  directReports: Pick<User, 'id' | 'name' | 'email' | 'role' | 'isActive'>[];
}

/**
 * User with permission information
 */
export interface UserWithPermissions extends UserWithManager {
  permissions: {
    canCreate: boolean;
    canManageUsers: boolean;
    canManagePayrolls: boolean;
    canViewReports: boolean;
    canManageClients: boolean;
    canManageSystem: boolean;
  };
  permissionOverrides: PermissionOverride[];
}

/**
 * User with work schedule
 */
export interface UserWithSchedule extends UserWithManager {
  workSchedules: WorkSchedule[];
  totalWeeklyHours: number;
}

/**
 * User with leave information
 */
export interface UserWithLeave extends UserWithManager {
  leaveRequests: LeaveRequest[];
  remainingLeave: number;
  upcomingLeave: LeaveRequest[];
}

/**
 * Complete user profile with all relationships
 */
export interface UserComplete extends UserWithManager {
  directReports: Pick<User, 'id' | 'name' | 'email' | 'role'>[];
  workSchedules: WorkSchedule[];
  leaveRequests: LeaveRequest[];
  permissionOverrides: PermissionOverride[];
  auditActivity: Pick<AuditLog, 'id' | 'action' | 'eventTime' | 'success'>[];
  primaryConsultantPayrolls: Pick<Payroll, 'id' | 'name' | 'status' | 'clientId'>[];
  backupConsultantPayrolls: Pick<Payroll, 'id' | 'name' | 'status' | 'clientId'>[];
  managedPayrolls: Pick<Payroll, 'id' | 'name' | 'status' | 'clientId'>[];
}

// ===========================
// Extended Client Types
// ===========================

/**
 * Client with basic statistics
 */
export interface ClientWithStats extends Client {
  payrollCount: number;
  activePayrollCount: number;
  totalEmployees: number;
  lastPayrollDate?: DateString;
}

/**
 * Client with consultant assignments
 */
export interface ClientWithConsultants extends ClientWithStats {
  primaryConsultants: Pick<User, 'id' | 'name' | 'email'>[];
  backupConsultants: Pick<User, 'id' | 'name' | 'email'>[];
  managers: Pick<User, 'id' | 'name' | 'email'>[];
}

/**
 * Client with payroll summary
 */
export interface ClientWithPayrolls extends ClientWithStats {
  payrolls: Pick<Payroll, 'id' | 'name' | 'status' | 'employeeCount' | 'updatedAt'>[];
  recentPayrolls: Pick<Payroll, 'id' | 'name' | 'status' | 'updatedAt'>[];
}

/**
 * Client with billing information
 */
export interface ClientWithBilling extends ClientWithStats {
  invoices: Pick<BillingInvoice, 'id' | 'invoiceNumber' | 'status' | 'totalAmount' | 'dueDate'>[];
  totalOutstanding: number;
  lastPaymentDate?: DateString;
}

/**
 * Complete client with all relationships
 */
export interface ClientComplete extends ClientWithConsultants {
  payrolls: PayrollSummary[];
  invoices: BillingInvoice[];
  notes: Pick<Note, 'id' | 'content' | 'isImportant' | 'createdAt' | 'createdBy'>[];
  auditActivity: Pick<AuditLog, 'id' | 'action' | 'eventTime' | 'success'>[];
  externalSystems: {
    id: UUID;
    systemType: string;
    systemName: string;
    connectionStatus: string;
    lastSyncAt?: Timestamptz;
  }[];
}

// ===========================
// Extended Payroll Types
// ===========================

/**
 * Payroll with client information
 */
export interface PayrollWithClient extends Payroll {
  client: Pick<Client, 'id' | 'name' | 'active'>;
}

/**
 * Payroll with consultant assignments
 */
export interface PayrollWithConsultants extends PayrollWithClient {
  primaryConsultant?: Pick<User, 'id' | 'name' | 'email' | 'role'>;
  backupConsultant?: Pick<User, 'id' | 'name' | 'email' | 'role'>;
  manager?: Pick<User, 'id' | 'name' | 'email' | 'role'>;
}

/**
 * Payroll with cycle and date type information
 */
export interface PayrollWithCycle extends PayrollWithConsultants {
  payrollCycle?: {
    id: string;
    name: string;
    description?: string;
  };
  payrollDateType?: {
    id: string;
    name: string;
    description?: string;
  };
}

/**
 * Payroll with date information
 */
export interface PayrollWithDates extends PayrollWithCycle {
  payrollDates: {
    id: UUID;
    originalEftDate: DateString;
    adjustedEftDate?: DateString;
    processingDate: DateString;
    weekType?: string;
  }[];
  nextPayDate?: DateString;
  lastPayDate?: DateString;
}

/**
 * Payroll with version information
 */
export interface PayrollWithVersions extends PayrollWithDates {
  versions: {
    id: UUID;
    versionNumber: number;
    reason: string;
    createdAt: Timestamptz;
    createdBy: Pick<User, 'id' | 'name' | 'email'>;
  }[];
  isLatestVersion: boolean;
  parentPayroll?: Pick<Payroll, 'id' | 'name' | 'versionNumber'>;
}

/**
 * Complete payroll with all relationships
 */
export interface PayrollWithAllRelations extends PayrollWithVersions {
  notes: Pick<Note, 'id' | 'content' | 'isImportant' | 'createdAt' | 'createdBy'>[];
  auditActivity: Pick<AuditLog, 'id' | 'action' | 'eventTime' | 'success'>[];
  adjustmentRules: {
    id: UUID;
    ruleType: string;
    condition: Record<string, any>;
    action: Record<string, any>;
    isActive: boolean;
  }[];
}

// ===========================
// Simplified Summary Types
// ===========================

/**
 * Minimal user info for references
 */
export type UserSummary = Pick<User, 'id' | 'name' | 'email' | 'role' | 'isActive'>;

/**
 * Minimal client info for references
 */
export type ClientSummary = Pick<Client, 'id' | 'name' | 'active'>;

/**
 * Minimal payroll info for references
 */
export type PayrollSummary = Pick<Payroll, 'id' | 'name' | 'status' | 'clientId' | 'employeeCount'>;

/**
 * Minimal note info for lists
 */
export type NoteSummary = Pick<Note, 'id' | 'content' | 'isImportant' | 'createdAt'>;

// ===========================
// Computed/Derived Types
// ===========================

/**
 * User workload calculation
 */
export interface UserWorkload {
  user: UserSummary;
  primaryPayrolls: PayrollSummary[];
  backupPayrolls: PayrollSummary[];
  managedPayrolls: PayrollSummary[];
  totalEmployees: number;
  workloadScore: number;
  capacityStatus: 'low' | 'medium' | 'high' | 'overloaded';
}

/**
 * Client health metrics
 */
export interface ClientHealth {
  client: ClientSummary;
  payrollCount: number;
  activePayrollCount: number;
  lastActivity: Timestamptz;
  healthScore: number;
  healthStatus: 'excellent' | 'good' | 'attention' | 'critical';
  issues: string[];
}

/**
 * Payroll processing status
 */
export interface PayrollProcessingStatus {
  payroll: PayrollSummary;
  currentStage: string;
  progress: number;
  estimatedCompletion?: Timestamptz;
  blockers: string[];
  lastUpdate: Timestamptz;
}

// ===========================
// Relationship Mapping Types
// ===========================

/**
 * Entity relationship mapping
 */
export type EntityRelationships = {
  payroll: {
    client: Client;
    primaryConsultant?: User;
    backupConsultant?: User;
    manager?: User;
    notes: Note[];
  };
  client: {
    payrolls: Payroll[];
    notes: Note[];
  };
  user: {
    manager?: User;
    directReports: User[];
    primaryPayrolls: Payroll[];
    backupPayrolls: Payroll[];
    managedPayrolls: Payroll[];
    notes: Note[];
  };
};