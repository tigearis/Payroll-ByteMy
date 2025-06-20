import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("🚀 TEST POST handler working!");
  
  try {
    const body = await request.json();
    console.log("🚀 TEST POST body:", body);
    
    return NextResponse.json({
      success: true,
      message: "TEST POST route is working!",
      body: body
    });
  } catch (error) {
    console.error("❌ TEST POST error:", error);
    return NextResponse.json({ error: "TEST POST failed" }, { status: 500 });
  }
}

export async function GET() {
  console.log("🚀 TEST GET handler working!");
  return new NextResponse("TEST GET working");
}