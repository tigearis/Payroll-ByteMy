// app/api/auth/token/route.ts - Simple token endpoint for Apollo Client
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
// import { logSuccessfulLogin, logFailedLogin } from "@/lib/security/audit";

export async function GET(req: NextRequest) {
  console.log("🔍 Token endpoint called");
  try {
    // Get client IP and user agent for audit logging
    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    console.log("🔍 Request headers:", {
      authorization: req.headers.get("authorization"),
      cookie: req.headers.get("cookie") ? "present" : "missing",
      host: req.headers.get("host"),
      userAgent,
      ipAddress,
      origin: req.headers.get("origin"),
      referer: req.headers.get("referer")
    });

    // Get the authenticated user's session
    const authResult = await auth();
    const userId = authResult.userId;
    console.log("🔍 Auth result:", { 
      hasUserId: !!userId, 
      userId: userId?.substring(0, 8) + "...",
      sessionId: authResult.sessionId?.substring(0, 8) + "..." || "none"
    });

    if (!userId) {
      console.log("🚨 No userId found in auth result");
      return NextResponse.json({ 
        error: "Missing 'Authorization' or 'Cookie' header in JWT authentication mode" 
      }, { status: 401 });
    }

    // Get user details for audit logging
    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress || "unknown";

    // Get template token for Hasura
    const token = await authResult.getToken({ template: "hasura" });
    console.log("🔍 Generated hasura template token:", { hasToken: !!token });

    if (!token) {
      return NextResponse.json(
        { error: "Failed to generate token" },
        { status: 500 }
      );
    }

    // Parse token to get expiry - with error handling
    let expiresIn = 3600; // Default to 1 hour
    try {
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );
      expiresIn = payload.exp - Math.floor(Date.now() / 1000);
      console.log("🔍 Token expires in:", expiresIn, "seconds");
    } catch (parseError) {
      console.warn("🔍 Failed to parse token expiry, using default:", parseError);
    }

    // Log successful token request
    // await logSuccessfulLogin(
    //   userId,
    //   userEmail,
    //   ipAddress.toString(),
    //   userAgent
    // );

    return NextResponse.json({
      token,
      expiresIn,
    });
  } catch (error) {
    console.error("Error getting token:", error);

    // Log error
    // await logFailedLogin(
    //   "unknown",
    //   req.headers.get("x-forwarded-for")?.toString() || "unknown",
    //   req.headers.get("user-agent") || "unknown",
    //   error instanceof Error ? error.message : "Unknown error"
    // );

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
