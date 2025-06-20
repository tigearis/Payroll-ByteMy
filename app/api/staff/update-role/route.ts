import { handleApiError, createSuccessResponse } from "@/lib/shared/error-handling";
import { NextRequest, NextResponse } from "next/server";
import { adminApolloClient } from "@/lib/apollo/server-client";
import { gql } from "@apollo/client";
import { withEnhancedAuth } from "@/lib/auth/enhanced-api-auth";
import { MetadataManager } from "@/lib/auth/metadata-manager.server";
import { isValidUserRole, Role } from "@/types/permissions";

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

export const POST = withEnhancedAuth(
  async (req: NextRequest, context) => {
    try {
      console.log("🔧 API called: /api/staff/update-role");

      const body = await req.json();
      const { staffId, newRole } = body;

      if (!staffId || !newRole) {
        return NextResponse.json(
          { error: "Staff ID and new role are required" },
          { status: 400 }
        );
      }

      // Validate the new role
      if (!isValidUserRole(newRole)) {
        return NextResponse.json(
          { error: `Invalid role: ${newRole}` },
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

      // Update enhanced permissions using MetadataManager
      if (user.clerk_user_id) {
        console.log(
          `🔄 Updating enhanced permissions for ${user.clerk_user_id}...`
        );

        try {
          await MetadataManager.updateUserRole(
            user.clerk_user_id,
            newRole as Role,
            context.userId
          );
          console.log("✅ Enhanced permissions updated successfully");
        } catch (error) {
          console.error("Error updating enhanced permissions:", error);
          // Continue even if enhanced permissions update fails
        }
      }

      return NextResponse.json({
        success: true,
        message: "Staff role updated successfully",
        updatedUser,
      });
    } catch (error) {
      return handleApiError(error, "staff");
    }
  },
  {
    permission: "custom:staff:write",
  }
);
