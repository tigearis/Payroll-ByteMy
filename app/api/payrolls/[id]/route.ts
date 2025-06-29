// app/api/payrolls/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

import { GetPayrollByIdDocument as GET_PAYROLL_BY_ID, type GetPayrollByIdQuery } from "@/domains/payrolls";
import { withAuthParams } from "@/lib/auth/api-auth";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";

export const GET = withAuthParams(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
    session
  ) => {
    try {
      const { id } = await params;

      if (!id) {
        return NextResponse.json({ error: "Missing ID" }, { status: 400 });
      }

      // Execute authenticated GraphQL query with full type safety
      const data = await executeTypedQuery<GetPayrollByIdQuery>(
        GET_PAYROLL_BY_ID,
        { id }
      );

      if (!data.payrollById) {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
      }

      return NextResponse.json(data.payrollById);
    } catch (error) {
      console.error("Payroll fetch error:", error);
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }
  },
  {
    requiredRole: "viewer",
  }
);
