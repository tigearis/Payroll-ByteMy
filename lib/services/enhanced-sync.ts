/**
 * Enhanced Bidirectional Sync Service
 * Provides robust user synchronization between Clerk and database
 * with comprehensive error handling, retry logic, and state management
 */

import { gql } from '@apollo/client';
import { clerkClient } from '@clerk/nextjs/server';
import type { UserRole } from '@/domains/users/services/user-sync';
import { adminApolloClient } from '@/lib/apollo/unified-client';
import { getPermissionsForRole } from '@/lib/auth/permissions';
import { auditLogger, LogLevel, SOC2EventType, LogCategory } from '@/lib/security/audit/logger';

// ================================
// TYPES AND INTERFACES
// ================================

export interface SyncState {
  userId: string;
  clerkUserId: string;
  lastSyncAt: Date;
  lastSyncStatus: 'success' | 'failed' | 'partial' | 'in_progress';
  syncVersion: number;
  inconsistencies: string[];
  nextRetryAt?: Date | null;
  retryCount: number;
  lastError?: string;
}

export interface SyncResult {
  success: boolean;
  userId?: string;
  operation: 'create' | 'update' | 'sync' | 'validate';
  syncState: SyncState;
  inconsistencies: string[];
  performance: {
    duration: number;
    operationsCount: number;
  };
}

export interface SyncErrorContext {
  operation: 'clerk-read' | 'clerk-write' | 'db-read' | 'db-write' | 'validation';
  retryAttempt: number;
  lastError: Error;
  clerkUserId: string;
  metadata?: Record<string, any>;
}

export interface ValidationResult {
  isConsistent: boolean;
  inconsistencies: string[];
  requiresSync: boolean;
  clerkData?: any;
  dbData?: any;
}

// ================================
// ENHANCED GRAPHQL OPERATIONS
// ================================

const UPSERT_SYNC_STATE = gql`
  mutation UpsertSyncState(
    $clerkUserId: String!
    $status: String!
    $syncVersion: bigint!
    $inconsistencies: jsonb
    $nextRetryAt: timestamptz
    $retryCount: Int!
    $lastError: String
  ) {
    insertSyncState: insertUserSyncState(
      object: {
        clerkUserId: $clerkUserId
        lastSyncStatus: $status
        lastSyncAt: "now()"
        syncVersion: $syncVersion
        inconsistencies: $inconsistencies
        nextRetryAt: $nextRetryAt
        retryCount: $retryCount
        lastError: $lastError
      }
      onConflict: {
        constraint: user_sync_states_clerk_user_id_key
        updateColumns: [
          lastSyncStatus, lastSyncAt, syncVersion,
          inconsistencies, nextRetryAt, retryCount, lastError
        ]
      }
    ) {
      clerkUserId
      lastSyncAt
      lastSyncStatus
      syncVersion
      retryCount
    }
  }
`;

const GET_SYNC_STATE = gql`
  query GetSyncState($clerkUserId: String!) {
    userSyncStates(where: { clerkUserId: { _eq: $clerkUserId } }) {
      clerkUserId
      lastSyncAt
      lastSyncStatus
      syncVersion
      inconsistencies
      nextRetryAt
      retryCount
      lastError
    }
  }
`;

const ATOMIC_USER_UPSERT = gql`
  mutation AtomicUserUpsert(
    $clerkUserId: String!
    $name: String!
    $email: String!
    $role: user_role!
    $isStaff: Boolean!
    $managerId: uuid
    $image: String
    $syncVersion: bigint!
  ) {
    insertUser(
      object: {
        clerkUserId: $clerkUserId
        name: $name
        email: $email
        role: $role
        isStaff: $isStaff
        managerId: $managerId
        image: $image
        status: "active"
        lastSyncAt: "now()"
        syncVersion: $syncVersion
      }
      onConflict: {
        constraint: users_clerk_user_id_key
        updateColumns: [
          name, email, image, lastSyncAt, syncVersion, updatedAt
        ]
      }
    ) {
      id
      clerkUserId
      name
      email
      role
      isStaff
      managerId
      image
      status
      syncVersion
      lastSyncAt
    }
  }
`;

