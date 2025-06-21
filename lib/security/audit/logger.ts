/**
 * Unified Audit Logging Service
 * Consolidates: audit-logger.ts, soc2-logger.ts, security/audit.ts
 * Provides comprehensive logging for audit, security, and SOC2 compliance requirements
 */

import { gql } from "@apollo/client";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

import { adminApolloClient } from "@/lib/apollo/unified-client";

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
// GRAPHQL MUTATIONS
// ================================

const LOG_AUDIT_EVENT = gql`
  mutation LogAuditEvent(
    $user_id: String!
    $user_role: String
    $action: String!
    $entity_type: String!
    $entity_id: String
    $data_classification: String!
    $fields_affected: jsonb
    $previous_values: jsonb
    $new_values: jsonb
    $request_id: String!
    $success: Boolean!
    $error_message: String
    $method: String
    $user_agent: String
    $ip_address: String
    $session_id: String
  ) {
    insert_audit_audit_log_one(
      object: {
        user_id: $user_id
        user_role: $user_role
        action: $action
        entity_type: $entity_type
        entity_id: $entity_id
        data_classification: $data_classification
        fields_affected: $fields_affected
        previous_values: $previous_values
        new_values: $new_values
        request_id: $request_id
        success: $success
        error_message: $error_message
        method: $method
        user_agent: $user_agent
        ip_address: $ip_address
        session_id: $session_id
      }
    ) {
      id
      timestamp
    }
  }
`;

const LOG_SOC2_EVENT = gql`
  mutation LogSOC2Event(
    $level: String!
    $category: String!
    $event_type: String!
    $user_id: String
    $user_email: String
    $user_role: String
    $resource_id: String
    $resource_type: String
    $action: String
    $ip_address: String
    $user_agent: String
    $session_id: String
    $success: Boolean!
    $error_message: String
    $metadata: jsonb
    $data_classification: String
    $compliance_note: String
  ) {
    insert_audit_compliance_log_one(
      object: {
        level: $level
        category: $category
        event_type: $event_type
        user_id: $user_id
        user_email: $user_email
        user_role: $user_role
        resource_id: $resource_id
        resource_type: $resource_type
        action: $action
        ip_address: $ip_address
        user_agent: $user_agent
        session_id: $session_id
        success: $success
        error_message: $error_message
        metadata: $metadata
        data_classification: $data_classification
        compliance_note: $compliance_note
      }
    ) {
      id
      timestamp
    }
  }
`;

const LOG_AUTH_EVENT = gql`
  mutation LogAuthEvent(
    $event_type: String!
    $user_id: String
    $user_email: String
    $ip_address: String
    $user_agent: String
    $success: Boolean!
    $failure_reason: String
    $metadata: jsonb
  ) {
    insert_audit_auth_events_one(
      object: {
        event_type: $event_type
        user_id: $user_id
        user_email: $user_email
        ip_address: $ip_address
        user_agent: $user_agent
        success: $success
        failure_reason: $failure_reason
        metadata: $metadata
      }
    ) {
      id
      timestamp
    }
  }
`;

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
      await adminApolloClient.mutate({
        mutation: LOG_AUDIT_EVENT,
        variables: {
          user_id: entry.userId,
          user_role: entry.userRole,
          action: entry.action,
          entity_type: entry.entityType,
          entity_id: entry.entityId,
          data_classification: entry.dataClassification,
          fields_affected: entry.fieldsAffected,
          previous_values: entry.previousValues,
          new_values: entry.newValues,
          request_id: entry.requestId,
          success: entry.success,
          error_message: entry.errorMessage,
          method: entry.method,
          user_agent: entry.userAgent,
          ip_address: entry.ipAddress,
          session_id: entry.sessionId,
        },
      });
    } catch (error) {
      console.error("Failed to log audit event:", error);
    }
  }

  /**
   * Log SOC2 compliance events
   */
  async logSOC2Event(entry: SOC2LogEntry): Promise<void> {
    try {
      await adminApolloClient.mutate({
        mutation: LOG_SOC2_EVENT,
        variables: {
          level: entry.level,
          category: entry.category,
          event_type: entry.eventType,
          user_id: entry.userId,
          user_email: entry.userEmail,
          user_role: entry.userRole,
          resource_id: entry.resourceId,
          resource_type: entry.resourceType,
          action: entry.action,
          ip_address: entry.ipAddress,
          user_agent: entry.userAgent,
          session_id: entry.sessionId,
          success: entry.success,
          error_message: entry.errorMessage,
          metadata: entry.metadata,
          data_classification: entry.dataClassification,
          compliance_note: entry.complianceNote,
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
      await adminApolloClient.mutate({
        mutation: LOG_AUTH_EVENT,
        variables: {
          event_type: entry.eventType,
          user_id: entry.userId,
          user_email: entry.userEmail,
          ip_address: entry.ipAddress,
          user_agent: entry.userAgent,
          success: entry.success,
          failure_reason: entry.failureReason,
          metadata: entry.metadata,
        },
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
    return {
      ipAddress:
        request.headers.get("x-forwarded-for")?.split(",")[0] ||
        request.headers.get("x-real-ip") ||
        "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
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
      if (hasuraClaims?.["x-hasura-role"]) result.userRole = hasuraClaims["x-hasura-role"];
      if (sessionClaims?.email) result.userEmail = sessionClaims.email as string;
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
