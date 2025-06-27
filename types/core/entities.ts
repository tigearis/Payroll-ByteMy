/**
 * Core Business Entities
 * Centralized type definitions for core business entities used across all domains
 * Priority 3 Technical Debt: Optimized TypeScript export structure
 */

// ===========================
// Core Entity Interfaces
// ===========================

/**
 * Core User entity - central user representation
 */
export interface User {
  id: UUID;
  email: string;
  name: string;
  role: Role;
  username?: string;
  image?: string;
  isStaff: boolean;
  isActive: boolean;
  managerId?: UUID;
  clerkUserId: string;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
  deactivatedAt?: Timestamptz;
  deactivatedBy?: UUID;
}

/**
 * Core Client entity - central client representation
 */
export interface Client {
  id: UUID;
  name: string;
  active: boolean;
  contactEmail?: string;
  contactPerson?: string;
  contactPhone?: string;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

/**
 * Core Payroll entity - central payroll representation
 */
export interface Payroll {
  id: UUID;
  name: string;
  status: PayrollStatus;
  clientId: UUID;
  primaryConsultantUserId?: UUID;
  backupConsultantUserId?: UUID;
  managerUserId?: UUID;
  payrollCycleId?: string;
  payrollDateTypeId?: string;
  employeeCount?: number;
  specialInstructions?: string;
  supersededDate?: Timestamptz;
  parentPayrollId?: UUID;
  versionNumber: number;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

/**
 * Core Note entity - cross-domain note representation
 */
export interface Note {
  id: UUID;
  entityType: EntityType;
  entityId: UUID;
  content: string;
  isImportant: boolean;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
  createdBy: UUID;
  updatedBy?: UUID;
}

/**
 * Core Audit Log entity - system audit representation
 */
export interface AuditLog {
  id: UUID;
  userId?: UUID;
  action: string;
  resourceType: string;
  resourceId?: string;
  eventTime: Timestamptz;
  success: boolean;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

// ===========================
// Supporting Entities
// ===========================

/**
 * Payroll Cycle configuration
 */
export interface PayrollCycle {
  id: string;
  name: string;
  description?: string;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

/**
 * Payroll Date Type configuration
 */
export interface PayrollDateTypeEntity {
  id: string;
  name: string;
  description?: string;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

/**
 * Work Schedule entity
 */
export interface WorkSchedule {
  id: UUID;
  userId: UUID;
  workDay: string;
  workHours: number;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

/**
 * Leave Request entity
 */
export interface LeaveRequest {
  id: UUID;
  userId: UUID;
  leaveType: LeaveType;
  startDate: DateString;
  endDate: DateString;
  reason: string;
  status: LeaveStatus;
  approvedBy?: UUID;
  approvedAt?: Timestamptz;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

/**
 * Permission Override entity
 */
export interface PermissionOverride {
  id: UUID;
  userId: UUID;
  resource: string;
  granted: boolean;
  reason?: string;
  expiresAt?: Timestamptz;
  createdAt: Timestamptz;
  createdBy: UUID;
}

// ===========================
// Billing Entities
// ===========================

/**
 * Billing Invoice entity
 */
export interface BillingInvoice {
  id: UUID;
  clientId: UUID;
  invoiceNumber: string;
  status: InvoiceStatus;
  totalAmount: number;
  dueDate: DateString;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

/**
 * Billing Invoice Item entity
 */
export interface BillingInvoiceItem {
  id: UUID;
  invoiceId: UUID;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Timestamptz;
}

// ===========================
// External System Integration
// ===========================

/**
 * Client External System entity
 */
export interface ClientExternalSystem {
  id: UUID;
  clientId: UUID;
  systemType: ExternalSystemType;
  systemName: string;
  connectionStatus: ConnectionStatus;
  lastSyncAt?: Timestamptz;
  configData?: Record<string, any>;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

/**
 * Payroll Version Data entity
 */
export interface PayrollVersionData {
  id: UUID;
  payrollId: UUID;
  versionNumber: number;
  changes: Record<string, any>;
  reason: string;
  createdAt: Timestamptz;
  createdBy: UUID;
}

/**
 * Adjustment Rule entity
 */
export interface AdjustmentRule {
  id: UUID;
  payrollId: UUID;
  ruleType: AdjustmentType;
  condition: Record<string, any>;
  action: Record<string, any>;
  isActive: boolean;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

// ===========================
// Entity Status Types
// ===========================

export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'pending';
export type ExternalSystemType = 'accounting' | 'hr' | 'payroll' | 'crm';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type AdjustmentType = 'tax' | 'benefit' | 'deduction' | 'bonus' | 'overtime';