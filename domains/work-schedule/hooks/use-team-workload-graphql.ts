import { useQuery } from "@apollo/client";
import { format, parseISO, addDays, startOfWeek, endOfWeek, isWeekend, isSameDay } from "date-fns";
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

// Helper function to check if a date is a business day (not weekend, not holiday)
function isBusinessDay(date: Date, holidays: any[] = []): boolean {
  if (isWeekend(date)) {
    return false;
  }
  
  const dateStr = format(date, 'yyyy-MM-dd');
  const isHoliday = holidays.some(holiday => holiday.date === dateStr);
  
  return !isHoliday;
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

  // Transform the data into our component format with proper processing time distribution
  const teamMembers = useMemo((): TeamMember[] => {
    if (!queryResult.data?.users) return [];

    return queryResult.data.users.map((user): TeamMember => {
      // Get user's work schedule
      const schedules = user.userWorkSchedules || [];
      
      // Combine primary and backup payroll assignments
      const allPayrolls = [
        ...user.primaryConsultantPayrolls,
        ...user.backupConsultantPayrolls,
      ];

      // Create a map of dates to assignments with proper distribution
      const assignmentsByDate = new Map<string, Array<{
        id: string;
        name: string;
        clientName: string;
        processingTime: number;
        processingDaysBeforeEft: number;
        eftDate: string;
        status: "active" | "pending" | "completed";
        priority: "high" | "medium" | "low";
      }>>();

      // Process payroll dates and distribute processing time across working days
      allPayrolls.forEach((payroll) => {
        payroll.payrollDates?.forEach((dateEntry) => {
          if (dateEntry.adjustedEftDate) {
            const eftDate = new Date(dateEntry.adjustedEftDate);
            const processingDaysBeforeEft = payroll.processingDaysBeforeEft || 1;
            const totalProcessingTime = payroll.processingTime || 0;
            
            // Calculate the date range for processing (working backwards from EFT date)
            const processingEndDate = new Date(eftDate);
            processingEndDate.setDate(processingEndDate.getDate() - 1); // Day before EFT
            const processingStartDate = new Date(processingEndDate);
            processingStartDate.setDate(processingStartDate.getDate() - (processingDaysBeforeEft - 1));
            
            // Find all working days in the processing period for this consultant
            const workingDaysInPeriod: Array<{date: Date, dayName: string, capacity: number}> = [];
            const currentProcessingDate = new Date(processingStartDate);
            
            while (currentProcessingDate <= processingEndDate) {
              const dayName = format(currentProcessingDate, "EEEE");
              const schedule = schedules?.find((s: any) => s.workDay === dayName);
              
              // Only include days that are business days (not weekends/holidays) and have capacity
              if (schedule && 
                  (schedule.payrollCapacityHours || 0) > 0 && 
                  isBusinessDay(currentProcessingDate, [])) { // TODO: Add holiday support
                workingDaysInPeriod.push({
                  date: new Date(currentProcessingDate),
                  dayName,
                  capacity: schedule.payrollCapacityHours || 0
                });
              }
              
              currentProcessingDate.setDate(currentProcessingDate.getDate() + 1);
            }
            
            // Calculate total capacity for proportional distribution
            const totalCapacity = workingDaysInPeriod.reduce((sum, day) => sum + day.capacity, 0);
            
            // Distribute processing time proportionally across working days
            if (totalCapacity > 0) {
              workingDaysInPeriod.forEach(workDay => {
                const dateStr = format(workDay.date, "yyyy-MM-dd");
                const proportionalTime = (workDay.capacity / totalCapacity) * totalProcessingTime;
                
                if (!assignmentsByDate.has(dateStr)) {
                  assignmentsByDate.set(dateStr, []);
                }
                
                assignmentsByDate.get(dateStr)!.push({
                  id: payroll.id,
                  name: payroll.name,
                  clientName: payroll.client?.name || "Unknown Client",
                  processingTime: proportionalTime,
                  processingDaysBeforeEft: payroll.processingDaysBeforeEft || 0,
                  eftDate: dateEntry.adjustedEftDate,
                  status: mapPayrollStatus(payroll.status),
                  priority: determinePriority(payroll),
                });
              });
            }
          }
        });
      });

      // Generate work schedule days with proper date strings
      const workSchedule: WorkScheduleDay[] = schedules.map((ws) => {
        // Generate a sample date for this day of week (we'll use it for assignment lookups)
        // This is a simplified approach - in a real app, you'd generate actual calendar dates
        const dayName = ws.workDay;
        const today = new Date();
        const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
        
        // Find the date for this day of the week in current week
        let dayDate = new Date(currentWeekStart);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const targetDayIndex = dayNames.indexOf(dayName);
        
        if (targetDayIndex === 0) {
          dayDate.setDate(dayDate.getDate() + 6); // Sunday is at the end
        } else {
          dayDate.setDate(dayDate.getDate() + (targetDayIndex - 1));
        }
        
        const dateStr = format(dayDate, "yyyy-MM-dd");

        return {
          date: dateStr,
          workHours: ws.workHours || 0,
          adminTimeHours: ws.adminTimeHours || 0,
          payrollCapacityHours: ws.payrollCapacityHours || 0,
          assignments: assignmentsByDate.get(dateStr) || [],
        };
      });

      return {
        userId: user.id,
        userName: user.computedName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Unknown User",
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