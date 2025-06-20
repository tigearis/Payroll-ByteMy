// app/api/payrolls/schedule/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
// import { generatePayrollSchedule } from "@/lib/payroll-service"; // Commented out due to missing Drizzle schema

export async function GET(req: NextRequest) {
  try {
    // Check authentication with Clerk
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user role
    const claims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const userRole = claims?.["x-hasura-default-role"];

    if (!["developer", "org_admin", "manager", "consultant"].includes(userRole)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Get query parameters
    const url = new URL(req.url);
    const payrollId = url.searchParams.get("payrollId");
    const startDate =
      url.searchParams.get("startDate") || new Date().toISOString();
    const periods = url.searchParams.get("periods") || "12";

    if (!payrollId) {
      return NextResponse.json(
        { error: "Payroll ID is required" },
        { status: 400 }
      );
    }

    // TODO: Implement payroll schedule generation with Hasura GraphQL
    // For now, return a placeholder response
    return NextResponse.json({
      message: "Payroll schedule generation not yet implemented with Hasura",
      payrollId,
      startDate,
      periods: parseInt(periods),
      // schedule: await generatePayrollSchedule(parseInt(payrollId), new Date(startDate), parseInt(periods))
    });
  } catch (error) {
    console.error("Schedule generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate payroll schedule" },
      { status: 500 }
    );
  }
}
