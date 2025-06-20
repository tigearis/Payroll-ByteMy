/**
 * SOC2 Compliant Logging Service
 * Provides comprehensive logging for audit, security, and compliance requirements
 */

import { gql } from "@apollo/client";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

import { adminApolloClient } from "../server-apollo-client";


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

// SOC2 specific event types
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
  
  // User Management (CC6.2)
  USER_CREATED = "USER_CREATED",
  USER_MODIFIED = "USER_MODIFIED",
  USER_DEACTIVATED = "USER_DEACTIVATED",
  USER_REACTIVATED = "USER_REACTIVATED",
  ROLE_ASSIGNED = "ROLE_ASSIGNED",
  ROLE_REVOKED = "ROLE_REVOKED",
  PERMISSION_GRANTED = "PERMISSION_GRANTED",
  PERMISSION_REVOKED = "PERMISSION_REVOKED",
  
  // Data Access (CC6.3)
  DATA_VIEWED = "DATA_VIEWED",
  DATA_EXPORTED = "DATA_EXPORTED",
  DATA_CREATED = "DATA_CREATED",
  DATA_UPDATED = "DATA_UPDATED",
  DATA_DELETED = "DATA_DELETED",
  BULK_OPERATION = "BULK_OPERATION",
  
  // System Changes (CC7.1)
  CONFIG_CHANGED = "CONFIG_CHANGED",
  SYSTEM_STARTUP = "SYSTEM_STARTUP",
  SYSTEM_SHUTDOWN = "SYSTEM_SHUTDOWN",
  BACKUP_CREATED = "BACKUP_CREATED",
  BACKUP_RESTORED = "BACKUP_RESTORED",
  
  // Security Events (CC7.2)
  UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS",
  SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  INVALID_INPUT = "INVALID_INPUT",
  SECURITY_SCAN = "SECURITY_SCAN",
  
  // Compliance (CC7.3)
  COMPLIANCE_CHECK = "COMPLIANCE_CHECK",
  AUDIT_TRAIL_ACCESSED = "AUDIT_TRAIL_ACCESSED",
  RETENTION_POLICY_APPLIED = "RETENTION_POLICY_APPLIED",
}

// Log entry interface
export interface SOC2LogEntry {
  level: LogLevel;
  category: LogCategory;
  eventType: SOC2EventType;
  message: string;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  requestId?: string;
  traceId?: string;
  spanId?: string;
  errorDetails?: {
    message: string;
    stack?: string;
    code?: string;
  };
  performanceMetrics?: {
    duration?: number;
    memoryUsage?: number;
    cpuUsage?: number;
  };
}

// Mutations for logging (Fixed to match actual table names)
const INSERT_AUDIT_LOG = gql`
  mutation InsertAuditLog($object: audit_audit_log_insert_input!) {
    insert_audit_audit_log_one(object: $object) {
      id
      event_time
    }
  }
`;

const INSERT_AUTH_EVENT = gql`
  mutation InsertAuthEvent($object: audit_auth_events_insert_input!) {
    insert_audit_auth_events_one(object: $object) {
      id
      event_time
    }
  }
`;

const INSERT_DATA_ACCESS_LOG = gql`
  mutation InsertDataAccessLog($object: audit_data_access_log_insert_input!) {
    insert_audit_data_access_log_one(object: $object) {
      id
      accessed_at
    }
  }
`;

const INSERT_SECURITY_EVENT = gql`
  mutation InsertSecurityEvent($object: security_event_log_insert_input!) {
    insert_security_event_log_one(object: $object) {
      id
      created_at
    }
  }
`;

