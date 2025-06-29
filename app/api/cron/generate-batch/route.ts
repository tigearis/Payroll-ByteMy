// app/api/cron/generate-batch/route.ts
import { format, addMonths } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { 
  GeneratePayrollDatesQueryDocument,
  type GeneratePayrollDatesQuery
} from "@/domains/payrolls/graphql/generated/graphql";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";

export const POST = withAuth(async (req: NextRequest) => {
  try {

    // Parse request body
    const { payrollIds, startDate } = await req.json();

    // Validate input
    if (!payrollIds || !Array.isArray(payrollIds) || payrollIds.length === 0) {
      return NextResponse.json(
        {
          error: "Invalid input: Provide an array of payroll IDs",
        },
        { status: 400 }
      );
    }

    // Set up date range for generated dates
    const start = startDate ? new Date(startDate) : new Date();
    const end = addMonths(start, 12); // Generate 12 months of dates

    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

    // Process each payroll
    const results = {
      total: payrollIds.length,
      processed: 0,
      failed: 0,
      errors: [] as { payrollId: string; error: string }[],
    };

    // Process payrolls in batches to avoid timeouts
    for (const payrollId of payrollIds) {
      try {
        console.log(`Processing payroll: ${payrollId}`);

        // Generate dates using executeTypedQuery
        const data = await executeTypedQuery<GeneratePayrollDatesQuery>(
          GeneratePayrollDatesQueryDocument,
          {
            payrollId,
            startDate: formatDate(start),
            endDate: formatDate(end),
          },
          { fetchPolicy: "network-only" }
        );

        // Check if dates were generated successfully
        if (
          !data?.generatePayrollDates ||
          data.generatePayrollDates.length === 0
        ) {
          console.warn(`No dates generated for payroll: ${payrollId}`);
          results.failed++;
          results.errors.push({
            payrollId,
            error: "No dates generated",
          });
          continue;
        }

        results.processed++;
        console.log(`Successfully processed payroll: ${payrollId}`);
      } catch (error) {
        console.error(`Error processing payroll ${payrollId}:`, error);
        results.failed++;
        results.errors.push({
          payrollId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Prepare and return response
    return NextResponse.json({
      success: results.processed > 0,
      message: `Processed ${results.processed} of ${results.total} payrolls`,
      total: results.total,
      processed: results.processed,
      failed: results.failed,
      errors: results.errors.length > 0 ? results.errors : undefined,
    });
  } catch (error) {
    console.error("Error in batch processing:", error);
    return NextResponse.json(
      {
        error: "Failed to process payrolls",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}, {
  allowedRoles: ["org_admin", "developer"]
});
