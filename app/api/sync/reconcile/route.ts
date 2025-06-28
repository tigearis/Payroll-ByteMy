/**
 * Manual Sync Reconciliation API
 * Provides tools for administrators to manually fix sync issues
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { adminApolloClient } from '@/lib/apollo/unified-client';
import { auditLogger, LogLevel, SOC2EventType, LogCategory } from '@/lib/security/audit/logger';
import { 
  enhancedSyncUser, 
  validateBidirectionalSync,
  getSyncState,
  updateSyncState 
} from '@/lib/services/enhanced-sync';
import { gql } from '@apollo/client';
import { z } from 'zod';

// GraphQL operations for reconciliation
const GET_ALL_USERS_WITH_SYNC_STATE = gql`
  query GetAllUsersWithSyncState($limit: Int = 100, $offset: Int = 0) {
    users(
      limit: $limit
      offset: $offset
      orderBy: { updatedAt: DESC }
    ) {
      id
      clerkUserId
      name
      email
      role
      isStaff
      status
      lastSyncAt
      syncVersion
    }
    
    usersAggregate {
      aggregate {
        count
      }
    }
  }
`;

const GET_INCONSISTENT_USERS = gql`
  query GetInconsistentUsers($limit: Int = 50) {
    userSyncStates(
      where: { 
        _or: [
          { lastSyncStatus: { _in: ["failed", "partial"] } }
          { inconsistencies: { _neq: "[]" } }
          { retryCount: { _gt: 0 } }
        ]
      }
      orderBy: { lastSyncAt: DESC }
      limit: $limit
    ) {
      clerkUserId
      lastSyncAt
      lastSyncStatus
      inconsistencies
      retryCount
      lastError
    }
  }
`;

const BULK_UPDATE_SYNC_STATES = gql`
  mutation BulkUpdateSyncStates(
    $clerkUserIds: [String!]!
    $status: String!
    $syncVersion: bigint!
  ) {
    updateUserSyncStates(
      where: { clerkUserId: { _in: $clerkUserIds } }
      _set: {
        lastSyncStatus: $status
        lastSyncAt: "now()"
        syncVersion: $syncVersion
        retryCount: 0
        inconsistencies: "[]"
        lastError: undefined
      }
    ) {
      affectedRows
      returning {
        clerkUserId
        lastSyncStatus
      }
    }
  }
`;

// Validation schemas
const ReconcileRequestSchema = z.object({
  action: z.enum(['validate_all', 'sync_user', 'sync_all_failed', 'reset_sync_state', 'bulk_validate']),
  clerkUserId: z.string().optional(),
  forceSync: z.boolean().optional(),
  limit: z.number().min(1).max(1000).optional(),
  dryRun: z.boolean().optional(),
});

// Role-based authorization
function canPerformReconciliation(userRole: string): boolean {
  return ['developer', 'org_admin'].includes(userRole);
}

async function getCurrentUserRole(userId: string): Promise<string | null> {
  try {
    const { data } = await adminApolloClient.query({
      query: gql`
        query GetCurrentUserRole($userId: String!) {
          users(where: { clerkUserId: { _eq: $userId } }) {
            role
          }
        }
      `,
      variables: { userId }
    });
    
    return data?.users?.[0]?.role || null;
  } catch (error) {
    console.error('Failed to get user role:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check user permissions
    const userRole = await getCurrentUserRole(userId);
    if (!userRole || !canPerformReconciliation(userRole)) {
      return NextResponse.json({ 
        error: 'Insufficient permissions. Only developers and org admins can perform sync reconciliation.' 
      }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = ReconcileRequestSchema.parse(body);
    const { action, clerkUserId, forceSync = false, limit = 50, dryRun = false } = validatedData;

    const startTime = Date.now();
    let result: any = { success: false };

    switch (action) {
      case 'validate_all':
        result = await validateAllUsers(limit, dryRun);
        break;

      case 'sync_user':
        if (!clerkUserId) {
          return NextResponse.json({ error: 'clerkUserId is required for sync_user action' }, { status: 400 });
        }
        result = await syncSingleUser(clerkUserId, forceSync, dryRun);
        break;

      case 'sync_all_failed':
        result = await syncAllFailedUsers(limit, dryRun);
        break;

      case 'reset_sync_state':
        if (!clerkUserId) {
          return NextResponse.json({ error: 'clerkUserId is required for reset_sync_state action' }, { status: 400 });
        }
        result = await resetSyncState(clerkUserId, dryRun);
        break;

      case 'bulk_validate':
        result = await bulkValidateUsers(limit, dryRun);
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const duration = Date.now() - startTime;

    // Log reconciliation action
    await auditLogger.logSOC2Event({
      level: LogLevel.AUDIT,
      eventType: SOC2EventType.USER_UPDATED,
      category: LogCategory.AUTHENTICATION,
      complianceNote: `Manual sync reconciliation performed: ${action}`,
      success: result.success,
      userId,
      resourceType: 'sync_reconciliation',
      action: `reconcile_${action}`,
      metadata: {
        action,
        clerkUserId,
        forceSync,
        limit,
        dryRun,
        duration,
        result: result.summary || result
      }
    });

    return NextResponse.json({
      ...result,
      action,
      duration,
      performedBy: userId,
      performedAt: new Date().toISOString(),
      dryRun
    });

  } catch (error) {
    console.error('Error performing sync reconciliation:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to perform sync reconciliation' },
      { status: 500 }
    );
  }
}

// Reconciliation action implementations

async function validateAllUsers(limit: number, dryRun: boolean): Promise<any> {
  console.log(`🔍 Validating sync state for up to ${limit} users (dry run: ${dryRun})`);

  try {
    const { data } = await adminApolloClient.query({
      query: GET_ALL_USERS_WITH_SYNC_STATE,
      variables: { limit },
      fetchPolicy: 'network-only'
    });

    const users = data?.users || [];
    const total = data?.usersAggregate?.aggregate?.count || 0;
    
    const validationResults = [];
    let consistent = 0;
    let inconsistent = 0;
    let errors = 0;

    for (const user of users) {
      if (!user.clerkUserId) {
        validationResults.push({
          userId: user.id,
          clerkUserId: null,
          status: 'no_clerk_id',
          inconsistencies: ['No Clerk user ID found']
        });
        inconsistent++;
        continue;
      }

      try {
        const validation = await validateBidirectionalSync(user.clerkUserId);
        
        validationResults.push({
          userId: user.id,
          clerkUserId: user.clerkUserId,
          status: validation.isConsistent ? 'consistent' : 'inconsistent',
          inconsistencies: validation.inconsistencies
        });

        if (validation.isConsistent) {
          consistent++;
        } else {
          inconsistent++;
        }
      } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        validationResults.push({
          userId: user.id,
          clerkUserId: user.clerkUserId,
          status: 'error',
          error: errorMessage
        });
        errors++;
      }
    }

    return {
      success: true,
      summary: {
        totalUsers: users.length,
        totalInDatabase: total,
        consistent,
        inconsistent,
        errors,
        consistencyRate: users.length > 0 ? Math.round((consistent / users.length) * 100) : 0
      },
      details: validationResults
    };
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: errorMessage
    };
  }
}

async function syncSingleUser(clerkUserId: string, forceSync: boolean, dryRun: boolean): Promise<any> {
  console.log(`🔄 Syncing single user: ${clerkUserId} (force: ${forceSync}, dry run: ${dryRun})`);

  try {
    if (dryRun) {
      const validation = await validateBidirectionalSync(clerkUserId);
      return {
        success: true,
        action: 'dry_run_validation',
        clerkUserId,
        validation
      };
    }

    const syncResult = await enhancedSyncUser(clerkUserId, {
      forceSync,
      validateFirst: true,
      maxRetries: 3
    });

    return {
      success: syncResult.success,
      clerkUserId,
      syncResult: {
        operation: syncResult.operation,
        inconsistencies: syncResult.inconsistencies,
        performance: syncResult.performance,
        syncState: syncResult.syncState
      }
    };
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      clerkUserId,
      error: errorMessage
    };
  }
}

async function syncAllFailedUsers(limit: number, dryRun: boolean): Promise<any> {
  console.log(`🔄 Syncing failed users (limit: ${limit}, dry run: ${dryRun})`);

  try {
    const { data } = await adminApolloClient.query({
      query: GET_INCONSISTENT_USERS,
      variables: { limit },
      fetchPolicy: 'network-only'
    });

    const failedUsers = data?.userSyncStates || [];
    const results = [];
    let successful = 0;
    let failed = 0;

    for (const userSyncState of failedUsers) {
      const clerkUserId = userSyncState.clerkUserId;
      
      try {
        if (dryRun) {
          const validation = await validateBidirectionalSync(clerkUserId);
          results.push({
            clerkUserId,
            action: 'dry_run_validation',
            validation
          });
          continue;
        }

        const syncResult = await enhancedSyncUser(clerkUserId, {
          forceSync: true,
          validateFirst: true,
          maxRetries: 2
        });

        results.push({
          clerkUserId,
          success: syncResult.success,
          operation: syncResult.operation,
          inconsistencies: syncResult.inconsistencies
        });

        if (syncResult.success) {
          successful++;
        } else {
          failed++;
        }
      } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.push({
          clerkUserId,
          success: false,
          error: errorMessage
        });
        failed++;
      }
    }

    return {
      success: true,
      summary: {
        totalProcessed: failedUsers.length,
        successful: dryRun ? 0 : successful,
        failed: dryRun ? 0 : failed,
        successRate: dryRun ? 0 : (failedUsers.length > 0 ? Math.round((successful / failedUsers.length) * 100) : 0)
      },
      details: results
    };
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: errorMessage
    };
  }
}

async function resetSyncState(clerkUserId: string, dryRun: boolean): Promise<any> {
  console.log(`🔄 Resetting sync state for: ${clerkUserId} (dry run: ${dryRun})`);

  try {
    if (dryRun) {
      const currentState = await getSyncState(clerkUserId);
      return {
        success: true,
        action: 'dry_run_reset',
        clerkUserId,
        currentState
      };
    }

    await updateSyncState(clerkUserId, 'success', {
      inconsistencies: [],
      retryCount: 0
    });

    return {
      success: true,
      clerkUserId,
      action: 'sync_state_reset'
    };
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      clerkUserId,
      error: errorMessage
    };
  }
}

async function bulkValidateUsers(limit: number, dryRun: boolean): Promise<any> {
  console.log(`🔍 Bulk validating users (limit: ${limit}, dry run: ${dryRun})`);

  try {
    const { data } = await adminApolloClient.query({
      query: GET_INCONSISTENT_USERS,
      variables: { limit },
      fetchPolicy: 'network-only'
    });

    const users = data?.userSyncStates || [];
    const validationResults = [];
    let needsSync = 0;
    let consistent = 0;

    for (const userSyncState of users) {
      const clerkUserId = userSyncState.clerkUserId;
      
      try {
        const validation = await validateBidirectionalSync(clerkUserId);
        
        validationResults.push({
          clerkUserId,
          validation,
          currentSyncState: {
            status: userSyncState.lastSyncStatus,
            inconsistencies: userSyncState.inconsistencies,
            retryCount: userSyncState.retryCount
          }
        });

        if (validation.isConsistent) {
          consistent++;
        } else {
          needsSync++;
        }
      } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        validationResults.push({
          clerkUserId,
          error: errorMessage,
          currentSyncState: {
            status: userSyncState.lastSyncStatus,
            inconsistencies: userSyncState.inconsistencies,
            retryCount: userSyncState.retryCount
          }
        });
      }
    }

    return {
      success: true,
      summary: {
        totalValidated: users.length,
        consistent,
        needsSync,
        consistencyRate: users.length > 0 ? Math.round((consistent / users.length) * 100) : 0
      },
      details: validationResults
    };
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: errorMessage
    };
  }
}