/**
 * Context Extractor for AI Assistant
 * 
 * Extracts contextual information from the current page, route, and user state
 * to provide relevant assistance and suggestions
 */

// Route mapping for context extraction
const ROUTE_CONTEXTS = {
  "/dashboard": {
    type: "overview",
    title: "Dashboard",
    description: "Main dashboard with overview metrics",
    suggestedQueries: [
      "Show me recent payroll activity",
      "What clients need attention?",
      "Show upcoming deadlines",
    ],
    relevantTables: ["payrolls", "clients", "payroll_dashboard_stats"],
  },
  "/payrolls": {
    type: "payroll_management", 
    title: "Payroll Management",
    description: "Payroll processing and management",
    suggestedQueries: [
      "Show payrolls in progress",
      "List overdue payrolls",
      "Show payroll assignments for this week",
    ],
    relevantTables: ["payrolls", "payroll_assignments", "payroll_dates"],
  },
  "/clients": {
    type: "client_management",
    title: "Client Management", 
    description: "Client information and relationship management",
    suggestedQueries: [
      "Show active clients",
      "Which clients have recent payrolls?",
      "Show client billing status",
    ],
    relevantTables: ["clients", "payrolls", "client_billing_assignment"],
  },
  "/staff": {
    type: "staff_management",
    title: "Staff Management",
    description: "Staff information and management",
    suggestedQueries: [
      "Show staff by skills",
      "Who's available this week?",
      "Show staff capacity overview",
    ],
    relevantTables: ["users", "user_skills", "consultant_capacity_overview"],
  },
  "/work-schedule": {
    type: "scheduling",
    title: "Work Schedule",
    description: "Staff scheduling and time management",
    suggestedQueries: [
      "Show today's schedule",
      "Who's scheduled this week?",
      "Show schedule conflicts",
    ],
    relevantTables: ["work_schedule", "users"],
  },
  "/leave": {
    type: "leave_management",
    title: "Leave Management",
    description: "Employee leave requests and approvals",
    suggestedQueries: [
      "Show pending leave requests",
      "Who's on leave this week?",
      "Show leave balance by staff",
    ],
    relevantTables: ["leave", "users"],
  },
  "/payroll-schedule": {
    type: "payroll_scheduling",
    title: "Payroll Schedule",
    description: "Payroll date management and scheduling",
    suggestedQueries: [
      "Show upcoming payroll dates",
      "Which payrolls are due?",
      "Show schedule conflicts",
    ],
    relevantTables: ["payroll_dates", "payrolls", "payroll_date_types"],
  },
} as const;

type RouteType = keyof typeof ROUTE_CONTEXTS;

interface PageContext {
  route: string;
  routeType: string;
  title: string;
  description: string;
  suggestedQueries: string[];
  relevantTables: string[];
  pageData: Record<string, any> | undefined;
  userContext: {
    userId: string;
    userRole: string;
    permissions: string[];
  };
  timeContext: {
    currentTime: Date;
    timezone: string;
    businessHours: boolean;
  };
}

interface ExtractedContext {
  page: PageContext;
  suggestions: string[];
  relevantData: Record<string, any>;
  conversationStarters: string[];
}

