"use client";

import { useQuery, useMutation } from "@apollo/client";
import { format, addDays, addWeeks, addMonths, subWeeks, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import React, { createContext, useContext, useReducer, useEffect, useMemo, ReactNode } from "react";
import {
  GetLeaveDocument,
  GetLeaveQuery,
} from "@/domains/leave/graphql/generated/graphql";
import {
  GetPayrollsByMonthDocument,
  GetPayrollsByMonthQuery,
  UpdatePayrollSimpleDocument,
} from "@/domains/payrolls/graphql/generated/graphql";
import {
  GetHolidaysByDateRangeDocument,
  GetHolidaysByDateRangeQuery,
  GetAllStaffWorkloadDocument,
  GetAllStaffWorkloadQuery,
} from "@/domains/work-schedule/graphql/generated/graphql";
import { logger } from "@/lib/logging/enterprise-logger";
import type {
  SchedulerState,
  SchedulerAction,
  PayrollAssignment,
  ConsultantSummary,
  Holiday,
  Leave,
  DateRange,
  ViewPeriod,
  PendingChange,
} from "./types";

// Initial state
const initialState: SchedulerState = {
  assignments: [],
  originalAssignments: [],
  consultants: [],
  holidays: [],
  leaves: [],
  currentDate: null,
  dateRange: { start: new Date(), end: new Date() },
  viewConfig: {
    period: "month",
    orientation: "consultants-as-columns",
    isExpanded: false,
    showGhosts: true,
    moveAsGroup: true,
  },
  filters: {
    searchTerm: "",
    selectedConsultants: [],
    selectedClients: [],
    showOnlyOnLeave: false,
  },
  dragState: {
    isDragging: false,
    draggedPayroll: null,
    dragOverCell: null,
  },
  pendingChanges: [],
  globalEdits: new Map(),
  isPreviewMode: false,
  isLoading: true,
  isUpdating: false,
  error: null,
};

// Reducer function
function schedulerReducer(state: SchedulerState, action: SchedulerAction): SchedulerState {
  switch (action.type) {
    case 'SET_CURRENT_DATE':
      return { ...state, currentDate: action.payload };
    
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload };
    
    case 'SET_VIEW_PERIOD':
      return { 
        ...state, 
        viewConfig: { ...state.viewConfig, period: action.payload } 
      };
    
    case 'SET_ORIENTATION':
      return { 
        ...state, 
        viewConfig: { ...state.viewConfig, orientation: action.payload } 
      };
    
    case 'SET_EXPANDED':
      return { 
        ...state, 
        viewConfig: { ...state.viewConfig, isExpanded: action.payload } 
      };
    
    case 'SET_ASSIGNMENTS':
      return { ...state, assignments: action.payload };
    
    case 'SET_CONSULTANTS':
      return { ...state, consultants: action.payload };
    
    case 'SET_HOLIDAYS':
      return { ...state, holidays: action.payload };
    
    case 'SET_LEAVES':
      return { ...state, leaves: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_UPDATING':
      return { ...state, isUpdating: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_DRAG_STATE':
      return { ...state, dragState: action.payload };
    
    case 'SET_PREVIEW_MODE':
      return { ...state, isPreviewMode: action.payload };
    
    case 'SET_SHOW_GHOSTS':
      return { 
        ...state, 
        viewConfig: { ...state.viewConfig, showGhosts: action.payload } 
      };
    
    case 'ADD_PENDING_CHANGE':
      return { 
        ...state, 
        pendingChanges: [...state.pendingChanges, action.payload] 
      };
    
    case 'REMOVE_PENDING_CHANGE':
      return { 
        ...state, 
        pendingChanges: state.pendingChanges.filter(change => change.payrollId !== action.payload) 
      };
    
    case 'CLEAR_PENDING_CHANGES':
      return { ...state, pendingChanges: [], globalEdits: new Map(), isPreviewMode: false };
    
    case 'SET_FILTERS':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload } 
      };
    
    case 'MOVE_ASSIGNMENT': {
      const { assignmentId, toConsultantId, toConsultantName } = action.payload;
      const newGlobalEdits = new Map(state.globalEdits);
      
      // Find the assignment
      const assignment = state.assignments.find(a => a.id === assignmentId);
      if (!assignment) return state;

      // Find original assignment to get original consultant info
      const originalAssignment = state.originalAssignments.find(orig => orig.payrollId === assignment.payrollId);
      const originalConsultantId = originalAssignment?.consultantId || assignment.consultantId;
      const originalConsultantName = originalAssignment?.consultantName || assignment.consultantName;

      // If moving back to original position, remove the edit instead of creating one
      if (toConsultantId === originalConsultantId) {
        // Remove all edits for this payroll
        const editKeysToRemove: string[] = [];
        newGlobalEdits.forEach((value, key) => {
          if (key.startsWith(`${assignment.payrollId}|||`)) {
            editKeysToRemove.push(key);
          }
        });
        editKeysToRemove.forEach(key => newGlobalEdits.delete(key));

        // Remove pending change
        const newPendingChanges = state.pendingChanges.filter(c => c.payrollId !== assignment.payrollId);

        return {
          ...state,
          globalEdits: newGlobalEdits,
          pendingChanges: newPendingChanges,
          isPreviewMode: newPendingChanges.length > 0,
        };
      }

      // Find all assignments for this payroll (group movement)
      const payrollAssignments = state.originalAssignments.filter(a => a.payrollId === assignment.payrollId);
      const affectedDates = payrollAssignments.map(a => a.adjustedEftDate);

      // Create edits for all dates of this payroll
      affectedDates.forEach(date => {
        const editKey = `${assignment.payrollId}|||${date}`;
        newGlobalEdits.set(editKey, { consultantId: toConsultantId, consultantName: toConsultantName });
      });

      // Create or update pending change
      const existingChangeIndex = state.pendingChanges.findIndex(c => c.payrollId === assignment.payrollId);
      const newPendingChanges = [...state.pendingChanges];
      
      const pendingChange: PendingChange = {
        payrollId: assignment.payrollId,
        payrollName: assignment.payrollName,
        fromConsultantId: originalConsultantId,
        toConsultantId,
        fromConsultantName: originalConsultantName,
        toConsultantName,
        affectedDates,
      };
      
      if (existingChangeIndex >= 0) {
        newPendingChanges[existingChangeIndex] = pendingChange;
      } else {
        newPendingChanges.push(pendingChange);
      }

      return {
        ...state,
        globalEdits: newGlobalEdits,
        pendingChanges: newPendingChanges,
        isPreviewMode: true,
      };
    }
    
    case 'REVERT_CHANGES':
      return {
        ...state,
        pendingChanges: [],
        globalEdits: new Map(),
        isPreviewMode: false,
        assignments: [...state.originalAssignments],
      };
    
    default:
      return state;
  }
}

