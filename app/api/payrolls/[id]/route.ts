// app/api/payrolls/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GetPayrollByIdDocument, type GetPayrollByIdQuery } from "@/domains/payrolls/graphql/generated/graphql";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuthParams } from "@/lib/auth/api-auth";

type PayrollResponse = 
  | { error: string }
  | NonNullable<GetPayrollByIdQuery['payrollById']>;

export const GET = withAuthParams(
  async (
    _req: NextRequest,
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
        GetPayrollByIdDocument,
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
  }
);