export class SOC2Logger {
  private static instance: SOC2Logger;
  private buffer: SOC2LogEntry[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private readonly maxBufferSize = 100;
  private readonly flushIntervalMs = 5000;

  private constructor() {
    // Start buffer flush interval
    this.startFlushInterval();
  }

  static getInstance(): SOC2Logger {
    if (!SOC2Logger.instance) {
      SOC2Logger.instance = new SOC2Logger();
    }
    return SOC2Logger.instance;
  }

  /**
   * Main logging method
   */
  async log(entry: SOC2LogEntry, request?: NextRequest): Promise<void> {
    try {
      // Enrich entry with request data
      if (request) {
        entry.ipAddress = this.getClientIP(request);
        entry.userAgent = request.headers.get("user-agent") || undefined;
        entry.requestId = request.headers.get("x-request-id") || crypto.randomUUID();
        entry.traceId = request.headers.get("x-trace-id") || undefined;
      }

      // Add timestamp
      const timestamp = new Date().toISOString();

      // Determine which table to write to based on category
      switch (entry.category) {
        case LogCategory.AUTHENTICATION:
        case LogCategory.AUTHORIZATION:
          await this.logAuthEvent(entry, timestamp);
          break;
          
        case LogCategory.DATA_ACCESS:
          await this.logDataAccess(entry, timestamp);
          break;
          
        case LogCategory.SECURITY_EVENT:
          await this.logSecurityEvent(entry, timestamp);
          break;
          
        default:
          await this.logAuditEvent(entry, timestamp);
      }

      // Also log to console in development
      if (process.env.NODE_ENV === "development") {
        this.consoleLog(entry, timestamp);
      }

      // Check for critical events that need immediate attention
      if (entry.level === LogLevel.CRITICAL || entry.level === LogLevel.SECURITY) {
        await this.handleCriticalEvent(entry);
      }
    } catch (error) {
      // Never fail silently - log to console as fallback
      console.error("[SOC2Logger] Failed to log entry:", error, entry);
      
      // Add to buffer for retry
      this.buffer.push(entry);
      
      // Flush buffer if it's getting full
      if (this.buffer.length >= this.maxBufferSize) {
        await this.flushBuffer();
      }
    }
  }

  /**
   * Log authentication/authorization events
   */
  private async logAuthEvent(entry: SOC2LogEntry, timestamp: string): Promise<void> {
    const authEvent = {
      event_time: timestamp,
      event_type: entry.eventType,
      user_id: entry.userId,
      user_email: entry.userEmail,
      ip_address: entry.ipAddress,
      user_agent: entry.userAgent,
      success: !entry.errorDetails,
      failure_reason: entry.errorDetails?.message,
      metadata: {
        ...entry.metadata,
        session_id: entry.sessionId,
        request_id: entry.requestId,
        trace_id: entry.traceId,
      },
    };

    await adminApolloClient.mutate({
      mutation: INSERT_AUTH_EVENT,
      variables: { object: authEvent },
    });
  }

  /**
   * Log data access events
   */
  private async logDataAccess(entry: SOC2LogEntry, timestamp: string): Promise<void> {
    const dataAccessLog = {
      accessed_at: timestamp,
      user_id: entry.userId,
      resource_type: entry.entityType,
      resource_id: entry.entityId,
      access_type: entry.eventType,
      data_classification: entry.metadata?.dataClassification || "MEDIUM",
      fields_accessed: entry.metadata?.fields,
      query_executed: entry.metadata?.query,
      row_count: entry.metadata?.rowCount,
      ip_address: entry.ipAddress,
      session_id: entry.sessionId,
      metadata: entry.metadata,
    };

    await adminApolloClient.mutate({
      mutation: INSERT_DATA_ACCESS_LOG,
      variables: { object: dataAccessLog },
    });
  }

  /**
   * Log security events
   */
  private async logSecurityEvent(entry: SOC2LogEntry, timestamp: string): Promise<void> {
    const severity = this.mapLogLevelToSeverity(entry.level);
    
    const securityEvent = {
      event_type: entry.eventType,
      severity,
      user_id: entry.userId,
      details: {
        message: entry.message,
        metadata: entry.metadata,
        error: entry.errorDetails,
        ip_address: entry.ipAddress,
        user_agent: entry.userAgent,
      },
      ip_address: entry.ipAddress,
      created_at: timestamp,
    };

    await adminApolloClient.mutate({
      mutation: INSERT_SECURITY_EVENT,
      variables: { object: securityEvent },
    });
  }

  /**
   * Log general audit events
   */
  private async logAuditEvent(entry: SOC2LogEntry, timestamp: string): Promise<void> {
    const auditLog = {
      event_time: timestamp,
      user_id: entry.userId,
      user_email: entry.userEmail,
      user_role: entry.userRole,
      action: entry.eventType,
      resource_type: entry.entityType,
      resource_id: entry.entityId,
      ip_address: entry.ipAddress,
      user_agent: entry.userAgent,
      session_id: entry.sessionId,
      request_id: entry.requestId,
      success: !entry.errorDetails,
      error_message: entry.errorDetails?.message,
      metadata: {
        ...entry.metadata,
        level: entry.level,
        category: entry.category,
        message: entry.message,
        performance: entry.performanceMetrics,
      },
    };

    await adminApolloClient.mutate({
      mutation: INSERT_AUDIT_LOG,
      variables: { object: auditLog },
    });
  }

  /**
   * Handle critical events that need immediate attention
   */
  private async handleCriticalEvent(entry: SOC2LogEntry): Promise<void> {
    // In production, this would:
    // 1. Send alerts to security team
    // 2. Trigger incident response workflow
    // 3. Create PagerDuty incident
    // 4. Send to SIEM system
    
    console.error("[CRITICAL EVENT]", {
      timestamp: new Date().toISOString(),
      event: entry.eventType,
      user: entry.userId,
      message: entry.message,
      metadata: entry.metadata,
    });
  }

  /**
   * Console logging for development
   */
  private consoleLog(entry: SOC2LogEntry, timestamp: string): void {
    const logData = {
      timestamp,
      level: entry.level,
      category: entry.category,
      event: entry.eventType,
      message: entry.message,
      user: entry.userId,
      entity: entry.entityType ? `${entry.entityType}:${entry.entityId}` : undefined,
      metadata: entry.metadata,
      performance: entry.performanceMetrics,
      error: entry.errorDetails,
    };

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug("[SOC2]", logData);
        break;
      case LogLevel.INFO:
        console.info("[SOC2]", logData);
        break;
      case LogLevel.WARNING:
        console.warn("[SOC2]", logData);
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
      case LogLevel.SECURITY:
        console.error("[SOC2]", logData);
        break;
      default:
        console.log("[SOC2]", logData);
    }
  }

