import { headers } from "next/headers";
import { clerkClient } from "@clerk/nextjs";
import { Redis } from "@upstash/redis";
import {
  AuditEvent,
  AuditEventType,
  AuditContext,
  AuditResource,
  createAuditEvent,
} from "../types/audit.types";
import { DataClassificationLevel } from "../types/security.types";

export class EnhancedAuditService {
  private redis: Redis;
  private readonly AUDIT_LOG_KEY = "audit_logs";
  private readonly RETENTION_DAYS = 90; // 90 days retention

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }

  private async getAuditContext(userId: string): Promise<AuditContext> {
    try {
      const user = await clerkClient.users.getUser(userId);
      const headersList = headers();

      return {
        userId,
        sessionId: headersList.get("x-session-id") || undefined,
        ipAddress: headersList.get("x-forwarded-for") || undefined,
        userAgent: headersList.get("user-agent") || undefined,
        roles: (user.publicMetadata.roles as string[]) || [],
        permissions: (user.publicMetadata.permissions as string[]) || [],
      };
    } catch (error) {
      console.error("Error creating audit context:", error);
      return { userId };
    }
  }

  private async storeAuditEvent(event: AuditEvent): Promise<void> {
    try {
      // Store the event in Redis with expiration
      const key = `${this.AUDIT_LOG_KEY}:${event.id}`;
      await this.redis.set(key, JSON.stringify(event), {
        ex: this.RETENTION_DAYS * 24 * 60 * 60, // Convert days to seconds
      });

      // Add to time-series index
      await this.redis.zadd(
        `${this.AUDIT_LOG_KEY}:timeline`,
        event.timestamp.getTime(),
        event.id
      );

      // Add to user index
      await this.redis.sadd(
        `${this.AUDIT_LOG_KEY}:user:${event.context.userId}`,
        event.id
      );

      // Add to resource index
      await this.redis.sadd(
        `${this.AUDIT_LOG_KEY}:resource:${event.resource.type}:${event.resource.id}`,
        event.id
      );

      // Add to event type index
      await this.redis.sadd(
        `${this.AUDIT_LOG_KEY}:type:${event.eventType}`,
        event.id
      );

      // If critical or error severity, add to alerts index
      if (["CRITICAL", "ERROR"].includes(event.severity)) {
        await this.redis.sadd(`${this.AUDIT_LOG_KEY}:alerts`, event.id);
      }
    } catch (error) {
      console.error("Error storing audit event:", error);
      throw error;
    }
  }

  async logReportGeneration(
    userId: string,
    reportId: string,
    config: any,
    result?: { success: boolean; error?: string }
  ): Promise<void> {
    const context = await this.getAuditContext(userId);
    const resource: AuditResource = {
      type: "REPORT",
      id: reportId,
      classification: this.getHighestClassification(config),
    };

    const event = createAuditEvent(
      "REPORT_GENERATED",
      context,
      resource,
      {
        config,
        domains: config.domains,
        fieldCount: Object.values(config.fields).reduce(
          (acc: number, fields: any) => acc + fields.length,
          0
        ),
        success: result?.success ?? true,
        error: result?.error,
      },
      {
        severity: result?.error ? "ERROR" : "INFO",
      }
    );

    await this.storeAuditEvent(event);
  }

  async logFieldAccess(
    userId: string,
    domain: string,
    field: string,
    classification: DataClassificationLevel,
    granted: boolean,
    reason?: string
  ): Promise<void> {
    const context = await this.getAuditContext(userId);
    const resource: AuditResource = {
      type: "FIELD",
      id: `${domain}.${field}`,
      domain,
      classification,
    };

    const event = createAuditEvent(
      granted ? "FIELD_ACCESS_GRANTED" : "FIELD_ACCESS_DENIED",
      context,
      resource,
      {
        granted,
        reason,
      },
      {
        severity: !granted && classification === "CRITICAL" ? "ERROR" : "INFO",
      }
    );

    await this.storeAuditEvent(event);
  }

  async logTemplateAction(
    userId: string,
    action: "CREATED" | "UPDATED" | "DELETED" | "SHARED",
    templateId: string,
    details: any
  ): Promise<void> {
    const context = await this.getAuditContext(userId);
    const resource: AuditResource = {
      type: "TEMPLATE",
      id: templateId,
      name: details.name,
    };

    const eventType: AuditEventType = `TEMPLATE_${action}` as AuditEventType;

    const event = createAuditEvent(eventType, context, resource, details);

    await this.storeAuditEvent(event);
  }

  async logSecurityPolicyUpdate(userId: string, changes: any): Promise<void> {
    const context = await this.getAuditContext(userId);
    const resource: AuditResource = {
      type: "SECURITY_POLICY",
      id: "global",
    };

    const event = createAuditEvent(
      "SECURITY_POLICY_UPDATED",
      context,
      resource,
      changes,
      {
        severity: "WARNING",
      }
    );

    await this.storeAuditEvent(event);
  }

  async logSystemEvent(
    eventType: Extract<
      AuditEventType,
      | "CACHE_CLEARED"
      | "BACKGROUND_JOB_STARTED"
      | "BACKGROUND_JOB_COMPLETED"
      | "BACKGROUND_JOB_FAILED"
    >,
    details: any
  ): Promise<void> {
    const resource: AuditResource = {
      type: "SYSTEM",
      id: "system",
    };

    const event = createAuditEvent(
      eventType,
      { userId: "system" },
      resource,
      details,
      {
        severity: eventType === "BACKGROUND_JOB_FAILED" ? "ERROR" : "INFO",
      }
    );

    await this.storeAuditEvent(event);
  }

  private getHighestClassification(config: any): DataClassificationLevel {
    // TODO: Implement logic to determine highest classification level
    // from the fields being accessed
    return "LOW";
  }

  // Query methods
  async getAuditEvents(options: {
    userId?: string;
    resourceType?: string;
    resourceId?: string;
    eventType?: AuditEventType;
    severity?: string;
    startTime?: Date;
    endTime?: Date;
    limit?: number;
    offset?: number;
  }): Promise<AuditEvent[]> {
    // TODO: Implement query logic using Redis indexes
    return [];
  }

  async getAuditEventById(eventId: string): Promise<AuditEvent | null> {
    const key = `${this.AUDIT_LOG_KEY}:${eventId}`;
    const eventData = await this.redis.get<string>(key);
    return eventData ? JSON.parse(eventData) : null;
  }

  async getRelatedEvents(eventId: string): Promise<AuditEvent[]> {
    const event = await this.getAuditEventById(eventId);
    if (!event?.relatedEvents?.length) return [];

    const events = await Promise.all(
      event.relatedEvents.map(id => this.getAuditEventById(id))
    );

    return events.filter((e): e is AuditEvent => e !== null);
  }

  async getAlertsCount(): Promise<number> {
    return this.redis.scard(`${this.AUDIT_LOG_KEY}:alerts`);
  }

  async clearOldEvents(): Promise<void> {
    // TODO: Implement cleanup of old audit events
    // This would typically run as a scheduled job
  }
}
