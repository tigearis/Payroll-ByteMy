"use client";

/**
 * Advanced Payroll Scheduler - Refactored Modular Implementation
 * 
 * This component has been completely refactored from a monolithic 27,577-token component
 * into a clean, modular architecture that follows the app's design system and patterns.
 * 
 * Key improvements:
 * - Modular component architecture with single responsibility
 * - Proper state management with React context and reducers
 * - Modern UI patterns using app's design system components
 * - Responsive design with ResponsiveLayout
 * - Proper error boundaries and loading states
 * - TypeScript type safety throughout
 * - Enterprise logging integration
 * - Performance optimization with memoization
 * 
 * Architecture:
 * - SchedulerProvider: Context-based state management
 * - SchedulerHeader: Controls and navigation
 * - SchedulerGrid: Main calendar-like display
 * - SchedulerSidebar: Consultant summaries and stats
 * - SchedulerLegend: Visual feedback legend
 * - SchedulerErrorBoundary: Error handling
 * 
 * The original monolithic component has been backed up as:
 * advanced-payroll-scheduler-backup.tsx
 */

import AdvancedPayrollScheduler from "./advanced-scheduler";

// Re-export the new modular implementation
export default AdvancedPayrollScheduler;

// Also export named components for flexibility
export {
  SchedulerProvider,
  SchedulerErrorBoundary,
  SchedulerHeader,
  SchedulerGrid,
  SchedulerSidebar,
  SchedulerLegend,
} from "./advanced-scheduler";