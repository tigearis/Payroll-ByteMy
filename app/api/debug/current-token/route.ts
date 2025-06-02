import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🧪 Checking current JWT token structure...");

    const authResult = await auth();
    const { userId, getToken } = authResult;

    if (!userId) {
      return NextResponse.json({
        error: "Not authenticated",
        message: "Please sign in to test JWT token",
        authResult: Object.keys(authResult),
      });
    }

    console.log(`🔍 Testing JWT for user: ${userId}`);

    // Get the token with hasura template
    const hasuraToken = await getToken({ template: "hasura" });

    if (!hasuraToken) {
      return NextResponse.json({
        error: "No Hasura token found",
        message: "JWT template 'hasura' not configured in Clerk",
        clerkUserId: userId,
        availableTemplates: "Check Clerk Dashboard → JWT Templates",
      });
    }

    // Decode the JWT
    try {
      const parts = hasuraToken.split(".");
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));

      const hasuraClaims = payload["https://hasura.io/jwt/claims"];

      const result = {
        clerkUserId: userId,
        tokenExists: true,
        hasuraClaims: hasuraClaims || null,
        hasuraClaimsFound: !!hasuraClaims,
        currentHasuraUserId: hasuraClaims?.["x-hasura-user-id"],
        currentRole: hasuraClaims?.["x-hasura-default-role"],
        isCorrectFormat: hasuraClaims?.["x-hasura-user-id"] !== userId,
        fullPayload: payload,
        header: header,
        tokenLength: hasuraToken.length,
        timestamp: new Date().toISOString(),
      };

      console.log("🔍 JWT Analysis:", {
        hasuraClaimsFound: result.hasuraClaimsFound,
        currentHasuraUserId: result.currentHasuraUserId,
        isCorrectFormat: result.isCorrectFormat,
      });

      return NextResponse.json(result);
    } catch (decodeError) {
      console.error("❌ Error decoding JWT:", decodeError);
      return NextResponse.json({
        error: "Invalid JWT format",
        tokenLength: hasuraToken.length,
        tokenPreview: hasuraToken.substring(0, 100) + "...",
      });
    }
  } catch (error) {
    console.error("❌ JWT test error:", error);
    return NextResponse.json({
      error: "Server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
