import { NextRequest, NextResponse } from "next/server";

// GraphQL query for cleanup
const CLEANUP_OLD_DATES_QUERY = `
  query CleanupOldPayrollDates {
    cleanup_old_payroll_dates {
      payroll_id
      deleted_count
    }
  }
`;

// GraphQL query for stats before cleanup
const GET_CLEANUP_STATS_QUERY = `
  query GetCleanupStats {
    payroll_dates_aggregate(
      where: {
        original_eft_date: { _lt: "now() - interval '1 year'" }
        processing_date: { _is_null: false }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const cronSecret = request.headers.get("x-cron-secret");
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🧹 Starting payroll date cleanup...");

    // Get Hasura admin token for database operations
    const hasuraAdminSecret = process.env.HASURA_GRAPHQL_ADMIN_SECRET;
    if (!hasuraAdminSecret) {
      throw new Error("Hasura admin secret not configured");
    }

    // First, check how many dates will be cleaned up
    console.log("📊 Checking dates eligible for cleanup...");
    const statsResponse = await fetch(process.env.HASURA_GRAPHQL_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": hasuraAdminSecret,
      },
      body: JSON.stringify({
        query: GET_CLEANUP_STATS_QUERY,
      }),
    });

    const statsData = await statsResponse.json();
    if (statsData.errors) {
      throw new Error(
        `Stats check failed: ${JSON.stringify(statsData.errors)}`
      );
    }

    const eligibleCount =
      statsData.data.payrolldates_aggregate.aggregate.count;
    console.log(`📈 Found ${eligibleCount} dates eligible for cleanup`);

    // Perform cleanup
    console.log("🚀 Starting cleanup operation...");

    const cleanupResponse = await fetch(process.env.HASURA_GRAPHQL_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": hasuraAdminSecret,
      },
      body: JSON.stringify({
        query: CLEANUP_OLD_DATES_QUERY,
      }),
    });

    const cleanupData = await cleanupResponse.json();
    if (cleanupData.errors) {
      throw new Error(`Cleanup failed: ${JSON.stringify(cleanupData.errors)}`);
    }

    const results = cleanupData.data.cleanup_old_payroll_dates;

    // Calculate summary statistics
    const totalDeleted = results.reduce(
      (sum: number, r: any) => sum + r.deleted_count,
      0
    );
    const payrollsAffected = results.length;

    console.log(
      `✅ Cleanup complete: ${totalDeleted} dates deleted from ${payrollsAffected} payrolls`
    );

    return NextResponse.json({
      message: "Payroll date cleanup completed",
      summary: {
        eligible_for_cleanup: eligibleCount,
        total_deleted: totalDeleted,
        payrolls_affected: payrollsAffected,
        cleanup_criteria: "Dates older than 1 year and already processed",
      },
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Cleanup error:", error);
    return NextResponse.json(
      {
        error: "Cleanup failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// GET endpoint for cleanup preview (dry run)
export async function GET(request: NextRequest) {
  try {
    // Simple auth check for GET requests
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasuraAdminSecret = process.env.HASURA_GRAPHQL_ADMIN_SECRET;
    if (!hasuraAdminSecret) {
      throw new Error("Hasura admin secret not configured");
    }

    // Get stats for cleanup preview
    const statsResponse = await fetch(process.env.HASURA_GRAPHQL_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": hasuraAdminSecret,
      },
      body: JSON.stringify({
        query: GET_CLEANUP_STATS_QUERY,
      }),
    });

    const statsData = await statsResponse.json();
    const eligibleCount =
      statsData.data?.payroll_dates_aggregate?.aggregate?.count || 0;

    return NextResponse.json({
      status: "preview",
      message: "Cleanup preview - no changes made",
      preview: {
        eligible_for_cleanup: eligibleCount,
        cleanup_criteria: "Dates older than 1 year and already processed",
        action_required:
          eligibleCount > 0
            ? "Run POST request to perform cleanup"
            : "No cleanup needed",
      },
      timestamp: new Date().toISOString(),
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
