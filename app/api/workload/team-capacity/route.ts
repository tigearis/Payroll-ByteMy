import { NextRequest, NextResponse } from "next/server";
import { authenticateApiRequest } from "@/lib/auth/api-auth";
// import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

interface TeamCapacityInput {
  teamIds: string[];
  period: "day" | "week" | "month";
  startDate: string;
  endDate: string;
}

interface WorkloadMetricsResponse {
  success: boolean;
  periods: WorkloadPeriodData[];
  summary: CapacitySummary;
  message?: string;
  errors: string[];
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

async function getTeamMembersWorkload(
  teamIds: string[],
  period: "day" | "week" | "month",
  startDate: string,
  endDate: string
): Promise<
  {
    userId: string;
    userName: string;
    userRole: string;
    workloadData: WorkloadMetricsResponse;
  }[]
> {
  try {
    console.log(`👥 Fetching team workload data for ${teamIds.length} members`);

    const teamMembersWorkload = [];

    // For each team member, fetch their individual workload data
    for (const userId of teamIds) {
      try {
        // Call the metrics endpoint which has real GraphQL implementation
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
            `❌ Failed to fetch workload metrics for user ${userId}:`,
            metricsResponse.statusText
          );
          continue;
        }

        const metricsData = await metricsResponse.json();

        // Create a placeholder name - in a real implementation, this would come from user data
        const userName = `User ${userId.substring(0, 8)}`;
        const userRole = "consultant"; // Default role

        teamMembersWorkload.push({
          userId,
          userName,
          userRole,
          workloadData: metricsData,
        });

        console.log(`✅ Retrieved workload data for user ${userId}`);
      } catch (userError: any) {
        console.error(
          `❌ Error fetching workload for user ${userId}:`,
          userError
        );
        continue;
      }
    }

    console.log(
      `✅ Retrieved workload data for ${teamMembersWorkload.length} team members`
    );
    return teamMembersWorkload;
  } catch (error: any) {
    console.error("❌ Error fetching team workload data:", error);
    return [];
  }
}

function calculateTeamSummary(
  teamMembers: { workloadData: WorkloadMetricsResponse }[]
): CapacitySummary {
  let totalCapacity = 0;
  let totalAssigned = 0;
  let totalUtilization = 0;
  let totalOverallocatedPeriods = 0;
  let totalPeriods = 0;
  let validMembers = 0;

  for (const member of teamMembers) {
    if (member.workloadData.success) {
      totalCapacity += member.workloadData.summary.totalCapacity;
      totalAssigned += member.workloadData.summary.totalAssigned;
      totalUtilization += member.workloadData.summary.avgUtilization;
      totalOverallocatedPeriods +=
        member.workloadData.summary.overallocatedPeriods;
      totalPeriods = Math.max(
        totalPeriods,
        member.workloadData.summary.periodsShown
      );
      validMembers++;
    }
  }

  return {
    totalCapacity: Math.round(totalCapacity),
    totalAssigned: Math.round(totalAssigned * 10) / 10,
    avgUtilization:
      validMembers > 0 ? Math.round(totalUtilization / validMembers) : 0,
    overallocatedPeriods: totalOverallocatedPeriods,
    periodsShown: totalPeriods,
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
    const input: TeamCapacityInput = body.input;

    // Validate input
    if (
      !input.teamIds ||
      !Array.isArray(input.teamIds) ||
      input.teamIds.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing or invalid teamIds",
          errors: ["teamIds must be a non-empty array of user IDs"],
        },
        { status: 400 }
      );
    }

    if (!input.period || !input.startDate || !input.endDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
          errors: ["period, startDate, and endDate are required"],
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

    // Get workload data for all team members
    const teamMembersWorkload = await getTeamMembersWorkload(
      input.teamIds,
      input.period,
      input.startDate,
      input.endDate
    );

    // Calculate team summary
    const teamSummary = calculateTeamSummary(teamMembersWorkload);

    // Extract individual member responses
    const teamMembers = teamMembersWorkload.map(member => member.workloadData);

    return NextResponse.json({
      success: true,
      teamMembers,
      teamSummary,
      message: "Team capacity overview calculated successfully",
      errors: [],
    });
  } catch (error) {
    console.error("Error calculating team capacity:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        errors: ["Failed to calculate team capacity overview"],
      },
      { status: 500 }
    );
  }
}
