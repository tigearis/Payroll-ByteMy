import { NextRequest, NextResponse } from "next/server";
import { 
  GetLeaveDocument, 
  GetLeaveDashboardStatsDocument,
  CreateLeaveDocument,
  CreateLeaveForEmployeeDocument,
  CreatePendingLeaveForEmployeeDocument,
  GetManagerTeamForLeaveDocument,
  type GetLeaveQuery,
  type GetLeaveDashboardStatsQuery,
  type CreateLeaveMutation,
  type CreateLeaveForEmployeeMutation,
  type CreatePendingLeaveForEmployeeMutation,
  type GetManagerTeamForLeaveQuery
} from "@/domains/leave/graphql/generated/graphql";
import { executeTypedQuery, executeTypedMutation } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";

// GET /api/leave - List leave requests with filtering and pagination
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const includeStats = searchParams.get("includeStats") === "true";
    const search = searchParams.get("search");
    const statuses = searchParams.get("statuses")?.split(",");
    const types = searchParams.get("types")?.split(",");

    const offset = (page - 1) * limit;

    // Build where clause for filtering
    const whereClause: any = {};
    
    if (search) {
      whereClause._or = [
        { reason: { _ilike: `%${search}%` } },
        { leaveType: { _ilike: `%${search}%` } },
        { leaveUser: { name: { _ilike: `%${search}%` } } }
      ];
    }

    if (statuses && statuses.length > 0) {
      whereClause.status = { _in: statuses };
    }

    if (types && types.length > 0) {
      whereClause.leaveType = { _in: types };
    }

    // Fetch leave requests
    const leaveData = await executeTypedQuery<GetLeaveQuery>(
      GetLeaveDocument,
      { 
        limit, 
        offset, 
        where: whereClause 
      }
    );

    let statsData = null;
    if (includeStats) {
      // Fetch dashboard stats separately
      statsData = await executeTypedQuery<GetLeaveDashboardStatsQuery>(
        GetLeaveDashboardStatsDocument
      );
    }

    // Transform stats data
    const stats = statsData ? {
      overview: {
        total: statsData.totalLeave?.aggregate?.count || 0,
        pending: statsData.pendingLeave?.aggregate?.count || 0,
        approved: statsData.approvedLeave?.aggregate?.count || 0,
        rejected: 0, // TODO: Add rejected count query
        currentLeave: statsData.currentLeave?.aggregate?.count || 0,
        upcomingLeave: 0, // TODO: Add upcoming count
      },
      byType: {
        annual: 0,
        sick: 0,
        unpaid: 0,
        other: 0,
      },
      recent: statsData.upcomingLeave || []
    } : null;

    return NextResponse.json({
      success: true,
      data: {
        leave: leaveData.leave || [],
        total: leaveData.leaveAggregate?.aggregate?.count || 0,
        stats: stats,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil((leaveData.leaveAggregate?.aggregate?.count || 0) / limit),
        }
      }
    });

  } catch (error) {
    console.error("Error fetching leave requests:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch leave requests" 
      },
      { status: 500 }
    );
  }
});

// POST /api/leave - Create new leave request
export const POST = withAuth(async (req, session) => {
  try {
    const body = await req.json();
    const { 
      userId, 
      startDate, 
      endDate, 
      leaveType, 
      reason, 
      isForSomeoneElse, 
      managerCreateRequest, 
      managerId,
      autoApprove 
    } = body;

    // Validate required fields
    if (!userId || !startDate || !endDate || !leaveType) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required fields: userId, startDate, endDate, leaveType" 
        },
        { status: 400 }
      );
    }

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Start date cannot be after end date" 
        },
        { status: 400 }
      );
    }

    // Check if dates are in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (start < today) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Start date cannot be in the past" 
        },
        { status: 400 }
      );
    }

    // Validate reason for certain leave types
    if ((leaveType === "Other" || leaveType === "Sick") && !reason?.trim()) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Reason is required for ${leaveType} leave` 
        },
        { status: 400 }
      );
    }

    // Handle manager-created requests
    if (managerCreateRequest && managerId) {
      // Verify the manager has permission to create leave for this user
      const canManageTeamLeave = ["manager", "org_admin", "developer"].includes(session.role);
      
      if (!canManageTeamLeave) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Insufficient permissions to create leave for team members" 
          },
          { status: 403 }
        );
      }

      // Verify the target user is a subordinate of the manager
      const teamData = await executeTypedQuery<GetManagerTeamForLeaveQuery>(
        GetManagerTeamForLeaveDocument,
        { managerId }
      );

      const isSubordinate = teamData.users?.some(user => user.id === userId);
      
      if (!isSubordinate) {
        return NextResponse.json(
          { 
            success: false, 
            error: "You can only create leave requests for your direct or indirect reports" 
          },
          { status: 403 }
        );
      }

      // Use appropriate mutation based on auto-approve setting
      if (autoApprove) {
        const data = await executeTypedMutation<CreateLeaveForEmployeeMutation>(
          CreateLeaveForEmployeeDocument,
          {
            userId,
            startDate,
            endDate,
            leaveType,
            reason: reason || null,
          }
        );

        return NextResponse.json({
          success: true,
          data: {
            leave: data.insertLeave,
            autoApproved: true
          }
        });
      } else {
        const data = await executeTypedMutation<CreatePendingLeaveForEmployeeMutation>(
          CreatePendingLeaveForEmployeeDocument,
          {
            userId,
            startDate,
            endDate,
            leaveType,
            reason: reason || null,
          }
        );

        return NextResponse.json({
          success: true,
          data: {
            leave: data.insertLeave,
            autoApproved: false
          }
        });
      }
    }

    // Regular user creating their own leave request
    const data = await executeTypedMutation<CreateLeaveMutation>(
      CreateLeaveDocument,
      {
        object: {
          userId,
          startDate,
          endDate,
          leaveType,
          reason: reason || null,
          status: "Pending" // All new requests start as pending
        }
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        leave: data.insertLeave
      }
    });

  } catch (error) {
    console.error("Error creating leave request:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create leave request" 
      },
      { status: 500 }
    );
  }
});