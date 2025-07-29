import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Ultra-simple test endpoint using direct Clerk auth
export async function GET(req: NextRequest) {
  try {
    console.log("🔍 Simple test endpoint reached");
    
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: "Simple auth working",
      userId: userId,
      hasClaims: !!sessionClaims,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Simple test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}