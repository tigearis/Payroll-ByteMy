/**
 * Consolidated Logging System
 *
 * Unified logging infrastructure combining general logging, SOC2 compliance, and audit requirements
 */

import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

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
  USER_UPDATED = "USER_UPDATED",
  USER_DELETED = "USER_DELETED",
  ROLE_CHANGED = "ROLE_CHANGED",
  PERMISSION_GRANTED = "PERMISSION_GRANTED",
  PERMISSION_REVOKED = "PERMISSION_REVOKED",

  // Data Access (CC6.3)
  DATA_ACCESSED = "DATA_ACCESSED",
  DATA_EXPORTED = "DATA_EXPORTED",
  SENSITIVE_DATA_ACCESSED = "SENSITIVE_DATA_ACCESSED",

  // System Configuration (CC8.1)
  CONFIG_CHANGED = "CONFIG_CHANGED",
  SECURITY_SETTING_CHANGED = "SECURITY_SETTING_CHANGED",

  // Audit Trail (CC3.4)
  AUDIT_LOG_ACCESSED = "AUDIT_LOG_ACCESSED",
  AUDIT_EXPORT = "AUDIT_EXPORT",
}

// Audit action types
export enum AuditAction {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  EXPORT = "EXPORT",
  BULK_OPERATION = "BULK_OPERATION",
}

// Data classification levels
export enum DataClassification {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

// Base log entry interface
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  userId?: string;
  userRole?: string;
  entityType?: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  error?: any;
}

// SOC2 specific log entry
export interface SOC2LogEntry extends LogEntry {
  eventType: SOC2EventType;
  complianceContext: {
    controlFamily: string;
    controlNumber: string;
    description: string;
  };
}

// Audit log entry interface
export interface AuditLogEntry {
  userId: string;
  userRole: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  dataClassification: DataClassification;
  fieldsAffected?: string[];
  previousValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  requestId: string;
  success: boolean;
  errorMessage?: string;
}

/**
 * Unified logger class that centralizes all logging functionality
 */
export class Logger {
  private static instance: Logger;

  private constructor() {
    // Initialize logger - in production would connect to logging service
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Log an entry with standard format
   */
  async log(entry: Omit<LogEntry, "timestamp">): Promise<void> {
    const logEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };

    // Console logging with structured format
    console.log(
      `[${logEntry.level.toUpperCase()}][${logEntry.category}] ${
        logEntry.message
      }`,
      {
        ...logEntry,
        message: undefined, // Already included in the main log message
        level: undefined,
        category: undefined,
      }
    );

    // Persist important logs to database
    if (this.shouldPersistLog(logEntry)) {
      await this.persistLog(logEntry);
    }
  }

  /**
   * Log SOC2 compliance event
   */
  async logSOC2Event(
    eventType: SOC2EventType,
    entry: Omit<SOC2LogEntry, "timestamp" | "eventType" | "complianceContext">
  ): Promise<void> {
    const complianceContext = this.getComplianceContext(eventType);

    const soc2Entry: SOC2LogEntry = {
      ...entry,
      eventType,
      complianceContext,
      timestamp: new Date().toISOString(),
    };

    await this.log(soc2Entry);

    // Additional SOC2-specific persistence
    await this.persistSOC2Event(soc2Entry);
  }

  /**
   * Log audit event
   */
  async logAuditEvent(entry: AuditLogEntry): Promise<void> {
    const auditLog = {
      ...entry,
      timestamp: new Date().toISOString(),
    };

    // Log as standard entry
    await this.log({
      level: LogLevel.AUDIT,
      category: LogCategory.DATA_MODIFICATION,
      message: `${entry.action} ${entry.entityType}${
        entry.entityId ? ` (${entry.entityId})` : ""
      }`,
      userId: entry._userId,
      userRole: entry.userRole,
      entityType: entry.entityType,
      entityId: entry.entityId || "",
      ipAddress: entry.ipAddress || "",
      metadata: {
        action: entry.action,
        dataClassification: entry.dataClassification,
        fieldsAffected: entry.fieldsAffected,
        success: entry.success,
        requestId: entry.requestId,
      },
    });

    // Persist audit log to database
    await this.persistAuditLog(auditLog);
  }

  // Convenience methods
  async info(
    category: LogCategory,
    message: string,
    metadata: Partial<LogEntry> = {}
  ): Promise<void> {
    await this.log({ level: LogLevel.INFO, category, message, ...metadata });
  }

  async warn(
    category: LogCategory,
    message: string,
    metadata: Partial<LogEntry> = {}
  ): Promise<void> {
    await this.log({ level: LogLevel.WARNING, category, message, ...metadata });
  }

  async error(
    category: LogCategory,
    message: string,
    error?: any,
    metadata: Partial<LogEntry> = {}
  ): Promise<void> {
    await this.log({
      level: LogLevel.ERROR,
      category,
      message,
      _error,
      ...metadata,
    });
  }

  async security(
    message: string,
    metadata: Partial<LogEntry> = {}
  ): Promise<void> {
    await this.log({
      level: LogLevel.SECURITY,
      category: LogCategory.SECURITY_EVENT,
      message,
      ...metadata,
    });
  }

  // Helper methods
  private shouldPersistLog(entry: LogEntry): boolean {
    return (
      entry.level === LogLevel.ERROR ||
      entry.level === LogLevel.CRITICAL ||
      entry.level === LogLevel.SECURITY ||
      entry.level === LogLevel.AUDIT ||
      entry.category === LogCategory.AUTHENTICATION ||
      entry.category === LogCategory.AUTHORIZATION ||
      entry.category === LogCategory.SECURITY_EVENT ||
      entry.category === LogCategory.DATA_MODIFICATION
    );
  }

