import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { secureHasuraService } from "../secure-hasura-service";
import { gql } from "@apollo/client";

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

// Audit logger class
export class AuditLogger {
  private static instance: AuditLogger;

  private constructor() {}

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  /**
   * Log an audit entry
   * @param entry Audit log entry data
   * @param request Optional NextRequest for extracting metadata
   */
  async log(entry: AuditLogEntry, request?: NextRequest): Promise<void> {
    try {
      // Extract additional metadata from request if available
      if (request) {
        entry.ipAddress = request.headers.get("x-forwarded-for") || 
                         request.headers.get("x-real-ip") || 
                         "unknown";
        entry.userAgent = request.headers.get("user-agent") || "unknown";
      }

      // Encrypt sensitive values if present
      const encryptedPreviousValues = entry.previousValues 
        ? await this.encryptSensitiveData(entry.previousValues, entry.dataClassification)
        : null;
      
      const encryptedNewValues = entry.newValues
        ? await this.encryptSensitiveData(entry.newValues, entry.dataClassification)
        : null;

      // Insert audit log entry
      const INSERT_AUDIT_LOG = gql`
        mutation InsertAuditLog(
          $userId: uuid!
          $userRole: user_role!
          $action: String!
          $entityType: String!
          $entityId: uuid
          $dataClassification: String!
          $fieldsAffected: jsonb
          $previousValues: String
          $newValues: String
          $ipAddress: String
          $userAgent: String
          $sessionId: String
          $requestId: String!
          $success: Boolean!
          $errorMessage: String
        ) {
          insert_audit_log_one(
            object: {
              user_id: $userId
              user_role: $userRole
              action: $action
              entity_type: $entityType
              entity_id: $entityId
              data_classification: $dataClassification
              fields_affected: $fieldsAffected
              previous_values: $previousValues
              new_values: $newValues
              ip_address: $ipAddress
              user_agent: $userAgent
              session_id: $sessionId
              request_id: $requestId
              success: $success
              error_message: $errorMessage
            }
          ) {
            id
            created_at
          }
        }
      `;

      await secureHasuraService.executeAdminMutation(
        INSERT_AUDIT_LOG,
        {
          userId: entry.userId,
          userRole: entry.userRole,
          action: entry.action,
          entityType: entry.entityType,
          entityId: entry.entityId,
          dataClassification: entry.dataClassification,
          fieldsAffected: entry.fieldsAffected,
          previousValues: encryptedPreviousValues,
          newValues: encryptedNewValues,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          sessionId: entry.sessionId,
          requestId: entry.requestId,
          success: entry.success,
          errorMessage: entry.errorMessage,
        },
        { skipAuth: true } // Audit logs should always be written
      );

      // For CRITICAL operations, also create a security event
      if (entry.dataClassification === DataClassification.CRITICAL) {
        await this.createSecurityEvent(entry);
      }
    } catch (error) {
      // Log audit failures to console - never fail silently
      console.error("[AUDIT] Failed to log audit entry:", error, entry);
      
      // For critical failures, attempt to write to a backup location
      if (entry.dataClassification === DataClassification.CRITICAL) {
        await this.logCriticalFailure(entry, error);
      }
    }
  }

  /**
   * Log a data access event for compliance
   */
  async logDataAccess(
    userId: string,
    dataType: string,
    dataClassification: DataClassification,
    recordCount: number,
    accessPurpose?: string,
    exportFormat?: string
  ): Promise<void> {
    try {
      const INSERT_DATA_ACCESS_LOG = gql`
        mutation InsertDataAccessLog(
          $userId: uuid!
          $dataType: String!
          $dataClassification: String!
          $recordCount: Int!
          $accessPurpose: String
          $exportFormat: String
        ) {
          insert_data_access_log_one(
            object: {
              user_id: $userId
              data_type: $dataType
              data_classification: $dataClassification
              record_count: $recordCount
              access_purpose: $accessPurpose
              export_format: $exportFormat
            }
          ) {
            id
            accessed_at
          }
        }
      `;

      await secureHasuraService.executeAdminMutation(
        INSERT_DATA_ACCESS_LOG,
        {
          userId,
          dataType,
          dataClassification,
          recordCount,
          accessPurpose,
          exportFormat,
        },
        { skipAuth: true }
      );
    } catch (error) {
      console.error("[AUDIT] Failed to log data access:", error);
    }
  }

