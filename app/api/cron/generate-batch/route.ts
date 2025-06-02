// app/api/cron/generate-batch/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { adminApolloClient } from "@/lib/server-apollo-client"; // Updated import to use the consolidated file
import { gql } from "@apollo/client";
import { format, addMonths } from "date-fns";

// GraphQL mutation to generate payroll dates for a single payroll
const GENERATE_PAYROLL_DATES = gql`
  mutation GeneratePayrollDates(
    $payrollId: uuid!
    $startDate: date!
    $endDate: date!
  ) {
    generate_payroll_dates(
      p_payroll_id: $payrollId
      p_start_date: $startDate
      p_end_date: $endDate
    ) {
      id
    }
  }
`;

export async function POST(req: NextRequest) {
  try {
    // Authentication and authorization check
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user permissions
    const token = await getToken({ template: "hasura" });
    let userRole = "viewer";

    if (token) {
      const tokenParts = token.split(".");
      if (tokenParts.length >= 2) {
        const payload = JSON.parse(
          Buffer.from(tokenParts[1], "base64").toString()
        );
        const hasuraClaims = payload["https://hasura.io/jwt/claims"];
        userRole = hasuraClaims?.["x-hasura-default-role"] || "viewer";
      }
    }

    // Only allow certain roles to generate dates
    const allowedRoles = ["org_admin", "admin"];
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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

        // Generate dates using the admin Apollo client
        const { data, errors } = await adminApolloClient.mutate({
          mutation: GENERATE_PAYROLL_DATES,
          variables: {
            payrollId,
            startDate: formatDate(start),
            endDate: formatDate(end),
          },
        });

        if (errors) {
          console.error(`Errors for payroll ${payrollId}:`, errors);
          results.failed++;
          results.errors.push({
            payrollId,
            error: errors.map((e) => e.message).join(", "),
          });
          continue;
        }

        // Check if dates were generated successfully
        if (
          !data?.generate_payroll_dates ||
          data.generate_payroll_dates.length === 0
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
}
