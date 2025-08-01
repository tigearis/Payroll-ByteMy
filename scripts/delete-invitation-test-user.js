#!/usr/bin/env node

/**
 * Script to delete the "INVITATION Test" user and all invitations from the database
 * Usage: node scripts/delete-invitation-test-user.js
 */

import { gql } from "@apollo/client";
import { adminApolloClient } from "../lib/apollo/unified-client.js";

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

async function main() {
  try {
    console.log("🔍 Searching for users matching 'INVITATION Test'...");
    
    // Find users matching the search term
    const { data: userData } = await adminApolloClient.query({
      query: FIND_USER_BY_NAME,
      variables: { searchTerm: "%INVITATION%Test%" },
      fetchPolicy: "network-only"
    });

    console.log(`Found ${userData.users.length} matching users:`);
    userData.users.forEach(user => {
      console.log(`  - ${user.computedName} (${user.email}) - ID: ${user.id}`);
    });

    if (userData.users.length === 0) {
      console.log("❌ No users found matching 'INVITATION Test'");
    }

    // Get all invitations
    console.log("\n🔍 Getting all invitations...");
    const { data: invitationData } = await adminApolloClient.query({
      query: GET_ALL_INVITATIONS,
      fetchPolicy: "network-only"
    });

    console.log(`Found ${invitationData.userInvitations.length} invitations total:`);
    invitationData.userInvitations.forEach(invitation => {
      console.log(`  - ${invitation.firstName} ${invitation.lastName} (${invitation.email}) - Status: ${invitation.invitationStatus}`);
    });

    // Confirm deletion
    console.log("\n⚠️  WARNING: This will permanently delete:");
    console.log(`  - ${userData.users.length} user(s) matching 'INVITATION Test'`);
    console.log(`  - ${invitationData.userInvitations.length} invitation(s)`);
    console.log("\nThis action cannot be undone!");

    // In a real scenario, you'd want user confirmation here
    // For now, we'll proceed with a safety check
    const shouldProceed = process.argv.includes('--confirm');
    
    if (!shouldProceed) {
      console.log("\n🛑 Dry run complete. To actually delete, run:");
      console.log("node scripts/delete-invitation-test-user.js --confirm");
      return;
    }

    console.log("\n🗑️  Proceeding with deletion...");

    // Delete all invitations first
    if (invitationData.userInvitations.length > 0) {
      console.log("Deleting all invitations...");
      const { data: deleteInvitationsResult } = await adminApolloClient.mutate({
        mutation: DELETE_ALL_INVITATIONS
      });
      
      console.log(`✅ Deleted ${deleteInvitationsResult.deleteUserInvitations.affectedRows} invitations`);
      deleteInvitationsResult.deleteUserInvitations.returning.forEach(invitation => {
        console.log(`  - Deleted invitation for ${invitation.firstName} ${invitation.lastName} (${invitation.email})`);
      });
    }

    // Delete matching users
    for (const user of userData.users) {
      console.log(`Deleting user: ${user.computedName} (${user.email})...`);
      
      const { data: deleteUserResult } = await adminApolloClient.mutate({
        mutation: DELETE_USER_BY_ID,
        variables: { userId: user.id }
      });

      if (deleteUserResult.deleteUsersByPk) {
        console.log(`✅ Deleted user: ${deleteUserResult.deleteUsersByPk.computedName}`);
      } else {
        console.log(`❌ Failed to delete user: ${user.computedName}`);
      }
    }

    console.log("\n🎉 Cleanup completed successfully!");

  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    
    if (error.graphQLErrors) {
      error.graphQLErrors.forEach(gqlError => {
        console.error("GraphQL Error:", gqlError.message);
      });
    }
    
    if (error.networkError) {
      console.error("Network Error:", error.networkError.message);
    }
    
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);