/**
 * AI Assistant Chat API Endpoint
 *
 * Main endpoint for conversational AI assistance with comprehensive security
 */

import { auth } from "@clerk/nextjs/server";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { NextRequest, NextResponse } from "next/server";
import { contextExtractor } from "@/lib/ai/context-extractor";
import { AIInputValidator } from "@/lib/ai/input-validator";
import { langChainService, type BaseMessage } from "@/lib/ai/langchain-service";
import { AIRateLimiter } from "@/lib/ai/rate-limiter";

// Initialize rate limiter
const rateLimiter = new AIRateLimiter();

interface ChatRequest {
  message: string;
  conversationHistory?: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }>;
  context?: {
    pathname?: string;
    searchParams?: Record<string, string>;
    pageData?: Record<string, any>;
  };
}

interface ChatResponse {
  response: string;
  conversationId: string;
  metadata: {
    model: string;
    tokensUsed: number;
    responseTime: number;
    riskLevel: string;
  };
  rateLimitInfo: {
    remaining: number;
    resetTime: number;
  };
}

/**
 * POST /api/ai-assistant/chat
 *
 * Process chat messages with the AI assistant
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // 1. Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // 2. Role-based access control
    const userRole = request.headers.get("x-user-role") || "viewer";
    const allowedRoles = ["developer", "org_admin", "manager"];
    
    if (!allowedRoles.includes(userRole)) {
      await logSecurityEvent({
        type: "AI_ACCESS_DENIED",
        userId,
        userRole,
        endpoint: "/api/ai-assistant/chat",
        timestamp: new Date(),
        requestId: request.headers.get("x-request-id"),
      });
      
      return NextResponse.json(
        { 
          error: "AI assistant access requires elevated permissions",
          requiredRoles: allowedRoles,
          currentRole: userRole
        },
        { status: 403 }
      );
    }

    // 3. Rate limiting check
    const rateLimitResult = await rateLimiter.checkRateLimit(userId, 'chat', userRole);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait before sending another message.",
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
          rateLimitInfo: {
            remaining: rateLimitResult.remaining,
            resetTime: rateLimitResult.resetTime
          }
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      );
    }

    // 4. Parse and validate request body
    const body: ChatRequest = await request.json();
    const { message, conversationHistory = [], context = {} } = body;

    // 5. Input validation and security scanning
    const validationResult = AIInputValidator.validateInput(message, {
      userId,
      userRole,
      endpoint: "/api/ai-assistant/chat"
    });

    if (!validationResult.isValid) {
      await logSecurityEvent({
        type: "AI_INPUT_REJECTED",
        userId,
        userRole,
        riskLevel: validationResult.riskLevel,
        violations: validationResult.violations,
        inputLength: message.length,
        timestamp: new Date(),
        requestId: request.headers.get("x-request-id"),
      });

      return NextResponse.json(
        {
          error: "Message contains suspicious content and has been rejected",
          violations: validationResult.violations,
          riskLevel: validationResult.riskLevel
        },
        { status: 400 }
      );
    }

    // 6. Extract secure context
    const extractedContext = contextExtractor.extractContext({
      pathname: context.pathname || "/dashboard",
      searchParams: context.searchParams
        ? new URLSearchParams(context.searchParams)
        : new URLSearchParams(),
      ...(context.pageData !== undefined && { pageData: context.pageData }),
      userContext: {
        userId,
        userRole,
      },
    });

    // 7. Generate AI response
    const historyMessages: BaseMessage[] = conversationHistory.map(msg => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      } else {
        return new AIMessage(msg.content);
      }
    });

    const response = await langChainService.chat(
      validationResult.sanitizedInput!,
      historyMessages,
      {
        userId,
        userRole,
        currentPage: extractedContext.page.title,
      }
    );

    // 8. Validate AI response for data leakage
    const responseValidation = AIInputValidator.validateInput(response, {
      userId,
      userRole: 'ai_assistant',
      endpoint: "/api/ai-assistant/chat/response"
    });

    if (!responseValidation.isValid && responseValidation.riskLevel === 'critical') {
      // If AI response contains critical issues, sanitize it
      await logSecurityEvent({
        type: "AI_RESPONSE_SANITIZED",
        userId,
        userRole,
        violations: responseValidation.violations,
        responseLength: response.length,
        timestamp: new Date(),
        requestId: request.headers.get("x-request-id"),
      });
    }

    const responseTime = Date.now() - startTime;

    // 9. Log successful interaction
    await logAIInteraction({
      userId,
      userRole,
      messageLength: message.length,
      responseLength: response.length,
      responseTime,
      riskLevel: validationResult.riskLevel,
      context: extractedContext.page,
      success: true,
      tokensUsed: response.length / 4, // Rough estimate
    });

    // 10. Get updated rate limit info
    const quotaInfo = await rateLimiter.getRemainingQuota(userId, 'chat');

    const chatResponse: ChatResponse = {
      response: responseValidation.sanitizedInput || response,
      conversationId: `conv_${userId}_${Date.now()}`,
      metadata: {
        model: "langchain-ollama",
        tokensUsed: Math.ceil(response.length / 4),
        responseTime,
        riskLevel: validationResult.riskLevel,
      },
      rateLimitInfo: {
        remaining: quotaInfo.remaining,
        resetTime: quotaInfo.resetTime
      }
    };

    return NextResponse.json(chatResponse, {
      headers: {
        'X-RateLimit-Remaining': quotaInfo.remaining.toString(),
        'X-RateLimit-Reset': quotaInfo.resetTime.toString(),
        'X-Content-Risk-Level': validationResult.riskLevel,
      }
    });

  } catch (error) {
    console.error("AI Chat API Error:", error);

    // Log error for monitoring
    const { userId: errorUserId } = await auth().catch(() => ({ userId: null }));
    await logSecurityEvent({
      type: "AI_CHAT_ERROR",
      userId: errorUserId || "unknown",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date(),
      requestId: request.headers.get("x-request-id"),
    });

    return NextResponse.json(
      { 
        error: "Failed to process chat message. Please try again.",
        details: process.env.NODE_ENV === 'development' 
          ? error instanceof Error ? error.message : 'Unknown error'
          : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai-assistant/chat
 *
 * Get contextual suggestions for the current page
 */
