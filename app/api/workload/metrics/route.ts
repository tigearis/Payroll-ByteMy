import { format, parseISO, isSameDay, isSameWeek, isSameMonth, startOfWeek, addDays, startOfMonth, addWeeks } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { authenticateApiRequest } from "@/lib/auth/api-auth";

interface WorkloadMetricsInput {
  userId: string;
  period: "day" | "week" | "month";
  startDate: string;
  endDate: string;
}

interface WorkScheduleDay {
  date: string;
  workHours: number;
  adminTimeHours: number;
  payrollCapacityHours: number;
  assignments: AssignmentDetails[];
}

interface AssignmentDetails {
  id: string;
  name: string;
  clientName: string;
  processingTime: number;
  processingDaysBeforeEft: number;
  eftDate: string;
  status: "active" | "pending" | "completed";
  priority: "high" | "medium" | "low";
}

interface WorkloadPeriodData {
  date: string;
  period: string;
  fullDate: string;
  workHours: number;
  adminTimeHours: number;
  payrollCapacityHours: number;
  assignedHours: number;
  utilization: number;
  utilizationHours: number;
  overflowHours: number;
  assignments: AssignmentDetails[];
  isOverallocated: boolean;
}

interface CapacitySummary {
  totalCapacity: number;
  totalAssigned: number;
  avgUtilization: number;
  overallocatedPeriods: number;
  periodsShown: number;
}

async function getWorkScheduleData(userId: string, startDate: string, endDate: string): Promise<WorkScheduleDay[]> {
  // TODO: Replace with actual database query
  // This would typically query the work_schedule table joined with assignments
  // For now, returning mock data structure
  return [];
}

