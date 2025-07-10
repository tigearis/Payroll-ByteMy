import { useQuery } from "@apollo/client";
import { format, addDays } from "date-fns";
import { useMemo } from "react";
import {
  GetTeamWorkloadDocument,
  GetAllStaffWorkloadDocument,
  type GetTeamWorkloadQuery,
  type GetAllStaffWorkloadQuery,
} from "../graphql/generated/graphql";
import {
  TeamCapacityResponse,
  UseTeamCapacityReturn,
  ViewPeriod,
  TeamMember,
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

// Utility function to calculate utilization trend
function calculateUtilizationTrend(utilizations: number[]) {
  if (utilizations.length < 3) return "stable" as const;
  
  const firstHalf = utilizations.slice(0, Math.floor(utilizations.length / 2));
  const secondHalf = utilizations.slice(Math.ceil(utilizations.length / 2));
  
  const firstHalfAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
  
  const trendThreshold = 5;
  if (secondHalfAvg > firstHalfAvg + trendThreshold) {
    return "increasing" as const;
  } else if (secondHalfAvg < firstHalfAvg - trendThreshold) {
    return "decreasing" as const;
  }
  return "stable" as const;
}

interface UseTeamCapacityOptions {
  teamIds: string[];
  period: ViewPeriod;
  currentDate: Date;
  enabled?: boolean;
  managerUserId?: string;
}

export function useTeamCapacity({
  teamIds,
  period,
  currentDate,
  enabled = true,
  managerUserId,
}: UseTeamCapacityOptions): UseTeamCapacityReturn {
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

  // Choose which query to use based on whether we have a manager filter
  const shouldUseTeamQuery = managerUserId && teamIds.length === 0;
  
  // Team workload query
  const teamResult = useQuery<GetTeamWorkloadQuery>(GetTeamWorkloadDocument, {
    variables: { managerUserId: managerUserId! },
    skip: !shouldUseTeamQuery || !enabled,
    errorPolicy: "all",
  });

  // All staff query when no manager filter
  const allStaffResult = useQuery<GetAllStaffWorkloadQuery>(GetAllStaffWorkloadDocument, {
    skip: shouldUseTeamQuery || !enabled,
    errorPolicy: "all",
  });

  // Use the appropriate result
  const queryResult = shouldUseTeamQuery ? teamResult : allStaffResult;

  // Transform data to match our interface
  const transformedData = useMemo((): TeamCapacityResponse | null => {
    if (!queryResult.data?.users) return null;

    const users = queryResult.data.users;
    
    // Filter by team IDs if provided
    const filteredUsers = teamIds.length > 0 
      ? users.filter(user => teamIds.includes(user.id))
      : users;

    const teamMembers = filteredUsers.map(user => {
      const schedules = user.userWorkSchedules || [];
      const primaryPayrolls = user.primaryConsultantPayrolls || [];
      const backupPayrolls = user.backupConsultantPayrolls || [];
      const allPayrolls = [...primaryPayrolls, ...backupPayrolls];

      // Calculate periods for this team member
      const periods = [];
      const currentIterDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      
      while (currentIterDate <= endDate) {
        const dateStr = format(currentIterDate, "yyyy-MM-dd");
        const dayName = format(currentIterDate, "EEEE");
        
        const schedule = schedules.find(s => s.workDay === dayName);
        const dayAssignments = allPayrolls.filter(payroll =>
          payroll.payrollDates?.some(pd => 
            pd.adjustedEftDate && format(new Date(pd.adjustedEftDate), "yyyy-MM-dd") === dateStr
          )
        );

        const assignedHours = dayAssignments.reduce((sum, payroll) => sum + (payroll.processingTime || 0), 0);
        const capacity = schedule?.payrollCapacityHours || 0;
        const utilization = capacity > 0 ? Math.round((assignedHours / capacity) * 100) : 0;

        periods.push({
          date: dateStr,
          period: format(currentIterDate, "MMM d"),
          fullDate: dateStr,
          workHours: schedule?.workHours || 0,
          adminTimeHours: schedule?.adminTimeHours || 0,
          payrollCapacityHours: capacity,
          assignedHours,
          utilization,
          utilizationHours: assignedHours,
          overflowHours: Math.max(0, assignedHours - capacity),
          assignments: dayAssignments.map(payroll => ({
            id: payroll.id,
            name: payroll.name,
            clientName: "Unknown Client", // Client data not available in team queries
            processingTime: payroll.processingTime || 0,
            processingDaysBeforeEft: payroll.processingDaysBeforeEft || 0,
            eftDate: payroll.payrollDates?.[0]?.adjustedEftDate || new Date().toISOString(),
            status: mapPayrollStatus(payroll.status),
            priority: "medium" as const,
          })),
          isOverallocated: utilization > 100,
          utilizationLevel: getUtilizationLevel(utilization),
          isUnderutilized: utilization < 70,
        });
        
        currentIterDate.setDate(currentIterDate.getDate() + 1);
      }

      // Calculate summary for this team member
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
          utilizationTrend: calculateUtilizationTrend(periods.map(p => p.utilization)),
          peakUtilization: Math.max(...periods.map(p => p.utilization)),
          minUtilization: Math.min(...periods.map(p => p.utilization)),
          capacityEfficiency: avgUtilization,
        },
      };
    });

    // Calculate team summary
    const allPeriods = teamMembers.flatMap(member => member.periods);
    const teamTotalCapacity = allPeriods.reduce((sum, p) => sum + p.payrollCapacityHours, 0);
    const teamTotalAssigned = allPeriods.reduce((sum, p) => sum + p.assignedHours, 0);
    const teamAvgUtilization = teamTotalCapacity > 0 ? Math.round((teamTotalAssigned / teamTotalCapacity) * 100) : 0;
    const teamOverallocatedPeriods = allPeriods.filter(p => p.isOverallocated).length;
    const teamUnderutilizedPeriods = allPeriods.filter(p => p.isUnderutilized).length;

    return {
      teamMembers,
      teamSummary: {
        totalCapacity: teamTotalCapacity,
        totalAssigned: teamTotalAssigned,
        avgUtilization: teamAvgUtilization,
        overallocatedPeriods: teamOverallocatedPeriods,
        periodsShown: allPeriods.length,
        underutilizedPeriods: teamUnderutilizedPeriods,
        utilizationTrend: calculateUtilizationTrend(allPeriods.map(p => p.utilization)),
        peakUtilization: Math.max(...allPeriods.map(p => p.utilization)),
        minUtilization: Math.min(...allPeriods.map(p => p.utilization)),
        capacityEfficiency: teamAvgUtilization,
      },
    };
  }, [queryResult.data, teamIds, dateRange]);

  return {
    data: transformedData,
    loading: queryResult.loading,
    error: queryResult.error?.message || null,
    refetch: async () => { await queryResult.refetch(); },
    refresh: async () => { await queryResult.refetch(); },
  };
}