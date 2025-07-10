import { createClerkClient } from "@clerk/backend";
import { NextRequest, NextResponse } from "next/server";
import { 
  GetUserWithStatusDetailsDocument,
  type GetUserWithStatusDetailsQuery,
  DeactivateUserWithReasonDocument,
  type DeactivateUserWithReasonMutation,
  LockUserWithReasonDocument,
  type LockUserWithReasonMutation,
  UnlockUserWithReasonDocument,
  type UnlockUserWithReasonMutation,
  ReactivateUserWithReasonDocument,
  type ReactivateUserWithReasonMutation
} from "@/domains/users/graphql/generated/graphql";
import { executeTypedMutation, executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuthParams } from "@/lib/auth/api-auth";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

type UserStatus = "active" | "inactive" | "locked" | "pending";

interface UpdateStatusRequest {
  status: UserStatus;
  reason: string;
  notifyUser?: boolean;
}

interface UpdateStatusResponse {
  success: boolean;
  user?: any;
  message?: string;
  error?: string;
}

export const PUT = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    const { id } = await params;
    const body: UpdateStatusRequest = await req.json();
    const { status, reason, notifyUser = false } = body;

    // Validate required fields
    if (!status || !reason) {
      return NextResponse.json<UpdateStatusResponse>(
        { success: false, error: "Status and reason are required" },
        { status: 400 }
      );
    }

    // Validate status value
    const validStatuses: UserStatus[] = ["active", "inactive", "locked", "pending"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json<UpdateStatusResponse>(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate reason length
    if (reason.length < 5) {
      return NextResponse.json<UpdateStatusResponse>(
        { success: false, error: "Reason must be at least 5 characters long" },
        { status: 400 }
      );
    }

    // Get user details first to validate existence
    let userData;
    try {
      userData = await executeTypedQuery<GetUserWithStatusDetailsQuery>(
        GetUserWithStatusDetailsDocument,
        { userId: id }
      );
    } catch (queryError: any) {
      console.error("Failed to fetch user:", queryError);
      return NextResponse.json<UpdateStatusResponse>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const user = userData.userById;
    if (!user) {
      return NextResponse.json<UpdateStatusResponse>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Allow users to change any status (including their own) since role-based access control is disabled

    // Check if status is actually changing
    if (user.status === status) {
      return NextResponse.json<UpdateStatusResponse>(
        { 
          success: true, 
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status,
            isActive: user.isActive,
          },
          message: `User status is already ${status}` 
        }
      );
    }

    console.log(`🔄 Updating user status: ${user.name} (${user.email}) from ${user.status} to ${status}`);

    let updatedUser;

    try {
      // Execute appropriate mutation based on status
      switch (status) {
        case "inactive":
          const deactivateData = await executeTypedMutation<DeactivateUserWithReasonMutation>(
            DeactivateUserWithReasonDocument,
            {
              userId: user.id,
              reason,
              deactivatedBy: user.id, // Use user's own ID as placeholder since we don't have current user's database ID
              deactivatedByString: session.email || session.userId,
            }
          );
          updatedUser = deactivateData.updateUserById;
          break;

        case "locked":
          const lockData = await executeTypedMutation<LockUserWithReasonMutation>(
            LockUserWithReasonDocument,
            {
              userId: user.id,
              reason,
              lockedBy: user.id, // Use user's own ID as placeholder since we don't have current user's database ID
            }
          );
          updatedUser = lockData.updateUserById;
          break;

        case "active":
          if (user.status === "locked") {
            const unlockData = await executeTypedMutation<UnlockUserWithReasonMutation>(
              UnlockUserWithReasonDocument,
              {
                userId: user.id,
                reason,
                unlockedBy: user.id, // Use user's own ID as placeholder since we don't have current user's database ID
              }
            );
            updatedUser = unlockData.updateUserById;
          } else {
            const reactivateData = await executeTypedMutation<ReactivateUserWithReasonMutation>(
              ReactivateUserWithReasonDocument,
              {
                userId: user.id,
                reason,
                reactivatedBy: user.id, // Use user's own ID as placeholder since we don't have current user's database ID
              }
            );
            updatedUser = reactivateData.updateUserById;
          }
          break;

        default:
          throw new Error(`Status change to ${status} is not supported`);
      }

      if (!updatedUser) {
        throw new Error("Failed to update user status in database");
      }

      // Update Clerk user status if they have a Clerk account
      if (user.clerkUserId) {
        try {
          console.log(`🔄 Syncing status change with Clerk: ${user.clerkUserId}`);
          
          if (status === "inactive" || status === "locked") {
            // Ban/suspend user in Clerk
            await clerkClient.users.banUser(user.clerkUserId);
            console.log(`🔒 User banned in Clerk: ${user.clerkUserId}`);
          } else if (status === "active") {
            // Unban user in Clerk
            await clerkClient.users.unbanUser(user.clerkUserId);
            console.log(`🔓 User unbanned in Clerk: ${user.clerkUserId}`);
          }

          // Update user metadata to reflect status change
          const currentClerkUser = await clerkClient.users.getUser(user.clerkUserId);
          await clerkClient.users.updateUser(user.clerkUserId, {
            publicMetadata: {
              ...currentClerkUser.publicMetadata,
              status: status,
              lastStatusChange: new Date().toISOString(),
              statusChangeReason: reason,
            },
            privateMetadata: {
              ...currentClerkUser.privateMetadata,
              lastStatusUpdateBy: session.userId,
              lastStatusUpdateAt: new Date().toISOString(),
            },
          });

          console.log(`✅ Successfully synced status change with Clerk`);
        } catch (clerkError: any) {
          console.error("Failed to sync status with Clerk:", clerkError);
          
          // Status updated in database but Clerk sync failed
          // This is not a complete failure - return success with warning
          return NextResponse.json<UpdateStatusResponse>({
            success: true,
            user: {
              id: updatedUser.id,
              name: updatedUser.name,
              email: updatedUser.email,
              status: updatedUser.status,
              isActive: updatedUser.isActive,
              statusChangedAt: updatedUser.statusChangedAt,
              statusChangeReason: updatedUser.statusChangeReason,
            },
            message: `Status updated in database but Clerk sync failed: ${clerkError.message}. User authentication status may be inconsistent.`,
          });
        }
      }

      // Log the status change for audit purposes
      console.log(`✅ Status updated successfully:`, {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        previousStatus: user.status,
        newStatus: status,
        reason,
        updatedBy: session.userId,
        hasClerkAccount: !!user.clerkUserId,
      });

      const statusMessage = getStatusChangeMessage(user.status, status, user.name!);

      return NextResponse.json<UpdateStatusResponse>({
        success: true,
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          status: updatedUser.status,
          isActive: updatedUser.isActive,
          statusChangedAt: updatedUser.statusChangedAt,
          statusChangeReason: updatedUser.statusChangeReason,
        },
        message: statusMessage,
      });

    } catch (updateError: any) {
      console.error("Failed to update user status:", updateError);
      
      return NextResponse.json<UpdateStatusResponse>(
        { 
          success: false, 
          error: `Failed to update status: ${updateError.message}` 
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Status update error:", error);

    return NextResponse.json<UpdateStatusResponse>(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
});

// GET endpoint to fetch current status information
export const GET = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    const { id } = await params;

    const userData = await executeTypedQuery<GetUserWithStatusDetailsQuery>(
      GetUserWithStatusDetailsDocument,
      { userId: id }
    );

    const user = userData.userById;
    if (!user) {
      return NextResponse.json<UpdateStatusResponse>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<UpdateStatusResponse>({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        isActive: user.isActive,
        isStaff: user.isStaff,
        clerkUserId: user.clerkUserId,
        statusChangedAt: user.statusChangedAt,
        statusChangeReason: user.statusChangeReason,
        deactivatedAt: user.deactivatedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

  } catch (error: any) {
    console.error("Get status error:", error);

    return NextResponse.json<UpdateStatusResponse>(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
});

// Helper function to generate appropriate status change messages
function getStatusChangeMessage(previousStatus: string, newStatus: string, userName: string): string {
  const statusActions: Record<string, string> = {
    inactive: "deactivated",
    locked: "locked",
    active: previousStatus === "locked" ? "unlocked" : "reactivated",
    pending: "set to pending",
  };

  const action = statusActions[newStatus] || "updated";
  return `Successfully ${action} ${userName}`;
}