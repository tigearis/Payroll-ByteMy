import { gql } from '@apollo/client';
import { executeTypedQuery } from '@/lib/apollo/query-helpers';
import { auditLogger } from '@/lib/audit/audit-logger';
import { minioClient } from './minio-client';

/**
 * File Cleanup Service
 * 
 * This service identifies and removes orphaned files from MinIO storage.
 * Orphaned files are files that exist in MinIO but no longer have corresponding
 * database records.
 */

export interface OrphanedFile {
  objectKey: string;
  size: number;
  lastModified: Date;
  bucket: string;
}

export interface CleanupReport {
  totalMinioFiles: number;
  totalDatabaseFiles: number;
  orphanedFiles: OrphanedFile[];
  cleanedFiles: OrphanedFile[];
  failedCleanups: Array<{
    file: OrphanedFile;
    error: string;
  }>;
  sizeCleaned: number;
  summary: {
    orphanedCount: number;
    cleanedCount: number;
    failedCount: number;
    sizeCleaned: string;
  };
}

export interface CleanupOptions {
  dryRun?: boolean;
  batchSize?: number;
  maxRetries?: number;
  includeRecentFiles?: boolean;
  recentThresholdHours?: number;
}

const DEFAULT_OPTIONS: Required<CleanupOptions> = {
  dryRun: false,
  batchSize: 100,
  maxRetries: 3,
  includeRecentFiles: false,
  recentThresholdHours: 24,
};

/**
 * Get all file object keys from the database
 */
async function getDatabaseFileKeys(): Promise<Set<string>> {
  const query = gql`
    query GetAllFileObjectKeys {
      files {
        objectKey
      }
    }
  `;

  try {
    const result = await executeTypedQuery(query, {});
    const files = (result as any)?.files || [];
    
    return new Set(
      files
        .map((file: any) => file.objectKey)
        .filter((key: string) => key && key.trim() !== '')
    );
  } catch (error) {
    console.error('❌ Failed to fetch database file keys:', error);
    throw new Error(`Database query failed: ${error}`);
  }
}

/**
 * Get all files from MinIO storage
 */
async function getMinioFiles(): Promise<OrphanedFile[]> {
  try {
    const files = await minioClient.listDocuments();
    
    return files.map(file => ({
      objectKey: file.name,
      size: file.size,
      lastModified: file.lastModified,
      bucket: 'documents', // Default bucket
    }));
  } catch (error) {
    console.error('❌ Failed to list MinIO files:', error);
    throw new Error(`MinIO listing failed: ${error}`);
  }
}

/**
 * Identify orphaned files (files in MinIO but not in database)
 */
export async function identifyOrphanedFiles(options: CleanupOptions = {}): Promise<OrphanedFile[]> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  console.log('🔍 Starting orphaned file identification...');
  
  try {
    // Get files from both sources
    const [databaseKeys, minioFiles] = await Promise.all([
      getDatabaseFileKeys(),
      getMinioFiles()
    ]);

    console.log(`📊 Found ${minioFiles.length} files in MinIO, ${databaseKeys.size} in database`);

    // Filter orphaned files
    let orphanedFiles = minioFiles.filter(file => !databaseKeys.has(file.objectKey));

    // Optionally exclude recent files to avoid race conditions
    if (!opts.includeRecentFiles) {
      const recentThreshold = new Date(Date.now() - opts.recentThresholdHours * 60 * 60 * 1000);
      const originalCount = orphanedFiles.length;
      
      orphanedFiles = orphanedFiles.filter(file => file.lastModified < recentThreshold);
      
      if (originalCount > orphanedFiles.length) {
        console.log(`ℹ️ Excluded ${originalCount - orphanedFiles.length} recent files from cleanup`);
      }
    }

    console.log(`🎯 Identified ${orphanedFiles.length} orphaned files`);
    
    return orphanedFiles;
  } catch (error) {
    console.error('❌ Failed to identify orphaned files:', error);
    throw error;
  }
}

/**
 * Clean up orphaned files from MinIO
 */
