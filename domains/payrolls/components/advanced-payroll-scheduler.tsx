"use client";

import { useQuery, useMutation } from "@apollo/client";
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
  Maximize2,
  Minimize2,
} from "lucide-react";
import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Import lucide-react icons with explicit typing
import {
  GetLeaveDocument,
  GetLeaveQuery,
} from "@/domains/leave/graphql/generated/graphql";
import {
  GetPayrollsByMonthDocument,
  GetPayrollsByMonthQuery,
  UpdatePayrollDocument,
} from "@/domains/payrolls/graphql/generated/graphql";
import {
  GetHolidaysByDateRangeDocument,
  GetHolidaysByDateRangeQuery,
  GetAllStaffWorkloadDocument,
  GetAllStaffWorkloadQuery,
} from "@/domains/work-schedule/graphql/generated/graphql";

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
  name: string;
  localName: string;
  types: string[];
  region?: string[] | null;
  countryCode: any;
  isGlobal?: boolean | null;
  isFixed?: boolean | null;
}

interface HolidayDisplayInfo {
  name: string;
  designation: string;
  isPrimary: boolean;
  backgroundColor: string;
}

interface Leave {
  id?: string; // Optional since it may not be available in all contexts
  startDate: string;
  endDate: string;
  leaveType: string;
  reason?: string | null;
  status?: any;
  userId: string;
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
  const [isExpanded, setIsExpanded] = useState(false);

  // Add hydration-safe state
  const [isClient, setIsClient] = useState(false);

  // Add custom CSS variables for dark mode support
  React.useEffect(() => {
    setIsClient(true);
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
  const [moveAsGroup] = useState(true);
  const [showGhosts, setShowGhosts] = useState(true);
  
  // Track edits across all dates/periods
  const [globalEdits, setGlobalEdits] = useState<Map<string, { consultantId: string, consultantName: string }>>(new Map());

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
    let current = dateRange.start;

    while (current <= dateRange.end) {
      const dateToAdd = new Date(current);
      dateArray.push(dateToAdd);
      current = addDays(current, 1);
    }

    return dateArray;
  }, [dateRange]);

  // Get payrolls for the selected month range
  const { data, loading, error, refetch } = useQuery<GetPayrollsByMonthQuery>(
    GetPayrollsByMonthDocument,
    {
      variables: {
        startDate: format(dateRange.start, "yyyy-MM-dd"),
        endDate: format(dateRange.end, "yyyy-MM-dd"),
      },
      errorPolicy: "all",
      skip: !isClient, // Skip query until client-side hydration is complete
      onCompleted: data => {
        console.log("✅ Query completed successfully:", {
          dateRange: `${format(dateRange.start, "yyyy-MM-dd")} to ${format(dateRange.end, "yyyy-MM-dd")}`,
          payrollsCount: data.payrolls?.length || 0,
          payrollDatesCount: data.payrolls?.[0]?.payrollDates?.length || 0,
        });
      },
      onError: err => {
        console.error("❌ Query failed:", err);
      },
    }
  );

  // Get holidays for the selected date range
  const { data: holidaysData } = useQuery<GetHolidaysByDateRangeQuery>(
    GetHolidaysByDateRangeDocument,
    {
      variables: {
        startDate: format(dateRange.start, "yyyy-MM-dd"),
        endDate: format(dateRange.end, "yyyy-MM-dd"),
        countryCode: "AU",
      },
      errorPolicy: "all",
      skip: !isClient,
      onCompleted: data => {
        console.log("✅ Holidays query completed:", {
          holidaysCount: data.holidays?.length || 0,
          dateRange: `${format(dateRange.start, "yyyy-MM-dd")} to ${format(dateRange.end, "yyyy-MM-dd")}`,
        });
      },
      onError: err => {
        console.error("❌ Holidays query failed:", err);
      },
    }
  );

  // Get all staff workload to show all consultants (not just those with payrolls)
  const { data: staffData, loading: staffLoading } = useQuery<GetAllStaffWorkloadQuery>(
    GetAllStaffWorkloadDocument,
    {
      errorPolicy: "all",
      skip: !isClient,
      onCompleted: data => {
        console.log("✅ Staff workload query completed:", {
          staffCount: data.users?.length || 0,
          consultantCount: data.users?.filter(u => u.role === 'consultant').length || 0,
        });
      },
      onError: err => {
        console.error("❌ Staff workload query failed:", err);
      },
    }
  );

  const [updatePayrollConsultants, { loading: updating, error: updateError }] =
    useMutation(UpdatePayrollDocument);

  // Get leave data for the selected date range
  const { data: leaveData } = useQuery<GetLeaveQuery>(
    GetLeaveDocument,
    {
      variables: {
        where: {
          _and: [
            { startDate: { _lte: format(dateRange.end, "yyyy-MM-dd") } },
            { endDate: { _gte: format(dateRange.start, "yyyy-MM-dd") } },
            { status: { _eq: "Approved" } },
          ],
        },
      },
      errorPolicy: "all",
      skip: !isClient,
      onCompleted: data => {
        console.log("✅ Leave query completed:", {
          leaveCount: data.leave?.length || 0,
          dateRange: `${format(dateRange.start, "yyyy-MM-dd")} to ${format(dateRange.end, "yyyy-MM-dd")}`,
        });
      },
      onError: err => {
        console.error("❌ Leave query failed:", err);
      },
    }
  );

