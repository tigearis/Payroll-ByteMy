// app/api/cron/update-payroll-dates/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getServerApolloClient } from "@/lib/server-apollo-client";
import { format, addMonths } from "date-fns";
import { GENERATE_PAYROLL_DATES } from "@/graphql/mutations/payrolls/generatePayrollDates";
import { UPDATE_PAYROLL_STATUS } from "@/graphql/mutations/payrolls/updatePayrollStatus";

export async function POST(req: NextRequest) {
  try {
    // Authentication and authorization check
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get Hasura token
    const token = await getToken({ template: "hasura" });

    if (!token) {
      return NextResponse.json(
        { error: "Failed to obtain authentication token" },
        { status: 401 }
      );
    }

    // Initialize Apollo Client
    const client = await getServerApolloClient();

    // Parse request body
    const {
      payrollIds,
      updateStatus = false, // Optional flag to update status
      newStatus = "Active", // Default new status
    } = await req.json();

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
    const startDate = new Date();
    const endDate = addMonths(startDate, 12); // Generate 12 months of dates

    // Format dates as YYYY-MM-DD
    const formattedStart = format(startDate, "yyyy-MM-dd");
    const formattedEnd = format(endDate, "yyyy-MM-dd");

    // Process each payroll
    const results = {
      total: payrollIds.length,
      processed: 0,
      failed: 0,
      errors: [] as { payrollId: string; error: string }[],
    };

    for (const payrollId of payrollIds) {
      try {
        console.log(`Processing payroll: ${payrollId}`);

        // Generate dates using Apollo mutation
        const { data: dateData, errors: dateErrors } = await client.mutate({
          mutation: GENERATE_PAYROLL_DATES,
          variables: {
            payrollId: payrollId,
            startDate: formattedStart,
            endDate: formattedEnd,
          },
          context: {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        });

        if (dateErrors) {
          console.error(
            `Date Generation Errors for payroll ${payrollId}:`,
            dateErrors
          );
          results.failed++;
          results.errors.push({
            payrollId,
            error: dateErrors.map((e) => e.message).join(", "),
          });
          continue;
        }

        // Optional status update
        if (updateStatus) {
          try {
            const { data: _statusData, errors: statusErrors } =
              await client.mutate({
                mutation: UPDATE_PAYROLL_STATUS,
                variables: {
                  payrollId: payrollId,
                  status: newStatus,
                },
                context: {
                  headers: {
                    authorization: `Bearer ${token}`,
                  },
                },
              });

            if (statusErrors) {
              console.warn(
                `Status update errors for payroll ${payrollId}:`,
                statusErrors
              );
            }
          } catch (statusUpdateError) {
            console.error(
              `Error updating status for payroll ${payrollId}:`,
              statusUpdateError
            );
          }
        }

        // Check if dates were generated
        const generatedDates = dateData.generate_payroll_dates;
        if (!generatedDates || generatedDates.length === 0) {
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
    console.error("Error in payroll processing:", error);
    return NextResponse.json(
      {
        error: "Failed to process payrolls",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
