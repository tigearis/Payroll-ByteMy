// =============================================================================
// CORE WORKLOAD TYPES
// =============================================================================

export type ViewPeriod = "day" | "week" | "month";
export type ViewType = "chart" | "calendar";
export type AssignmentStatus = "active" | "pending" | "completed";
export type AssignmentPriority = "high" | "medium" | "low";
export type UtilizationLevel = "optimal" | "high" | "overallocated" | "underutilized";
export type UtilizationTrend = "increasing" | "decreasing" | "stable";

// =============================================================================
// ASSIGNMENT & WORKLOAD DATA
// =============================================================================

export interface PayrollAssignment {
  id: string;
  name: string;
  clientName: string;
  processingTime: number; // hours
  processingDaysBeforeEft: number;
  eftDate: string;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkScheduleDay {
  date: string;
  workHours: number;
  adminTimeHours: number;
  payrollCapacityHours: number;
  assignments: PayrollAssignment[];
  isHoliday?: boolean;
  isWeekend?: boolean;
  notes?: string;
}

export interface TeamMember {
  userId: string;
  userName: string;
  userRole: string;
  email?: string;
  avatarUrl?: string;
  isActive: boolean;
  workSchedule: WorkScheduleDay[];
  skills?: string[];
  managerId?: string;
}

// =============================================================================
// PROCESSED WORKLOAD DATA
// =============================================================================

export interface WorkloadPeriodData {
  date: string;
  period: string;
  fullDate: string;
  workHours: number;
  adminTimeHours: number;
  payrollCapacityHours: number;
  assignedHours: number;
  utilization: number;
  utilizationLevel: UtilizationLevel;
  utilizationHours: number;
  overflowHours: number;
  assignments: PayrollAssignment[];
  isOverallocated: boolean;
  isUnderutilized: boolean;
  hasConflicts?: boolean;
}

export interface CapacitySummary {
  totalCapacity: number;
  totalAssigned: number;
  avgUtilization: number;
  overallocatedPeriods: number;
  underutilizedPeriods: number;
  periodsShown: number;
  utilizationTrend: UtilizationTrend;
  peakUtilization: number;
  minUtilization: number;
  capacityEfficiency: number;
}

export interface CalendarDay {
  date: string;
  workHours: number;
  adminTimeHours: number;
  payrollCapacityHours: number;
  assignments: PayrollAssignment[];
  totalAssignedHours: number;
  utilization: number;
  utilizationLevel: UtilizationLevel;
  isOverallocated: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  dayOfWeek: number;
  hasDeadlines: boolean;
  notes?: string;
}

// =============================================================================
// API REQUEST/RESPONSE TYPES
// =============================================================================

export interface WorkloadMetricsRequest {
  userId: string;
  period: ViewPeriod;
  startDate: string;
  endDate: string;
}

export interface TeamCapacityRequest {
  teamIds: string[];
  period: ViewPeriod;
  startDate: string;
  endDate: string;
}

export interface AssignmentCalendarRequest {
  userId: string;
  startDate: string;
  endDate: string;
}

export interface UtilizationStatsRequest {
  userId: string;
  period: ViewPeriod;
  startDate: string;
  endDate: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors: string[];
}

export interface WorkloadMetricsResponse {
  periods: WorkloadPeriodData[];
  summary: CapacitySummary;
}

export interface TeamCapacityResponse {
  teamMembers: WorkloadMetricsResponse[];
  teamSummary: CapacitySummary;
}

export interface AssignmentCalendarResponse {
  calendarDays: CalendarDay[];
}

export interface UtilizationStatsResponse {
  summary: CapacitySummary;
  overallocatedPeriods: number;
  averageUtilization: number;
  utilizationTrend: UtilizationTrend;
  peakUtilization: number;
  minUtilization: number;
  capacityEfficiency: number;
}

// =============================================================================
// COMPONENT PROPS TYPES
// =============================================================================

export interface PayrollWorkloadVisualizationProps {
  // New format - array of team members
  teamMembers?: TeamMember[];
  
  // Legacy format - single user (for backward compatibility)
  userId?: string;
  userName?: string;
  userRole?: string;
  workSchedule?: WorkScheduleDay[];
  
