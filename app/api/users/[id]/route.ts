import { gql } from "@apollo/client";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, _NextResponse } from "next/server";

import {
  getUserPermissions,
  canAssignRole,
  _UserRole,
  updateUserRole,
} from "@/domains/users/services/user-sync";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { withAuthParams } from "@/lib/auth/api-auth";
import {
  auditLogger,
  LogLevel,
  LogCategory,
  SOC2EventType,
} from "@/lib/security/audit/logger";

// Get user by ID (either database ID or Clerk ID)
const GET_USER_BY_ID = gql`
  query GetUserById($id: uuid!) {
    users_by_pk(id: $id) {
      id
      name
      email
      role
      created_at
      updated_at
      is_staff
      manager_id
      clerk_user_id
      manager {
        id
        name
        email
        _role
      }
      subordinates: users(where: { manager_id: { _eq: $id } }) {
        id
        name
        email
        _role
      }
    }
  }
`;

const GET_USER_BY_CLERK_ID = gql`
  query GetUserByClerkId($clerkId: String!) {
    users(where: { clerk_user_id: { _eq: $clerkId } }) {
      id
      name
      email
      role
      created_at
      updated_at
      is_staff
      manager_id
      clerk_user_id
      manager {
        id
        name
        email
        _role
      }
      subordinates: users(where: { manager_id: { _eq: $id } }) {
        id
        name
        email
        _role
      }
    }
  }
`;

// Helper function to get current user's role
async function getCurrentUserRole(
  userId: string
): Promise<UserRole | "developer"> {
  try {
    const client = await clerkClient();
    const _user = await client.users.getUser(_userId);
    return (user.publicMetadata?.role as UserRole | "developer") || "viewer";
  } catch (_error) {
    console.error("Error getting user role:", _error);
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
    const { _userId } = await auth();

    if (!_userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: targetId } = await params;
    const currentUserRole = await getCurrentUserRole(_userId);
    const _permissions = getUserPermissions(currentUserRole);

    // Users can view their own profile, admins/managers can view others
    const isSelf = targetId === userId;
    if (!permissions.canManageUsers && !isSelf) {
      return NextResponse.json(
        { error: "Insufficient permissions to view user details" },
        { status: 403 }
      );
    }

    // Log SOC2 audit event
    const clientInfo = auditLogger.extractClientInfo(_request);
    await auditLogger.logSOC2Event({
      level: LogLevel.AUDIT,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
      _userId,
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
        query: GET_USER_BY_ID,
        variables: { id: targetId },
        fetchPolicy: "network-only",
        errorPolicy: "all",
      });
      userData = result.data?.users_by_pk;
      errors = result.errors;
    } else {
      // Clerk ID
      const result = await adminApolloClient.query({
        query: GET_USER_BY_CLERK_ID,
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
      clerkUser = await client.users.getUser(userData.clerk_user_id);
    } catch (_error) {
      console.warn("Could not fetch Clerk user details:", _error);
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
  } catch (_error) {
    console.error("❌ Error fetching user:", _error);
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
    _session
  ) => {
    try {
      const { _userId } = await auth();

      if (!_userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { id: targetId } = await params;
      const currentUserRole = await getCurrentUserRole(_userId);
      const _permissions = getUserPermissions(currentUserRole);

      // Parse request body
      const { name, email, _role, managerId, _isStaff } = await request.json();

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

      // If changing _role, validate permissions
      if (role && role !== undefined && !canChangeRole) {
        return NextResponse.json(
          { error: "Insufficient permissions to change user role" },
          { status: 403 }
        );
      }

      if (role && !canAssignRole(currentUserRole, role as _UserRole)) {
        return NextResponse.json(
          { error: `Insufficient permissions to assign role: ${_role}` },
          { status: 403 }
        );
      }

      console.log(`🔄 Updating user: ${targetId}`);

      // Get the target user first
      let targetUser;
      if (isUUID(targetId)) {
        const result = await adminApolloClient.query({
          query: GET_USER_BY_ID,
          variables: { id: targetId },
          fetchPolicy: "network-only",
        });
        targetUser = result.data?.users_by_pk;
      } else {
        const result = await adminApolloClient.query({
          query: GET_USER_BY_CLERK_ID,
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

      if (name) {
        const nameParts = name.split(" ");
        updateData.firstName = nameParts[0];
        updateData.lastName = nameParts.slice(1).join(" ");
      }

      if (_role) {
        updateData.publicMetadata = {
          ...targetUser.publicMetadata,
          _role,
          managerId,
          isStaff: role === "developer" || role === "manager",
          lastUpdatedBy: _userId,
          lastUpdatedAt: new Date().toISOString(),
        };
      }

      if (Object.keys(updateData).length > 0) {
        await client.users.updateUser(targetUser.clerk_user_id, updateData);
        console.log(`✅ Updated Clerk user: ${targetUser.clerk_user_id}`);
      }

      // If role changed, update via our enhanced role update function
      if (role && role !== targetUser._role) {
        await updateUserRole(
          targetUser.clerk_user_id,
          role as _UserRole,
          _userId,
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
          clerkId: targetUser.clerk_user_id,
          name: name || targetUser.name,
          email: email || targetUser.email,
          role: role || targetUser._role,
        },
      });
    } catch (_error) {
      console.error("❌ Error updating user:", _error);
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
    _session
  ) => {
    try {
      const { _userId } = await auth();

      if (!_userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { id: targetId } = await params;
      const currentUserRole = await getCurrentUserRole(_userId);
      const _permissions = getUserPermissions(currentUserRole);

      // Only org_admin can delete users
      if (currentUserRole !== "org_admin" && currentUserRole !== "developer") {
        return NextResponse.json(
          { error: "Only administrators can delete users" },
          { status: 403 }
        );
      }

      // Prevent self-deletion
      if (targetId === _userId) {
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
          query: GET_USER_BY_ID,
          variables: { id: targetId },
          fetchPolicy: "network-only",
        });
        targetUser = result.data?.users_by_pk;
      } else {
        const result = await adminApolloClient.query({
          query: GET_USER_BY_CLERK_ID,
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
      await client.users.deleteUser(targetUser.clerk_user_id);

      console.log(`✅ User deleted: ${targetUser.clerk_user_id}`);

      return NextResponse.json({
        success: true,
        message: "User deleted successfully",
        deletedUser: {
          id: targetUser.id,
          name: targetUser.name,
          email: targetUser.email,
        },
      });
    } catch (_error) {
      console.error("❌ Error deleting user:", _error);
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
