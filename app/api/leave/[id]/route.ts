import { NextRequest, NextResponse } from "next/server";
import { 
  GetLeaveByIdDocument, 
  UpdateLeaveDocument,
  DeleteLeaveDocument,
  type GetLeaveByIdQuery,
  type UpdateLeaveMutation,
  type DeleteLeaveMutation
} from "@/domains/leave/graphql/generated/graphql";
import { executeTypedQuery, executeTypedMutation } from "@/lib/apollo/query-helpers";
import { withAuthParams } from "@/lib/auth/api-auth";

// GET /api/leave/[id] - Get specific leave request
export const GET = withAuthParams(async (req, { params }, session) => {
  try {
    const { id } = await params;

    const data = await executeTypedQuery<GetLeaveByIdQuery>(
      GetLeaveByIdDocument,
      { id }
    );

    if (!data.leaveById) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Leave request not found" 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        leave: data.leaveById
      }
    });

  } catch (error) {
    console.error("Error fetching leave request:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch leave request" 
      },
      { status: 500 }
    );
  }
});

// PUT /api/leave/[id] - Update leave request
export const PUT = withAuthParams(async (req, { params }, session) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const { startDate, endDate, leaveType, reason } = body;

    // First, fetch the existing leave request to check permissions
    const existingData = await executeTypedQuery<GetLeaveByIdQuery>(
      GetLeaveByIdDocument,
      { id }
    );

    if (!existingData.leaveById) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Leave request not found" 
        },
        { status: 404 }
      );
    }

    const leave = existingData.leaveById;

    // Check if user can edit this leave request
    // Users can only edit their own pending requests
    // Managers can edit their team's requests
    const userRole = req.headers.get('x-user-role') || 'viewer';
    const canEdit = (
      (leave.userId === session.userId && leave.status === "Pending") ||
      ["manager", "org_admin", "developer"].includes(userRole)
    );

    if (!canEdit) {
      return NextResponse.json(
        { 
          success: false, 
          error: "You don't have permission to edit this leave request" 
        },
        { status: 403 }
      );
    }

    // Validate data if provided
    if (startDate && endDate) {
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

      // Only check past dates for pending requests
      if (leave.status === "Pending") {
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
      }
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (startDate) updateData.startDate = startDate;
    if (endDate) updateData.endDate = endDate;
    if (leaveType) updateData.leaveType = leaveType;
    if (reason !== undefined) updateData.reason = reason;

    // Update leave request
    const data = await executeTypedMutation<UpdateLeaveMutation>(
      UpdateLeaveDocument,
      {
        id,
        set: updateData
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        leave: data.updateLeaveById
      }
    });

  } catch (error) {
    console.error("Error updating leave request:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to update leave request" 
      },
      { status: 500 }
    );
  }
});

// DELETE /api/leave/[id] - Delete leave request
export const DELETE = withAuthParams(async (req, { params }, session) => {
  try {
    const { id } = await params;

    // First, fetch the existing leave request to check permissions
    const existingData = await executeTypedQuery<GetLeaveByIdQuery>(
      GetLeaveByIdDocument,
      { id }
    );

    if (!existingData.leaveById) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Leave request not found" 
        },
        { status: 404 }
      );
    }

    const leave = existingData.leaveById;

    // Check if user can delete this leave request
    // Users can only delete their own pending requests
    // Only org_admin and developer can delete any leave request
    const userRole = req.headers.get('x-user-role') || 'viewer';
    const canDelete = (
      (leave.userId === session.userId && leave.status === "Pending") ||
      ["org_admin", "developer"].includes(userRole)
    );

    if (!canDelete) {
      return NextResponse.json(
        { 
          success: false, 
          error: "You don't have permission to delete this leave request" 
        },
        { status: 403 }
      );
    }

    // Delete leave request
    const data = await executeTypedMutation<DeleteLeaveMutation>(
      DeleteLeaveDocument,
      { id }
    );

    return NextResponse.json({
      success: true,
      data: {
        leave: data.deleteLeaveById
      }
    });

  } catch (error) {
    console.error("Error deleting leave request:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to delete leave request" 
      },
      { status: 500 }
    );
  }
});