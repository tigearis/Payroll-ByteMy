import { useQuery } from "@apollo/client";
import { format, parseISO, addDays, startOfWeek, endOfWeek } from "date-fns";
import { useMemo } from "react";
import {
  GetAllStaffWorkloadDocument,
  GetTeamWorkloadDocument,
  type GetAllStaffWorkloadQuery,
  type GetTeamWorkloadQuery,
} from "../graphql/generated/graphql";
import {
  TeamMember,
  WorkScheduleDay,
  PayrollAssignment,
  ViewPeriod,
} from "../types/workload";

interface UseTeamWorkloadGraphQLOptions {
  managerUserId?: string;
  includeAllStaff?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export function useTeamWorkloadGraphQL({
  managerUserId,
  includeAllStaff = false,
  dateRange,
}: UseTeamWorkloadGraphQLOptions = {}) {
  // Choose which query to use based on options
  const shouldUseTeamQuery = managerUserId && !includeAllStaff;
  
  const allStaffResult = useQuery<GetAllStaffWorkloadQuery>(GetAllStaffWorkloadDocument, {
    skip: shouldUseTeamQuery,
  });

  const teamResult = useQuery<GetTeamWorkloadQuery>(GetTeamWorkloadDocument, {
    variables: { managerUserId: managerUserId! },
    skip: !shouldUseTeamQuery,
  });

  // Use the appropriate result
  const queryResult = shouldUseTeamQuery ? teamResult : allStaffResult;

  // Transform the data into our component format
  const teamMembers = useMemo((): TeamMember[] => {
    if (!queryResult.data?.users) return [];

    return queryResult.data.users.map((user): TeamMember => {
      // Transform work schedules
      const workSchedule: WorkScheduleDay[] = user.userWorkSchedules.map((ws) => {
        // Combine primary and backup payroll assignments
        const allPayrolls = [
          ...user.primaryConsultantPayrolls,
          ...user.backupConsultantPayrolls,
        ];

        // Filter payrolls by date if they have payroll dates
        const dayAssignments: PayrollAssignment[] = allPayrolls
          .filter((payroll) => {
            if (!payroll.payrollDates?.length) return false;
            
            // For now, we'll include all payrolls for all days
            // In the future, we can filter by specific dates
            return true;
          })
          .map((payroll) => ({
            id: payroll.id,
            name: payroll.name,
            clientName: payroll.client?.name || "Unknown Client",
            processingTime: payroll.processingTime || 0,
            processingDaysBeforeEft: payroll.processingDaysBeforeEft || 0,
            eftDate: payroll.payrollDates?.[0]?.adjustedEftDate || new Date().toISOString(),
            status: mapPayrollStatus(payroll.status),
            priority: determinePriority(payroll),
          }));

        return {
          date: ws.workDay,
          workHours: ws.workHours || 0,
          adminTimeHours: ws.adminTimeHours || 0,
          payrollCapacityHours: ws.payrollCapacityHours || 0,
          assignments: dayAssignments,
        };
      });

      return {
        userId: user.id,
        userName: user.name || "Unknown User",
        userRole: user.role || "consultant",
        email: user.email,
        isActive: true,
        workSchedule,
        skills: user.userSkills?.map(skill => skill.skillName) || [],
      };
    });
  }, [queryResult.data]);

  // Filter by date range if provided
  const filteredTeamMembers = useMemo(() => {
    if (!dateRange) return teamMembers;

    return teamMembers.map(member => ({
      ...member,
      workSchedule: member.workSchedule.filter(day => {
        const dayDate = parseISO(day.date);
        return dayDate >= dateRange.start && dayDate <= dateRange.end;
      }),
    }));
  }, [teamMembers, dateRange]);

  return {
    teamMembers: filteredTeamMembers,
    loading: queryResult.loading,
    error: queryResult.error?.message || null,
    refetch: queryResult.refetch,
  };
}

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

// Helper function to determine priority based on payroll data
function determinePriority(payroll: any): "high" | "medium" | "low" {
  // Priority logic:
  // High: Large processing time (>4 hours) or urgent deadline
  // Medium: Medium processing time (2-4 hours)
  // Low: Small processing time (<2 hours)
  
  const processingTime = payroll.processingTime || 0;
  const daysBeforeEft = payroll.processingDaysBeforeEft || 0;

  if (processingTime > 4 || daysBeforeEft <= 1) {
    return "high";
  } else if (processingTime > 2 || daysBeforeEft <= 3) {
    return "medium";
  } else {
    return "low";
  }
}