import { NextRequest, NextResponse } from 'next/server';
import { withAuthParams } from '@/lib/auth/api-auth';
import {
  identifyOrphanedFiles,
  cleanupOrphanedFiles,
  getCleanupStats,
  CleanupOptions,
  CleanupReport,
} from '@/lib/storage/file-cleanup-service';

/**
 * File Cleanup Admin API
 * 
 * Provides administrative endpoints for managing orphaned files in MinIO storage.
 */

interface CleanupResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

/**
 * GET /api/admin/file-cleanup
 * 
 * Get cleanup statistics and optionally identify orphaned files.
 * 
 * Query Parameters:
 * - action: 'stats' | 'identify' (default: 'stats')
 * - includeRecentFiles: boolean (default: false)
 * - recentThresholdHours: number (default: 24)
 */
export const GET = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    // Check admin permissions
    const userRole = session.role || session.defaultRole || 'viewer';
    if (!['developer', 'org_admin'].includes(userRole)) {
      return NextResponse.json<CleanupResponse>(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'stats';
    const includeRecentFiles = searchParams.get('includeRecentFiles') === 'true';
    const recentThresholdHours = parseInt(searchParams.get('recentThresholdHours') || '24');

    console.log(`📊 File cleanup ${action} requested by ${session.userId} (${userRole})`);

    if (action === 'stats') {
      const stats = await getCleanupStats();
      
      return NextResponse.json<CleanupResponse>({
        success: true,
        data: stats,
        message: 'Cleanup statistics retrieved successfully',
      });
    }

    if (action === 'identify') {
      const options: CleanupOptions = {
        includeRecentFiles,
        recentThresholdHours,
      };

      const orphanedFiles = await identifyOrphanedFiles(options);
      
      return NextResponse.json<CleanupResponse>({
        success: true,
        data: {
          orphanedFiles: orphanedFiles.map(file => ({
            objectKey: file.objectKey,
            size: file.size,
            lastModified: file.lastModified.toISOString(),
            bucket: file.bucket,
          })),
          count: orphanedFiles.length,
          totalSize: orphanedFiles.reduce((sum, file) => sum + file.size, 0),
        },
        message: `Identified ${orphanedFiles.length} orphaned files`,
      });
    }

    return NextResponse.json<CleanupResponse>(
      { success: false, error: 'Invalid action. Use "stats" or "identify"' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('❌ File cleanup GET error:', error);

    return NextResponse.json<CleanupResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process cleanup request',
      },
      { status: 500 }
    );
  }
});

/**
 * POST /api/admin/file-cleanup
 * 
 * Perform file cleanup operation.
 * 
 * Request Body:
 * {
 *   "dryRun": boolean (default: true),
 *   "batchSize": number (default: 100),
 *   "maxRetries": number (default: 3),
 *   "includeRecentFiles": boolean (default: false),
 *   "recentThresholdHours": number (default: 24)
 * }
 */
export const POST = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    // Check admin permissions
    const userRole = session.role || session.defaultRole || 'viewer';
    if (!['developer', 'org_admin'].includes(userRole)) {
      return NextResponse.json<CleanupResponse>(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const options: CleanupOptions = {
      dryRun: body.dryRun !== false, // Default to true for safety
      batchSize: body.batchSize || 100,
      maxRetries: body.maxRetries || 3,
      includeRecentFiles: body.includeRecentFiles || false,
      recentThresholdHours: body.recentThresholdHours || 24,
    };

    console.log(`🧹 File cleanup requested by ${session.userId} (${userRole})`, {
      dryRun: options.dryRun,
      batchSize: options.batchSize,
    });

    // Perform cleanup
    const report: CleanupReport = await cleanupOrphanedFiles(
      options,
      session.databaseId || session.userId || 'admin'
    );

    const responseData = {
      report: {
        ...report,
        cleanedFiles: options.dryRun ? [] : report.cleanedFiles.map(file => ({
          objectKey: file.objectKey,
          size: file.size,
          lastModified: file.lastModified.toISOString(),
        })),
        failedCleanups: report.failedCleanups.map(failure => ({
          objectKey: failure.file.objectKey,
          size: failure.file.size,
          error: failure.error,
        })),
      },
    };

    const message = options.dryRun
      ? `DRY RUN: Would clean ${report.summary.orphanedCount} orphaned files (${report.summary.sizeCleaned})`
      : `Cleanup completed: ${report.summary.cleanedCount} files cleaned, ${report.summary.failedCount} failed (${report.summary.sizeCleaned} reclaimed)`;

    return NextResponse.json<CleanupResponse>({
      success: true,
      data: responseData,
      message,
    });

  } catch (error: any) {
    console.error('❌ File cleanup POST error:', error);

    return NextResponse.json<CleanupResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'File cleanup operation failed',
      },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/admin/file-cleanup/[objectKey]
 * 
 * Delete a specific orphaned file by object key.
 */
export const DELETE = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    // Check admin permissions
    const userRole = session.role || session.defaultRole || 'viewer';
    if (!['developer', 'org_admin'].includes(userRole)) {
      return NextResponse.json<CleanupResponse>(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const objectKey = searchParams.get('objectKey');

    if (!objectKey) {
      return NextResponse.json<CleanupResponse>(
        { success: false, error: 'Object key is required' },
        { status: 400 }
      );
    }

    console.log(`🗑️ Manual file deletion requested: ${objectKey} by ${session.userId} (${userRole})`);

    // First verify the file is actually orphaned
    const orphanedFiles = await identifyOrphanedFiles({ includeRecentFiles: true });
    const targetFile = orphanedFiles.find(file => file.objectKey === objectKey);

    if (!targetFile) {
      return NextResponse.json<CleanupResponse>(
        { success: false, error: 'File not found or not orphaned' },
        { status: 404 }
      );
    }

    // Perform manual cleanup of single file
    const report = await cleanupOrphanedFiles(
      {
        dryRun: false,
        batchSize: 1,
        maxRetries: 3,
        includeRecentFiles: true,
      },
      session.databaseId || session.userId || 'admin'
    );

    const cleanedFile = report.cleanedFiles.find(file => file.objectKey === objectKey);
    const failedCleanup = report.failedCleanups.find(failure => failure.file.objectKey === objectKey);

    if (cleanedFile) {
      return NextResponse.json<CleanupResponse>({
        success: true,
        message: `File ${objectKey} deleted successfully`,
        data: {
          objectKey: cleanedFile.objectKey,
          size: cleanedFile.size,
          sizeFormatted: formatFileSize(cleanedFile.size),
        },
      });
    } else if (failedCleanup) {
      return NextResponse.json<CleanupResponse>(
        {
          success: false,
          error: `Failed to delete file: ${failedCleanup.error}`,
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json<CleanupResponse>(
        { success: false, error: 'File deletion status unknown' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('❌ Manual file deletion error:', error);

    return NextResponse.json<CleanupResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'File deletion failed',
      },
      { status: 500 }
    );
  }
});

/**
 * Format file size helper
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const factor = 1024;
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(factor));
  
  return `${parseFloat((bytes / Math.pow(factor, unitIndex)).toFixed(2))} ${units[unitIndex]}`;
}