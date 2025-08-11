// app/api/cron/holidays/sync/route.ts
import { NextRequest, NextResponse } from "next/server";
import { syncAustralianHolidays } from "@/domains/external-systems/services/holiday-sync-service";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

export const POST = async (req: NextRequest) => {
  try {
    // Check for cron authentication header
    const cronSecret = req.headers.get("x-hasura-cron-secret");
    const expectedSecret = process.env.CRON_SECRET || process.env.HASURA_GRAPHQL_ADMIN_SECRET;
    
    if (!cronSecret || cronSecret !== expectedSecret) {
      logger.error('Unauthorized cron job attempt', {
        namespace: 'cron_holidays_api',
        operation: 'authenticate_cron',
        classification: DataClassification.INTERNAL,
        metadata: {
          providedSecret: cronSecret ? "***PROVIDED***" : "MISSING",
          timestamp: new Date().toISOString()
        }
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

    logger.info('Automated holiday sync started', {
      namespace: 'cron_holidays_api',
      operation: 'start_sync',
      classification: DataClassification.INTERNAL,
      metadata: {
        forceSync,
        timestamp: new Date().toISOString()
      }
    });

    // Trigger comprehensive Australian holiday sync from data.gov.au
    const result = await syncAustralianHolidays(forceSync);

    logger.info('Automated holiday sync completed', {
      namespace: 'cron_holidays_api',
      operation: 'complete_sync',
      classification: DataClassification.INTERNAL,
      metadata: {
        totalAffected: result.totalAffected,
        skippedCount: result.skippedCount,
        message: result.message,
        timestamp: new Date().toISOString()
      }
    });

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
    logger.error('Automated holiday sync error', {
      namespace: 'cron_holidays_api',
      operation: 'sync_holidays',
      classification: DataClassification.INTERNAL,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        errorName: error instanceof Error ? error.name : 'UnknownError',
        timestamp: new Date().toISOString()
      }
    });
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