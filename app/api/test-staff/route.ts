import { NextRequest, NextResponse } from "next/server";

// Simple test endpoint to check if API routes work
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Test API route working",
    method: "GET",
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  console.log("🧪 Test POST endpoint called");
  
  try {
    const body = await request.json();
    
    return NextResponse.json({
      success: true,
      message: "Test POST endpoint working",
      method: "POST",
      timestamp: new Date().toISOString(),
      receivedBody: body
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Test POST endpoint error",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}