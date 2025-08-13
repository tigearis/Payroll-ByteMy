import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId, sessionClaims, getToken } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get the Hasura token 
    let hasuraToken = null;
    let hasuraClaims = null;
    let rawJWT = null;
    
    try {
      hasuraToken = await getToken({ template: "hasura" });
      if (hasuraToken) {
        // Decode JWT manually to see raw claims
        const parts = hasuraToken.split('.');
        const payload = JSON.parse(atob(parts[1]));
        hasuraClaims = payload["https://hasura.io/jwt/claims"];
        rawJWT = payload;
      }
    } catch (tokenError) {
      console.error("Token error:", tokenError);
    }

    // Get session claims for comparison
    const clerkSessionClaims = sessionClaims?.[
      "https://hasura.io/jwt/claims"
    ];

    return NextResponse.json({
      debug: "JWT Claims Analysis",
      userId,
      rawJWT: rawJWT,
      hasuraClaims: hasuraClaims,
      sessionClaims: clerkSessionClaims,
      tokenExists: !!hasuraToken,
      claimsAnalysis: {
        role: hasuraClaims?.["x-hasura-role"],
        allowedRoles: hasuraClaims?.["x-hasura-allowed-roles"],
        allowedRolesType: typeof hasuraClaims?.["x-hasura-allowed-roles"],
        allowedRolesIsArray: Array.isArray(hasuraClaims?.["x-hasura-allowed-roles"]),
        databaseId: hasuraClaims?.["x-hasura-user-id"],
      }
    });
    
  } catch (error) {
    console.error("Debug JWT claims error:", error);
    return NextResponse.json(
      {
        error: "Failed to debug JWT claims",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}