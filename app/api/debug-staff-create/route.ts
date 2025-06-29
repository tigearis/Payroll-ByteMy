import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Debug endpoint to check authentication and route access
export async function POST(request: NextRequest) {
  console.log("🔍 DEBUG: Staff create route accessed");
  console.log("🔍 Request method:", request.method);
  console.log("🔍 Request URL:", request.url);
  
  try {
    // Get authentication data
    const { userId, sessionClaims, getToken } = await auth();
    
    console.log("🔍 Auth data:", {
      hasUserId: !!userId,
      hasSessionClaims: !!sessionClaims,
      userIdPreview: userId?.substring(0, 8) + "..."
    });
    
    // Get JWT token
    const token = await getToken({ template: "hasura" });
    console.log("🔍 Token:", {
      hasToken: !!token,
      tokenLength: token?.length
    });
    
    // Get JWT claims
    const hasuraClaims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const publicMetadata = sessionClaims?.publicMetadata as any;
    
    console.log("🔍 Claims data:", {
      hasHasuraClaims: !!hasuraClaims,
      hasPublicMetadata: !!publicMetadata,
      defaultRole: hasuraClaims?.["x-hasura-default-role"],
      allowedRoles: hasuraClaims?.["x-hasura-allowed-roles"],
      metadataRole: publicMetadata?.role
    });
    
    // Try to get request body
    let body = null;
    try {
      body = await request.json();
      console.log("🔍 Request body keys:", Object.keys(body || {}));
    } catch (e) {
      console.log("🔍 No JSON body or body already consumed");
    }
    
    return NextResponse.json({
      success: true,
      debug: {
        method: request.method,
        hasAuth: !!userId,
        userRole: hasuraClaims?.["x-hasura-default-role"] || publicMetadata?.role || "unknown",
        allowedRoles: hasuraClaims?.["x-hasura-allowed-roles"] || [],
        hasToken: !!token,
        bodyKeys: Object.keys(body || {}),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("🔍 Debug endpoint error:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      debug: {
        method: request.method,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}