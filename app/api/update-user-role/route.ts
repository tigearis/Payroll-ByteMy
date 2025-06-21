// app/api/update-user-role/route.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/lib/auth/api-auth";

export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      // Check authentication
      const { userId } = await auth();

      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

    // Parse request body
    const { targetUserId, role } = await req.json();

    // Validate role
    const validRoles = [
      "developer",
      "org_admin",
      "manager",
      "consultant",
      "viewer",
    ];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if current user has permission to update roles
    // Only admin users can update roles
    const client = await clerkClient();
    const currentUser = await client.users.getUser(userId);
    const currentUserRole = currentUser.publicMetadata?.role || "viewer";

    if (currentUserRole !== "developer") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Update target user's role in metadata
    await client.users.updateUserMetadata(targetUserId, {
      publicMetadata: {
        role,
      },
    });

    return NextResponse.json({
      success: true,
      message: `User role updated to ${role}`,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
  },
  {
    requiredRole: "developer",
  }
);

// GET endpoint to fetch user role information
export const GET = withAuth(
  async (request: Request) => {
    try {
      const { userId: currentUserId, sessionClaims } = await auth();

      if (!currentUserId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

    const url = new URL(request.url);
    const targetUserId = url.searchParams.get("userId");

    if (!targetUserId) {
      return new NextResponse("Missing userId parameter", { status: 400 });
    }

    // Get current user's role
    const claims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const currentUserRole = claims?.["x-hasura-default-role"] || "viewer";

    // Check if user can view role information
    const canViewRoles = ["developer", "org_admin", "manager"].includes(
      currentUserRole
    );
    const isSelf = currentUserId === targetUserId;

    if (!canViewRoles && !isSelf) {
      return new NextResponse("Forbidden: Cannot view user roles", {
        status: 403,
      });
    }

    // Get target user information
    const client = await clerkClient();
    const targetUser = await client.users.getUser(targetUserId);
    const targetUserClaims = targetUser.publicMetadata?.[
      "hasura_claims"
    ] as any;
    const targetUserRole =
      targetUserClaims?.["x-hasura-default-role"] || "viewer";

    return NextResponse.json({
      userId: targetUserId,
      role: targetUserRole,
      email: targetUser.emailAddresses[0]?.emailAddress,
      firstName: targetUser.firstName,
      lastName: targetUser.lastName,
      canModify:
        ["developer", "org_admin"].includes(currentUserRole) &&
        (currentUserRole === "developer" ||
          !["developer", "org_admin"].includes(targetUserRole)),
    });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
  },
  {
    requiredRole: "viewer",
  }
);
