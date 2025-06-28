// lib/services/audit.service.ts - Non-blocking audit logging service
import {
  AuditAction,
  DataClassification,
  auditLogger,
} from "@/lib/security/audit/logger";

/**
 * Extracted audit service with non-blocking logging capabilities
 * Provides consistent audit logging across the application with performance optimization
 */
export class AuditService {
  /**
   * Log user access events in a non-blocking manner
   * @param authResult - Authentication result from Clerk
   * @param req - Request object
   * @returns Promise that resolves immediately (non-blocking)
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
   * @param req - Request object
   * @param reason - Reason for authentication failure
   * @param userInfo - Optional user information if available
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
   * Log role-based access denials
   * @param req - Request object
   * @param userRole - User's current role
   * @param requiredRole - Required role for access
   * @param userId - User ID if available
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
   * Extracts user role from authentication result
   * @param authResult - Authentication result from Clerk
   * @returns User role string
   */
  private static extractUserRole(authResult: any): string {
    // Use the same role extraction logic as the current middleware
    return (
      authResult.sessionClaims?.["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"] ||
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
   * Creates a standardized error context for audit logging
   * @param req - Request object
   * @param error - Error object or string
   * @returns Standardized error context
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