import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/api-auth";
import { getJWTClaimsWithFallback } from "@/lib/auth/token-utils";

/**
 * Debug endpoint to check user role and JWT claims
 * Helps diagnose middleware authentication issues
 */
export const GET = withAuth(async (request: NextRequest, session) => {
  try {
    console.log("🔍 Debug user role endpoint called");

    // Get additional debugging info
    const claimsResult = await getJWTClaimsWithFallback();
    const user = await currentUser();

    // Legacy auth for comparison
    const authResult = await auth();
    const { sessionClaims } = authResult;

    // Get fresh token for debugging
    let hasuraTokenPayload = null;
    const { getToken } = await auth();
    const token = await getToken({ template: "hasura" });
    
    if (token) {
      try {
        hasuraTokenPayload = JSON.parse(
          Buffer.from(token.split(".")[1], "base64").toString()
        );
      } catch (decodeError) {
        console.warn("Failed to decode token:", decodeError);
      }
    }

    // Extract role from various sources (enhanced with token utilities)
    const roleExtraction = {
      // Session and token utility results (NEW - centralized approach)
      sessionRole: session.role,
      sessionDatabaseId: session.databaseId,
      tokenUtilityRole: claimsResult.role,
      tokenUtilityComplete: claimsResult.hasCompleteData,
      tokenUtilityError: claimsResult.error,
      
      // Legacy sources (for debugging comparison)
      hasuraJwtClaim: sessionClaims?.["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"],
      publicMetadataRole: user?.publicMetadata?.role,
      hasuraTokenRole: hasuraTokenPayload?.["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"],
    };

    const debugInfo = {
      userId: authResult.userId,
      sessionId: authResult.sessionId,
      userEmail: user?.emailAddresses?.[0]?.emailAddress,
      roleExtraction,
      finalRole: (
        sessionClaims?.["x-hasura-default-role"] ||
        sessionClaims?.["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"] ||
        sessionClaims?.metadata?.role ||
        user?.publicMetadata?.role ||
        'viewer'
      ),
      publicMetadata: user?.publicMetadata,
      sessionClaims,
      hasuraTokenPresent: !!token,
      hasuraTokenPayload: hasuraTokenPayload ? {
        ...hasuraTokenPayload,
        // Remove sensitive data for logging
        iat: hasuraTokenPayload.iat,
        exp: hasuraTokenPayload.exp,
        sub: hasuraTokenPayload.sub?.substring(0, 8) + "...",
      } : null,
    };

    console.log("🔍 User role debug info:", debugInfo);

    return NextResponse.json({
      success: true,
      debug: debugInfo,
      recommendations: {
        hasRole: !!roleExtraction.tokenUtilityRole || !!roleExtraction.hasuraJwtClaim,
        needsSync: !roleExtraction.publicMetadataRole,
        syncEndpoint: "/api/fix-user-sync",
        hasuraTemplateConfigured: !!token,
      }
    });

  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json(
      { 
        error: "Debug failed", 
        message: error instanceof Error ? error.message : "Unknown error" 
      }, 
      { status: 500 }
    );
  }
}, {
  allowedRoles: ["developer"], // Only developers can access debug endpoints
});