// ================================
// RETRY AND ERROR HANDLING
// ================================

export class SyncError extends Error {
  constructor(
    message: string,
    public context: SyncErrorContext,
    public isRetryable: boolean = true
  ) {
    super(message);
    this.name = 'SyncError';
  }
}

export async function retryWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  context: Partial<SyncErrorContext>,
  maxAttempts: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await operation();
      
      // Log successful retry if this wasn't the first attempt
      if (attempt > 1) {
        await auditLogger.logSOC2Event({
          level: LogLevel.INFO,
          eventType: SOC2EventType.USER_UPDATED,
          category: LogCategory.AUTHENTICATION,
          complianceNote: `Sync operation succeeded after ${attempt} attempts`,
          success: true,
          userId: context.clerkUserId || 'unknown',
          resourceType: 'user_sync',
          action: 'retry_success',
          metadata: {
            operation: context.operation,
            attempts: attempt,
            totalDuration: Date.now() - (context.metadata?.startTime || Date.now())
          }
        });
      }
      
      return result;
    } catch (error: any) {
      lastError = error as Error;
      
      const syncError = new SyncError(
        `${context.operation} failed on attempt ${attempt}: ${error.message}`,
        {
          operation: context.operation || 'validation',
          retryAttempt: attempt,
          lastError: error,
          clerkUserId: context.clerkUserId || 'unknown',
          metadata: context.metadata || {}
        },
        isRetryableError(error)
      );

      // Log the error attempt
      await auditLogger.logSOC2Event({
        level: attempt === maxAttempts ? LogLevel.ERROR : LogLevel.WARNING,
        eventType: SOC2EventType.USER_UPDATED,
        category: LogCategory.AUTHENTICATION,
        complianceNote: `Sync operation failed: attempt ${attempt}/${maxAttempts}`,
        success: false,
        userId: context.clerkUserId || 'unknown',
        resourceType: 'user_sync',
        action: 'retry_attempt',
        metadata: {
          operation: context.operation,
          attempt,
          maxAttempts,
          error: error.message,
          isRetryable: syncError.isRetryable
        }
      });

      if (attempt === maxAttempts || !syncError.isRetryable) {
        throw syncError;
      }

      // Exponential backoff with jitter (25% randomization)
      const baseDelay = baseDelayMs * Math.pow(2, attempt - 1);
      const jitter = baseDelay * 0.25 * Math.random();
      const delay = baseDelay + jitter;
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Unknown error');
}

function isRetryableError(error: any): boolean {
  // Network errors, timeouts, and temporary failures are retryable
  if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') return true;
  if (error.message?.includes('timeout')) return true;
  if (error.message?.includes('rate limit')) return true;
  if (error.status >= 500 && error.status < 600) return true;
  
  // GraphQL errors that indicate temporary issues
  if (error.graphQLErrors?.some((e: any) => 
    e.extensions?.code === 'CONNECTION_ERROR' ||
    e.extensions?.code === 'TIMEOUT'
  )) return true;
  
  // Clerk specific retryable errors
  if (error.clerkError && error.status >= 500) return true;
  
  return false;
}

// ================================
// DISTRIBUTED LOCKING
// ================================

class InMemoryLockManager {
  private locks = new Map<string, { value: string; expiresAt: number }>();
  
  async acquireLock(key: string, ttlMs: number = 30000): Promise<string | null> {
    const now = Date.now();
    const existing = this.locks.get(key);
    
    // Clean expired locks
    if (existing && existing.expiresAt <= now) {
      this.locks.delete(key);
    }
    
    // Check if lock is still held
    if (this.locks.has(key)) {
      return null; // Lock is held
    }
    
    // Acquire new lock
    const lockValue = `${now}-${Math.random()}`;
    this.locks.set(key, {
      value: lockValue,
      expiresAt: now + ttlMs
    });
    
    return lockValue;
  }
  
  async releaseLock(key: string, lockValue: string): Promise<boolean> {
    const existing = this.locks.get(key);
    if (existing && existing.value === lockValue) {
      this.locks.delete(key);
      return true;
    }
    return false;
  }
}

const lockManager = new InMemoryLockManager();

