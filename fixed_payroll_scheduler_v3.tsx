"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Save,
  Users,
  Clock,
  FileText,
  RefreshCw,
  UserX,
  Calendar,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  format,
  addDays,
  addWeeks,
  addMonths,
  subWeeks,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isWithinInterval,
  isWeekend,
} from "date-fns";
import { useQuery, useMutation } from "@apollo/client";

// Updated GraphQL Queries to match your actual data structure
import { gql } from "@apollo/client";
import { COMMIT_PAYROLL_ASSIGNMENTS } from "@/graphql/mutations/payrolls/commitPayrollAssignments";

const GET_PAYROLL_DATA = gql`
  query GetPayrollData($start_date: date!, $end_date: date!) {
    payrolls {
      id
      name
      employee_count
      processing_time
      status
      client {
        id
        name
      }
      userByPrimaryConsultantUserId {
        id
        name
        leaves {
          id
          start_date
          end_date
          leave_type
          reason
          status
        }
      }
      userByBackupConsultantUserId {
        id
        name
        leaves {
          id
          start_date
          end_date
          leave_type
          reason
          status
        }
      }
    }
    payroll_dates(
      where: { adjusted_eft_date: { _gte: $start_date, _lte: $end_date } }
    ) {
      id
      payroll_id
      original_eft_date
      adjusted_eft_date
      processing_date
      payroll {
        id
        name
        employee_count
        processing_time
        client {
          name
        }
        userByPrimaryConsultantUserId {
          id
          name
        }
        userByBackupConsultantUserId {
          id
          name
        }
      }
    }
    holidays(where: { date: { _gte: $start_date, _lte: $end_date } }) {
      id
      date
      local_name
      types
      region
      country_code
    }
  }
`;

const UPDATE_PAYROLL_CONSULTANTS = gql`
  mutation UpdatePayrollConsultants($updates: [payrolls_updates!]!) {
    update_payrolls_many(updates: $updates) {
      affected_rows
      returning {
        id
        name
        primary_consultant_user_id
        backup_consultant_user_id
        userByPrimaryConsultantUserId {
          id
          name
        }
        userByBackupConsultantUserId {
          id
          name
        }
        updated_at
      }
    }
  }
`;

type ViewPeriod = "week" | "fortnight" | "month";
type TableOrientation = "consultants-as-columns" | "consultants-as-rows";

interface PayrollAssignment {
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
}

interface ConsultantSummary {
  id: string;
  name: string;
  totalPayrolls: number;
  totalEmployees: number;
  totalProcessingTime: number;
  isOnLeave?: boolean;
}

interface Holiday {
  id: string;
  date: string;
  local_name: string;
  types?: string[]; // Make optional since some holidays might not have types
  region?: string;
  country_code: string;
}

interface Leave {
  id: string;
  start_date: string;
  end_date: string;
  leave_type: string;
  reason: string;
  status: string;
}

interface DragState {
  isDragging: boolean;
  draggedPayroll: PayrollAssignment | null;
  dragOverCell: { consultantId: string; date: string } | null;
}

interface PendingChange {
  payrollId: string;
  payrollName: string;
  fromConsultantId: string;
  toConsultantId: string;
  fromConsultantName: string;
  toConsultantName: string;
  affectedDates: string[]; // Array of dates affected by this change
}

