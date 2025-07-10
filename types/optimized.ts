/**
 * Optimized Type Exports
 * Strategic barrel export for frequently used types with tree-shaking support
 * Priority 3 Technical Debt: Optimized TypeScript export structure
 */

// ===========================
// Core Business Types (Most Frequently Used)
// ===========================

export type {
  // Core entities - used across all domains
  User,
  Client,
  Payroll,
  Note,
  AuditLog,
} from './core/entities';

export type {
  // Essential relationship types
  UserSummary,
  ClientSummary,
  PayrollSummary,
  UserWithManager,
  ClientWithStats,
  PayrollWithClient,
} from './core/relations';

// ===========================
// Essential UI Types
// ===========================

export type {
  // Form essentials
  FormField,
  FormState,
  SelectOption,
  
  // Table essentials
  TableColumn,
  PaginationState,
  
  // Modal essentials
  ModalProps,
  ConfirmationDialogProps,
} from './ui/components';

// ===========================
// Authentication & Permissions
// ===========================

export type {
  Role,
} from './enums';

export type {
  // Permission types - using string for CustomPermission as defined in interfaces
  PermissionOverride,
} from './interfaces';

// ===========================
// Re-exports for Backward Compatibility
// ===========================

// Legacy compatibility - will be removed in future versions
export type { User as UserLegacy } from './core/entities';
export type { Client as ClientLegacy } from './core/entities';
export type { Payroll as PayrollLegacy } from './core/entities';

// ===========================
// Type Guards (Frequently Used)
// ===========================

/**
 * Type guard to check if a value is a valid Role
 */
export function isRole(value: any): value is Role {
  return typeof value === 'string' && [
    'developer',
    'org_admin', 
    'manager',
    'consultant',
    'viewer'
  ].includes(value);
}

/**
 * Type guard to check if a value is a valid PayrollStatus
 */
export function isPayrollStatus(value: any): value is PayrollStatus {
  return typeof value === 'string' && [
    'Implementation',
    'Active',
    'Inactive',
    'Processing',
    'Completed',
    'On Hold',
    'Cancelled'
  ].includes(value);
}

/**
 * Type guard to check if a value is a valid EntityType
 */
export function isEntityType(value: any): value is EntityType {
  return typeof value === 'string' && ['payroll', 'client', 'user', 'note'].includes(value);
}

// ===========================
// Development Helpers
// ===========================

if (process.env.NODE_ENV === 'development') {
  console.log('🚀 Optimized types loaded - tree-shakable exports available');
}