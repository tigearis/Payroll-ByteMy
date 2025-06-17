import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { adminApolloClient } from "@/lib/server-apollo-client";
import { gql } from "@apollo/client";
import { protectAdminRoute } from "@/lib/security/auth-middleware";
import { SecureErrorHandler } from "@/lib/security/error-responses";
import { withAuth } from "@/lib/api-auth";

// GraphQL mutation to deactivate user (soft delete)
const DEACTIVATE_USER = gql`
  mutation DeactivateUser($id: uuid!, $deactivatedBy: String!) {
    update_users_by_pk(
      pk_columns: { id: $id }
      _set: {
        is_active: false
        is_staff: false
        role: "viewer"
        deactivated_at: "now()"
        deactivated_by: $deactivatedBy
        updated_at: "now()"
      }
    ) {
      id
      name
      email
      role
      clerk_user_id
      is_staff
      is_active
      deactivated_at
      deactivated_by
      manager {
        id
        name
        email
      }
    }
  }
`;

// GraphQL mutation to hard delete user (developers only)
const HARD_DELETE_USER = gql`
  mutation HardDeleteUser($id: uuid!) {
    delete_users_by_pk(id: $id) {
      id
      name
      email
      role
      clerk_user_id
    }
  }
`;

// Query to get user details and check for dependencies
const GET_USER_FOR_DELETION = gql`
  query GetUserForDeletion($id: uuid!) {
    users_by_pk(id: $id) {
      id
      name
      email
      role
      clerk_user_id
      is_staff
      is_active
      created_at
      manager {
        id
        name
        email
      }
    }
    
    # Check for active payroll assignments
    payrolls(where: {
      _or: [
        {primary_consultant_user_id: {_eq: $id}},
        {backup_consultant_user_id: {_eq: $id}},
        {manager_user_id: {_eq: $id}}
      ],
      status: {_eq: "Active"}
    }) {
      id
      name
      status
    }
    
    # Check for subordinate staff
    subordinates: users(where: {manager_id: {_eq: $id}, is_active: {_eq: true}}) {
      id
      name
      email
    }
    
    # Check for pending leave approvals (if user is a manager)
    pending_leaves: leave(where: {
      _and: [
        {user: {manager_id: {_eq: $id}}},
        {status: {_eq: "Pending"}}
      ]
    }) {
      id
      user {
        name
      }
      leave_type
      start_date
      end_date
    }
  }
`;

// Query to get current user's role and permissions
const GET_CURRENT_USER_ROLE = gql`
  query GetCurrentUserRole($clerkUserId: String!) {
    users(where: {clerk_user_id: {_eq: $clerkUserId}}) {
      id
      role
      name
      email
    }
  }
`;

