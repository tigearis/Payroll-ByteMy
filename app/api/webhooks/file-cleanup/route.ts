import { NextRequest, NextResponse } from 'next/server';
import { auditLogger } from '@/lib/audit/audit-logger';
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";
import { minioClient } from '@/lib/storage/minio-client';

/**
 * Hasura Event Trigger webhook for file cleanup
 * 
 * This webhook is triggered by Hasura when a file record is deleted from the database.
 * It automatically cleans up the corresponding file from MinIO storage.
 * 
 * POST /api/webhooks/file-cleanup
 */

interface HasuraEventPayload {
  event: {
    session_variables: Record<string, string>;
    op: 'INSERT' | 'UPDATE' | 'DELETE' | 'MANUAL';
    data: {
      old?: {
        id: string;
        filename: string;
        object_key: string;
        bucket: string;
        uploaded_by: string;
        client_id?: string;
        payroll_id?: string;
      };
      new?: {
        id: string;
        filename: string;
        object_key: string;
        bucket: string;
        uploaded_by: string;
        client_id?: string;
        payroll_id?: string;
      };
    };
  };
  created_at: string;
  id: string;
  delivery_info: {
    max_retries: number;
    current_retry: number;
  };
  trigger: {
    name: string;
  };
  table: {
    schema: string;
    name: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    // Verify the webhook secret
    const hasuraSecret = req.headers.get('x-hasura-webhook-secret');
    const expectedSecret = process.env.HASURA_WEBHOOK_SECRET || '[REDACTED_CRON_SECRET]';
    
    if (hasuraSecret !== expectedSecret) {
      console.error('❌ Invalid webhook secret');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload: HasuraEventPayload = await req.json();
    
    // Only handle DELETE operations
    if (payload.event.op !== 'DELETE') {
      console.log(`ℹ️ Skipping file cleanup for operation: ${payload.event.op}`);
      return NextResponse.json({ success: true, message: 'Operation not applicable' });
    }

    const deletedFile = payload.event.data.old;
    if (!deletedFile) {
      console.error('❌ No file data in DELETE event');
      return NextResponse.json(
        { success: false, error: 'No file data provided' },
        { status: 400 }
      );
    }

    console.log(`🗑️ Processing file cleanup for: ${deletedFile.filename} (${deletedFile.id})`);

    let minioCleanupSuccess = false;
    let minioError: string | null = null;

    // Attempt to delete from MinIO
    if (deletedFile.object_key) {
      try {
        await minioClient.deleteDocument(deletedFile.object_key);
        minioCleanupSuccess = true;
        console.log(`✅ MinIO cleanup successful: ${deletedFile.object_key}`);
      } catch (error) {
        minioError = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ MinIO cleanup failed: ${minioError}`);
        
        // Don't fail the webhook - log the issue but continue
        // This prevents database deletions from being rolled back due to MinIO issues
      }
    } else {
      console.warn(`⚠️ No object_key found for file ${deletedFile.id}, skipping MinIO cleanup`);
    }

    // Log the cleanup attempt for audit purposes
    try {
      const userId = payload.event.session_variables['x-hasura-user-id'] || 'system';
      await auditLogger.log({
        userId,
        action: 'FILE_CLEANUP_WEBHOOK',
        entityType: 'file',
        entityId: deletedFile.id,
        success: minioCleanupSuccess,
        metadata: {
          filename: deletedFile.filename,
          objectKey: deletedFile.object_key,
          bucket: deletedFile.bucket,
          clientId: deletedFile.client_id,
          payrollId: deletedFile.payroll_id,
          minioCleanupSuccess,
          minioError,
          triggerName: payload.trigger.name,
          retryAttempt: payload.delivery_info.current_retry,
        }
      });
    } catch (auditError) {
      console.error('❌ Audit logging failed:', auditError);
      // Don't fail the webhook for audit logging issues
    }

    // Return success response
    const response = {
      success: true,
      message: `File cleanup processed for ${deletedFile.filename}`,
      details: {
        fileId: deletedFile.id,
        filename: deletedFile.filename,
        objectKey: deletedFile.object_key,
        minioCleanupSuccess,
        minioError,
      }
    };

    console.log(`📋 File cleanup webhook completed:`, response.details);

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ File cleanup webhook error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint for the webhook
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'File cleanup webhook is healthy',
    timestamp: new Date().toISOString(),
  });
}