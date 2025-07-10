import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/api-auth";

// This is a fallback route used during the build process
// to prevent API routes from failing when service account tokens are not available
export async function GET() {
  return NextResponse.json({
    message: "This is a fallback API route used during the build process",
    success: false,
  });
}

export async function POST() {
  return NextResponse.json({
    message: "This is a fallback API route used during the build process",
    success: false,
  });
}

export const dynamic = "force-static";
