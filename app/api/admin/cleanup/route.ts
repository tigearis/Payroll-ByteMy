import { NextRequest, NextResponse } from "next/server";
import { gql } from "@apollo/client";
import { executeTypedQuery, executeTypedMutation } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";

// GraphQL queries and mutations
const FIND_USER_BY_NAME = gql`
  query FindUserByName($searchTerm: String!) {
    users(where: {
      _or: [
        { firstName: { _ilike: $searchTerm } }
        { lastName: { _ilike: $searchTerm } }
        { computedName: { _ilike: $searchTerm } }
      ]
    }) {
      id
      firstName
      lastName
      computedName
      email
      clerkUserId
      role
      isActive
      createdAt
    }
  }
`;

const GET_ALL_INVITATIONS = gql`
  query GetAllInvitations {
    userInvitations {
      id
      email
      firstName
      lastName
      invitedRole
      invitationStatus
      invitedAt
      expiresAt
      clerkInvitationId
    }
  }
`;

const DELETE_USER_BY_ID = gql`
  mutation DeleteUserById($userId: uuid!) {
    deleteUsersByPk(id: $userId) {
      id
      computedName
      email
    }
  }
`;

const DELETE_ALL_INVITATIONS = gql`
  mutation DeleteAllInvitations {
    deleteUserInvitations(where: {}) {
      affectedRows
      returning {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    // Only allow developers and org_admins to perform cleanup
    if (!['developer', 'org_admin'].includes(session.role || '')) {
      return NextResponse.json(
        { error: 'Insufficient permissions for cleanup operations' },
        { status: 403 }
      );
    }

    const { action, confirm } = await req.json();

    if (action === 'preview') {
      // Preview what would be deleted
      console.log("🔍 Searching for users matching 'INVITATION Test'...");
      
      const userData = await executeTypedQuery(
        FIND_USER_BY_NAME,
        { searchTerm: "%INVITATION%Test%" }
      );

      const invitationData = await executeTypedQuery(GET_ALL_INVITATIONS, {});

      return NextResponse.json({
        success: true,
        preview: {
          users: userData.users || [],
          invitations: invitationData.userInvitations || [],
          summary: {
            usersToDelete: userData.users?.length || 0,
            invitationsToDelete: invitationData.userInvitations?.length || 0
          }
        }
      });
    }

    if (action === 'delete' && confirm === true) {
      const results = {
        deletedUsers: [],
        deletedInvitations: [],
        errors: []
      };

      try {
        // Get data first
        const userData = await executeTypedQuery(
          FIND_USER_BY_NAME,
          { searchTerm: "%INVITATION%Test%" }
        );

        const invitationData = await executeTypedQuery(GET_ALL_INVITATIONS, {});

        // Delete all invitations first
        if (invitationData.userInvitations && invitationData.userInvitations.length > 0) {
          console.log("Deleting all invitations...");
          const deleteInvitationsResult = await executeTypedMutation(DELETE_ALL_INVITATIONS, {});
          
          results.deletedInvitations = deleteInvitationsResult.deleteUserInvitations.returning;
          console.log(`✅ Deleted ${deleteInvitationsResult.deleteUserInvitations.affectedRows} invitations`);
        }

        // Delete matching users
        if (userData.users) {
          for (const user of userData.users) {
            try {
              console.log(`Deleting user: ${user.computedName} (${user.email})...`);
              
              const deleteUserResult = await executeTypedMutation(
                DELETE_USER_BY_ID,
                { userId: user.id }
              );

              if (deleteUserResult.deleteUsersByPk) {
                results.deletedUsers.push(deleteUserResult.deleteUsersByPk);
                console.log(`✅ Deleted user: ${deleteUserResult.deleteUsersByPk.computedName}`);
              }
            } catch (userDeleteError) {
              console.error(`❌ Failed to delete user ${user.computedName}:`, userDeleteError);
              results.errors.push(`Failed to delete user ${user.computedName}: ${userDeleteError.message}`);
            }
          }
        }

        return NextResponse.json({
          success: true,
          message: `Cleanup completed. Deleted ${results.deletedUsers.length} users and ${results.deletedInvitations.length} invitations.`,
          results
        });

      } catch (cleanupError) {
        console.error("❌ Error during cleanup:", cleanupError);
        return NextResponse.json({
          success: false,
          error: `Cleanup failed: ${cleanupError.message}`,
          results
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      error: 'Invalid action. Use "preview" to see what would be deleted, or "delete" with confirm=true to proceed.'
    }, { status: 400 });

  } catch (error) {
    console.error("❌ Cleanup API error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
});