export async function withUserSyncLock<T>(
  clerkUserId: string,
  operation: () => Promise<T>,
  timeoutMs: number = 30000
): Promise<T> {
  const lockKey = `user-sync:${clerkUserId}`;
  const lockValue = await lockManager.acquireLock(lockKey, timeoutMs);
  
  if (!lockValue) {
    throw new SyncError(
      `User sync already in progress for ${clerkUserId}`,
      {
        operation: 'validation',
        retryAttempt: 1,
        lastError: new Error('Lock acquisition failed'),
        clerkUserId
      },
      false // Not retryable - indicates concurrent operation
    );
  }
  
  try {
    return await operation();
  } finally {
    await lockManager.releaseLock(lockKey, lockValue);
  }
}

// ================================
// SYNC STATE MANAGEMENT
// ================================

export async function getSyncState(clerkUserId: string): Promise<SyncState | null> {
  try {
    const { data } = await adminApolloClient.query({
      query: GET_SYNC_STATE,
      variables: { clerkUserId },
      fetchPolicy: 'network-only'
    });
    
    const syncStateData = data?.userSyncStates?.[0];
    if (!syncStateData) return null;
    
    return {
      userId: syncStateData.userId,
      clerkUserId: syncStateData.clerkUserId,
      lastSyncAt: new Date(syncStateData.lastSyncAt),
      lastSyncStatus: syncStateData.lastSyncStatus,
      syncVersion: parseInt(syncStateData.syncVersion),
      inconsistencies: syncStateData.inconsistencies || [],
      nextRetryAt: syncStateData.nextRetryAt ? new Date(syncStateData.nextRetryAt) : null,
      retryCount: syncStateData.retryCount || 0,
      lastError: syncStateData.lastError
    };
  } catch (error) {
    console.warn('Failed to get sync state:', error);
    return null;
  }
}

export async function updateSyncState(
  clerkUserId: string,
  status: SyncState['lastSyncStatus'],
  metadata: Partial<SyncState> = {}
): Promise<void> {
  const syncVersion = Date.now();
  const nextRetryAt = metadata.nextRetryAt || 
    (status === 'failed' ? new Date(Date.now() + 5 * 60 * 1000) : null); // 5 min retry
  
  try {
    await adminApolloClient.mutate({
      mutation: UPSERT_SYNC_STATE,
      variables: {
        clerkUserId,
        status,
        syncVersion,
        inconsistencies: metadata.inconsistencies || [],
        nextRetryAt,
        retryCount: metadata.retryCount || 0,
        lastError: metadata.lastError || null
      }
    });
  } catch (error) {
    console.error('Failed to update sync state:', error);
    // Don't throw - sync state is for monitoring, not critical path
  }
}

// ================================
// BIDIRECTIONAL VALIDATION
// ================================

