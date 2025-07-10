import { addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from "date-fns";
import { useState, useCallback, useMemo } from "react";
import {
  WorkloadState,
  WorkloadActions,
  WorkloadFilters,
  WorkloadPreferences,
  ViewPeriod,
  ViewType,
  AssignmentStatus,
  AssignmentPriority,
  DEFAULT_PREFERENCES,
} from "../types/workload";

interface UseWorkloadStateOptions {
  initialState?: Partial<WorkloadState>;
  persistToLocalStorage?: boolean;
  storageKey?: string;
}

const DEFAULT_FILTERS: WorkloadFilters = {
  statuses: ["active", "pending"],
  priorities: ["high", "medium", "low"],
  clients: [],
  utilizationRange: { min: 0, max: 200 },
};

const DEFAULT_STATE: WorkloadState = {
  selectedView: "chart",
  viewPeriod: "week",
  currentDate: new Date(),
  selectedTeamMembers: [],
  filters: DEFAULT_FILTERS,
  preferences: DEFAULT_PREFERENCES,
};

export function useWorkloadState({
  initialState = {},
  persistToLocalStorage = true,
  storageKey = "workload-state",
}: UseWorkloadStateOptions = {}) {
  // Load initial state from localStorage if enabled
  const getInitialState = useCallback((): WorkloadState => {
    let savedState: Partial<WorkloadState> = {};
    
    if (persistToLocalStorage && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Convert date strings back to Date objects
          if (parsed.currentDate) {
            parsed.currentDate = new Date(parsed.currentDate);
          }
          if (parsed.filters?.dateRange) {
            parsed.filters.dateRange = {
              start: new Date(parsed.filters.dateRange.start),
              end: new Date(parsed.filters.dateRange.end),
            };
          }
          savedState = parsed;
        }
      } catch (error) {
        console.warn("Failed to load workload state from localStorage:", error);
      }
    }

    return {
      ...DEFAULT_STATE,
      ...savedState,
      ...initialState,
    };
  }, [initialState, persistToLocalStorage, storageKey]);

  const [state, setState] = useState<WorkloadState>(getInitialState);

  // Save state to localStorage when it changes
  const saveState = useCallback((newState: WorkloadState) => {
    if (persistToLocalStorage && typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newState));
      } catch (error) {
        console.warn("Failed to save workload state to localStorage:", error);
      }
    }
  }, [persistToLocalStorage, storageKey]);

  // Update state and save
  const updateState = useCallback((updates: Partial<WorkloadState>) => {
    setState(prevState => {
      const newState = { ...prevState, ...updates };
      saveState(newState);
      return newState;
    });
  }, [saveState]);

  // Action handlers
  const actions: WorkloadActions = useMemo(() => ({
    setSelectedView: (view: ViewType) => {
      updateState({ selectedView: view });
    },

    setViewPeriod: (period: ViewPeriod) => {
      updateState({ viewPeriod: period });
    },

    setCurrentDate: (date: Date) => {
      updateState({ currentDate: new Date(date) });
    },

    setSelectedTeamMembers: (members: string[]) => {
      updateState({ selectedTeamMembers: [...members] });
    },

    updateFilters: (filterUpdates: Partial<WorkloadFilters>) => {
      updateState({
        filters: {
          ...state.filters,
          ...filterUpdates,
        },
      });
    },

    updatePreferences: (preferenceUpdates: Partial<WorkloadPreferences>) => {
      updateState({
        preferences: {
          ...state.preferences,
          ...preferenceUpdates,
        },
      });
    },

    resetFilters: () => {
      updateState({ filters: DEFAULT_FILTERS });
    },

    navigatePeriod: (direction: "prev" | "next") => {
      const { viewPeriod, currentDate } = state;
      let newDate: Date;

      if (direction === "next") {
        switch (viewPeriod) {
          case "day":
            newDate = addDays(currentDate, 1);
            break;
          case "week":
            newDate = addWeeks(currentDate, 1);
            break;
          case "month":
            newDate = addMonths(currentDate, 1);
            break;
        }
      } else {
        switch (viewPeriod) {
          case "day":
            newDate = subDays(currentDate, 1);
            break;
          case "week":
            newDate = subWeeks(currentDate, 1);
            break;
          case "month":
            newDate = subMonths(currentDate, 1);
            break;
        }
      }

      updateState({ currentDate: newDate });
    },
  }), [state, updateState]);

  // Derived state helpers
  const derived = useMemo(() => ({
    // Check if any filters are active
    hasActiveFilters: () => {
      const { filters } = state;
      return (
        filters.statuses.length < 3 ||
        filters.priorities.length < 3 ||
        filters.clients.length > 0 ||
        filters.utilizationRange.min > 0 ||
        filters.utilizationRange.max < 200 ||
        !!filters.dateRange
      );
    },

    // Get filter counts
    getFilterCounts: () => ({
      statuses: state.filters.statuses.length,
      priorities: state.filters.priorities.length,
      clients: state.filters.clients.length,
    }),

    // Check if a team member is selected
    isTeamMemberSelected: (memberId: string) => 
      state.selectedTeamMembers.includes(memberId),

    // Get human-readable period description
    getPeriodDescription: () => {
      const { viewPeriod, currentDate } = state;
      const date = currentDate.toLocaleDateString();
      
      switch (viewPeriod) {
        case "day":
          return `Daily view for ${date}`;
        case "week":
          return `Weekly view for week of ${date}`;
        case "month":
          return `Monthly view for ${currentDate.toLocaleDateString("en-US", { 
            month: "long", 
            year: "numeric" 
          })}`;
      }
    },
  }), [state]);

  // Bulk operations
  const bulk = useMemo(() => ({
    selectAllTeamMembers: (memberIds: string[]) => {
      updateState({ selectedTeamMembers: [...memberIds] });
    },

    clearAllTeamMembers: () => {
      updateState({ selectedTeamMembers: [] });
    },

    toggleTeamMember: (memberId: string) => {
      const { selectedTeamMembers } = state;
      const newSelection = selectedTeamMembers.includes(memberId)
        ? selectedTeamMembers.filter(id => id !== memberId)
        : [...selectedTeamMembers, memberId];
      
      updateState({ selectedTeamMembers: newSelection });
    },

    resetToDefaults: () => {
      updateState(DEFAULT_STATE);
    },

    importState: (importedState: Partial<WorkloadState>) => {
      updateState(importedState);
    },

    exportState: () => ({ ...state }),
  }), [state, updateState]);

  return {
    state,
    actions,
    derived,
    bulk,
  };
}