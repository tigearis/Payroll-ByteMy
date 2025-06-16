import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-auth";

// Simple test route to verify auth is working
export const POST = withAuth(async (request: NextRequest, session) => {
  console.log("🧪 Test auth route called successfully");
  console.log("🧪 Session:", session);
  
  try {
    const body = await request.json();
    console.log("🧪 Request body:", body);
    
    return NextResponse.json({
      success: true,
      message: "Auth test successful",
      session: {
        userId: session.userId,
        role: session.role,
        email: session.email
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("🧪 Test auth error:", error);
    return NextResponse.json({
      error: "Test failed",
      details: error.message
    }, { status: 500 });
  }
}, {
  allowedRoles: ["admin", "org_admin"]
});

export async function GET() {
  return NextResponse.json({
    message: "Test auth route - use POST"
  });
}