export async function validateBidirectionalSync(clerkUserId: string): Promise<ValidationResult> {
  try {
    const [clerkResult, dbResult] = await Promise.allSettled([
      (async () => {
        const client = await clerkClient();
        return client.users.getUser(clerkUserId);
      })(),
      adminApolloClient.query({
        query: gql`
          query GetUserForValidation($clerkUserId: String!) {
            users(where: { clerkUserId: { _eq: $clerkUserId } }) {
              id
              clerkUserId
              name
              email
              role
              isStaff
              managerId
              image
              status
              syncVersion
              lastSyncAt
            }
          }
        `,
        variables: { clerkUserId }
      })
    ]);
    
    const inconsistencies: string[] = [];
    
    // Handle failed fetches
    if (clerkResult.status === 'rejected') {
      const reason = clerkResult.reason as Error;
      inconsistencies.push(`Failed to fetch Clerk user: ${reason.message}`);
    }
    
    if (dbResult.status === 'rejected') {
      const reason = dbResult.reason as Error;
      inconsistencies.push(`Failed to fetch database user: ${reason.message}`);
    }
    
    if (inconsistencies.length > 0) {
      return {
        isConsistent: false,
        inconsistencies,
        requiresSync: true
      };
    }
    
    const clerkUser = clerkResult.status === 'fulfilled' ? clerkResult.value : null;
    const dbUser = dbResult.status === 'fulfilled' ? dbResult.value.data?.users?.[0] : null;
    
    if (!dbUser) {
      inconsistencies.push('User exists in Clerk but not in database');
      return {
        isConsistent: false,
        inconsistencies,
        requiresSync: true,
        clerkData: clerkUser
      };
    }
    
    // Validate field consistency
    if (!clerkUser) {
      inconsistencies.push('Clerk user data is missing');
      return {
        isConsistent: false,
        inconsistencies,
        requiresSync: true
      };
    }
    
    const clerkMetadata = clerkUser.publicMetadata || {};
    
    if (clerkMetadata.role !== dbUser.role) {
      inconsistencies.push(`Role mismatch: Clerk="${clerkMetadata.role}", DB="${dbUser.role}"`);
    }
    
    if (clerkMetadata.databaseId !== dbUser.id) {
      inconsistencies.push(`Database ID mismatch: Clerk="${clerkMetadata.databaseId}", DB="${dbUser.id}"`);
    }
    
    if (clerkMetadata.isStaff !== dbUser.isStaff) {
      inconsistencies.push(`Staff status mismatch: Clerk="${clerkMetadata.isStaff}", DB="${dbUser.isStaff}"`);
    }
    
    if (clerkUser.emailAddresses?.[0]?.emailAddress !== dbUser.email) {
      inconsistencies.push(`Email mismatch: Clerk="${clerkUser.emailAddresses?.[0]?.emailAddress}", DB="${dbUser.email}"`);
    }
    
    const expectedName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();
    if (expectedName && expectedName !== dbUser.name) {
      inconsistencies.push(`Name mismatch: Clerk="${expectedName}", DB="${dbUser.name}"`);
    }
    
    return {
      isConsistent: inconsistencies.length === 0,
      inconsistencies,
      requiresSync: inconsistencies.length > 0,
      clerkData: clerkUser,
      dbData: dbUser
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      isConsistent: false,
      inconsistencies: [`Validation failed: ${errorMessage}`],
      requiresSync: true
    };
  }
}

// ================================
// ENHANCED SYNC FUNCTION
// ================================

