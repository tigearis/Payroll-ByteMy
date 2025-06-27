// types/component.types.ts
// Component prop interfaces and UI-specific types

import type { 
  Payroll, 
  Client, 
  User, 
  Note, 
  LeaveRequest,
  WorkSchedule,
  AuditLog
} from "./interfaces";

// ===========================
// Form Types
// ===========================

/**
 * Generic form field configuration
 */
export interface FormField<T = any> {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "select" | "checkbox" | "date" | "textarea";
  value?: T;
  defaultValue?: T;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  validation?: FormValidation;
  options?: SelectOption[];
}

/**
 * Form validation rules
 */
export interface FormValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | undefined;
}

/**
 * Select option for dropdowns
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Form submission state
 */
export interface FormState<T = any> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * Payroll input for forms (FIXED: Using correct PayrollStatus values)
 */
export interface PayrollInput {
  clientId: UUID;
  name: string;
  cycleId: UUID;
  dateTypeId: UUID;
  dateValue?: number;
  primaryConsultantId?: UUID;
  backupConsultantId?: UUID;
  managerId?: UUID;
  processingDaysBeforeEft: number;
  payrollSystem?: string;
  status: PayrollStatus; // Now uses GraphQL enum values
}

/**
 * Payroll creation data for API requests
 */
export interface PayrollCreationData {
  name: string;
  clientId: UUID;
  cycleId: UUID;
  primaryConsultantId: UUID;
  managerId: UUID;
  processingDaysBeforeEft: number;
  status?: PayrollStatus;
  versionNumber?: number;
}

/**
 * Note input for forms
 */
export interface NoteInput {
  entityType: EntityType;
  entityId: UUID;
  userId?: UUID;
  content: string;
  isImportant?: boolean;
}

/**
 * Leave request input
 */
export interface LeaveRequestInput {
  userId: UUID;
  leaveType: LeaveType;
  startDate: DateString;
  endDate: DateString;
  reason?: string;
}

// ===========================
// Notes Component Types (Cross-Domain)
// ===========================

/**
 * Props for notes list with add functionality
 */
export interface NotesListWithAddProps {
  entityType: EntityType;
  entityId: UUID;
  title?: string;
  description?: string;
  user?: {
    name: string;
    id: UUID;
  };
}

/**
 * Note from GraphQL response
 */
export interface NoteFromGraphQL {
  id: UUID;
  content: string;
  isImportant: boolean;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
  user?: {
    name: string;
  } | null;
}

/**
 * Props for notes modal component
 */
export interface NotesModalProps {
  note: {
    id: UUID;
    content: string;
  };
  refetchNotes: () => void;
}

/**
 * Props for add note component
 */
export interface AddNoteProps {
  entityType: EntityType;
  entityId: UUID;
  onSuccess?: () => void;
}

/**
 * Note data structure (legacy - use Note from interfaces)
 */
export interface NoteData {
  id: UUID;
  entityId: UUID;
  entityType: EntityType;
  content: string;
  isImportant: boolean;
  createdAt: Timestamptz;
  updatedAt: Timestamptz;
}

// ===========================
// Table & List Types
// ===========================

/**
 * Table column configuration
 */
export interface TableColumn<T = any> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => any);
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
  render?: (value: any, row: T) => React.ReactNode;
}

/**
 * Table sorting state
 */
export interface TableSort {
  column: string;
  direction: "asc" | "desc";
}

/**
 * Table filter configuration
 */
export interface TableFilter {
  column: string;
  value: any;
  operator?: "equals" | "contains" | "gt" | "lt" | "between";
}

/**
 * Pagination state
 */
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ===========================
// Modal & Dialog Types
// ===========================

/**
 * Modal props base interface
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

/**
 * Confirmation dialog props
 */
export interface ConfirmationDialogProps extends ModalProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  variant?: "danger" | "warning" | "info";
}

// ===========================
// Calendar & Scheduling Types
// ===========================

/**
 * Calendar event for display
 */
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: EventType; // Using global type
  color?: string;
  allDay?: boolean;
  metadata?: {
    payrollId?: UUID;
    clientId?: UUID;
    userId?: UUID;
    leaveRequestId?: UUID;
  };
}

/**
 * Calendar view configuration
 */
export interface CalendarViewConfig {
  view: "month" | "week" | "day" | "agenda";
  date: Date;
  filters?: {
    types?: EventType[];
    clientIds?: UUID[];
    consultantIds?: UUID[];
  };
}

/**
 * Date range selection
 */
export interface DateRange {
  start: DateString;
  end: DateString;
}

// ===========================
// Dashboard & Analytics Types
// ===========================

/**
 * Dashboard stat card
 */
export interface StatCard {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon?: string;
  color?: string;
  link?: string;
}

/**
 * Chart data point
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  category?: string;
  date?: DateString;
}

/**
 * Dashboard filter state
 */
export interface DashboardFilters {
  dateRange?: DateRange;
  clientIds?: UUID[];
  consultantIds?: UUID[];
  status?: PayrollStatus[]; // Uses correct enum values
}

// ===========================
// Component-Specific Props
// ===========================

/**
 * Payroll form props
 */
export interface PayrollFormProps {
  payroll?: Partial<Payroll>;
  clients: Client[];
  consultants: User[];
  onSubmit: (data: PayrollInput) => Promise<void>;
  onCancel: () => void;
}

/**
 * User creation modal props
 */
export interface CreateUserModalProps extends ModalProps {
  onSuccess: (user: User) => void;
  defaultRole?: Role;
}

/**
 * Leave request form props
 */
export interface LeaveRequestFormProps {
  userId: UUID;
  onSubmit: (data: LeaveRequestInput) => Promise<void>;
  onCancel: () => void;
  blockDates?: DateString[];
}

/**
 * Permission override modal props
 */
export interface PermissionOverrideModalProps extends ModalProps {
  userId: UUID;
  currentPermissions: string[];
  onSubmit: (permissions: PermissionOverrideInput[]) => Promise<void>;
}

/**
 * Permission override input
 */
export interface PermissionOverrideInput {
  permission: string;
  granted: boolean;
  reason: string;
  expiresAt?: Timestamptz;
}

// ===========================
// Notification Types
// ===========================

/**
 * Toast notification
 */
export interface ToastNotification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * In-app notification
 */
export interface AppNotification {
  id: UUID;
  userId: UUID;
  type: "payroll_due" | "leave_request" | "assignment_change" | "system";
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  metadata?: JSONValue;
  createdAt: Timestamptz;
}

// ===========================
// Search & Filter Types
// ===========================

/**
 * Search input configuration
 */
export interface SearchConfig {
  placeholder?: string;
  fields: string[];
  debounceMs?: number;
  minLength?: number;
}

/**
 * Filter chip
 */
export interface FilterChip {
  id: string;
  label: string;
  value: any;
  field: string;
  onRemove: () => void;
}

// ===========================
// Layout Types
// ===========================

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

/**
 * Navigation item
 */
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
  permissions?: string[];
  children?: NavItem[];
}

/**
 * Page header configuration
 */
export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

// ===========================
// Error & Loading States
// ===========================

/**
 * Error boundary fallback props
 */
export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

/**
 * Loading skeleton configuration
 */
export interface SkeletonConfig {
  rows?: number;
  columns?: number;
  height?: string | number;
  animate?: boolean;
}