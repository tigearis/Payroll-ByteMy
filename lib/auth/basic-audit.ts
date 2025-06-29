/**
 * Basic Audit Logging System
 * 
 * Simplified audit logging that replaces the complex SOC2 compliance system
 * with basic security event tracking.
 */

import { SimpleAuditEvent, SimpleAuditLog, createAuditLog } from "./simple-permissions";

// Audit log storage (in-memory for development, replace with database in production)
const auditLogs: SimpleAuditLog[] = [];

// Maximum number of logs to keep in memory
const MAX_LOGS = 1000;

/**
 * Configuration for audit logging
 */
export interface AuditConfig {
  enableConsoleLogging: boolean;
  enableFileLogging: boolean;
  enableDatabaseLogging: boolean;
  logLevel: "basic" | "detailed" | "debug";
  retentionDays: number;
}

const defaultConfig: AuditConfig = {
  enableConsoleLogging: process.env.NODE_ENV === "development",
  enableFileLogging: false,
  enableDatabaseLogging: false,
  logLevel: "basic",
  retentionDays: 30,
};

let auditConfig = { ...defaultConfig };

/**
 * Configure audit logging
 */
export function configureAudit(config: Partial<AuditConfig>) {
  auditConfig = { ...auditConfig, ...config };
}

/**
 * Log an audit event
 */
export function logAuditEvent(
  event: SimpleAuditEvent,
  details?: Record<string, any>
): void {
  const auditLog = createAuditLog(event, details);
  
  // Add to in-memory storage
  auditLogs.push(auditLog);
  
  // Keep only the most recent logs
  if (auditLogs.length > MAX_LOGS) {
    auditLogs.splice(0, auditLogs.length - MAX_LOGS);
  }
  
  // Console logging
  if (auditConfig.enableConsoleLogging) {
    const logLevel = getLogLevel(event);
    const message = formatAuditMessage(auditLog);
    
    switch (logLevel) {
      case "error":
        console.error("🚨 AUDIT:", message);
        break;
      case "warn":
        console.warn("⚠️ AUDIT:", message);
        break;
      case "info":
        console.info("ℹ️ AUDIT:", message);
        break;
      default:
        console.log("📋 AUDIT:", message);
    }
  }
  
  // File logging (if enabled)
  if (auditConfig.enableFileLogging) {
    // TODO: Implement file logging
    // appendToAuditFile(auditLog);
  }
  
  // Database logging (if enabled)
  if (auditConfig.enableDatabaseLogging) {
    // TODO: Implement database logging
    // saveToDatabase(auditLog);
  }
}

/**
 * Get log level for event type
 */
function getLogLevel(event: SimpleAuditEvent): "error" | "warn" | "info" | "debug" {
  switch (event) {
    case "auth_failed":
    case "access_denied":
      return "warn";
    case "role_changed":
    case "user_deleted":
      return "info";
    case "auth_login":
    case "auth_logout":
    case "user_created":
      return "info";
    default:
      return "debug";
  }
}

/**
 * Format audit message for logging
 */
function formatAuditMessage(auditLog: SimpleAuditLog): string {
  const { event, userId, userRole, timestamp, details } = auditLog;
  
  let message = `[${timestamp}] ${event.toUpperCase()}`;
  
  if (userId) {
    message += ` | User: ${userId}`;
  }
  
  if (userRole) {
    message += ` | Role: ${userRole}`;
  }
  
  if (details) {
    const detailsStr = Object.entries(details)
      .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
      .join(", ");
    
    if (detailsStr) {
      message += ` | ${detailsStr}`;
    }
  }
  
  return message;
}

/**
 * Get audit logs (for admin dashboard or debugging)
 */
export function getAuditLogs(options?: {
  limit?: number;
  event?: SimpleAuditEvent;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}): SimpleAuditLog[] {
  let filteredLogs = [...auditLogs];
  
  // Filter by event type
  if (options?.event) {
    filteredLogs = filteredLogs.filter(log => log.event === options.event);
  }
  
  // Filter by user ID
  if (options?.userId) {
    filteredLogs = filteredLogs.filter(log => log.userId === options.userId);
  }
  
  // Filter by date range
  if (options?.startDate) {
    filteredLogs = filteredLogs.filter(log => 
      new Date(log.timestamp) >= options.startDate!
    );
  }
  
  if (options?.endDate) {
    filteredLogs = filteredLogs.filter(log => 
      new Date(log.timestamp) <= options.endDate!
    );
  }
  
  // Sort by timestamp (newest first)
  filteredLogs.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Apply limit
  if (options?.limit) {
    filteredLogs = filteredLogs.slice(0, options.limit);
  }
  
  return filteredLogs;
}

/**
 * Get audit statistics
 */
