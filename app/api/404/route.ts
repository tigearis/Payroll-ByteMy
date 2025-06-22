import { NextResponse } from "next/server";

/**
 * Custom 404 API route for development endpoints
 * This route handles requests to development/testing APIs that are excluded in production
 */
export async function GET() {
  return NextResponse.json(
    {
      error: "Not Found",
      message: "This development endpoint is not available in production",
      code: "DEV_ENDPOINT_DISABLED",
    },
    { status: 404 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      error: "Not Found",
      message: "This development endpoint is not available in production",
      code: "DEV_ENDPOINT_DISABLED",
    },
    { status: 404 }
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      error: "Not Found",
      message: "This development endpoint is not available in production",
      code: "DEV_ENDPOINT_DISABLED",
    },
    { status: 404 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      error: "Not Found",
      message: "This development endpoint is not available in production",
      code: "DEV_ENDPOINT_DISABLED",
    },
    { status: 404 }
  );
}
