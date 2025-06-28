import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import {
  auditLogger,
  LogLevel,
  SOC2EventType,
  LogCategory,
} from "@/lib/security/audit/logger";
import {
  GetExpiringInvitationsDocument,
  GetInvitationDashboardStatsDocument,
} from "@/domains/users/graphql/generated/graphql";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeExpiring = searchParams.get("includeExpiring") === "true";
    const daysUntilExpiry = searchParams.get("daysUntilExpiry") || "7";

    // Get dashboard statistics
    const { data: statsData } = await adminApolloClient.query({
      query: GetInvitationDashboardStatsDocument,
    });

    let expiringInvitations: any[] = [];
    if (includeExpiring) {
      const { data: expiringData } = await adminApolloClient.query({
        query: GetExpiringInvitationsDocument,
        variables: {
          daysUntilExpiry: `${daysUntilExpiry} days`,
        },
      });
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
}
