import { handleApiError, createSuccessResponse } from "@/lib/shared/error-handling";
// app/api/holidays/sync/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { syncAustralianHolidays } from "@/lib/holiday-sync-service";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      `🚀 Manual holiday sync started by user ${userId} (force: ${forceSync})`
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
        userId,
        results: result.results,
      },
    });
  } catch (error) {
    return handleApiError(error, "holidays");
  },
      { status: 500 }
    );
  }
}

// Usage examples:
// - Normal sync (skips if data exists): POST /api/holidays/sync
// - Force sync via query: POST /api/holidays/sync?force=true
// - Force sync via body: POST /api/holidays/sync with body: { "force": true }
