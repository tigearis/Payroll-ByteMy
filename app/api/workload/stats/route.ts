import { parseISO } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { authenticateApiRequest } from "@/lib/auth/api-auth";
// import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

interface UtilizationStatsInput {
  userId: string;
  period: "day" | "week" | "month";
  startDate: string;
  endDate: string;
}

interface CapacitySummary {
  totalCapacity: number;
  totalAssigned: number;
  avgUtilization: number;
  overallocatedPeriods: number;
  periodsShown: number;
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

async function getWorkloadDataForStats(
  userId: string,
  period: "day" | "week" | "month",
  startDate: string,
  endDate: string
): Promise<WorkloadPeriodData[]> {
  try {
    console.log(
      `📊 Fetching workload data for stats: user ${userId}, period ${period}`
    );

    // Delegate to the metrics endpoint which has real GraphQL implementation
    const metricsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/workload/metrics`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            userId,
            period,
            startDate,
            endDate,
          },
        }),
      }
    );

    if (!metricsResponse.ok) {
      console.error(
        "❌ Failed to fetch workload metrics:",
        metricsResponse.statusText
      );
      return [];
    }

    const metricsData = await metricsResponse.json();

    if (!metricsData.success || !metricsData.periods) {
      console.warn(
        "⚠️ Metrics endpoint returned unsuccessful response or no periods"
      );
      return [];
    }

    console.log(
      `✅ Retrieved ${metricsData.periods.length} periods from metrics endpoint`
    );
    return metricsData.periods;
  } catch (error: any) {
    console.error("❌ Error fetching workload data for stats:", error);
    return [];
  }
}

function calculateDetailedStats(periods: WorkloadPeriodData[]): {
  summary: CapacitySummary;
  overallocatedPeriods: number;
  averageUtilization: number;
  utilizationTrend: "increasing" | "decreasing" | "stable";
  peakUtilization: number;
  minUtilization: number;
  capacityEfficiency: number;
} {
  if (periods.length === 0) {
    return {
      summary: {
        totalCapacity: 0,
        totalAssigned: 0,
        avgUtilization: 0,
        overallocatedPeriods: 0,
        periodsShown: 0,
      },
      overallocatedPeriods: 0,
      averageUtilization: 0,
      utilizationTrend: "stable",
      peakUtilization: 0,
      minUtilization: 0,
      capacityEfficiency: 0,
    };
  }

  // Calculate basic summary
  const totalCapacity = Math.round(
    periods.reduce((sum, item) => sum + item.payrollCapacityHours, 0)
  );

  const totalAssigned =
    Math.round(
      periods.reduce((sum, item) => sum + item.assignedHours, 0) * 10
    ) / 10;

  const avgUtilization = Math.round(
    periods.reduce((sum, item) => sum + item.utilization, 0) / periods.length
  );

  const overallocatedPeriods = periods.filter(
    item => item.utilization > 100
  ).length;

  const summary: CapacitySummary = {
    totalCapacity,
    totalAssigned,
    avgUtilization,
    overallocatedPeriods,
    periodsShown: periods.length,
  };

  // Calculate additional metrics
  const utilizationValues = periods.map(p => p.utilization);
  const peakUtilization = Math.max(...utilizationValues);
  const minUtilization = Math.min(...utilizationValues);

  // Calculate utilization trend (simple linear trend)
  let utilizationTrend: "increasing" | "decreasing" | "stable" = "stable";
  if (periods.length >= 3) {
    const firstHalf = utilizationValues.slice(
      0,
      Math.floor(periods.length / 2)
    );
    const secondHalf = utilizationValues.slice(Math.ceil(periods.length / 2));

    const firstHalfAvg =
      firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondHalfAvg =
      secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

    const trendThreshold = 5; // 5% threshold for trend detection
    if (secondHalfAvg > firstHalfAvg + trendThreshold) {
      utilizationTrend = "increasing";
    } else if (secondHalfAvg < firstHalfAvg - trendThreshold) {
      utilizationTrend = "decreasing";
    }
  }

  // Calculate capacity efficiency (how well capacity is being utilized without overallocation)
  const efficientPeriods = periods.filter(
    p => p.utilization > 0 && p.utilization <= 100
  );
  const capacityEfficiency =
    efficientPeriods.length > 0
      ? Math.round(
          efficientPeriods.reduce((sum, p) => sum + p.utilization, 0) /
            efficientPeriods.length
        )
      : 0;

  return {
    summary,
    overallocatedPeriods,
    averageUtilization: avgUtilization,
    utilizationTrend,
    peakUtilization,
    minUtilization,
    capacityEfficiency,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const authResult = await authenticateApiRequest(request);
    if (!authResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
          errors: ["Authentication failed"],
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const input: UtilizationStatsInput = body.input;

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

    // Get workload data
    const periods = await getWorkloadDataForStats(
      input.userId,
      input.period,
      input.startDate,
      input.endDate
    );

    // Calculate detailed statistics
    const stats = calculateDetailedStats(periods);

    return NextResponse.json({
      success: true,
      summary: stats.summary,
      overallocatedPeriods: stats.overallocatedPeriods,
      averageUtilization: stats.averageUtilization,
      utilizationTrend: stats.utilizationTrend,
      peakUtilization: stats.peakUtilization,
      minUtilization: stats.minUtilization,
      capacityEfficiency: stats.capacityEfficiency,
      message: "Utilization statistics calculated successfully",
      errors: [],
    });
  } catch (error) {
    console.error("Error calculating utilization stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        errors: ["Failed to calculate utilization statistics"],
      },
      { status: 500 }
    );
  }
}
