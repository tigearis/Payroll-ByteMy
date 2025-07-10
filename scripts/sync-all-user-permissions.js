#!/usr/bin/env node

/**
 * Sync All User Permissions
 *
 * This script syncs all users in the database with their correct permissions
 * in Clerk metadata based on their roles.
 */

import dotenv from "dotenv";
import { gql } from "@apollo/client";
import { createClient } from "@clerk/clerk-sdk-node";
import { adminApolloClient } from "../lib/apollo/unified-client.js";

// Load environment variables
dotenv.config();

// Initialize Clerk client
const clerk = createClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// GraphQL query to get all users
const GET_ALL_USERS = gql`
  query GetAllUsers {
    users(order_by: { created_at: desc }) {
      id
      name
      email
      role
      clerk_user_id
      is_staff
      manager_id
      is_active
    }
  }
`;

// Import permission functions
async function getPermissionsForRole(role) {
  const permissions = {
    developer: [
      "dashboard.read",
      "dashboard.list",
      "clients.read",
      "clients.create",
      "clients.update",
      "clients.delete",
      "clients.list",
      "clients.manage",
      "payrolls.read",
      "payrolls.create",
      "payrolls.update",
      "payrolls.delete",
      "payrolls.approve",
      "payrolls.list",
      "payrolls.manage",
      "schedule.read",
      "schedule.create",
      "schedule.update",
      "schedule.delete",
      "schedule.approve",
      "schedule.list",
      "schedule.manage",
      "workschedule.read",
      "workschedule.create",
      "workschedule.update",
      "workschedule.delete",
      "workschedule.approve",
      "workschedule.list",
      "workschedule.manage",
      "staff.read",
      "staff.create",
      "staff.update",
      "staff.delete",
      "staff.list",
      "staff.manage",
      "leave.read",
      "leave.create",
      "leave.update",
      "leave.delete",
      "leave.approve",
      "leave.list",
      "leave.manage",
      "ai.read",
      "ai.manage",
      "bulkupload.read",
      "bulkupload.create",
      "bulkupload.delete",
      "bulkupload.approve",
      "bulkupload.list",
      "bulkupload.manage",
      "reports.read",
      "reports.create",
      "reports.list",
      "reports.manage",
      "billing.read",
      "billing.create",
      "billing.update",
      "billing.delete",
      "billing.approve",
      "billing.list",
      "billing.manage",
      "email.read",
      "email.create",
      "email.manage",
      "invitations.read",
      "invitations.create",
      "invitations.update",
      "invitations.delete",
      "invitations.list",
      "invitations.manage",
      "settings.read",
      "settings.update",
      "settings.manage",
      "security.read",
      "security.manage",
      "developer.read",
      "developer.create",
      "developer.update",
      "developer.delete",
      "developer.list",
      "developer.manage",
    ],

    org_admin: [
      "dashboard.read",
      "dashboard.list",
      "clients.read",
      "clients.create",
      "clients.update",
      "clients.delete",
      "clients.list",
      "clients.manage",
      "payrolls.read",
      "payrolls.create",
      "payrolls.update",
      "payrolls.delete",
      "payrolls.approve",
      "payrolls.list",
      "payrolls.manage",
      "schedule.read",
      "schedule.create",
      "schedule.update",
      "schedule.delete",
      "schedule.approve",
      "schedule.list",
      "schedule.manage",
      "workschedule.read",
      "workschedule.create",
      "workschedule.update",
      "workschedule.delete",
      "workschedule.approve",
      "workschedule.list",
      "workschedule.manage",
      "staff.read",
      "staff.create",
      "staff.update",
      "staff.delete",
      "staff.list",
      "staff.manage",
      "leave.read",
      "leave.create",
      "leave.update",
      "leave.delete",
      "leave.approve",
      "leave.list",
      "leave.manage",
      "ai.read",
      "ai.manage",
      "bulkupload.read",
      "bulkupload.create",
      "bulkupload.delete",
      "bulkupload.approve",
      "bulkupload.list",
      "bulkupload.manage",
      "reports.read",
      "reports.create",
      "reports.list",
      "reports.manage",
      "billing.read",
      "billing.create",
      "billing.update",
      "billing.delete",
      "billing.approve",
      "billing.list",
      "billing.manage",
      "email.read",
      "email.create",
      "email.manage",
      "invitations.read",
      "invitations.create",
      "invitations.update",
      "invitations.delete",
      "invitations.list",
      "invitations.manage",
      "settings.read",
      "settings.update",
      "settings.manage",
      "security.read",
      "security.manage",
    ],

    manager: [
      "dashboard.read",
      "dashboard.list",
      "clients.read",
      "clients.create",
      "clients.update",
      "clients.list",
      "payrolls.read",
      "payrolls.create",
      "payrolls.update",
      "payrolls.delete",
      "payrolls.approve",
      "payrolls.list",
      "payrolls.manage",
      "schedule.read",
      "schedule.create",
      "schedule.update",
      "schedule.delete",
      "schedule.approve",
      "schedule.list",
      "workschedule.read",
      "workschedule.create",
      "workschedule.update",
      "workschedule.delete",
      "workschedule.approve",
      "workschedule.list",
      "staff.read",
      "staff.create",
      "staff.update",
      "staff.list",
      "leave.read",
      "leave.create",
      "leave.update",
      "leave.delete",
      "leave.approve",
      "leave.list",
      "ai.read",
      "ai.manage",
      "bulkupload.read",
      "bulkupload.create",
      "bulkupload.delete",
      "bulkupload.approve",
      "bulkupload.list",
      "reports.read",
      "reports.create",
      "reports.list",
      "billing.read",
      "billing.create",
      "billing.update",
      "billing.approve",
      "billing.list",
      "email.read",
      "email.create",
      "invitations.read",
      "invitations.create",
      "invitations.update",
      "invitations.delete",
      "invitations.list",
      "settings.read",
      "security.read",
    ],

    consultant: [
      "dashboard.read",
      "clients.read",
      "payrolls.read",
      "payrolls.update",
      "schedule.read",
      "workschedule.read",
      "workschedule.update",
      "staff.read",
      "leave.read",
      "leave.create",
      "reports.read",
      "billing.read",
      "ai.read",
    ],

    viewer: [
      "dashboard.read",
      "clients.read",
      "payrolls.read",
      "schedule.read",
      "workschedule.read",
      "staff.read",
      "leave.read",
      "reports.read",
    ],
  };

  return permissions[role] || [];
}

