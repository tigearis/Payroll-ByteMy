import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Role check endpoint called");
    
    const { userId, sessionClaims, getToken } = await auth();
    
    console.log("🔍 Auth data:", {
      hasUserId: !!userId,
      hasSessionClaims: !!sessionClaims,
      userId: userId?.substring(0, 8) + "..."
    });
    
    if (!userId) {
      return NextResponse.json({
        error: "Not authenticated",
        userId: null,
        role: null
      }, { status: 401 });
    }
    
    // Extract role from JWT (same logic as api-auth.ts)
    const hasuraClaims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const userRole = (
      (sessionClaims?.metadata as any)?.default_role ||
      (sessionClaims?.metadata as any)?.role ||
      hasuraClaims?.["x-hasura-default-role"] ||
      hasuraClaims?.["x-hasura-role"] ||
      (sessionClaims as any)?.role
    ) as string;
    
    // Get Hasura token
    const token = await getToken({ template: "hasura" });
    
    console.log("🔍 Role extraction result:", {
      userRole,
      hasToken: !!token,
      tokenLength: token?.length,
      hasMetadata: !!sessionClaims?.metadata,
      hasHasuraClaims: !!hasuraClaims,
      v2DefaultRole: (sessionClaims?.metadata as any)?.default_role,
      v1DefaultRole: hasuraClaims?.["x-hasura-default-role"]
    });
    
    return NextResponse.json({
      success: true,
      userId: userId,
      role: userRole,
      hasToken: !!token,
      tokenLength: token?.length,
      debug: {
        hasMetadata: !!sessionClaims?.metadata,
        hasHasuraClaims: !!hasuraClaims,
        v2DefaultRole: (sessionClaims?.metadata as any)?.default_role,
        v1DefaultRole: hasuraClaims?.["x-hasura-default-role"],
        v1Role: hasuraClaims?.["x-hasura-role"],
        sessionId: sessionClaims?.sid
      }
    });
    
  } catch (error: any) {
    console.error("🔍 Role check error:", error);
    
    return NextResponse.json({
      error: "Failed to check role",
      details: error.message
    }, { status: 500 });
  }
}