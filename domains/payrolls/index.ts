/**
 * Optimized Barrel Export for Payrolls Domain
 * 
 * PERFORMANCE OPTIMIZATION:
 * - Lazy exports to enable tree-shaking
 * - Grouped by functionality to reduce import overhead
 * - Dynamic imports for heavy components
 * 
 * SOC2 Compliant GraphQL Operations
 * Security Classifications Applied:
 * - CRITICAL: Auth, user roles, financial data - Requires admin access + MFA
 * - HIGH: PII, client data, employee info - Requires role-based access
 * - MEDIUM: Internal business data - Requires authentication
 * - LOW: Public/aggregate data - Basic access control
 */

// Types (always imported - lightweight)
export type * from './graphql/generated/graphql';

// Core Components (lazy-loaded)
export const PayrollAssignments = () => import('./components/PayrollAssignments');
export const PayrollHeader = () => import('./components/PayrollHeader');
export const PayrollOverview = () => import('./components/PayrollOverview');
export const PayrollScheduleInfo = () => import('./components/PayrollScheduleInfo');

// Advanced Components (lazy-loaded)
export const AdvancedPayrollScheduler = () => import('./components/advanced-payroll-scheduler');
export const PayrollDatesView = () => import('./components/payroll-dates-view');
export const PayrollSchedule = () => import('./components/payroll-schedule');

// Dialog Components (lazy-loaded)
export const EditPayrollDialog = () => import('./components/edit-payroll-dialog').then(m => ({ default: m.EditPayrollDialog }));
export const EditAssignmentsDialog = () => import('./components/edit-assignments-dialog').then(m => ({ default: m.EditAssignmentsDialog }));
export const EditScheduleDialog = () => import('./components/edit-schedule-dialog').then(m => ({ default: m.EditScheduleDialog }));
export const UploadDocumentDialog = () => import('./components/upload-document-dialog').then(m => ({ default: m.UploadDocumentDialog }));

// Table Components (lazy-loaded)
export const PayrollsTableUnified = () => import('./components/payrolls-table-unified');

// Modals (lazy-loaded)
export const NotesListModal = () => import('./components/notes-list-modal');

// Analytics (lazy-loaded)
export const PayrollAnalytics = () => import('./components/PayrollAnalytics');
export const PayrollTimeline = () => import('./components/PayrollTimeline');

// Hooks (immediately available - lightweight)
export { useOptimizedPayrollQueries } from './hooks/use-optimized-payroll-queries';

// GraphQL Operations (lazy-loaded)
export const payrollOperations = () => import('./graphql/generated/graphql');

// Feature groups for selective importing
export const payrollFeatures = {
  // Core functionality
  core: {
    PayrollAssignments,
    PayrollHeader,
    PayrollOverview,
    PayrollScheduleInfo,
  },
  
  // Scheduling features
  scheduling: {
    AdvancedPayrollScheduler,
    PayrollDatesView,
    PayrollSchedule,
    EditScheduleDialog,
  },
  
  // Management features
  management: {
    EditPayrollDialog,
    EditAssignmentsDialog,
    UploadDocumentDialog,
    NotesListModal,
  },
  
  // Analytics features
  analytics: {
    PayrollAnalytics,
    PayrollTimeline,
  },
  
  // Data features
  data: {
    PayrollsTableUnified,
    payrollOperations,
  },
};
