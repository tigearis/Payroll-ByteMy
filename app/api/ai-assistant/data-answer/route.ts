/**
 * Hasura Dynamic Query AI Assistant - Direct Answer API
 *
 * This endpoint provides direct, conversational answers to user questions
 * without exposing technical details. It generates GraphQL queries internally,
 * executes them, and returns business-focused insights.
 */

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { contextExtractor } from "../../../../lib/ai/context-extractor";
import { hasuraQueryGenerator } from "../../../../lib/ai/hasura-query-generator";
import { langChainService } from "../../../../lib/ai/langchain-service";
import { securityValidator } from "../../../../lib/ai/security-validator";
import { auditLogger } from "../../../../lib/audit/audit-logger";

// Rate limiting for direct answers (more permissive than raw queries)
const answerRateLimits = new Map<string, { count: number; resetTime: number }>();
const ANSWER_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const ANSWER_RATE_LIMIT_MAX = 20; // 20 questions per minute

interface DataQuestionRequest {
  question: string;
  context?: {
    pathname?: string;
    searchParams?: Record<string, string>;
    pageData?: Record<string, any>;
  };
}

interface DataAnswerResponse {
  answer: string;
  insights?: string[];
  summary?: string | undefined;
  recordCount?: number;
  businessContext?: string;
  executionTime?: number;
  relatedQuestions?: string[];
  metadata: {
    hasData: boolean;
    queryGenerated: boolean;
    securityValidated: boolean;
    dataSource: string;
  };
}

/**
 * POST /api/ai-assistant/data-answer
 *
 * Ask questions about business data and get direct answers with insights
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | null = null;
  let userRole: string = "viewer";
  let question: string = "";

  try {
    // Authentication check
    const authResult = await auth();
    userId = authResult.userId;
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get JWT token for Hasura authentication
    let jwtToken: string | null = null;
    try {
      jwtToken = await authResult.getToken({ template: "hasura" });
      console.log("🔑 [Data Answer API] Retrieved JWT token for user:", userId);
    } catch (error) {
      console.warn("⚠️ [Data Answer API] Failed to get JWT token:", error);
    }

    // Rate limiting check
    const now = Date.now();
    const userLimits = answerRateLimits.get(userId);

    if (userLimits) {
      if (
        now < userLimits.resetTime &&
        userLimits.count >= ANSWER_RATE_LIMIT_MAX
      ) {
        return NextResponse.json(
          {
            error: "Too many questions. Please wait before asking another question.",
            retryAfter: Math.ceil((userLimits.resetTime - now) / 1000),
          },
          { status: 429 }
        );
      }

      if (now >= userLimits.resetTime) {
        answerRateLimits.set(userId, {
          count: 1,
          resetTime: now + ANSWER_RATE_LIMIT_WINDOW,
        });
      } else {
        userLimits.count++;
      }
    } else {
      answerRateLimits.set(userId, {
        count: 1,
        resetTime: now + ANSWER_RATE_LIMIT_WINDOW,
      });
    }

    // Parse request body
    const body: DataQuestionRequest = await request.json();
    const { question: questionString, context = {} } = body;
    question = questionString;

    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    if (question.length > 500) {
      return NextResponse.json(
        {
          error: "Question is too long. Please keep questions under 500 characters.",
        },
        { status: 400 }
      );
    }

    // Get user context and check role-based access
    userRole = (request.headers.get("x-user-role") || "viewer") as string;
    const allowedRoles = ["developer", "org_admin", "manager", "consultant"];

    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json(
        {
          error: "Data assistant access requires elevated permissions (consultant or higher)",
          requiredRoles: allowedRoles,
          currentRole: userRole,
        },
        { status: 403 }
      );
    }

    // Extract page context
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

    // Determine business context from the question
    const businessContext = determineBusinessContext(question);
    
    // Generate and execute query
    const hasuraConfig = {
      endpoint:
        process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL ||
        "http://localhost:8080/v1/graphql",
      adminSecret: process.env.HASURA_GRAPHQL_ADMIN_SECRET || "",
      role: userRole,
    };

    try {
      // Use the enhanced query generation with analysis
      const enhancedResult = await langChainService.generateAndExecuteQuery(
        question,
        {
          userId,
          userRole,
          currentPage: extractedContext.page.title,
          availableSchema: await hasuraQueryGenerator.getSchemaContext(hasuraConfig),
          hasuraConfig,
        }
      );

      // Generate business-focused answer
      const answer = await generateBusinessAnswer(
        question,
        enhancedResult,
        businessContext,
        userRole
      );

      // Extract insights and recommendations
      const insights = extractBusinessInsights(enhancedResult.data, businessContext);
      
      // Generate related questions
      const relatedQuestions = generateRelatedQuestions(question, businessContext);

      // Calculate record count
      const recordCount = calculateRecordCount(enhancedResult.data);

      const response: DataAnswerResponse = {
        answer,
        insights,
        summary: enhancedResult.summary || undefined,
        recordCount,
        businessContext,
        executionTime: Date.now() - startTime,
        relatedQuestions,
        metadata: {
          hasData: !!enhancedResult.data,
          queryGenerated: !!enhancedResult.query,
          securityValidated: true,
          dataSource: "hasura-graphql",
        },
      };

      // Log successful interaction
      await logDataAnswer({
        userId,
        userRole,
        question,
        answer,
        recordCount,
        executionTime: Date.now() - startTime,
        businessContext,
        success: true,
      });

      return NextResponse.json(response);

    } catch (queryError) {
      console.error("Query execution error:", queryError);

      // Provide a helpful response even when queries fail
      const fallbackAnswer = generateFallbackAnswer(question, queryError as Error, userRole);

      const response: DataAnswerResponse = {
        answer: fallbackAnswer,
        businessContext,
        executionTime: Date.now() - startTime,
        metadata: {
          hasData: false,
          queryGenerated: false,
          securityValidated: true,
          dataSource: "fallback",
        },
      };

      // Log failed interaction
      await logDataAnswer({
        userId,
        userRole,
        question,
        answer: fallbackAnswer,
        error: queryError instanceof Error ? queryError.message : String(queryError),
        executionTime: Date.now() - startTime,
        businessContext,
        success: false,
      });

      return NextResponse.json(response);
    }

  } catch (error) {
    console.error("Data Answer API Error:", error);

    // Enhanced error logging
    const errorDetails = {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      userId,
      userRole,
      question: question?.substring(0, 100) + "...",
    };
    console.error("Detailed error info:", errorDetails);

    return NextResponse.json(
      { 
        error: "I encountered an issue while processing your question. Please try again or rephrase your question.",
        details: process.env.NODE_ENV === "development" 
          ? error instanceof Error ? error.message : "Unknown error"
          : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * Determine business context from the question
 */
