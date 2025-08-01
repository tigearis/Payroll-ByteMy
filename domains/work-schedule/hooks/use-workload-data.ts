import { useQuery } from "@apollo/client";
import { format, addDays, parseISO } from "date-fns";
import { useMemo } from "react";
import {
  GetConsultantWorkloadDocument,
  type GetConsultantWorkloadQuery,
} from "../graphql/generated/graphql";
import {
  WorkloadMetricsResponse,
  UseWorkloadDataReturn,
  ViewPeriod,
  WorkloadPeriodData,
  PayrollAssignment,
} from "../types/workload";

// Helper function to map payroll status to our enum
function mapPayrollStatus(status: string): "active" | "pending" | "completed" {
  switch (status?.toLowerCase()) {
    case "active":
      return "active";
    case "pending_approval":
    case "draft":
      return "pending";
    case "completed":
    case "processed":
      return "completed";
    default:
      return "active";
  }
}

// Utility function to determine utilization level
function getUtilizationLevel(utilization: number) {
  if (utilization < 70) return "underutilized" as const;
  if (utilization <= 85) return "optimal" as const;
  if (utilization <= 100) return "high" as const;
  return "overallocated" as const;
}

interface UseWorkloadDataOptions {
  userId: string;
  period: ViewPeriod;
  currentDate: Date;
  enabled?: boolean;
}

export function useWorkloadData({
  userId,
  period,
  currentDate,
  enabled = true,
}: UseWorkloadDataOptions): UseWorkloadDataReturn {
  // Calculate date range based on period and current date
  const dateRange = useMemo(() => {
    const start = new Date(currentDate);
    let end = new Date(currentDate);

    switch (period) {
      case "day":
        break;
      case "week":
        end = addDays(start, 6);
        break;
      case "month":
        const monthEnd = new Date(start.getFullYear(), start.getMonth() + 1, 0);
        end = monthEnd;
        break;
    }

    return {
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd"),
    };
  }, [currentDate, period]);

  // Use existing GraphQL query
  const {
    data: consultantData,
    loading,
    error,
    refetch,
  } = useQuery<GetConsultantWorkloadQuery>(GetConsultantWorkloadDocument, {
    variables: {
      consultantId: userId,
    },
    skip: !enabled || !userId,
    errorPolicy: "all",
  });

  // Transform data to match our interface
  const transformedData = useMemo((): WorkloadMetricsResponse | null => {
    if (!consultantData?.users?.[0]) return null;

    const user = consultantData.users[0];
    const schedules = user.workSchedules || [];
    const primaryPayrolls = user.primaryPayrollAssignments || [];
    const backupPayrolls = user.backupPayrollAssignments || [];
    const allPayrolls = [...primaryPayrolls, ...backupPayrolls];

    // Generate work schedule days for the date range - MEMORY LEAK FIXED
    const periods: WorkloadPeriodData[] = [];
    const startDate = parseISO(dateRange.startDate);
    const endDate = parseISO(dateRange.endDate);
    
    // Calculate total days to prevent infinite loops
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Use for loop with safety limit instead of while loop with mutable date
    for (let dayIndex = 0; dayIndex < Math.min(totalDays, 366); dayIndex++) {
      const currentDate = addDays(startDate, dayIndex);
      
      // Safety check to prevent infinite loops
      if (currentDate > endDate) break;
      
      const dateStr = format(currentDate, "yyyy-MM-dd");
      const dayName = format(currentDate, "EEEE");
      
      // Find matching work schedule for this day of week
      const schedule = schedules.find((s) => s.workDay === dayName);
      
      // Calculate assignments for this day
      const dayAssignments: PayrollAssignment[] = allPayrolls
        .filter((payroll) => {
          // Simple date matching - could be enhanced with proper date range logic
          return payroll.payrollDates?.some(pd => 
            pd.adjustedEftDate && format(parseISO(pd.adjustedEftDate), "yyyy-MM-dd") === dateStr
          );
        })
        .map((payroll) => ({
          id: payroll.id,
          name: payroll.name,
          clientName: payroll.client?.name || "Unknown Client",
          processingTime: payroll.processingTime || 0,
          processingDaysBeforeEft: payroll.processingDaysBeforeEft || 0,
          eftDate: payroll.payrollDates?.[0]?.adjustedEftDate || new Date().toISOString(),
          status: mapPayrollStatus(payroll.status),
          priority: "medium" as const,
        }));

      const assignedHours = dayAssignments.reduce((sum, assignment) => sum + assignment.processingTime, 0);
      const capacity = schedule?.payrollCapacityHours || 0;
      const utilization = capacity > 0 ? Math.round((assignedHours / capacity) * 100) : 0;

      periods.push({
        date: dateStr,
        period: format(currentDate, "MMM d"),
        fullDate: dateStr,
        workHours: schedule?.workHours || 0,
        adminTimeHours: schedule?.adminTimeHours || 0,
        payrollCapacityHours: capacity,
        assignedHours,
        utilization,
        utilizationHours: assignedHours,
        overflowHours: Math.max(0, assignedHours - capacity),
        assignments: dayAssignments,
        isOverallocated: utilization > 100,
        utilizationLevel: getUtilizationLevel(utilization),
        isUnderutilized: utilization < 70,
      });
    }

    // Calculate summary
    const totalCapacity = periods.reduce((sum, p) => sum + p.payrollCapacityHours, 0);
    const totalAssigned = periods.reduce((sum, p) => sum + p.assignedHours, 0);
    const avgUtilization = totalCapacity > 0 ? Math.round((totalAssigned / totalCapacity) * 100) : 0;
    const overallocatedPeriods = periods.filter(p => p.isOverallocated).length;
    const underutilizedPeriods = periods.filter(p => p.isUnderutilized).length;

    return {
      periods,
      summary: {
        totalCapacity,
        totalAssigned,
        avgUtilization,
        overallocatedPeriods,
        periodsShown: periods.length,
        underutilizedPeriods,
        utilizationTrend: "stable" as const,
        peakUtilization: Math.max(...periods.map(p => p.utilization)),
        minUtilization: Math.min(...periods.map(p => p.utilization)),
        capacityEfficiency: avgUtilization,
      },
    };
  }, [consultantData, dateRange]);

  return {
    data: transformedData,
    loading,
    error: error?.message || null,
    refetch: async () => { await refetch(); },
    refresh: async () => { await refetch(); },
  };
}