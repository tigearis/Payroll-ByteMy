// app/api/payroll-dates/generated/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getServerApolloClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";
import { addMonths, format } from "date-fns";


export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId, getToken } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check user permissions
    const token = await getToken({ template: "hasura" });
    let userRole = "viewer"; // Default role
    
    if (token) {
      const tokenParts = token.split('.');
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      const hasuraClaims = payload['https://hasura.io/jwt/claims'];
      userRole = hasuraClaims?.['x-hasura-default-role'] || "viewer";
    }
    
    // Only allow certain roles to generate dates
    if (!["org_admin", "manager"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Parse request body
    const { payrollId, startDate, months = 12 } = await req.json();
    
    if (!payrollId) {
      return NextResponse.json({ error: "Payroll ID is required" }, { status: 400 });
    }
    
    // Calculate start and end dates
    const start = startDate ? new Date(startDate) : new Date();
    const end = addMonths(start, months);
    
    // Format dates as YYYY-MM-DD
    const formattedStart = format(start, "yyyy-MM-dd");
    const formattedEnd = format(end, "yyyy-MM-dd");
    
    // Call the database function
    const { data } = await adminClient.mutate({
      mutation: GENERATE_PAYROLL_DATES,
      variables: {
        payrollId,
        startDate: formattedStart,
        endDate: formattedEnd
      }
    });
    
    if (!data.call_generate_payroll_dates.success) {
      return NextResponse.json({
        error: "Failed to generate payroll dates"
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: `Generated payroll dates from ${formattedStart} to ${formattedEnd}`
    });
  } catch (error) {
    console.error("Error generating payroll dates:", error);
    return NextResponse.json({ 
      error: "Failed to generate payroll dates", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}