/**
 * Simple AI Assistant Test Endpoint
 * 
 * Basic test to check if AI assistant modules can be imported and work
 */

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Test basic auth
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Test basic response
    return NextResponse.json({
      status: "OK",
      message: "AI Assistant test endpoint is working",
      userId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI Test API Error:", error);
    return NextResponse.json(
      { 
        error: "Test failed", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Test basic auth and JSON parsing
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    return NextResponse.json({
      status: "OK",
      message: "AI Assistant test POST is working",
      userId,
      requestBody: body,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI Test POST API Error:", error);
    return NextResponse.json(
      { 
        error: "Test POST failed", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}