export default function AdvancedPayrollScheduler() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>("month");
  const [tableOrientation, setTableOrientation] = useState<TableOrientation>(
    "consultants-as-columns"
  );

  // Add custom CSS variables for dark mode support
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--orange", "25 95% 53%"); // Orange color
    root.style.setProperty("--orange-muted", "25 95% 53% / 0.4"); // Orange muted
  }, []);

  // Simplified state management
  const [assignments, setAssignments] = useState<PayrollAssignment[]>([]);
  const [originalAssignments, setOriginalAssignments] = useState<
    PayrollAssignment[]
  >([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [moveAsGroup, setMoveAsGroup] = useState(true);
  const [showGhosts, setShowGhosts] = useState(true);

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedPayroll: null,
    dragOverCell: null,
  });

  // Calculate date range
  const dateRange = useMemo(() => {
    let start: Date, end: Date;

    switch (viewPeriod) {
      case "week":
        start = startOfWeek(currentDate);
        end = endOfWeek(currentDate);
        break;
      case "fortnight":
        start = startOfWeek(currentDate);
        end = addDays(start, 13);
        break;
      case "month":
        start = startOfMonth(currentDate);
        end = endOfMonth(currentDate);
        break;
    }

    return { start, end };
  }, [currentDate, viewPeriod]);

  // Generate dates array
  const dates = useMemo(() => {
    const dateArray: Date[] = [];
    const current = new Date(dateRange.start);

    while (current <= dateRange.end) {
      dateArray.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dateArray;
  }, [dateRange]);

  // GraphQL Data Fetching with simplified query
  const { data, loading, error, refetch } = useQuery(GET_PAYROLL_DATA, {
    variables: {
      start_date: format(dateRange.start, "yyyy-MM-dd"),
      end_date: format(dateRange.end, "yyyy-MM-dd"),
    },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      console.log("🎯 GraphQL Data Loaded:", {
        payrolls: data?.payrolls?.length || 0,
        payroll_dates: data?.payroll_dates?.length || 0,
        holidays: data?.holidays?.length || 0,
      });
    },
    onError: (error) => {
      console.error("❌ GraphQL Error:", error);
    },
  });

  const [
    commitPayrollAssignments,
    { loading: committing, error: commitError },
  ] = useMutation(COMMIT_PAYROLL_ASSIGNMENTS);

  const [updatePayrollConsultants, { loading: updating, error: updateError }] =
    useMutation(UPDATE_PAYROLL_CONSULTANTS);

  // Helper function to check if consultant is on leave
  const isConsultantOnLeave = (consultant: any, date: Date): boolean => {
    if (!consultant?.leaves) return false;

    return consultant.leaves.some((leave: Leave) => {
      const leaveStart = new Date(leave.start_date);
      const leaveEnd = new Date(leave.end_date);
      return (
        leave.status === "approved" &&
        isWithinInterval(date, { start: leaveStart, end: leaveEnd })
      );
    });
  };

  // Transform data into assignments
  const transformData = (data: any): PayrollAssignment[] => {
    if (!data?.payroll_dates) return [];

    const assignmentList: PayrollAssignment[] = [];
    const payrollsMap = new Map();

    // Create payrolls map for quick lookup
    data.payrolls?.forEach((payroll: any) => {
      payrollsMap.set(payroll.id, payroll);
    });

    data.payroll_dates.forEach((dateInfo: any) => {
      const payroll = dateInfo.payroll || payrollsMap.get(dateInfo.payroll_id);
      if (!payroll) return;

      const assignmentDate = new Date(dateInfo.adjusted_eft_date);
      const primaryConsultant = payroll.userByPrimaryConsultantUserId;
      const backupConsultant = payroll.userByBackupConsultantUserId;

      let finalConsultantId = primaryConsultant?.id || "unassigned";
      let finalConsultantName = primaryConsultant?.name || "Unassigned";
      let isBackup = false;
      let originalConsultantId: string | undefined;
      let originalConsultantName: string | undefined;

      // Check if primary consultant is on leave
      if (
        primaryConsultant &&
        isConsultantOnLeave(primaryConsultant, assignmentDate)
      ) {
        if (backupConsultant) {
          originalConsultantId = primaryConsultant.id;
          originalConsultantName = primaryConsultant.name;
          finalConsultantId = backupConsultant.id;
          finalConsultantName = backupConsultant.name;
          isBackup = true;
        }
      }

      const assignment: PayrollAssignment = {
        id: dateInfo.id,
        payrollId: payroll.id,
        payrollName: payroll.name,
        clientName: payroll.client?.name || "Unknown Client",
        originalEftDate: dateInfo.original_eft_date,
        adjustedEftDate: dateInfo.adjusted_eft_date,
        processingDate: dateInfo.processing_date,
        employeeCount: payroll.employee_count || 0,
        processingTime: payroll.processing_time || 1,
        consultantId: finalConsultantId,
        consultantName: finalConsultantName,
        isBackup,
        originalConsultantId,
        originalConsultantName,
      };

      assignmentList.push(assignment);
    });

    return assignmentList;
  };

  // Initialize assignments when data loads
  useEffect(() => {
    if (data) {
      const freshAssignments = transformData(data);
      setAssignments(freshAssignments);
      setOriginalAssignments([...freshAssignments]);
      console.log("📋 Assignments set:", freshAssignments.length);
    }
  }, [data]);

  // Extract consultants from data
  const consultants = useMemo(() => {
    if (!data?.payrolls) return [];

    const consultantMap = new Map();

    data.payrolls.forEach((payroll: any) => {
      if (payroll.userByPrimaryConsultantUserId) {
        consultantMap.set(
          payroll.userByPrimaryConsultantUserId.id,
          payroll.userByPrimaryConsultantUserId
        );
      }
      if (payroll.userByBackupConsultantUserId) {
        consultantMap.set(
          payroll.userByBackupConsultantUserId.id,
          payroll.userByBackupConsultantUserId
        );
      }
    });

    return Array.from(consultantMap.values());
  }, [data]);

  // Calculate consultant summaries
  const consultantSummaries = useMemo(() => {
    const summaries: ConsultantSummary[] = consultants.map((consultant) => {
      const consultantAssignments = assignments.filter(
        (a) => a.consultantId === consultant.id && !a.isGhost
      );

      const hasLeaveInPeriod = dates.some((date) =>
        isConsultantOnLeave(consultant, date)
      );

      return {
        id: consultant.id,
        name: consultant.name,
        totalPayrolls: consultantAssignments.length,
        totalEmployees: consultantAssignments.reduce(
          (sum, a) => sum + a.employeeCount,
          0
        ),
        totalProcessingTime: consultantAssignments.reduce(
          (sum, a) => sum + a.processingTime,
          0
        ),
        isOnLeave: hasLeaveInPeriod,
      };
    });

    return summaries;
  }, [consultants, assignments, dates]);

  const holidays = data?.holidays || [];

  // Helper functions
  const getHolidayForDate = (date: Date): Holiday | null => {
    return (
      holidays.find((holiday: Holiday) =>
        isSameDay(new Date(holiday.date), date)
      ) || null
    );
  };

  const getProcessingTimeColor = (
    processingTime: number,
    isPreview = false,
    isBackup = false,
    isGhost = false,
    isMoved = false
  ) => {
    if (isGhost) return "hsl(var(--muted) / 0.3)"; // Muted gray for ghosts

    const maxTime = Math.max(...assignments.map((a) => a.processingTime));
    const intensity = Math.min(processingTime / maxTime, 1);
    const alpha = 0.2 + intensity * 0.6;

    if (isPreview) return `hsl(var(--orange) / ${alpha})`; // Orange for preview
    if (isBackup) return `hsl(var(--destructive) / ${alpha})`; // Red for backup
    if (isMoved) return `hsl(var(--orange) / ${alpha})`; // Orange for moved assignments
    return `hsl(var(--primary) / ${alpha})`; // Primary color for original positions
  };

  // Helper function to check if assignment has been moved
  const isAssignmentMoved = (assignment: PayrollAssignment): boolean => {
    if (assignment.isGhost) return false;

    const original = originalAssignments.find(
      (orig) => orig.id === assignment.id
    );
    if (!original) return false;

    return (
      assignment.consultantId !== original.consultantId ||
      assignment.adjustedEftDate !== original.adjustedEftDate
    );
  };

  // Helper function to get original consultant name for moved assignments
  const getOriginalConsultantName = (
    assignment: PayrollAssignment
  ): string | null => {
    if (assignment.isGhost) return null;

    const original = originalAssignments.find(
      (orig) => orig.id === assignment.id
    );
    if (!original) return null;

    // Only return original consultant name if the assignment was actually moved
    if (
      assignment.consultantId !== original.consultantId ||
      assignment.adjustedEftDate !== original.adjustedEftDate
    ) {
      return original.consultantName;
    }

    return null;
  };

  // Navigation functions
  const navigatePrevious = () => {
    // Clean up ghosts when navigating
    if (isPreviewMode) {
      setAssignments((prev) => removeGhosts(prev));
    }

    switch (viewPeriod) {
      case "week":
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case "fortnight":
        setCurrentDate(subWeeks(currentDate, 2));
        break;
      case "month":
        setCurrentDate(subMonths(currentDate, 1));
        break;
    }
  };

  const navigateNext = () => {
    // Clean up ghosts when navigating
    if (isPreviewMode) {
      setAssignments((prev) => removeGhosts(prev));
    }

    switch (viewPeriod) {
      case "week":
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case "fortnight":
        setCurrentDate(addWeeks(currentDate, 2));
        break;
      case "month":
        setCurrentDate(addMonths(currentDate, 1));
        break;
    }
  };

  // Drag and drop handlers
  const handleDragStart = (
    e: React.DragEvent,
    assignment: PayrollAssignment
  ) => {
    if (!isPreviewMode || loading || committing) {
      e.preventDefault();
      return;
    }

    setDragState({
      isDragging: true,
      draggedPayroll: assignment,
      dragOverCell: null,
    });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDragState({
      isDragging: false,
      draggedPayroll: null,
      dragOverCell: null,
    });
  };

  const handleDragOver = (
    e: React.DragEvent,
    consultantId: string,
    date: string
  ) => {
    if (!isPreviewMode) return;
    e.preventDefault();
    setDragState((prev) => ({
      ...prev,
      dragOverCell: { consultantId, date },
    }));
  };

  const handleDrop = (
    e: React.DragEvent,
    targetConsultantId: string,
    targetDate: string
  ) => {
    e.preventDefault();
    if (!isPreviewMode) return;

    const { draggedPayroll } = dragState;
    if (!draggedPayroll) return;

    setAssignments((prev) => {
      const newGhosts: PayrollAssignment[] = [];
      const timestamp = Date.now(); // Add timestamp for unique keys

      if (moveAsGroup) {
        // Move all assignments for this payroll
        const updatedAssignments = prev
          .filter((a) => {
            // Remove existing ghosts for this payroll only
            if (a.isGhost && a.payrollId === draggedPayroll.payrollId) {
              return false; // Remove old ghosts for this payroll
            }
            return true; // Keep everything else
          })
          .map((a) => {
            if (a.payrollId === draggedPayroll.payrollId) {
              // Find the original assignment to compare
              const originalAssignment = originalAssignments.find(
                (orig) => orig.id === a.id
              );

              // Check if we're moving back to the original position
              const isReturningToOriginal =
                originalAssignment &&
                originalAssignment.consultantId === targetConsultantId &&
                originalAssignment.adjustedEftDate === a.adjustedEftDate;

              // Only create ghost if not returning to original position AND position is changing
              if (
                !isReturningToOriginal &&
                a.consultantId !== targetConsultantId
              ) {
                newGhosts.push({
                  ...a,
                  id: `ghost-${a.id}-${timestamp}`,
                  isGhost: true,
                  ghostFromConsultant:
                    consultants.find((c) => c.id === targetConsultantId)
                      ?.name || "Unknown",
                  ghostFromDate: a.adjustedEftDate,
                });
              }

              // Move to new position
              return {
                ...a,
                consultantId: targetConsultantId,
                consultantName:
                  consultants.find((c) => c.id === targetConsultantId)?.name ||
                  "Unknown",
              };
            }
            return a;
          });

        return [...updatedAssignments, ...newGhosts];
      } else {
        // Move only the specific assignment
        const updatedAssignments = prev
          .filter((a) => {
            // Remove existing ghosts for this specific assignment
            if (
              a.isGhost &&
              a.id.startsWith(
                `ghost-${draggedPayroll.id.replace("ghost-", "").split("-")[0]}`
              )
            ) {
              return false; // Remove old ghosts for this assignment
            }
            return true; // Keep everything else
          })
          .map((a) => {
            if (a.id === draggedPayroll.id) {
              // Find the original assignment to compare
              const originalAssignment = originalAssignments.find(
                (orig) => orig.id === a.id
              );

              // Check if we're moving back to the original position
              const isReturningToOriginal =
                originalAssignment &&
                originalAssignment.consultantId === targetConsultantId &&
                originalAssignment.adjustedEftDate === targetDate;

              // Only create ghost if not returning to original position AND position is changing
              if (
                !isReturningToOriginal &&
                (a.consultantId !== targetConsultantId ||
                  a.adjustedEftDate !== targetDate)
              ) {
                newGhosts.push({
                  ...a,
                  id: `ghost-${a.id}-${timestamp}`,
                  isGhost: true,
                  ghostFromConsultant:
                    consultants.find((c) => c.id === targetConsultantId)
                      ?.name || "Unknown",
                  ghostFromDate: a.adjustedEftDate,
                });
              }

              // Move to new position
              return {
                ...a,
                consultantId: targetConsultantId,
                consultantName:
                  consultants.find((c) => c.id === targetConsultantId)?.name ||
                  "Unknown",
                adjustedEftDate: targetDate,
              };
            }
            return a;
          });

        return [...updatedAssignments, ...newGhosts];
      }
    });

    setDragState({
      isDragging: false,
      draggedPayroll: null,
      dragOverCell: null,
    });
  };

  // Get assignments for a specific cell
  const getAssignmentsForCell = (consultantId: string, date: Date) => {
    const visibleAssignments = getVisibleAssignments(assignments);
    return visibleAssignments.filter((assignment) => {
      const isSameConsultant = assignment.consultantId === consultantId;
      const isSameDate = isSameDay(new Date(assignment.adjustedEftDate), date);
      return isSameConsultant && isSameDate;
    });
  };

  // Helper function to clean up ghost assignments
  const removeGhosts = (
    assignments: PayrollAssignment[]
  ): PayrollAssignment[] => {
    return assignments.filter((a) => !a.isGhost);
  };

  // Calculate pending changes
  const pendingChanges = useMemo(() => {
    const changes: PendingChange[] = [];
    const changesMap = new Map<string, PendingChange>();

    // Only look at non-ghost assignments
    const realAssignments = removeGhosts(assignments);

    realAssignments.forEach((current) => {
      const original = originalAssignments.find(
        (orig) => orig.id === current.id
      );
      if (
        original &&
        (current.consultantId !== original.consultantId ||
          current.adjustedEftDate !== original.adjustedEftDate)
      ) {
        const changeKey = current.payrollId;

        if (!changesMap.has(changeKey)) {
          changesMap.set(changeKey, {
            payrollId: current.payrollId,
            payrollName: current.payrollName,
            fromConsultantId: original.consultantId,
            toConsultantId: current.consultantId,
            fromConsultantName: original.consultantName,
            toConsultantName: current.consultantName,
            affectedDates: [current.adjustedEftDate],
          });
        } else {
          const existingChange = changesMap.get(changeKey)!;
          if (!existingChange.affectedDates.includes(current.adjustedEftDate)) {
            existingChange.affectedDates.push(current.adjustedEftDate);
          }
        }
      }
    });

    return Array.from(changesMap.values());
  }, [assignments, originalAssignments]);

  // Commit changes
  const commitChanges = async () => {
    if (pendingChanges.length === 0) return;

    try {
      console.log("🚀 Committing payroll consultant changes:", pendingChanges);
      console.log(
        "📊 Changes details:",
        pendingChanges.map((c) => ({
          payroll: c.payrollName,
          from: c.fromConsultantName,
          to: c.toConsultantName,
          dates: c.affectedDates,
        }))
      );

      // Create updates for each changed payroll
      const updates = pendingChanges.map((change) => ({
        where: { id: { _eq: change.payrollId } },
        _set: {
          primary_consultant_user_id: change.toConsultantId,
          updated_at: new Date().toISOString(),
        },
      }));

      console.log("🔧 GraphQL Updates:", updates);

      const result = await updatePayrollConsultants({
        variables: { updates },
      });

      console.log("✅ Update result:", result);

      if (result.data?.update_payrolls_many) {
        const affectedRows = result.data.update_payrolls_many.affected_rows;

        // Success: exit preview mode and refresh data
        const cleanAssignments = removeGhosts(assignments);
        setIsPreviewMode(false);
        setOriginalAssignments([...cleanAssignments]);
        setAssignments(cleanAssignments);

        // Show success message
        console.log(`✅ Successfully updated ${affectedRows} payroll(s)`);

        // Optional: Show success toast/notification
        // You can replace this alert with a proper toast notification
        if (affectedRows > 0) {
          alert(
            `✅ Successfully updated ${affectedRows} payroll assignment${
              affectedRows !== 1 ? "s" : ""
            }!`
          );
        }

        // Refresh data
        refetch();
      } else {
        throw new Error("No data returned from update mutation");
      }
    } catch (error) {
      console.error("❌ Commit failed:", error);

      // Show user-friendly error
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to save changes: ${errorMessage}`);
    }
  };

  // Revert changes
  const revertChanges = () => {
    setIsPreviewMode(false);
    setAssignments([...originalAssignments]);
  };

  // Enter preview mode
  const enterPreviewMode = () => {
    setIsPreviewMode(true);
    // Remove any existing ghosts
    setAssignments((prev) => removeGhosts(prev));
    // Optional: Reset ghost visibility to true when entering preview mode
    // setShowGhosts(true); // Uncomment if you want ghosts always visible on preview start
  };

  // Helper function to filter assignments based on ghost visibility
  const getVisibleAssignments = (
    assignments: PayrollAssignment[]
  ): PayrollAssignment[] => {
    if (showGhosts || !isPreviewMode) {
      return assignments; // Show all assignments including ghosts
    }
    return assignments.filter((a) => !a.isGhost); // Hide ghosts when toggle is off
  };

  // Format period display
  const formatPeriodDisplay = () => {
    switch (viewPeriod) {
      case "week":
        return `Week of ${format(dateRange.start, "MMM d, yyyy")}`;
      case "fortnight":
        return `${format(dateRange.start, "MMM d")} - ${format(
          dateRange.end,
          "MMM d, yyyy"
        )}`;
      case "month":
        return format(currentDate, "MMMM yyyy");
    }
  };

  // Helper function to get text color based on processing time intensity
  const getTextColorForProcessingTime = (
    processingTime: number,
    isGhost = false
  ): string => {
    if (isGhost) return "text-muted-foreground";

    const maxTime = Math.max(...assignments.map((a) => a.processingTime));
    const intensity = Math.min(processingTime / maxTime, 1);

    // As intensity increases (darker background), text should get lighter but still readable
    if (intensity > 0.7) {
      return "text-white dark:text-gray-100"; // White text for very dark backgrounds
    } else if (intensity > 0.4) {
      return "text-gray-900 dark:text-gray-100"; // Dark text for medium backgrounds (improved readability)
    } else if (intensity > 0.2) {
      return "text-gray-900 dark:text-gray-200"; // Dark text for light backgrounds
    } else {
      return "text-gray-900 dark:text-gray-100"; // Dark text for very light backgrounds
    }
  };

  // Helper function to get text color for consultant header cards based on total processing time
  const getConsultantHeaderTextColor = (
    totalProcessingTime: number,
    isOnLeave = false,
    isIcon = false
  ): string => {
    if (isOnLeave) {
      // Light green cards for consultants on leave - dark text for good contrast
      return isIcon
        ? "text-green-800 dark:text-green-200"
        : "text-green-900 dark:text-green-100";
    }

    // Light blue cards for normal consultants - dark text for good contrast
    return isIcon
      ? "text-blue-800 dark:text-blue-200"
      : "text-blue-900 dark:text-blue-100";
  };

  // Helper function for consultant card background colors
  const getConsultantCardBackgroundStyle = (
    totalProcessingTime: number,
    isOnLeave = false
  ): React.CSSProperties => {
    if (isOnLeave) {
      return {
        backgroundColor: `rgb(134, 239, 172)`, // Lighter green for on leave (green-300)
      };
    }

    return {
      backgroundColor: `rgb(147, 197, 253)`, // Lighter blue for normal consultants (blue-300)
    };
  };

  // Helper function to render array text as individual badges
  const renderArrayBadges = (
    items: string | string[] | undefined | null,
    className: string = "",
    variant: "default" | "outline" = "default"
  ) => {
    if (!items) return null;

    const itemArray = Array.isArray(items) ? items : [items];

    return (
      <div className="flex flex-wrap gap-0.5 justify-center">
        {itemArray.map((item, index) => (
          <Badge
            key={index}
            variant={variant}
            className={`text-xs px-1 py-0 h-4 text-center min-w-0 ${className}`}
          >
            {item}
          </Badge>
        ))}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading payroll scheduler...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️ Error loading data</div>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <Button className="mt-4" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && assignments.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Advanced Payroll Scheduler
            </h2>
            <p className="text-gray-600">
              Drag-and-drop scheduling with consultant summaries
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No payrolls found for this period
            </h3>
            <p className="text-gray-600 mb-4">
              There are no payroll assignments for{" "}
              {formatPeriodDisplay().toLowerCase()}.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Advanced Payroll Scheduler
          </h2>
          <p className="text-gray-600">
            Drag-and-drop scheduling with consultant summaries
          </p>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Period Selection */}
            <div className="flex items-center space-x-2">
              <Label>Period:</Label>
              <Tabs
                value={viewPeriod}
                onValueChange={(value) => setViewPeriod(value as ViewPeriod)}
              >
                <TabsList>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="fortnight">Fortnight</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Orientation Switch */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={tableOrientation === "consultants-as-rows"}
                onCheckedChange={(checked) =>
                  setTableOrientation(
                    checked ? "consultants-as-rows" : "consultants-as-columns"
                  )
                }
                disabled={loading || committing}
              />
              <Label>Consultants as Rows</Label>
            </div>

            {/* Group Movement Switch */}
            {/* <div className="flex items-center space-x-2">
              <Switch
                checked={moveAsGroup}
                onCheckedChange={setMoveAsGroup}
                disabled={loading || committing || !isPreviewMode}
              />
              <Label>Move Entire Payroll Group</Label>
            </div> */}

            {/* Ghost Visibility Switch */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={showGhosts}
                onCheckedChange={setShowGhosts}
                disabled={loading || committing || !isPreviewMode}
              />
              <Label>Show Original Positions</Label>
            </div>

            {/* Preview Mode Actions */}
            {!isPreviewMode ? (
              <div className="ml-auto">
                <Button
                  onClick={enterPreviewMode}
                  disabled={loading || committing}
                >
                  Edit Schedule
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-auto">
                <Badge variant="outline">
                  {pendingChanges.length} pending change
                  {pendingChanges.length !== 1 ? "s" : ""}
                </Badge>
                {(committing || updating) && (
                  <Badge variant="outline">Saving...</Badge>
                )}
                {(commitError || updateError) && (
                  <Badge variant="destructive" className="text-xs">
                    Save failed
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={revertChanges}
                  disabled={committing || updating}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={commitChanges}
                  disabled={
                    committing || updating || pendingChanges.length === 0
                  }
                >
                  <Save className="w-4 h-4 mr-2" />
                  {committing || updating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={navigatePrevious}
          disabled={loading || committing}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <h3 className="text-xl font-semibold">{formatPeriodDisplay()}</h3>

        <Button
          variant="outline"
          onClick={navigateNext}
          disabled={loading || committing}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Preview Mode Banner */}
      {isPreviewMode && (
        <div className="p-3 bg-orange-100 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-orange-50">
              Preview Mode
            </Badge>
            <span className="text-sm text-orange-800">
              Drag payrolls to reassign them. Changes won't be saved until you
              click "Save Changes".
            </span>
          </div>
        </div>
      )}

      {/* Color Legend */}
      {isPreviewMode && (
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <span className="font-medium text-foreground">Color Legend:</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-primary/40"></div>
                <span>Original Position</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: "hsl(var(--orange) / 0.4)" }}
                ></div>
                <span>Moved Assignment</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-destructive/40"></div>
                <span>Backup Consultant</span>
              </div>
              {showGhosts && (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded border-dashed border-2 border-muted-foreground bg-muted/30"></div>
                  <span>Original Position (Ghost)</span>
                </div>
              )}
              {!showGhosts && isPreviewMode && pendingChanges.length > 0 && (
                <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                  <span className="text-xs italic">
                    Ghosts hidden - toggle to see original positions
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Table */}
      <Card className="dark:bg-card">
        <CardContent className="p-0">
          <div className="overflow-auto max-h-[70vh] border rounded-lg bg-background dark:bg-card relative scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
            <Table>
              <TableHeader className="sticky top-0 z-20">
                <TableRow className="bg-background dark:bg-card border-b-2 border-border">
                  <TableHead className="sticky left-0 bg-background dark:bg-card z-30 w-fit min-w-[40px] max-w-[140px] shadow-sm">
                    {tableOrientation === "consultants-as-columns"
                      ? "Date"
                      : "Consultant"}
                  </TableHead>
                  {tableOrientation === "consultants-as-columns"
                    ? consultants.map((consultant) => {
                        const summary = consultantSummaries.find(
                          (s) => s.id === consultant.id
                        );
                        return (
                          <TableHead
                            key={consultant.id}
                            className="text-center min-w-[140px] p-1 bg-background"
                          >
                            <Card
                              className="shadow-sm border"
                              style={getConsultantCardBackgroundStyle(
                                summary?.totalProcessingTime || 0,
                                summary?.isOnLeave
                              )}
                            >
                              <CardContent className="p-2">
                                <div className="space-y-1.5">
                                  <div
                                    className={`font-semibold flex items-center justify-center gap-1.5 text-sm ${getConsultantHeaderTextColor(
                                      summary?.totalProcessingTime || 0,
                                      summary?.isOnLeave
                                    )}`}
                                  >
                                    {consultant.name}
                                    {summary?.isOnLeave && (
                                      <UserX className="w-3 h-3 text-green-900 dark:text-green-400" />
                                    )}
                                  </div>
                                  <div className="text-xs grid grid-cols-3 gap-1.5">
                                    <div
                                      title="Payrolls"
                                      className="text-center"
                                    >
                                      <FileText
                                        className={`w-3 h-3 mx-auto mb-0.5 ${getConsultantHeaderTextColor(
                                          summary?.totalProcessingTime || 0,
                                          summary?.isOnLeave,
                                          true
                                        )}`}
                                      />
                                      <div
                                        className={`font-medium ${getConsultantHeaderTextColor(
                                          summary?.totalProcessingTime || 0,
                                          summary?.isOnLeave
                                        )}`}
                                      >
                                        {summary?.totalPayrolls || 0}
                                      </div>
                                    </div>
                                    <div
                                      title="Employees"
                                      className="text-center"
                                    >
                                      <Users
                                        className={`w-3 h-3 mx-auto mb-0.5 ${getConsultantHeaderTextColor(
                                          summary?.totalProcessingTime || 0,
                                          summary?.isOnLeave,
                                          true
                                        )}`}
                                      />
                                      <div
                                        className={`font-medium ${getConsultantHeaderTextColor(
                                          summary?.totalProcessingTime || 0,
                                          summary?.isOnLeave
                                        )}`}
                                      >
                                        {summary?.totalEmployees || 0}
                                      </div>
                                    </div>
                                    <div title="Hours" className="text-center">
                                      <Clock
                                        className={`w-3 h-3 mx-auto mb-0.5 ${getConsultantHeaderTextColor(
                                          summary?.totalProcessingTime || 0,
                                          summary?.isOnLeave,
                                          true
                                        )}`}
                                      />
                                      <div
                                        className={`font-medium ${getConsultantHeaderTextColor(
                                          summary?.totalProcessingTime || 0,
                                          summary?.isOnLeave
                                        )}`}
                                      >
                                        {summary?.totalProcessingTime || 0}h
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </TableHead>
                        );
                      })
                    : dates.map((date) => {
                        const holiday = getHolidayForDate(date);
                        const isWeekendDay = isWeekend(date);
                        return (
                          <TableHead
                            key={date.toISOString()}
                            className="text-center min-w-[25px] max-w-[55px] p-1 bg-background"
                          >
                            <Card
                              className={`${
                                holiday
                                  ? "bg-red-200 dark:bg-red-900/80 border-red-400 dark:border-red-600"
                                  : isWeekendDay
                                  ? "bg-blue-200 dark:bg-blue-900/80 border-blue-400 dark:border-blue-600"
                                  : "bg-card border-border"
                              } shadow-sm`}
                            >
                              <CardContent className="p-0.5">
                                <div className="space-y-0.5 text-center">
                                  <div className="text-xs font-medium text-gray-600">
                                    {format(date, "EEE")}
                                  </div>
                                  <div className="text-xs font-bold text-gray-900">
                                    {format(date, "d")}
                                  </div>
                                  {holiday ? (
                                    <div className="text-xs space-y-0.5">
                                      <Calendar className="w-2 h-2 mx-auto text-red-600" />
                                      {renderArrayBadges(
                                        holiday.types?.map((type) =>
                                          type === "public"
                                            ? "P"
                                            : type === "bank"
                                            ? "B"
                                            : type === "regional"
                                            ? "R"
                                            : type.charAt(0).toUpperCase()
                                        ),
                                        "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
                                        "outline"
                                      )}
                                    </div>
                                  ) : isWeekendDay ? (
                                    <div className="text-xs">
                                      <Badge
                                        variant="outline"
                                        className="text-xs px-0.5 py-0 h-3 bg-blue-50 text-blue-700 border-blue-200"
                                      >
                                        W
                                      </Badge>
                                    </div>
                                  ) : null}
                                </div>
                              </CardContent>
                            </Card>
                          </TableHead>
                        );
                      })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableOrientation === "consultants-as-columns"
                  ? dates.map((date, dateIndex) => {
                      const holiday = getHolidayForDate(date);
                      const isWeekendDay = isWeekend(date);
                      const isSpecialDay = holiday || isWeekendDay;

                      // Row highlighting logic
                      let rowClass = "";
                      if (holiday) {
                        rowClass =
                          "bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/40 border-l-4 border-l-red-400 dark:border-l-red-500";
                      } else if (isWeekendDay) {
                        rowClass =
                          "bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/40 border-l-4 border-l-blue-400 dark:border-l-blue-500";
                      } else if (dateIndex % 2 === 0) {
                        rowClass = "bg-muted/20 hover:bg-muted/30";
                      } else {
                        rowClass = "bg-background hover:bg-muted/20";
                      }

                      return (
                        <TableRow key={date.toISOString()} className={rowClass}>
                          <TableCell className="sticky left-0 bg-inherit z-10 font-medium p-1 w-fit min-w-[25px] max-w-[55px] shadow-sm">
                            <Card
                              className={`${
                                holiday
                                  ? "bg-red-200 dark:bg-red-900/80 border-red-400 dark:border-red-600"
                                  : isWeekendDay
                                  ? "bg-blue-200 dark:bg-blue-900/80 border-blue-400 dark:border-blue-600"
                                  : "bg-card border-border"
                              } shadow-sm`}
                            >
                              <CardContent className="p-1">
                                <div className="space-y-1 text-center">
                                  <div className="text-xs font-medium text-gray-600">
                                    {format(date, "EEE")}
                                  </div>
                                  <div className="text-sm font-bold text-gray-900">
                                    {format(date, "MMM d")}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {format(date, "yyyy")}
                                  </div>
                                  {holiday ? (
                                    <div className="text-xs mt-1.5 space-y-1">
                                      <div className="flex flex-wrap gap-1 justify-center">
                                        <Calendar className="w-3 h-3 text-red-600" />
                                        {renderArrayBadges(
                                          holiday.types?.map((type) =>
                                            type === "public"
                                              ? "Pub"
                                              : type === "bank"
                                              ? "Bank"
                                              : type === "regional"
                                              ? "Reg"
                                              : type.charAt(0).toUpperCase() +
                                                type.slice(1)
                                          ),
                                          "text-xs bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
                                          "outline"
                                        )}
                                      </div>
                                      <div className="text-red-800 font-medium text-xs">
                                        {holiday.local_name}
                                      </div>
                                      {holiday.region && (
                                        <div className="flex flex-wrap gap-1 justify-center">
                                          {renderArrayBadges(
                                            Array.isArray(holiday.region)
                                              ? holiday.region.map((r) =>
                                                  r.length > 3
                                                    ? r
                                                        .substring(0, 3)
                                                        .toUpperCase()
                                                    : r.toUpperCase()
                                                )
                                              : [
                                                  holiday.region.length > 3
                                                    ? holiday.region
                                                        .substring(0, 3)
                                                        .toUpperCase()
                                                    : holiday.region.toUpperCase(),
                                                ],
                                            "text-xs bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
                                            "outline"
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                    >
                                      Weekend
                                    </Badge>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </TableCell>
                          {consultants.map((consultant) => {
                            const cellAssignments = getAssignmentsForCell(
                              consultant.id,
                              date
                            );
                            const isOnLeave = isConsultantOnLeave(
                              consultant,
                              date
                            );
                            const isDropTarget =
                              dragState.dragOverCell?.consultantId ===
                                consultant.id &&
                              dragState.dragOverCell?.date ===
                                format(date, "yyyy-MM-dd");

                            return (
                              <TableCell
                                key={consultant.id}
                                className={`p-2 border-l min-w-[80px] transition-all ${
                                  isDropTarget
                                    ? "bg-blue-200 border-2 border-blue-600"
                                    : ""
                                } ${isOnLeave ? "bg-green-100" : ""}`}
                                onDragOver={(e) =>
                                  handleDragOver(
                                    e,
                                    consultant.id,
                                    format(date, "yyyy-MM-dd")
                                  )
                                }
                                onDrop={(e) =>
                                  handleDrop(
                                    e,
                                    consultant.id,
                                    format(date, "yyyy-MM-dd")
                                  )
                                }
                              >
                                <div className="space-y-1">
                                  {isOnLeave && (
                                    <div className="text-xs text-green-600 text-center">
                                      <UserX className="w-3 h-3 mx-auto" />
                                      On Leave
                                    </div>
                                  )}

                                  {cellAssignments.map((assignment) => {
                                    const isBeingDragged =
                                      dragState.isDragging &&
                                      dragState.draggedPayroll?.id ===
                                        assignment.id;

                                    return (
                                      <div
                                        key={assignment.id}
                                        className={`
                                          bg-card border rounded-lg shadow-sm px-2 py-1.5 mb-1 text-xs
                                          transition-all duration-200 hover:shadow-md
                                          ${
                                            assignment.isGhost
                                              ? "opacity-50 border-dashed pointer-events-none"
                                              : ""
                                          }
                                          ${
                                            assignment.isBackup
                                              ? "border-red-200 dark:border-red-800"
                                              : "border-border"
                                          }
                                          ${
                                            isBeingDragged
                                              ? "opacity-30 scale-95"
                                              : ""
                                          }
                                          ${
                                            isPreviewMode && !assignment.isGhost
                                              ? "cursor-move"
                                              : ""
                                          }
                                        `}
                                        style={{
                                          backgroundColor:
                                            getProcessingTimeColor(
                                              assignment.processingTime,
                                              false,
                                              assignment.isBackup,
                                              assignment.isGhost,
                                              isAssignmentMoved(assignment)
                                            ),
                                        }}
                                        draggable={
                                          isPreviewMode && !assignment.isGhost
                                        }
                                        onDragStart={(e) =>
                                          handleDragStart(e, assignment)
                                        }
                                        onDragEnd={handleDragEnd}
                                      >
                                        <div
                                          className={`font-medium text-sm mb-1 ${getTextColorForProcessingTime(
                                            assignment.processingTime,
                                            assignment.isGhost
                                          )}`}
                                        >
                                          {assignment.payrollName}
                                        </div>
                                        <div
                                          className={`mb-1 ${getTextColorForProcessingTime(
                                            assignment.processingTime,
                                            assignment.isGhost
                                          )}`}
                                        >
                                          {assignment.employeeCount} emp
                                        </div>
                                        <div
                                          className={getTextColorForProcessingTime(
                                            assignment.processingTime,
                                            assignment.isGhost
                                          )}
                                        >
                                          {assignment.clientName}
                                        </div>
                                        {assignment.isBackup && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs mt-1"
                                          >
                                            Backup
                                          </Badge>
                                        )}
                                        {assignment.isGhost && (
                                          <div className="text-muted-foreground text-xs mt-1 italic">
                                            Moved to{" "}
                                            {assignment.ghostFromConsultant}
                                          </div>
                                        )}
                                        {!assignment.isGhost &&
                                          getOriginalConsultantName(
                                            assignment
                                          ) && (
                                            <div className="text-gray-100 dark:text-gray-600 text-xs mt-1 italic">
                                              Moved from{" "}
                                              {getOriginalConsultantName(
                                                assignment
                                              )}
                                            </div>
                                          )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })
                  : consultants.map((consultant, consultantIndex) => {
                      const summary = consultantSummaries.find(
                        (s) => s.id === consultant.id
                      );

                      // Alternating row colors for consultants
                      const rowClass =
                        consultantIndex % 2 === 0
                          ? "bg-gray-50/30 hover:bg-gray-50"
                          : "bg-white hover:bg-gray-50";

                      return (
                        <TableRow key={consultant.id} className={rowClass}>
                          <TableCell className="sticky left-0 bg-inherit z-10 font-medium p-2 w-fit min-w-[120px] max-w-[140px] shadow-sm">
                            <Card
                              className="shadow-sm border"
                              style={getConsultantCardBackgroundStyle(
                                summary?.totalProcessingTime || 0,
                                summary?.isOnLeave
                              )}
                            >
                              <CardContent className="p-2">
                                <div className="space-y-1.5">
                                  <div
                                    className={`font-semibold flex items-center justify-center gap-1.5 text-sm ${getConsultantHeaderTextColor(
                                      summary?.totalProcessingTime || 0,
                                      summary?.isOnLeave
                                    )}`}
                                  >
                                    {consultant.name}
                                    {summary?.isOnLeave && (
                                      <UserX className="w-3 h-3 text-green-900 dark:text-green-400" />
                                    )}
                                  </div>
                                  <div className="text-xs grid grid-cols-3 gap-1.5">
                                    <div
                                      title="Payrolls"
                                      className="text-center"
                                    >
                                      <FileText
                                        className={`w-3 h-3 mx-auto mb-0.5 ${getConsultantHeaderTextColor(
                                          summary?.totalProcessingTime || 0,
                                          summary?.isOnLeave,
                                          true
                                        )}`}
                                      />
                                      <div
                                        className={`font-medium ${getConsultantHeaderTextColor(
                                          summary?.totalProcessingTime || 0,
                                          summary?.isOnLeave
                                        )}`}
                                      >
                                        {summary?.totalPayrolls || 0}
                                      </div>
                                    </div>
                                    <div
                                      title="Employees"
                                      className="text-center"
                                    >
                                      <Users
                                        className={`w-3 h-3 mx-auto mb-0.5 ${getConsultantHeaderTextColor(
                                          summary?.totalProcessingTime || 0,
                                          summary?.isOnLeave,
                                          true
                                        )}`}
                                      />
                                      <div
                                        className={`font-medium ${getConsultantHeaderTextColor(
                                          summary?.totalProcessingTime || 0,
                                          summary?.isOnLeave
                                        )}`}
                                      >
                                        {summary?.totalEmployees || 0}
                                      </div>
                                    </div>
                                    <div title="Hours" className="text-center">
                                      <Clock
                                        className={`w-3 h-3 mx-auto mb-0.5 ${getConsultantHeaderTextColor(
                                          summary?.totalProcessingTime || 0,
                                          summary?.isOnLeave,
                                          true
                                        )}`}
                                      />
                                      <div
                                        className={`font-medium ${getConsultantHeaderTextColor(
                                          summary?.totalProcessingTime || 0,
                                          summary?.isOnLeave
                                        )}`}
                                      >
                                        {summary?.totalProcessingTime || 0}h
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </TableCell>
                          {dates.map((date) => {
                            const cellAssignments = getAssignmentsForCell(
                              consultant.id,
                              date
                            );
                            const isOnLeave = isConsultantOnLeave(
                              consultant,
                              date
                            );
                            const holiday = getHolidayForDate(date);
                            const isWeekendDay = isWeekend(date);
                            const isDropTarget =
                              dragState.dragOverCell?.consultantId ===
                                consultant.id &&
                              dragState.dragOverCell?.date ===
                                format(date, "yyyy-MM-dd");

                            // Cell highlighting for special dates
                            let cellClass =
                              "p-2 border-l min-w-[80px] transition-all";
                            if (isDropTarget) {
                              cellClass +=
                                " bg-blue-200 border-2 border-blue-600";
                            } else if (holiday) {
                              cellClass += " bg-red-50/30";
                            } else if (isWeekendDay) {
                              cellClass += " bg-blue-50/30";
                            }
                            if (isOnLeave) {
                              cellClass += " bg-green-100";
                            }

                            return (
                              <TableCell
                                key={date.toISOString()}
                                className={cellClass}
                                onDragOver={(e) =>
                                  handleDragOver(
                                    e,
                                    consultant.id,
                                    format(date, "yyyy-MM-dd")
                                  )
                                }
                                onDrop={(e) =>
                                  handleDrop(
                                    e,
                                    consultant.id,
                                    format(date, "yyyy-MM-dd")
                                  )
                                }
                              >
                                <div className="space-y-1">
                                  {/* Special date indicators */}
                                  {(holiday || isWeekendDay) && (
                                    <div className="text-xs text-center mb-1">
                                      {holiday ? (
                                        <div className="space-y-0.5">
                                          <div className="flex items-center justify-center gap-0.5">
                                            <Calendar className="w-3 h-3 text-red-600" />
                                          </div>
                                          {renderArrayBadges(
                                            holiday.types?.map((type) =>
                                              type === "public"
                                                ? "Public"
                                                : type === "bank"
                                                ? "Bank"
                                                : type === "regional"
                                                ? "Regional"
                                                : type.charAt(0).toUpperCase() +
                                                  type.slice(1)
                                            ),
                                            "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
                                            "outline"
                                          )}
                                          <div className="text-red-800 font-medium text-xs leading-tight">
                                            {holiday.local_name}
                                          </div>
                                          {holiday.region &&
                                            renderArrayBadges(
                                              holiday.region,
                                              "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
                                              "outline"
                                            )}
                                        </div>
                                      ) : (
                                        <Badge
                                          variant="outline"
                                          className="text-xs px-1 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200"
                                        >
                                          Weekend
                                        </Badge>
                                      )}
                                    </div>
                                  )}

                                  {isOnLeave && (
                                    <div className="text-xs text-green-600 text-center">
                                      <UserX className="w-3 h-3 mx-auto" />
                                      On Leave
                                    </div>
                                  )}

                                  {cellAssignments.map((assignment) => {
                                    const isBeingDragged =
                                      dragState.isDragging &&
                                      dragState.draggedPayroll?.id ===
                                        assignment.id;

                                    return (
                                      <div
                                        key={assignment.id}
                                        className={`
                                          bg-card border rounded-lg shadow-sm px-2 py-1.5 mb-1 text-xs
                                          transition-all duration-200 hover:shadow-md
                                          ${
                                            assignment.isGhost
                                              ? "opacity-50 border-dashed pointer-events-none"
                                              : ""
                                          }
                                          ${
                                            assignment.isBackup
                                              ? "border-red-200 dark:border-red-800"
                                              : "border-border"
                                          }
                                          ${
                                            isBeingDragged
                                              ? "opacity-30 scale-95"
                                              : ""
                                          }
                                          ${
                                            isPreviewMode && !assignment.isGhost
                                              ? "cursor-move"
                                              : ""
                                          }
                                        `}
                                        style={{
                                          backgroundColor:
                                            getProcessingTimeColor(
                                              assignment.processingTime,
                                              false,
                                              assignment.isBackup,
                                              assignment.isGhost,
                                              isAssignmentMoved(assignment)
                                            ),
                                        }}
                                        draggable={
                                          isPreviewMode && !assignment.isGhost
                                        }
                                        onDragStart={(e) =>
                                          handleDragStart(e, assignment)
                                        }
                                        onDragEnd={handleDragEnd}
                                      >
                                        <div
                                          className={`font-medium text-sm mb-1 ${getTextColorForProcessingTime(
                                            assignment.processingTime,
                                            assignment.isGhost
                                          )}`}
                                        >
                                          {assignment.payrollName}
                                        </div>
                                        <div
                                          className={`mb-1 ${getTextColorForProcessingTime(
                                            assignment.processingTime,
                                            assignment.isGhost
                                          )}`}
                                        >
                                          {assignment.employeeCount} emp
                                        </div>
                                        <div
                                          className={getTextColorForProcessingTime(
                                            assignment.processingTime,
                                            assignment.isGhost
                                          )}
                                        >
                                          {assignment.clientName}
                                        </div>
                                        {assignment.isBackup && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs mt-1"
                                          >
                                            Backup
                                          </Badge>
                                        )}
                                        {assignment.isGhost && (
                                          <div className="text-muted-foreground text-xs mt-1 italic">
                                            Moved to{" "}
                                            {assignment.ghostFromConsultant}
                                          </div>
                                        )}
                                        {!assignment.isGhost &&
                                          getOriginalConsultantName(
                                            assignment
                                          ) && (
                                            <div className="text-gray-600 dark:text-gray-400 text-xs mt-1 italic">
                                              Moved from{" "}
                                              {getOriginalConsultantName(
                                                assignment
                                              )}
                                            </div>
                                          )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pending Changes Summary */}
      {isPreviewMode && pendingChanges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingChanges.map((change, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
                >
                  <div className="text-sm">
                    <span className="font-medium">{change.payrollName}</span>:
                    <span className="text-gray-600">
                      {" "}
                      {change.fromConsultantName}
                    </span>{" "}
                    →
                    <span className="text-gray-900">
                      {" "}
                      {change.toConsultantName}
                    </span>
                    <span className="text-gray-500">
                      {" "}
                      ({change.affectedDates.length} date
                      {change.affectedDates.length !== 1 ? "s" : ""})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
