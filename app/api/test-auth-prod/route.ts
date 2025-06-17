// Quick production auth test
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const authResult = await auth();
    
    if (!authResult.userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const token = await authResult.getToken({ template: "hasura" });
    
    if (!token) {
      return NextResponse.json({ error: "No Hasura token" }, { status: 401 });
    }

    // Parse JWT to check claims
    const payload = JSON.parse(atob(token.split(".")[1]));
    const hasuraClaims = payload["https://hasura.io/jwt/claims"];

    return NextResponse.json({
      success: true,
      clerkUserId: authResult.userId,
      hasuraClaims,
      tokenExists: !!token,
      hasuraUrl: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
      environment: process.env.NODE_ENV
    });

  } catch (error) {
    console.error("Auth test error:", error);
    return NextResponse.json({
      error: "Test failed",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}