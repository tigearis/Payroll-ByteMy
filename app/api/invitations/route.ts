import { NextRequest, NextResponse } from "next/server";
import { 
  GetInvitationsWithStatusDocument,
  type GetInvitationsWithStatusQuery,
  SearchInvitationsDocument,
  type SearchInvitationsQuery,
  GetInvitationDashboardStatsDocument,
  type GetInvitationDashboardStatsQuery
} from "@/domains/auth/graphql/generated/graphql";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";

type InvitationStatus = "pending" | "accepted" | "expired" | "revoked";

interface InvitationFilters {
  search?: string;
  statuses?: InvitationStatus[];
  roles?: string[];
  invitedBy?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface InvitationListRequest {
  page?: number;
  limit?: number;
  filters?: InvitationFilters;
  orderBy?: "email" | "firstName" | "lastName" | "invitedRole" | "createdAt" | "expiresAt";
  orderDirection?: "ASC" | "DESC";
  includeStats?: boolean;
}

interface InvitationListResponse {
  success: boolean;
  data?: {
    invitations: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    stats?: any;
  };
  error?: string;
}

export const GET = withAuth(async (req: NextRequest, session) => {
  try {
    const { searchParams } = new URL(req.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100); // Cap at 100
    const search = searchParams.get("search") || undefined;
    const statuses = searchParams.get("statuses")?.split(",").filter(Boolean) as InvitationStatus[] || [];
    const roles = searchParams.get("roles")?.split(",").filter(Boolean) || [];
    const invitedBy = searchParams.get("invitedBy") || undefined;
    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;
    const orderBy = (searchParams.get("orderBy") as any) || "createdAt";
    const orderDirection = (searchParams.get("orderDirection") as any) || "DESC";
    const includeStats = searchParams.get("includeStats") === "true";

    // Calculate offset
    const offset = (page - 1) * limit;

    // Set default statuses if none provided
    const defaultStatuses: InvitationStatus[] = ["pending", "accepted", "expired", "revoked"];
    const queryStatuses = statuses.length > 0 ? statuses : defaultStatuses;

    // Build order by clause
    const orderByClause = [{ [orderBy]: orderDirection }];

    let invitationData;
    let statsData = null;

    if (search) {
      // Use search query if search term provided
      const searchTerm = `%${search}%`;
      
      invitationData = await executeTypedQuery<SearchInvitationsQuery>(
        SearchInvitationsDocument,
        {
          searchTerm,
          limit,
        }
      );
    } else {
      // Use regular invitation listing with filters
      invitationData = await executeTypedQuery<GetInvitationsWithStatusQuery>(
        GetInvitationsWithStatusDocument,
        {
          statuses: queryStatuses,
          limit,
          offset,
          orderBy: orderByClause,
        }
      );
    }

    // Get stats if requested
    if (includeStats) {
      try {
        // Calculate timestamps for stats query
        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
        
        statsData = await executeTypedQuery<GetInvitationDashboardStatsQuery>(
          GetInvitationDashboardStatsDocument,
          {
            now: now.toISOString(),
            sevenDaysFromNow: sevenDaysFromNow.toISOString()
          }
        );
      } catch (statsError) {
        console.warn("Failed to fetch invitation stats:", statsError);
        // Continue without stats if they fail
      }
    }

    // Extract invitations and total count
    const invitations = search ? 
      (invitationData as SearchInvitationsQuery).userInvitations || [] :
      (invitationData as GetInvitationsWithStatusQuery).userInvitations || [];
    
    const totalCount = search ?
      invitations.length : // Search doesn't provide aggregate count easily
      (invitationData as GetInvitationsWithStatusQuery).userInvitationsAggregate?.aggregate?.count || 0;

    const totalPages = Math.ceil(totalCount / limit);

    // Apply additional client-side filters if using search
    let filteredInvitations = invitations;
    
    if (search) {
      // Apply status filter
      if (statuses.length > 0) {
        filteredInvitations = filteredInvitations.filter(inv => 
          statuses.includes(inv.invitationStatus as InvitationStatus)
        );
      }
      
      // Apply role filter
      if (roles.length > 0) {
        filteredInvitations = filteredInvitations.filter(inv => 
          roles.includes(inv.invitedRole)
        );
      }
      
      // Apply date filters
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        filteredInvitations = filteredInvitations.filter(inv => 
          new Date(inv.createdAt) >= fromDate
        );
      }
      
      if (dateTo) {
        const toDate = new Date(dateTo);
        filteredInvitations = filteredInvitations.filter(inv => 
          new Date(inv.createdAt) <= toDate
        );
      }
      
      // Apply invited by filter
      if (invitedBy) {
        filteredInvitations = filteredInvitations.filter(inv => 
          inv.invitedBy === invitedBy
        );
      }
      
      // Apply pagination to filtered results
      const startIndex = offset;
      const endIndex = startIndex + limit;
      filteredInvitations = filteredInvitations.slice(startIndex, endIndex);
    }

    // Format response
    const response: InvitationListResponse = {
      success: true,
      data: {
        invitations: filteredInvitations.map(invitation => ({
          id: invitation.id,
          email: invitation.email,
          firstName: invitation.firstName,
          lastName: invitation.lastName,
          fullName: `${invitation.firstName} ${invitation.lastName}`.trim(),
          invitedRole: invitation.invitedRole,
          invitationStatus: invitation.invitationStatus,
          status: invitation.invitationStatus, // Legacy field mapped from invitationStatus
          invitedAt: invitation.createdAt,
          expiresAt: invitation.expiresAt,
          revokedAt: invitation.revokedAt,
          revokeReason: invitation.revokeReason,
          managerId: invitation.managerId,
          clerkInvitationId: invitation.clerkInvitationId,
          createdAt: invitation.createdAt,
          updatedAt: invitation.updatedAt,
          acceptedAt: invitation.acceptedAt,
          resendCount: 0, // TODO: Implement resend count tracking
          invitedByUser: invitation.invitedByUser ? {
            id: invitation.invitedByUser.id,
            firstName: invitation.invitedByUser.firstName,
            lastName: invitation.invitedByUser.lastName,
            computedName: invitation.invitedByUser.computedName,
            email: invitation.invitedByUser.email,
            role: invitation.invitedByUser.role,
          } : null,
          managerUser: invitation.managerUser ? {
            id: invitation.managerUser.id,
            firstName: invitation.managerUser.firstName,
            lastName: invitation.managerUser.lastName,
            computedName: invitation.managerUser.computedName,
            email: invitation.managerUser.email,
            role: invitation.managerUser.role,
          } : null,
          
          // Computed fields
          isExpired: invitation.invitationStatus === "expired" || 
                    new Date(invitation.expiresAt) < new Date(),
          isPending: invitation.invitationStatus === "pending" && 
                    new Date(invitation.expiresAt) > new Date(),
          isExpiringSoon: invitation.invitationStatus === "pending" && 
                         new Date(invitation.expiresAt) > new Date() &&
                         new Date(invitation.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          daysUntilExpiry: invitation.invitationStatus === "pending" ? 
                          Math.ceil((new Date(invitation.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : 
                          null,
          urgency: (() => {
            if (invitation.invitationStatus !== "pending") return null;
            const days = Math.ceil((new Date(invitation.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
            if (days <= 1) return "critical";
            if (days <= 3) return "high";
            if (days <= 7) return "medium";
            return "low";
          })(),
        })),
        total: search ? filteredInvitations.length : totalCount,
        page,
        limit,
        totalPages: search ? Math.ceil(filteredInvitations.length / limit) : totalPages,
        ...(statsData && { stats: formatInvitationStatsData(statsData) }),
      },
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error("Invitation listing error:", error);

    return NextResponse.json<InvitationListResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch invitation list",
      },
      { status: 500 }
    );
  }
});

// Helper function to format invitation stats data
function formatInvitationStatsData(statsData: GetInvitationDashboardStatsQuery) {
  const overview = {
    total: (statsData.pending?.aggregate?.count || 0) +
           (statsData.accepted?.aggregate?.count || 0) +
           (statsData.expired?.aggregate?.count || 0) +
           (statsData.revoked?.aggregate?.count || 0),
    pending: statsData.pending?.aggregate?.count || 0,
    accepted: statsData.accepted?.aggregate?.count || 0,
    expired: statsData.expired?.aggregate?.count || 0,
    revoked: statsData.revoked?.aggregate?.count || 0,
    expiringSoon: statsData.expiringSoon?.aggregate?.count || 0,
  };

  return {
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
    recentActivity: statsData.recentInvitations?.map(invitation => ({
      id: invitation.id,
      email: invitation.email,
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      fullName: `${invitation.firstName} ${invitation.lastName}`.trim(),
      invitationStatus: invitation.invitationStatus,
      createdAt: invitation.createdAt,
      expiresAt: invitation.expiresAt,
      invitedByUser: invitation.invitedByUser ? {
        name: invitation.invitedByUser.computedName || `${invitation.invitedByUser.firstName} ${invitation.invitedByUser.lastName}`.trim(),
        email: invitation.invitedByUser.email,
      } : null,
      isExpired: invitation.invitationStatus === "expired" || 
                new Date(invitation.expiresAt) < new Date(),
      isPending: invitation.invitationStatus === "pending" && 
                new Date(invitation.expiresAt) > new Date(),
      daysUntilExpiry: invitation.invitationStatus === "pending" ? 
                      Math.ceil((new Date(invitation.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : 
                      null,
    })) || [],
  };
}