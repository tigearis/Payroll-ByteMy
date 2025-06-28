/**
 * Sync Health Monitoring API
 * Provides comprehensive sync status monitoring and health checks
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { adminApolloClient } from '@/lib/apollo/unified-client';
import { auditLogger, LogLevel, SOC2EventType, LogCategory } from '@/lib/security/audit/logger';
import { gql } from '@apollo/client';
import { z } from 'zod';

// GraphQL queries for sync health monitoring
const GET_SYNC_HEALTH_SUMMARY = gql`
  query GetSyncHealthSummary {
    syncHealthSummary {
      totalUsers
      successfulSyncs
      failedSyncs
      partialSyncs
      inProgressSyncs
      syncsWithRetries
      pendingRetries
      avgSyncDurationMs
      lastSyncTime
      staleSyncs
    }
  }
`;

const GET_SYNC_METRICS = gql`
  query GetSyncMetrics {
    getSyncHealthMetrics {
      metricName
      metricValue
      metricDescription
    }
  }
`;

const GET_PENDING_RETRIES = gql`
  query GetPendingRetries {
    getPendingSyncRetries {
      clerkUserId
      retryCount
      nextRetryAt
      lastError
      minutesUntilRetry
    }
  }
`;

const GET_RECENT_SYNC_FAILURES = gql`
  query GetRecentSyncFailures($limit: Int = 20) {
    userSyncStates(
      where: { 
        lastSyncStatus: { _eq: "failed" }
        lastSyncAt: { _gte: "now() - interval '24 hours'" }
      }
      orderBy: { lastSyncAt: DESC }
      limit: $limit
    ) {
      clerkUserId
      lastSyncAt
      lastSyncStatus
      retryCount
      lastError
      inconsistencies
    }
  }
`;

const GET_SYNC_CONFLICTS = gql`
  query GetSyncConflicts($limit: Int = 50) {
    syncConflicts(
      where: { status: { _eq: "open" } }
      orderBy: { detectedAt: DESC }
      limit: $limit
    ) {
      id
      clerkUserId
      conflictType
      fieldName
      clerkValue
      databaseValue
      detectedAt
      status
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

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const params = HealthCheckSchema.parse({
      includeMetrics: searchParams.get('includeMetrics') === 'true',
      includeRetries: searchParams.get('includeRetries') === 'true',
      includeFailures: searchParams.get('includeFailures') === 'true',
      includeConflicts: searchParams.get('includeConflicts') === 'true',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
    });

    // Fetch sync health summary
    const { data: summaryData } = await adminApolloClient.query({
      query: GET_SYNC_HEALTH_SUMMARY,
      fetchPolicy: 'network-only'
    });

    const summary = summaryData?.syncHealthSummary?.[0] || {
      totalUsers: 0,
      successfulSyncs: 0,
      failedSyncs: 0,
      partialSyncs: 0,
      inProgressSyncs: 0,
      syncsWithRetries: 0,
      pendingRetries: 0,
      avgSyncDurationMs: 0,
      lastSyncTime: null,
      staleSyncs: 0
    };

    // Calculate health score (0-100)
    const healthScore = summary.totalUsers > 0 ? 
      Math.round((summary.successfulSyncs / summary.totalUsers) * 100) : 100;

    // Determine overall status
    let overallStatus: 'healthy' | 'warning' | 'critical';
    if (healthScore >= 95 && summary.failedSyncs === 0) {
      overallStatus = 'healthy';
    } else if (healthScore >= 80 && summary.failedSyncs < 5) {
      overallStatus = 'warning';
    } else {
      overallStatus = 'critical';
    }

    const response: any = {
      status: overallStatus,
      healthScore,
      summary: {
        ...summary,
        lastSyncTime: summary.lastSyncTime ? new Date(summary.lastSyncTime).toISOString() : null,
      },
      timestamp: new Date().toISOString(),
      success: true
    };

    // Include detailed metrics if requested
    if (params.includeMetrics) {
      try {
        const { data: metricsData } = await adminApolloClient.query({
          query: GET_SYNC_METRICS,
          fetchPolicy: 'network-only'
        });

        response.metrics = metricsData?.getSyncHealthMetrics?.reduce((acc: any, metric: any) => {
          acc[metric.metricName] = {
            value: parseFloat(metric.metricValue),
            description: metric.metricDescription
          };
          return acc;
        }, {}) || {};
      } catch (error) {
        console.warn('Failed to fetch sync metrics:', error);
        response.metrics = { error: 'Failed to fetch metrics' };
      }
    }

    // Include pending retries if requested
    if (params.includeRetries) {
      try {
        const { data: retriesData } = await adminApolloClient.query({
          query: GET_PENDING_RETRIES,
          fetchPolicy: 'network-only'
        });

        response.pendingRetries = retriesData?.getPendingSyncRetries?.map((retry: any) => ({
          ...retry,
          nextRetryAt: new Date(retry.nextRetryAt).toISOString()
        })) || [];
      } catch (error) {
        console.warn('Failed to fetch pending retries:', error);
        response.pendingRetries = [];
      }
    }

    // Include recent failures if requested
    if (params.includeFailures) {
      try {
        const { data: failuresData } = await adminApolloClient.query({
          query: GET_RECENT_SYNC_FAILURES,
          variables: { limit: params.limit },
          fetchPolicy: 'network-only'
        });

        response.recentFailures = failuresData?.userSyncStates?.map((failure: any) => ({
          ...failure,
          lastSyncAt: new Date(failure.lastSyncAt).toISOString(),
          inconsistencies: failure.inconsistencies || []
        })) || [];
      } catch (error) {
        console.warn('Failed to fetch recent failures:', error);
        response.recentFailures = [];
      }
    }

    // Include sync conflicts if requested
    if (params.includeConflicts) {
      try {
        const { data: conflictsData } = await adminApolloClient.query({
          query: GET_SYNC_CONFLICTS,
          variables: { limit: params.limit },
          fetchPolicy: 'network-only'
        });

        response.conflicts = conflictsData?.syncConflicts?.map((conflict: any) => ({
          ...conflict,
          detectedAt: new Date(conflict.detectedAt).toISOString()
        })) || [];
      } catch (error) {
        console.warn('Failed to fetch sync conflicts:', error);
        response.conflicts = [];
      }
    }

    // Log monitoring access
    await auditLogger.logSOC2Event({
      level: LogLevel.INFO,
      eventType: SOC2EventType.DATA_ACCESS,
      category: LogCategory.AUDIT,
      complianceNote: 'Sync health monitoring accessed',
      success: true,
      userId,
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
}