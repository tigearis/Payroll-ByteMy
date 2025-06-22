// scripts/fix-user-metadata.js
const { clerkClient } = require("@clerk/nextjs/server");
const { gql } = require("@apollo/client");

// You need to run this with the database ID and role for the user
const CLERK_USER_ID = "user_2yU7Nspg9Nemmy1FdKE1SFIofms";
const USER_EMAIL = "nathan.harris02@gmail.com";

// Query to get user by email
const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
      clerk_user_id
      role
      name
      email
      is_staff
      manager_id
    }
  }
`;

async function fixUserMetadata() {
  try {
    console.log("🔧 Starting metadata fix for user:", CLERK_USER_ID);

    // First, let's see what's currently in Clerk
    const client = await clerkClient();
    const currentUser = await client.users.getUser(CLERK_USER_ID);

    console.log("📋 Current Clerk metadata:", {
      publicMetadata: currentUser.publicMetadata,
      privateMetadata: currentUser.privateMetadata,
    });

    // Mock Apollo client call - you'll need to implement the actual DB query
    // For now, let's assume we found the user in DB with these values:
    const assumedDatabaseUser = {
      id: "YOUR_DATABASE_UUID_HERE", // Replace with actual UUID from database
      role: "developer",
      is_staff: true,
      manager_id: null,
    };

    console.log("💾 Database user (assumed):", assumedDatabaseUser);

    // Update Clerk metadata with correct values
    const updatedMetadata = {
      role: assumedDatabaseUser.role,
      databaseId: assumedDatabaseUser.id, // This is the critical field!
      isStaff: assumedDatabaseUser.is_staff,
      managerId: assumedDatabaseUser.manager_id,
      lastSyncAt: new Date().toISOString(),
      fixedAt: new Date().toISOString(),
    };

    console.log("🔄 Updating Clerk with metadata:", updatedMetadata);

    await client.users.updateUser(CLERK_USER_ID, {
      publicMetadata: updatedMetadata,
      privateMetadata: {
        ...currentUser.privateMetadata,
        lastFixAt: new Date().toISOString(),
        fixVersion: Date.now(),
      },
    });

    // Verify the update
    const verifyUser = await client.users.getUser(CLERK_USER_ID);
    console.log("✅ Updated metadata verification:", {
      databaseId: verifyUser.publicMetadata.databaseId,
      role: verifyUser.publicMetadata.role,
      isStaff: verifyUser.publicMetadata.isStaff,
    });

    console.log("🎉 Metadata fix completed successfully!");
    console.log(
      "⚠️  Note: You still need to fix the JWT template in Clerk Dashboard"
    );
  } catch (error) {
    console.error("❌ Error fixing metadata:", error);
  }
}

// Export for use
if (typeof module !== "undefined" && module.exports) {
  module.exports = { fixUserMetadata };
}

// Run if called directly
if (require.main === module) {
  fixUserMetadata();
}
