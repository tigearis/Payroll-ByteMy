// app/api/cron/holidays/sync/route.ts
import { NextRequest, NextResponse } from "next/server";
import { syncAustralianHolidays } from "@/domains/external-systems/services/holiday-sync-service";

export const POST = async (req: NextRequest) => {
  try {
    // Check for cron authentication header
    const cronSecret = req.headers.get("x-hasura-cron-secret");
    const expectedSecret = process.env.CRON_SECRET || process.env.HASURA_GRAPHQL_ADMIN_SECRET;
    
    if (!cronSecret || cronSecret !== expectedSecret) {
      console.error("❌ Unauthorized cron job attempt:", {
        providedSecret: cronSecret ? "***PROVIDED***" : "MISSING",
        timestamp: new Date().toISOString()
      });
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body for force flag
    let forceSync = false;
    try {
      const body = await req.json();
      forceSync = body.force === true;
    } catch {
      // No body or invalid JSON, use default
    }

    console.log(`🤖 Automated holiday sync started (force: ${forceSync})`);

    // Trigger comprehensive Australian holiday sync from data.gov.au
    const result = await syncAustralianHolidays(forceSync);

    console.log(`✅ Automated holiday sync completed:`, result);

    return NextResponse.json({
      success: true,
      message: result.message,
      details: {
        totalAffected: result.totalAffected,
        skippedCount: result.skippedCount,
        forceSync,
        triggerType: "cron",
        results: result.results,
      },
    });
  } catch (error) {
    console.error("❌ Automated holiday sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to sync holidays",
        details: error instanceof Error ? error.message : "Unknown error",
        triggerType: "cron",
      },
      { status: 500 }
    );
  }
};

// Cron-specific endpoint for automated holiday synchronization
// This endpoint is called by Hasura cron triggers and does not require user authentication
// Authentication is provided via x-hasura-cron-secret header