function determineBusinessContext(question: string): string {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes("client")) return "Client Management";
  if (lowerQuestion.includes("payroll")) return "Payroll Operations";
  if (lowerQuestion.includes("staff") || lowerQuestion.includes("user") || lowerQuestion.includes("team")) return "Staff Management";
  if (lowerQuestion.includes("schedule") || lowerQuestion.includes("time") || lowerQuestion.includes("capacity")) return "Scheduling & Time";
  if (lowerQuestion.includes("revenue") || lowerQuestion.includes("billing") || lowerQuestion.includes("financial")) return "Financial Performance";
  if (lowerQuestion.includes("leave") || lowerQuestion.includes("holiday") || lowerQuestion.includes("vacation")) return "Leave Management";
  if (lowerQuestion.includes("skill") || lowerQuestion.includes("expertise")) return "Skills & Capabilities";
  if (lowerQuestion.includes("report") || lowerQuestion.includes("analytics") || lowerQuestion.includes("performance")) return "Business Analytics";
  
  return "Business Operations";
}

/**
 * Generate a business-focused answer from query results
 */
async function generateBusinessAnswer(
  question: string,
  queryResult: any,
  businessContext: string,
  userRole: string
): Promise<string> {
  if (!queryResult.data) {
    return `I couldn't find any data to answer your question about ${businessContext.toLowerCase()}. This might be because the data doesn't exist, or you may need different permissions to access it.`;
  }

  // If we have an AI-generated summary, use it as the primary answer
  if (queryResult.summary) {
    return queryResult.summary;
  }

  // Generate a basic business summary
  const recordCount = calculateRecordCount(queryResult.data);
  
  if (recordCount === 0) {
    return `No records found for your ${businessContext.toLowerCase()} query. You may want to adjust your criteria or check the date range.`;
  }

  // Create a contextual response based on business area
  const contextualResponse = generateContextualResponse(
    question,
    queryResult.data,
    businessContext,
    recordCount,
    userRole
  );

  return contextualResponse;
}

/**
 * Generate contextual response based on business area
 */
function generateContextualResponse(
  question: string,
  data: any,
  businessContext: string,
  recordCount: number,
  userRole: string
): string {
  const isManager = ["developer", "org_admin", "manager"].includes(userRole);
  
  switch (businessContext) {
    case "Client Management":
      return `Found ${recordCount} client${recordCount === 1 ? '' : 's'} matching your query. ${isManager ? 'This represents important relationship data for business planning.' : 'Here are the details you requested.'}`;
      
    case "Payroll Operations":
      return `Located ${recordCount} payroll record${recordCount === 1 ? '' : 's'}. ${isManager ? 'This data is crucial for understanding processing efficiency and client service levels.' : 'Here are the payroll details.'}`;
      
    case "Staff Management":
      return `Found ${recordCount} staff record${recordCount === 1 ? '' : 's'}. ${isManager ? 'This information helps with resource planning and team management.' : 'Here are the team details.'}`;
      
    case "Financial Performance":
      return `Retrieved ${recordCount} financial record${recordCount === 1 ? '' : 's'}. ${isManager ? 'This data provides insights into business performance and profitability.' : 'Here are the financial details.'}`;
      
    case "Scheduling & Time":
      return `Found ${recordCount} schedule entry${recordCount === 1 ? '' : 'ies'}. ${isManager ? 'This helps understand resource utilization and capacity planning.' : 'Here are the schedule details.'}`;
      
    default:
      return `Found ${recordCount} record${recordCount === 1 ? '' : 's'} for your query. The data shows the current state of your ${businessContext.toLowerCase()}.`;
  }
}

