/**
 * Lazy-loaded Components for Performance Optimization
 * 
 * PERFORMANCE IMPROVEMENT:
 * - Reduces initial bundle size by lazy-loading heavy components
 * - Improves page load times and reduces module compilation
 * - Components are loaded only when needed
 */

import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Loading fallback components
const ComponentSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`space-y-3 ${className}`}>
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

const TableSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <div className="space-y-3">
    <div className="flex space-x-4">
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-4 flex-1" />
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 flex-1" />
      </div>
    ))}
  </div>
);

const CardSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <ComponentSkeleton />
    </CardContent>
  </Card>
);

// Domain-specific lazy components

// Payrolls Domain (heaviest - high priority for lazy loading)
export const PayrollAssignments = dynamic(() => import('@/domains/payrolls/components/PayrollAssignments'), {
  loading: () => <CardSkeleton />,
  ssr: false, // These are interactive components
});

export const PayrollScheduleInfo = dynamic(() => import('@/domains/payrolls/components/PayrollScheduleInfo'), {
  loading: () => <ComponentSkeleton />,
  ssr: false,
});

export const EditPayrollDialog = dynamic(() => import('@/domains/payrolls/components/edit-payroll-dialog').then(mod => ({ default: mod.EditPayrollDialog })), {
  loading: () => <div />, // No skeleton for dialogs
  ssr: false,
});

export const EditAssignmentsDialog = dynamic(() => import('@/domains/payrolls/components/edit-assignments-dialog').then(mod => ({ default: mod.EditAssignmentsDialog })), {
  loading: () => <div />,
  ssr: false,
});

export const UploadDocumentDialog = dynamic(() => import('@/domains/payrolls/components/upload-document-dialog').then(mod => ({ default: mod.UploadDocumentDialog })), {
  loading: () => <div />,
  ssr: false,
});

export const AdvancedPayrollScheduler = dynamic(() => import('@/domains/payrolls/components/advanced-payroll-scheduler'), {
  loading: () => <CardSkeleton />,
  ssr: false,
});

export const PayrollDatesView = dynamic(() => import('@/domains/payrolls/components/payroll-dates-view'), {
  loading: () => <TableSkeleton rows={5} />,
  ssr: false,
});

// Notes Domain
export const NotesList = dynamic(() => import('@/domains/notes/components/notes-list').then(mod => ({ default: mod.NotesList })), {
  loading: () => <CardSkeleton />,
  ssr: false,
});

// Billing Domain (heavy with many dependencies)
export const BillingItemsManager = dynamic(() => import('@/domains/billing/components/BillingItemsManager'), {
  loading: () => <CardSkeleton />,
  ssr: false,
});

export const PayrollIntegrationHub = dynamic(() => import('@/domains/billing/components/PayrollIntegrationHub'), {
  loading: () => <CardSkeleton />,
  ssr: false,
});

export const RecurringServicesPanel = dynamic(() => import('@/domains/billing/components/RecurringServicesPanel'), {
  loading: () => <CardSkeleton />,
  ssr: false,
});

// Clients Domain
export const ClientPayrollTable = dynamic(() => import('@/domains/clients/components/client-payroll-table'), {
  loading: () => <TableSkeleton rows={4} />,
  ssr: false,
});

export const ClientsTable = dynamic(() => import('@/domains/clients/components/clients-table'), {
  loading: () => <TableSkeleton rows={6} />,
  ssr: false,
});

// Users Domain
export const UsersTable = dynamic(() => import('@/domains/users/components/users-table-unified'), {
  loading: () => <TableSkeleton rows={5} />,
  ssr: false,
});

export const EditUserModal = dynamic(() => import('@/domains/users/components/edit-user-modal').then(mod => ({ default: mod.EditUserModal })), {
  loading: () => <div />,
  ssr: false,
});

// Work Schedule Domain
export const EnhancedScheduleManager = dynamic(() => import('@/domains/work-schedule/components/enhanced-schedule-manager'), {
  loading: () => <CardSkeleton />,
  ssr: false,
});

export const CapacityDashboard = dynamic(() => import('@/domains/work-schedule/components/capacity-dashboard'), {
  loading: () => <CardSkeleton />,
  ssr: false,
});

// Email Domain
export const EmailComposer = dynamic(() => import('@/domains/email/components/email-composer'), {
  loading: () => <CardSkeleton />,
  ssr: false,
});

export const TemplateLibrary = dynamic(() => import('@/domains/email/components/template-library'), {
  loading: () => <CardSkeleton />,
  ssr: false,
});

// Charts and Data Visualization (heavy)
export const Chart = dynamic(() => import('@/components/ui/chart'), {
  loading: () => (
    <div className="h-64 w-full">
      <Skeleton className="h-full w-full" />
    </div>
  ),
  ssr: false,
});

export const DataTable = dynamic(() => import('@/components/ui/data-table'), {
  loading: () => <TableSkeleton rows={8} />,
  ssr: false,
});

// Document Components (file handling is expensive)
export const DocumentList = dynamic(() => import('@/components/documents/document-list'), {
  loading: () => <TableSkeleton rows={3} />,
  ssr: false,
});

export const DocumentUpload = dynamic(() => import('@/components/documents/document-upload'), {
  loading: () => <ComponentSkeleton />,
  ssr: false,
});

export const DocumentViewer = dynamic(() => import('@/components/documents/document-viewer'), {
  loading: () => (
    <div className="h-96 w-full">
      <Skeleton className="h-full w-full" />
    </div>
  ),
  ssr: false,
});

// Export utility function for easy imports
export const lazyLoad = {
  // Payrolls
  PayrollAssignments,
  PayrollScheduleInfo,
  EditPayrollDialog,
  EditAssignmentsDialog,
  UploadDocumentDialog,
  AdvancedPayrollScheduler,
  PayrollDatesView,
  
  // Other domains
  NotesList,
  BillingItemsManager,
  PayrollIntegrationHub,
  RecurringServicesPanel,
  ClientPayrollTable,
  ClientsTable,
  UsersTable,
  EditUserModal,
  EnhancedScheduleManager,
  CapacityDashboard,
  EmailComposer,
  TemplateLibrary,
  
  // UI Components
  Chart,
  DataTable,
  DocumentList,
  DocumentUpload,
  DocumentViewer,
};

export default lazyLoad;