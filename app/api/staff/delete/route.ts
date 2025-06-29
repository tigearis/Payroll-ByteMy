import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { executeTypedQuery, executeTypedMutation } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";
import {
  GetUserForDeletionDocument,
  GetCurrentUserRoleDocument,
  DeactivateUserDocument,
  HardDeleteUserDocument,
  type GetUserForDeletionQuery,
  type GetCurrentUserRoleQuery,
  type DeactivateUserMutation,
  type HardDeleteUserMutation,
} from "@/domains/users/graphql/generated/graphql";

async function checkUserPermissions(clerkUserId: string) {
  const data = await executeTypedQuery<GetCurrentUserRoleQuery>(
    GetCurrentUserRoleDocument,
    { clerkUserId }
  );

  const currentUser = data?.users?.[0];
  if (!currentUser) {
    throw new Error("Current user not found");
  }

  const isDeveloper = currentUser.role === "developer";
  const isAdmin = currentUser.role === "org_admin";
  const canDeactivate = isDeveloper || isAdmin;
  const canHardDelete = isDeveloper; // Only developers can hard delete

  return {
    currentUser,
    isDeveloper,
    isAdmin,
    canDeactivate,
    canHardDelete,
  };
}

// Export POST with admin role protection
export const POST = withAuth(
  async (req: NextRequest, session) => {
    try {
      console.log("🔧 API called: /api/staff/delete (POST)");

      const { userId } = session; // Already authenticated and role-verified

      const body = await req.json();
      const { staffId, forceHardDelete = false } = body;

      if (!staffId) {
        return NextResponse.json(
          { error: "Staff ID is required" },
          { status: 400 }
        );
      }

      console.log(
        `🗑️ Processing user deletion: ${staffId}, hardDelete: ${forceHardDelete}`
      );

      // Check current user permissions
      const permissions = await checkUserPermissions(userId);

      if (!permissions.canDeactivate) {
        return NextResponse.json(
          { error: "Insufficient permissions to deactivate users" },
          { status: 403 }
        );
      }

      if (forceHardDelete && !permissions.canHardDelete) {
        return NextResponse.json(
          { error: "Only developers can perform hard deletion" },
          { status: 403 }
        );
      }

      // Get user details and check dependencies
      const userData = await executeTypedQuery<GetUserForDeletionQuery>(
        GetUserForDeletionDocument,
        { id: staffId }
      );

      const user = userData?.userById;
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (!user.isActive && !forceHardDelete) {
        return NextResponse.json(
          { error: "User is already inactive" },
          { status: 400 }
        );
      }

      // Prevent self-deletion
      if (user.clerkUserId === userId) {
        return NextResponse.json(
          { error: "Cannot delete your own account" },
          { status: 400 }
        );
      }

      console.log(`👤 Found user: ${user.name} (${user.email})`);

      // Check for blocking dependencies (unless forcing hard delete)
      const blockingDependencies = [];

      if (userData.payrolls?.length > 0) {
        blockingDependencies.push(
          `${userData.payrolls.length} active payroll assignments`
        );
      }

      if (userData.subordinates?.length > 0) {
        blockingDependencies.push(
          `${userData.subordinates.length} direct reports`
        );
      }

      // For non-developers, check dependencies and block if found
      if (
        !permissions.isDeveloper &&
        blockingDependencies.length > 0 &&
        !forceHardDelete
      ) {
        return NextResponse.json(
          {
            error: "Cannot deactivate user with active dependencies",
            dependencies: blockingDependencies,
            suggestions: [
              "Reassign active payrolls to other consultants",
              "Reassign subordinate staff to other managers",
              "Process pending leave approvals",
              "Contact a developer for forced deletion if necessary",
            ],
          },
          { status: 409 }
        );
      }

      let clerkDeleted = false;
      let result;

      // Delete from Clerk first (if they have an account)
      if (user.clerkUserId) {
        try {
          console.log(`🔄 Deleting Clerk user: ${user.clerkUserId}`);
          const client = await clerkClient();
          await client.users.deleteUser(user.clerkUserId);
          clerkDeleted = true;
          console.log("✅ User deleted from Clerk successfully");
        } catch (clerkError) {
          console.error("❌ Failed to delete user from Clerk:", clerkError);
          // Continue with database operation even if Clerk deletion fails
          console.log("⚠️ Continuing with database operation");
        }
      } else {
        console.log("ℹ️ No Clerk ID found, skipping Clerk deletion");
      }

      if (forceHardDelete && permissions.canHardDelete) {
        // Hard delete (developers only)
        console.log("💥 Performing HARD DELETE (irreversible)");
        const deleteData = await executeTypedMutation<HardDeleteUserMutation>(
          HardDeleteUserDocument,
          { id: staffId }
        );

        result = deleteData?.deleteUserById;
        if (!result) {
          return NextResponse.json(
            { error: "Failed to hard delete user from database" },
            { status: 500 }
          );
        }

        console.log("✅ User hard deleted successfully");
        return NextResponse.json({
          success: true,
          action: "hard_delete",
          message: "User permanently deleted from all systems",
          user: result,
          clerkDeleted,
          warnings: [
            "This action is irreversible",
            "All user data has been permanently removed",
            "Historical references may show as 'Deleted User'",
          ],
        });
      } else {
        // Soft delete (deactivation)
        console.log("📝 Performing SOFT DELETE (deactivation)");
        const deactivateData = await executeTypedMutation<DeactivateUserMutation>(
          DeactivateUserDocument,
          { id: staffId }
        );

        result = deactivateData?.updateUserById;
        if (!result) {
          return NextResponse.json(
            { error: "Failed to deactivate user in database" },
            { status: 500 }
          );
        }

        console.log("✅ User deactivated successfully");
        return NextResponse.json({
          success: true,
          action: "deactivate",
          message: "User deactivated successfully",
          user: result,
          clerkDeleted,
          auditInfo: {
            deactivatedAt: result?.updatedAt || new Date().toISOString(),
            deactivatedBy: userId,
            originalRole: user.role,
            hadClerkAccount: !!user.clerkUserId,
          },
          dependenciesFound:
            blockingDependencies.length > 0 ? blockingDependencies : null,
        });
      }
    } catch (error) {
      console.error("❌ Error processing user deletion:", error);
      return NextResponse.json(
        {
          error: "Failed to process user deletion",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  },
  {
    allowedRoles: ["developer", "org_admin"],
  }
);

// GET endpoint to check deletion status and dependencies
export const GET = withAuth(async (req, { session }) => {
  try {
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("staffId");

    if (!staffId) {
      return NextResponse.json(
        { error: "Staff ID is required" },
        { status: 400 }
      );
    }

    // Check current user permissions
    const permissions = await checkUserPermissions(session.userId);

    if (!permissions.canDeactivate) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Get user details and dependencies
    const userData = await executeTypedQuery<GetUserForDeletionQuery>(
      GetUserForDeletionDocument,
      { id: staffId }
    );

    const user = userData?.userById;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const dependencies = [];
    const warnings = [];

    if (userData.payrolls?.length > 0) {
      dependencies.push({
        type: "payrolls",
        count: userData.payrolls.length,
        items: userData.payrolls.map((p: any) => ({ id: p.id, name: p.name })),
      });
      warnings.push(
        "User has active payroll assignments that need reassignment"
      );
    }

    if (userData.subordinates?.length > 0) {
      dependencies.push({
        type: "subordinates",
        count: userData.subordinates.length,
        items: userData.subordinates.map((s: any) => ({
          id: s.id,
          name: s.name,
        })),
      });
      warnings.push("User manages other staff members who need a new manager");
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        hasClerkAccount: !!user.clerkUserId,
        createdAt: user.createdAt,
        manager: user.managerUser,
      },
      permissions: {
        canDeactivate: permissions.canDeactivate,
        canHardDelete: permissions.canHardDelete,
        currentUserRole: permissions.currentUser.role,
      },
      dependencies,
      warnings,
      canProceed: dependencies.length === 0 || permissions.isDeveloper,
      recommendedAction:
        dependencies.length > 0 && !permissions.isDeveloper
          ? "resolve_dependencies"
          : user.isActive
            ? "deactivate"
            : "already_inactive",
    });
  } catch (error) {
    console.error("❌ Error getting deletion preview:", error);
    return NextResponse.json(
      {
        error: "Failed to get deletion preview",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}, {
  allowedRoles: ["developer", "org_admin"],
});
