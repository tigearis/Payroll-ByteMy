import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/api-auth";
import { getJWTClaimsWithFallback } from "@/lib/auth/token-utils";

// Debug endpoint to check authentication and route access
export const POST = withAuth(async (request: NextRequest, session) => {
  console.log("🔍 DEBUG: Staff create route accessed");
  console.log("🔍 Request method:", request.method);
  console.log("🔍 Request URL:", request.url);
  
  try {
    // Use centralized token utilities for debugging
    const claimsResult = await getJWTClaimsWithFallback();
    
    console.log("🔍 Claims utility result:", {
      hasUserId: !!claimsResult.userId,
      hasClaims: !!claimsResult.claims,
      role: claimsResult.role,
      hasCompleteData: claimsResult.hasCompleteData,
      claimsError: claimsResult.error
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
        hasAuth: !!session.userId,
        userRole: session.role || "unknown",
        hasCompleteData: claimsResult.hasCompleteData,
        bodyKeys: Object.keys(body || {}),
        claimsError: claimsResult.error,
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
}, { allowedRoles: ["developer"] });