import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/api-auth";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { gql } from "@apollo/client";

export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    const body = await req.json();
    const { userId, resource, action, granted, reason, expiresAt } = body || {};
    if (!resource || !action || typeof granted !== "boolean" || !reason) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const targetUserId =
      userId && userId !== "current" ? userId : session.userId;

    const { data } = await adminApolloClient.mutate({
      mutation: gql`
        mutation InsertPermissionOverride(
          $object: permission_overrides_insert_input!
        ) {
          insertPermissionOverridesOne(object: $object) {
            id
            userId
            resource
            operation
            granted
            reason
            expiresAt
            createdAt
            createdBy
          }
        }
      `,
      variables: {
        object: {
          userId: targetUserId,
          resource,
          operation: action,
          granted,
          reason,
          expiresAt: expiresAt || null,
          createdBy: session.userId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      override: data?.insertPermissionOverridesOne,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed" },
      { status: 500 }
    );
  }
});

import {
  createPermissionOverrideWithSync,
  deletePermissionOverrideWithSync,
  type UserRole,
} from "@/lib/permissions/hierarchical-permissions";

interface CreateOverrideRequest {
  userId: string;
  clerkUserId: string;
  userRole: UserRole;
  resource: string;
  operation: string;
  granted: boolean;
  reason: string;
}

interface DeleteOverrideRequest {
  overrideId: string;
  userId: string;
  clerkUserId: string;
  userRole: UserRole;
}

// Consolidated management handler (create/delete via action)
export const PUT = withAuth(async (req: NextRequest, session) => {
  try {
    // Debug environment variable availability
    console.log("🔍 Environment check in API route:");
    console.log("- NODE_ENV:", process.env.NODE_ENV);
    console.log("- CLERK_SECRET_KEY present:", !!process.env.CLERK_SECRET_KEY);
    console.log(
      "- CLERK_SECRET_KEY length:",
      process.env.CLERK_SECRET_KEY?.length || 0
    );

    // Check if user has permission to manage permissions
    const userRole = session.role || session.defaultRole || "viewer";
    if (!userRole || !["developer", "org_admin"].includes(userRole)) {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient permissions to manage permission overrides",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, ...data } = body;

    if (action === "create") {
      const {
        userId,
        clerkUserId,
        userRole,
        resource,
        operation,
        granted,
        reason,
      } = data as CreateOverrideRequest;

      if (
        !userId ||
        !clerkUserId ||
        !userRole ||
        !resource ||
        !operation ||
        typeof granted !== "boolean"
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing required fields for creating permission override",
          },
          { status: 400 }
        );
      }

      console.log(
        `🔄 Creating permission override for ${resource}.${operation} = ${granted} for user ${userId}`
      );

      await createPermissionOverrideWithSync(
        userId,
        clerkUserId,
        userRole,
        resource,
        operation,
        granted,
        reason || "Updated via permissions UI"
      );

      return NextResponse.json({
        success: true,
        message: `Successfully ${granted ? "granted" : "revoked"} ${resource}.${operation}`,
      });
    } else if (action === "delete") {
      const { overrideId, userId, clerkUserId, userRole } =
        data as DeleteOverrideRequest;

      if (!overrideId || !userId || !clerkUserId || !userRole) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing required fields for deleting permission override",
          },
          { status: 400 }
        );
      }

      console.log(
        `🔄 Deleting permission override ${overrideId} for user ${userId}`
      );

      await deletePermissionOverrideWithSync(
        overrideId,
        userId,
        clerkUserId,
        userRole
      );

      return NextResponse.json({
        success: true,
        message: "Successfully removed permission override",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid action. Must be "create" or "delete"',
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("❌ Permission override API error:", error);

    // Extract meaningful error message
    let errorMessage = "Unknown error occurred";
    if (error.message) {
      if (error.message.includes("CLERK_SECRET_KEY")) {
        errorMessage =
          "Clerk configuration error - please check server environment variables";
      } else if (
        error.message.includes("Failed to sync permissions to Clerk")
      ) {
        errorMessage =
          "Failed to sync permissions with authentication provider";
      } else if (
        error.message.includes("Failed to create permission override")
      ) {
        errorMessage = error.message;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
});

// List overrides for a user
export const GET = withAuth(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId)
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );

    const { data } = await adminApolloClient.query({
      query: gql`
        query ListOverrides($where: permission_overrides_bool_exp) {
          permissionOverrides(where: $where, orderBy: { createdAt: DESC }) {
            id
            userId
            resource
            operation
            granted
            reason
            expiresAt
            createdAt
            createdBy
          }
        }
      `,
      variables: { where: { userId: { _eq: userId } } },
      fetchPolicy: "no-cache",
    });

    return NextResponse.json({
      success: true,
      overrides: data.permissionOverrides,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed" },
      { status: 500 }
    );
  }
});

// Delete single override by id
export const DELETE = withAuth(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "id is required" }, { status: 400 });

    const { data } = await adminApolloClient.mutate({
      mutation: gql`
        mutation DeleteOverride($id: uuid!) {
          deletePermissionOverridesByPk(id: $id) {
            id
          }
        }
      `,
      variables: { id },
    });

    if (!data?.deletePermissionOverridesByPk?.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed" },
      { status: 500 }
    );
  }
});
