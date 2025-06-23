import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import {
  getUserPermissions,
  canAssignRole,
  UserRole,
  updateUserRole,
} from "@/domains/users/services/user-sync";
import { 
  GetUserByIdCompleteDocument,
  GetUserByClerkIdCompleteDocument 
} from "@/domains/users/graphql/generated/graphql";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { withAuthParams } from "@/lib/auth/api-auth";
import {
  auditLogger,
  LogLevel,
  LogCategory,
  SOC2EventType,
} from "@/lib/security/audit/logger";

// Helper function to get current user's role
async function getCurrentUserRole(
  userId: string
): Promise<UserRole | "developer"> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return (user.publicMetadata?.role as UserRole | "developer") || "viewer";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "viewer";
  }
}

// Helper function to check if UUID format
function isUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// GET /api/users/[id] - Get specific user details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: targetId } = await params;
    const currentUserRole = await getCurrentUserRole(userId);
    const permissions = getUserPermissions(currentUserRole);

    // Users can view their own profile, admins/managers can view others
    const isSelf = targetId === userId;
    if (!permissions.canManageUsers && !isSelf) {
      return NextResponse.json(
        { error: "Insufficient permissions to view user details" },
        { status: 403 }
      );
    }

    // Log SOC2 audit event
    const clientInfo = auditLogger.extractClientInfo(request);
    await auditLogger.logSOC2Event({
      level: LogLevel.AUDIT,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
      userId,
      resourceId: targetId,
      resourceType: "user",
      action: "VIEW",
      success: true,
      ipAddress: clientInfo.ipAddress || "unknown",
      userAgent: clientInfo.userAgent || "unknown",
      metadata: {
        isSelf,
        viewerRole: currentUserRole,
        accessType: isSelf ? "self_view" : "admin_view",
      },
      complianceNote: `User profile accessed for: ${targetId}`,
    });

    console.log(`👤 Fetching user details for: ${targetId}`);

    let userData;
    let errors;

    // Determine if ID is UUID (database ID) or Clerk ID
    if (isUUID(targetId)) {
      // Database ID
      const result = await adminApolloClient.query({
        query: GetUserByIdCompleteDocument,
        variables: { id: targetId },
        fetchPolicy: "network-only",
        errorPolicy: "all",
      });
      userData = result.data?.user;
      errors = result.errors;
    } else {
      // Clerk ID
      const result = await adminApolloClient.query({
        query: GetUserByClerkIdCompleteDocument,
        variables: { clerkId: targetId },
        fetchPolicy: "network-only",
        errorPolicy: "all",
      });
      userData = result.data?.users?.[0];
      errors = result.errors;
    }

    if (errors) {
      console.error("GraphQL errors:", errors);
      return NextResponse.json(
        { error: "Failed to fetch user", details: errors },
        { status: 500 }
      );
    }

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get additional Clerk information
    const client = await clerkClient();
    let clerkUser;
    try {
      if (userData.clerkUserId) {
        clerkUser = await client.users.getUser(userData.clerkUserId);
      }
    } catch (error) {
      console.warn("Could not fetch Clerk user details:", error);
    }

    return NextResponse.json({
      success: true,
      user: {
        ...userData,
        lastSignIn: clerkUser?.lastSignInAt,
        createdAt: clerkUser?.createdAt,
        imageUrl: clerkUser?.imageUrl,
        emailVerified:
          clerkUser?.emailAddresses?.[0]?.verification?.status === "verified",
      },
      permissions: {
        canEdit: permissions.canManageUsers || isSelf,
        canChangeRole: permissions.canManageUsers && !isSelf,
        canDelete:
          permissions.canManageUsers &&
          !isSelf &&
          userData.role !== "developer",
        currentUserRole,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user details
export const PUT = withAuthParams(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
    session
  ) => {
    try {
      const { userId } = await auth();

      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { id: targetId } = await params;
      const currentUserRole = await getCurrentUserRole(userId);
      const permissions = getUserPermissions(currentUserRole);

      // Parse request body
      const { name, email, role, managerId, isStaff } = await request.json();

      // Check permissions
      const isSelf = targetId === userId;
      const canEditProfile = permissions.canManageUsers || isSelf;
      const canChangeRole = permissions.canManageUsers && !isSelf;

      if (!canEditProfile) {
        return NextResponse.json(
          { error: "Insufficient permissions to update user" },
          { status: 403 }
        );
      }

      // If changing role, validate permissions
      if (role && role !== undefined && !canChangeRole) {
        return NextResponse.json(
          { error: "Insufficient permissions to change user role" },
          { status: 403 }
        );
      }

      if (role && !canAssignRole(currentUserRole, role as UserRole)) {
        return NextResponse.json(
          { error: `Insufficient permissions to assign role: ${role}` },
          { status: 403 }
        );
      }

      console.log(`🔄 Updating user: ${targetId}`);

      // Get the target user first
      let targetUser;
      if (isUUID(targetId)) {
        const result = await adminApolloClient.query({
          query: GetUserByIdCompleteDocument,
          variables: { id: targetId },
          fetchPolicy: "network-only",
        });
        targetUser = result.data?.user;
      } else {
        const result = await adminApolloClient.query({
          query: GetUserByClerkIdCompleteDocument,
          variables: { clerkId: targetId },
          fetchPolicy: "network-only",
        });
        targetUser = result.data?.users?.[0];
      }

      if (!targetUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Update user in Clerk first
      const client = await clerkClient();
      const updateData: any = {};

      // Get current Clerk user to preserve publicMetadata
      let clerkTargetUser;
      if (targetUser.clerkUserId) {
        try {
          clerkTargetUser = await client.users.getUser(targetUser.clerkUserId);
        } catch (error) {
          console.warn("Could not fetch target user from Clerk:", error);
        }
      }

      if (name) {
        const nameParts = name.split(" ");
        updateData.firstName = nameParts[0];
        updateData.lastName = nameParts.slice(1).join(" ");
      }

      if (role) {
        updateData.publicMetadata = {
          ...(clerkTargetUser?.publicMetadata || {}),
          role,
          managerId,
          isStaff: role === "developer" || role === "manager",
          lastUpdatedBy: userId,
          lastUpdatedAt: new Date().toISOString(),
        };
      }

      if (Object.keys(updateData).length > 0 && targetUser.clerkUserId) {
        await client.users.updateUser(targetUser.clerkUserId, updateData);
        console.log(`✅ Updated Clerk user: ${targetUser.clerkUserId}`);
      }

      // If role changed, update via our enhanced role update function
      if (role && role !== targetUser.role && targetUser.clerkUserId) {
        await updateUserRole(
          targetUser.clerkUserId,
          role as UserRole,
          userId,
          managerId
        );
      } else if (name || email) {
        // Update basic info in database via webhook will be triggered
        // For immediate response, we could also update database directly here
      }

      return NextResponse.json({
        success: true,
        message: "User updated successfully",
        user: {
          id: targetUser.id,
          clerkId: targetUser.clerkUserId,
          name: name || targetUser.name,
          email: email || targetUser.email,
          role: role || targetUser.role,
        },
      });
    } catch (error) {
      console.error("❌ Error updating user:", error);
      return NextResponse.json(
        {
          error: "Failed to update user",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  },
  {
    requiredRole: "viewer",
  }
);

// DELETE /api/users/[id] - Delete user (admin only)
export const DELETE = withAuthParams(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
    session
  ) => {
    try {
      const { userId } = await auth();

      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { id: targetId } = await params;
      const currentUserRole = await getCurrentUserRole(userId);
      const permissions = getUserPermissions(currentUserRole);

      // Only org_admin can delete users
      if (currentUserRole !== "org_admin" && currentUserRole !== "developer") {
        return NextResponse.json(
          { error: "Only administrators can delete users" },
          { status: 403 }
        );
      }

      // Prevent self-deletion
      if (targetId === userId) {
        return NextResponse.json(
          { error: "Cannot delete your own account" },
          { status: 400 }
        );
      }

      console.log(`🗑️ Deleting user: ${targetId}`);

      // Get the target user
      let targetUser;
      if (isUUID(targetId)) {
        const result = await adminApolloClient.query({
          query: GetUserByIdCompleteDocument,
          variables: { id: targetId },
          fetchPolicy: "network-only",
        });
        targetUser = result.data?.user;
      } else {
        const result = await adminApolloClient.query({
          query: GetUserByClerkIdCompleteDocument,
          variables: { clerkId: targetId },
          fetchPolicy: "network-only",
        });
        targetUser = result.data?.users?.[0];
      }

      if (!targetUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Delete from Clerk (this will trigger webhook to delete from database)
      const client = await clerkClient();
      if (targetUser.clerkUserId) {
        await client.users.deleteUser(targetUser.clerkUserId);
      }

      console.log(`✅ User deleted: ${targetUser.clerkUserId}`);

      return NextResponse.json({
        success: true,
        message: "User deleted successfully",
        deletedUser: {
          id: targetUser.id,
          name: targetUser.name,
          email: targetUser.email,
        },
      });
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      return NextResponse.json(
        {
          error: "Failed to delete user",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  },
  {
    requiredRole: "org_admin",
  }
);
