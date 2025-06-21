import { gql } from "@apollo/client";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/lib/auth/api-auth";
import { adminApolloClient } from "@/lib/apollo/unified-client";


// GraphQL mutation to update user role in database
const UPDATE_STAFF_ROLE = gql`
  mutation UpdateStaffRole($id: uuid!, $role: user_role!) {
    update_users_by_pk(
      pk_columns: { id: $id }
      _set: { role: $role, updated_at: "now()" }
    ) {
      id
      name
      email
      role
      clerk_user_id
      updated_at
    }
  }
`;

// Query to get user's Clerk ID from database
const GET_USER_CLERK_ID = gql`
  query GetUserClerkId($id: uuid!) {
    users_by_pk(id: $id) {
      id
      name
      email
      role
      clerk_user_id
    }
  }
`;

export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      console.log("🔧 API called: /api/staff/update-role");

      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }

    const body = await req.json();
    const { staffId, newRole } = body;

    if (!staffId || !newRole) {
      return NextResponse.json(
        { error: "Staff ID and new role are required" },
        { status: 400 }
      );
    }

    console.log(`🔄 Updating staff ${staffId} role to ${newRole}`);

    // First, get the user's Clerk ID from the database
    const { data: userData } = await adminApolloClient.query({
      query: GET_USER_CLERK_ID,
      variables: { id: staffId },
      fetchPolicy: "no-cache",
    });

    const user = userData?.users_by_pk;
    if (!user) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    // Update database first
    console.log("📝 Updating database...");
    const { data: updateData } = await adminApolloClient.mutate({
      mutation: UPDATE_STAFF_ROLE,
      variables: {
        id: staffId,
        role: newRole,
      },
    });

    const updatedUser = updateData?.update_users_by_pk;
    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update database" },
        { status: 500 }
      );
    }

    console.log("✅ Database updated successfully");

    // If user has a Clerk ID, update Clerk metadata too
    if (user.clerk_user_id) {
      console.log(`🔄 Updating Clerk metadata for ${user.clerk_user_id}...`);

      try {
        const client = await clerkClient();

        // Get current metadata to preserve other fields
        const clerkUser = await client.users.getUser(user.clerk_user_id);

        await client.users.updateUserMetadata(user.clerk_user_id, {
          publicMetadata: {
            ...clerkUser.publicMetadata,
            role: newRole, // Update to new role
            databaseId: user.id,
            lastSyncAt: new Date().toISOString(),
          },
          privateMetadata: {
            ...clerkUser.privateMetadata,
            lastRoleUpdateAt: new Date().toISOString(),
            updatedBy: userId,
          },
        });

        console.log("✅ Clerk metadata updated successfully");
      } catch (clerkError) {
        console.warn("⚠️ Failed to update Clerk metadata:", clerkError);
        // Don't fail the whole operation if Clerk update fails
        // The database update was successful
      }
    } else {
      console.log("ℹ️ No Clerk ID found, skipping Clerk metadata update");
    }

    return NextResponse.json({
      success: true,
      message: "Role updated successfully",
      user: updatedUser,
      clerkSynced: !!user.clerk_user_id,
    });
  } catch (error) {
    console.error("❌ Error updating staff role:", error);
    return NextResponse.json(
      {
        error: "Failed to update staff role",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
  },
  {
    requiredRole: "manager",
  }
);
