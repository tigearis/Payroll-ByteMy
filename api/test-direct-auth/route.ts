import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  console.log("🚀 Direct auth POST called");
  
  try {
    const { userId, sessionClaims } = await auth();
    console.log("🚀 Direct auth - User ID:", userId ? userId.substring(0, 8) + "..." : "none");
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const claims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const userRole = claims?.["x-hasura-default-role"];
    console.log("🚀 Direct auth - User role:", userRole);

    const body = await request.json();
    console.log("🚀 Direct auth - Request body:", body);
    
    return NextResponse.json({
      success: true,
      message: "Direct auth POST working!",
      userId: userId,
      role: userRole,
      body: body
    });
  } catch (error) {
    console.error("❌ Direct auth error:", error);
    return NextResponse.json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}