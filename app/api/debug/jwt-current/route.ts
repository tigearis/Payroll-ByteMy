import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json({
        error: "Not authenticated",
        authenticated: false,
      });
    }

    console.log("🔍 JWT Debug - Clerk User ID:", userId);

    const token = await getToken({ template: "hasura" });

    if (!token) {
      return NextResponse.json({
        error: "No Hasura token found",
        clerkUserId: userId,
        authenticated: true,
        hasToken: false,
      });
    }

    // Decode JWT payload
    const payload = JSON.parse(atob(token.split(".")[1]));
    const hasuraClaims = payload["https://hasura.io/jwt/claims"];

    const result = {
      clerkUserId: userId,
      hasuraUserId: hasuraClaims?.["x-hasura-user-id"],
      role: hasuraClaims?.["x-hasura-default-role"],
      allowedRoles: hasuraClaims?.["x-hasura-allowed-roles"],
      isCorrectUUID: false,
      issue: "",
      authenticated: true,
      hasToken: true,
      rawClaims: hasuraClaims,
    };

    // Check if hasura user ID is a UUID vs Clerk ID
    const hasuraUserId = hasuraClaims?.["x-hasura-user-id"];
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (hasuraUserId) {
      if (hasuraUserId === userId) {
        result.issue =
          "❌ JWT template is using Clerk ID instead of database UUID";
        result.isCorrectUUID = false;
      } else if (uuidRegex.test(hasuraUserId)) {
        result.issue = "✅ JWT template is correctly using database UUID";
        result.isCorrectUUID = true;
      } else {
        result.issue = "⚠️ Unknown format for hasura user ID";
        result.isCorrectUUID = false;
      }
    } else {
      result.issue = "❌ No x-hasura-user-id found in JWT claims";
      result.isCorrectUUID = false;
    }

    console.log("🔍 JWT Analysis:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("JWT Debug Error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
      authenticated: false,
    });
  }
}
