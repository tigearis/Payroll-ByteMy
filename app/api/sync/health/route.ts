/**
 * Sync Health Monitoring API
 * Provides comprehensive sync status monitoring and health checks
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { executeTypedQuery } from '@/lib/apollo/query-helpers';
import { withAuth } from '@/lib/auth/api-auth';
import { gql } from '@apollo/client';
import { auditLogger, LogLevel, SOC2EventType, LogCategory } from '@/lib/security/audit/logger';

// For now, using inline GraphQL until these queries are added to the schema
const GET_SYNC_HEALTH_SUMMARY = gql`
  query GetSyncHealthSummary {
    userSyncStates(limit: 1000) {
      clerkUserId
      lastSyncStatus
      lastSyncAt
      retryCount
      inconsistencies
    }
    userSyncStatesAggregate {
      aggregate {
        count
      }
    }
  }
`;

// Validation schemas
const HealthCheckSchema = z.object({
  includeMetrics: z.boolean().optional(),
  includeRetries: z.boolean().optional(),
  includeFailures: z.boolean().optional(),
  includeConflicts: z.boolean().optional(),
  limit: z.number().min(1).max(100).optional(),
});

export const GET = withAuth(async (request, { session }) => {
  try {
    const { searchParams } = new URL(request.url);
    const params = HealthCheckSchema.parse({
      includeMetrics: searchParams.get('includeMetrics') === 'true',
      includeRetries: searchParams.get('includeRetries') === 'true',
      includeFailures: searchParams.get('includeFailures') === 'true',
      includeConflicts: searchParams.get('includeConflicts') === 'true',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
    });

    // Fetch sync health data using executeTypedQuery
    const data = await executeTypedQuery(GET_SYNC_HEALTH_SUMMARY);

    // Calculate summary statistics
    const syncStates = data.userSyncStates || [];
    const totalUsers = data.userSyncStatesAggregate?.aggregate?.count || 0;
    
    const successfulSyncs = syncStates.filter((s: any) => s.lastSyncStatus === 'success').length;
    const failedSyncs = syncStates.filter((s: any) => s.lastSyncStatus === 'failed').length;
    const partialSyncs = syncStates.filter((s: any) => s.lastSyncStatus === 'partial').length;
    const inProgressSyncs = syncStates.filter((s: any) => s.lastSyncStatus === 'in_progress').length;
    const syncsWithRetries = syncStates.filter((s: any) => s.retryCount > 0).length;
    const pendingRetries = syncStates.filter((s: any) => s.retryCount > 0 && s.lastSyncStatus === 'failed').length;

    // Calculate last sync time
    const lastSyncTimes = syncStates
      .map((s: any) => new Date(s.lastSyncAt))
      .filter((date: Date) => !isNaN(date.getTime()));
    const lastSyncTime = lastSyncTimes.length > 0 ? 
      new Date(Math.max(...lastSyncTimes.map(d => d.getTime()))) : null;

    // Identify stale syncs (no sync in last 24 hours)
    const staleSyncs = syncStates.filter((s: any) => {
      const syncTime = new Date(s.lastSyncAt);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return syncTime < dayAgo;
    }).length;

    const summary = {
      totalUsers,
      successfulSyncs,
      failedSyncs,
      partialSyncs,
      inProgressSyncs,
      syncsWithRetries,
      pendingRetries,
      avgSyncDurationMs: 0, // Would need to calculate from actual sync duration data
      lastSyncTime: lastSyncTime?.toISOString() || null,
      staleSyncs
    };

    // Calculate health score (0-100)
    const healthScore = totalUsers > 0 ? 
      Math.round((successfulSyncs / totalUsers) * 100) : 100;

    // Determine overall status
    let overallStatus: 'healthy' | 'warning' | 'critical';
    if (healthScore >= 95 && failedSyncs === 0) {
      overallStatus = 'healthy';
    } else if (healthScore >= 80 && failedSyncs < 5) {
      overallStatus = 'warning';
    } else {
      overallStatus = 'critical';
    }

    const response: any = {
      status: overallStatus,
      healthScore,
      summary,
      timestamp: new Date().toISOString(),
      success: true
    };

    // Include recent failures if requested
    if (params.includeFailures) {
      const recentFailures = syncStates
        .filter((s: any) => s.lastSyncStatus === 'failed')
        .slice(0, params.limit || 20)
        .map((failure: any) => ({
          clerkUserId: failure.clerkUserId,
          lastSyncAt: new Date(failure.lastSyncAt).toISOString(),
          lastSyncStatus: failure.lastSyncStatus,
          retryCount: failure.retryCount,
          inconsistencies: failure.inconsistencies || []
        }));
      
      response.recentFailures = recentFailures;
    }

    // Include pending retries if requested
    if (params.includeRetries) {
      const pendingRetryList = syncStates
        .filter((s: any) => s.retryCount > 0 && s.lastSyncStatus === 'failed')
        .slice(0, params.limit || 20)
        .map((retry: any) => ({
          clerkUserId: retry.clerkUserId,
          retryCount: retry.retryCount,
          lastError: "Sync failed", // Would need actual error data
          nextRetryAt: new Date(Date.now() + (retry.retryCount * 60 * 1000)).toISOString(), // Estimated
          minutesUntilRetry: retry.retryCount * 1 // Estimated
        }));
      
      response.pendingRetries = pendingRetryList;
    }

    // Log monitoring access
    await auditLogger.logSOC2Event({
      level: LogLevel.INFO,
      eventType: SOC2EventType.DATA_ACCESS,
      category: LogCategory.AUDIT,
      complianceNote: 'Sync health monitoring accessed',
      success: true,
      userId: session.databaseId,
      resourceType: 'sync_health',
      action: 'health_check',
      metadata: {
        healthScore,
        overallStatus,
        requestedSections: {
          includeMetrics: params.includeMetrics,
          includeRetries: params.includeRetries,
          includeFailures: params.includeFailures,
          includeConflicts: params.includeConflicts
        }
      }
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching sync health:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch sync health data' },
      { status: 500 }
    );
  }
}, { allowedRoles: ["org_admin", "developer"] });