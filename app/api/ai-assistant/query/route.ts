/**
 * AI Assistant Query API Endpoint
 *
 * Generate and execute GraphQL queries based on natural language requests
 */

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { contextExtractor } from "../../../../lib/ai/context-extractor";
import {
  hasuraQueryGenerator,
  type QueryGenerationContext,
} from "../../../../lib/ai/hasura-query-generator";
import { langChainService } from "../../../../lib/ai/langchain-service";
import { securityValidator } from "../../../../lib/ai/security-validator";
import { checkFeatureFlag } from "../../../../lib/feature-flags/api-guard";

// Rate limiting for queries (stricter than chat)
const queryRateLimits = new Map<string, { count: number; resetTime: number }>();
const QUERY_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const QUERY_RATE_LIMIT_MAX = 10; // 10 queries per minute

interface QueryRequest {
  request: string;
  context?: {
    pathname?: string;
    searchParams?: Record<string, string>;
    pageData?: Record<string, any>;
  };
  executeQuery?: boolean; // Whether to execute the query or just generate it
  hasuraConfig?: {
    endpoint: string;
    adminSecret: string;
    role?: string;
  };
}

interface QueryResponse {
  query: string;
  explanation: string;
  variables?: Record<string, any>;
  data?: any;
  errors?: any[];
  summary?: string;
  security: {
    isValid: boolean;
    report: string;
  };
  metadata: {
    complexity: number;
    depth: number;
    fieldCount: number;
    tablesToAccess: string[];
  };
}

/**
 * POST /api/ai-assistant/query
 *
 * Generate and optionally execute GraphQL queries
 */
