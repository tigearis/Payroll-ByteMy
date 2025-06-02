import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

export async function POST(request: NextRequest) {
  try {
    const { payrollId, startDate, endDate } = await request.json();

    if (!payrollId || !startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Payroll ID, start date, and end date are required",
        },
        { status: 400 }
      );
    }

    console.log(
      `🔄 Starting regenerate dates for payroll ${payrollId} from ${startDate} to ${endDate}...`
    );

    // First delete existing dates in the range
    const deleteResponse = await fetch(
      `${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET!,
        },
        body: JSON.stringify({
          query: `
          mutation DeleteExistingDates($payrollId: uuid!, $startDate: date!, $endDate: date!) {
            delete_payroll_dates(where: {
              payroll_id: { _eq: $payrollId }
              original_eft_date: { _gte: $startDate, _lte: $endDate }
            }) {
              affected_rows
            }
          }
        `,
          variables: { payrollId, startDate, endDate },
        }),
      }
    );

    const deleteData = await deleteResponse.json();
    if (deleteData.errors) {
      throw new Error(deleteData.errors[0].message);
    }

    const deletedDates = deleteData.data.delete_payroll_dates.affected_rows;

    // Now regenerate dates using the database function
    // Note: We'll call this via direct database connection since Hasura might not expose the function directly
    const dbUrl = process.env.POSTGRES_URL;
    if (!dbUrl) {
      throw new Error("DATABASE_URL not configured");
    }

    // Try using direct SQL execution
    const pool = new Pool({ connectionString: dbUrl });

    let generatedCount = 0;
    try {
      const client = await pool.connect();
      try {
        const result = await client.query(
          `SELECT generate_payroll_dates($1::uuid, $2::date, $3::date)`,
          [payrollId, startDate, endDate]
        );
        generatedCount = result.rows[0]?.generate_payroll_dates?.length || 0;
      } finally {
        client.release();
      }
    } catch (dbError: any) {
      console.warn(
        "Direct DB call failed, trying Hasura function call:",
        dbError.message
      );

      // Fallback to Hasura function call if available
      const functionResponse = await fetch(
        `${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET!,
          },
          body: JSON.stringify({
            query: `
            mutation RegeneratePayrollDates($payrollId: uuid!, $startDate: date!, $endDate: date!) {
              generate_payroll_dates(args: {
                p_payroll_id: $payrollId
                p_start_date: $startDate
                p_end_date: $endDate
              }) {
                id
              }
            }
          `,
            variables: { payrollId, startDate, endDate },
          }),
        }
      );

      const functionData = await functionResponse.json();

      if (functionData.errors) {
        throw new Error(functionData.errors[0].message);
      }

      generatedCount = functionData.data.generate_payroll_dates?.length || 0;
    }

    console.log(
      `✅ Regenerate complete for payroll ${payrollId}: ${deletedDates} old dates deleted, ${generatedCount} new dates generated`
    );

    return NextResponse.json({
      success: true,
      message: `Regenerated dates for payroll ${payrollId}`,
      deletedDates,
      generatedCount,
      dateRange: `${startDate} to ${endDate}`,
    });
  } catch (error: any) {
    console.error("❌ Error regenerating single payroll dates:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
