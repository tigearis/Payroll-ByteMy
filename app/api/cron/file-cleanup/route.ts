import { NextRequest, NextResponse } from 'next/server';
import { scheduledCleanup } from '@/lib/storage/file-cleanup-service';

/**
 * Scheduled File Cleanup Cron Job
 * 
 * This endpoint is designed to be called by Hasura cron triggers or external schedulers
 * to automatically clean up orphaned files from MinIO storage.
 * 
 * POST /api/cron/file-cleanup
 */

interface CronResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  timestamp: string;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Verify cron secret
    const cronSecret = req.headers.get('x-hasura-cron-secret');
    const expectedSecret = process.env.HASURA_CRON_SECRET || 'Rt+uMU/vozFMXuSwbysfhGonq7SRTgluhOwEMdRexnk=';
    
    if (cronSecret !== expectedSecret) {
      console.error('❌ Invalid cron secret for file cleanup');
      return NextResponse.json<CronResponse>(
        {
          success: false,
          message: 'Unauthorized cron request',
          error: 'Invalid secret',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    console.log('⏰ Starting scheduled file cleanup cron job...');

    // Parse optional configuration from request body
    let cleanupOptions = {};
    try {
      const body = await req.json();
      cleanupOptions = {
        dryRun: body.dryRun || false,
        batchSize: body.batchSize || 50,
        maxRetries: body.maxRetries || 3,
        includeRecentFiles: body.includeRecentFiles || false,
        recentThresholdHours: body.recentThresholdHours || 24,
      };
    } catch (jsonError) {
      // If no JSON body, use defaults (this is fine for cron jobs)
      cleanupOptions = {
        dryRun: false,
        batchSize: 50,
        maxRetries: 3,
        includeRecentFiles: false,
        recentThresholdHours: 24,
      };
    }

    // Run the scheduled cleanup
    const report = await scheduledCleanup(cleanupOptions);
    
    const executionTime = Date.now() - startTime;
    const timestamp = new Date().toISOString();

    // Prepare response data
    const responseData = {
      executionTimeMs: executionTime,
      report: {
        summary: report.summary,
        totalMinioFiles: report.totalMinioFiles,
        totalDatabaseFiles: report.totalDatabaseFiles,
        orphanedFilesFound: report.orphanedFiles.length,
        // Don't include full file lists in cron response to keep it lightweight
        hasFailures: report.failedCleanups.length > 0,
        failureCount: report.failedCleanups.length,
      },
      options: cleanupOptions,
    };

    // Different messages based on results
    let message: string;
    if (report.summary.orphanedCount === 0) {
      message = 'Scheduled cleanup completed: No orphaned files found';
    } else if (report.summary.cleanedCount === report.summary.orphanedCount) {
      message = `Scheduled cleanup completed successfully: ${report.summary.cleanedCount} files cleaned (${report.summary.sizeCleaned})`;
    } else {
      message = `Scheduled cleanup completed with issues: ${report.summary.cleanedCount}/${report.summary.orphanedCount} files cleaned, ${report.summary.failedCount} failed`;
    }

    console.log(`✅ ${message} (${executionTime}ms)`);

    // Log summary for monitoring
    if (report.summary.orphanedCount > 0) {
      console.log(`📊 Cleanup Summary:`);
      console.log(`  - Execution time: ${executionTime}ms`);
      console.log(`  - Orphaned files: ${report.summary.orphanedCount}`);
      console.log(`  - Successfully cleaned: ${report.summary.cleanedCount}`);
      console.log(`  - Failed cleanups: ${report.summary.failedCount}`);
      console.log(`  - Space reclaimed: ${report.summary.sizeCleaned}`);
    }

    return NextResponse.json<CronResponse>({
      success: true,
      message,
      data: responseData,
      timestamp,
    });

  } catch (error: any) {
    const executionTime = Date.now() - startTime;
    const timestamp = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    console.error(`❌ Scheduled file cleanup failed after ${executionTime}ms:`, error);

    return NextResponse.json<CronResponse>(
      {
        success: false,
        message: 'Scheduled file cleanup failed',
        error: errorMessage,
        data: {
          executionTimeMs: executionTime,
        },
        timestamp,
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for health check
 */
export async function GET() {
  return NextResponse.json<CronResponse>({
    success: true,
    message: 'File cleanup cron endpoint is healthy',
    timestamp: new Date().toISOString(),
  });
}