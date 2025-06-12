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

    // Get the authenticated user's session
    const authResult = await auth();
    const userId = authResult.userId;
    console.log("🔍 Auth result:", { hasUserId: !!userId, userId: userId?.substring(0, 8) + "..." });

    if (!userId) {
      // Log failed token request
      // await logFailedLogin(
      //   "unknown",
      //   ipAddress.toString(),
      //   userAgent,
      //   "No authenticated user found"
      // );

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user details for audit logging
    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress || "unknown";

    // Get template token for Hasura
    const auth_instance = await auth();
    const token = await auth_instance.getToken({ template: "hasura" });
    console.log("🔍 Generated token:", { hasToken: !!token, tokenPreview: token?.substring(0, 50) + "..." });

    if (!token) {
      // Log failed token generation
      // await logFailedLogin(
      //   userEmail,
      //   ipAddress.toString(),
      //   userAgent,
      //   "Failed to generate token"
      // );

      return NextResponse.json(
        { error: "Failed to generate token" },
        { status: 500 }
      );
    }

    // Parse token to get expiry
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    const expiresIn = payload.exp - Math.floor(Date.now() / 1000);

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