export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const pathname = searchParams.get("pathname") || "/dashboard";
    const userRole = request.headers.get("x-user-role") || "viewer";

    // Extract context
    const extractedContext = contextExtractor.extractContext({
      pathname,
      userContext: {
        userId,
        userRole,
      },
    });

    // Get contextual suggestions from AI
    const suggestions = await langChainService.getContextualSuggestions({
      userId,
      userRole,
      currentPage: pathname,
    });

    return NextResponse.json({
      page: {
        title: extractedContext.page.title,
        description: extractedContext.page.description,
        type: extractedContext.page.routeType,
      },
      suggestions: suggestions.slice(0, 5),
      conversationStarters: extractedContext.conversationStarters,
      relevantTables: extractedContext.page.relevantTables,
    });
  } catch (error) {
    console.error("AI Chat Context API Error:", error);

    return NextResponse.json(
      { error: "Failed to get contextual suggestions" },
      { status: 500 }
    );
  }
}

// Security event logging function
async function logSecurityEvent(event: any) {
  try {
    console.warn("AI Security Event:", {
      timestamp: new Date().toISOString(),
      type: 'AI_SECURITY_EVENT',
      ...event
    });

    // Store in database if audit table exists
    // Note: This will be implemented when audit tables are created
    // For now, console logging provides audit trail
    
  } catch (error) {
    console.error("Failed to log security event:", error);
  }
}

// AI interaction logging function  
async function logAIInteraction(data: any) {
  try {
    console.log("AI Interaction:", {
      timestamp: new Date().toISOString(),
      type: 'AI_INTERACTION',
      ...data
    });

    // Store in database if audit table exists
    // Note: This will be implemented when audit tables are created
    // For now, console logging provides audit trail
    
  } catch (error) {
    console.error("Failed to log AI interaction:", error);
  }
}