  // Common props
  viewMode?: "consultant" | "manager";
  showCapacityComparison?: boolean;
  onAssignmentClick?: (assignment: PayrollAssignment) => void;
  onPeriodClick?: (period: WorkloadPeriodData) => void;
  onTeamMemberClick?: (member: TeamMember) => void;
  className?: string;
  enableExport?: boolean;
}

export interface SingleMemberVisualizationProps {
  userId: string;
  userName: string;
  userRole: string;
  workSchedule: WorkScheduleDay[];
  viewPeriod: ViewPeriod;
  currentDate: Date;
  selectedView: ViewType;
  onAssignmentClick?: (assignment: PayrollAssignment) => void;
  onPeriodClick?: (period: WorkloadPeriodData) => void;
  showSummaryStats?: boolean;
  enableDrillDown?: boolean;
  className?: string;
}

export interface WorkloadChartProps {
  data: WorkloadPeriodData[];
  viewPeriod: ViewPeriod;
  height?: number;
  showLegend?: boolean;
  onBarClick?: (period: WorkloadPeriodData) => void;
  onAssignmentClick?: (assignment: PayrollAssignment) => void;
  className?: string;
}

export interface WorkloadCalendarProps {
  userId: string;
  workSchedule: WorkScheduleDay[];
  viewPeriod: ViewPeriod;
  currentDate: Date;
  onDayClick?: (day: CalendarDay) => void;
  onAssignmentClick?: (assignment: PayrollAssignment) => void;
  showWeekends?: boolean;
  highlightDeadlines?: boolean;
  className?: string;
}

export interface CapacityStatsProps {
  summary: CapacitySummary;
  compact?: boolean;
  showTrend?: boolean;
  className?: string;
}

export interface TimeNavigationProps {
  viewPeriod: ViewPeriod;
  currentDate: Date;
  onPeriodChange: (period: ViewPeriod) => void;
  onDateChange: (date: Date) => void;
  onNavigate: (direction: "prev" | "next") => void;
  className?: string;
}

export interface AssignmentCardProps {
  assignment: PayrollAssignment;
  showClient?: boolean;
  showTime?: boolean;
  showStatus?: boolean;
  onClick?: (assignment: PayrollAssignment) => void;
  className?: string;
  variant?: "default" | "compact" | "detailed";
}

// =============================================================================
// HOOK RETURN TYPES
// =============================================================================

export interface UseWorkloadDataReturn {
  data: WorkloadMetricsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refresh: () => void;
}

export interface UseTeamCapacityReturn {
  data: TeamCapacityResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refresh: () => void;
}

export interface UseAssignmentCalendarReturn {
  data: AssignmentCalendarResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refresh: () => void;
}

export interface UseUtilizationStatsReturn {
  data: UtilizationStatsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refresh: () => void;
}

// =============================================================================
// STATE MANAGEMENT TYPES
// =============================================================================

export interface WorkloadState {
  selectedView: ViewType;
  viewPeriod: ViewPeriod;
  currentDate: Date;
  selectedTeamMembers: string[];
  filters: WorkloadFilters;
  preferences: WorkloadPreferences;
}

export interface WorkloadFilters {
  statuses: AssignmentStatus[];
  priorities: AssignmentPriority[];
  clients: string[];
  utilizationRange: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface WorkloadPreferences {
  showWeekends: boolean;
  showHolidays: boolean;
  highlightOverallocation: boolean;
  showTrends: boolean;
  compactView: boolean;
  defaultPeriod: ViewPeriod;
  defaultView: ViewType;
}

export interface WorkloadActions {
  setSelectedView: (view: ViewType) => void;
  setViewPeriod: (period: ViewPeriod) => void;
  setCurrentDate: (date: Date) => void;
  setSelectedTeamMembers: (members: string[]) => void;
  updateFilters: (filters: Partial<WorkloadFilters>) => void;
  updatePreferences: (preferences: Partial<WorkloadPreferences>) => void;
  resetFilters: () => void;
  navigatePeriod: (direction: "prev" | "next") => void;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export interface UtilizationThresholds {
  optimal: { min: number; max: number };
  high: { min: number; max: number };
  overallocated: { min: number };
  underutilized: { max: number };
}

export interface ColorTheme {
  optimal: string;
  high: string;
  overallocated: string;
  underutilized: string;
  capacity: string;
  overflow: string;
}

export interface ExportOptions {
  format: "pdf" | "excel" | "csv";
  includeCharts: boolean;
  includeDetails: boolean;
  dateRange: {
    start: Date;
    end: Date;
  };
  teamMembers?: string[];
}

// =============================================================================
// ERROR TYPES
// =============================================================================

export interface WorkloadError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

export interface ValidationError extends WorkloadError {
  field: string;
  value: unknown;
}

export interface ApiError extends WorkloadError {
  status: number;
  endpoint: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const UTILIZATION_THRESHOLDS: UtilizationThresholds = {
  optimal: { min: 70, max: 85 },
  high: { min: 85, max: 100 },
  overallocated: { min: 100 },
  underutilized: { max: 70 },
};

export const COLOR_THEME: ColorTheme = {
  optimal: "#10b981", // green-500
  high: "#f59e0b", // amber-500
  overallocated: "#ef4444", // red-500
  underutilized: "#6b7280", // gray-500
  capacity: "rgba(229, 231, 235, 0.8)", // gray-200 with opacity
  overflow: "#dc2626", // red-600
};

export const DEFAULT_PREFERENCES: WorkloadPreferences = {
  showWeekends: true,
  showHolidays: true,
  highlightOverallocation: true,
  showTrends: true,
  compactView: false,
  defaultPeriod: "week",
  defaultView: "chart",
};