import { gql } from "@apollo/client";
import { NextRequest, NextResponse } from "next/server";
import { adminOperationsService } from "@/lib/apollo/admin-operations";
import { validateCronRequest } from "@/lib/auth/api-auth";

// GraphQL query for bulk date generation
const GENERATE_BULK_DATES_QUERY = gql`
  query GenerateBulkPayrollDates($yearsAhead: Int!) {
    generate_all_payroll_dates_bulk(p_years_ahead: $yearsAhead) {
      payroll_id
      dates_generated
      start_date
      end_date
      status
    }
  }
`;

// GraphQL query to check coverage
const CHECK_COVERAGE_QUERY = gql`
  query CheckPayrollDateCoverage {
    check_payroll_date_coverage {
      payroll_id
      payroll_name
      latest_date
      days_ahead
      needs_generation
      recommended_action
    }
  }
`;

// GraphQL query for stats
const GET_STATS_QUERY = gql`
  query GetPayrollDateStats {
    get_payroll_date_stats {
      total_active_payrolls
      total_future_dates
      avg_days_ahead
      min_days_ahead
      max_days_ahead
      payrolls_needing_dates
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    if (!validateCronRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🕐 Starting bulk payroll date generation...");

    const { yearsAhead = 2, checkOnly = false } = await request.json();

    // First, check current coverage
    console.log("📊 Checking current date coverage...");
    const { data: coverageData, errors: coverageErrors } =
      await adminOperationsService.executeAdminQuery(
        CHECK_COVERAGE_QUERY,
        {}
      );

    if (coverageErrors) {
      throw new Error(
        `Coverage check failed: ${JSON.stringify(coverageErrors)}`
      );
    }

    const coverage = coverageData.check_payroll_date_coverage;
    console.log(
      `📈 Coverage check complete: ${coverage.length} payrolls analyzed`
    );

    // Get current stats
    const { data: statsData } = await adminOperationsService.executeAdminQuery(
      GET_STATS_QUERY,
      {}
    );

    const stats = statsData?.get_payroll_date_stats?.[0];

    // If checkOnly, return analysis without generating
    if (checkOnly) {
      return NextResponse.json({
        message: "Coverage analysis complete",
        coverage,
        stats,
        recommendations: coverage.filter((p: any) => p.needs_generation),
      });
    }

    // Generate dates for all payrolls
    console.log(
      `🚀 Generating ${yearsAhead} years of dates for all active payrolls...`
    );

    const { data: generateData, errors: generateErrors } =
      await adminOperationsService.executeAdminQuery(
        GENERATE_BULK_DATES_QUERY,
        { yearsAhead }
      );

    if (generateErrors) {
      throw new Error(
        `Bulk generation failed: ${JSON.stringify(generateErrors)}`
      );
    }

    const results = generateData.generate_all_payroll_dates_bulk;

    // Calculate summary statistics
    const successful = results.filter((r: any) => r.status === "success");
    const failed = results.filter((r: any) => r.status !== "success");
    const totalDatesGenerated = successful.reduce(
      (sum: number, r: any) => sum + r.dates_generated,
      0
    );

    console.log(
      `✅ Bulk generation complete: ${successful.length} successful, ${failed.length} failed`
    );
    console.log(`📅 Total dates generated: ${totalDatesGenerated}`);

    // Log any failures
    if (failed.length > 0) {
      console.error("❌ Failed payrolls:", failed);
    }

    return NextResponse.json({
      message: "Bulk payroll date generation completed",
      summary: {
        total_payrolls: results.length,
        successful: successful.length,
        failed: failed.length,
        total_dates_generated: totalDatesGenerated,
        years_ahead: yearsAhead,
      },
      results,
      coverage_before: coverage,
      stats_before: stats,
      failed_payrolls: failed,
    });
  } catch (error: any) {
    console.error("❌ Bulk generation error:", error);
    return NextResponse.json(
      {
        error: "Bulk generation failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// GET endpoint for health checks and status
export async function GET(request: NextRequest) {
  try {
    // Simple auth check for GET requests
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current stats only
    const { data: statsData } = await adminOperationsService.executeAdminQuery(
      GET_STATS_QUERY,
      {}
    );

    const stats = statsData?.get_payroll_date_stats?.[0];

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      stats,
      message: "Payroll date generation service is operational",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
