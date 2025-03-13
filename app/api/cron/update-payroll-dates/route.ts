// app/api/cron/update-payroll-dates/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { adminClient } from "@/lib/apollo-admin";
import { gql } from "@apollo/client";
import { addMonths, format } from "date-fns";

// GraphQL query to get payrolls
const GET_PAYROLLS = gql`
  query GetPayrolls($where: payrolls_bool_exp) {
    payrolls(where: $where) {
      id
    }
  }
`;

// GraphQL mutation to generate payroll dates
const GENERATE_PAYROLL_DATES = gql`
  mutation GeneratePayrollDates(
    $payrollId: uuid!,
    $startDate: date!,
    $endDate: date!
  ) {
    call_generate_payroll_dates(args: {
      p_payroll_id: $payrollId,
      p_start_date: $startDate,
      p_end_date: $endDate
    }) {
      success
    }
  }
`;

/**
 * Core function to update payroll dates
 * Can be called by both GET (cron job) and POST (manual trigger) handlers
 */
async function updatePayrollDates(req: NextRequest, specificPayrollIds?: string[]) {
  try {
    // Authorization check for manual requests
    if (req.method === 'POST') {
      const { userId, getToken } = await auth();
      
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      // Check user permissions
      const token = await getToken({ template: "hasura" });
      let userRole = "viewer";
      
      if (token) {
        const tokenParts = token.split('.');
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        const hasuraClaims = payload['https://hasura.io/jwt/claims'];
        userRole = hasuraClaims?.['x-hasura-default-role'] || "viewer";
      }
      
      // Only allow admin to manually trigger
      if (userRole !== "org_admin" && userRole !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    
    // Set up date range for generated dates
    const startDate = new Date();
    const endDate = addMonths(startDate, 12); // Generate 12 months of dates
    
    // Format dates as YYYY-MM-DD
    const formattedStart = format(startDate, "yyyy-MM-dd");
    const formattedEnd = format(endDate, "yyyy-MM-dd");
    
    // Build where clause based on whether specific payrolls were requested
    const whereClause = specificPayrollIds && specificPayrollIds.length > 0
      ? { id: { _in: specificPayrollIds } }
      : { status: { _eq: "Active" } };  // Default to all active payrolls
    
    // Get the payrolls to process
    const { data: payrollsData } = await adminClient.query({
      query: GET_PAYROLLS,
      variables: { where: whereClause }
    });
    
    const payrolls = payrollsData.payrolls || [];
    
    if (payrolls.length === 0) {
      return NextResponse.json({ 
        message: specificPayrollIds 
          ? "No matching payrolls found" 
          : "No active payrolls found to update"
      });
    }
    
    // Process each payroll
    const results = {
      total: payrolls.length,
      processed: 0,
      failed: 0,
      errors: [] as { payrollId: string, error: string }[]
    };
    
    for (const payroll of payrolls) {
      try {
        // Generate dates for this payroll
        await adminClient.mutate({
          mutation: GENERATE_PAYROLL_DATES,
          variables: {
            payrollId: payroll.id,
            startDate: formattedStart,
            endDate: formattedEnd
          }
        });
        
        results.processed++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          payrollId: payroll.id,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Updated payroll dates for ${results.processed} of ${results.total} payrolls`,
      errors: results.errors.length > 0 ? results.errors : undefined
    });
  } catch (error) {
    console.error("Error in payroll date update:", error);
    return NextResponse.json({ 
      error: "Failed to update payroll dates", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}

// GET handler for cron jobs
export async function GET(req: NextRequest) {
  // For scheduled cron jobs, process all active payrolls
  return updatePayrollDates(req);
}

// POST handler for manual triggers
export async function POST(req: NextRequest) {
  try {
    // Parse request body for specific payroll IDs
    const body = await req.json();
    const payrollIds = body.payrollIds || [];
    
    return updatePayrollDates(req, payrollIds);
  } catch (error) {
    console.error("Error parsing request:", error);
    return NextResponse.json({ 
      error: "Invalid request format", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 400 });
  }
}