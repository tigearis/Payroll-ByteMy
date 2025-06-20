import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  // SECURITY: Disable in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  
  console.log("🔍 Debug token endpoint called");

  try {
    // Get the authenticated user's session
    const authResult = await auth();
    const clerkUserId = authResult.userId;

    if (!clerkUserId) {
      return NextResponse.json(
        {
          error: "No authenticated user found",
        },
        { status: 401 }
      );
    }

    // Get template token for Hasura
    const token = await authResult.getToken({ template: "hasura" });

    if (!token) {
      return NextResponse.json(
        { error: "Failed to generate token" },
        { status: 500 }
      );
    }

    // Parse token to see what's inside
    try {
      const [header, payload, signature] = token.split(".");
      const decodedHeader = JSON.parse(
        Buffer.from(header, "base64").toString()
      );
      const decodedPayload = JSON.parse(
        Buffer.from(payload, "base64").toString()
      );

      console.log("🔍 JWT Header:", decodedHeader);
      console.log("🔍 JWT Payload:", decodedPayload);

      return NextResponse.json({
        clerkUserId,
        header: decodedHeader,
        payload: decodedPayload,
        hasuraClaims:
          decodedPayload["https://hasura.io/jwt/claims"] ||
          decodedPayload.metadata,
        success: true,
      });
    } catch (parseError) {
      console.error("🚨 Failed to parse token:", parseError);
      return NextResponse.json(
        {
          error: "Failed to parse token",
          clerkUserId,
          tokenLength: token.length,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("🚨 Error in debug-token endpoint:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
