import { createClerkClient } from "@clerk/backend";
import { NextRequest, NextResponse } from "next/server";
import { 
  GetUserForDeletionDocument,
  type GetUserForDeletionQuery,
  ReactivateUserDocument,
  type ReactivateUserMutation
} from "@/domains/users/graphql/generated/graphql";
import { executeTypedMutation, executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuthParams } from "@/lib/auth/api-auth";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

interface RestoreUserRequest {
  reason?: string;
  resetStatus?: boolean;
}

interface RestoreUserResponse {
  success: boolean;
  user?: any;
  message?: string;
  error?: string;
}

export const POST = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    const { id } = await params;
    const body: RestoreUserRequest = await req.json();
    
    const reason = body.reason || "User account restored by administrator";
    const resetStatus = body.resetStatus ?? true;

    // Get user details
    let userData;
    try {
      userData = await executeTypedQuery<GetUserForDeletionQuery>(
        GetUserForDeletionDocument,
        { id }
      );
    } catch (queryError: any) {
      console.error("Failed to fetch user for restoration:", queryError);
      return NextResponse.json<RestoreUserResponse>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const user = userData.userById;
    if (!user) {
      return NextResponse.json<RestoreUserResponse>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is actually deleted/deactivated
    if (user.isActive) {
      return NextResponse.json<RestoreUserResponse>(
        { success: false, error: "User is already active and does not need restoration" },
        { status: 400 }
      );
    }

    console.log(`🔄 Restoring user: ${user.name} (${user.email})`);

    try {
      // Reactivate user in database
      const restoredUserData = await executeTypedMutation<ReactivateUserMutation>(
        ReactivateUserDocument,
        {
          id: user.id
        }
      );

      const restoredUser = restoredUserData.updateUserById;

      if (!restoredUser) {
        throw new Error("Failed to restore user in database");
      }

      // Restore user in Clerk if they have an account
      if (user.clerkUserId) {
        try {
          console.log(`🔄 Restoring user in Clerk: ${user.clerkUserId}`);
          
          // Check if user exists in Clerk
          const clerkUser = await clerkClient.users.getUser(user.clerkUserId);
          
          // Unban the user if they were banned
          if (clerkUser.banned) {
            await clerkClient.users.unbanUser(user.clerkUserId);
          }
          
          // Update metadata to mark as restored
          await clerkClient.users.updateUser(user.clerkUserId, {
            publicMetadata: {
              ...clerkUser.publicMetadata,
              status: "active",
              restoredAt: new Date().toISOString(),
              restoredBy: session.userId,
              restorationReason: reason,
              // Remove deletion metadata
              deletedAt: undefined,
              deletedBy: undefined,
              deletionReason: undefined,
            },
            privateMetadata: {
              ...clerkUser.privateMetadata,
              accountDeleted: false,
              lastRestoredAt: new Date().toISOString(),
              // Keep deletion history for audit
              lastDeletedAt: clerkUser.privateMetadata?.lastDeletedAt,
            },
          });

          console.log(`✅ Successfully restored user in Clerk`);
        } catch (clerkError: any) {
          console.error("Failed to restore user in Clerk:", clerkError);
          
          // User restored in database but Clerk restoration failed
          // This is not a complete failure - return success with warning
          return NextResponse.json<RestoreUserResponse>({
            success: true,
            user: {
              id: restoredUser.id,
              name: restoredUser.name,
              email: restoredUser.email,
              isActive: restoredUser.isActive,
            },
            message: `User restored in database but Clerk restoration failed: ${clerkError.message}. User may need manual restoration in authentication system.`,
          });
        }
      }

      // Log the restoration for audit purposes
      console.log(`✅ User restored successfully:`, {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        reason,
        restoredBy: session.userId,
        hadClerkAccount: !!user.clerkUserId,
        previouslyDeleted: !user.isActive,
      });

      return NextResponse.json<RestoreUserResponse>({
        success: true,
        user: {
          id: restoredUser.id,
          name: restoredUser.name,
          email: restoredUser.email,
          isActive: restoredUser.isActive,
        },
        message: `Successfully restored user account: ${user.name}`,
      });

    } catch (restoreError: any) {
      console.error("Failed to restore user:", restoreError);
      
      return NextResponse.json<RestoreUserResponse>(
        { 
          success: false, 
          error: `Failed to restore user: ${restoreError.message}` 
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Restore user error:", error);

    return NextResponse.json<RestoreUserResponse>(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
});