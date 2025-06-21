import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

import { withAuth } from "@/lib/auth/api-auth";

export const POST = withAuth(
  async (request: NextRequest) => {
    // Restrict to development environment only
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

  try {
    const { startDate, endDate } = await request.json();

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: "Start date and end date are required" },
        { status: 400 }
      );
    }

    console.log(
      `🔄 Starting regenerate all dates from ${startDate} to ${endDate}...`
    );

    // First get all current payrolls
    const payrollResponse = await fetch(
      `${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET!,
        },
        body: JSON.stringify({
          query: `
          query GetAllPayrolls {
            payrolls(where: { superseded_date: { _is_null: true } }) {
              id
              name
            }
          }
        `,
        }),
      }
    );

    const payrollData = await payrollResponse.json();
    if (payrollData.errors) {
      throw new Error(payrollData.errors[0].message);
    }

    const payrolls = payrollData.data.payrolls;
    const results = [];

    // Check if DATABASE_URL is available for direct function calls
    const dbUrl = process.env.POSTGRES_URL;
    if (!dbUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL not configured for bulk regeneration",
        },
        { status: 500 }
      );
    }

    const pool = new Pool({ connectionString: dbUrl });

    // Process each payroll individually using direct database function call
    for (const payroll of payrolls) {
      try {
        let generatedCount = 0;
        const client = await pool.connect();
        try {
          const result = await client.query(
            `SELECT COUNT(*) as count FROM generate_payroll_dates($1::uuid, $2::date, $3::date)`,
            [payroll.id, startDate, endDate]
          );
          generatedCount = parseInt(result.rows[0]?.count || "0");
        } finally {
          client.release();
        }

        results.push({
          payrollId: payroll.id,
          payrollName: payroll.name,
          success: true,
          generatedCount,
        });
      } catch (error: any) {
        console.warn(
          `Warning: Could not regenerate dates for ${payroll.name}:`,
          error
        );
        results.push({
          payrollId: payroll.id,
          payrollName: payroll.name,
          success: false,
          error: error.message,
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const totalGenerated = results.reduce(
      (sum, r) => sum + (r.generatedCount || 0),
      0
    );

    console.log(
      `✅ Regenerate complete: ${successCount}/${payrolls.length} payrolls processed, ${totalGenerated} total dates generated`
    );

    return NextResponse.json({
      success: true,
      message: `Regenerated dates for ${successCount}/${payrolls.length} payrolls`,
      totalPayrolls: payrolls.length,
      successCount,
      totalGenerated,
      results,
    });
  } catch (error: any) {
    console.error("❌ Error regenerating all dates:", error);
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
