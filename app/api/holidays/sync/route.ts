// app/api/holidays/sync/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/api-auth";
import { syncAustralianHolidays } from "@/domains/external-systems/services/holiday-sync-service";

export const POST = withAuth(
  async (req: NextRequest, session) => {
    try {

    // Check if force sync is requested via query parameter or request body
    const url = new URL(req.url);
    const forceFromQuery = url.searchParams.get("force") === "true";

    let forceFromBody = false;
    try {
      const body = await req.json();
      forceFromBody = body.force === true;
    } catch {
      // No body or invalid JSON, use default
    }

    const forceSync = forceFromQuery || forceFromBody;

    console.log(
      `🚀 Manual holiday sync started by user ${session.userId} (force: ${forceSync})`
    );

    // Trigger holiday sync with duplicate checking
    const result = await syncAustralianHolidays(forceSync);

    console.log(`✅ Manual holiday sync completed:`, result);

    return NextResponse.json({
      success: true,
      message: result.message,
      details: {
        totalAffected: result.totalAffected,
        skippedCount: result.skippedCount,
        forceSync,
        userId: session.userId,
        results: result.results,
      },
    });
    } catch (error) {
      console.error("❌ Manual holiday sync error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to sync holidays",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  },
  {
    allowedRoles: ["developer", "org_admin"], // Only developers and admins can manually sync holidays
  }
);

// Usage examples:
// - Normal sync (skips if data exists): POST /api/holidays/sync
// - Force sync via query: POST /api/holidays/sync?force=true
// - Force sync via body: POST /api/holidays/sync with body: { "force": true }
