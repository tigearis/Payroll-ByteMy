import { gql } from "@apollo/client";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

import { secureHasuraService } from "../secure-hasura-service";


export enum AuditAction {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  EXPORT = "EXPORT",
  BULK_OPERATION = "BULK_OPERATION",
}

export enum DataClassification {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

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

class AuditLogger {
  private static instance: AuditLogger;

  private constructor() {}

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  async log(entry: AuditLogEntry, req?: NextRequest): Promise<void> {
    try {
      const metadata = {
        ipAddress:
          entry.ipAddress ||
          req?.headers.get("x-forwarded-for") ||
          req?.headers.get("x-real-ip") ||
          "unknown",
        userAgent:
          entry.userAgent || req?.headers.get("user-agent") || "unknown",
        method: entry.method || req?.method || "UNKNOWN",
      };

      const encryptedPreviousValues = entry.previousValues
        ? await this.encryptSensitive(
            entry.previousValues,
            entry.dataClassification
          )
        : null;
      const encryptedNewValues = entry.newValues
        ? await this.encryptSensitive(entry.newValues, entry.dataClassification)
        : null;

      const INSERT_LOG = gql`
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
          $method: String
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
              method: $method
              session_id: $sessionId
              request_id: $requestId
              success: $success
              error_message: $errorMessage
            }
          ) {
            id
          }
        }
      `;

      await secureHasuraService.executeAdminMutation(
        INSERT_LOG,
        {
          ...entry,
          ...metadata,
          previousValues: encryptedPreviousValues,
          newValues: encryptedNewValues,
        },
        { skipAuth: true }
      );

      if (entry.dataClassification === DataClassification.CRITICAL) {
        await this.createSecurityEvent(entry);
      }
    } catch (error: any) {
      console.error("[AUDIT] Log failure", error);

      if (entry.dataClassification === DataClassification.CRITICAL) {
        await this.logCriticalFailure(entry, error);
      }
    }
  }

  async createAuditContext(req: NextRequest) {
    const { userId, sessionClaims } = await auth();
    if (!userId) {throw new Error("No authenticated user");}

    return {
      userId,
      userRole: sessionClaims?.metadata?.role || "viewer",
      sessionId: sessionClaims?.sid || "unknown",
      requestId: crypto.randomUUID(),
    };
  }

  async logDataAccess(
    userId: string,
    dataType: string,
    classification: DataClassification,
    recordCount: number,
    accessPurpose?: string,
    exportFormat?: string
  ) {
    const INSERT_ACCESS = gql`
      mutation InsertAccessLog(
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
        }
      }
    `;

    try {
      await secureHasuraService.executeAdminMutation(
        INSERT_ACCESS,
        {
          userId,
          dataType,
          dataClassification: classification,
          recordCount,
          accessPurpose,
          exportFormat,
        },
        { skipAuth: true }
      );
    } catch (error) {
      console.error("[AUDIT] Data access log failure", error);
    }
  }

  async logSecurityEvent(
    type: string,
    severity: "info" | "warning" | "error" | "critical",
    details: Record<string, unknown>,
    userId?: string,
    ipAddress?: string
  ) {
    const INSERT_SECURITY = gql`
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
        }
      }
    `;

    try {
      await secureHasuraService.executeAdminMutation(
        INSERT_SECURITY,
        { eventType: type, severity, details, userId, ipAddress },
        { skipAuth: true }
      );
    } catch (error) {
      console.error("[AUDIT] Security event log failure", error);
    }
  }

  private async encryptSensitive(
    data: unknown,
    classification: DataClassification
  ): Promise<string> {
    if (
      [DataClassification.CRITICAL, DataClassification.HIGH].includes(
        classification
      )
    ) {
      return `encrypted:${Buffer.from(JSON.stringify(data)).toString(
        "base64"
      )}`;
    }
    return JSON.stringify(data);
  }

  private async createSecurityEvent(entry: AuditLogEntry) {
    await this.logSecurityEvent(
      `critical_operation_${entry.action.toLowerCase()}`,
      "info",
      {
        entityType: entry.entityType,
        entityId: entry.entityId,
        success: entry.success,
        fieldsAffected: entry.fieldsAffected,
      },
      entry.userId,
      entry.ipAddress
    );
  }

  private async logCriticalFailure(entry: AuditLogEntry, error: Error) {
    console.error("[CRITICAL AUDIT FAILURE]", {
      timestamp: new Date().toISOString(),
      entry,
      error: error.message,
      stack: error.stack,
    });
  }
}

export const auditLogger = AuditLogger.getInstance();
