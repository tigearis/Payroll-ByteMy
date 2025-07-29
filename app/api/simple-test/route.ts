import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Simple test endpoint works",
    timestamp: new Date().toISOString(),
    method: "GET"
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Simple test endpoint works",
    timestamp: new Date().toISOString(),
    method: "POST"
  });
}