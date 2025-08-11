// app/api/payroll-dates/[payrollId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  GetPayrollDatesDocument,
  type GetPayrollDatesQuery,
} from "@/domains/payrolls/graphql/generated/graphql";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

export const GET = withAuth(
  async (req: NextRequest) => {
    try {
      // Extract payrollId from URL path
      const url = new URL(req.url);
      const payrollId = url.pathname.split("/").slice(-1)[0]; // Get the last segment

      if (!payrollId) {
        return NextResponse.json(
          { error: "Payroll ID is required" },
          { status: 400 }
        );
      }

      const searchParams = req.nextUrl.searchParams;
      const months = parseInt(searchParams.get("months") || "12");

      // Calculate the number of entries to fetch (approximation based on cycle)
      // For monthly, we need 12 entries per year
      // For weekly, we need 52 entries per year
      // We'll use a rough average of 30 entries per year to be safe
      const limit = Math.max(12, Math.ceil(months * 2.5));

      // Fetch payroll dates
      const data = await executeTypedQuery<GetPayrollDatesQuery>(
        GetPayrollDatesDocument,
        {
          payrollId,
          limit,
        }
      );

      return NextResponse.json({
        dates: data.payrollDates,
      });
    } catch (error) {
      console.error("Error fetching payroll dates:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch payroll dates",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }
);