function aggregateDataByPeriod(
  workSchedule: WorkScheduleDay[],
  period: "day" | "week" | "month",
  startDate: Date,
  endDate: Date
): WorkloadPeriodData[] {
  const data: WorkloadPeriodData[] = [];
  const currentDate = new Date(startDate);

  if (period === "day") {
    // Daily aggregation
    while (currentDate <= endDate) {
      const dayData = workSchedule.find(ws => isSameDay(parseISO(ws.date), currentDate));
      
      const totalAssignedHours = dayData?.assignments?.reduce(
        (sum, assignment) => sum + assignment.processingTime,
        0
      ) || 0;

      const capacity = dayData?.payrollCapacityHours || 0;
      const utilization = capacity ? Math.round((totalAssignedHours / capacity) * 100) : 0;

      data.push({
        date: format(currentDate, "EEEE, MMM dd"),
        period: format(currentDate, "EEEE, MMM dd"),
        fullDate: format(currentDate, "yyyy-MM-dd"),
        workHours: dayData?.workHours || 0,
        adminTimeHours: dayData?.adminTimeHours || 0,
        payrollCapacityHours: capacity,
        assignedHours: totalAssignedHours,
        utilization,
        utilizationHours: Math.min(totalAssignedHours, capacity),
        overflowHours: Math.max(0, totalAssignedHours - capacity),
        assignments: dayData?.assignments || [],
        isOverallocated: utilization > 100,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
  } else if (period === "week") {
    // Weekly aggregation
    let weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    
    while (weekStart <= endDate) {
      const weekData: WorkloadPeriodData = {
        date: format(weekStart, "EEE dd"),
        period: format(weekStart, "EEE dd"),
        fullDate: format(weekStart, "yyyy-MM-dd"),
        workHours: 0,
        adminTimeHours: 0,
        payrollCapacityHours: 0,
        assignedHours: 0,
        utilization: 0,
        utilizationHours: 0,
        overflowHours: 0,
        assignments: [],
        isOverallocated: false,
      };

      // Aggregate week data
      for (let i = 0; i < 7; i++) {
        const date = addDays(weekStart, i);
        const dayData = workSchedule.find(ws => isSameDay(parseISO(ws.date), date));
        
        if (dayData) {
          weekData.workHours += dayData.workHours;
          weekData.adminTimeHours += dayData.adminTimeHours;
          weekData.payrollCapacityHours += dayData.payrollCapacityHours;
          weekData.assignments.push(...dayData.assignments);
        }
      }

      weekData.assignedHours = weekData.assignments.reduce(
        (sum, assignment) => sum + assignment.processingTime,
        0
      );
      
      weekData.utilization = weekData.payrollCapacityHours 
        ? Math.round((weekData.assignedHours / weekData.payrollCapacityHours) * 100)
        : 0;
      
      weekData.utilizationHours = Math.min(weekData.assignedHours, weekData.payrollCapacityHours);
      weekData.overflowHours = Math.max(0, weekData.assignedHours - weekData.payrollCapacityHours);
      weekData.isOverallocated = weekData.utilization > 100;

      data.push(weekData);
      weekStart = addWeeks(weekStart, 1);
    }
  } else if (period === "month") {
    // Monthly aggregation - group by weeks within months
    const monthStart = startOfMonth(currentDate);
    let currentWeek = startOfWeek(monthStart, { weekStartsOn: 1 });
    
    while (currentWeek <= endDate) {
      const weekEnd = addDays(currentWeek, 6);
      
      const weekData = workSchedule.filter(ws => {
        const wsDate = parseISO(ws.date);
        return (
          isSameWeek(wsDate, currentWeek, { weekStartsOn: 1 }) &&
          isSameMonth(wsDate, currentDate)
        );
      });

      const totalWorkHours = weekData.reduce((sum, day) => sum + day.workHours, 0);
      const totalAdminHours = weekData.reduce((sum, day) => sum + day.adminTimeHours, 0);
      const totalCapacityHours = weekData.reduce((sum, day) => sum + day.payrollCapacityHours, 0);
      const allAssignments = weekData.flatMap(day => day.assignments || []);
      const totalAssignedHours = allAssignments.reduce(
        (sum, assignment) => sum + assignment.processingTime,
        0
      );

      const utilization = totalCapacityHours
        ? Math.round((totalAssignedHours / totalCapacityHours) * 100)
        : 0;

      const weekStartInMonth = currentWeek < monthStart ? monthStart : currentWeek;
      const weekEndInMonth = weekEnd > new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0) 
        ? new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0) 
        : weekEnd;

      data.push({
        date: `${format(weekStartInMonth, "d")}-${format(weekEndInMonth, "d")}`,
        period: `${format(weekStartInMonth, "d")}-${format(weekEndInMonth, "d")}`,
        fullDate: format(currentWeek, "yyyy-MM-dd"),
        workHours: totalWorkHours,
        adminTimeHours: totalAdminHours,
        payrollCapacityHours: totalCapacityHours,
        assignedHours: totalAssignedHours,
        utilization,
        utilizationHours: Math.min(totalAssignedHours, totalCapacityHours),
        overflowHours: Math.max(0, totalAssignedHours - totalCapacityHours),
        assignments: allAssignments,
        isOverallocated: utilization > 100,
      });

      currentWeek = addWeeks(currentWeek, 1);
    }
  }

  return data;
}

function calculateSummary(periods: WorkloadPeriodData[]): CapacitySummary {
  const totalCapacity = Math.round(
    periods.reduce((sum, item) => sum + item.payrollCapacityHours, 0)
  );
  
  const totalAssigned = Math.round(
    periods.reduce((sum, item) => sum + item.assignedHours, 0) * 10
  ) / 10;
  
  const avgUtilization = periods.length > 0
    ? Math.round(
        periods.reduce((sum, item) => sum + item.utilization, 0) / periods.length
      )
    : 0;
  
  const overallocatedPeriods = periods.filter(item => item.utilization > 100).length;

  return {
    totalCapacity,
    totalAssigned,
    avgUtilization,
    overallocatedPeriods,
    periodsShown: periods.length,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const authResult = await authenticateApiRequest(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", errors: ["Authentication failed"] },
        { status: 401 }
      );
    }

    const body = await request.json();
    const input: WorkloadMetricsInput = body.input;

    // Validate input
    if (!input.userId || !input.period || !input.startDate || !input.endDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
          errors: ["userId, period, startDate, and endDate are required"],
        },
        { status: 400 }
      );
    }

    // Validate period
    if (!["day", "week", "month"].includes(input.period)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid period",
          errors: ["Period must be one of: day, week, month"],
        },
        { status: 400 }
      );
    }

    // Parse dates
    const startDate = parseISO(input.startDate);
    const endDate = parseISO(input.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid date format",
          errors: ["startDate and endDate must be valid ISO date strings"],
        },
        { status: 400 }
      );
    }

    // Get work schedule data from database
    const workSchedule = await getWorkScheduleData(input.userId, input.startDate, input.endDate);

    // Aggregate data by period
    const periods = aggregateDataByPeriod(workSchedule, input.period, startDate, endDate);

    // Calculate summary statistics
    const summary = calculateSummary(periods);

    return NextResponse.json({
      success: true,
      periods,
      summary,
      message: "Workload metrics calculated successfully",
      errors: [],
    });

  } catch (error) {
    console.error("Error calculating workload metrics:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        errors: ["Failed to calculate workload metrics"],
      },
      { status: 500 }
    );
  }
}