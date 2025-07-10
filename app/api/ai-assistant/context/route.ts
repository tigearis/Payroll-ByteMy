/**
 * AI Assistant Context API Endpoint
 * 
 * Extract and provide contextual information for AI assistance
 */

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { contextExtractor, type ExtractedContext } from "@/lib/ai/context-extractor";

/**
 * GET /api/ai-assistant/context
 * 
 * Get contextual information for the current page/route
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

    // Parse additional context parameters
    const contextParams: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      if (key !== "pathname") {
        contextParams[key] = value;
      }
    }

    // Extract full context
    const extractedContext: ExtractedContext = contextExtractor.extractContext({
      pathname,
      searchParams: searchParams,
      userContext: {
        userId,
        userRole,
      },
    });

    // Return context information
    return NextResponse.json({
      page: {
        route: extractedContext.page.route,
        type: extractedContext.page.routeType,
        title: extractedContext.page.title,
        description: extractedContext.page.description,
      },
      user: {
        role: extractedContext.page.userContext.userRole,
        permissions: extractedContext.page.userContext.permissions,
      },
      time: {
        current: extractedContext.page.timeContext.currentTime,
        timezone: extractedContext.page.timeContext.timezone,
        businessHours: extractedContext.page.timeContext.businessHours,
      },
      suggestions: extractedContext.suggestions,
      conversationStarters: extractedContext.conversationStarters,
      relevantTables: extractedContext.page.relevantTables,
      relevantData: extractedContext.relevantData,
      searchContext: contextExtractor.extractSearchContext(searchParams),
    });

  } catch (error) {
    console.error("AI Context API Error:", error);
    
    return NextResponse.json(
      { error: "Failed to extract context information" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai-assistant/context
 * 
 * Extract context from provided page data
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { 
      pathname = "/dashboard",
      searchParams = {},
      pageData = {},
    } = body;

    const userRole = request.headers.get("x-user-role") || "viewer";

    // Convert searchParams object to URLSearchParams
    const urlSearchParams = new URLSearchParams(searchParams);

    // Extract context with provided data
    const extractedContext: ExtractedContext = contextExtractor.extractContext({
      pathname,
      searchParams: urlSearchParams,
      pageData,
      userContext: {
        userId,
        userRole,
      },
    });

    // Build GraphQL context string for AI
    const graphqlContext = contextExtractor.buildGraphQLContext(extractedContext.page);

    return NextResponse.json({
      context: extractedContext,
      graphqlContext,
      smartSuggestions: await generateSmartSuggestions(extractedContext),
    });

  } catch (error) {
    console.error("AI Context POST API Error:", error);
    
    return NextResponse.json(
      { error: "Failed to process context data" },
      { status: 500 }
    );
  }
}

/**
 * Generate smart suggestions based on extracted context
 */
async function generateSmartSuggestions(context: ExtractedContext): Promise<string[]> {
  const suggestions: string[] = [];

  // Add time-based suggestions
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay();

  if (hour < 12) {
    suggestions.push("Show today's morning schedule");
  } else if (hour > 17) {
    suggestions.push("Show tomorrow's agenda");
  }

  if (dayOfWeek === 1) { // Monday
    suggestions.push("Show this week's workload");
  } else if (dayOfWeek === 5) { // Friday
    suggestions.push("Show week summary");
  }

  // Add role-based suggestions
  switch (context.page.userContext.userRole) {
    case "developer":
      suggestions.push("Show system health metrics");
      break;
    case "org_admin":
      suggestions.push("Show organization overview");
      break;
    case "manager":
      suggestions.push("Show team performance");
      break;
    case "consultant":
      suggestions.push("Show my upcoming assignments");
      break;
  }

  // Add page-specific suggestions
  switch (context.page.routeType) {
    case "payroll_management":
      suggestions.push("Show payrolls needing attention");
      suggestions.push("Show upcoming deadlines");
      break;
    case "client_management":
      suggestions.push("Show client activity summary");
      suggestions.push("Show revenue by client");
      break;
    case "staff_management":
      suggestions.push("Show staff utilization");
      suggestions.push("Show skills gap analysis");
      break;
    case "scheduling":
      suggestions.push("Show schedule conflicts");
      suggestions.push("Show capacity planning");
      break;
  }

  // Add seasonal/monthly suggestions
  const month = now.getMonth();
  if (month === 11 || month === 0) { // December or January
    suggestions.push("Show year-end reports");
  } else if (month === 5 || month === 6) { // June or July (Australian tax year)
    suggestions.push("Show financial year summary");
  }

  // Return top 5 unique suggestions
  return [...new Set(suggestions)].slice(0, 5);
}