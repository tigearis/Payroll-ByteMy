// lib/services/audit.service.ts - Non-blocking audit logging service
import {
  AuditAction,
  DataClassification,
  auditLogger,
} from "@/lib/security/audit/logger";

/**
 * Enterprise-grade audit service with SOC2-compliant non-blocking logging
 * 
 * Provides comprehensive audit logging across the application with performance optimization.
 * Integrated with enhanced middleware for complete authentication and authorization tracking.
 * 
 * Features:
 * - Non-blocking Promise-based logging for optimal performance
 * - SOC2-compliant audit trails with data classification
 * - Comprehensive error handling and silent failure recovery
 * - IP address and user agent tracking for security analysis
 * - Middleware integration for authentication events
 * 
 * @author Claude Code (2025-06-28) - Enhanced middleware integration
 * @see middleware.ts - Primary consumer for authentication audit logging
 * @see /lib/security/audit/logger.ts - Core audit logging infrastructure
 */
export class AuditService {
  /**
   * Log successful user access events in a non-blocking manner
   * 
   * Called by middleware for all successful route access attempts.
   * Provides comprehensive audit trail for SOC2 compliance.
   * 
   * @param authResult - Authentication result from Clerk middleware
   * @param req - Request object from Next.js middleware
   * @returns Promise that resolves immediately (non-blocking for performance)
   */
  static async logAccess(authResult: any, req: Request): Promise<void> {
    if (!this.shouldLog(req) || !authResult?.userId) {
      return;
    }

    // Non-blocking async execution
    Promise.resolve().then(async () => {
      try {
        await auditLogger.logAuditEvent({
          userId: authResult.userId,
          userRole: this.extractUserRole(authResult),
          action: AuditAction.READ,
          entityType: this.getEntityType(req),
          entityId: new URL(req.url).pathname,
          dataClassification: DataClassification.LOW,
          requestId: crypto.randomUUID(),
          success: true,
          method: req.method,
          userAgent: req.headers.get("user-agent")?.substring(0, 100) || "unknown",
          ipAddress: this.extractIpAddress(req),
        });
      } catch (err) {
        console.error("[AUDIT] Failed to log middleware access:", err);
      }
    }).catch(err => {
      // Silent catch to prevent unhandled promise rejection
      console.error("[AUDIT] Silent audit logging error:", err);
    });
  }

  /**
   * Log authentication failures for security monitoring
   * 
   * Called by middleware when authentication fails or unexpected errors occur.
   * Critical for SOC2 compliance and security incident detection.
   * 
   * @param req - Request object from Next.js middleware
   * @param reason - Specific reason for authentication failure
   * @param userInfo - Optional user information if available (for partial auth failures)
   */
  static async logAuthFailure(
    req: Request, 
    reason: string, 
    userInfo?: { userId?: string; role?: string }
  ): Promise<void> {
    Promise.resolve().then(async () => {
      try {
        await auditLogger.logAuditEvent({
          userId: userInfo?.userId || "anonymous",
          userRole: userInfo?.role || "unknown",
          action: AuditAction.READ,
          entityType: "auth_failure",
          entityId: new URL(req.url).pathname,
          dataClassification: DataClassification.HIGH, // Security events are high classification
          requestId: crypto.randomUUID(),
          success: false,
          method: req.method,
          userAgent: req.headers.get("user-agent")?.substring(0, 100) || "unknown",
          ipAddress: this.extractIpAddress(req),
          errorMessage: reason,
        });
      } catch (err) {
        console.error("[AUDIT] Failed to log auth failure:", err);
      }
    }).catch(err => {
      console.error("[AUDIT] Silent auth failure logging error:", err);
    });
  }

  /**
   * Log role-based access denials for authorization tracking
   * 
   * Called by middleware when authenticated users attempt to access routes
   * requiring higher role privileges. Essential for security monitoring.
   * 
   * @param req - Request object from Next.js middleware
   * @param userRole - User's current role from JWT claims
   * @param requiredRole - Minimum required role for the requested route
   * @param userId - Authenticated user ID from Clerk
   */
  static async logAccessDenied(
    req: Request,
    userRole: string,
    requiredRole: string,
    userId?: string
  ): Promise<void> {
    Promise.resolve().then(async () => {
      try {
        await auditLogger.logAuditEvent({
          userId: userId || "anonymous",
          userRole: userRole,
          action: AuditAction.READ,
          entityType: "access_denied",
          entityId: new URL(req.url).pathname,
          dataClassification: DataClassification.HIGH,
          requestId: crypto.randomUUID(),
          success: false,
          method: req.method,
          userAgent: req.headers.get("user-agent")?.substring(0, 100) || "unknown",
          ipAddress: this.extractIpAddress(req),
          errorMessage: `insufficient_role_privileges: ${userRole} < ${requiredRole}`,
        });
      } catch (err) {
        console.error("[AUDIT] Failed to log access denial:", err);
      }
    }).catch(err => {
      console.error("[AUDIT] Silent access denial logging error:", err);
    });
  }

  // ================================
  // PRIVATE HELPER METHODS
  // ================================

  /**
   * Determines if a request should be logged
   * @param req - Request object
   * @returns True if the request should be audited
   */
  private static shouldLog(req: Request): boolean {
    const url = new URL(req.url);
    const pathname = url.pathname;
    
    // Skip logging for static assets and system routes
    return !pathname.includes("_next") && 
           !pathname.includes("favicon") &&
           !pathname.includes(".css") &&
           !pathname.includes(".js") &&
           !pathname.includes(".ico") &&
           !pathname.includes(".png") &&
           !pathname.includes(".jpg") &&
           !pathname.includes(".svg");
  }

  /**
   * Determines the entity type based on the request URL
   * @param req - Request object
   * @returns Entity type string
   */
  private static getEntityType(req: Request): string {
    const pathname = new URL(req.url).pathname;
    
    if (pathname.startsWith("/api")) {
      return "api_route";
    }
    
    return "page_route";
  }

  /**
   * Extracts user role from authentication result using standardized JWT claims
   * 
   * Updated (2025-06-28) to match middleware role extraction pattern for consistency.
   * Uses the same JWT claim structure as the enhanced middleware implementation.
   * 
   * @param authResult - Authentication result from Clerk middleware
   * @returns User role string from Hasura JWT claims
   */
  private static extractUserRole(authResult: any): string {
    // Consistent with middleware.ts role extraction pattern
    return (
      authResult.sessionClaims?.["x-hasura-default-role"] ||
      authResult.sessionClaims?.metadata?.role ||
      "unknown"
    );
  }

  /**
   * Extracts IP address from request headers
   * @param req - Request object
   * @returns IP address string
   */
  private static extractIpAddress(req: Request): string {
    return (
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown"
    );
  }

  /**
   * Creates a standardized error context for comprehensive audit logging
   * 
   * Utility method for consistent error context across the application.
   * Used by middleware and other services for detailed error tracking.
   * 
   * @param req - Request object from middleware or API handlers
   * @param error - Error object or string to be logged
   * @returns Standardized error context with security-relevant information
   */
  static createErrorContext(req: Request, error: any) {
    return {
      url: req.url,
      method: req.method,
      userAgent: req.headers.get("user-agent")?.substring(0, 100),
      ipAddress: this.extractIpAddress(req),
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 500), // Truncate stack traces
      } : String(error),
    };
  }
}