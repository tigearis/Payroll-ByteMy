import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/api-auth";

export const GET = withAuth(async (request: NextRequest, session) => {
  try {
    console.log("🔍 JWT Template Role Check - endpoint called");

    // ✅ JWT Template: Use session data directly from withAuth
    const {
      userId,
      databaseId,
      clerkId,
      managerId,
      isStaff,
      organizationId,
      permissions,
      role,
      allowedRoles,
      permissionHash,
      permissionVersion,
      email,
    } = session;

    console.log("🔍 JWT Template - Session data:", {
      hasUserId: !!userId,
      hasDatabaseId: !!databaseId,
      hasRole: !!role,
      hasPermissions: !!permissions?.length,
      permissionCount: permissions?.length || 0,
      userId: userId ? `${userId.substring(0, 8)}...` : null,
      databaseId: databaseId ? `${databaseId.substring(0, 8)}...` : null,
    });

    return NextResponse.json({
      success: true,
      // ✅ JWT Template: Core identification
      userId,
      databaseId,
      clerkId,
      email,

      // ✅ JWT Template: Role and permissions
      role,
      allowedRoles,
      permissions: permissions || [],
      permissionCount: permissions?.length || 0,

      // ✅ JWT Template: Hierarchy and organization
      managerId,
      isStaff: isStaff || false,
      organizationId,

      // ✅ JWT Template: Security metadata
      permissionHash,
      permissionVersion,

      // Status
      hasCompleteData: !!(userId && databaseId && role),

      // Debug information
      debug: {
        jwtTemplateFields: {
          hasUserId: !!userId,
          hasDatabaseId: !!databaseId,
          hasClerkId: !!clerkId,
          hasRole: !!role,
          hasPermissions: !!permissions?.length,
          hasManagerId: !!managerId,
          hasOrgId: !!organizationId,
          hasPermissionHash: !!permissionHash,
          hasPermissionVersion: !!permissionVersion,
        },
        source: "JWT Template via withAuth session",
      },
    });
  } catch (error: any) {
    console.error("🔍 JWT Template Role check error:", error);

    return NextResponse.json(
      {
        error: "Failed to check role",
        details: error.message,
        source: "JWT Template",
      },
      { status: 500 }
    );
  }
});