  /**
   * Extract client IP from request
   */
  private getClientIP(request: NextRequest): string {
    return (
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      request.headers.get("cf-connecting-ip") ||
      "unknown"
    );
  }

  /**
   * Map log level to severity
   */
  private mapLogLevelToSeverity(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
      case LogLevel.INFO:
        return "info";
      case LogLevel.WARNING:
        return "warning";
      case LogLevel.ERROR:
        return "error";
      case LogLevel.CRITICAL:
      case LogLevel.SECURITY:
        return "critical";
      default:
        return "info";
    }
  }

  /**
   * Start buffer flush interval
   */
  private startFlushInterval(): void {
    this.flushInterval = setInterval(() => {
      this.flushBuffer().catch(console.error);
    }, this.flushIntervalMs);
  }

  /**
   * Flush buffered logs
   */
  private async flushBuffer(): Promise<void> {
    if (this.buffer.length === 0) {return;}

    const logsToFlush = [...this.buffer];
    this.buffer = [];

    for (const entry of logsToFlush) {
      try {
        await this.log(entry);
      } catch (error) {
        console.error("[SOC2Logger] Failed to flush buffered log:", error);
      }
    }
  }

  /**
   * Cleanup on shutdown
   */
  async shutdown(): Promise<void> {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    await this.flushBuffer();
  }
}

// Export singleton instance
export const soc2Logger = SOC2Logger.getInstance();

// Helper functions for common logging scenarios
export const logAuthentication = async (
  success: boolean,
  userId?: string,
  email?: string,
  metadata?: any,
  request?: NextRequest
) => {
  await soc2Logger.log({
    level: success ? LogLevel.INFO : LogLevel.WARNING,
    category: LogCategory.AUTHENTICATION,
    eventType: success ? SOC2EventType.LOGIN_SUCCESS : SOC2EventType.LOGIN_FAILURE,
    message: success ? "User login successful" : "User login failed",
    userId,
    userEmail: email,
    metadata,
  }, request);
};

export const logDataAccess = async (
  eventType: SOC2EventType,
  entityType: string,
  entityId?: string,
  metadata?: any,
  request?: NextRequest
) => {
  const { userId, sessionClaims } = await auth();
  
  await soc2Logger.log({
    level: LogLevel.INFO,
    category: LogCategory.DATA_ACCESS,
    eventType,
    message: `Data access: ${eventType} on ${entityType}`,
    userId: userId || undefined,
    userRole: sessionClaims?.metadata?.role,
    entityType,
    entityId,
    metadata,
  }, request);
};

export const logSecurityEvent = async (
  eventType: SOC2EventType,
  message: string,
  metadata?: any,
  request?: NextRequest
) => {
  const { userId } = await auth();
  
  await soc2Logger.log({
    level: LogLevel.SECURITY,
    category: LogCategory.SECURITY_EVENT,
    eventType,
    message,
    userId: userId || undefined,
    metadata,
  }, request);
};

// Decorator for automatic method logging
export function SOC2Logged(
  eventType: SOC2EventType,
  category: LogCategory = LogCategory.DATA_ACCESS
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      const { userId, sessionClaims } = await auth();
      
      try {
        const result = await originalMethod.apply(this, args);
        
        await soc2Logger.log({
          level: LogLevel.INFO,
          category,
          eventType,
          message: `${propertyKey} completed successfully`,
          userId: userId || undefined,
          userRole: sessionClaims?.metadata?.role,
          metadata: {
            method: propertyKey,
            duration: Date.now() - startTime,
          },
          performanceMetrics: {
            duration: Date.now() - startTime,
          },
        });
        
        return result;
      } catch (error: any) {
        await soc2Logger.log({
          level: LogLevel.ERROR,
          category,
          eventType,
          message: `${propertyKey} failed`,
          userId: userId || undefined,
          userRole: sessionClaims?.metadata?.role,
          errorDetails: {
            message: error.message,
            stack: error.stack,
          },
          performanceMetrics: {
            duration: Date.now() - startTime,
          },
        });
        
        throw error;
      }
    };

    return descriptor;
  };
}