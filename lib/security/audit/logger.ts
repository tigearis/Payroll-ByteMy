/**
 * Unified Audit Logging Service
 * Consolidates: audit-logger.ts, soc2-logger.ts, security/audit.ts
 * Provides comprehensive logging for audit, security, and SOC2 compliance requirements
 */

import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { extractClientInfo as getClientInfo } from "@/lib/utils/client-info";

import { adminApolloClient } from "@/lib/apollo/unified-client";
import { 
  LogAuditEventDocument, 
  LogAuthEventDocument, 
  type LogAuditEventMutationVariables, 
  type LogAuthEventMutationVariables 
} from "@/domains/audit/graphql/generated/graphql";

// ================================
// TYPES AND ENUMS
// ================================

// Log levels aligned with SOC2 requirements
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
  SECURITY = "SECURITY",
  AUDIT = "AUDIT",
}

// Log categories for classification
export enum LogCategory {
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  DATA_ACCESS = "DATA_ACCESS",
  DATA_MODIFICATION = "DATA_MODIFICATION",
  SYSTEM_ACCESS = "SYSTEM_ACCESS",
  CONFIGURATION_CHANGE = "CONFIGURATION_CHANGE",
  SECURITY_EVENT = "SECURITY_EVENT",
  PERFORMANCE = "PERFORMANCE",
  ERROR = "ERROR",
  COMPLIANCE = "COMPLIANCE",
}

// Data classification levels
export enum DataClassification {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

// Audit actions
export enum AuditAction {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  EXPORT = "EXPORT",
  BULK_OPERATION = "BULK_OPERATION",
}

// SOC2 specific event types (comprehensive)
export enum SOC2EventType {
  // Access Control (CC6.1)
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILURE = "LOGIN_FAILURE",
  LOGOUT = "LOGOUT",
  SESSION_TIMEOUT = "SESSION_TIMEOUT",
  PASSWORD_CHANGE = "PASSWORD_CHANGE",
  MFA_ENABLED = "MFA_ENABLED",
  MFA_DISABLED = "MFA_DISABLED",
  MFA_CHALLENGE = "MFA_CHALLENGE",
  MFA_SUCCESS = "MFA_SUCCESS",
  MFA_FAILURE = "MFA_FAILURE",
  ACCOUNT_LOCKED = "ACCOUNT_LOCKED",
  ACCOUNT_UNLOCKED = "ACCOUNT_UNLOCKED",
  SESSION_EXPIRED = "SESSION_EXPIRED",

  // Data Access (CC6.3)
  DATA_VIEWED = "DATA_VIEWED",
  SENSITIVE_DATA_ACCESS = "SENSITIVE_DATA_ACCESS",
  SENSITIVE_DATA_EXPORT = "SENSITIVE_DATA_EXPORT",
  BULK_DATA_ACCESS = "BULK_DATA_ACCESS",
  UNAUTHORIZED_ACCESS_ATTEMPT = "UNAUTHORIZED_ACCESS_ATTEMPT",

  // System Changes (CC6.2)
  USER_CREATED = "USER_CREATED",
  USER_UPDATED = "USER_UPDATED",
  USER_DELETED = "USER_DELETED",
  ROLE_CHANGED = "ROLE_CHANGED",
  PERMISSION_GRANTED = "PERMISSION_GRANTED",
  PERMISSION_REVOKED = "PERMISSION_REVOKED",

  // Configuration (CC6.4)
  SYSTEM_CONFIG_CHANGE = "SYSTEM_CONFIG_CHANGE",
  SECURITY_CONFIG_CHANGE = "SECURITY_CONFIG_CHANGE",

  // Monitoring (CC7.1)
  SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  SECURITY_VIOLATION = "SECURITY_VIOLATION",
}

// Auth event types (legacy compatibility)
export enum AuthEventType {
  LOGIN = "login",
  LOGOUT = "logout",
  SIGNUP = "signup",
  PASSWORD_RESET = "password_reset",
  PASSWORD_CHANGE = "password_change",
  MFA_ENABLED = "mfa_enabled",
  MFA_DISABLED = "mfa_disabled",
  MFA_CHALLENGE = "mfa_challenge",
  MFA_SUCCESS = "mfa_success",
  MFA_FAILURE = "mfa_failure",
  ACCOUNT_LOCKED = "account_locked",
  ACCOUNT_UNLOCKED = "account_unlocked",
  SESSION_EXPIRED = "session_expired",
}

// ================================
// INTERFACES
// ================================

export interface AuditLogEntry {
  userId: string;
  userRole?: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  dataClassification: DataClassification;
  fieldsAffected?: string[];
  previousValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  requestId: string;
  success: boolean;
  errorMessage?: string;
  method?: string;
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
}

export interface SOC2LogEntry {
  level: LogLevel;
  category: LogCategory;
  eventType: SOC2EventType;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  resourceId?: string;
  resourceType?: string;
  action?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
  dataClassification?: DataClassification;
  complianceNote?: string;
}

export interface AuthLogEntry {
  eventType: AuthEventType;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  failureReason?: string;
  metadata?: Record<string, any>;
}

// ================================
// GRAPHQL MUTATIONS MIGRATED TO DOMAIN
// Now imported from @/domains/audit/graphql/generated/graphql
// ================================

// ================================
// UNIFIED AUDIT LOGGER CLASS
// ================================

class UnifiedAuditLogger {
  private static instance: UnifiedAuditLogger;

