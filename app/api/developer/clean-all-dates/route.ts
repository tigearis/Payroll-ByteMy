import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Starting clean all dates and versions...");

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
          mutation CleanAllDatesAndVersions {
            delete_payroll_dates(where: {}) {
              affected_rows
            }
            delete_payrolls(where: { parent_payroll_id: { _is_null: false } }) {
              affected_rows
            }
            update_payrolls(
              where: {}
              _set: { superseded_date: null, version_number: 1 }
            ) {
              affected_rows
            }
          }
        `,
        }),
      }
    );

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    const deletedDates = data.data.delete_payroll_dates.affected_rows;
    const deletedVersions = data.data.delete_payrolls.affected_rows;
    const resetPayrolls = data.data.update_payrolls.affected_rows;

    console.log(
      `✅ Clean complete: ${deletedDates} dates deleted, ${deletedVersions} versions deleted, ${resetPayrolls} payrolls reset`
    );

    return NextResponse.json({
      success: true,
      message: `Cleaned all dates and versions`,
      deletedDates,
      deletedVersions,
      resetPayrolls,
    });
  } catch (error: any) {
    console.error("❌ Error cleaning all dates and versions:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
