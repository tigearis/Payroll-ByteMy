// app/api/cron/sync-holidays/route.ts
import { NextResponse } from "next/server";
import { syncAustralianHolidays } from "@/lib/holiday-sync-service";

export async function GET(request: Request) {
  try {
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
    console.error("❌ Cron holiday sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to sync holidays via cron",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Note: Configure this in vercel.json to run periodically
// Usage:
// - Normal sync (skips if data exists): GET /api/cron/sync-holidays
// - Force sync (overwrites existing): GET /api/cron/sync-holidays?force=true