export async function enhancedSyncUser(
  clerkUserId: string,
  options: {
    forceSync?: boolean;
    validateFirst?: boolean;
    maxRetries?: number;
  } = {}
): Promise<SyncResult> {
  const startTime = Date.now();
  let operationsCount = 0;
  
  return await withUserSyncLock(clerkUserId, async () => {
    // Update sync state to in_progress
    await updateSyncState(clerkUserId, 'in_progress', { retryCount: 0 });
    
    try {
      // Validate current sync state if requested
      if (options.validateFirst) {
        operationsCount++;
        const validation = await validateBidirectionalSync(clerkUserId);
        
        if (validation.isConsistent && !options.forceSync) {
          await updateSyncState(clerkUserId, 'success', {
            inconsistencies: [],
            retryCount: 0
          });
          
          return {
            success: true,
            operation: 'validate',
            syncState: await getSyncState(clerkUserId),
            inconsistencies: [],
            performance: {
              duration: Date.now() - startTime,
              operationsCount
            }
          } as SyncResult;
        }
        
        if (validation.inconsistencies.length > 0) {
          console.log(`Inconsistencies found for ${clerkUserId}:`, validation.inconsistencies);
        }
      }
      
      // Fetch user data with retry logic
      operationsCount++;
      const clerkUser = await retryWithExponentialBackoff(
        async () => {
          const client = await clerkClient();
          return client.users.getUser(clerkUserId);
        },
        {
          operation: 'clerk-read',
          clerkUserId,
          metadata: { startTime }
        },
        options.maxRetries || 3
      );
      
      // Prepare user data for database sync
      const userEmail = clerkUser.emailAddresses
        ?.find(email => email.id === clerkUser.primaryEmailAddressId)?.emailAddress || '';
      const userName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Unknown User';
      const userRole = (clerkUser.publicMetadata?.role as UserRole) || 'viewer';
      const managerId = clerkUser.publicMetadata?.managerId as string || null;
      const syncVersion = Date.now();
      
      // Atomic database upsert with retry
      operationsCount++;
      const dbResult = await retryWithExponentialBackoff(
        () => adminApolloClient.mutate({
          mutation: ATOMIC_USER_UPSERT,
          variables: {
            clerkUserId,
            name: userName,
            email: userEmail,
            role: userRole,
            isStaff: userRole === 'org_admin' || userRole === 'manager' || userRole === 'developer',
            managerId,
            image: clerkUser.imageUrl || null,
            syncVersion
          }
        }),
        {
          operation: 'db-write',
          clerkUserId,
          metadata: { startTime }
        },
        options.maxRetries || 3
      );
      
      const dbUser = (dbResult as any).data?.insertUser;
      if (!dbUser) {
        throw new Error('Failed to create/update user in database');
      }
      
      // Update Clerk metadata with database information
      operationsCount++;
      const userPermissions = getPermissionsForRole(dbUser.role);
      await retryWithExponentialBackoff(
        async () => {
          const client = await clerkClient();
          return client.users.updateUser(clerkUserId, {
            publicMetadata: {
            ...clerkUser.publicMetadata,
            role: dbUser.role,
            databaseId: dbUser.id,
            isStaff: dbUser.isStaff,
            managerId: dbUser.managerId,
            permissions: userPermissions,
            lastSyncAt: new Date().toISOString(),
            syncVersion
          }
        });
        },
        {
          operation: 'clerk-write',
          clerkUserId,
          metadata: { startTime }
        },
        options.maxRetries || 3
      );
      
      // Final validation
      operationsCount++;
      const finalValidation = await validateBidirectionalSync(clerkUserId);
      
      const syncStatus: SyncState['lastSyncStatus'] = 
        finalValidation.isConsistent ? 'success' : 'partial';
      
      await updateSyncState(clerkUserId, syncStatus, {
        inconsistencies: finalValidation.inconsistencies,
        retryCount: 0
      });
      
      // Log successful sync
      await auditLogger.logSOC2Event({
        level: LogLevel.AUDIT,
        eventType: SOC2EventType.USER_UPDATED,
        category: LogCategory.AUTHENTICATION,
        complianceNote: `Enhanced user sync completed: ${syncStatus}`,
        success: true,
        userId: clerkUserId,
        resourceId: dbUser.id,
        resourceType: 'user_sync',
        action: 'enhanced_sync',
        metadata: {
          syncStatus,
          inconsistencies: finalValidation.inconsistencies,
          operationsCount,
          duration: Date.now() - startTime,
          syncVersion
        }
      });
      
      return {
        success: true,
        userId: dbUser.id,
        operation: 'sync',
        syncState: (await getSyncState(clerkUserId)) || { 
          userId: dbUser.id, 
          clerkUserId, 
          lastSyncAt: new Date(), 
          lastSyncStatus: syncStatus, 
          syncVersion: Date.now(), 
          inconsistencies: finalValidation.inconsistencies, 
          retryCount: 0 
        },
        inconsistencies: finalValidation.inconsistencies,
        performance: {
          duration: Date.now() - startTime,
          operationsCount
        }
      };
      
    } catch (error: any) {
      const syncError = error instanceof SyncError ? error : 
        new SyncError(`Enhanced sync failed: ${error.message}`, {
          operation: 'validation',
          retryAttempt: 1,
          lastError: error,
          clerkUserId
        });
      
      await updateSyncState(clerkUserId, 'failed', {
        inconsistencies: [syncError.message],
        retryCount: syncError.context.retryAttempt,
        lastError: syncError.message
      });
      
      // Log failed sync
      await auditLogger.logSOC2Event({
        level: LogLevel.ERROR,
        eventType: SOC2EventType.USER_UPDATED,
        category: LogCategory.AUTHENTICATION,
        complianceNote: 'Enhanced user sync failed',
        success: false,
        userId: clerkUserId,
        resourceType: 'user_sync',
        action: 'enhanced_sync_failed',
        metadata: {
          error: syncError.message,
          context: syncError.context,
          isRetryable: syncError.isRetryable,
          operationsCount,
          duration: Date.now() - startTime
        }
      });
      
      throw syncError;
    }
  });
}