#!/usr/bin/env tsx

import { clerkClient } from "@clerk/nextjs/server";
import { getPermissionsForRole } from "../lib/auth/permissions";

async function fixUserPermissions() {
  const userId = "user_2yU7Nspg9Nemmy1FdKE1SFIofms"; // The user having issues
  
  try {
    console.log("🔧 Fixing user permissions for:", userId);
    
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    console.log("📋 Current public metadata:", JSON.stringify(user.publicMetadata, null, 2));
    
    // Get the user's role and permissions
    const role = user.publicMetadata?.role || "developer";
    const permissions = getPermissionsForRole(role);
    
    // Convert permissions array to JSON string for the JWT template
    const permissionsString = JSON.stringify(permissions);
    
    // Update metadata with permissions as a JSON string
    const updatedMetadata = {
      ...user.publicMetadata,
      role: role,
      databaseId: user.publicMetadata?.databaseId || "d9ac8a7b-f679-49a1-8c99-837eb977578b",
      permissions: permissionsString, // Store as JSON string instead of array
      lastSyncAt: new Date().toISOString(),
    };
    
    await client.users.updateUser(userId, {
      publicMetadata: updatedMetadata
    });
    
    console.log("✅ Updated public metadata:", JSON.stringify(updatedMetadata, null, 2));
    
    // Verify the update
    const updatedUser = await client.users.getUser(userId);
    console.log("🔍 Verified metadata:", JSON.stringify(updatedUser.publicMetadata, null, 2));
    
  } catch (error) {
    console.error("❌ Error fixing user permissions:", error);
    process.exit(1);
  }
}

fixUserPermissions().then(() => {
  console.log("✅ Done!");
  process.exit(0);
});