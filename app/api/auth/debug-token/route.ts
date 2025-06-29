import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/api-auth";
import { getJWTClaimsWithFallback } from "@/lib/auth/token-utils";
import { auth } from "@clerk/nextjs/server";

export const GET = withAuth(
  async (req: NextRequest, session) => {
    // SECURITY: Disable in production
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    console.log("🔍 Debug token endpoint called");

    try {
      // Get additional token info for debugging
      const claimsResult = await getJWTClaimsWithFallback();
      
      // Get fresh token from Clerk for debugging
      const { getToken } = await auth();
      const token = await getToken({ template: "hasura" });

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
          clerkUserId: session.userId,
          header: decodedHeader,
          payload: decodedPayload,
          hasuraClaims:
            decodedPayload["https://hasura.io/jwt/claims"] ||
            decodedPayload.metadata,
          // Token utility results
          tokenUtilityRole: claimsResult.role,
          tokenUtilityComplete: claimsResult.hasCompleteData,
          tokenUtilityError: claimsResult.error,
          // Session info
          sessionRole: session.role,
          sessionDatabaseId: session.databaseId,
          success: true,
        });
      } catch (parseError) {
        console.error("🚨 Failed to parse token:", parseError);
        return NextResponse.json(
          {
            error: "Failed to parse token",
            clerkUserId: session.userId,
            tokenLength: token?.length,
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
  },
  {
    allowedRoles: ["developer"], // Only developers can access debug endpoints
  }
);
