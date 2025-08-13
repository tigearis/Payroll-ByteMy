import { NextResponse } from "next/server";
import {
  GetLeaveDashboardStatsDocument,
  type GetLeaveDashboardStatsQuery,
} from "@/domains/leave/graphql/generated/graphql";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";

// GET /api/leave/stats - Get leave dashboard statistics
export const GET = withAuth(async req => {
  try {
    // Fetch comprehensive dashboard stats
    const statsData = await executeTypedQuery<GetLeaveDashboardStatsQuery>(
      GetLeaveDashboardStatsDocument
    );

    // Transform and calculate additional stats
    const stats = {
      overview: {
        total: statsData.totalLeave?.aggregate?.count || 0,
        pending: statsData.pendingLeave?.aggregate?.count || 0,
        approved: statsData.approvedLeave?.aggregate?.count || 0,
        rejected: statsData.rejectedLeave?.aggregate?.count || 0,
        currentLeave: statsData.currentLeave?.aggregate?.count || 0,
        upcomingLeave: statsData.upcomingLeave?.length || 0,
      },
      byType: {
        annual: statsData.byTypeAnnual?.aggregate?.count || 0,
        sick: statsData.byTypeSick?.aggregate?.count || 0,
        unpaid: statsData.byTypeUnpaid?.aggregate?.count || 0,
        other: statsData.byTypeOther?.aggregate?.count || 0,
      },
      recent: statsData.upcomingLeave || [],
      trends: {
        monthlyStats: statsData.monthlyTrends || [],
        statusDistribution: {
          pending: statsData.pendingLeave?.aggregate?.count || 0,
          approved: statsData.approvedLeave?.aggregate?.count || 0,
          rejected: statsData.rejectedLeave?.aggregate?.count || 0,
        },
      },
    };

    return NextResponse.json({
      success: true,
      stats: stats,
    });
  } catch (error) {
    console.error("Error fetching leave stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch leave statistics",
      },
      { status: 500 }
    );
  }
});
