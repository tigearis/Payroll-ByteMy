// app/api/hasura-actions/generate-payroll-dates/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Import your database connection

export async function POST(req: NextRequest) {
  try {
    // Parse the Hasura action payload
    const { input } = await req.json();
    
    // Extract parameters
    const { payrollId, startDate, endDate } = input.args;
    
    // Call the function directly
    const result = await db.query(
      'SELECT generate_payroll_dates($1, $2, $3) as success',
      [payrollId, startDate, endDate]
    );
    
    const success = result.rows[0]?.success === true;
    
    return NextResponse.json({
      success
    });
  } catch (error) {
    console.error("Error in generate-payroll-dates action:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}