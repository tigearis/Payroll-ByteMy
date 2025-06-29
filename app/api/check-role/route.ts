import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/api-auth";
import { getJWTClaimsWithFallback } from "@/lib/auth/token-utils";

export const GET = withAuth(async (request: NextRequest, session) => {
  try {
    console.log("🔍 Role check endpoint called");

    // Get additional claims info for debugging
    const claimsResult = await getJWTClaimsWithFallback();

    console.log("🔍 Session and claims results:", {
      hasUserId: !!session.userId,
      sessionRole: session.role,
      claimsRole: claimsResult.role,
      hasCompleteData: claimsResult.hasCompleteData,
      userId: session.userId ? `${session.userId.substring(0, 8)}...` : null,
    });

    // Use session role as primary, claims as fallback
    const userRole = session.role || claimsResult.role || "viewer";

    console.log("🔍 Role extraction result:", {
      userRole,
      sessionRole: session.role,
      databaseId: session.databaseId,
      hasCompleteData: claimsResult.hasCompleteData,
      claimsError: claimsResult.error,
    });

    return NextResponse.json({
      success: true,
      userId: session.userId,
      role: userRole,
      databaseId: session.databaseId,
      hasCompleteData: claimsResult.hasCompleteData,
      debug: {
        hasHasuraClaims: !!claimsResult.claims,
        v1DefaultRole: claimsResult.claims?.["x-hasura-default-role"],
        v1Role: claimsResult.claims?.["x-hasura-default-role"],
        extractedRole: claimsResult.role,
        sessionRole: session.role,
        claimsError: claimsResult.error,
      },
    });
  } catch (error: any) {
    console.error("🔍 Role check error:", error);

    return NextResponse.json(
      {
        error: "Failed to check role",
        details: error.message,
      },
      { status: 500 }
    );
  }
});
