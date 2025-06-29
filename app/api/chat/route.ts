// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/api-auth";
import {
  auditLogger,
  LogLevel,
  LogCategory,
  SOC2EventType,
} from "@/lib/security/audit/logger";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Secure AI chat endpoint with authentication
export const POST = withAuth(
  async (req: NextRequest, session): Promise<NextResponse> => {
    // Extract client info once for both success and error logging
    const clientInfo = auditLogger.extractClientInfo(req);

    try {
      // Log AI chat usage
      await auditLogger.logSOC2Event({
        level: LogLevel.INFO,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.DATA_VIEWED,
        userId: session.userId,
        userRole: session.role,
        resourceType: "ai_chat",
        action: "ACCESS",
        success: true,
        ipAddress: clientInfo.ipAddress || "unknown",
        userAgent: clientInfo.userAgent || "unknown",
        complianceNote: "AI chat assistant accessed",
      });

      const { messages } = await req.json();

      const result = streamText({
        model: openai("gpt-4-turbo"),
        system: `You are an AI assistant for a payroll management system called Payroll Matrix. 
          You can provide information about the system's features, help with calculations, and generate 
          simple charts and tables when requested. To create a chart or table, output the data in JSON 
          format wrapped in \`\`\`chart or \`\`\`table code blocks.
          
          IMPORTANT: You are assisting user ${session.userId} with role ${session.role}. 
          Only provide information and features appropriate for their role level.`,
        messages,
      });

      return result.toDataStreamResponse() as any;
    } catch (error: any) {
      console.error("AI Chat error:", error);

      await auditLogger.logSOC2Event({
        level: LogLevel.ERROR,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.DATA_VIEWED,
        userId: session.userId,
        userRole: session.role,
        resourceType: "ai_chat",
        action: "ACCESS",
        success: false,
        errorMessage: error.message,
        metadata: {
          errorStack: error.stack,
        },
        ipAddress: clientInfo.ipAddress || "unknown",
        userAgent: clientInfo.userAgent || "unknown",
        complianceNote: "AI chat request failed",
      });

      throw error;
    }
  },
  {
    requiredRole: "viewer", // All authenticated users can use chat
  }
);
