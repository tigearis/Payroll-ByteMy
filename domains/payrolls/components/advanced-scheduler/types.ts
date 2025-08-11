/**
 * Types and Interfaces for Advanced Payroll Scheduler
 * 
 * Centralized type definitions for the modular scheduler system
 */

export type ViewPeriod = "week" | "fortnight" | "month";
export type TableOrientation = "consultants-as-columns" | "consultants-as-rows";

// Core data interfaces
export interface PayrollAssignment {
  id: string;
  payrollId: string;
  payrollName: string;
  clientName: string;
  originalEftDate: string;
  adjustedEftDate: string;
  processingDate: string;
  employeeCount: number;
  processingTime: number;
  consultantId: string;
  consultantName: string;
  isBackup?: boolean;
  originalConsultantId?: string;
  originalConsultantName?: string;
  isGhost?: boolean;
  ghostFromConsultant?: string;
  ghostFromDate?: string;
  ghostToConsultant?: string;
  isMoved?: boolean;
  movedFromConsultant?: string;
}

export interface ConsultantSummary {
  id: string;
  name: string;
  email?: string;
  role?: string;
  totalPayrolls: number;
  totalEmployees: number;
  totalProcessingTime: number;
  isOnLeave?: boolean;
  workSchedules?: any[];
  skills?: any[];
  primaryPayrolls?: any[];
  backupPayrolls?: any[];
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
  localName: string;
  types: string[];
  region?: string[] | null;
  countryCode: string;
  isGlobal?: boolean | null;
  isFixed?: boolean | null;
}

export interface Leave {
  id?: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason?: string | null;
  status?: string;
  userId: string;
}

// State management interfaces
export interface DragState {
  isDragging: boolean;
  draggedPayroll: PayrollAssignment | null;
  dragOverCell: { consultantId: string; date: string } | null;
}

export interface PendingChange {
  payrollId: string;
  payrollName: string;
  fromConsultantId: string;
  toConsultantId: string;
  fromConsultantName: string;
  toConsultantName: string;
  affectedDates: string[];
}

export interface ViewConfiguration {
  period: ViewPeriod;
  orientation: TableOrientation;
  isExpanded: boolean;
  showGhosts: boolean;
  moveAsGroup: boolean;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface SchedulerFilters {
  searchTerm: string;
  selectedConsultants: string[];
  selectedClients: string[];
  showOnlyOnLeave: boolean;
}

// Main scheduler state
export interface SchedulerState {
  // Core data
  assignments: PayrollAssignment[];
  originalAssignments: PayrollAssignment[];
  consultants: ConsultantSummary[];
  holidays: Holiday[];
  leaves: Leave[];
  
  // UI state
  currentDate: Date | null;
  dateRange: DateRange;
  viewConfig: ViewConfiguration;
  filters: SchedulerFilters;
  
  // Interaction state
  dragState: DragState;
  pendingChanges: PendingChange[];
  globalEdits: Map<string, { consultantId: string; consultantName: string }>;
  isPreviewMode: boolean;
  
  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  error: Error | null;
}

// Action types for state management
export type SchedulerAction =
  | { type: 'SET_CURRENT_DATE'; payload: Date }
  | { type: 'SET_DATE_RANGE'; payload: DateRange }
  | { type: 'SET_VIEW_PERIOD'; payload: ViewPeriod }
  | { type: 'SET_ORIENTATION'; payload: TableOrientation }
  | { type: 'SET_EXPANDED'; payload: boolean }
  | { type: 'SET_ASSIGNMENTS'; payload: PayrollAssignment[] }
  | { type: 'SET_CONSULTANTS'; payload: ConsultantSummary[] }
  | { type: 'SET_HOLIDAYS'; payload: Holiday[] }
  | { type: 'SET_LEAVES'; payload: Leave[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_UPDATING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'SET_DRAG_STATE'; payload: DragState }
  | { type: 'SET_PREVIEW_MODE'; payload: boolean }
  | { type: 'SET_SHOW_GHOSTS'; payload: boolean }
  | { type: 'ADD_PENDING_CHANGE'; payload: PendingChange }
  | { type: 'REMOVE_PENDING_CHANGE'; payload: string }
  | { type: 'CLEAR_PENDING_CHANGES' }
  | { type: 'SET_FILTERS'; payload: Partial<SchedulerFilters> }
  | { type: 'MOVE_ASSIGNMENT'; payload: { assignmentId: string; toConsultantId: string; toConsultantName: string } }
  | { type: 'REVERT_CHANGES' };

// Component props interfaces
export interface SchedulerHeaderProps {
  onToggleExpanded: () => void;
  onRefresh: () => void;
}

export interface SchedulerNavigationProps {
  onNavigatePrevious: () => void;
  onNavigateNext: () => void;
}

export interface SchedulerGridProps {
  className?: string;
}

export interface SchedulerSidebarProps {
  className?: string;
}

export interface SchedulerLegendProps {
  compact?: boolean;
}

// Responsive configuration
export interface ResponsiveConfig {
  cellMinWidth: number;
  headerHeight: number;
  containerHeight: string;
}

// Utility types
export interface HolidayDisplayInfo {
  name: string;
  designation: string;
  isPrimary: boolean;
  backgroundColor: string;
}