// app/api/payroll-dates/[payrollId]/route.ts
import { gql } from "@apollo/client";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, _NextResponse } from "next/server";

import { adminApolloClient } from "@/lib/apollo/unified-client";
import { withAuthParams } from "@/lib/auth/api-auth";

// GraphQL query to get payroll dates
const GET_PAYROLL_DATES = gql`
  query GetPayrollDates($payrollId: uuid!, $limit: Int) {
    payroll_dates(
      where: { payroll_id: { _eq: $payrollId } }
      order_by: { adjusted_eft_date: asc }
      limit: $limit
    ) {
      id
      original_eft_date
      adjusted_eft_date
      processing_date
      notes
    }
  }
`;

export const GET = withAuthParams(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ payrollId: string }> },
    _session
  ) => {
    try {
      // Check authentication
      const { _userId } = await auth();

      if (!_userId) {
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
      const { _data } = await adminApolloClient.query({
        query: GET_PAYROLL_DATES,
        variables: {
          payrollId,
          limit,
        },
      });

      return NextResponse.json({
        dates: data.payroll_dates,
      });
    } catch (_error) {
      console.error("Error fetching payroll dates:", _error);
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
