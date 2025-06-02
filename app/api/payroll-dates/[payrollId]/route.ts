// app/api/payroll-dates/[payrollId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { adminApolloClient } from "@/lib/server-apollo-client";
import { gql } from "@apollo/client";

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ payrollId: string }> }
) {
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
      query: GET_PAYROLL_DATES,
      variables: {
        payrollId,
        limit,
      },
    });

    return NextResponse.json({
      dates: data.payroll_dates,
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
