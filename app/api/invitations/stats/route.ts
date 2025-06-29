import { NextRequest, NextResponse } from "next/server";
import {
  GetExpiringInvitationsDocument,
  GetInvitationDashboardStatsDocument,
  type GetInvitationDashboardStatsQuery,
  type GetExpiringInvitationsQuery,
} from "@/domains/users/graphql/generated/graphql";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";
import {
  auditLogger,
  LogLevel,
  SOC2EventType,
  LogCategory,
} from "@/lib/security/audit/logger";

export const GET = withAuth(async (request: NextRequest, { userId }) => {
  try {
    const { searchParams } = new URL(request.url);
    const includeExpiring = searchParams.get("includeExpiring") === "true";
    const daysUntilExpiry = searchParams.get("daysUntilExpiry") || "7";

    // Get dashboard statistics
    const statsData = await executeTypedQuery<GetInvitationDashboardStatsQuery>(
      GetInvitationDashboardStatsDocument
    );

    let expiringInvitations: any[] = [];
    if (includeExpiring) {
      const expiringData = await executeTypedQuery<GetExpiringInvitationsQuery>(
        GetExpiringInvitationsDocument,
        {
          daysUntilExpiry: `${daysUntilExpiry} days`,
        }
      );
      expiringInvitations = expiringData.userInvitations;
    }

    const response = {
      stats: {
        pending: statsData.pending.aggregate?.count,
        expired: statsData.expired.aggregate?.count,
        accepted: statsData.accepted.aggregate?.count,
        revoked: statsData.revoked.aggregate?.count,
        expiringSoon: statsData.expiringSoon.aggregate?.count,
        total: statsData.byStatus.aggregate?.count,
      },
      recentInvitations: statsData.recentInvitations,
      expiringInvitations,
      success: true,
    };

    // Log audit event
    await auditLogger.logSOC2Event({
      level: LogLevel.INFO,
      eventType: SOC2EventType.DATA_VIEWED,
      category: LogCategory.SYSTEM_ACCESS,
      complianceNote: "Invitation dashboard statistics viewed",
      success: true,
      userId,
      resourceType: "invitation_dashboard",
      action: "stats_view",
      metadata: { includeExpiring, daysUntilExpiry },
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching invitation statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitation statistics" },
      { status: 500 }
    );
  }
});
