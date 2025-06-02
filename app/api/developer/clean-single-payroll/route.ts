import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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

    const deletedDates = data.data.delete_payroll_dates.affected_rows;
    const deletedVersions = data.data.delete_payrolls.affected_rows;
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
}
