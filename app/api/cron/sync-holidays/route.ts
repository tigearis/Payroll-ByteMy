// app/api/cron/sync-holidays/route.ts
import { NextResponse } from "next/server";

import { syncAustralianHolidays } from "@/domains/external-systems/services/holiday-sync-service";
import {
  auditLogger,
  LogLevel,
  LogCategory,
  SOC2EventType,
} from "@/lib/security/audit/logger";

export async function GET(request: Request) {
  try {
    // SECURITY: Verify request is from authorized source
    const cronSecret = request.headers.get("x-cron-secret");

    // Check for cron secret (for Vercel cron jobs)
    if (cronSecret !== process.env.CRON_SECRET) {
      console.error(
        "🚨 Unauthorized cron request - invalid secret for sync-holidays"
      );
      // Need to convert Request to NextRequest for extractClientInfo
      const nextRequest = request as any;
      const clientInfo = {
        ipAddress:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      };
      await auditLogger.logSOC2Event({
        level: LogLevel.ERROR,
        category: LogCategory.SECURITY_EVENT,
        eventType: SOC2EventType.UNAUTHORIZED_ACCESS_ATTEMPT,
        success: false,
        errorMessage: "Unauthorized cron request - invalid secret",
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        metadata: { source: "sync-holidays" },
      });
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
