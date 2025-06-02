import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log(`🧪 Testing JWT for user: ${userId}`);

    const token = await getToken({ template: "hasura" });

    if (!token) {
      return NextResponse.json({
        error: "No Hasura token found",
        clerkUserId: userId,
        hasuraToken: null,
      });
    }

    try {
      // Decode the JWT payload
      const payload = JSON.parse(atob(token.split(".")[1]));
      const hasuraClaims = payload["https://hasura.io/jwt/claims"];

      const result = {
        clerkUserId: userId,
        hasuraUserId: hasuraClaims?.["x-hasura-user-id"],
        role: hasuraClaims?.["x-hasura-default-role"],
        allowedRoles: hasuraClaims?.["x-hasura-allowed-roles"],
        isCorrect: hasuraClaims?.["x-hasura-user-id"] !== userId,
        isUUID:
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            hasuraClaims?.["x-hasura-user-id"]
          ),
        fullPayload: payload,
        timestamp: new Date().toISOString(),
      };

      console.log("🔍 JWT Test Results:", {
        clerkUserId: result.clerkUserId,
        hasuraUserId: result.hasuraUserId,
        isCorrect: result.isCorrect,
        isUUID: result.isUUID,
      });

      return NextResponse.json(result);
    } catch (decodeError) {
      console.error("❌ Error decoding JWT:", decodeError);
      return NextResponse.json({
        error: "Error decoding JWT",
        clerkUserId: userId,
        tokenLength: token.length,
        tokenPreview: token.substring(0, 50) + "...",
      });
    }
  } catch (error) {
    console.error("❌ Token test error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
