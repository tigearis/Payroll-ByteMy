import { handleApiError, createSuccessResponse } from "@/lib/shared/error-handling";
import { NextRequest, NextResponse } from "next/server";
import { logger, LogLevel, LogCategory, SOC2EventType } from "@/lib/logging";
import { z } from "zod";

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
      CREATE: SOC2EventType.DATA_ACCESSED,
      READ: SOC2EventType.DATA_ACCESSED,
      UPDATE: SOC2EventType.DATA_ACCESSED,
      DELETE: SOC2EventType.DATA_ACCESSED,
      EXPORT: SOC2EventType.DATA_EXPORTED,
      BULK_OPERATION: SOC2EventType.DATA_ACCESSED,
    };

    const eventType =
      eventTypeMap[validatedInput.action] || SOC2EventType.DATA_ACCESSED;

    // Log the audit event
    await logger.logSOC2Event(eventType, {
      level: LogLevel.INFO,
      category: LogCategory.SYSTEM_ACCESS,
      message: `${validatedInput.action} operation on ${validatedInput.resourceType}`,
      userId: validatedInput.userId,
      entityType: validatedInput.resourceType,
      entityId: validatedInput.resourceId,
      metadata: validatedInput.metadata,
      ipAddress: validatedInput.ipAddress,
      userAgent: validatedInput.userAgent,
    });

    return NextResponse.json({
      success: true,
      eventId: crypto.randomUUID(),
      message: "Audit event logged successfully",
    });
  } catch (error) {
    return handleApiError(error, "audit");
  }
}
