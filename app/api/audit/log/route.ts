import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  auditLogger,
  SOC2EventType,
  LogLevel,
  LogCategory,
} from "@/lib/security/audit/logger";

// Input validation schema
const auditEventSchema = z.object({
  userId: z.string().uuid(),
  action: z.string(),
  resourceType: z.string(),
  resourceId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Verify this is coming from Hasura
    const hasuraSecret = request.headers.get("x-hasura-admin-secret");
    if (hasuraSecret !== process.env.HASURA_GRAPHQL_ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const { input } = body;

    const validatedInput = auditEventSchema.parse(input.event);

    // Map action to SOC2 event type
    const eventTypeMap: Record<string, SOC2EventType> = {
      CREATE: SOC2EventType.USER_CREATED,
      READ: SOC2EventType.DATA_VIEWED,
      UPDATE: SOC2EventType.USER_UPDATED,
      DELETE: SOC2EventType.USER_DELETED,
      EXPORT: SOC2EventType.SENSITIVE_DATA_EXPORT,
      BULK_OPERATION: SOC2EventType.BULK_DATA_ACCESS,
    };

    const eventType =
      eventTypeMap[validatedInput.action] || SOC2EventType.DATA_VIEWED;

    // Log the audit event
    const logEntry: any = {
      level: LogLevel.INFO,
      category: LogCategory.SYSTEM_ACCESS,
      eventType,
      userId: validatedInput.userId,
      resourceType: validatedInput.resourceType,
      action: validatedInput.action,
      success: true,
      metadata: validatedInput.metadata,
      ipAddress: validatedInput.ipAddress || "unknown",
      userAgent: validatedInput.userAgent || "unknown",
      complianceNote: `${validatedInput.action} operation on ${validatedInput.resourceType}`,
    };

    if (validatedInput.resourceId) {
      logEntry.resourceId = validatedInput.resourceId;
    }

    await auditLogger.logSOC2Event(logEntry);

    return NextResponse.json({
      success: true,
      eventId: crypto.randomUUID(),
      message: "Audit event logged successfully",
    });
  } catch (error: any) {
    console.error("[Audit API] Error logging event:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to log audit event",
      },
      { status: 500 }
    );
  }
}
