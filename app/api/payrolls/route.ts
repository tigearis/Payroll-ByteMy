// app/api/payrolls/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GetPayrollsDocument, type GetPayrollsQuery } from '@/domains/payrolls/graphql/generated/graphql';
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";
import { getSessionClaims } from "@/lib/auth/token-utils";

export const GET = withAuth(
  async (_req: NextRequest) => {
    try {
      // Execute authenticated GraphQL query with full type safety
      const data = await executeTypedQuery<GetPayrollsQuery>(GetPayrollsDocument);

      // Get role for debug info (optional)
      const { role: userRole } = await getSessionClaims();

      console.log("🔍 PAYROLL ROUTE - Success:", {
        payrollCount: data.payrolls?.length,
        userRole,
      });

      return NextResponse.json({
        payrolls: data.payrolls,
        // TEMPORARY: Include debug info
        debug: {
          userRole,
          payrollCount: data.payrolls?.length,
        },
      });
    } catch (error) {
      console.error("Payroll Fetch Error:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch payrolls",
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
