import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Debug endpoint to check user role and JWT claims
 * Helps diagnose middleware authentication issues
 */
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Debug user role endpoint called");

    // Get current auth state
    const authResult = await auth();
    const user = await currentUser();

    if (!authResult.userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get session claims
    const { sessionClaims } = authResult;

    // Try to get Hasura token
    let hasuraToken = null;
    let hasuraTokenPayload = null;
    try {
      hasuraToken = await authResult.getToken({ template: "hasura" });
      if (hasuraToken) {
        hasuraTokenPayload = JSON.parse(
          Buffer.from(hasuraToken.split(".")[1], "base64").toString()
        );
      }
    } catch (error) {
      console.warn("Failed to get Hasura token:", error);
    }

    // Extract role from various sources
    const roleExtraction = {
      directClaim: sessionClaims?.["x-hasura-default-role"],
      hasuraJwtClaim: sessionClaims?.["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"],
      metadataRole: sessionClaims?.metadata?.role,
      publicMetadataRole: user?.publicMetadata?.role,
      privateMetadataRole: user?.privateMetadata?.role,
      hasuraTokenRole: hasuraTokenPayload?.["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"] || 
                       hasuraTokenPayload?.metadata?.defaultrole,
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
      hasuraTokenPresent: !!hasuraToken,
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
        hasRole: !!roleExtraction.directClaim || !!roleExtraction.hasuraJwtClaim,
        needsSync: !roleExtraction.publicMetadataRole,
        syncEndpoint: "/api/fix-user-sync",
        hasuraTemplateConfigured: !!hasuraToken,
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
}