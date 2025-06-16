import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-auth";

// Minimal test POST handler
export const POST = withAuth(
  async (request: NextRequest, session) => {
    console.log("🚀 Minimal staff create API called");
    console.log("🚀 Session:", { userId: session.userId, role: session.role });
    
    try {
      const body = await request.json();
      console.log("🚀 Request body:", body);
      
      return NextResponse.json({
        success: true,
        message: "Test successful - route is working",
        session: { userId: session.userId, role: session.role },
        body: body
      });
    } catch (error) {
      console.error("❌ Route error:", error);
      return NextResponse.json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      }, { status: 500 });
    }
  },
  { requiredRole: "manager" }
);

// Debug route to test if the route is accessible
export async function GET() {
  console.log("🔧 GET request received for staff/create (debug)");
  return new NextResponse("Route is accessible", { 
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  console.log("🔧 OPTIONS request received for staff/create");
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}