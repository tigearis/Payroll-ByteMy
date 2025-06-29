import { NextRequest, NextResponse } from "next/server";

// Simple test route to check if the issue is with the complex route logic
export async function POST(request: NextRequest) {
  console.log("🔧 TEST ROUTE: POST method called successfully");
  
  return NextResponse.json({
    success: true,
    message: "Test route is working",
    method: request.method,
    url: request.url,
    timestamp: new Date().toISOString(),
  });
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}