class ContextExtractor {
  /**
   * Extract full context from current state
   */
  extractContext(params: {
    pathname: string;
    searchParams?: URLSearchParams;
    pageData?: Record<string, any>;
    userContext: {
      userId: string;
      userRole: string;
      permissions?: string[];
    };
  }): ExtractedContext {
    const { pathname, searchParams, pageData, userContext } = params;

    // Extract route context
    const routeContext = this.extractRouteContext(pathname);
    
    // Build page context
    const pageContext: PageContext = {
      route: pathname,
      routeType: routeContext?.type || "unknown",
      title: routeContext?.title || "Unknown Page",
      description: routeContext?.description || "Page description not available",
      suggestedQueries: routeContext?.suggestedQueries ? [...routeContext.suggestedQueries] : [],
      relevantTables: routeContext?.relevantTables ? [...routeContext.relevantTables] : [],
      pageData,
      userContext: {
        userId: userContext.userId,
        userRole: userContext.userRole,
        permissions: userContext.permissions || [],
      },
      timeContext: {
        currentTime: new Date(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        businessHours: this.isBusinessHours(),
      },
    };

    // Generate contextual suggestions
    const suggestions = this.generateContextualSuggestions(pageContext, searchParams);
    
    // Extract relevant data hints
    const relevantData = this.extractRelevantData(pageContext);
    
    // Generate conversation starters
    const conversationStarters = this.generateConversationStarters(pageContext);

    return {
      page: pageContext,
      suggestions,
      relevantData,
      conversationStarters,
    };
  }

  /**
   * Extract route-specific context
   */
  private extractRouteContext(pathname: string) {
    // Direct match first
    if (pathname in ROUTE_CONTEXTS) {
      return ROUTE_CONTEXTS[pathname as RouteType];
    }

    // Pattern matching for dynamic routes
    if (pathname.startsWith("/payrolls/")) {
      return {
        ...ROUTE_CONTEXTS["/payrolls"],
        title: "Payroll Details",
        description: "Individual payroll information and management",
        suggestedQueries: [
          "Show this payroll's assignments",
          "Show this payroll's timeline",
          "Who's working on this payroll?",
        ],
      };
    }

    if (pathname.startsWith("/clients/")) {
      return {
        ...ROUTE_CONTEXTS["/clients"],
        title: "Client Details",
        description: "Individual client information and history",
        suggestedQueries: [
          "Show this client's payroll history",
          "Show this client's staff assignments",
          "Show billing information for this client",
        ],
      };
    }

    if (pathname.startsWith("/staff/")) {
      return {
        ...ROUTE_CONTEXTS["/staff"],
        title: "Staff Details",
        description: "Individual staff member information",
        suggestedQueries: [
          "Show this person's assignments",
          "Show this person's schedule",
          "Show this person's skills and capacity",
        ],
      };
    }

    // Default for unknown routes
    return {
      type: "general",
      title: "Payroll Matrix",
      description: "Enterprise payroll management system",
      suggestedQueries: [
        "Show me an overview",
        "What needs my attention?",
        "Show recent activity",
      ],
      relevantTables: ["payrolls", "clients", "users"],
    };
  }

  /**
   * Generate contextual suggestions based on page and params
   */
  private generateContextualSuggestions(
    pageContext: PageContext,
    searchParams?: URLSearchParams
  ): string[] {
    const suggestions = [...pageContext.suggestedQueries];

    // Add role-specific suggestions
    switch (pageContext.userContext.userRole) {
      case "developer":
        suggestions.push("Show system diagnostics", "Show recent errors");
        break;
      case "org_admin":
        suggestions.push("Show organization overview", "Show user activity");
        break;
      case "manager":
        suggestions.push("Show team performance", "Show capacity planning");
        break;
      case "consultant":
        suggestions.push("Show my assignments", "Show my schedule");
        break;
    }

    // Add time-based suggestions
    const now = new Date();
    const isMonday = now.getDay() === 1;
    const isEndOfMonth = this.isEndOfMonth(now);

    if (isMonday) {
      suggestions.push("Show this week's schedule");
    }

    if (isEndOfMonth) {
      suggestions.push("Show month-end payroll summary");
    }

    // Add search param context
    if (searchParams) {
      const status = searchParams.get("status");
      const client = searchParams.get("client");
      
      if (status) {
        suggestions.push(`Show ${status} items`);
      }
      
      if (client) {
        suggestions.push(`Show data for ${client}`);
      }
    }

    return suggestions.slice(0, 6); // Limit to 6 suggestions
  }

  /**
   * Extract relevant data based on context
   */
  private extractRelevantData(pageContext: PageContext): Record<string, any> {
    const relevantData: Record<string, any> = {
      userRole: pageContext.userContext.userRole,
      currentTime: pageContext.timeContext.currentTime.toISOString(),
      timezone: pageContext.timeContext.timezone,
      businessHours: pageContext.timeContext.businessHours,
    };

    // Add route-specific data hints
    switch (pageContext.routeType) {
      case "payroll_management":
        relevantData.payrollStatuses = ["draft", "in_progress", "completed", "approved"];
        relevantData.dateFilters = this.getDateFilters();
        break;
        
      case "client_management":
        relevantData.clientStatuses = ["active", "inactive", "pending"];
        break;
        
      case "staff_management":
        relevantData.userPositions = ["consultant", "manager", "admin"];
        relevantData.skillCategories = ["technical", "business", "soft"];
        break;
        
      case "scheduling":
        relevantData.scheduleTypes = ["regular", "overtime", "leave"];
        relevantData.weekDates = this.getWeekDates();
        break;
    }

    return relevantData;
  }

  /**
   * Generate conversation starters
   */
  private generateConversationStarters(pageContext: PageContext): string[] {
    const starters = [
      "Hi! I can help you analyze your payroll data. What would you like to know?",
      `I see you're on the ${pageContext.title} page. How can I assist you?`,
      "I can generate reports and answer questions about your data. What are you looking for?",
    ];

    // Add context-specific starters
    switch (pageContext.routeType) {
      case "overview":
        starters.push("Would you like a summary of recent activity?");
        break;
      case "payroll_management":
        starters.push("Would you like to see payroll status updates?");
        break;
      case "client_management":
        starters.push("Would you like to see client performance metrics?");
        break;
      case "staff_management":
        starters.push("Would you like to see team capacity information?");
        break;
    }

    return starters.slice(0, 4);
  }

  /**
   * Check if current time is business hours
   */
  private isBusinessHours(): boolean {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // Monday = 1, Friday = 5
    const isWeekday = day >= 1 && day <= 5;
    const isBusinessTime = hour >= 9 && hour < 17;
    
    return isWeekday && isBusinessTime;
  }

  /**
   * Check if date is end of month
   */
  private isEndOfMonth(date: Date): boolean {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysUntilEnd = lastDay.getDate() - date.getDate();
    return daysUntilEnd <= 3; // Within 3 days of month end
  }

  /**
   * Get common date filters
   */
  private getDateFilters(): Record<string, string> {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

    return {
      today: new Date().toISOString().split('T')[0],
      thisWeek: startOfWeek.toISOString().split('T')[0],
      thisMonth: startOfMonth.toISOString().split('T')[0],
      last30Days: thirtyDaysAgo.toISOString().split('T')[0],
    };
  }

  /**
   * Get current week dates
   */
  private getWeekDates(): string[] {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const dates = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  }

  /**
   * Extract query parameters for context
   */
  extractSearchContext(searchParams: URLSearchParams): Record<string, any> {
    const context: Record<string, any> = {};
    
    // Common search parameters
    const commonParams = ["status", "client", "user", "date", "type", "limit", "offset"];
    
    commonParams.forEach(param => {
      const value = searchParams.get(param);
      if (value) {
        context[param] = value;
      }
    });

    return context;
  }

  /**
   * Build GraphQL context from page data
   */
  buildGraphQLContext(pageContext: PageContext): string {
    const { routeType, relevantTables, userContext } = pageContext;
    
    return `
Current Context:
- Page: ${pageContext.title} (${routeType})
- User Role: ${userContext.userRole}
- Time: ${pageContext.timeContext.currentTime.toLocaleString()}
- Business Hours: ${pageContext.timeContext.businessHours ? "Yes" : "No"}

Relevant Tables: ${relevantTables.join(", ")}

Focus your queries on data relevant to ${pageContext.description.toLowerCase()}.
Consider the user's role (${userContext.userRole}) when suggesting queries.
    `.trim();
  }
}

// Export singleton instance
export const contextExtractor = new ContextExtractor();

// Export types
export type { PageContext, ExtractedContext };