async function checkUserPermissions(clerkUserId: string) {
  const { data } = await adminApolloClient.query({
    query: GET_CURRENT_USER_ROLE,
    variables: { clerkUserId },
    fetchPolicy: "no-cache",
  });

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
export const POST = withAuth(async (req: NextRequest, session) => {
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

    console.log(`🗑️ Processing user deletion: ${staffId}, hardDelete: ${forceHardDelete}`);

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
    const { data: userData } = await adminApolloClient.query({
      query: GET_USER_FOR_DELETION,
      variables: { id: staffId },
      fetchPolicy: "no-cache",
    });

    const user = userData?.users_by_pk;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.is_active && !forceHardDelete) {
      return NextResponse.json(
        { error: "User is already inactive" },
        { status: 400 }
      );
    }

    // Prevent self-deletion
    if (user.clerk_user_id === userId) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    console.log(`👤 Found user: ${user.name} (${user.email})`);

    // Check for blocking dependencies (unless forcing hard delete)
    const blockingDependencies = [];
    
    if (userData.payrolls?.length > 0) {
      blockingDependencies.push(`${userData.payrolls.length} active payroll assignments`);
    }

    if (userData.subordinates?.length > 0) {
      blockingDependencies.push(`${userData.subordinates.length} direct reports`);
    }

    if (userData.pending_leaves?.length > 0) {
      blockingDependencies.push(`${userData.pending_leaves.length} pending leave approvals`);
    }

    // For non-developers, check dependencies and block if found
    if (!permissions.isDeveloper && blockingDependencies.length > 0 && !forceHardDelete) {
      return NextResponse.json({
        error: "Cannot deactivate user with active dependencies",
        dependencies: blockingDependencies,
        suggestions: [
          "Reassign active payrolls to other consultants",
          "Reassign subordinate staff to other managers", 
          "Process pending leave approvals",
          "Contact a developer for forced deletion if necessary"
        ]
      }, { status: 409 });
    }

    let clerkDeleted = false;
    let result;

    // Delete from Clerk first (if they have an account)
    if (user.clerk_user_id) {
      try {
        console.log(`🔄 Deleting Clerk user: ${user.clerk_user_id}`);
        const client = await clerkClient();
        await client.users.deleteUser(user.clerk_user_id);
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
      const { data: deleteData } = await adminApolloClient.mutate({
        mutation: HARD_DELETE_USER,
        variables: { id: staffId },
      });

      result = deleteData?.delete_users_by_pk;
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
          "Historical references may show as 'Deleted User'"
        ]
      });

    } else {
      // Soft delete (deactivation)
      console.log("📝 Performing SOFT DELETE (deactivation)");
      const { data: deactivateData } = await adminApolloClient.mutate({
        mutation: DEACTIVATE_USER,
        variables: {
          id: staffId,
          deactivatedBy: userId,
        },
      });

      result = deactivateData?.update_users_by_pk;
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
          deactivatedAt: result.deactivated_at,
          deactivatedBy: userId,
          originalRole: user.role,
          hadClerkAccount: !!user.clerk_user_id,
        },
        dependenciesFound: blockingDependencies.length > 0 ? blockingDependencies : null,
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
}, { 
  allowedRoles: ["developer", "org_admin"]
});

// GET endpoint to check deletion status and dependencies
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("staffId");

    if (!staffId) {
      return NextResponse.json(
        { error: "Staff ID is required" },
        { status: 400 }
      );
    }

    // Check current user permissions
    const permissions = await checkUserPermissions(userId);

    if (!permissions.canDeactivate) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Get user details and dependencies
    const { data: userData } = await adminApolloClient.query({
      query: GET_USER_FOR_DELETION,
      variables: { id: staffId },
      fetchPolicy: "no-cache",
    });

    const user = userData?.users_by_pk;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const dependencies = [];
    const warnings = [];

    if (userData.payrolls?.length > 0) {
      dependencies.push({
        type: "payrolls",
        count: userData.payrolls.length,
        items: userData.payrolls.map((p: any) => ({ id: p.id, name: p.name }))
      });
      warnings.push("User has active payroll assignments that need reassignment");
    }

    if (userData.subordinates?.length > 0) {
      dependencies.push({
        type: "subordinates", 
        count: userData.subordinates.length,
        items: userData.subordinates.map((s: any) => ({ id: s.id, name: s.name }))
      });
      warnings.push("User manages other staff members who need a new manager");
    }

    if (userData.pending_leaves?.length > 0) {
      dependencies.push({
        type: "pending_leaves",
        count: userData.pending_leaves.length,
        items: userData.pending_leaves.map((l: any) => ({
          id: l.id,
          user: l.user.name,
          type: l.leave_type,
          dates: `${l.start_date} to ${l.end_date}`
        }))
      });
      warnings.push("User has pending leave approvals to process");
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.is_active,
        hasClerkAccount: !!user.clerk_user_id,
        createdAt: user.created_at,
        manager: user.manager,
      },
      permissions: {
        canDeactivate: permissions.canDeactivate,
        canHardDelete: permissions.canHardDelete,
        currentUserRole: permissions.currentUser.role,
      },
      dependencies,
      warnings,
      canProceed: dependencies.length === 0 || permissions.isDeveloper,
      recommendedAction: dependencies.length > 0 && !permissions.isDeveloper 
        ? "resolve_dependencies" 
        : user.is_active 
        ? "deactivate" 
        : "already_inactive"
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
}