function getAllowedRoles(role) {
  switch (role) {
    case "developer":
      return ["viewer", "consultant", "manager", "org_admin", "developer"];
    case "org_admin":
      return ["viewer", "consultant", "manager", "org_admin"];
    case "manager":
      return ["viewer", "consultant"];
    default:
      return [];
  }
}

async function syncAllUsers() {
  console.log("🔄 Starting user permission sync...\n");

  try {
    // Get all users from database
    const { data } = await adminApolloClient.query({
      query: GET_ALL_USERS,
      fetchPolicy: "network-only",
    });

    const users = data.users || [];
    console.log(`📊 Found ${users.length} users to sync\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const user of users) {
      if (!user.clerk_user_id) {
        console.log(`⏭️  Skipping ${user.email} - No Clerk ID`);
        skipCount++;
        continue;
      }

      try {
        // Get permissions for the user's role
        const permissions = await getPermissionsForRole(user.role);
        const allowedRoles = getAllowedRoles(user.role);

        // Get current Clerk user
        const clerkUser = await clerk.users.getUser(user.clerk_user_id);

        // Update Clerk metadata
        await clerk.users.updateUser(user.clerk_user_id, {
          publicMetadata: {
            ...clerkUser.publicMetadata,
            role: user.role,
            databaseId: user.id,
            isStaff: user.is_staff,
            managerId: user.manager_id,
            permissions: permissions,
            allowedRoles: allowedRoles,
            permissionsUpdatedAt: new Date().toISOString(),
            permissionsVersion: "1.0",
            lastSyncAt: new Date().toISOString(),
          },
        });

        console.log(
          `✅ ${user.email} (${user.role}) - ${permissions.length} permissions synced`
        );
        successCount++;
      } catch (error) {
        console.error(`❌ ${user.email} - Error: ${error.message}`);
        errorCount++;
      }
    }

    console.log("\n📊 Sync Summary:");
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ⏭️  Skipped: ${skipCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📋 Total: ${users.length}`);

    console.log("\n🎉 Permission sync completed!");
  } catch (error) {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  }
}

// Run the sync
syncAllUsers().catch(console.error);
