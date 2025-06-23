// app/api/payroll-dates/[payrollId]/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { adminApolloClient } from "@/lib/apollo/unified-client";
import { withAuthParams } from "@/lib/auth/api-auth";
import { GetPayrollDatesDocument } from "@/domains/payrolls/graphql/generated/graphql";

export const GET = withAuthParams(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ payrollId: string }> },
    session
  ) => {
    try {
      // Check authentication
      const { userId } = await auth();

      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { payrollId } = await params;
      const searchParams = req.nextUrl.searchParams;
      const months = parseInt(searchParams.get("months") || "12");

      // Calculate the number of entries to fetch (approximation based on cycle)
      // For monthly, we need 12 entries per year
      // For weekly, we need 52 entries per year
      // We'll use a rough average of 30 entries per year to be safe
      const limit = Math.max(12, Math.ceil(months * 2.5));

      // Fetch payroll dates
      const { data } = await adminApolloClient.query({
        query: GetPayrollDatesDocument,
        variables: {
          payrollId,
          limit,
        },
      });

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
  },
  {
    requiredRole: "viewer",
  }
);
