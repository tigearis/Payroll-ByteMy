/**
 * Work Schedule Domain Components
 * 
 * This module exports all components related to workload visualization and management.
 * Components are organized by functionality and complexity.
 */

// Main dashboard component (replaces the old monolithic component)
export { default as PayrollWorkloadDashboard } from "./payroll-workload-dashboard";

// Core visualization components
export { default as WorkloadChart } from "./workload-chart";
export { default as WorkloadCalendar } from "./workload-calendar";

// UI components
export { default as CapacityStats } from "./capacity-stats";
export { default as AssignmentCard } from "./assignment-card";
export { default as TimeNavigation, EnhancedTimeNavigation } from "./time-navigation";

// Legacy component (for backward compatibility)
export { default as PayrollWorkloadVisualization } from "./payroll-workload-visualization";

// Re-export types for convenience
export type {
  PayrollWorkloadVisualizationProps,
  WorkloadChartProps,
  WorkloadCalendarProps,
  CapacityStatsProps,
  AssignmentCardProps,
  TimeNavigationProps,
} from "../types/workload";