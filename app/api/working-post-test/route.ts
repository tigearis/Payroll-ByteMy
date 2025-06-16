// Copying exact pattern from working GET routes
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  return NextResponse.json({ message: "GET works on this route" });
}

export async function POST(req: NextRequest) {
  try {
    console.log("WORKING POST TEST - Starting");
    
    // Get Clerk authentication
    const { userId, getToken, sessionClaims } = await auth();
    console.log("WORKING POST TEST - User ID:", userId ? "present" : "none");

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract role (same logic as api-auth.ts)
    const hasuraClaims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const userRole = (
      (sessionClaims?.metadata as any)?.default_role ||
      (sessionClaims?.metadata as any)?.role ||
      hasuraClaims?.["x-hasura-default-role"] ||
      hasuraClaims?.["x-hasura-role"] ||
      (sessionClaims as any)?.role
    ) as string;

    console.log("WORKING POST TEST - Role extraction:", {
      userRole,
      hasMetadata: !!sessionClaims?.metadata,
      hasHasuraClaims: !!hasuraClaims,
      v2DefaultRole: (sessionClaims?.metadata as any)?.default_role,
      v1DefaultRole: hasuraClaims?.["x-hasura-default-role"]
    });

    // Get Hasura token
    const token = await getToken({ template: "hasura" });
    console.log("WORKING POST TEST - Token:", token ? "present" : "none");
    console.log("WORKING POST TEST - Token length:", token?.length);

    // Ensure we have a token
    if (!token) {
      return NextResponse.json(
        { error: "Failed to obtain authentication token" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    console.log("WORKING POST TEST - Body received:", body);

    return NextResponse.json({
      success: true,
      message: "Working POST test successful!",
      userId: userId,
      role: userRole,
      hasToken: !!token,
      tokenLength: token?.length,
      debug: {
        hasMetadata: !!sessionClaims?.metadata,
        hasHasuraClaims: !!hasuraClaims,
        v2DefaultRole: (sessionClaims?.metadata as any)?.default_role,
        v1DefaultRole: hasuraClaims?.["x-hasura-default-role"],
        v1Role: hasuraClaims?.["x-hasura-role"]
      },
      bodyReceived: body
    });
    
  } catch (error) {
    console.error("WORKING POST TEST - Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}