  /**
   * Log a security event
   */
  async logSecurityEvent(
    eventType: string,
    severity: "info" | "warning" | "error" | "critical",
    details: any,
    userId?: string,
    ipAddress?: string
  ): Promise<void> {
    try {
      const INSERT_SECURITY_EVENT = gql`
        mutation InsertSecurityEvent(
          $eventType: String!
          $severity: String!
          $details: jsonb!
          $userId: uuid
          $ipAddress: String
        ) {
          insert_security_event_log_one(
            object: {
              event_type: $eventType
              severity: $severity
              details: $details
              user_id: $userId
              ip_address: $ipAddress
              resolved: false
            }
          ) {
            id
            created_at
          }
        }
      `;

      await secureHasuraService.executeAdminMutation(
        INSERT_SECURITY_EVENT,
        {
          eventType,
          severity,
          details,
          userId,
          ipAddress,
        },
        { skipAuth: true }
      );
    } catch (error) {
      console.error("[AUDIT] Failed to log security event:", error);
    }
  }

  /**
   * Create audit context from request
   */
  async createAuditContext(request: NextRequest): Promise<{
    userId: string;
    userRole: string;
    sessionId: string;
    requestId: string;
  }> {
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      throw new Error("No authenticated user for audit context");
    }

    return {
      userId,
      userRole: sessionClaims?.metadata?.role || "viewer",
      sessionId: sessionClaims?.sid || "unknown",
      requestId: crypto.randomUUID(),
    };
  }

  /**
   * Encrypt sensitive data based on classification
   */
  private async encryptSensitiveData(
    data: any,
    classification: DataClassification
  ): Promise<string> {
    // For CRITICAL and HIGH data, encrypt before storage
    if (
      classification === DataClassification.CRITICAL ||
      classification === DataClassification.HIGH
    ) {
      // In production, use proper encryption service
      // This is a placeholder for the encryption logic
      const encrypted = Buffer.from(JSON.stringify(data)).toString("base64");
      return `encrypted:${encrypted}`;
    }
    
    return JSON.stringify(data);
  }

  /**
   * Create security event for critical operations
   */
  private async createSecurityEvent(entry: AuditLogEntry): Promise<void> {
    await this.logSecurityEvent(
      `critical_operation_${entry.action.toLowerCase()}`,
      "info",
      {
        entityType: entry.entityType,
        entityId: entry.entityId,
        fieldsAffected: entry.fieldsAffected,
        success: entry.success,
      },
      entry.userId,
      entry.ipAddress
    );
  }

  /**
   * Log critical failures to backup location
   */
  private async logCriticalFailure(entry: AuditLogEntry, error: any): Promise<void> {
    // In production, this would write to a backup audit store
    // For now, log to console with structured format
    console.error("[CRITICAL AUDIT FAILURE]", {
      timestamp: new Date().toISOString(),
      entry,
      error: error.message,
      stack: error.stack,
    });
  }
}

// Export singleton instance
export const auditLogger = AuditLogger.getInstance();

// Audit decorator for methods
export function Audited(
  action: AuditAction,
  entityType: string,
  dataClassification: DataClassification
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const requestId = crypto.randomUUID();
      const startTime = Date.now();
      let success = false;
      let errorMessage: string | undefined;

      try {
        const result = await originalMethod.apply(this, args);
        success = true;
        
        // Log successful operation
        await auditLogger.log({
          userId: this.userId || "system",
          userRole: this.userRole || "system",
          action,
          entityType,
          dataClassification,
          requestId,
          success,
        });
        
        return result;
      } catch (error: any) {
        errorMessage = error.message;
        
        // Log failed operation
        await auditLogger.log({
          userId: this.userId || "system",
          userRole: this.userRole || "system",
          action,
          entityType,
          dataClassification,
          requestId,
          success: false,
          errorMessage,
        });
        
        throw error;
      }
    };

    return descriptor;
  };
}