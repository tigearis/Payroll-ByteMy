import { z } from "zod";
import { DataClassificationLevelSchema } from "./security.types";

export const AuditEventTypeSchema = z.enum([
  // Report Events
  "REPORT_GENERATED",
  "REPORT_DOWNLOADED",
  "REPORT_SHARED",
  "REPORT_DELETED",

  // Template Events
  "TEMPLATE_CREATED",
  "TEMPLATE_UPDATED",
  "TEMPLATE_DELETED",
  "TEMPLATE_SHARED",

  // Security Events
  "SECURITY_POLICY_UPDATED",
  "FIELD_ACCESS_DENIED",
  "FIELD_ACCESS_GRANTED",
  "DATA_MASKED",

  // User Events
  "USER_LOGIN",
  "USER_LOGOUT",
  "MFA_ENABLED",
  "MFA_DISABLED",

  // System Events
  "CACHE_CLEARED",
  "BACKGROUND_JOB_STARTED",
  "BACKGROUND_JOB_COMPLETED",
  "BACKGROUND_JOB_FAILED",
]);

export const AuditSeveritySchema = z.enum([
  "INFO",
  "WARNING",
  "ERROR",
  "CRITICAL",
]);

export const AuditContextSchema = z.object({
  userId: z.string(),
  sessionId: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  roles: z.array(z.string()).optional(),
  permissions: z.array(z.string()).optional(),
});

export const AuditResourceSchema = z.object({
  type: z.enum([
    "REPORT",
    "TEMPLATE",
    "FIELD",
    "SECURITY_POLICY",
    "USER",
    "SYSTEM",
  ]),
  id: z.string(),
  name: z.string().optional(),
  classification: DataClassificationLevelSchema.optional(),
  domain: z.string().optional(),
});

export const AuditEventSchema = z.object({
  id: z.string(),
  timestamp: z.date(),
  eventType: AuditEventTypeSchema,
  severity: AuditSeveritySchema,
  context: AuditContextSchema,
  resource: AuditResourceSchema,
  details: z.record(z.string(), z.any()),
  metadata: z.record(z.string(), z.any()).optional(),
  relatedEvents: z.array(z.string()).optional(),
});

// Export types
export type AuditEventType = z.infer<typeof AuditEventTypeSchema>;
export type AuditSeverity = z.infer<typeof AuditSeveritySchema>;
export type AuditContext = z.infer<typeof AuditContextSchema>;
export type AuditResource = z.infer<typeof AuditResourceSchema>;
export type AuditEvent = z.infer<typeof AuditEventSchema>;

// Helper functions
export function createAuditEvent(
  eventType: AuditEventType,
  context: AuditContext,
  resource: AuditResource,
  details: Record<string, any>,
  options: Partial<AuditEvent> = {}
): AuditEvent {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    eventType,
    severity: "INFO",
    context,
    resource,
    details,
    ...options,
  };
}
