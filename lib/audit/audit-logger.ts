/**
 * SOC2-Compliant Audit Logger
 *
 * Comprehensive audit logging for all system activities
 * - Database-integrated audit trails
 * - Authentication and authorization events
 * - Data access and modification tracking
 * - SOC2 compliance reporting
 */

import { gql } from '@apollo/client';
import { adminApolloClient } from '@/lib/apollo/unified-client';

export interface AuditLogEntry {
  userId?: string;
  action: string;
  entityId?: string;
  entityType?: string;
  metadata?: Record<string, any>;
  timestamp?: Date;
  success?: boolean;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  sessionId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
}

export interface AuthEvent {
  eventType: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'PASSWORD_CHANGE' | 'PERMISSION_DENIED' | 'SESSION_EXPIRED';
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  failureReason?: string;
  metadata?: Record<string, any>;
}

// GraphQL mutations for database audit logging
const INSERT_AUDIT_LOG = gql`
  mutation InsertAuditLog($event: AuditAuditLogInsertInput!) {
    insertAuditAuditLog(objects: [$event]) {
      returning {
        id
        eventTime
      }
    }
  }
`;

const INSERT_AUTH_EVENT = gql`
  mutation InsertAuthEvent($event: AuditAuthEventsInsertInput!) {
    insertAuditAuthEvents(objects: [$event]) {
      returning {
        id
        eventTime
      }
    }
  }
`;

class AuditLogger {
  /**
   * Log general audit events to database
   */
  async log(entry: AuditLogEntry): Promise<void> {
    const logEntry = {
      ...entry,
      timestamp: entry.timestamp || new Date(),
      success: entry.success ?? true,
    };

    // Development logging
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 AUDIT LOG:", logEntry);
    }

    try {
      // Store in audit database table for SOC2 compliance
      await adminApolloClient.mutate({
        mutation: INSERT_AUDIT_LOG,
        variables: {
          event: {
            action: logEntry.action,
            resourceType: logEntry.entityType,
            resourceId: logEntry.entityId,
            userId: logEntry.userId,
            ipAddress: logEntry.ipAddress,
            userAgent: logEntry.userAgent,
            success: logEntry.success,
            errorMessage: logEntry.errorMessage,
            oldValues: logEntry.oldValues,
            newValues: logEntry.newValues,
            metadata: {
              request_id: logEntry.requestId,
              session_id: logEntry.sessionId,
              ...logEntry.metadata,
            },
            eventTime: logEntry.timestamp.toISOString(),
          },
        },
      });
    } catch (error) {
      console.error('❌ Failed to store audit log:', error);
      // Fallback to console logging for critical compliance
      console.log(
        `[AUDIT] ${logEntry.action} by user ${logEntry.userId} at ${logEntry.timestamp.toISOString()}`
      );
    }
  }

  /**
   * Log authentication events with enhanced security tracking
   */
  async logAuthEvent(event: AuthEvent): Promise<void> {
    if (process.env.NODE_ENV === "development") {
      console.log("🔐 AUTH EVENT:", event);
    }

    try {
      await adminApolloClient.mutate({
        mutation: INSERT_AUTH_EVENT,
        variables: {
          event: {
            eventType: event.eventType,
            userId: event.userId,
            userEmail: event.userEmail,
            ipAddress: event.ipAddress,
            userAgent: event.userAgent,
            success: event.success,
            failureReason: event.failureReason,
            metadata: event.metadata,
            eventTime: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      console.error('❌ Failed to store auth event:', error);
      // Critical security events must be logged
      console.log(`[AUTH] ${event.eventType} - Success: ${event.success} - User: ${event.userEmail || event.userId}`);
    }
  }

  /**
   * Log bulk operations with detailed statistics
   */
  async logBulkOperation(
    entry: AuditLogEntry & {
      bulkOperation: true;
      totalRecords: number;
      successfulRecords: number;
      failedRecords: number;
    }
  ): Promise<void> {
    await this.log({
      ...entry,
      metadata: {
        ...entry.metadata,
        bulkOperation: true,
        totalRecords: entry.totalRecords,
        successfulRecords: entry.successfulRecords,
        failedRecords: entry.failedRecords,
      },
    });
  }

  /**
   * Extract request context for audit logging
   */
  extractRequestContext(request: Request): {
    ipAddress: string;
    userAgent: string;
    requestId?: string;
  } {
    const requestId = request.headers.get('x-request-id');
    return {
      ipAddress: 
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        request.headers.get('cf-connecting-ip') ||
        'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      ...(requestId && { requestId }),
    };
  }

  /**
   * SOC2 Compliance utility functions
   */
  async loginSuccess(userId: string, userEmail: string, context: ReturnType<typeof this.extractRequestContext>) {
    await this.logAuthEvent({
      eventType: 'LOGIN',
      userId,
      userEmail,
      success: true,
      ...context,
    });
  }

  async loginFailure(userEmail: string, reason: string, context: ReturnType<typeof this.extractRequestContext>) {
    await this.logAuthEvent({
      eventType: 'LOGIN_FAILED',
      userEmail,
      success: false,
      failureReason: reason,
      ...context,
    });
  }

  async logout(userId: string, userEmail: string, context: ReturnType<typeof this.extractRequestContext>) {
    await this.logAuthEvent({
      eventType: 'LOGOUT',
      userId,
      userEmail,
      success: true,
      ...context,
    });
  }

  async permissionDenied(
    userId: string, 
    action: string, 
    resource: string, 
    context: ReturnType<typeof this.extractRequestContext>
  ) {
    await this.log({
      userId,
      action: 'PERMISSION_DENIED',
      entityType: resource,
      success: false,
      errorMessage: `Access denied for action: ${action}`,
      ...context,
    });
  }

  async dataAccess(
    userId: string,
    action: 'READ' | 'LIST' | 'SEARCH',
    resourceType: string,
    resourceId?: string,
    context?: ReturnType<typeof this.extractRequestContext>
  ) {
    await this.log({
      userId,
      action,
      entityType: resourceType,
      ...(resourceId && { entityId: resourceId }),
      success: true,
      ...context,
    });
  }

  async dataModification(
    userId: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    resourceType: string,
    resourceId: string,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
    context?: ReturnType<typeof this.extractRequestContext>
  ) {
    await this.log({
      userId,
      action,
      entityType: resourceType,
      entityId: resourceId,
      success: true,
      ...(oldValues && { oldValues }),
      ...(newValues && { newValues }),
      ...context,
    });
  }

  async adminAction(
    adminUserId: string,
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: Record<string, any>,
    context?: ReturnType<typeof this.extractRequestContext>
  ) {
    await this.log({
      userId: adminUserId,
      action: `ADMIN_${action}`,
      entityType: resourceType,
      ...(resourceId && { entityId: resourceId }),
      success: true,
      ...(details && { metadata: details }),
      ...context,
    });
  }
}

export const auditLogger = new AuditLogger();
