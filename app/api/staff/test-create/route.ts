import { NextRequest, NextResponse } from "next/server";

// Simple test endpoint without authentication
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "GET method works",
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      message: "POST method works",
      received: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      message: "POST method works (no body)",
      timestamp: new Date().toISOString()
    });
  }
}