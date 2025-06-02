import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { adminApolloClient } from "@/lib/server-apollo-client";
import { gql } from "@apollo/client";

// GraphQL mutation to mark user as inactive (soft delete)
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

// Query to get user details for deletion
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
  }
`;

export async function POST(req: NextRequest) {
  try {
    console.log("🔧 API called: /api/staff/delete");

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { staffId } = body;

    if (!staffId) {
      return NextResponse.json(
        { error: "Staff ID is required" },
        { status: 400 }
      );
    }

    console.log(`🗑️ Deactivating user: ${staffId}`);

    // Get user details before deletion
    const { data: userData } = await adminApolloClient.query({
      query: GET_USER_FOR_DELETION,
      variables: { id: staffId },
      fetchPolicy: "no-cache",
    });

    const user = userData?.users_by_pk;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.is_active) {
      return NextResponse.json(
        { error: "User is already inactive" },
        { status: 400 }
      );
    }

    console.log(`👤 Found user: ${user.name} (${user.email})`);

    // Delete user from Clerk first (if they have a Clerk account)
    let clerkDeleted = false;
    if (user.clerk_user_id) {
      try {
        console.log(`🔄 Deleting Clerk user: ${user.clerk_user_id}`);
        const client = await clerkClient();

        await client.users.deleteUser(user.clerk_user_id);
        clerkDeleted = true;
        console.log("✅ User deleted from Clerk successfully");
      } catch (clerkError) {
        console.error("❌ Failed to delete user from Clerk:", clerkError);

        // Continue with database deactivation even if Clerk deletion fails
        // This ensures the user is still marked as inactive in our system
        console.log("⚠️ Continuing with database deactivation");
      }
    } else {
      console.log("ℹ️ No Clerk ID found, skipping Clerk deletion");
    }

    // Mark user as inactive in database (soft delete)
    console.log("📝 Marking user as inactive in database...");
    const { data: deactivateData } = await adminApolloClient.mutate({
      mutation: DEACTIVATE_USER,
      variables: {
        id: staffId,
        deactivatedBy: userId,
      },
    });

    const deactivatedUser = deactivateData?.update_users_by_pk;
    if (!deactivatedUser) {
      return NextResponse.json(
        { error: "Failed to deactivate user in database" },
        { status: 500 }
      );
    }

    console.log("✅ User deactivated successfully");

    return NextResponse.json({
      success: true,
      message: "User deactivated successfully",
      user: deactivatedUser,
      clerkDeleted,
      auditInfo: {
        deactivatedAt: deactivatedUser.deactivated_at,
        deactivatedBy: userId,
        originalRole: user.role,
        hadClerkAccount: !!user.clerk_user_id,
      },
    });
  } catch (error) {
    console.error("❌ Error deactivating user:", error);
    return NextResponse.json(
      {
        error: "Failed to deactivate user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check if user can be deleted and show preview
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

    // Get user details for deletion preview
    const { data: userData } = await adminApolloClient.query({
      query: GET_USER_FOR_DELETION,
      variables: { id: staffId },
      fetchPolicy: "no-cache",
    });

    const user = userData?.users_by_pk;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
      canDelete: user.is_active,
      warnings: [
        ...(user.clerk_user_id
          ? ["User will be deleted from Clerk and lose access immediately"]
          : []),
        "User will be marked as inactive in database but data will be retained",
        "This action cannot be undone",
      ],
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
