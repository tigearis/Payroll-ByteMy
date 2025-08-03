import { parseISO, isSameDay, format } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { authenticateApiRequest } from "@/lib/auth/api-auth";

interface AssignmentCalendarInput {
  userId: string;
  startDate: string;
  endDate: string;
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

interface CalendarDay {
  date: string;
  workHours: number;
  adminTimeHours: number;
  payrollCapacityHours: number;
  assignments: AssignmentDetails[];
  totalAssignedHours: number;
  utilization: number;
  isOverallocated: boolean;
}

interface WorkScheduleDay {
  date: string;
  workHours: number;
  adminTimeHours: number;
  payrollCapacityHours: number;
  assignments: AssignmentDetails[];
}

async function getWorkScheduleForCalendar(
  userId: string,
  startDate: string,
  endDate: string
): Promise<WorkScheduleDay[]> {
  try {
    console.log(`📅 Fetching work schedule for calendar: user ${userId}`);
    
    // Delegate to the metrics endpoint which has real GraphQL implementation
    // Use 'day' period for calendar granularity
    const metricsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/workload/metrics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          userId,
          period: 'day', // Use daily granularity for calendar
          startDate,
          endDate
        }
      })
    });

    if (!metricsResponse.ok) {
      console.error('❌ Failed to fetch workload metrics for calendar:', metricsResponse.statusText);
      return [];
    }

    const metricsData = await metricsResponse.json();
    
    if (!metricsData.success || !metricsData.periods) {
      console.warn('⚠️ Metrics endpoint returned unsuccessful response or no periods');
      return [];
    }

    // Convert metrics data to calendar format
    const workScheduleDays: WorkScheduleDay[] = metricsData.periods.map((period: any) => ({
      date: period.date,
      workHours: period.workHours,
      adminTimeHours: period.adminTimeHours,
      payrollCapacityHours: period.payrollCapacityHours,
      assignments: period.assignments || []
    }));

    console.log(`✅ Retrieved ${workScheduleDays.length} calendar days from metrics endpoint`);
    return workScheduleDays;

  } catch (error: any) {
    console.error('❌ Error fetching work schedule for calendar:', error);
    return [];
  }
}

function processCalendarData(workSchedule: WorkScheduleDay[]): CalendarDay[] {
  return workSchedule.map(day => {
    const totalAssignedHours = day.assignments.reduce(
      (sum, assignment) => sum + assignment.processingTime,
      0
    );

    const utilization = day.payrollCapacityHours 
      ? Math.round((totalAssignedHours / day.payrollCapacityHours) * 100)
      : 0;

    return {
      date: day.date,
      workHours: day.workHours,
      adminTimeHours: day.adminTimeHours,
      payrollCapacityHours: day.payrollCapacityHours,
      assignments: day.assignments,
      totalAssignedHours,
      utilization,
      isOverallocated: utilization > 100,
    };
  });
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
    const input: AssignmentCalendarInput = body.input;

    // Validate input
    if (!input.userId || !input.startDate || !input.endDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
          errors: ["userId, startDate, and endDate are required"],
        },
        { status: 400 }
      );
    }

    // Parse and validate dates
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

    if (startDate > endDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid date range",
          errors: ["startDate must be before endDate"],
        },
        { status: 400 }
      );
    }

    // Get work schedule data from database
    const workSchedule = await getWorkScheduleForCalendar(
      input.userId,
      input.startDate,
      input.endDate
    );

    // Process data for calendar display
    const calendarDays = processCalendarData(workSchedule);

    return NextResponse.json({
      success: true,
      calendarDays,
      message: "Assignment calendar data retrieved successfully",
      errors: [],
    });

  } catch (error) {
    console.error("Error getting assignment calendar:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        errors: ["Failed to retrieve assignment calendar data"],
      },
      { status: 500 }
    );
  }
}