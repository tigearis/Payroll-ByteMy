import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/lib/auth/api-auth";

export const POST = withAuth(
  async (request: NextRequest) => {
    // Restrict to development environment only
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    try {
      const { payrollId } = await request.json();

      if (!payrollId) {
        return NextResponse.json(
          { success: false, error: "Payroll ID is required" },
          { status: 400 }
        );
      }

      console.log(`🔄 Starting clean for payroll ${payrollId}...`);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET!,
          },
          body: JSON.stringify({
            query: `
          mutation CleanSinglePayroll($payrollId: uuid!) {
            delete_payroll_dates(where: { 
              _or: [
                { payroll_id: { _eq: $payrollId } }
                { payroll: { parent_payroll_id: { _eq: $payrollId } } }
              ]
            }) {
              affected_rows
            }
            delete_payrolls(where: { parent_payroll_id: { _eq: $payrollId } }) {
              affected_rows
            }
            update_payrolls_by_pk(
              pk_columns: { id: $payrollId }
              _set: { superseded_date: null, version_number: 1 }
            ) {
              id
            }
          }
        `,
            variables: { payrollId },
          }),
        }
      );

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      const deletedDates = data.data.deletepayroll_dates.affected_rows;
      const deletedVersions = data.data.deletepayrolls.affected_rows;
      const updated = data.data.update_payrolls_by_pk ? 1 : 0;

      console.log(
        `✅ Clean complete for payroll ${payrollId}: ${deletedDates} dates deleted, ${deletedVersions} versions deleted`
      );

      return NextResponse.json({
        success: true,
        message: `Cleaned payroll ${payrollId}`,
        deletedDates,
        deletedVersions,
        updatedPayroll: updated,
      });
    } catch (error: any) {
      console.error("❌ Error cleaning single payroll:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }
  },
  {
    requiredRole: "developer",
  }
);