  private constructor() {}

  static getInstance(): UnifiedAuditLogger {
    if (!UnifiedAuditLogger.instance) {
      UnifiedAuditLogger.instance = new UnifiedAuditLogger();
    }
    return UnifiedAuditLogger.instance;
  }

  /**
   * Log general audit events
   */
  async logAuditEvent(entry: AuditLogEntry): Promise<void> {
    try {
      const variables: LogAuditEventMutationVariables = {
        object: {
          action: entry.action,
          // Map to correct schema field names (camelCase)
          entityType: entry.entityType,
          entityId: entry.entityId,
          dataClassification: entry.dataClassification,
          fieldsAffected: entry.fieldsAffected as any,
          oldValues: entry.previousValues as any,
          newValues: entry.newValues as any,
          request_id: entry.requestId,
          success: entry.success,
          errorMessage: entry.errorMessage,
          method: entry.method,
          userAgent: entry.userAgent,
          ipAddress: entry.ipAddress,
          sessionId: entry.sessionId,
          // Add missing required fields
          eventTime: new Date().toISOString(),
        },
      };

      await adminApolloClient.mutate({
        mutation: LogAuditEventDocument,
        variables,
      });
    } catch (error) {
      console.error("Failed to log audit event:", error);
    }
  }

  /**
   * Log SOC2 compliance events
   * NOTE: This uses a placeholder - SOC2 logging needs proper table/mutation setup
   */
  async logSOC2Event(entry: SOC2LogEntry): Promise<void> {
    try {
      // TODO: Implement proper SOC2 compliance logging once the table is set up
      // For now, log as a regular audit event
      await this.logAuditEvent({
        userId: entry.userId || "system",
        userRole: entry.userRole,
        action: AuditAction.CREATE,
        entityType: "soc2_compliance",
        entityId: entry.resourceId,
        dataClassification: entry.dataClassification || DataClassification.CRITICAL,
        requestId: `soc2-${Date.now()}`,
        success: entry.success,
        errorMessage: entry.errorMessage,
        method: "SOC2_LOG",
        userAgent: entry.userAgent,
        ipAddress: entry.ipAddress,
        sessionId: entry.sessionId,
        newValues: {
          level: entry.level,
          category: entry.category,
          eventType: entry.eventType,
          resourceType: entry.resourceType,
          action: entry.action,
          metadata: entry.metadata,
          complianceNote: entry.complianceNote,
        },
      });
    } catch (error) {
      console.error("Failed to log SOC2 event:", error);
    }
  }

  /**
   * Log authentication events
   */
  async logAuthEvent(entry: AuthLogEntry): Promise<void> {
    try {
      const variables: LogAuthEventMutationVariables = {
        object: {
          eventType: entry.eventType,
          userId: entry.userId,
          userEmail: entry.userEmail,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          success: entry.success,
          failureReason: entry.failureReason,
          metadata: entry.metadata as any,
          // Add required field
          eventTime: new Date().toISOString(),
        },
      };

      await adminApolloClient.mutate({
        mutation: LogAuthEventDocument,
        variables,
      });
    } catch (error) {
      console.error("Failed to log auth event:", error);
    }
  }

  /**
   * Helper to extract client info from request
   */
  extractClientInfo(request: NextRequest): {
    ipAddress?: string;
    userAgent?: string;
  } {
    const { clientIP, userAgent } = getClientInfo(request);
    return {
      ipAddress: clientIP,
      userAgent,
    };
  }

  /**
   * Get user context from Clerk auth
   */
  async getUserContext(): Promise<{
    userId?: string;
    userRole?: string;
    userEmail?: string;
    sessionId?: string;
  }> {
    try {
      const { userId, sessionClaims } = await auth();
      const hasuraClaims = sessionClaims?.[
        "https://hasura.io/jwt/claims"
      ] as any;

      const result: {
        userId?: string;
        userRole?: string;
        userEmail?: string;
        sessionId?: string;
      } = {};

      if (userId) result.userId = userId;
      if (hasuraClaims?.["x-hasura-role"])
        result.userRole = hasuraClaims["x-hasura-role"];
      if (sessionClaims?.email)
        result.userEmail = sessionClaims.email as string;
      if (sessionClaims?.sid) result.sessionId = sessionClaims.sid;

      return result;
    } catch (error) {
      console.error("Failed to get user context:", error);
      return {};
    }
  }
}

// ================================
// EXPORTS
// ================================

export const auditLogger = UnifiedAuditLogger.getInstance();

// Legacy compatibility exports
export { UnifiedAuditLogger as AuditLogger };
export { UnifiedAuditLogger as SOC2Logger };

// Helper functions for backward compatibility
export const logAuthEvent = (entry: AuthLogEntry) =>
  auditLogger.logAuthEvent(entry);
export const logSOC2Event = (entry: SOC2LogEntry) =>
  auditLogger.logSOC2Event(entry);
export const logAuditEvent = (entry: AuditLogEntry) =>
  auditLogger.logAuditEvent(entry);

export default auditLogger;