export async function cleanupOrphanedFiles(
  options: CleanupOptions = {},
  auditUserId: string = 'system'
): Promise<CleanupReport> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  console.log(`🧹 Starting file cleanup ${opts.dryRun ? '(DRY RUN)' : ''}...`);
  
  try {
    // Get all files for comparison
    const [databaseKeys, minioFiles] = await Promise.all([
      getDatabaseFileKeys(),
      getMinioFiles()
    ]);

    // Identify orphaned files
    const orphanedFiles = await identifyOrphanedFiles(options);
    
    const report: CleanupReport = {
      totalMinioFiles: minioFiles.length,
      totalDatabaseFiles: databaseKeys.size,
      orphanedFiles,
      cleanedFiles: [],
      failedCleanups: [],
      sizeCleaned: 0,
      summary: {
        orphanedCount: orphanedFiles.length,
        cleanedCount: 0,
        failedCount: 0,
        sizeCleaned: '0 B',
      },
    };

    if (orphanedFiles.length === 0) {
      console.log('✅ No orphaned files found');
      return report;
    }

    if (opts.dryRun) {
      console.log(`📋 DRY RUN: Would clean up ${orphanedFiles.length} orphaned files`);
      orphanedFiles.forEach(file => {
        console.log(`  - ${file.objectKey} (${formatFileSize(file.size)})`);
        report.sizeCleaned += file.size;
      });
      report.summary.sizeCleaned = formatFileSize(report.sizeCleaned);
      return report;
    }

    // Process files in batches
    for (let i = 0; i < orphanedFiles.length; i += opts.batchSize) {
      const batch = orphanedFiles.slice(i, i + opts.batchSize);
      console.log(`🔄 Processing batch ${Math.floor(i / opts.batchSize) + 1}/${Math.ceil(orphanedFiles.length / opts.batchSize)} (${batch.length} files)`);

      await Promise.all(
        batch.map(async (file) => {
          let retryCount = 0;
          let success = false;

          while (retryCount < opts.maxRetries && !success) {
            try {
              await minioClient.deleteDocument(file.objectKey);
              report.cleanedFiles.push(file);
              report.sizeCleaned += file.size;
              success = true;
              console.log(`✅ Cleaned: ${file.objectKey}`);
            } catch (error) {
              retryCount++;
              const errorMessage = error instanceof Error ? error.message : 'Unknown error';
              
              if (retryCount >= opts.maxRetries) {
                report.failedCleanups.push({
                  file,
                  error: errorMessage,
                });
                console.error(`❌ Failed to clean ${file.objectKey} after ${opts.maxRetries} retries: ${errorMessage}`);
              } else {
                console.warn(`⚠️ Retry ${retryCount}/${opts.maxRetries} for ${file.objectKey}: ${errorMessage}`);
                // Add delay between retries
                await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
              }
            }
          }
        })
      );
    }

    // Update summary
    report.summary.cleanedCount = report.cleanedFiles.length;
    report.summary.failedCount = report.failedCleanups.length;
    report.summary.sizeCleaned = formatFileSize(report.sizeCleaned);

    // Log audit event
    try {
      await auditLogger.log({
        userId: auditUserId,
        action: 'FILE_CLEANUP_BATCH',
        entityType: 'file',
        success: report.failedCleanups.length === 0,
        metadata: {
          totalOrphaned: report.summary.orphanedCount,
          cleaned: report.summary.cleanedCount,
          failed: report.summary.failedCount,
          sizeCleaned: report.summary.sizeCleaned,
          dryRun: opts.dryRun,
          options: opts,
        }
      });
    } catch (auditError) {
      console.error('❌ Audit logging failed:', auditError);
    }

    console.log(`🎉 Cleanup completed: ${report.summary.cleanedCount} files cleaned, ${report.summary.failedCount} failed`);
    console.log(`💾 Space reclaimed: ${report.summary.sizeCleaned}`);

    return report;
  } catch (error) {
    console.error('❌ File cleanup failed:', error);
    throw error;
  }
}

/**
 * Get cleanup statistics without performing cleanup
 */
export async function getCleanupStats(): Promise<{
  totalMinioFiles: number;
  totalDatabaseFiles: number;
  orphanedCount: number;
  orphanedSize: string;
  recentOrphanedCount: number;
}> {
  try {
    const [databaseKeys, minioFiles] = await Promise.all([
      getDatabaseFileKeys(),
      getMinioFiles()
    ]);

    const orphanedFiles = minioFiles.filter(file => !databaseKeys.has(file.objectKey));
    const orphanedSize = orphanedFiles.reduce((sum, file) => sum + file.size, 0);
    
    // Recent orphaned files (within 24 hours)
    const recentThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentOrphanedCount = orphanedFiles.filter(file => file.lastModified >= recentThreshold).length;

    return {
      totalMinioFiles: minioFiles.length,
      totalDatabaseFiles: databaseKeys.size,
      orphanedCount: orphanedFiles.length,
      orphanedSize: formatFileSize(orphanedSize),
      recentOrphanedCount,
    };
  } catch (error) {
    console.error('❌ Failed to get cleanup stats:', error);
    throw error;
  }
}

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const factor = 1024;
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(factor));
  
  return `${parseFloat((bytes / Math.pow(factor, unitIndex)).toFixed(2))} ${units[unitIndex]}`;
}

/**
 * Scheduled cleanup service for cron jobs
 */
export async function scheduledCleanup(options: CleanupOptions = {}): Promise<CleanupReport> {
  const defaultScheduledOptions: CleanupOptions = {
    dryRun: false,
    batchSize: 50,
    maxRetries: 3,
    includeRecentFiles: false,
    recentThresholdHours: 24,
    ...options,
  };

  console.log('⏰ Running scheduled file cleanup...');
  
  try {
    const report = await cleanupOrphanedFiles(defaultScheduledOptions, 'scheduled-cleanup');
    
    if (report.summary.orphanedCount > 0) {
      console.log(`📈 Scheduled cleanup summary:`);
      console.log(`  - Orphaned files found: ${report.summary.orphanedCount}`);
      console.log(`  - Files cleaned: ${report.summary.cleanedCount}`);
      console.log(`  - Cleanup failures: ${report.summary.failedCount}`);
      console.log(`  - Space reclaimed: ${report.summary.sizeCleaned}`);
    }
    
    return report;
  } catch (error) {
    console.error('❌ Scheduled cleanup failed:', error);
    
    // Log critical failure
    try {
      await auditLogger.log({
        userId: 'scheduled-cleanup',
        action: 'FILE_CLEANUP_FAILED',
        entityType: 'system',
        success: false,
        metadata: {
          error: error instanceof Error ? error.message : 'Unknown error',
          options: defaultScheduledOptions,
        }
      });
    } catch (auditError) {
      console.error('❌ Critical: Failed to log cleanup failure:', auditError);
    }
    
    throw error;
  }
}