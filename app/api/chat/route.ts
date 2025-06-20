// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { NextRequest, NextResponse } from "next/server"

import { withAuth } from "@/lib/api-auth"
import { soc2Logger, LogLevel, LogCategory, SOC2EventType } from "@/lib/logging/soc2-logger"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Secure AI chat endpoint with authentication
export const POST = withAuth(async (req: NextRequest, session): Promise<NextResponse> => {
  try {
    // Log AI chat usage
    await soc2Logger.log({
      level: LogLevel.INFO,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
      message: "AI chat assistant accessed",
      userId: session.userId,
      userRole: session.role,
      entityType: "ai_chat"
    }, req);

    const { messages } = await req.json()

    const result = streamText({
      model: openai("gpt-4-turbo"),
      system: `You are an AI assistant for a payroll management system called Payroll Matrix. 
          You can provide information about the system's features, help with calculations, and generate 
          simple charts and tables when requested. To create a chart or table, output the data in JSON 
          format wrapped in \`\`\`chart or \`\`\`table code blocks.
          
          IMPORTANT: You are assisting user ${session.userId} with role ${session.role}. 
          Only provide information and features appropriate for their role level.`,
      messages,
    })

    return result.toDataStreamResponse() as any
  } catch (error: any) {
    console.error("AI Chat error:", error);
    
    await soc2Logger.log({
      level: LogLevel.ERROR,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
      message: "AI chat request failed",
      userId: session.userId,
      userRole: session.role,
      errorDetails: {
        message: error.message,
        stack: error.stack
      }
    }, req);

    throw error;
  }
}, {
  requiredRole: "viewer" // All authenticated users can use chat
})