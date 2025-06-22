// app/api/payrolls/[id]/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { GetPayrollByIdDocument as GET_PAYROLL_BY_ID } from "@/domains/payrolls";
import { serverApolloClient } from "@/lib/apollo/unified-client";
import { withAuthParams } from "@/lib/auth/api-auth";

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

      // Get Clerk authentication token
      const authInstance = await auth();
      const token = await authInstance.getToken({ template: "hasura" });

      // Get Apollo Client
      const client = serverApolloClient;

      const { data } = await client.query({
        query: GET_PAYROLL_BY_ID,
        variables: { id },
        context: { headers: { authorization: `Bearer ${token}` } },
      });

      if (!data.payroll) {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
      }

      return NextResponse.json(data.payroll);
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
