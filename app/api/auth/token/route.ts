// app/api/auth/token/route.ts - Simple token endpoint for Apollo Client
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { getToken } = await auth();

    // Get token with Hasura template
    const token = await getToken({ template: "hasura" });

    if (!token) {
      return NextResponse.json(
        { error: "No token available" },
        { status: 401 }
      );
    }

    // Parse JWT to get expiry (optional)
    let expiresIn = 3600; // Default 1 hour
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp) {
        expiresIn = payload.exp - Math.floor(Date.now() / 1000);
      }
    } catch (e) {
      // Fallback to default if parsing fails
    }

    return NextResponse.json({
      token,
      expiresIn,
    });
  } catch (error) {
    console.error("Error getting token:", error);
    return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
  }
}