export function getAuditStats(): {
  totalEvents: number;
  eventCounts: Record<SimpleAuditEvent, number>;
  recentActivity: SimpleAuditLog[];
  topUsers: Array<{ userId: string; eventCount: number }>;
} {
  const eventCounts = {} as Record<SimpleAuditEvent, number>;
  const userCounts = {} as Record<string, number>;
  
  // Count events by type and user
  auditLogs.forEach(log => {
    eventCounts[log.event] = (eventCounts[log.event] || 0) + 1;
    
    if (log.userId) {
      userCounts[log.userId] = (userCounts[log.userId] || 0) + 1;
    }
  });
  
  // Get top users by activity
  const topUsers = Object.entries(userCounts)
    .map(([userId, eventCount]) => ({ userId, eventCount }))
    .sort((a, b) => b.eventCount - a.eventCount)
    .slice(0, 10);
  
  // Get recent activity (last 24 hours)
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentActivity = auditLogs
    .filter(log => new Date(log.timestamp) >= yesterday)
    .slice(0, 20);
  
  return {
    totalEvents: auditLogs.length,
    eventCounts,
    recentActivity,
    topUsers,
  };
}

/**
 * Clear old audit logs (cleanup function)
 */
export function cleanupAuditLogs(): number {
  const cutoffDate = new Date(Date.now() - auditConfig.retentionDays * 24 * 60 * 60 * 1000);
  const originalLength = auditLogs.length;
  
  // Remove old logs
  for (let i = auditLogs.length - 1; i >= 0; i--) {
    if (new Date(auditLogs[i].timestamp) < cutoffDate) {
      auditLogs.splice(i, 1);
    }
  }
  
  const removedCount = originalLength - auditLogs.length;
  
  if (removedCount > 0) {
    logAuditEvent("user_deleted", {
      action: "audit_cleanup",
      removedCount,
      retentionDays: auditConfig.retentionDays,
    });
  }
  
  return removedCount;
}

/**
 * Security monitoring: detect suspicious patterns
 */
export function detectSuspiciousActivity(): {
  suspiciousUsers: Array<{ userId: string; reason: string; count: number }>;
  alerts: Array<{ type: string; message: string; timestamp: string }>;
} {
  const suspiciousUsers: Array<{ userId: string; reason: string; count: number }> = [];
  const alerts: Array<{ type: string; message: string; timestamp: string }> = [];
  
  // Get recent logs (last hour)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentLogs = auditLogs.filter(log => new Date(log.timestamp) >= oneHourAgo);
  
  // Count failed auth attempts by user
  const failedAttempts = {} as Record<string, number>;
  const accessDenied = {} as Record<string, number>;
  
  recentLogs.forEach(log => {
    if (log.event === "auth_failed" && log.userId) {
      failedAttempts[log.userId] = (failedAttempts[log.userId] || 0) + 1;
    }
    
    if (log.event === "access_denied" && log.userId) {
      accessDenied[log.userId] = (accessDenied[log.userId] || 0) + 1;
    }
  });
  
  // Flag users with too many failed attempts
  Object.entries(failedAttempts).forEach(([userId, count]) => {
    if (count >= 5) {
      suspiciousUsers.push({
        userId,
        reason: "Multiple failed auth attempts",
        count,
      });
      
      alerts.push({
        type: "security",
        message: `User ${userId} has ${count} failed auth attempts in the last hour`,
        timestamp: new Date().toISOString(),
      });
    }
  });
  
  // Flag users with too many access denied events
  Object.entries(accessDenied).forEach(([userId, count]) => {
    if (count >= 10) {
      suspiciousUsers.push({
        userId,
        reason: "Multiple access denied events",
        count,
      });
      
      alerts.push({
        type: "security",
        message: `User ${userId} has ${count} access denied events in the last hour`,
        timestamp: new Date().toISOString(),
      });
    }
  });
  
  return { suspiciousUsers, alerts };
}

/**
 * Export audit logs (for compliance or backup)
 */
export function exportAuditLogs(format: "json" | "csv" = "json"): string {
  if (format === "csv") {
    const headers = ["timestamp", "event", "userId", "userRole", "details"];
    const csvData = [
      headers.join(","),
      ...auditLogs.map(log => [
        log.timestamp,
        log.event,
        log.userId || "",
        log.userRole || "",
        JSON.stringify(log.details || {}),
      ].join(","))
    ];
    return csvData.join("\n");
  }
  
  return JSON.stringify(auditLogs, null, 2);
}

// Initialize cleanup interval (runs every hour)
if (typeof window === "undefined") { // Server-side only
  setInterval(() => {
    cleanupAuditLogs();
  }, 60 * 60 * 1000); // 1 hour
}

// Export configuration
export { auditConfig };