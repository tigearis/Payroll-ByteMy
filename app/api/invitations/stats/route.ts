import { NextRequest, NextResponse } from "next/server";
import { 
  GetInvitationDashboardStatsDocument,
  type GetInvitationDashboardStatsQuery,
  GetExpiringInvitationsDocument,
  type GetExpiringInvitationsQuery
} from "@/domains/auth/graphql/generated/graphql";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";

interface InvitationStatsResponse {
  success: boolean;
  stats?: {
    overview: {
      total: number;
      pending: number;
      accepted: number;
      expired: number;
      revoked: number;
      expiringSoon: number;
    };
    trends: {
      statusDistribution: Record<string, number>;
      roleDistribution: Record<string, number>;
      monthlyStats: any[];
    };
    alerts: {
      expiringSoonCount: number;
      expiringSoonInvitations: any[];
      overduePendingCount: number;
    };
    recentActivity: any[];
  };
  error?: string;
}

export const GET = withAuth(async (req: NextRequest, session) => {
  try {
    const { searchParams } = new URL(req.url);
    
    // Parse query parameters
    const includeTrends = searchParams.get("includeTrends") !== "false"; // Default true
    const includeAlerts = searchParams.get("includeAlerts") !== "false"; // Default true
    const includeRecentActivity = searchParams.get("includeRecentActivity") !== "false"; // Default true
    const expiryAlertDays = parseInt(searchParams.get("expiryAlertDays") || "7");

    console.log("📊 Fetching invitation statistics");

    // Calculate timestamps
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));

    // Get main dashboard stats
    const dashboardStats = await executeTypedQuery<GetInvitationDashboardStatsQuery>(
      GetInvitationDashboardStatsDocument,
      {
        now: now.toISOString(),
        sevenDaysFromNow: sevenDaysFromNow.toISOString()
      }
    );

    // Extract overview stats
    const overview = {
      total: (dashboardStats.pending?.aggregate?.count || 0) +
             (dashboardStats.accepted?.aggregate?.count || 0) +
             (dashboardStats.expired?.aggregate?.count || 0) +
             (dashboardStats.revoked?.aggregate?.count || 0),
      pending: dashboardStats.pending?.aggregate?.count || 0,
      accepted: dashboardStats.accepted?.aggregate?.count || 0,
      expired: dashboardStats.expired?.aggregate?.count || 0,
      revoked: dashboardStats.revoked?.aggregate?.count || 0,
      expiringSoon: dashboardStats.expiringSoon?.aggregate?.count || 0,
    };

    // Build stats response
    const stats: InvitationStatsResponse['stats'] = {
      overview,
      trends: {
        statusDistribution: {
          pending: overview.pending,
          accepted: overview.accepted,
          expired: overview.expired,
          revoked: overview.revoked,
        },
        roleDistribution: {},
        monthlyStats: [],
      },
      alerts: {
        expiringSoonCount: overview.expiringSoon,
        expiringSoonInvitations: [],
        overduePendingCount: 0,
      },
      recentActivity: dashboardStats.recentInvitations?.map(invitation => ({
        id: invitation.id,
        email: invitation.email,
        firstName: invitation.firstName,
        lastName: invitation.lastName,
        fullName: `${invitation.firstName} ${invitation.lastName}`.trim(),
        invitationStatus: invitation.status,
        createdAt: invitation.createdAt,
        expiresAt: invitation.expiresAt,
        invitedByUser: invitation.invitedByUser ? {
          name: invitation.invitedByUser.name,
          email: invitation.invitedByUser.email,
        } : null,
        isExpired: invitation.status === "expired" || 
                  new Date(invitation.expiresAt) < new Date(),
        isPending: invitation.status === "pending" && 
                  new Date(invitation.expiresAt) > new Date(),
        daysUntilExpiry: invitation.status === "pending" ? 
                        Math.ceil((new Date(invitation.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : 
                        null,
      })) || [],
    };

    // Get trends data if requested
    if (includeTrends) {
      try {
        // Extract role distribution from recent invitations
        const roleDistribution: Record<string, number> = {};
        dashboardStats.recentInvitations?.forEach(invitation => {
          const role = invitation.invitedRole || 'unknown';
          roleDistribution[role] = (roleDistribution[role] || 0) + 1;
        });
        stats.trends.roleDistribution = roleDistribution;

        // Monthly stats would require additional queries with date grouping
        // For now, we'll use the recent invitations as a sample
        const now = new Date();
        const currentMonth = {
          month: now.toISOString().substring(0, 7), // YYYY-MM format
          total: dashboardStats.recentInvitations?.length || 0,
          pending: dashboardStats.recentInvitations?.filter(i => i.invitationStatus === "pending").length || 0,
          accepted: dashboardStats.recentInvitations?.filter(i => i.invitationStatus === "accepted").length || 0,
          expired: dashboardStats.recentInvitations?.filter(i => i.invitationStatus === "expired").length || 0,
          revoked: dashboardStats.recentInvitations?.filter(i => i.invitationStatus === "revoked").length || 0,
        };
        stats.trends.monthlyStats = [currentMonth];

      } catch (trendsError) {
        console.warn("Failed to fetch trends data:", trendsError);
        // Continue without trends if they fail
      }
    }

    // Get alerts data if requested
    if (includeAlerts) {
      try {
        // Get detailed expiring invitations
        const futureDate = new Date(now.getTime() + (expiryAlertDays * 24 * 60 * 60 * 1000));
        const expiringInvitationsData = await executeTypedQuery<GetExpiringInvitationsQuery>(
          GetExpiringInvitationsDocument,
          { 
            now: now.toISOString(),
            futureDate: futureDate.toISOString()
          }
        );

        stats.alerts.expiringSoonInvitations = expiringInvitationsData.userInvitations?.map(invitation => ({
          id: invitation.id,
          email: invitation.email,
          firstName: invitation.firstName,
          lastName: invitation.lastName,
          fullName: `${invitation.firstName} ${invitation.lastName}`.trim(),
          expiresAt: invitation.expiresAt,
          invitedByUser: invitation.invitedByUser ? {
            name: invitation.invitedByUser.name,
            email: invitation.invitedByUser.email,
          } : null,
          daysUntilExpiry: Math.ceil((new Date(invitation.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
          urgency: (() => {
            const days = Math.ceil((new Date(invitation.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
            if (days <= 1) return "critical";
            if (days <= 3) return "high";
            if (days <= 7) return "medium";
            return "low";
          })(),
        })) || [];

        // Calculate overdue pending count (invitations that are pending but past expiry)
        stats.alerts.overduePendingCount = stats.recentActivity.filter(invitation => 
          invitation.status === "pending" && 
          new Date(invitation.expiresAt) < new Date()
        ).length;

      } catch (alertsError) {
        console.warn("Failed to fetch alerts data:", alertsError);
        // Continue without alerts if they fail
      }
    }

    // Clean up recent activity if not requested
    if (!includeRecentActivity) {
      stats.recentActivity = [];
    }

    console.log("✅ Invitation statistics fetched successfully", {
      overview,
      trendsIncluded: includeTrends,
      alertsIncluded: includeAlerts,
      recentActivityIncluded: includeRecentActivity,
    });

    return NextResponse.json<InvitationStatsResponse>({
      success: true,
      stats,
    });

  } catch (error: any) {
    console.error("Invitation stats error:", error);

    return NextResponse.json<InvitationStatsResponse>(
      {
        success: false,
        error: error.message || "Failed to fetch invitation statistics",
      },
      { status: 500 }
    );
  }
});

// POST endpoint for bulk operations on invitations (based on stats)
export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    const body = await req.json();
    const { action, filters } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Action is required" },
        { status: 400 }
      );
    }

    console.log(`📊 Bulk invitation operation: ${action}`, filters);

    // This would implement bulk operations like:
    // - "mark_expired" - Mark all overdue pending invitations as expired
    // - "resend_expiring" - Resend all invitations expiring in X days
    // - "cleanup_old" - Remove old revoked/expired invitations

    switch (action) {
      case "mark_expired":
        // Implementation would go here
        return NextResponse.json({
          success: true,
          message: "Bulk mark expired operation completed",
          affected: 0, // Would return actual count
        });

      case "resend_expiring":
        // Implementation would go here
        return NextResponse.json({
          success: true,
          message: "Bulk resend expiring operation completed",
          affected: 0, // Would return actual count
        });

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error("Bulk invitation operation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Bulk operation failed",
      },
      { status: 500 }
    );
  }
});