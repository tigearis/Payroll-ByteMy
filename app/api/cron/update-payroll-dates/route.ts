import { format, addMonths } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { executeTypedQuery, executeTypedMutation } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";
import { 
  GeneratePayrollDatesQueryDocument,
  type GeneratePayrollDatesQueryQuery
} from "@/domains/payrolls/graphql/generated/graphql";
import { UpdatePayrollStatusDocument as UPDATE_PAYROLL_STATUS } from "@/domains/payrolls";

export const POST = withAuth(
  async (req) => {
    const {
      payrollIds,
      updateStatus = false,
      newStatus = "Active",
    } = await req.json();

    if (!payrollIds || !Array.isArray(payrollIds) || payrollIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid input: Provide an array of payroll IDs" },
        { status: 400 }
      );
    }

    const startDate = new Date();
    const endDate = addMonths(startDate, 12);
    const formattedStart = format(startDate, "yyyy-MM-dd");
    const formattedEnd = format(endDate, "yyyy-MM-dd");

    const results = {
      total: payrollIds.length,
      processed: 0,
      failed: 0,
      errors: [] as { payrollId: string; error: string }[],
    };

    for (const payrollId of payrollIds) {
      try {
        const dateData = await executeTypedQuery<GeneratePayrollDatesQueryQuery>(
          GeneratePayrollDatesQueryDocument,
          {
            payrollId,
            startDate: formattedStart,
            endDate: formattedEnd,
          }
        );

        if (updateStatus) {
          try {
            await executeTypedMutation(UPDATE_PAYROLL_STATUS, {
              id: payrollId,
              status: newStatus,
            });
          } catch (statusUpdateError) {
            console.error(`Error updating status for payroll ${payrollId}:`, statusUpdateError);
          }
        }

        const generatedDates = dateData?.generatePayrollDates;
        if (!generatedDates || generatedDates.length === 0) {
          results.failed++;
          results.errors.push({ payrollId, error: "No dates generated" });
          continue;
        }

        results.processed++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          payrollId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return NextResponse.json({
      success: results.processed > 0,
      message: `Processed ${results.processed} of ${results.total} payrolls`,
      total: results.total,
      processed: results.processed,
      failed: results.failed,
      errors: results.errors.length > 0 ? results.errors : undefined,
    });
  },
  { allowedRoles: ["developer", "org_admin"] }
);
