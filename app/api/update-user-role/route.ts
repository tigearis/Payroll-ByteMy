import { handleApiError, createSuccessResponse } from "@/lib/shared/error-handling";
// app/api/update-user-role/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withEnhancedAuth, AuthContext } from "@/lib/auth/enhanced-api-auth";
import { MetadataManager } from "@/lib/auth/metadata-manager.server";
import { isValidUserRole, Role } from "@/types/permissions";
import { clerkClient } from "@clerk/nextjs/server";
import { canAssignUserRole as canAssignRole } from "@/lib/user-sync";

export const POST = withEnhancedAuth(
  async (req: NextRequest, context: AuthContext) => {
    try {
      const { targetUserId, role } = (await req.json()) as {
        targetUserId: string;
        role: Role;
      };

      // Validate the provided role using our system's definition
      if (!isValidUserRole(role)) {
        return NextResponse.json(
          { error: "Invalid role provided" },
          { status: 400 }
        );
      }

      // Use the canAssignRole utility to check if the current user can assign the target role
      // The current user's role is available and validated in the context
      if (!canAssignRole(context.userRole, role)) {
        return NextResponse.json(
          { error: "Insufficient permissions to assign this role" },
          { status: 403 }
        );
      }

      // Update the user's role using the centralized MetadataManager
      await MetadataManager.updateUserRole(
        targetUserId,
        role,
        context.userId // The user ID of the person performing the action
      );

      return NextResponse.json({
        success: true,
        message: `User role updated to ${role}`,
      });
    } catch (error) {
    return handleApiError(error, "update-user-role");
  },
        { status: 500 }
      );
    }
  },
  {
    minimumRole: "manager", // Only managers and above can attempt to access this endpoint
  }
);

// GET endpoint to fetch user role information
export const GET = withEnhancedAuth(
  async (req: NextRequest, context: AuthContext) => {
    try {
      const url = new URL(req.url);
      const targetUserId = url.searchParams.get("userId");

      if (!targetUserId) {
        return new NextResponse("Missing userId parameter", { status: 400 });
      }

      // The withEnhancedAuth wrapper already confirms the user is at least a 'viewer'.
      // For more granular control, we check if they are a manager or accessing their own info.
      const isSelf = context.userId === targetUserId;
      const canViewRoles = context.hasMinimumRole("manager");

      if (!canViewRoles && !isSelf) {
        return new NextResponse(
          "Forbidden: You do not have permission to view other user roles.",
          {
            status: 403,
          }
        );
      }

      // Get target user information
      const targetUser = await (
        await clerkClient()
      ).users.getUser(targetUserId);
      const targetUserRole = MetadataManager.extractUserRole(targetUser);

      const canModify = canAssignRole(context.userRole, targetUserRole);

      return NextResponse.json({
        userId: targetUserId,
        role: targetUserRole,
        email: targetUser.emailAddresses[0]?.emailAddress,
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        canModify,
      });
    } catch (error) {
      console.error("Error fetching user role:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  },
  {
    // A viewer can see their own role, but this check is enforced inside the handler.
    // The wrapper just ensures they are logged in.
    minimumRole: "viewer",
  }
);
