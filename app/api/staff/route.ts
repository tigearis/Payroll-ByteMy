import { NextRequest, NextResponse } from "next/server";
import {
  GetUserStatusDashboardStatsDocument,
  type GetUserStatusDashboardStatsQuery
} from "@/domains/auth/graphql/generated/graphql";
import { 
  GetStaffPaginatedDocument,
  type GetStaffPaginatedQuery,
  GetAllUsersPaginatedDocument,
  type GetAllUsersPaginatedQuery,
  SearchUsersPaginatedDocument,
  type SearchUsersPaginatedQuery
} from "@/domains/users/graphql/generated/graphql";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import { requireStaffAccess } from "@/lib/permissions/api-permission-guard";

interface StaffFilters {
  search?: string;
  roles?: string[];
  statuses?: string[];
  isActive?: boolean;
  managerId?: string;
}

interface StaffListRequest {
  page?: number;
  limit?: number;
  filters?: StaffFilters;
  orderBy?: "name" | "email" | "role" | "createdAt" | "updatedAt";
  orderDirection?: "ASC" | "DESC";
  includeStats?: boolean;
}

interface StaffListResponse {
  success: boolean;
  data?: {
    users: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    stats?: any;
  };
  error?: string;
}

export async function GET(req: NextRequest) {
  // Use simple auth check instead of complex permission system
  const { auth } = await import("@clerk/nextjs/server");
  const { userId, getToken } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get role from JWT
  let role = 'viewer';
  try {
    const token = await getToken({ template: "hasura" });
    if (token) {
      const base64Payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(base64Payload));
      const hasuraClaims = decodedPayload['https://hasura.io/jwt/claims'];
      
      // Use the x-hasura-role or default-role
      role = hasuraClaims?.['x-hasura-role'] || hasuraClaims?.['x-hasura-default-role'] || 'viewer';
      
      // Check if user has staff access permissions
      const allowedRoles = hasuraClaims?.['x-hasura-allowed-roles'] || [];
      const hasStaffAccess = ['developer', 'org_admin', 'manager'].some(r => allowedRoles.includes(r));
      
      if (!hasStaffAccess) {
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
      }
      
      // Check if user is trying to access all users without developer permissions
      const includeNonStaff = searchParams.get("includeNonStaff") === "true";
      const isDeveloper = role === 'developer' || allowedRoles.includes('developer');
      
      if (includeNonStaff && !isDeveloper) {
        return NextResponse.json({ error: "Developer access required for all users view" }, { status: 403 });
      }
    }
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100); // Cap at 100
    const search = searchParams.get("search") || undefined;
    const roles = searchParams.get("roles")?.split(",").filter(Boolean) || [];
    const statuses = searchParams.get("statuses")?.split(",").filter(Boolean) || [];
    const isActive = searchParams.get("isActive") ? searchParams.get("isActive") === "true" : undefined;
    const managerId = searchParams.get("managerId") || undefined;
    const orderBy = (searchParams.get("orderBy") as any) || "name";
    const orderDirection = (searchParams.get("orderDirection") as any) || "ASC";
    const includeStats = searchParams.get("includeStats") === "true";
    const includeNonStaff = searchParams.get("includeNonStaff") === "true";

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build GraphQL where clause
    const whereClause: any = {};
    
    // Role filtering
    if (roles.length > 0) {
      whereClause.role = { _in: roles };
    }
    
    // Status filtering
    if (statuses.length > 0) {
      whereClause.status = { _in: statuses };
    }
    
    // Active status filtering
    if (isActive !== undefined) {
      whereClause.isActive = { _eq: isActive };
    }
    
    // Manager filtering
    if (managerId) {
      whereClause.managerId = { _eq: managerId };
    }

    // Build order by clause
    const orderByClause = [{ [orderBy]: orderDirection }];

    let staffData;
    let statsData = null;

    if (search) {
      // Use search query if search term provided
      const searchTerm = `%${search}%`;
      
      staffData = await executeTypedQuery<SearchUsersPaginatedQuery>(
        SearchUsersPaginatedDocument,
        {
          searchTerm,
          limit,
          offset,
        }
      );
    } else {
      if (includeNonStaff) {
        // Use GetAllUsersPaginated query to include non-staff users (developer only)
        staffData = await executeTypedQuery<GetAllUsersPaginatedQuery>(
          GetAllUsersPaginatedDocument,
          {
            limit,
            offset,
            where: whereClause,
            orderBy: orderByClause,
          }
        );
      } else {
        // Use regular staff listing with filters
        staffData = await executeTypedQuery<GetStaffPaginatedQuery>(
          GetStaffPaginatedDocument,
          {
            limit,
            offset,
            where: whereClause,
          }
        );
      }
    }

    // Get stats if requested
    if (includeStats) {
      try {
        // Calculate 30 days ago timestamp
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        statsData = await executeTypedQuery<GetUserStatusDashboardStatsQuery>(
          GetUserStatusDashboardStatsDocument,
          {
            thirtyDaysAgo: thirtyDaysAgo.toISOString()
          }
        );
      } catch (statsError) {
        console.warn("Failed to fetch staff stats:", statsError);
        // Continue without stats if they fail
      }
    }

    // Extract users and total count
    let users, totalCount;
    
    if (search) {
      users = (staffData as SearchUsersPaginatedQuery).users || [];
      totalCount = (staffData as SearchUsersPaginatedQuery).searchAggregate?.aggregate?.count || 0;
    } else if (includeNonStaff) {
      users = (staffData as GetAllUsersPaginatedQuery).users || [];
      totalCount = (staffData as GetAllUsersPaginatedQuery).allUsersAggregate?.aggregate?.count || 0;
    } else {
      users = (staffData as GetStaffPaginatedQuery).users || [];
      totalCount = (staffData as GetStaffPaginatedQuery).staffAggregate?.aggregate?.count || 0;
    }

    const totalPages = Math.ceil(totalCount / limit);

    // Format response
    const response: StaffListResponse = {
      success: true,
      data: {
        users: users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          isStaff: user.isStaff,
          managerId: user.managerId,
          clerkUserId: user.clerkUserId,
          createdAt: (user as any).createdAt || null,
          updatedAt: user.updatedAt,
          managerUser: user.managerUser ? {
            id: user.managerUser.id,
            name: user.managerUser.name,
            email: user.managerUser.email,
            role: (user.managerUser as any).role || null,
          } : null,
        })),
        total: totalCount,
        page,
        limit,
        totalPages,
        ...(statsData && { stats: formatStatsData(statsData) }),
      },
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error("Staff listing error:", error);

    return NextResponse.json<StaffListResponse>(
      {
        success: false,
        error: error.message || "Failed to fetch staff list",
      },
      { status: 500 }
    );
  }
}

// Helper function to format stats data
function formatStatsData(statsData: GetUserStatusDashboardStatsQuery) {
  return {
    total: {
      active: statsData.active?.aggregate?.count || 0,
      inactive: statsData.inactive?.aggregate?.count || 0,
      locked: statsData.locked?.aggregate?.count || 0,
      pending: statsData.pending?.aggregate?.count || 0,
      staff: statsData.staff?.aggregate?.count || 0,
    },
    recentChanges: statsData.recentStatusChanges?.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      statusChangedAt: user.statusChangedAt,
      statusChangeReason: user.statusChangeReason,
    })) || [],
    roleDistribution: statsData.byRole?.reduce((acc: any, user: any) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {}) || {},
  };
}