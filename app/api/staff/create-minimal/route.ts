import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Minimal POST endpoint works",
    timestamp: new Date().toISOString()
  });
}