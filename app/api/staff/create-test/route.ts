import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Direct POST without withAuth wrapper
export async function POST(request: NextRequest) {
  console.log("🔍 Direct POST handler called");
  
  try {
    // Manual auth check
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    
    return NextResponse.json({
      success: true,
      message: "Direct POST endpoint working",
      userId: userId.substring(0, 8) + "...",
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Direct POST error:", error);
    return NextResponse.json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}