  // Helper function to check if consultant is on leave
  const isConsultantOnLeave = (consultantId: string, date: Date): boolean => {
    if (!leaveData?.leave) return false;

    return leaveData.leave.some((leave: any) => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      return (
        leave.userId === consultantId &&
        leave.status === "Approved" &&
        isWithinInterval(date, { start: leaveStart, end: leaveEnd })
      );
    });
  };

  // Transform data into assignments
  const transformData = (data: any): PayrollAssignment[] => {
    if (!data?.payrolls) return [];

    const assignmentList: PayrollAssignment[] = [];

    console.log("🔄 Transforming data:", {
      payrolls: data.payrolls.length,
      samplePayroll: data.payrolls[0],
      samplePayrollDates: data.payrolls[0]?.payrollDates?.length || 0,
    });

    // Iterate through each payroll and its dates
    data.payrolls.forEach((payroll: any) => {
      if (!payroll.payrollDates || payroll.payrollDates.length === 0) {
        console.log(`⚠️ No payroll dates for payroll: ${payroll.name}`);
        return;
      }

      console.log(
        `📅 Processing payroll "${payroll.name}" with ${payroll.payrollDates.length} dates`
      );

      payroll.payrollDates.forEach((dateInfo: any) => {
        const assignmentDate = new Date(dateInfo.adjustedEftDate);
        const primaryConsultant = payroll.primaryConsultant;
        const backupConsultant = payroll.backupConsultant;

        let finalConsultantId = primaryConsultant?.id || "unassigned";
        let finalConsultantName = primaryConsultant?.name || "Unassigned";
        let isBackup = false;
        let originalConsultantId: string | undefined;
        let originalConsultantName: string | undefined;

        // Check if primary consultant is on leave
        if (
          primaryConsultant &&
          isConsultantOnLeave(primaryConsultant.id, assignmentDate)
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

    console.log(
      `✅ Transformed ${assignmentList.length} assignments from ${data.payrolls.length} payrolls`
    );
    return assignmentList;
  };

  // Initialize assignments when data loads
  useEffect(() => {
    if (data) {
      console.log("🔍 Raw data received:", {
        payrolls: data.payrolls?.length || 0,
        payrollDates: data.payrolls?.[0]?.payrollDates?.length || 0,
        samplePayroll: data.payrolls?.[0],
        samplePayrollDate: data.payrolls?.[0]?.payrollDates?.[0],
      });

      let freshAssignments = transformData(data);
      const ghostAssignments: PayrollAssignment[] = [];
      
      // Apply global edits if in preview mode
      if (isPreviewMode && globalEdits.size > 0) {
        freshAssignments = freshAssignments.map(assignment => {
          const editKey = `${assignment.payrollId}-${assignment.adjustedEftDate}`;
          const edit = globalEdits.get(editKey);
          
          if (edit && edit.consultantId !== assignment.consultantId) {
            // Create a ghost for the original position
            ghostAssignments.push({
              ...assignment,
              id: `ghost-${assignment.id}-${Date.now()}`,
              isGhost: true,
              ghostFromConsultant: edit.consultantName,
              ghostFromDate: assignment.adjustedEftDate,
            });
            
            // Return the moved assignment
            return {
              ...assignment,
              consultantId: edit.consultantId,
              consultantName: edit.consultantName
            };
          }
          
          return assignment;
        });
      }
      
      // Combine real assignments with ghosts
      setAssignments([...freshAssignments, ...ghostAssignments]);
      
      // Only update original assignments if not in preview mode
      if (!isPreviewMode) {
        setOriginalAssignments([...freshAssignments]);
      }
      
      console.log("📋 Assignments set:", {
        assignmentsCount: freshAssignments.length,
        payrollsCount: data.payrolls?.length || 0,
        sampleAssignment: freshAssignments[0],
        editsApplied: globalEdits.size,
      });
    }
  }, [data?.payrolls?.length, isPreviewMode, globalEdits.size]); // Use stable properties instead of objects

  // Extract consultants from staff data - shows ALL consultants, not just those with payrolls
  const consultants = useMemo(() => {
    if (!staffData?.users) return [];

    // Filter to only consultants and managers (who can act as consultants)
    const consultantUsers = staffData.users.filter(user => 
      user.role === 'consultant' || user.role === 'manager' || user.role === 'org_admin'
    );

    const consultants = consultantUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      workSchedules: user.userWorkSchedules || [],
      skills: user.userSkills || [],
      primaryPayrolls: user.primaryConsultantPayrolls || [],
      backupPayrolls: user.backupConsultantPayrolls || [],
    }));

    console.log(
      `👥 Found ${consultants.length} total consultants (including those without payrolls):`,
      consultants.map(c => `${c.name} (${c.primaryPayrolls.length + c.backupPayrolls.length} payrolls)`)
    );
    return consultants;
  }, [staffData]);

  // Calculate consultant summaries
  const consultantSummaries = useMemo(() => {
    const summaries: ConsultantSummary[] = consultants.map(consultant => {
      // Filter assignments to only those within the current date range
      const consultantAssignments = assignments.filter(a => {
        if (a.consultantId !== consultant.id || a.isGhost) return false;
        
        // Check if assignment date is within the current viewing period
        const assignmentDate = new Date(a.adjustedEftDate);
        return assignmentDate >= dateRange.start && assignmentDate <= dateRange.end;
      });

      const hasLeaveInPeriod = dates.some(date =>
        isConsultantOnLeave(consultant.id, date)
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
  }, [consultants, assignments, dates, dateRange]);

  // Get holidays from query data
  const holidays: Holiday[] = holidaysData?.holidays || [];

  // Helper function to abbreviate holiday names for compact display
  const getHolidayAbbreviation = (name: string): string => {
    const abbreviations: { [key: string]: string } = {
      "Christmas Day": "Christmas",
      "Australia Day": "Aus Day",
      "Queen's Birthday": "Queen's",
      "Labour Day": "Labour",
      "Melbourne Cup": "Melb Cup",
      "Good Friday": "Good Fri",
      "Easter Monday": "Easter Mon",
      "Boxing Day": "Boxing",
      "New Year's Day": "New Year",
      "ANZAC Day": "ANZAC",
    };

    return (
      abbreviations[name] ||
      (name.length > 8 ? name.substring(0, 8) + "..." : name)
    );
  };

  // Helper function to get holiday display information
  const getHolidayDisplayInfo = (
    holiday: Holiday,
    isCompact: boolean = false
  ): HolidayDisplayInfo => {
    const isNSWOrNational =
      holiday.isGlobal ||
      holiday.region?.some(r => r.includes("NSW")) ||
      holiday.region?.some(r => r.includes("National"));

    // Determine designation based on holiday scope
    let designation = "Regional";
    if (holiday.isGlobal) {
      designation = "National";
    } else if (holiday.region && holiday.region.length > 0) {
      if (holiday.region.length === 1) {
        designation = holiday.region[0];
      } else if (holiday.region.length <= 3) {
        designation = holiday.region.join(", ");
      } else {
        designation = "Multiple States";
      }
    }

    const fullName = holiday.localName || holiday.name;

    return {
      name: isCompact ? getHolidayAbbreviation(fullName) : fullName,
      designation,
      isPrimary: Boolean(isNSWOrNational),
      backgroundColor: isNSWOrNational
        ? "rgb(239, 68, 68)"
        : "rgb(245, 158, 11)", // red for NSW/National, amber for others
    };
  };

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

    const maxTime = Math.max(...assignments.map(a => a.processingTime));
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
      orig => orig.id === assignment.id
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
      orig => orig.id === assignment.id
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
    // Don't clean up ghosts when navigating - let them be recreated from data
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
    // Don't clean up ghosts when navigating - let them be recreated from data
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
    if (!isPreviewMode || loading || updating) {
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
    setDragState(prev => ({
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
    
    // Find the target consultant name
    const targetConsultantName = consultants.find(c => c.id === targetConsultantId)?.name || "Unknown";

    setAssignments(prev => {
      if (moveAsGroup) {
        // Move all assignments for this payroll
        const updatedAssignments = prev
          .filter(a => !a.isGhost) // Remove ALL ghosts - they'll be recreated on data reload
          .map(a => {
            if (a.payrollId === draggedPayroll.payrollId) {
              // Find the original assignment to compare
              const originalAssignment = originalAssignments.find(
                orig => orig.id === a.id
              );

              // Move to new position
              const updated = {
                ...a,
                consultantId: targetConsultantId,
                consultantName: targetConsultantName,
              };
              
              // Save to global edits immediately
              const editKey = `${a.payrollId}-${a.adjustedEftDate}`;
              setGlobalEdits(prev => new Map(prev).set(editKey, {
                consultantId: targetConsultantId,
                consultantName: targetConsultantName
              }));
              
              return updated;
            }
            return a;
          });

        return updatedAssignments;
      } else {
        // Move only the specific assignment
        const updatedAssignments = prev
          .filter(a => !a.isGhost) // Remove ALL ghosts - they'll be recreated on data reload
          .map(a => {
            if (a.id === draggedPayroll.id) {
              // Find the original assignment to compare
              const originalAssignment = originalAssignments.find(
                orig => orig.id === a.id
              );

              // Move to new position
              const updated = {
                ...a,
                consultantId: targetConsultantId,
                consultantName: targetConsultantName,
                adjustedEftDate: targetDate,
              };
              
              // Save to global edits immediately
              const editKey = `${a.payrollId}-${targetDate}`;
              setGlobalEdits(prev => new Map(prev).set(editKey, {
                consultantId: targetConsultantId,
                consultantName: targetConsultantName
              }));
              
              return updated;
            }
            return a;
          });

        return updatedAssignments;
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
    const allCellAssignments = assignments.filter(assignment => {
      const isSameConsultant = assignment.consultantId === consultantId;
      const isSameDate = isSameDay(new Date(assignment.adjustedEftDate), date);
      return isSameConsultant && isSameDate;
    });
    
    // Apply ghost visibility filter
    return getVisibleAssignments(allCellAssignments);
  };

  // Helper function to clean up ghost assignments
  const removeGhosts = (
    assignments: PayrollAssignment[]
  ): PayrollAssignment[] => {
    return assignments.filter(a => !a.isGhost);
  };

  // Calculate pending changes
  const pendingChanges = useMemo(() => {
    const changesMap = new Map<string, PendingChange>();

    // Look at all global edits across all periods
    if (globalEdits.size > 0) {
      globalEdits.forEach((edit, editKey) => {
        const [payrollId, date] = editKey.split('-');
        
        // Find the original assignment info from the data
        const payroll = data?.payrolls?.find((p: any) => p.id === payrollId);
        if (payroll) {
          const originalConsultant = payroll.primaryConsultant;
          
          if (originalConsultant && edit.consultantId !== originalConsultant.id) {
            const changeKey = payrollId;
            
            if (!changesMap.has(changeKey)) {
              changesMap.set(changeKey, {
                payrollId: payrollId,
                payrollName: payroll.name,
                fromConsultantId: originalConsultant.id,
                toConsultantId: edit.consultantId,
                fromConsultantName: originalConsultant.name,
                toConsultantName: edit.consultantName,
                affectedDates: [date],
              });
            } else {
              const existingChange = changesMap.get(changeKey)!;
              if (!existingChange.affectedDates.includes(date)) {
                existingChange.affectedDates.push(date);
              }
            }
          }
        }
      });
    }

    return Array.from(changesMap.values());
  }, [globalEdits, data]);

  // Commit changes
  const commitChanges = async () => {
    if (pendingChanges.length === 0) return;

    try {
      console.log("🚀 Committing payroll consultant changes:", pendingChanges);
      console.log(
        "📊 Changes details:",
        pendingChanges.map(c => ({
          payroll: c.payrollName,
          from: c.fromConsultantName,
          to: c.toConsultantName,
          dates: c.affectedDates,
        }))
      );

      // Create updates for each changed payroll
      const updates = pendingChanges.map(change => ({
        where: { id: { _eq: change.payrollId } },
        _set: {
          primaryConsultantUserId: change.toConsultantId,
        },
      }));

      console.log("🔧 GraphQL Updates:", updates);

      // Update each payroll individually since UpdatePayrollDocument only handles one at a time
      const results = [];
      for (const update of updates) {
        const result = await updatePayrollConsultants({
          variables: {
            id: update.where.id._eq,
            set: update._set,
          },
        });
        results.push(result);
      }

      console.log("✅ Update results:", results);

      // Check if all updates were successful
      const successfulUpdates = results.filter(
        result => result.data?.updatePayrollById
      );
      const totalAffectedRows = successfulUpdates.length;

      if (totalAffectedRows > 0) {
        // Success: exit preview mode and refresh data
        const cleanAssignments = removeGhosts(assignments);
        setIsPreviewMode(false);
        setGlobalEdits(new Map()); // Clear global edits after successful save
        setOriginalAssignments([...cleanAssignments]);
        setAssignments(cleanAssignments);

        // Show success message
        console.log(`✅ Successfully updated ${totalAffectedRows} payroll(s)`);

        // Show success alert
        alert(
          `✅ Successfully updated ${totalAffectedRows} payroll assignment${
            totalAffectedRows !== 1 ? "s" : ""
          }!`
        );

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
    setGlobalEdits(new Map()); // Clear all global edits
    setAssignments([...originalAssignments]);
  };

  // Enter preview mode
  const enterPreviewMode = () => {
    setIsPreviewMode(true);
    // Remove any existing ghosts
    setAssignments(prev => removeGhosts(prev));
    // Optional: Reset ghost visibility to true when entering preview mode
    // setShowGhosts(true); // Uncomment if you want ghosts always visible on preview start
  };

  // Helper function to filter assignments based on ghost visibility
  const getVisibleAssignments = (
    assignments: PayrollAssignment[]
  ): PayrollAssignment[] => {
    if (!isPreviewMode) {
      return assignments; // Show all assignments when not in preview mode
    }
    if (showGhosts) {
      return assignments; // Show all assignments including ghosts when toggle is on
    }
    return assignments.filter(a => !a.isGhost); // Hide ghosts when toggle is off
  };

  // Responsive sizing state
  const [responsiveConfig, setResponsiveConfig] = useState({
    containerHeight: "70vh",
    cellMinWidth: 140,
    cellMinHeight: 60,
    headerHeight: 80,
    showFullDetails: true
  });

  // Update responsive config when state changes
  useEffect(() => {
    const updateConfig = () => {
      if (isExpanded) {
        setResponsiveConfig({
          containerHeight: "calc(100vh - 12rem)",
          cellMinWidth: 160,
          cellMinHeight: 80,
          headerHeight: tableOrientation === "consultants-as-columns" ? 100 : 160,
          showFullDetails: true
        });
      } else {
        setResponsiveConfig({
          containerHeight: "70vh",
          cellMinWidth: 140,
          cellMinHeight: 60,
          headerHeight: tableOrientation === "consultants-as-columns" ? 80 : 140,
          showFullDetails: typeof window !== 'undefined' ? window.innerWidth >= 768 : true
        });
      }
    };

    updateConfig();

    // Add window resize listener for responsive updates
    const handleResize = () => {
      if (!isExpanded) {
        updateConfig();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
    
    // Return undefined when window is not available
    return undefined;
  }, [isExpanded, tableOrientation]);

  // ESC key handler for fullscreen mode
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
    
    // Return undefined for the else case
    return undefined;
  }, [isExpanded]);

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

    const maxTime = Math.max(...assignments.map(a => a.processingTime));
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
    _totalProcessingTime: number,
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
    _totalProcessingTime: number,
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

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading payroll scheduler...</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading || staffLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading payroll scheduler and staff data...</p>
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
          <p className="text-sm text-muted-foreground">
            {(error as any)?.message || "Unknown error"}
          </p>
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

        {/* Debug Info Card */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <h4 className="font-semibold text-orange-800 mb-2">
              Debug Information
            </h4>
            <div className="text-sm text-orange-700 space-y-1">
              <p>
                <strong>Date Range:</strong> {formatPeriodDisplay()}
              </p>
              <p>
                <strong>Query Variables:</strong>{" "}
                {format(dateRange.start, "yyyy-MM-dd")} to{" "}
                {format(dateRange.end, "yyyy-MM-dd")}
              </p>
              <p>
                <strong>Raw Payrolls Count:</strong>{" "}
                {data?.payrolls?.length || 0}
              </p>
              <p>
                <strong>Raw PayrollDates Count:</strong>{" "}
                {data?.payrolls?.reduce(
                  (total, payroll) =>
                    total + (payroll.payrollDates?.length || 0),
                  0
                ) || 0}
              </p>
              <p>
                <strong>Sample Payroll:</strong>{" "}
                {data?.payrolls?.[0]?.name || "None"}
              </p>
              <p>
                <strong>Has Consultant Data:</strong>{" "}
                {data?.payrolls?.[0]?.primaryConsultant ? "Yes" : "No"}
              </p>
              <p>
                <strong>Consultants Found:</strong> {consultants.length}
              </p>
              <p>
                <strong>Assignments Transformed:</strong> {assignments.length}
              </p>
              {error && (
                <p>
                  <strong>Error:</strong>{" "}
                  {(error as any)?.message || "Unknown error"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

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
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date())}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Go to Current Month
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isExpanded ? 'fixed inset-0 z-50 bg-background p-6 overflow-auto' : ''}`}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Advanced Payroll Scheduler
          </h2>
          <p className="text-gray-600">
            Drag-and-drop scheduling with consultant summaries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Expand</span>
              </>
            )}
          </Button>
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
                onValueChange={(value: string) =>
                  setViewPeriod(value as ViewPeriod)
                }
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
                onCheckedChange={(checked: boolean) =>
                  setTableOrientation(
                    checked ? "consultants-as-rows" : "consultants-as-columns"
                  )
                }
                disabled={loading || updating}
              />
              <Label>Consultants as Rows</Label>
            </div>

            {/* Group Movement Switch */}
            {/* <div className="flex items-center space-x-2">
              <Switch
                checked={moveAsGroup}
                onCheckedChange={setMoveAsGroup}
                disabled={loading || updating || !isPreviewMode}
              />
              <Label>Move Entire Payroll Group</Label>
            </div> */}

            {/* Ghost Visibility Switch */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={showGhosts}
                onCheckedChange={setShowGhosts}
                disabled={loading || updating || !isPreviewMode}
              />
              <Label>Show Original Positions</Label>
            </div>

            {/* Expanded Mode Indicator */}
            {isExpanded && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Fullscreen Mode
                </Badge>
                <span className="text-xs text-gray-500">Press ESC to exit</span>
              </div>
            )}

            {/* Preview Mode Actions */}
            {!isPreviewMode ? (
              <div className="ml-auto">
                <PermissionGuard permissions={["payroll:write"]}>
                  <Button
                    onClick={enterPreviewMode}
                    disabled={loading || updating}
                  >
                    Edit Schedule
                  </Button>
                </PermissionGuard>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-auto">
                <Badge variant="outline">
                  {pendingChanges.length} pending change
                  {pendingChanges.length !== 1 ? "s" : ""}
                </Badge>
                {updating && <Badge variant="outline">Saving...</Badge>}
                {updateError && (
                  <Badge variant="destructive" className="text-xs">
                    Save failed
                  </Badge>
                )}
                <PermissionGuard permissions={["payroll:write"]}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={revertChanges}
                    disabled={updating}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={commitChanges}
                    disabled={updating || pendingChanges.length === 0}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updating ? "Saving..." : "Save Changes"}
                  </Button>
                </PermissionGuard>
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
          disabled={loading || updating}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <h3 className="text-xl font-semibold">{formatPeriodDisplay()}</h3>

        <Button
          variant="outline"
          onClick={navigateNext}
          disabled={loading || updating}
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

      {/* Main Grid Table */}
      <Card className="dark:bg-card">
        <CardContent className="p-0">
          <div
            className="border rounded-lg bg-background dark:bg-card overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800"
            style={{
              maxHeight: responsiveConfig.containerHeight,
              overflowX: "auto",
              overflowY: "auto",
              scrollBehavior: "smooth"
            }}
          >
            <div 
              className="grid relative"
              style={{
                gridTemplateColumns: tableOrientation === "consultants-as-columns" 
                  ? `${responsiveConfig.cellMinWidth}px repeat(${consultants.length}, minmax(${responsiveConfig.cellMinWidth}px, ${isExpanded ? '1fr' : 'auto'}))`
                  : `${responsiveConfig.cellMinWidth + 40}px repeat(${dates.length}, ${responsiveConfig.cellMinWidth}px)`,
                width: tableOrientation === "consultants-as-columns" 
                  ? isExpanded ? "100%" : "fit-content"
                  : "fit-content",
                minWidth: tableOrientation === "consultants-as-columns" ? "100%" : "unset"
              }}
            >
              {/* Corner Header Cell */}
              <div
                className="sticky top-0 left-0 z-40 bg-background dark:bg-card border-b-2 border-r-2 border-gray-200 shadow-md flex items-center justify-center font-medium text-sm"
                style={{
                  position: "sticky",
                  top: 0,
                  left: 0,
                  zIndex: 40,
                  gridColumn: 1,
                  gridRow: 1,
                  height: responsiveConfig.headerHeight,
                  width: tableOrientation === "consultants-as-columns" ? responsiveConfig.cellMinWidth : responsiveConfig.cellMinWidth + 40
                }}
              >
                {tableOrientation === "consultants-as-columns" ? "Date" : "Consultant"}
              </div>

              {/* Header Cells */}
              {tableOrientation === "consultants-as-columns"
                ? consultants.map((consultant, index) => {
                    const summary = consultantSummaries.find(
                      s => s.id === consultant.id
                    );
                    return (
                      <div
                        key={consultant.id}
                        className="sticky top-0 z-20 bg-background dark:bg-card border-b-2 border-gray-200 p-1"
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 20,
                          gridColumn: index + 2,
                          gridRow: 1,
                          height: responsiveConfig.headerHeight
                        }}
                      >
                        <Card
                          className="shadow-sm border h-full"
                          style={getConsultantCardBackgroundStyle(
                            summary?.totalProcessingTime || 0,
                            summary?.isOnLeave
                          )}
                        >
                          <CardContent className="p-2 h-full flex flex-col justify-center">
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
                                <div title="Payrolls" className="text-center">
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
                                <div title="Employees" className="text-center">
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
                      </div>
                    );
                  })
                : dates.map((date, index) => {
                    const holiday = getHolidayForDate(date);
                    const holidayInfo = holiday
                      ? getHolidayDisplayInfo(holiday, true)
                      : null;
                    const isWeekendDay = isWeekend(date);
                    return (
                      <div
                        key={date.toISOString()}
                        className="sticky top-0 z-20 bg-background dark:bg-card border-b-2 border-gray-200 p-1"
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 20,
                          gridColumn: index + 2,
                          gridRow: 1,
                          height: responsiveConfig.headerHeight
                        }}
                      >
                        <Card
                          className={`${
                            holiday
                              ? holidayInfo?.isPrimary
                                ? "bg-red-200 dark:bg-red-900/80 border-red-400 dark:border-red-600"
                                : "bg-amber-200 dark:bg-amber-900/80 border-amber-400 dark:border-amber-600"
                              : isWeekendDay
                                ? "bg-blue-200 dark:bg-blue-900/80 border-blue-400 dark:border-blue-600"
                                : "bg-card border-gray-200"
                          } shadow-sm h-full`}
                        >
                          <CardContent className="p-1.5 h-full flex flex-col justify-center">
                            <div className="space-y-0.5 text-center">
                              <div className="text-xs font-medium text-gray-600">
                                {format(date, "EEE")}
                              </div>
                              <div className="text-sm font-bold text-gray-900">
                                {format(date, "MMM d")}
                              </div>
                              <div className="text-xs text-gray-500">
                                {format(date, "yyyy")}
                              </div>
                              {holiday && holidayInfo ? (
                                <div className="text-xs mt-1 space-y-1 flex flex-col items-center">
                                  <div className="flex items-center justify-center gap-0.5">
                                    <Calendar
                                      className={`w-3 h-3 ${holidayInfo.isPrimary ? "text-red-600" : "text-amber-600"}`}
                                    />
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs px-1 py-0 h-4 font-medium truncate max-w-full ${
                                      holidayInfo.isPrimary
                                        ? "bg-red-50 text-red-700 border-red-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}
                                    title={holiday.localName || holiday.name}
                                  >
                                    {holidayInfo.name}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs px-1 py-0 h-4 truncate max-w-full ${
                                      holidayInfo.isPrimary
                                        ? "bg-red-50 text-red-700 border-red-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}
                                    title={`Holiday region: ${holidayInfo.designation}`}
                                  >
                                    {holidayInfo.designation}
                                  </Badge>
                                </div>
                              ) : isWeekendDay ? (
                                <div className="text-xs mt-0.5">
                                  <Badge
                                    variant="outline"
                                    className="text-xs px-1 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200"
                                  >
                                    Weekend
                                  </Badge>
                                </div>
                              ) : null}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}

              {/* Data Cells - Consultants as Columns */}
              {tableOrientation === "consultants-as-columns"
                ? dates.map((date, dateIndex) => {
                    const holiday = getHolidayForDate(date);
                    const holidayInfo = holiday
                      ? getHolidayDisplayInfo(holiday)
                      : null;
                    const isWeekendDay = isWeekend(date);

                    return [
                      // Row Header (Date Cell)
                      <div
                        key={`date-${date.toISOString()}`}
                        className="sticky left-0 z-20 bg-background dark:bg-card border-r-2 border-gray-200 shadow-md p-2 font-medium"
                        style={{
                          position: "sticky",
                          left: 0,
                          zIndex: 20,
                          gridColumn: 1,
                          gridRow: dateIndex + 2,
                          width: "140px",
                          backgroundColor: holiday
                            ? holidayInfo?.isPrimary
                              ? "rgb(254, 242, 242)"
                              : "rgb(255, 251, 235)"
                            : isWeekendDay
                              ? "rgb(239, 246, 255)"
                              : dateIndex % 2 === 0
                                ? "hsl(var(--muted) / 0.2)"
                                : "hsl(var(--background))"
                        }}
                      >
                        <Card
                          className={`${
                            holiday
                              ? holidayInfo?.isPrimary
                                ? "bg-red-200 dark:bg-red-900/80 border-red-400 dark:border-red-600"
                                : "bg-amber-200 dark:bg-amber-900/80 border-amber-400 dark:border-amber-600"
                              : isWeekendDay
                                ? "bg-blue-200 dark:bg-blue-900/80 border-blue-400 dark:border-blue-600"
                                : "bg-card border-gray-200"
                          } shadow-sm h-full`}
                        >
                          <CardContent className="p-2 h-full flex flex-col justify-center">
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
                              {holiday && holidayInfo ? (
                                <div className="text-xs mt-1.5 space-y-1 flex flex-col items-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <Calendar
                                      className={`w-3 h-3 ${holidayInfo.isPrimary ? "text-red-600" : "text-amber-600"}`}
                                    />
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs px-1 py-0 h-4 font-medium truncate max-w-full ${
                                      holidayInfo.isPrimary
                                        ? "bg-red-50 text-red-700 border-red-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}
                                    title={holiday.localName || holiday.name}
                                  >
                                    {holidayInfo.name}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs px-1 py-0 h-4 truncate max-w-full ${
                                      holidayInfo.isPrimary
                                        ? "bg-red-50 text-red-700 border-red-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}
                                    title={`Holiday region: ${holidayInfo.designation}`}
                                  >
                                    {holidayInfo.designation}
                                  </Badge>
                                </div>
                              ) : isWeekendDay ? (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                >
                                  Weekend
                                </Badge>
                              ) : null}
                            </div>
                          </CardContent>
                        </Card>
                      </div>,
                      
                      // Data Cells for this row
                      ...consultants.map((consultant, consultantIndex) => {
                        const cellAssignments = getAssignmentsForCell(
                          consultant.id,
                          date
                        );
                        const isOnLeave = isConsultantOnLeave(
                          consultant.id,
                          date
                        );
                        const isDropTarget =
                          dragState.dragOverCell?.consultantId ===
                            consultant.id &&
                          dragState.dragOverCell?.date ===
                            format(date, "yyyy-MM-dd");

                        return (
                          <div
                            key={`${consultant.id}-${date.toISOString()}`}
                            className={`p-2 border-l transition-all ${
                              isDropTarget
                                ? "bg-blue-200 border-2 border-blue-600"
                                : ""
                            } ${isOnLeave ? "bg-green-100" : ""}`}
                            style={{
                              minHeight: `${responsiveConfig.cellMinHeight}px`,
                              gridColumn: consultantIndex + 2,
                              gridRow: dateIndex + 2,
                              backgroundColor: holiday
                                ? holidayInfo?.isPrimary
                                  ? "rgb(254, 242, 242)"
                                  : "rgb(255, 251, 235)"
                                : isWeekendDay
                                  ? "rgb(239, 246, 255)"
                                  : dateIndex % 2 === 0
                                    ? "hsl(var(--muted) / 0.2)"
                                    : "hsl(var(--background))"
                            }}
                            onDragOver={e =>
                              handleDragOver(
                                e,
                                consultant.id,
                                format(date, "yyyy-MM-dd")
                              )
                            }
                            onDrop={e =>
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

                              {cellAssignments.map(assignment => {
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
                                          : "border-gray-200"
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
                                    onDragStart={e =>
                                      handleDragStart(e, assignment)
                                    }
                                    onDragEnd={handleDragEnd}
                                  >
                                    <div
                                      className={`font-medium ${isExpanded ? 'text-sm' : 'text-xs'} mb-1 ${getTextColorForProcessingTime(
                                        assignment.processingTime,
                                        assignment.isGhost
                                      )}`}
                                    >
                                      {assignment.payrollName}
                                    </div>
                                    <div
                                      className={`mb-1 text-xs ${getTextColorForProcessingTime(
                                        assignment.processingTime,
                                        assignment.isGhost
                                      )}`}
                                    >
                                      {assignment.employeeCount} emp
                                      {isExpanded && assignment.processingTime && (
                                        <span className="ml-2">• {assignment.processingTime}h</span>
                                      )}
                                    </div>
                                    <div
                                      className={`text-xs ${getTextColorForProcessingTime(
                                        assignment.processingTime,
                                        assignment.isGhost
                                      )}`}
                                      title={assignment.clientName}
                                    >
                                      {isExpanded 
                                        ? assignment.clientName 
                                        : assignment.clientName.length > 15 
                                          ? assignment.clientName.substring(0, 15) + "..." 
                                          : assignment.clientName
                                      }
                                    </div>
                                    {assignment.isBackup && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs mt-1"
                                        title={`Backup for ${assignment.originalConsultantName || "primary consultant"}`}
                                      >
                                        🔄{" "}
                                        {assignment.originalConsultantName ||
                                          "Backup"}
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
                          </div>
                        );
                      })
                    ].flat();
                  })
                  .flat()
                : // Consultants as Rows orientation
                  consultants.map((consultant, consultantIndex) => {
                    const summary = consultantSummaries.find(
                      s => s.id === consultant.id
                    );

                    return [
                      // Row Header (Consultant Cell)
                      <div
                        key={`consultant-${consultant.id}`}
                        className="sticky left-0 z-20 bg-background dark:bg-card border-r-2 border-gray-200 shadow-md p-2 font-medium"
                        style={{
                          position: "sticky",
                          left: 0,
                          zIndex: 20,
                          gridColumn: 1,
                          gridRow: consultantIndex + 2,
                          backgroundColor: consultantIndex % 2 === 0
                            ? "hsl(var(--muted) / 0.2)"
                            : "hsl(var(--background))"
                        }}
                      >
                        <Card
                          className="shadow-sm border h-full"
                          style={getConsultantCardBackgroundStyle(
                            summary?.totalProcessingTime || 0,
                            summary?.isOnLeave
                          )}
                        >
                          <CardContent className="p-2 h-full flex flex-col justify-center">
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
                                <div title="Payrolls" className="text-center">
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
                                <div title="Employees" className="text-center">
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
                      </div>,
                      
                      // Data Cells for this row
                      ...dates.map((date, dateIndex) => {
                        const cellAssignments = getAssignmentsForCell(
                          consultant.id,
                          date
                        );
                        const isOnLeave = isConsultantOnLeave(
                          consultant.id,
                          date
                        );
                        const holiday = getHolidayForDate(date);
                        const holidayInfo = holiday
                          ? getHolidayDisplayInfo(holiday)
                          : null;
                        const isWeekendDay = isWeekend(date);
                        const isDropTarget =
                          dragState.dragOverCell?.consultantId ===
                            consultant.id &&
                          dragState.dragOverCell?.date ===
                            format(date, "yyyy-MM-dd");

                        return (
                          <div
                            key={`${consultant.id}-${date.toISOString()}`}
                            className={`p-2 border-l transition-all ${
                              isDropTarget
                                ? "bg-blue-200 border-2 border-blue-600"
                                : ""
                            } ${isOnLeave ? "bg-green-100" : ""}`}
                            style={{
                              minHeight: `${responsiveConfig.cellMinHeight}px`,
                              gridColumn: dateIndex + 2,
                              gridRow: consultantIndex + 2,
                              backgroundColor: holiday
                                ? holidayInfo?.isPrimary
                                  ? "rgb(254, 242, 242)"
                                  : "rgb(255, 251, 235)"
                                : isWeekendDay
                                  ? "rgb(239, 246, 255)"
                                  : consultantIndex % 2 === 0
                                    ? "hsl(var(--muted) / 0.2)"
                                    : "hsl(var(--background))"
                            }}
                            onDragOver={e =>
                              handleDragOver(
                                e,
                                consultant.id,
                                format(date, "yyyy-MM-dd")
                              )
                            }
                            onDrop={e =>
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

                              {cellAssignments.map(assignment => {
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
                                          : "border-gray-200"
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
                                    onDragStart={e =>
                                      handleDragStart(e, assignment)
                                    }
                                    onDragEnd={handleDragEnd}
                                  >
                                    <div
                                      className={`font-medium ${isExpanded ? 'text-sm' : 'text-xs'} mb-1 ${getTextColorForProcessingTime(
                                        assignment.processingTime,
                                        assignment.isGhost
                                      )}`}
                                    >
                                      {assignment.payrollName}
                                    </div>
                                    <div
                                      className={`mb-1 text-xs ${getTextColorForProcessingTime(
                                        assignment.processingTime,
                                        assignment.isGhost
                                      )}`}
                                    >
                                      {assignment.employeeCount} emp
                                      {isExpanded && assignment.processingTime && (
                                        <span className="ml-2">• {assignment.processingTime}h</span>
                                      )}
                                    </div>
                                    <div
                                      className={`text-xs ${getTextColorForProcessingTime(
                                        assignment.processingTime,
                                        assignment.isGhost
                                      )}`}
                                      title={assignment.clientName}
                                    >
                                      {isExpanded 
                                        ? assignment.clientName 
                                        : assignment.clientName.length > 15 
                                          ? assignment.clientName.substring(0, 15) + "..." 
                                          : assignment.clientName
                                      }
                                    </div>
                                    {assignment.isBackup && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs mt-1"
                                        title={`Backup for ${assignment.originalConsultantName || "primary consultant"}`}
                                      >
                                        🔄{" "}
                                        {assignment.originalConsultantName ||
                                          "Backup"}
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
                          </div>
                        );
                      })
                    ].flat();
                  })
                  .flat()}
            </div>
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
