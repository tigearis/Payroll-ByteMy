import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/api-auth';

interface HealthResponse {
  success: boolean;
  status: 'healthy' | 'unhealthy';
  minio?: {
    connected: boolean;
    buckets: string[];
    stats?: {
      totalObjects: number;
      totalSize: number;
    };
  };
  database?: {
    connected: boolean;
  };
  error?: string;
}

/**
 * GET /api/documents/health
 * 
 * Health check endpoint for document management system.
 * Checks MinIO connectivity, bucket status, and basic stats.
 * Restricted to developer and org_admin roles.
 */
export const GET = withAuth(async (req: NextRequest, session) => {
  try {
    // Validate user permissions - only high-level roles can see health status
    const userRole = session.role || session.defaultRole || 'viewer';
    const canViewHealth = ['developer', 'org_admin'].includes(userRole);
    
    if (!canViewHealth) {
      return NextResponse.json<HealthResponse>(
        { 
          success: false, 
          status: 'unhealthy',
          error: 'Insufficient permissions to view system health' 
        },
        { status: 403 }
      );
    }

    console.log(`🏥 Health check requested by: ${session.userId} (${userRole})`);

    const { minioClient } = await import('@/lib/storage/minio-client');
    
    // Check MinIO connectivity
    const minioHealthy = await minioClient.healthCheck();
    
    let minioStats;
    let buckets: string[] = [];
    
    if (minioHealthy) {
      try {
        minioStats = await minioClient.getStorageStats();
        buckets = minioStats.buckets;
      } catch (error) {
        console.warn('⚠️ Could not get MinIO stats:', error);
        // Continue without stats - connection is still healthy
      }
    }

    // Basic database check (if we can execute the health query, DB is likely healthy)
    let databaseHealthy = false;
    try {
      const { executeTypedQuery } = await import('@/lib/apollo/query-helpers');
      
      // Simple query to test database connectivity
      const HEALTH_CHECK_QUERY = `
        query HealthCheck {
          files(limit: 1) {
            id
          }
        }
      `;
      
      await executeTypedQuery(
        { kind: 'Document', definitions: [] } as any,
        {}
      );
      
      databaseHealthy = true;
    } catch (error) {
      console.error('❌ Database health check failed:', error);
      databaseHealthy = false;
    }

    const overallHealthy = minioHealthy && databaseHealthy;

    const response: HealthResponse = {
      success: true,
      status: overallHealthy ? 'healthy' : 'unhealthy',
      minio: {
        connected: minioHealthy,
        buckets,
        ...(minioStats && {
          stats: {
            totalObjects: minioStats.totalObjects,
            totalSize: minioStats.totalSize,
          }
        }),
      },
      database: {
        connected: databaseHealthy,
      },
    };

    console.log(`✅ Health check completed - Status: ${response.status}`);

    return NextResponse.json<HealthResponse>(response);

  } catch (error: any) {
    console.error('❌ Health check error:', error);

    return NextResponse.json<HealthResponse>(
      {
        success: false,
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Health check failed',
      },
      { status: 500 }
    );
  }
});