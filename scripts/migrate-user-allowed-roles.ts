/**
 * Migration Script: Add allowedRoles to User Metadata
 * 
 * This script updates existing users to include the allowedRoles
 * field in their Clerk public metadata based on their current role.
 * 
 * Usage: npx tsx scripts/migrate-user-allowed-roles.ts
 */

import { clerkClient } from "@clerk/nextjs/server";
import { getAllowedRoles, Role } from "../lib/auth/permissions";
import { adminApolloClient } from "../lib/apollo/unified-client";
import { gql } from "@apollo/client";

// GraphQL query to get all users
const GET_ALL_USERS = gql`
  query GetAllUsersForMigration {
    users {
      id
      clerkUserId
      role
      name
      email
    }
  }
`;

interface DatabaseUser {
  id: string;
  clerkUserId: string;
  role: Role;
  name: string;
  email: string;
}

async function migrateUserAllowedRoles() {
  console.log("🚀 Starting allowed roles migration...");
  
  try {
    // Get all users from database
    console.log("📊 Fetching users from database...");
    const { data } = await adminApolloClient.query({
      query: GET_ALL_USERS,
      fetchPolicy: "network-only"
    });

    const users: DatabaseUser[] = data?.users || [];
    console.log(`Found ${users.length} users to migrate`);

    if (users.length === 0) {
      console.log("No users found. Migration complete.");
      return;
    }

    const clerk = await clerkClient();
    let successCount = 0;
    let errorCount = 0;
    const errors: Array<{ user: DatabaseUser; error: string }> = [];

    // Process users in batches to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(users.length / batchSize)}`);
      
      await Promise.all(
        batch.map(async (user) => {
          try {
            if (!user.clerkUserId) {
              console.warn(`⚠️ Skipping user ${user.name} - no Clerk ID`);
              return;
            }

            // Get current Clerk user data
            const clerkUser = await clerk.users.getUser(user.clerkUserId);
            const currentMetadata = clerkUser.publicMetadata || {};
            
            // Calculate allowed roles based on current role
            const allowedRoles = getAllowedRoles(user.role);
            
            // Check if allowedRoles already exists and is correct
            const existingAllowedRoles = currentMetadata.allowedRoles as Role[];
            if (existingAllowedRoles && 
                JSON.stringify(existingAllowedRoles.sort()) === JSON.stringify(allowedRoles.sort())) {
              console.log(`✅ ${user.name} (${user.role}) - allowedRoles already correct`);
              successCount++;
              return;
            }

            // Update metadata with allowedRoles
            await clerk.users.updateUser(user.clerkUserId, {
              publicMetadata: {
                ...currentMetadata,
                allowedRoles,
                migratedAt: new Date().toISOString(),
                migrationVersion: "1.0.0"
              }
            });

            console.log(`✅ ${user.name} (${user.role}) - added allowedRoles: [${allowedRoles.join(", ")}]`);
            successCount++;
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`❌ Failed to migrate ${user.name}: ${errorMessage}`);
            errors.push({ user, error: errorMessage });
            errorCount++;
          }
        })
      );

      // Add delay between batches to respect rate limits
      if (i + batchSize < users.length) {
        console.log("⏳ Waiting 2 seconds before next batch...");
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Migration summary
    console.log("\n📋 Migration Summary:");
    console.log(`✅ Successfully migrated: ${successCount} users`);
    console.log(`❌ Failed migrations: ${errorCount} users`);
    
    if (errors.length > 0) {
      console.log("\n❌ Migration Errors:");
      errors.forEach(({ user, error }) => {
        console.log(`  - ${user.name} (${user.email}): ${error}`);
      });
    }

    // Verification step
    console.log("\n🔍 Verifying migration...");
    await verifyMigration(users);

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

async function verifyMigration(users: DatabaseUser[]) {
  const clerk = await clerkClient();
  let verificationCount = 0;
  let verificationErrors = 0;

  for (const user of users.slice(0, 10)) { // Verify first 10 users
    try {
      if (!user.clerkUserId) continue;

      const clerkUser = await clerk.users.getUser(user.clerkUserId);
      const metadata = clerkUser.publicMetadata;
      const allowedRoles = metadata?.allowedRoles as Role[];
      const expectedRoles = getAllowedRoles(user.role);

      if (!allowedRoles) {
        console.error(`❌ Verification failed for ${user.name}: no allowedRoles in metadata`);
        verificationErrors++;
        continue;
      }

      if (JSON.stringify(allowedRoles.sort()) !== JSON.stringify(expectedRoles.sort())) {
        console.error(`❌ Verification failed for ${user.name}: incorrect allowedRoles`);
        console.error(`  Expected: [${expectedRoles.join(", ")}]`);
        console.error(`  Actual: [${allowedRoles.join(", ")}]`);
        verificationErrors++;
        continue;
      }

      console.log(`✅ Verification passed for ${user.name}`);
      verificationCount++;

    } catch (error) {
      console.error(`❌ Verification error for ${user.name}:`, error);
      verificationErrors++;
    }
  }

  console.log(`\n🔍 Verification Results: ${verificationCount} passed, ${verificationErrors} failed`);
}

// Helper function to show role hierarchy
function showRoleHierarchy() {
  console.log("\n📊 Role Hierarchy and Allowed Roles:");
  const roles: Role[] = ["developer", "org_admin", "manager", "consultant", "viewer"];
  
  roles.forEach(role => {
    const allowedRoles = getAllowedRoles(role);
    console.log(`  ${role}: [${allowedRoles.join(", ")}]`);
  });
}

// Run migration
async function main() {
  console.log("🔧 User Allowed Roles Migration");
  console.log("================================");
  
  showRoleHierarchy();
  
  // Confirm before running in production
  if (process.env.NODE_ENV === "production") {
    console.log("\n⚠️ WARNING: Running in production environment!");
    console.log("This will modify user metadata for all users.");
    console.log("Make sure you have backed up your data.");
    
    // In a real scenario, you might want to require explicit confirmation
    // process.exit(0);
  }

  await migrateUserAllowedRoles();
  console.log("\n🎉 Migration completed!");
}

if (require.main === module) {
  main().catch(error => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
}

export { migrateUserAllowedRoles };