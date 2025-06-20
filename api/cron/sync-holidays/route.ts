import { handleApiError, createSuccessResponse } from "@/lib/shared/error-handling";
// app/api/cron/sync-holidays/route.ts
import { NextResponse } from "next/server";
import { syncAustralianHolidays } from "@/lib/holiday-sync-service";
import { logger, LogCategory } from "@/lib/logging";

export async function GET(request: Request) {
  try {
    // SECURITY: Verify request is from authorized source
    const cronSecret = request.headers.get("x-cron-secret");

    // Check for cron secret (for Vercel cron jobs)
    if (cronSecret !== process.env.CRON_SECRET) {
      console.error(
        "🚨 Unauthorized cron request - invalid secret for sync-holidays"
      );
      await logger.security(
        "Unauthorized cron request - invalid secret for sync-holidays",
        {
          category: LogCategory.SECURITY_EVENT,
          metadata: {
            source: "sync-holidays",
            ip: request.headers.get("x-forwarded-for"),
          },
        }
      );
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if force sync is requested via query parameter
    const url = new URL(request.url);
    const forceSync = url.searchParams.get("force") === "true";

    console.log(`🚀 Cron holiday sync started (force: ${forceSync})`);

    // Sync Australian holidays with duplicate checking
    const result = await syncAustralianHolidays(forceSync);

    console.log(`✅ Cron holiday sync completed:`, result);

    return NextResponse.json({
      success: true,
      message: result.message,
      details: {
        totalAffected: result.totalAffected,
        skippedCount: result.skippedCount,
        forceSync,
        results: result.results,
      },
    });
  } catch (error) {
    return handleApiError(error, "cron");
  }
}

// Note: Configure this in vercel.json to run periodically
// Usage:
// - Normal sync (skips if data exists): GET /api/cron/sync-holidays
// - Force sync (overwrites existing): GET /api/cron/sync-holidays?force=true