/**
 * Extract business insights from data
 */
function extractBusinessInsights(data: any, businessContext: string): string[] {
  const insights: string[] = [];
  
  if (!data) return insights;
  
  const recordCount = calculateRecordCount(data);
  
  // General insights based on record count
  if (recordCount === 0) {
    insights.push("No data found - consider expanding search criteria");
  } else if (recordCount > 100) {
    insights.push("Large dataset - consider filtering for more specific analysis");
  }
  
  // Context-specific insights
  switch (businessContext) {
    case "Client Management":
      insights.push("Monitor client activity levels for relationship health");
      if (recordCount > 0) insights.push("Consider client segmentation for targeted service delivery");
      break;
      
    case "Payroll Operations":
      insights.push("Track processing times to identify efficiency opportunities");
      if (recordCount > 0) insights.push("Monitor payroll status distribution for workflow optimization");
      break;
      
    case "Staff Management":
      insights.push("Analyze team capacity and skill distribution");
      if (recordCount > 0) insights.push("Consider workload balance across team members");
      break;
  }
  
  return insights;
}

/**
 * Generate related questions based on context
 */
function generateRelatedQuestions(question: string, businessContext: string): string[] {
  const baseQuestions: Record<string, string[]> = {
    "Client Management": [
      "How many active clients do we have?",
      "Which clients have the highest activity?",
      "Show me recent client communications",
    ],
    "Payroll Operations": [
      "What's our average payroll processing time?",
      "Which payrolls are currently in progress?",
      "Show me payroll completion rates",
    ],
    "Staff Management": [
      "Who's available today?",
      "What's our team capacity this week?",
      "Show me staff skill distribution",
    ],
    "Financial Performance": [
      "What's our revenue this quarter?",
      "Show me billing efficiency metrics",
      "Which clients are most profitable?",
    ],
  };
  
  return baseQuestions[businessContext] || [
    "Show me recent activity",
    "What's the current status?",
    "Give me a summary of key metrics",
  ];
}

/**
 * Generate fallback answer when queries fail
 */
function generateFallbackAnswer(question: string, error: Error, userRole: string): string {
  const errorMessage = error.message.toLowerCase();
  
  if (errorMessage.includes("permission") || errorMessage.includes("access")) {
    return `I don't have permission to access the data needed to answer your question. ${userRole === "viewer" ? "You may need elevated permissions to view this information." : "Please check with your administrator about data access."}`;
  }
  
  if (errorMessage.includes("not found") || errorMessage.includes("does not exist")) {
    return "The data you're asking about doesn't seem to exist in our system. Please check if your question refers to valid business entities or try rephrasing it.";
  }
  
  return "I encountered an issue while trying to answer your question. This might be due to a temporary system issue or the specific data not being available. Please try rephrasing your question or try again later.";
}

/**
 * Calculate total record count from data structure
 */
function calculateRecordCount(data: any): number {
  if (!data) return 0;
  
  let total = 0;
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      total += value.length;
    } else if (value && typeof value === 'object') {
      total += 1;
    }
  }
  return total;
}

/**
 * Log data answer interaction for audit purposes
 */
async function logDataAnswer(data: {
  userId: string;
  userRole: string;
  question: string;
  answer: string;
  recordCount?: number;
  executionTime: number;
  businessContext: string;
  success: boolean;
  error?: string;
}) {
  try {
    // Log to audit database
    await auditLogger.log({
      userId: data.userId,
      action: data.success ? 'AI_DATA_QUERY_SUCCESS' : 'AI_DATA_QUERY_FAILED',
      entityType: 'ai_data_query',
      entityId: undefined,
      success: data.success,
      metadata: {
        userRole: data.userRole,
        questionLength: data.question.length,
        answerLength: data.answer.length,
        recordCount: data.recordCount,
        executionTime: data.executionTime,
        businessContext: data.businessContext,
        error: data.error,
        question: data.question.substring(0, 500), // First 500 chars for audit
        answer: data.answer.substring(0, 1000), // First 1000 chars for review
        timestamp: new Date().toISOString(),
      }
    });

    console.log("✅ Data Answer Interaction logged to audit database:", {
      userId: data.userId,
      userRole: data.userRole,
      success: data.success,
      businessContext: data.businessContext,
      recordCount: data.recordCount,
      executionTime: data.executionTime,
    });
  } catch (error) {
    console.error("❌ Failed to log data answer interaction to audit database:", error);
    
    // Fallback to console logging
    console.log("Data Answer Interaction (fallback):", {
      userId: data.userId,
      userRole: data.userRole,
      questionLength: data.question.length,
      answerLength: data.answer.length,
      recordCount: data.recordCount,
      executionTime: data.executionTime,
      businessContext: data.businessContext,
      success: data.success,
      error: data.error,
      timestamp: new Date().toISOString(),
    });
  }
}