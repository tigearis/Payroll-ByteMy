import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/api-auth";

// Simple test endpoint to debug API route issues
export const GET = withAuth(async (req: NextRequest, session) => {
  try {
    console.log("🔍 Debug endpoint reached");
    console.log("📊 Session data:", {
      userId: session.userId,
      role: session.role,
      email: session.email,
    });

    return NextResponse.json({
      success: true,
      message: "API route working correctly",
      session: {
        userId: session.userId,
        role: session.role,
        email: session.email,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Debug endpoint error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
        stack: error.stack,
      },
      { status: 500 }
    );
  }
});