export async function POST(request: NextRequest) {
  let userId: string | null = null;
  let userRole: string = "viewer";
  let queryRequest: string = "";

  try {
    // Feature flag check
    const aiFeatureCheck = await checkFeatureFlag('aiAssistant', request);
    if (!aiFeatureCheck.enabled) {
      return NextResponse.json(
        { 
          error: 'AI Assistant Disabled',
          message: 'The AI Assistant feature is currently disabled.',
          feature: 'aiAssistant',
        },
        { status: 503 }
      );
    }

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
      console.log("🔑 [AI Query API] Retrieved JWT token for user:", userId);
    } catch (error) {
      console.warn("⚠️ [AI Query API] Failed to get JWT token:", error);
    }

    // Rate limiting check
    const now = Date.now();
    const userLimits = queryRateLimits.get(userId);

    if (userLimits) {
      if (
        now < userLimits.resetTime &&
        userLimits.count >= QUERY_RATE_LIMIT_MAX
      ) {
        return NextResponse.json(
          {
            error:
              "Query rate limit exceeded. Please wait before generating another query.",
            retryAfter: Math.ceil((userLimits.resetTime - now) / 1000),
          },
          { status: 429 }
        );
      }

      if (now >= userLimits.resetTime) {
        queryRateLimits.set(userId, {
          count: 1,
          resetTime: now + QUERY_RATE_LIMIT_WINDOW,
        });
      } else {
        userLimits.count++;
      }
    } else {
      queryRateLimits.set(userId, {
        count: 1,
        resetTime: now + QUERY_RATE_LIMIT_WINDOW,
      });
    }

    // Parse request body
    const body: QueryRequest = await request.json();
    const {
      request: requestString,
      context = {},
      executeQuery = false,
      hasuraConfig,
    } = body;
    queryRequest = requestString;

    if (!queryRequest || queryRequest.trim().length === 0) {
      return NextResponse.json(
        { error: "Query request is required" },
        { status: 400 }
      );
    }

    if (queryRequest.length > 1000) {
      return NextResponse.json(
        {
          error:
            "Query request is too long. Please keep requests under 1000 characters.",
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
          error:
            "AI assistant query access requires elevated permissions (consultant or higher)",
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

    // Build query generation context
    const queryContext: QueryGenerationContext & { jwtToken?: string } = {
      userId,
      userRole,
      currentPage: extractedContext.page.title,
      isServerSide: true,
      ...(hasuraConfig && { hasuraConfig }),
      ...(jwtToken && { jwtToken }),
    };

    // Generate the query
    const generatedQuery = await hasuraQueryGenerator.generateQuery(
      queryRequest,
      queryContext
    );

    // Security validation
    const securityResult = await securityValidator.validateQuery(
      generatedQuery.query,
      {
        userId,
        userRole,
        isAIGenerated: true,
      }
    );

    // Generate security report
    const securityReport = securityValidator.generateSecurityReport(
      generatedQuery.query,
      securityResult
    );

    // Prepare response
    const response: QueryResponse = {
      query: generatedQuery.query.loc?.source.body || "Query generation failed",
      explanation: generatedQuery.explanation,
      variables: generatedQuery.variables || {},
      security: {
        isValid: securityResult.isValid,
        report: securityReport,
      },
      metadata: {
        complexity: securityResult.complexity,
        depth: securityResult.depth,
        fieldCount: securityResult.fieldCount,
        tablesToAccess: generatedQuery.tablesToAccess,
      },
    };

    // Prepare hasura configuration for execution
    const executionHasuraConfig = hasuraConfig || {
      endpoint:
        process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL ||
        "http://localhost:8080/v1/graphql",
      adminSecret: process.env.HASURA_GRAPHQL_ADMIN_SECRET || "",
      role: userRole,
    };

    // Always execute query if security validation passed
    if (securityResult.isValid) {
      try {
        // Get schema context for enhanced execution
        const schemaContext = await hasuraQueryGenerator.getSchemaContext(
          executionHasuraConfig
        );

        // Use enhanced query execution with analysis
        const enhancedResult = await langChainService.generateAndExecuteQuery(
          queryRequest,
          {
            userId,
            userRole,
            currentPage: extractedContext.page.title,
            availableSchema: schemaContext || "Basic schema context",
            hasuraConfig: executionHasuraConfig,
          }
        );

        response.data = enhancedResult.data;
        response.summary = enhancedResult.summary || undefined;

        // Use enhanced explanation if available
        if (enhancedResult.summary) {
          response.explanation = enhancedResult.summary;
        }

        // Log successful query execution
        await logQueryExecution({
          userId,
          userRole,
          request: queryRequest,
          query: response.query,
          success: true,
          tablesAccessed: generatedQuery.tablesToAccess,
          context: extractedContext.page,
        });
      } catch (executionError) {
        console.error("Enhanced query execution error:", executionError);

        response.errors = [
          {
            message:
              executionError instanceof Error
                ? executionError.message
                : "Enhanced query execution failed",
            extensions: { code: "EXECUTION_ERROR" },
          },
        ];

        // Log failed query execution
        await logQueryExecution({
          userId,
          userRole,
          request: queryRequest,
          query: response.query,
          success: false,
          error:
            executionError instanceof Error
              ? executionError.message
              : String(executionError),
          tablesAccessed: generatedQuery.tablesToAccess,
          context: extractedContext.page,
        });
      }
    } else if (false) {
    } else if (executeQuery && !securityResult.isValid) {
      response.errors = [
        {
          message: "Query failed security validation and cannot be executed",
          extensions: {
            code: "SECURITY_VIOLATION",
            violations: securityResult.errors,
          },
        },
      ];

      // Log security violation
      await logQueryExecution({
        userId,
        userRole,
        request: queryRequest,
        query: response.query,
        success: false,
        error: "Security validation failed",
        securityViolations: securityResult.errors,
        tablesAccessed: generatedQuery.tablesToAccess,
        context: extractedContext.page,
      });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("AI Query API Error:", error);

    // Enhanced error logging for debugging
    const errorDetails = {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      userId,
      userRole,
      queryRequest: queryRequest?.substring(0, 100) + "...",
    };
    console.error("Detailed error info:", errorDetails);

    // Return appropriate error response
    if (error instanceof Error) {
      if (error.message.includes("Rate limit")) {
        return NextResponse.json({ error: error.message }, { status: 429 });
      }

      if (error.message.includes("Authentication")) {
        return NextResponse.json(
          { error: "Authentication failed" },
          { status: 401 }
        );
      }

      if (
        error.message.includes("forbidden") ||
        error.message.includes("Access denied")
      ) {
        return NextResponse.json(
          { error: "Access denied to requested data" },
          { status: 403 }
        );
      }

      // Return the actual error message in development for debugging
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json(
          {
            error: "Query generation failed",
            details: error.message,
            type: error.constructor.name,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to process query request. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai-assistant/query
 *
 * Get suggested queries for the current context
 */
export async function GET(request: NextRequest) {
  try {
    // Feature flag check
    const aiFeatureCheck = await checkFeatureFlag('aiAssistant', request);
    if (!aiFeatureCheck.enabled) {
      return NextResponse.json(
        { 
          error: 'AI Assistant Disabled',
          message: 'The AI Assistant feature is currently disabled.',
          feature: 'aiAssistant',
        },
        { status: 503 }
      );
    }

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

    // Build context
    const queryContext: QueryGenerationContext = {
      userId,
      userRole,
      currentPage: pathname,
      isServerSide: true,
    };

    // Get suggested queries
    const suggestions =
      await hasuraQueryGenerator.getSuggestedQueries(queryContext);

    return NextResponse.json({
      suggestions,
      context: {
        page: pathname,
        userRole,
      },
    });
  } catch (error) {
    console.error("AI Query Suggestions API Error:", error);

    return NextResponse.json(
      { error: "Failed to get query suggestions" },
      { status: 500 }
    );
  }
}

/**
 * Log query execution for audit purposes
 */
async function logQueryExecution(data: {
  userId: string;
  userRole: string;
  request: string;
  query: string;
  success: boolean;
  error?: string;
  securityViolations?: string[];
  tablesAccessed: string[];
  context: any;
}) {
  try {
    // Enhanced logging for queries
    console.log("AI Query Execution:", {
      userId: data.userId,
      userRole: data.userRole,
      requestLength: data.request.length,
      queryLength: data.query.length,
      success: data.success,
      error: data.error,
      securityViolations: data.securityViolations,
      tablesAccessed: data.tablesAccessed,
      page: data.context.title,
      timestamp: new Date().toISOString(),
    });

    // TODO: Store in audit.ai_query_log table when available
    // This should include:
    // - Full query text (for security review)
    // - Tables accessed
    // - Success/failure status
    // - Security violations if any
    // - User context
  } catch (error) {
    console.error("Failed to log query execution:", error);
    // Don't throw - logging failure shouldn't break the main flow
  }
}

/**
 * Generate a natural language summary of query results with business insights
 */
async function generateDataSummary(
  originalRequest: string,
  data: any,
  queryExplanation: string
): Promise<string> {
  try {
    // Analyze the data structure and content
    const dataAnalysis = analyzeQueryResults(data);

    const summaryPrompt = `As a senior business analyst for an Australian payroll management company, provide an insightful summary of this data analysis:

ORIGINAL BUSINESS QUESTION: "${originalRequest}"
QUERY PURPOSE: "${queryExplanation}"

DATA RESULTS ANALYSIS:
${JSON.stringify(data, null, 2)}

DATA METRICS:
- Total records: ${dataAnalysis.totalRecords}
- Data types found: ${dataAnalysis.dataTypes.join(", ")}
- Key business entities: ${dataAnalysis.businessEntities.join(", ")}
- Has relationships: ${dataAnalysis.hasRelationships ? "Yes" : "No"}

ANALYSIS REQUIREMENTS:
🎯 **Business Context**: What does this data tell us about business operations?
📊 **Key Insights**: What are the most important findings and patterns?
💡 **Business Implications**: What actions or decisions could this data inform?
🔍 **Notable Observations**: Any trends, outliers, or significant data points?
📈 **Performance Indicators**: How does this relate to business performance?

RESPONSE STYLE:
- Write as a trusted business advisor who understands payroll operations
- Lead with the most important business insight
- Use specific numbers and data points to support insights
- Provide actionable conclusions where appropriate
- Use Australian business terminology naturally
- Keep under 250 words but pack with value

Start your response with a key insight, not a restatement of the question.`;

    const summary = await langChainService.chat(summaryPrompt, [], {
      userId: "ai-assistant",
      userRole: "ai_assistant",
      currentPage: "data-analysis",
    });

    return summary;
  } catch (error) {
    console.error("Error generating data summary:", error);

    // Enhanced fallback with basic analysis
    const dataAnalysis = analyzeQueryResults(data);
    return `Found ${dataAnalysis.totalRecords} records in response to your query. The data includes ${dataAnalysis.businessEntities.join(", ")} with ${dataAnalysis.hasRelationships ? "related information" : "core details"}. ${dataAnalysis.totalRecords > 0 ? "You can analyze the detailed results below for business insights." : "No records matched your criteria - you may want to adjust your search parameters."}`;
  }
}

/**
 * Analyze query results to extract metadata for better summarization
 */
function analyzeQueryResults(data: any): {
  totalRecords: number;
  dataTypes: string[];
  businessEntities: string[];
  hasRelationships: boolean;
} {
  const result = {
    totalRecords: 0,
    dataTypes: new Set<string>(),
    businessEntities: new Set<string>(),
    hasRelationships: false,
  };

  if (!data || typeof data !== "object") {
    return {
      totalRecords: 0,
      dataTypes: [],
      businessEntities: [],
      hasRelationships: false,
    };
  }

  // Analyze the data structure
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      result.totalRecords += value.length;
      result.businessEntities.add(key);

      // Check if items have relationships
      if (value.length > 0 && typeof value[0] === "object") {
        const firstItem = value[0];
        for (const [itemKey, itemValue] of Object.entries(firstItem)) {
          if (typeof itemValue === "object" && itemValue !== null) {
            result.hasRelationships = true;
          }
          result.dataTypes.add(typeof itemValue);
        }
      }
    } else if (value !== null && typeof value === "object") {
      result.totalRecords += 1;
      result.businessEntities.add(key);
      result.hasRelationships = true;
    }
  }

  return {
    totalRecords: result.totalRecords,
    dataTypes: Array.from(result.dataTypes),
    businessEntities: Array.from(result.businessEntities),
    hasRelationships: result.hasRelationships,
  };
}
