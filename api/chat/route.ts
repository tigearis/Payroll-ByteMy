import { handleApiError, createSuccessResponse } from "@/lib/shared/error-handling";
// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { logger, SOC2EventType, LogLevel, LogCategory } from "@/lib/logging";
import { withEnhancedAuth } from "@/lib/auth/enhanced-api-auth";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Secure AI chat endpoint with authentication
export const POST = withEnhancedAuth(
  async (req: NextRequest, context): Promise<NextResponse> => {
    try {
      // Log AI chat usage
      await logger.logSOC2Event(SOC2EventType.DATA_ACCESSED, {
        level: LogLevel.INFO,
        category: LogCategory.SYSTEM_ACCESS,
        message: "AI chat request",
        userId: context.userId,
        userRole: context.userRole,
        metadata: {
          requestType: "AI chat",
        },
      });

      const { messages } = await req.json();

      const result = streamText({
        model: openai("gpt-4-turbo"),
        system: `You are an AI assistant for a payroll management system called Payroll Matrix. 
          You can provide information about the system's features, help with calculations, and generate 
          simple charts and tables when requested. To create a chart or table, output the data in JSON 
          format wrapped in \`\`\`chart or \`\`\`table code blocks.
          
          IMPORTANT: You are assisting user ${context.userId} with role ${context.userRole}. 
          Only provide information and features appropriate for their role level.`,
        messages,
      });

      return result.toDataStreamResponse() as any;
    } catch (error: any) {
      console.error("AI Chat error:", error);

      await logger.logSOC2Event(SOC2EventType.DATA_ACCESSED, {
        level: LogLevel.ERROR,
        category: LogCategory.SYSTEM_ACCESS,
        message: "AI chat error",
        userId: context.userId,
        userRole: context.userRole,
        metadata: {
          error: error.message,
        },
      });

      throw error;
    }
  },
  {
    minimumRole: "viewer", // All authenticated users can use chat
  }
);
