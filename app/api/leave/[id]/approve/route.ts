import { NextRequest, NextResponse } from "next/server";
import { 
  GetLeaveByIdDocument, 
  ApproveLeaveDocument,
  RejectLeaveDocument,
  type GetLeaveByIdQuery,
  type ApproveLeaveMutation,
  type RejectLeaveMutation
} from "@/domains/leave/graphql/generated/graphql";
import { executeTypedQuery, executeTypedMutation } from "@/lib/apollo/query-helpers";
import { withAuthParams } from "@/lib/auth/api-auth";

// POST /api/leave/[id]/approve - Approve or reject leave request
export const POST = withAuthParams(async (req, { params }, session) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action } = body; // "approve" or "reject"

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid action. Must be 'approve' or 'reject'" 
        },
        { status: 400 }
      );
    }

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

    // Check if leave is already processed
    if (leave.status !== "Pending") {
      return NextResponse.json(
        { 
          success: false, 
          error: `Leave request is already ${leave.status.toLowerCase()}` 
        },
        { status: 400 }
      );
    }

    // Check if user has permission to approve/reject
    // Managers can approve their team's requests
    // Org_admin and developer can approve any request
    const userRole = req.headers.get('x-user-role') || 'viewer';
    const canApprove = ["manager", "org_admin", "developer"].includes(userRole);

    if (!canApprove) {
      return NextResponse.json(
        { 
          success: false, 
          error: "You don't have permission to approve/reject leave requests" 
        },
        { status: 403 }
      );
    }

    // For managers (not org_admin/developer), check if they manage this user
    if (userRole === "manager") {
      // TODO: Add manager relationship check
      // For now, we'll rely on Hasura RLS to handle this
    }

    // Perform the action
    let data;
    if (action === "approve") {
      data = await executeTypedMutation<ApproveLeaveMutation>(
        ApproveLeaveDocument,
        { id }
      );
    } else {
      data = await executeTypedMutation<RejectLeaveMutation>(
        RejectLeaveDocument,
        { id }
      );
    }

    // TODO: Send notification to employee about approval/rejection
    // This could be implemented later with email service

    return NextResponse.json({
      success: true,
      data: {
        leave: action === "approve" ? data.updateLeaveById : data.updateLeaveById,
        action: action
      },
      message: `Leave request ${action}d successfully`
    });

  } catch (error) {
    console.error(`Error processing leave request:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to process leave request" 
      },
      { status: 500 }
    );
  }
});