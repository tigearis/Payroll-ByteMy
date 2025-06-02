import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    console.log("🧪 Testing JWT structure...");

    // Try to get auth info without requiring protection
    const authResult = await auth();
    const { userId, getToken } = authResult;

    if (!userId) {
      return NextResponse.json({
        message: "No user found - please sign in first",
        authResult: authResult,
      });
    }

    console.log(`🔍 Found user: ${userId}`);

    // Get the Hasura token
    const hasuraToken = await getToken({ template: "hasura" });

    let decodedPayload = null;
    let hasuraClaims = null;
    let currentUserInfo = null;

    if (hasuraToken) {
      try {
        // Decode the JWT payload
        const payload = JSON.parse(atob(hasuraToken.split(".")[1]));
        decodedPayload = payload;
        hasuraClaims = payload["https://hasura.io/jwt/claims"];

        console.log("🔍 Hasura Claims:", hasuraClaims);
      } catch (error) {
        console.error("Error decoding JWT:", error);
      }
    }

    // Also get user info from Clerk
    try {
      const { clerkClient } = await import("@clerk/nextjs/server");
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId);
      currentUserInfo = {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        metadata: user.publicMetadata,
      };
      console.log("👤 User metadata:", user.publicMetadata);
    } catch (error) {
      console.error("Error getting user info:", error);
    }

    const result = {
      timestamp: new Date().toISOString(),
      clerkUserId: userId,
      hasToken: !!hasuraToken,
      tokenLength: hasuraToken?.length || 0,
      hasuraClaims: hasuraClaims || null,
      userMetadata: currentUserInfo?.metadata || null,
      analysis: {
        hasValidUuid: hasuraClaims?.["x-hasura-user-id"]?.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        )
          ? "✅ Valid UUID"
          : "❌ Invalid UUID",
        isClerkId: hasuraClaims?.["x-hasura-user-id"]?.startsWith("user_")
          ? "❌ Using Clerk ID"
          : "✅ Not Clerk ID",
        hasRole: hasuraClaims?.["x-hasura-default-role"]
          ? "✅ Has role"
          : "❌ No role",
        recommendation: !hasuraClaims?.["x-hasura-user-id"]?.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        )
          ? "Update JWT template to use {{user.public_metadata.databaseId}}"
          : "JWT template looks correct",
      },
    };

    console.log("🎯 Analysis result:", result.analysis);

    return NextResponse.json(result);
  } catch (error) {
    console.error("JWT test error:", error);
    return NextResponse.json(
      {
        error: "Failed to test JWT",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
