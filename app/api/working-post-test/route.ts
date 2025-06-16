// Copying exact pattern from working GET routes
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  return NextResponse.json({ message: "GET works on this route" });
}

export async function POST(req: NextRequest) {
  try {
    console.log("WORKING POST TEST - Starting");
    
    // Get Clerk authentication
    const { userId, getToken } = await auth();
    console.log("WORKING POST TEST - User ID:", userId ? "present" : "none");

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get Hasura token
    const token = await getToken({ template: "hasura" });
    console.log("WORKING POST TEST - Token:", token ? "present" : "none");

    // Ensure we have a token
    if (!token) {
      return NextResponse.json(
        { error: "Failed to obtain authentication token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("WORKING POST TEST - Body received:", body);

    return NextResponse.json({
      success: true,
      message: "Working POST test successful!",
      userId: userId,
      bodyReceived: body
    });
    
  } catch (error) {
    console.error("WORKING POST TEST - Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}