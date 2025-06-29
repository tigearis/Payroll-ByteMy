#!/usr/bin/env node
import { config } from "dotenv";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { gql } from "@apollo/client";

// Load environment variables
config({ path: ".env.local" });

const UPDATE_NULL_ROLES = gql`
  mutation UpdateNullRoles {
    updateUsers(
      where: { role: { _isNull: true } }
      _set: { role: "viewer" }
    ) {
      affectedRows
      returning {
        id
        name
        email
        role
      }
    }
  }
`;

const GET_USERS_WITH_NULL_ROLES = gql`
  query GetUsersWithNullRoles {
    users(where: { role: { _isNull: true } }) {
      id
      name
      email
      clerkUserId
      isActive
    }
  }
`;

async function fixNullUserRoles() {
  console.log("🔍 Checking for users with null roles...");
  
  try {
    // First, check how many users have null roles
    const { data: checkData } = await adminApolloClient.query({
      query: GET_USERS_WITH_NULL_ROLES,
      fetchPolicy: "no-cache"
    });
    
    const nullRoleUsers = checkData?.users || [];
    
    if (nullRoleUsers.length === 0) {
      console.log("✅ No users with null roles found!");
      return;
    }
    
    console.log(`⚠️  Found ${nullRoleUsers.length} users with null roles:`);
    nullRoleUsers.forEach((user: any) => {
      console.log(`   - ${user.name} (${user.email}) - ID: ${user.id}`);
    });
    
    console.log("\n🔧 Updating all null roles to 'viewer'...");
    
    // Update all null roles to 'viewer'
    const { data: updateData } = await adminApolloClient.mutate({
      mutation: UPDATE_NULL_ROLES
    });
    
    const affectedRows = updateData?.updateUsers?.affectedRows || 0;
    const updatedUsers = updateData?.updateUsers?.returning || [];
    
    console.log(`\n✅ Successfully updated ${affectedRows} users:`);
    updatedUsers.forEach((user: any) => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
  } catch (error) {
    console.error("❌ Error fixing null user roles:", error);
    process.exit(1);
  }
}

// Run the script
fixNullUserRoles()
  .then(() => {
    console.log("\n✅ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });