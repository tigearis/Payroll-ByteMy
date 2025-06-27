/**
 * UI Component Types
 * Centralized type definitions for UI components and props
 * Priority 3 Technical Debt: Optimized TypeScript export structure
 */

import type { ReactNode, ComponentProps } from 'react';
import type { UserSummary, ClientSummary, PayrollSummary } from '../core/relations';

// ===========================
// Base Component Types
// ===========================

/**
 * Base props for modal components
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  children: ReactNode;
}

/**
 * Confirmation dialog props
 */
export interface ConfirmationDialogProps extends Omit<ModalProps, 'children'> {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  isLoading?: boolean;
}

/**
 * Error fallback component props
 */
export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  title?: string;
  showDetails?: boolean;
}

/**
 * Loading skeleton configuration
 */
export interface SkeletonConfig {
  rows?: number;
  columns?: number;
  height?: string | number;
  width?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
}

// ===========================
// Form Component Types
// ===========================

/**
 * Generic form field definition
 */
export interface FormField<T = any> {
  name: keyof T;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'date' | 'file';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[];
  validation?: FormValidation;
  helpText?: string;
  defaultValue?: any;
}

/**
 * Select option for dropdowns
 */
export interface SelectOption {
  value: string | number | boolean;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: ReactNode;
}

/**
 * Form validation rules
 */
export interface FormValidation {
  required?: boolean | string;
  minLength?: number | string;
  maxLength?: number | string;
  pattern?: RegExp | string;
  min?: number | string;
  max?: number | string;
  custom?: (value: any) => string | undefined;
}

/**
 * Form state management
 */
export interface FormState<T = any> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// ===========================
// Table Component Types
// ===========================

/**
 * Table column definition
 */
export interface TableColumn<T = any> {
  key: keyof T | string;
  title: string;
  dataIndex?: keyof T;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => ReactNode;
  className?: string;
}

/**
 * Table sorting configuration
 */
export interface TableSort {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Table filter configuration
 */
export interface TableFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'like' | 'in' | 'nin';
  value: any;
}

/**
 * Pagination state
 */
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
}

// ===========================
// Dashboard Component Types
// ===========================

/**
 * Statistic card component
 */
export interface StatCard {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon?: ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  loading?: boolean;
}

/**
 * Chart data point
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

/**
 * Dashboard filter configuration
 */
export interface DashboardFilters {
  dateRange?: {
    start: DateString;
    end: DateString;
  };
  status?: string[];
  assignee?: string[];
  client?: string[];
  customFilters?: Record<string, any>;
}

// ===========================
// Navigation Component Types
// ===========================

/**
 * Navigation item
 */
export interface NavItem {
  key: string;
  label: string;
  icon?: ReactNode;
  path?: string;
  children?: NavItem[];
  badge?: string | number;
  disabled?: boolean;
  permission?: string;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  isCurrentPage?: boolean;
}

/**
 * Page header props
 */
export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  tabs?: {
    key: string;
    label: string;
    count?: number;
  }[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
}

// ===========================
// Search and Filter Types
// ===========================

/**
 * Search configuration
 */
export interface SearchConfig {
  placeholder?: string;
  fields: string[];
  operators?: ('contains' | 'starts' | 'ends' | 'equals')[];
  debounceMs?: number;
  minLength?: number;
}

/**
 * Filter chip for active filters
 */
export interface FilterChip {
  key: string;
  label: string;
  value: string;
  removable?: boolean;
  onRemove?: () => void;
}

// ===========================
// Calendar Component Types
// ===========================

/**
 * Calendar event
 */
export interface CalendarEvent {
  id: UUID;
  title: string;
  start: Timestamptz;
  end: Timestamptz;
  allDay?: boolean;
  color?: string;
  description?: string;
  location?: string;
  attendees?: UserSummary[];
  metadata?: Record<string, any>;
}

/**
 * Calendar view configuration
 */
export interface CalendarViewConfig {
  view: 'month' | 'week' | 'day' | 'agenda';
  startHour?: number;
  endHour?: number;
  slotDuration?: number;
  scrollToTime?: string;
  weekStartDay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Date range selector
 */
export interface DateRange {
  start: DateString;
  end: DateString;
  preset?: 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'custom';
}

// ===========================
// Notification Types
// ===========================

/**
 * Toast notification
 */
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

/**
 * Application notification
 */
export interface AppNotification {
  id: UUID;
  type: 'system' | 'user' | 'payroll' | 'client' | 'audit';
  title: string;
  message: string;
  read: boolean;
  createdAt: Timestamptz;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

// ===========================
// Domain-Specific Component Types
// ===========================

/**
 * User management modal props
 */
export interface CreateUserModalProps extends ModalProps {
  onUserCreated: (user: UserSummary) => void;
  defaultRole?: Role;
  defaultManager?: UUID;
}

/**
 * Payroll form props
 */
export interface PayrollFormProps {
  payroll?: PayrollSummary;
  client?: ClientSummary;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit' | 'view';
}

/**
 * Leave request form props
 */
export interface LeaveRequestFormProps {
  user: UserSummary;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
  defaultValues?: Partial<any>;
}

/**
 * Permission override modal props
 */
export interface PermissionOverrideModalProps extends ModalProps {
  user: UserSummary;
  onOverrideCreated: (override: any) => void;
  currentPermissions: string[];
}

// ===========================
// Data Input Types
// ===========================

/**
 * Generic data input for forms
 */
export interface DataInput<T = any> {
  value: T;
  onChange: (value: T) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

/**
 * File upload input
 */
export interface FileUploadInput extends DataInput<File | File[] | null> {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  preview?: boolean;
}

/**
 * Rich text editor input
 */
export interface RichTextInput extends DataInput<string> {
  toolbar?: 'basic' | 'full' | 'minimal';
  placeholder?: string;
  maxLength?: number;
  autoFocus?: boolean;
}