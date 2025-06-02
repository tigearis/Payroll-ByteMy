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
    payroll_dates(where: {
      adjusted_eft_date: { _gte: $start_date, _lte: $end_date }
    }) {
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
    holidays(where: {
      date: { _gte: $start_date, _lte: $end_date }
    }) {
      id
      date
      local_name
      types
      region
      country_code
    }
  }
`;

const COMMIT_PAYROLL_ASSIGNMENTS = gql`
  mutation CommitPayrollAssignments($changes: [PayrollAssignmentInput!]!) {
    commitPayrollAssignments(changes: $changes) {
      success
      message
      errors
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
  types: string[];
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
  assignmentId: string;
  payrollId: string;
  fromConsultantId: string;
  toConsultantId: string;
  date: string;
  payrollName: string;
  fromConsultantName: string;
  toConsultantName: string;
}

export default function AdvancedPayrollScheduler() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>("month");
  const [tableOrientation, setTableOrientation] = useState<TableOrientation>(
    "consultants-as-columns"
  );

  // Simplified state management
  const [assignments, setAssignments] = useState<PayrollAssignment[]>([]);
  const [originalAssignments, setOriginalAssignments] = useState<PayrollAssignment[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [moveAsGroup, setMoveAsGroup] = useState(true);

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
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(GET_PAYROLL_DATA, {
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

  const [commitPayrollAssignments, { loading: committing, error: commitError }] = 
    useMutation(COMMIT_PAYROLL_ASSIGNMENTS);

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
      if (primaryConsultant && isConsultantOnLeave(primaryConsultant, assignmentDate)) {
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
        consultantMap.set(payroll.userByPrimaryConsultantUserId.id, payroll.userByPrimaryConsultantUserId);
      }
      if (payroll.userByBackupConsultantUserId) {
        consultantMap.set(payroll.userByBackupConsultantUserId.id, payroll.userByBackupConsultantUserId);
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
        totalEmployees: consultantAssignments.reduce((sum, a) => sum + a.employeeCount, 0),
        totalProcessingTime: consultantAssignments.reduce((sum, a) => sum + a.processingTime, 0),
        isOnLeave: hasLeaveInPeriod,
      };
    });

    return summaries;
  }, [consultants, assignments, dates]);

  const holidays = data?.holidays || [];

  // Helper functions
  const getHolidayForDate = (date: Date): Holiday | null => {
    return holidays.find((holiday: Holiday) => 
      isSameDay(new Date(holiday.date), date)
    ) || null;
  };

  const getProcessingTimeColor = (processingTime: number, isPreview = false, isBackup = false, isGhost = false) => {
    if (isGhost) return "rgba(156, 163, 175, 0.3)"; // Gray for ghosts
    
    const maxTime = Math.max(...assignments.map((a) => a.processingTime));
    const intensity = Math.min(processingTime / maxTime, 1);
    const alpha = 0.2 + intensity * 0.6;

    if (isPreview) return `rgba(251, 146, 60, ${alpha})`; // Orange for preview
    if (isBackup) return `rgba(239, 68, 68, ${alpha})`; // Red for backup
    return `rgba(59, 130, 246, ${alpha})`; // Blue default
  };

  // Navigation functions
  const navigatePrevious = () => {
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
  const handleDragStart = (e: React.DragEvent, assignment: PayrollAssignment) => {
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

  const handleDragOver = (e: React.DragEvent, consultantId: string, date: string) => {
    if (!isPreviewMode) return;
    e.preventDefault();
    setDragState((prev) => ({
      ...prev,
      dragOverCell: { consultantId, date },
    }));
  };

  const handleDrop = (e: React.DragEvent, targetConsultantId: string, targetDate: string) => {
    e.preventDefault();
    if (!isPreviewMode) return;

    const { draggedPayroll } = dragState;
    if (!draggedPayroll) return;

    // Add ghost assignments first
    const newGhosts: PayrollAssignment[] = [];

    if (moveAsGroup) {
      // Move all assignments for this payroll
      setAssignments((prev) => {
        const newAssignments = prev.map((a) => {
          if (a.payrollId === draggedPayroll.payrollId && !a.isGhost) {
            // Create ghost for original position
            newGhosts.push({
              ...a,
              id: `ghost-${a.id}`,
              isGhost: true,
              ghostFromConsultant: a.consultantName,
              ghostFromDate: a.adjustedEftDate,
            });

            // Move to new position
            return {
              ...a,
              consultantId: targetConsultantId,
              consultantName: consultants.find((c) => c.id === targetConsultantId)?.name || "Unknown",
            };
          }
          return a;
        });

        return [...newAssignments, ...newGhosts];
      });
    } else {
      // Move only the specific assignment
      setAssignments((prev) => {
        const newAssignments = prev.map((a) => {
          if (a.id === draggedPayroll.id && !a.isGhost) {
            // Create ghost for original position
            newGhosts.push({
              ...a,
              id: `ghost-${a.id}`,
              isGhost: true,
              ghostFromConsultant: a.consultantName,
              ghostFromDate: a.adjustedEftDate,
            });

            // Move to new position
            return {
              ...a,
              consultantId: targetConsultantId,
              consultantName: consultants.find((c) => c.id === targetConsultantId)?.name || "Unknown",
              adjustedEftDate: targetDate,
            };
          }
          return a;
        });

        return [...newAssignments, ...newGhosts];
      });
    }

    setDragState({
      isDragging: false,
      draggedPayroll: null,
      dragOverCell: null,
    });
  };

  // Get assignments for a specific cell
  const getAssignmentsForCell = (consultantId: string, date: Date) => {
    return assignments.filter((assignment) => {
      const isSameConsultant = assignment.consultantId === consultantId;
      const isSameDate = isSameDay(new Date(assignment.adjustedEftDate), date);
      return isSameConsultant && isSameDate;
    });
  };

  // Calculate pending changes
  const pendingChanges = useMemo(() => {
    const changes: PendingChange[] = [];
    
    assignments.forEach((current) => {
      if (current.isGhost) return;
      
      const original = originalAssignments.find((orig) => orig.id === current.id);
      if (original && 
          (current.consultantId !== original.consultantId || 
           current.adjustedEftDate !== original.adjustedEftDate)) {
        changes.push({
          assignmentId: current.id,
          payrollId: current.payrollId,
          fromConsultantId: original.consultantId,
          toConsultantId: current.consultantId,
          date: current.adjustedEftDate,
          payrollName: current.payrollName,
          fromConsultantName: original.consultantName,
          toConsultantName: current.consultantName,
        });
      }
    });

    return changes;
  }, [assignments, originalAssignments]);

  // Commit changes
  const commitChanges = async () => {
    if (pendingChanges.length === 0) return;

    try {
      const changes = pendingChanges.map((change) => ({
        payrollId: change.payrollId,
        fromConsultantId: change.fromConsultantId,
        toConsultantId: change.toConsultantId,
        date: change.date,
      }));

      const result = await commitPayrollAssignments({
        variables: { changes },
      });

      if (result.data?.commitPayrollAssignments.success) {
        // Success: exit preview mode and refresh data
        setIsPreviewMode(false);
        setOriginalAssignments([...assignments.filter(a => !a.isGhost)]);
        setAssignments(prev => prev.filter(a => !a.isGhost));
        refetch();
      }
    } catch (error) {
      console.error("Commit failed:", error);
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
    setAssignments(prev => prev.filter(a => !a.isGhost));
  };

  // Format period display
  const formatPeriodDisplay = () => {
    switch (viewPeriod) {
      case "week":
        return `Week of ${format(dateRange.start, "MMM d, yyyy")}`;
      case "fortnight":
        return `${format(dateRange.start, "MMM d")} - ${format(dateRange.end, "MMM d, yyyy")}`;
      case "month":
        return format(currentDate, "MMMM yyyy");
    }
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
            <h2 className="text-3xl font-bold text-gray-900">Advanced Payroll Scheduler</h2>
            <p className="text-gray-600">Drag-and-drop scheduling with consultant summaries</p>
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
              There are no payroll assignments for {formatPeriodDisplay().toLowerCase()}.
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
          <h2 className="text-3xl font-bold text-gray-900">Advanced Payroll Scheduler</h2>
          <p className="text-gray-600">Drag-and-drop scheduling with consultant summaries</p>
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
                  setTableOrientation(checked ? "consultants-as-rows" : "consultants-as-columns")
                }
                disabled={loading || committing}
              />
              <Label>Consultants as Rows</Label>
            </div>

            {/* Group Movement Switch */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={moveAsGroup}
                onCheckedChange={setMoveAsGroup}
                disabled={loading || committing || !isPreviewMode}
              />
              <Label>Move Entire Payroll Group</Label>
            </div>

            {/* Preview Mode Actions */}
            {!isPreviewMode ? (
              <div className="ml-auto">
                <Button onClick={enterPreviewMode} disabled={loading || committing}>
                  Edit Schedule
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-auto">
                <Badge variant="outline">
                  {pendingChanges.length} pending change{pendingChanges.length !== 1 ? "s" : ""}
                </Badge>
                {committing && <Badge variant="outline">Saving...</Badge>}
                <Button variant="outline" size="sm" onClick={revertChanges} disabled={committing}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" onClick={commitChanges} disabled={committing || pendingChanges.length === 0}>
                  <Save className="w-4 h-4 mr-2" />
                  {committing ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={navigatePrevious} disabled={loading || committing}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <h3 className="text-xl font-semibold">{formatPeriodDisplay()}</h3>

        <Button variant="outline" onClick={navigateNext} disabled={loading || committing}>
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Preview Mode Banner */}
      {isPreviewMode && (
        <div className="p-3 bg-orange-100 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-orange-50">Preview Mode</Badge>
            <span className="text-sm text-orange-800">
              Drag payrolls to reassign them. Changes won't be saved until you click "Save Changes".
            </span>
          </div>
        </div>
      )}

      {/* Main Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto max-h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background z-10 min-w-[150px]">
                    {tableOrientation === "consultants-as-columns" ? "Date" : "Consultant"}
                  </TableHead>
                  {tableOrientation === "consultants-as-columns"
                    ? consultants.map((consultant) => {
                        const summary = consultantSummaries.find(s => s.id === consultant.id);
                        return (
                          <TableHead key={consultant.id} className="text-center min-w-[140px] p-1">
                            <Card className={`${summary?.isOnLeave ? "bg-orange-50 border-orange-200" : "bg-blue-50 border-blue-200"} shadow-sm`}>
                              <CardContent className="p-2">
                                <div className="space-y-1.5">
                                  <div className="font-semibold flex items-center justify-center gap-1.5 text-sm">
                                    {consultant.name}
                                    {summary?.isOnLeave && <UserX className="w-3 h-3 text-orange-700" />}
                                  </div>
                                  <div className="text-xs grid grid-cols-3 gap-1.5">
                                    <div title="Payrolls" className="text-center">
                                      <FileText className="w-3 h-3 mx-auto mb-0.5" />
                                      <div className="font-medium">{summary?.totalPayrolls || 0}</div>
                                    </div>
                                    <div title="Employees" className="text-center">
                                      <Users className="w-3 h-3 mx-auto mb-0.5" />
                                      <div className="font-medium">{summary?.totalEmployees || 0}</div>
                                    </div>
                                    <div title="Hours" className="text-center">
                                      <Clock className="w-3 h-3 mx-auto mb-0.5" />
                                      <div className="font-medium">{summary?.totalProcessingTime || 0}h</div>
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
                        return (
                          <TableHead key={date.toISOString()} className="text-center min-w-[80px] p-1">
                            <Card className={`${holiday ? "bg-red-50 border-red-200" : "bg-white border-gray-200"} shadow-sm`}>
                              <CardContent className="p-2">
                                <div className="space-y-1 text-center">
                                  <div className="text-xs font-medium">{format(date, "EEE")}</div>
                                  <div className="text-sm font-bold">{format(date, "MMM d")}</div>
                                  {holiday && (
                                    <div className="text-xs">
                                      <Calendar className="w-3 h-3 inline mr-1" />
                                      <Badge variant="outline" className="text-xs px-1 py-0">
                                        {holiday.types.includes("public") ? "Holiday" : "Regional"}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </TableHead>
                        );
                      })
                  }
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableOrientation === "consultants-as-columns"
                  ? dates.map((date) => {
                      const holiday = getHolidayForDate(date);
                      return (
                        <TableRow key={date.toISOString()}>
                          <TableCell className="sticky left-0 bg-background z-10 font-medium p-1">
                            <Card className={`${holiday ? "bg-red-50 border-red-200" : "bg-white border-gray-200"} shadow-sm`}>
                              <CardContent className="p-2">
                                <div className="space-y-1 text-center">
                                  <div className="text-xs font-medium">{format(date, "EEE")}</div>
                                  <div className="text-sm font-bold">{format(date, "MMM d")}</div>
                                  {holiday && (
                                    <div className="text-xs">
                                      <Calendar className="w-3 h-3 inline mr-1" />
                                      <Badge variant="outline" className="text-xs px-1 py-0">
                                        {holiday.types.includes("public") ? "Holiday" : "Regional"}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </TableCell>
                          {consultants.map((consultant) => {
                            const cellAssignments = getAssignmentsForCell(consultant.id, date);
                            const isOnLeave = isConsultantOnLeave(consultant, date);
                            const isDropTarget = dragState.dragOverCell?.consultantId === consultant.id &&
                              dragState.dragOverCell?.date === format(date, "yyyy-MM-dd");

                            return (
                              <TableCell
                                key={consultant.id}
                                className={`p-2 border-l min-w-[80px] transition-all ${
                                  isDropTarget ? "bg-blue-100 border-2 border-blue-600" : ""
                                } ${isOnLeave ? "bg-orange-50" : ""}`}
                                onDragOver={(e) => handleDragOver(e, consultant.id, format(date, "yyyy-MM-dd"))}
                                onDrop={(e) => handleDrop(e, consultant.id, format(date, "yyyy-MM-dd"))}
                              >
                                <div className="space-y-1">
                                  {isOnLeave && (
                                    <div className="text-xs text-orange-600 text-center">
                                      <UserX className="w-3 h-3 mx-auto" />
                                      On Leave
                                    </div>
                                  )}

                                  {cellAssignments.map((assignment) => {
                                    const isBeingDragged = dragState.isDragging && 
                                      dragState.draggedPayroll?.id === assignment.id;

                                    return (
                                      <div
                                        key={assignment.id}
                                        className={`
                                          bg-white border rounded-lg shadow-sm px-2 py-1.5 mb-1 text-xs
                                          transition-all duration-200 hover:shadow-md
                                          ${assignment.isGhost ? "opacity-50 border-dashed pointer-events-none" : ""}
                                          ${assignment.isBackup ? "border-red-200" : "border-gray-200"}
                                          ${isBeingDragged ? "opacity-30 scale-95" : ""}
                                          ${isPreviewMode && !assignment.isGhost ? "cursor-move" : ""}
                                        `}
                                        style={{
                                          backgroundColor: getProcessingTimeColor(
                                            assignment.processingTime,
                                            false,
                                            assignment.isBackup,
                                            assignment.isGhost
                                          ),
                                        }}
                                        draggable={isPreviewMode && !assignment.isGhost}
                                        onDragStart={(e) => handleDragStart(e, assignment)}
                                        onDragEnd={handleDragEnd}
                                      >
                                        <div className="font-medium text-sm mb-1">{assignment.payrollName}</div>
                                        <div className="text-gray-600 mb-1">{assignment.employeeCount} emp</div>
                                        <div className="text-gray-500">{assignment.clientName}</div>
                                        {assignment.isBackup && (
                                          <Badge variant="outline" className="text-xs mt-1">Backup</Badge>
                                        )}
                                        {assignment.isGhost && (
                                          <div className="text-gray-500 text-xs mt-1 italic">
                                            Moved to {assignment.ghostFromConsultant}
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
                  : consultants.map((consultant) => {
                      const summary = consultantSummaries.find(s => s.id === consultant.id);
                      return (
                        <TableRow key={consultant.id}>
                          <TableCell className="sticky left-0 bg-background z-10 font-medium p-1">
                            <Card className={`${summary?.isOnLeave ? "bg-orange-50 border-orange-200" : "bg-blue-50 border-blue-200"} shadow-sm`}>
                              <CardContent className="p-2">
                                <div className="space-y-1.5">
                                  <div className="font-semibold flex items-center justify-center gap-1.5 text-sm">
                                    {consultant.name}
                                    {summary?.isOnLeave && <UserX className="w-3 h-3 text-orange-700" />}
                                  </div>
                                  <div className="text-xs grid grid-cols-3 gap-1.5">
                                    <div title="Payrolls" className="text-center">
                                      <FileText className="w-3 h-3 mx-auto mb-0.5" />
                                      <div className="font-medium">{summary?.totalPayrolls || 0}</div>
                                    </div>
                                    <div title="Employees" className="text-center">
                                      <Users className="w-3 h-3 mx-auto mb-0.5" />
                                      <div className="font-medium">{summary?.totalEmployees || 0}</div>
                                    </div>
                                    <div title="Hours" className="text-center">
                                      <Clock className="w-3 h-3 mx-auto mb-0.5" />
                                      <div className="font-medium">{summary?.totalProcessingTime || 0}h</div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </TableCell>
                          {dates.map((date) => {
                            const cellAssignments = getAssignmentsForCell(consultant.id, date);
                            const isOnLeave = isConsultantOnLeave(consultant, date);
                            const holiday = getHolidayForDate(date);
                            const isDropTarget = dragState.dragOverCell?.consultantId === consultant.id &&
                              dragState.dragOverCell?.date === format(date, "yyyy-MM-dd");

                            return (
                              <TableCell
                                key={date.toISOString()}
                                className={`p-2 border-l min-w-[80px] transition-all ${
                                  isDropTarget ? "bg-blue-100 border-2 border-blue-600" : ""
                                } ${isOnLeave ? "bg-orange-50" : ""} ${holiday ? "bg-red-50" : ""}`}
                                onDragOver={(e) => handleDragOver(e, consultant.id, format(date, "yyyy-MM-dd"))}
                                onDrop={(e) => handleDrop(e, consultant.id, format(date, "yyyy-MM-dd"))}
                              >
                                <div className="space-y-1">
                                  {(holiday || isWeekend(date)) && (
                                    <div className="text-xs text-center">
                                      <Badge variant="outline" className="text-xs">
                                        {holiday ? "Holiday" : "Weekend"}
                                      </Badge>
                                    </div>
                                  )}

                                  {isOnLeave && (
                                    <div className="text-xs text-orange-600 text-center">
                                      <UserX className="w-3 h-3 mx-auto" />
                                      On Leave
                                    </div>
                                  )}

                                  {cellAssignments.map((assignment) => {
                                    const isBeingDragged = dragState.isDragging && 
                                      dragState.draggedPayroll?.id === assignment.id;

                                    return (
                                      <div
                                        key={assignment.id}
                                        className={`
                                          bg-white border rounded-lg shadow-sm px-2 py-1.5 mb-1 text-xs
                                          transition-all duration-200 hover:shadow-md
                                          ${assignment.isGhost ? "opacity-50 border-dashed pointer-events-none" : ""}
                                          ${assignment.isBackup ? "border-red-200" : "border-gray-200"}
                                          ${isBeingDragged ? "opacity-30 scale-95" : ""}
                                          ${isPreviewMode && !assignment.isGhost ? "cursor-move" : ""}
                                        `}
                                        style={{
                                          backgroundColor: getProcessingTimeColor(
                                            assignment.processingTime,
                                            false,
                                            assignment.isBackup,
                                            assignment.isGhost
                                          ),
                                        }}
                                        draggable={isPreviewMode && !assignment.isGhost}
                                        onDragStart={(e) => handleDragStart(e, assignment)}
                                        onDragEnd={handleDragEnd}
                                      >
                                        <div className="font-medium text-sm mb-1">{assignment.payrollName}</div>
                                        <div className="text-gray-600 mb-1">{assignment.employeeCount} emp</div>
                                        <div className="text-gray-500">{assignment.clientName}</div>
                                        {assignment.isBackup && (
                                          <Badge variant="outline" className="text-xs mt-1">Backup</Badge>
                                        )}
                                        {assignment.isGhost && (
                                          <div className="text-gray-500 text-xs mt-1 italic">
                                            Moved to {assignment.ghostFromConsultant}
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
                }
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
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="text-sm">
                    <span className="font-medium">{change.payrollName}</span>: 
                    <span className="text-gray-600"> {change.fromConsultantName}</span> → 
                    <span className="text-gray-900"> {change.toConsultantName}</span>
                    <span className="text-gray-500"> ({format(new Date(change.date), "MMM d")})</span>
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