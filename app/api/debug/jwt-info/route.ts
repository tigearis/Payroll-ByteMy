import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get the Hasura token
    const hasuraToken = await getToken({ template: "hasura" });

    let decodedPayload = null;
    let hasuraClaims = null;

    if (hasuraToken) {
      try {
        // Decode the JWT payload
        const payload = JSON.parse(atob(hasuraToken.split(".")[1]));
        decodedPayload = payload;
        hasuraClaims = payload["https://hasura.io/jwt/claims"];
      } catch (error) {
        console.error("Error decoding JWT:", error);
      }
    }

    // Get regular token for comparison
    const regularToken = await getToken();

    return NextResponse.json({
      clerkUserId: userId,
      hasToken: !!hasuraToken,
      tokenLength: hasuraToken?.length || 0,
      hasuraClaims: hasuraClaims || null,
      fullPayload: decodedPayload || null,
      regularTokenExists: !!regularToken,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("JWT debug error:", error);
    return NextResponse.json(
      {
        error: "Failed to get JWT info",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
