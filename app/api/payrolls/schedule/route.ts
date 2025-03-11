// app/api/payrolls/schedule/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { generatePayrollSchedule } from "@/lib/payroll-service"; // Corrected import path

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(req.url);
    const payrollId = url.searchParams.get("payrollId");
    const startDate = url.searchParams.get("startDate") || new Date().toISOString();
    const periods = url.searchParams.get("periods") || "12";

    if (!payrollId) {
      return NextResponse.json({ error: "Payroll ID is required" }, { status: 400 });
    }

    // Generate payroll schedule
    const schedule = await generatePayrollSchedule(
      parseInt(payrollId), 
      new Date(startDate), 
      parseInt(periods)
    );

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Schedule generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate payroll schedule" }, 
      { status: 500 }
    );
  }
}