  private getComplianceContext(eventType: SOC2EventType): any {
    // Map event types to SOC2 control families
    const contextMap: Record<SOC2EventType, any> = {
      [SOC2EventType.LOGIN_SUCCESS]: {
        controlFamily: "CC6",
        controlNumber: "CC6.1",
        description: "Access Control",
      },
      [SOC2EventType.LOGIN_FAILURE]: {
        controlFamily: "CC6",
        controlNumber: "CC6.1",
        description: "Access Control",
      },
      [SOC2EventType.LOGOUT]: {
        controlFamily: "CC6",
        controlNumber: "CC6.1",
        description: "Access Control",
      },
      [SOC2EventType.SESSION_TIMEOUT]: {
        controlFamily: "CC6",
        controlNumber: "CC6.1",
        description: "Access Control",
      },
      [SOC2EventType.PASSWORD_CHANGE]: {
        controlFamily: "CC6",
        controlNumber: "CC6.1",
        description: "Access Control",
      },
      [SOC2EventType.MFA_ENABLED]: {
        controlFamily: "CC6",
        controlNumber: "CC6.1",
        description: "Access Control",
      },
      [SOC2EventType.MFA_DISABLED]: {
        controlFamily: "CC6",
        controlNumber: "CC6.1",
        description: "Access Control",
      },
      [SOC2EventType.MFA_CHALLENGE]: {
        controlFamily: "CC6",
        controlNumber: "CC6.1",
        description: "Access Control",
      },
      [SOC2EventType.MFA_SUCCESS]: {
        controlFamily: "CC6",
        controlNumber: "CC6.1",
        description: "Access Control",
      },
      [SOC2EventType.USER_CREATED]: {
        controlFamily: "CC6",
        controlNumber: "CC6.2",
        description: "User Management",
      },
      [SOC2EventType.USER_UPDATED]: {
        controlFamily: "CC6",
        controlNumber: "CC6.2",
        description: "User Management",
      },
      [SOC2EventType.USER_DELETED]: {
        controlFamily: "CC6",
        controlNumber: "CC6.2",
        description: "User Management",
      },
      [SOC2EventType.ROLE_CHANGED]: {
        controlFamily: "CC6",
        controlNumber: "CC6.2",
        description: "User Management",
      },
      [SOC2EventType.PERMISSION_GRANTED]: {
        controlFamily: "CC6",
        controlNumber: "CC6.2",
        description: "User Management",
      },
      [SOC2EventType.PERMISSION_REVOKED]: {
        controlFamily: "CC6",
        controlNumber: "CC6.2",
        description: "User Management",
      },
      [SOC2EventType.DATA_ACCESSED]: {
        controlFamily: "CC6",
        controlNumber: "CC6.3",
        description: "Data Access",
      },
      [SOC2EventType.DATA_EXPORTED]: {
        controlFamily: "CC6",
        controlNumber: "CC6.3",
        description: "Data Access",
      },
      [SOC2EventType.SENSITIVE_DATA_ACCESSED]: {
        controlFamily: "CC6",
        controlNumber: "CC6.3",
        description: "Data Access",
      },
      [SOC2EventType.CONFIG_CHANGED]: {
        controlFamily: "CC8",
        controlNumber: "CC8.1",
        description: "System Configuration",
      },
      [SOC2EventType.SECURITY_SETTING_CHANGED]: {
        controlFamily: "CC8",
        controlNumber: "CC8.1",
        description: "System Configuration",
      },
      [SOC2EventType.AUDIT_LOG_ACCESSED]: {
        controlFamily: "CC3",
        controlNumber: "CC3.4",
        description: "Audit Trail",
      },
      [SOC2EventType.AUDIT_EXPORT]: {
        controlFamily: "CC3",
        controlNumber: "CC3.4",
        description: "Audit Trail",
      },
    };

    return (
      contextMap[eventType] || {
        controlFamily: "CC",
        controlNumber: "General",
        description: "General Control",
      }
    );
  }

  private async persistLog(entry: LogEntry): Promise<void> {
    try {
      // In production, this would write to a logging service or database
      // For now, we'll use a simple database write
      console.log("Persisting log entry:", entry);
    } catch (_error) {
      console.error("Failed to persist log entry:", _error);
    }
  }

  private async persistSOC2Event(entry: SOC2LogEntry): Promise<void> {
    try {
      // SOC2-specific persistence logic
      console.log("Persisting SOC2 event:", entry);
    } catch (_error) {
      console.error("Failed to persist SOC2 event:", _error);
    }
  }

  private async persistAuditLog(
    entry: AuditLogEntry & { timestamp: string }
  ): Promise<void> {
    try {
      // Audit-specific persistence logic
      console.log("Persisting audit log:", entry);
    } catch (_error) {
      console.error("Failed to persist audit log:", _error);
    }
  }

  /**
   * Extract user context from request
   */
  async extractUserContext(request: NextRequest): Promise<{
    userId?: string;
    userRole?: string;
    ipAddress?: string;
    userAgent?: string;
  }> {
    try {
      const { _userId } = await auth();

      return {
        ...(userId && { _userId }),
        ipAddress:
          request.headers.get("x-forwarded-for")?.split(",")[0] ||
          request.headers.get("x-real-ip") ||
          "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      };
    } catch (_error) {
      return {
        ipAddress: "unknown",
        userAgent: "unknown",
      };
    }
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