// Context
const SchedulerContext = createContext<{
  state: SchedulerState;
  dispatch: React.Dispatch<SchedulerAction>;
  actions: SchedulerActions;
} | null>(null);

// Actions interface
interface SchedulerActions {
  setCurrentDate: (date: Date) => void;
  setViewPeriod: (period: ViewPeriod) => void;
  setOrientation: (orientation: "consultants-as-columns" | "consultants-as-rows") => void;
  toggleExpanded: () => void;
  toggleShowGhosts: () => void;
  navigatePrevious: () => void;
  navigateNext: () => void;
  moveAssignment: (assignmentId: string, toConsultantId: string, toConsultantName: string) => void;
  commitChanges: () => Promise<void>;
  revertChanges: () => void;
  updateFilters: (filters: Partial<SchedulerState['filters']>) => void;
  isConsultantOnLeave: (consultantId: string, date: Date) => boolean;
  getHolidayForDate: (date: Date) => Holiday | null;
  formatPeriodDisplay: () => string;
}

interface SchedulerProviderProps {
  children: ReactNode;
}

export function SchedulerProvider({ children }: SchedulerProviderProps) {
  const [state, dispatch] = useReducer(schedulerReducer, initialState);
  
  // Initialize client-side state
  useEffect(() => {
    dispatch({ type: 'SET_CURRENT_DATE', payload: new Date() });
  }, []);

  // Calculate date range based on current date and view period
  const dateRange: DateRange = useMemo(() => {
    if (!state.currentDate) {
      const fallbackDate = new Date();
      return { start: fallbackDate, end: fallbackDate };
    }

    let start: Date, end: Date;
    
    switch (state.viewConfig.period) {
      case "week":
        start = startOfWeek(state.currentDate);
        end = endOfWeek(state.currentDate);
        break;
      case "fortnight":
        start = startOfWeek(state.currentDate);
        end = addDays(start, 13);
        break;
      case "month":
        start = startOfMonth(state.currentDate);
        end = endOfMonth(state.currentDate);
        break;
    }

    return { start, end };
  }, [state.currentDate, state.viewConfig.period]);

  // Update state with calculated date range
  useEffect(() => {
    if (state.currentDate && (
      state.dateRange.start.getTime() !== dateRange.start.getTime() ||
      state.dateRange.end.getTime() !== dateRange.end.getTime()
    )) {
      dispatch({ 
        type: 'SET_DATE_RANGE', 
        payload: dateRange 
      });
    }
  }, [dateRange.start, dateRange.end, state.currentDate, state.dateRange]);

  // Data queries
  const { data: payrollData, loading: payrollLoading, error: payrollError, refetch } = useQuery<GetPayrollsByMonthQuery>(
    GetPayrollsByMonthDocument,
    {
      variables: {
        startDate: format(state.dateRange.start, "yyyy-MM-dd"),
        endDate: format(state.dateRange.end, "yyyy-MM-dd"),
      },
      errorPolicy: "all",
      skip: !state.currentDate,
      onCompleted: data => {
        logger.info("✅ Scheduler payroll data loaded", {
          namespace: "payrolls_domain",
          component: "scheduler_provider",
          metadata: {
            payrollsCount: data.payrolls?.length || 0,
          },
        });
      },
      onError: err => {
        logger.error("❌ Scheduler payroll data error", {
          namespace: "payrolls_domain",
          component: "scheduler_provider",
          error: err.message,
        });
        dispatch({ type: 'SET_ERROR', payload: err });
      },
    }
  );

  const { data: leaveData } = useQuery<GetLeaveQuery>(GetLeaveDocument, {
    variables: {
      where: {
        _and: [
          { startDate: { _lte: format(state.dateRange.end, "yyyy-MM-dd") } },
          { endDate: { _gte: format(state.dateRange.start, "yyyy-MM-dd") } },
          { status: { _eq: "Approved" } },
        ],
      },
    },
    errorPolicy: "all",
    skip: !state.currentDate,
  });

  const { data: holidaysData } = useQuery<GetHolidaysByDateRangeQuery>(
    GetHolidaysByDateRangeDocument,
    {
      variables: {
        startDate: format(state.dateRange.start, "yyyy-MM-dd"),
        endDate: format(state.dateRange.end, "yyyy-MM-dd"),
        countryCode: "AU",
      },
      errorPolicy: "all",
      skip: !state.currentDate,
    }
  );

  const { data: staffData } = useQuery<GetAllStaffWorkloadQuery>(
    GetAllStaffWorkloadDocument,
    {
      errorPolicy: "all",
      skip: !state.currentDate,
    }
  );

  const [updatePayrollConsultants, { loading: updating }] = useMutation(UpdatePayrollSimpleDocument);

  // Transform payroll data into assignments
  const transformData = (data: any): PayrollAssignment[] => {
    if (!data?.payrolls) return [];

    const assignmentList: PayrollAssignment[] = [];

    data.payrolls.forEach((payroll: any) => {
      if (!payroll.payrollDates || payroll.payrollDates.length === 0) return;

      payroll.payrollDates.forEach((dateInfo: any) => {
        const assignmentDate = new Date(dateInfo.adjustedEftDate);
        const primaryConsultant = payroll.primaryConsultant;
        const backupConsultant = payroll.backupConsultant;

        let finalConsultantId = primaryConsultant?.id || "unassigned";
        let finalConsultantName = primaryConsultant?.computedName ||
          `${primaryConsultant?.firstName} ${primaryConsultant?.lastName}`.trim() || "Unassigned";
        let isBackup = false;
        let originalConsultantId: string | undefined;
        let originalConsultantName: string | undefined;

        // Check if primary consultant is on leave
        if (primaryConsultant && isConsultantOnLeave(primaryConsultant.id, assignmentDate)) {
          if (backupConsultant) {
            originalConsultantId = primaryConsultant.id;
            originalConsultantName = primaryConsultant.computedName ||
              `${primaryConsultant.firstName} ${primaryConsultant.lastName}`.trim();
            finalConsultantId = backupConsultant.id;
            finalConsultantName = backupConsultant.computedName ||
              `${backupConsultant.firstName} ${backupConsultant.lastName}`.trim();
            isBackup = true;
          }
        }

        const assignment: PayrollAssignment = {
          id: dateInfo.id,
          payrollId: payroll.id,
          payrollName: payroll.name,
          clientName: payroll.client?.name || "Unknown Client",
          originalEftDate: dateInfo.originalEftDate,
          adjustedEftDate: dateInfo.adjustedEftDate,
          processingDate: dateInfo.processingDate,
          employeeCount: payroll.employeeCount || 0,
          processingTime: payroll.processingTime || 1,
          consultantId: finalConsultantId,
          consultantName: finalConsultantName,
          isBackup,
          originalConsultantId: originalConsultantId || "",
          originalConsultantName: originalConsultantName || "",
        };

        assignmentList.push(assignment);
      });
    });

    return assignmentList;
  };

  // Helper function to check if consultant is on leave
  const isConsultantOnLeave = (consultantId: string, date: Date): boolean => {
    if (!leaveData?.leave) return false;

    return leaveData.leave.some((leave: Leave) => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      return (
        leave.userId === consultantId &&
        leave.status === "Approved" &&
        isWithinInterval(date, { start: leaveStart, end: leaveEnd })
      );
    });
  };

  // Process data when queries complete
  useEffect(() => {
    if (payrollData) {
      let assignments = transformData(payrollData);
      
      // Store original assignments if not in preview mode
      if (!state.isPreviewMode) {
        dispatch({ type: 'SET_ASSIGNMENTS', payload: [...assignments] });
        // Also store as original for later comparison
        state.originalAssignments = [...assignments];
      } else {
        // Apply global edits if in preview mode
        if (state.globalEdits.size > 0) {
          const ghostAssignments: PayrollAssignment[] = [];
          
          assignments = assignments.map(assignment => {
            const editKey = `${assignment.payrollId}|||${assignment.adjustedEftDate}`;
            const edit = state.globalEdits.get(editKey);
            
            if (edit && edit.consultantId !== assignment.consultantId) {
              // Create ghost for original position
              const ghostAssignment = {
                ...assignment,
                id: `ghost-${assignment.id}-${Date.now()}`,
                isGhost: true,
                ghostToConsultant: edit.consultantName,
                ghostFromDate: assignment.adjustedEftDate,
              };
              ghostAssignments.push(ghostAssignment);
              
              // Return moved assignment
              return {
                ...assignment,
                consultantId: edit.consultantId,
                consultantName: edit.consultantName,
                isMoved: true,
                movedFromConsultant: assignment.consultantName,
              };
            }
            return assignment;
          });
          
          assignments = [...assignments, ...ghostAssignments];
        }
        
        dispatch({ type: 'SET_ASSIGNMENTS', payload: assignments });
      }
    }
  }, [payrollData, state.isPreviewMode, state.globalEdits.size]);

  useEffect(() => {
    if (staffData?.users) {
      const consultants: ConsultantSummary[] = staffData.users.map(user => ({
        id: user.id,
        name: user.computedName || `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        role: user.role,
        workSchedules: user.workSchedules || [],
        skills: user.skills || [],
        primaryPayrolls: user.primaryPayrollAssignments || [],
        backupPayrolls: user.backupPayrollAssignments || [],
        totalPayrolls: 0,
        totalEmployees: 0,
        totalProcessingTime: 0,
      }));
      dispatch({ type: 'SET_CONSULTANTS', payload: consultants });
    }
  }, [staffData]);

  useEffect(() => {
    if (holidaysData?.holidays) {
      dispatch({ type: 'SET_HOLIDAYS', payload: holidaysData.holidays as Holiday[] });
    }
  }, [holidaysData]);

  useEffect(() => {
    if (leaveData?.leave) {
      const leaves: Leave[] = leaveData.leave
        .filter(l => l && l.startDate && l.endDate && l.status === "Approved")
        .map(l => ({
          id: l.id,
          startDate: l.startDate,
          endDate: l.endDate,
          leaveType: l.leaveType,
          reason: l.reason ?? null,
          status: l.status,
          userId: l.userId,
        }));
      dispatch({ type: 'SET_LEAVES', payload: leaves });
    }
  }, [leaveData]);

  // Update loading state
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: payrollLoading });
  }, [payrollLoading]);

  useEffect(() => {
    dispatch({ type: 'SET_UPDATING', payload: updating });
  }, [updating]);

  // Action creators
  const actions: SchedulerActions = {
    setCurrentDate: (date: Date) => {
      dispatch({ type: 'SET_CURRENT_DATE', payload: date });
    },

    setViewPeriod: (period: ViewPeriod) => {
      dispatch({ type: 'SET_VIEW_PERIOD', payload: period });
    },

    setOrientation: (orientation: "consultants-as-columns" | "consultants-as-rows") => {
      dispatch({ type: 'SET_ORIENTATION', payload: orientation });
    },

    toggleExpanded: () => {
      dispatch({ type: 'SET_EXPANDED', payload: !state.viewConfig.isExpanded });
    },

    toggleShowGhosts: () => {
      dispatch({ type: 'SET_SHOW_GHOSTS', payload: !state.viewConfig.showGhosts });
    },

    navigatePrevious: () => {
      if (!state.currentDate) return;
      
      let newDate: Date;
      switch (state.viewConfig.period) {
        case "week":
          newDate = subWeeks(state.currentDate, 1);
          break;
        case "fortnight":
          newDate = subWeeks(state.currentDate, 2);
          break;
        case "month":
          newDate = subMonths(state.currentDate, 1);
          break;
      }
      dispatch({ type: 'SET_CURRENT_DATE', payload: newDate });
    },

    navigateNext: () => {
      if (!state.currentDate) return;
      
      let newDate: Date;
      switch (state.viewConfig.period) {
        case "week":
          newDate = addWeeks(state.currentDate, 1);
          break;
        case "fortnight":
          newDate = addWeeks(state.currentDate, 2);
          break;
        case "month":
          newDate = addMonths(state.currentDate, 1);
          break;
      }
      dispatch({ type: 'SET_CURRENT_DATE', payload: newDate });
    },

    moveAssignment: (assignmentId: string, toConsultantId: string, toConsultantName: string) => {
      dispatch({ 
        type: 'MOVE_ASSIGNMENT', 
        payload: { assignmentId, toConsultantId, toConsultantName } 
      });
    },

    commitChanges: async () => {
      if (state.pendingChanges.length === 0) {
        return;
      }

      dispatch({ type: 'SET_UPDATING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        // Execute mutations for each pending change
        for (const change of state.pendingChanges) {
          await updatePayrollConsultants({
            variables: {
              id: change.payrollId,
              set: {
                primaryConsultantUserId: change.toConsultantId,
                backupConsultantUserId: null // Reset backup when changing primary
              }
            }
          });

          logger.info("✅ Payroll consultant updated", {
            namespace: "payrolls_domain",
            component: "scheduler_provider",
            metadata: {
              payrollId: change.payrollId,
              fromConsultant: change.fromConsultantName,
              toConsultant: change.toConsultantName,
            },
          });
        }

        // Clear all changes and exit preview mode
        dispatch({ type: 'CLEAR_PENDING_CHANGES' });
        
        // Refetch data to get updated assignments
        refetch();

        logger.info("✅ All scheduler changes committed successfully", {
          namespace: "payrolls_domain", 
          component: "scheduler_provider",
          metadata: {
            changesCount: state.pendingChanges.length,
          },
        });

      } catch (error) {
        logger.error("❌ Failed to commit scheduler changes", {
          namespace: "payrolls_domain",
          component: "scheduler_provider", 
          error: error instanceof Error ? error.message : String(error),
        });
        
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error : new Error('Failed to save changes') });
      } finally {
        dispatch({ type: 'SET_UPDATING', payload: false });
      }
    },

    revertChanges: () => {
      dispatch({ type: 'REVERT_CHANGES' });
    },

    updateFilters: (filters: Partial<SchedulerState['filters']>) => {
      dispatch({ type: 'SET_FILTERS', payload: filters });
    },

    isConsultantOnLeave,

    getHolidayForDate: (date: Date): Holiday | null => {
      return state.holidays.find(holiday => 
        new Date(holiday.date).toDateString() === date.toDateString()
      ) || null;
    },

    formatPeriodDisplay: (): string => {
      if (!state.currentDate) return "";
      
      switch (state.viewConfig.period) {
        case "week":
          return format(startOfWeek(state.currentDate), "MMM dd") + " - " + 
                 format(endOfWeek(state.currentDate), "MMM dd, yyyy");
        case "fortnight":
          const start = startOfWeek(state.currentDate);
          return format(start, "MMM dd") + " - " + 
                 format(addDays(start, 13), "MMM dd, yyyy");
        case "month":
          return format(state.currentDate, "MMMM yyyy");
      }
    },
  };

  return (
    <SchedulerContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </SchedulerContext.Provider>
  );
}

// Hook to use scheduler context
export function useScheduler() {
  const context = useContext(SchedulerContext);
  if (!context) {
    throw new Error('useScheduler must be used within a SchedulerProvider');
  }
  return context;
}