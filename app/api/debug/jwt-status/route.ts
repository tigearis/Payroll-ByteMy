import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/api-auth";

// Simple JWT status endpoint - shows current user's JWT template data
// Accessible by any authenticated user to see their own JWT status

export const GET = withAuth(async (request: NextRequest, session) => {
  try {
    console.log('🔍 JWT Status Check for current user');

    // Extract all JWT template fields from session
    const {
      userId,
      databaseId,
      clerkId,
      managerId,
      isStaff,
      organizationId,
      permissions,
      defaultRole,
      allowedRoles,
      permissionHash,
      permissionVersion,
      email
    } = session;

    // Check which required fields are present
    const requiredFields = {
      userId: !!userId,
      databaseId: !!databaseId,
      clerkId: !!clerkId,
      defaultRole: !!defaultRole,
      permissions: !!(permissions && permissions.length > 0),
      allowedRoles: !!(allowedRoles && allowedRoles.length > 0),
      permissionHash: !!permissionHash,
      permissionVersion: !!permissionVersion
    };

    // Optional fields
    const optionalFields = {
      email: !!email,
      managerId: !!managerId,
      isStaff: isStaff !== undefined,
      organizationId: !!organizationId
    };

    // Count completion
    const requiredCount = Object.values(requiredFields).filter(Boolean).length;
    const totalRequired = Object.keys(requiredFields).length;
    const completionRate = Math.round((requiredCount / totalRequired) * 100);

    // Determine status
    const isComplete = completionRate === 100;
    const status = isComplete ? 'complete' : 'incomplete';

    // Create JWT claims structure that would be generated
    const jwtClaimsStructure = {
      "x-hasura-user-id": databaseId || "missing",
      "x-hasura-default-role": defaultRole || "missing", 
      "x-hasura-allowed-roles": allowedRoles || "missing",
      "x-hasura-clerk-id": clerkId || "missing",
      "x-hasura-manager-id": managerId || null,
      "x-hasura-is-staff": isStaff || false,
      "x-hasura-permissions": permissions ? `Array(${permissions.length})` : "missing",
      "x-hasura-permission-hash": permissionHash ? `${permissionHash.substring(0, 8)}...` : "missing",
      "x-hasura-permission-version": permissionVersion || "missing",
      "x-hasura-org-id": organizationId || null
    };

    return NextResponse.json({
      status,
      completionRate,
      user: {
        email: email || "unknown",
        role: defaultRole || "unknown",
        userId: userId ? `${userId.substring(0, 8)}...` : "missing"
      },
      jwtTemplate: {
        requiredFields,
        optionalFields,
        missingRequired: Object.entries(requiredFields)
          .filter(([_, present]) => !present)
          .map(([field, _]) => field),
        jwtClaimsStructure
      },
      recommendations: isComplete ? [
        "✅ Your JWT template is complete!",
        "✅ All required fields are present",
        "✅ Permission system is fully functional"
      ] : [
        "⚠️ Some JWT template fields are missing",
        "💡 Try signing out and signing back in",
        "💡 Or visit /api/sync-current-user to trigger sync",
        "💡 Contact admin if issues persist"
      ],
      debug: {
        permissionsCount: permissions?.length || 0,
        allowedRolesCount: allowedRoles?.length || 0,
        sessionKeys: Object.keys(session),
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('JWT Status check error:', error);
    return NextResponse.json({
      error: "Status check failed",
      details: error.message
    }, { status: 500 });
  }
});