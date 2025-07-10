/**
 * LangChain Service with Ollama Integration
 *
 * Provides secure AI assistant capabilities using Llama3:8b model
 * via https://llm.bytemy.com.au
 */

import {
  BaseMessage,
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { Ollama } from "@langchain/ollama";
import { executeHasuraQuery } from "../hasura";
import { buildQueryGenerationPrompt, buildChatContextPrompt } from "./query-prompt-builder";
import { createQueryGenerationPrompt } from "./safe-prompt-builder";

// Rate limiting and error tracking
interface RateLimitTracker {
  requests: number;
  windowStart: number;
  errors: number;
}

class LangChainService {
  private ollama: Ollama;
  private rateLimits: Map<string, RateLimitTracker> = new Map();
  private readonly maxRequestsPerMinute = 30;
  private readonly maxRequestsPerHour = 500;
  private readonly windowSize = 60 * 1000; // 1 minute

  constructor() {
    const apiKey = process.env.LLM_API_KEY;

    // Validate API key is present
    if (!apiKey) {
      console.warn(
        "LLM_API_KEY is not set! AI chat functionality will not work properly."
      );
    }

    const ollamaConfig: any = {
      baseUrl: "https://llm.bytemy.com.au",
      model: "llama3:8b",
      temperature: 0.1, // Low temperature for consistent, factual responses
      topP: 0.9,
      numCtx: 4096, // Context window
    };

    // Add headers only if API key is present
    if (apiKey) {
      ollamaConfig.headers = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      };
    }

    this.ollama = new Ollama(ollamaConfig);
  }

  /**
   * Rate limiting check for user
   */
  private checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userLimit = this.rateLimits.get(userId);

    if (!userLimit) {
      this.rateLimits.set(userId, {
        requests: 1,
        windowStart: now,
        errors: 0,
      });
      return true;
    }

    // Reset window if needed
    if (now - userLimit.windowStart > this.windowSize) {
      userLimit.requests = 1;
      userLimit.windowStart = now;
      return true;
    }

    // Check if within limits
    if (userLimit.requests >= this.maxRequestsPerMinute) {
      return false;
    }

    userLimit.requests++;
    return true;
  }

  /**
   * Create system prompt for AI assistant
   */
  private createSystemPrompt(): string {
    return `You are an expert AI assistant for Payroll Matrix, an enterprise-grade SOC2-compliant payroll management system for Australian businesses. You have deep understanding of payroll operations, business intelligence, and data analysis.

CORE IDENTITY & EXPERTISE:
- Expert in Australian payroll management, business operations, and data analysis
- Specialized in interpreting complex business data and providing actionable insights
- Focused on helping users understand their business performance and make informed decisions
- Capable of generating sophisticated GraphQL queries and analyzing results meaningfully

SECURITY & ACCESS RULES:
- ONLY generate GraphQL QUERY operations - NO mutations, insertions, updates, or deletions
- Access only approved business data tables - NO audit logs, authentication, or sensitive financial data
- Respect user permissions and role-based access controls
- Never expose sensitive information like passwords, API keys, or internal system details

DATA EXPERTISE AREAS:
🏢 **Client Management**: Active clients, contact information, relationship status, billing patterns
📊 **Payroll Operations**: Processing status, timelines, consultant assignments, profitability analysis
👥 **Staff & Resources**: Work capacity, skill matching, utilization rates, team performance
💰 **Financial Insights**: Revenue tracking, billing efficiency, cost analysis, profitability metrics
📅 **Scheduling & Time**: Work schedules, capacity planning, leave management, holiday impacts
📈 **Business Intelligence**: Trends, KPIs, comparative analysis, operational efficiency

CRITICAL FIELD NAME GUIDANCE:
🔤 **Payroll Date Fields**: Use 'createdAt', 'updatedAt', 'goLiveDate', 'supersededDate' (NEVER 'startDate' or 'endDate')
🔤 **User References**: Use 'managerUserId', 'primaryConsultantUserId', 'backupConsultantUserId' (NOT 'managerId')
🔤 **Sort Syntax**: Use 'orderBy: { field: ASC }' or 'orderBy: { field: DESC }' (UPPERCASE directions)
🔤 **Filter Syntax**: Use 'where: { field: { _eq: "value" } }' with underscore operators

RESPONSE PHILOSOPHY:
- Provide naturally conversational, insightful responses that demonstrate business understanding
- When presenting data, focus on business implications and actionable insights
- Use Australian business terminology and understand local payroll context
- Present findings in a way that helps users make better business decisions
- Always explain the "so what" - why the data matters for business operations
- Be proactive in identifying patterns, trends, and potential concerns in the data

COMMUNICATION STYLE:
- Professional but approachable, like a trusted business analyst
- Lead with key insights, then provide supporting details
- Use clear business language, not technical jargon
- Structure responses to highlight the most important information first
- Provide context for what the data means for business operations`;
  }

  /**
   * Execute a GraphQL query and return results
   */
  async executeQuery(
    query: string,
    variables: Record<string, any> = {},
    hasuraConfig: {
      endpoint: string;
      adminSecret: string;
      role?: string;
    }
  ): Promise<any> {
    try {
      const result = await executeHasuraQuery(hasuraConfig, query, variables);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ [LangChain Service] Query execution failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Query execution failed' 
      };
    }
  }

  /**
   * Generate and execute GraphQL query with analysis
   */
  async generateAndExecuteQuery(
    userMessage: string,
    context: {
      userId: string;
      userRole: string;
      currentPage?: string;
      availableSchema: string;
      hasuraConfig: {
        endpoint: string;
        adminSecret: string;
        role?: string;
      };
    }
  ): Promise<{
    query: string;
    explanation: string;
    data?: any;
    summary?: string;
    variables?: Record<string, any>;
  }> {
    // Rate limiting check
    if (!this.checkRateLimit(context.userId)) {
      throw new Error(
        "Rate limit exceeded. Please wait before making another request."
      );
    }

    try {
      // First generate the query
      const queryResult = await this.generateGraphQLQuery(userMessage, context);
      
      // Then execute the query
      const executionResult = await this.executeQuery(
        queryResult.query,
        queryResult.variables || {},
        context.hasuraConfig
      );

      if (executionResult.success) {
        // Generate a natural language summary of the results
        const summary = await this.generateDataAnalysis(
          userMessage,
          queryResult.query,
          executionResult.data,
          queryResult.explanation
        );

        return {
          query: queryResult.query,
          explanation: queryResult.explanation,
          data: executionResult.data,
          summary,
          variables: queryResult.variables || {},
        };
      } else {
        return {
          query: queryResult.query,
          explanation: `${queryResult.explanation}\n\n**Execution Error:** ${executionResult.error}`,
          variables: queryResult.variables || {},
        };
      }
    } catch (error) {
      console.error("Error in generateAndExecuteQuery:", error);
      throw error;
    }
  }

  /**
   * Generate data analysis and insights from query results
   */
  private async generateDataAnalysis(
    originalRequest: string,
    query: string,
    data: any,
    queryExplanation: string
  ): Promise<string> {
    try {
      const analysisPrompt = `As a senior business analyst for an Australian payroll management company, analyze this query result and provide actionable insights:

ORIGINAL REQUEST: "${originalRequest}"
QUERY EXECUTED: "${query}"
QUERY PURPOSE: "${queryExplanation}"

RESULT DATA:
${JSON.stringify(data, null, 2)}

Provide a comprehensive business analysis including:
1. **Key Findings**: What are the most important insights from this data?
2. **Business Impact**: How does this information affect operations or decision-making?
3. **Trends & Patterns**: What patterns or trends are visible in the data?
4. **Recommendations**: What actions should be taken based on these findings?
5. **Context**: How does this relate to broader business performance?

Write in a professional but accessible tone, as if presenting to business stakeholders. Focus on actionable insights rather than technical details.`;

      const analysis = await this.chat(analysisPrompt, [], {
        userId: "ai-assistant",
        userRole: "ai_assistant",
        currentPage: "data-analysis",
      });

      return analysis;
    } catch (error) {
      console.error("Error generating data analysis:", error);
      return `Query executed successfully and returned ${Array.isArray(data) ? data.length : 1} result(s). View the detailed data below for insights.`;
    }
  }

  /**
   * Generate GraphQL query based on user request
   */
  async generateGraphQLQuery(
    userMessage: string,
    context: {
      userId: string;
      userRole: string;
      currentPage?: string;
      availableSchema: string;
    }
  ): Promise<{
    query: string;
    explanation: string;
    variables?: Record<string, any>;
  }> {
    // Rate limiting check
    if (!this.checkRateLimit(context.userId)) {
      throw new Error(
        "Rate limit exceeded. Please wait before making another request."
      );
    }

    // Use the safe prompt builder to avoid template syntax issues
    const functionCallPrompt = createQueryGenerationPrompt(
      this.createSystemPrompt(),
      context.userRole,
      context.currentPage || "Dashboard",
      context.availableSchema,
      userMessage
    );

    try {
      const chain = RunnableSequence.from([
        functionCallPrompt,
        this.ollama,
        new StringOutputParser(),
      ]);

      const response = await chain.invoke({});

      // Parse the response to extract structured data
      const parsedResponse = this.parseQueryResponse(response, userMessage);

      return parsedResponse;
    } catch (error) {
      console.error("Error generating GraphQL query:", error);

      // Track errors for rate limiting
      const userLimit = this.rateLimits.get(context.userId);
      if (userLimit) {
        userLimit.errors++;
      }

      throw new Error(
        "Failed to generate query. Please try rephrasing your request."
      );
    }
  }

  /**
   * General chat conversation
   */
  async chat(
    message: string,
    conversationHistory: BaseMessage[],
    context: {
      userId: string;
      userRole: string;
      currentPage?: string;
    }
  ): Promise<string> {
    // Rate limiting check
    if (!this.checkRateLimit(context.userId)) {
      throw new Error(
        "Rate limit exceeded. Please wait before making another request."
      );
    }

    // Build the chat context prompt without template literal issues
    const chatContextPrompt = buildChatContextPrompt(
      context.userRole,
      context.currentPage || "Dashboard"
    );

    const chatPrompt = ChatPromptTemplate.fromMessages([
      ["system", this.createSystemPrompt()],
      ["system", chatContextPrompt],
      new MessagesPlaceholder("history"),
      ["human", "{message}"],
    ]);

    try {
      const chain = RunnableSequence.from([
        chatPrompt,
        this.ollama,
        new StringOutputParser(),
      ]);

      const response = await chain.invoke({
        message,
        history: conversationHistory,
      });

      return response;
    } catch (error) {
      console.error("Error in chat:", error);

      // Track errors for rate limiting
      const userLimit = this.rateLimits.get(context.userId);
      if (userLimit) {
        userLimit.errors++;
      }

      throw new Error("Failed to process your message. Please try again.");
    }
  }

  /**
   * Parse AI response to extract structured query data
   */
  private parseQueryResponse(response: string, userMessage?: string): {
    query: string;
    explanation: string;
    variables?: Record<string, any>;
  } {
    console.log("🔍 [AI Query Parsing] Raw AI response:", response);
    console.log("🔍 [AI Query Parsing] Response length:", response.length);
    console.log("🔍 [AI Query Parsing] Response first 200 chars:", response.substring(0, 200));
    console.log("🔍 [AI Query Parsing] Response last 100 chars:", response.substring(Math.max(0, response.length - 100)));
    
    // Clean up the response - remove any markdown formatting
    let cleanedResponse = response.trim();
    
    // Remove markdown code blocks if present
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    cleanedResponse = cleanedResponse.replace(/```\s*/g, '').replace(/```\s*$/g, '');
    
    // Try to extract JSON from the response if it's wrapped in other text
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(cleanedResponse);
      console.log("✅ [AI Query Parsing] Successfully parsed as JSON:", parsed);

      if (parsed.query && parsed.explanation) {
        return {
          query: parsed.query,
          explanation: parsed.explanation,
          variables: parsed.variables || {}
        };
      } else {
        console.log("⚠️ [AI Query Parsing] JSON missing required fields. Query:", !!parsed.query, "Explanation:", !!parsed.explanation);
      }
    } catch (jsonError) {
      console.log("⚠️ [AI Query Parsing] Not valid JSON, trying other extraction methods. Error:", jsonError);
    }

    // Enhanced pattern matching for different query formats
    let query = "";
    let explanation = "";

    // Pattern 1: Markdown code blocks with graphql tag
    let queryMatch = response.match(/```graphql\s*([\s\S]*?)```/i);
    if (queryMatch) {
      query = queryMatch[1].trim();
      console.log("✅ [AI Query Parsing] Found query in graphql code block");
    }

    // Pattern 2: Generic code blocks containing "query"
    if (!query) {
      queryMatch = response.match(/```[\s\S]*?(query[\s\S]*?)```/i);
      if (queryMatch) {
        query = queryMatch[1].trim();
        console.log("✅ [AI Query Parsing] Found query in generic code block");
      }
    }

    // Pattern 3: Look for query without code blocks
    if (!query) {
      queryMatch = response.match(/(query\s+[\w]+\s*\{[\s\S]*?\})/i);
      if (queryMatch) {
        query = queryMatch[1].trim();
        console.log("✅ [AI Query Parsing] Found standalone query");
      }
    }

    // Pattern 4: Look for any text that starts with "query" and has curly braces
    if (!query) {
      const lines = response.split('\n');
      let queryStarted = false;
      let braceCount = 0;
      let queryLines: string[] = [];
      
      for (const line of lines) {
        if (line.trim().toLowerCase().startsWith('query') && line.includes('{')) {
          queryStarted = true;
          queryLines = [line];
          braceCount = (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
          continue;
        }
        
        if (queryStarted) {
          queryLines.push(line);
          braceCount += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
          
          if (braceCount <= 0) {
            query = queryLines.join('\n').trim();
            console.log("✅ [AI Query Parsing] Found query by brace counting");
            break;
          }
        }
      }
    }

    // Extract explanation (everything that's not the query)
    if (query) {
      explanation = response
        .replace(/```[\s\S]*?```/gi, "")
        .replace(query, "")
        .trim();
        
      // Clean up explanation
      explanation = explanation
        .replace(/^[\s\n]*/, "")
        .replace(/[\s\n]*$/, "")
        .replace(/\n{3,}/g, "\n\n");
        
      if (!explanation) {
        explanation = "Generated GraphQL query for your request";
      }
    } else {
      // If no query found, treat entire response as explanation
      explanation = response.trim();
    }

    console.log("🔍 [AI Query Parsing] Final extraction results:");
    console.log("  - Query found:", !!query);
    console.log("  - Query length:", query.length);
    console.log("  - Query preview:", query.substring(0, 100) + "...");
    console.log("  - Explanation length:", explanation.length);

    if (!query) {
      console.error("❌ [AI Query Parsing] Could not extract valid GraphQL query from response");
      console.error("Full response for debugging:", response);
      
      // Try to provide a helpful fallback based on the user's likely intent
      console.log("🔄 [AI Query Parsing] Attempting to generate fallback query");
      const fallbackQuery = this.generateFallbackQuery(userMessage || response);
      if (fallbackQuery) {
        console.warn("✅ [AI Query Parsing] Using fallback query:", fallbackQuery.substring(0, 100));
        return {
          query: fallbackQuery,
          explanation: "I generated a basic query to get you started. The AI had trouble parsing your request, but this should provide useful data.",
        };
      }
      
      // Ultimate fallback - return a very basic query
      console.warn("🚨 [AI Query Parsing] Using ultimate fallback query");
      return {
        query: `query GetBasicData {
          clients(limit: 5, where: { active: { _eq: true } }) {
            id
            name
            active
            contactPerson
          }
        }`,
        explanation: "I provided a basic clients query as a fallback. Please try rephrasing your question for better results.",
      };
    }

    // Fix common GraphQL syntax issues
    const fixedQuery = this.fixGraphQLSyntax(query);
    console.log("🔧 [AI Query Parsing] Applied syntax fixes, final query:", fixedQuery.substring(0, 100) + "...");

    return {
      query: fixedQuery,
      explanation: explanation || "Generated GraphQL query for your request",
    };
  }

  /**
   * Generate a simple fallback query when AI parsing fails
   */
  private generateFallbackQuery(aiResponse: string): string | null {
    const lowerResponse = aiResponse.toLowerCase();
    
    // Check what the user might be asking for
    if (lowerResponse.includes("client")) {
      return `query GetClients {
        clients(limit: 10, orderBy: { createdAt: DESC }) {
          id
          name
          active
          contactPerson
          contactEmail
          createdAt
        }
      }`;
    }
    
    if (lowerResponse.includes("payroll")) {
      return `query GetPayrolls {
        payrolls(limit: 10, orderBy: { createdAt: DESC }) {
          id
          name
          status
          goLiveDate
          supersededDate
          client {
            id
            name
          }
        }
      }`;
    }
    
    if (lowerResponse.includes("user") || lowerResponse.includes("staff")) {
      return `query GetUsers {
        users(limit: 10, orderBy: { createdAt: DESC }) {
          id
          name
          email
          position
          role
          isActive
        }
      }`;
    }
    
    if (lowerResponse.includes("schedule") || lowerResponse.includes("work")) {
      return `query GetWorkSchedule {
        workSchedule(limit: 10, orderBy: { date: DESC }) {
          id
          date
          workHours
          adminTimeHours
          user {
            id
            name
            position
          }
        }
      }`;
    }
    
    // Default fallback
    return `query GetBasicData {
      clients(limit: 5, where: { active: { _eq: true } }) {
        id
        name
        active
        contactPerson
      }
    }`;
  }

  /**
   * Fix common GraphQL syntax issues in AI-generated queries
   */
  private fixGraphQLSyntax(query: string): string {
    let fixedQuery = query;

    // Fix 1: Replace single quotes with double quotes for string literals
    // This regex matches single-quoted strings and replaces them with double quotes
    fixedQuery = fixedQuery.replace(/'([^']*?)'/g, '"$1"');

    // Fix 2: Ensure proper spacing around operators
    fixedQuery = fixedQuery.replace(/:\s*\{/g, ': {');
    fixedQuery = fixedQuery.replace(/,\s*\}/g, ' }');

    // Fix 3: Fix common Hasura filter syntax issues
    // Replace equals operators
    fixedQuery = fixedQuery.replace(/:\s*'([^']*?)'/g, ': "$1"');
    fixedQuery = fixedQuery.replace(/=\s*'([^']*?)'/g, '= "$1"');

    // Fix 4: Ensure proper boolean values (not quoted)
    fixedQuery = fixedQuery.replace(/:\s*"true"/g, ': true');
    fixedQuery = fixedQuery.replace(/:\s*"false"/g, ': false');
    fixedQuery = fixedQuery.replace(/:\s*"null"/g, ': null');

    // Fix 5: Fix numeric values (shouldn't be quoted)
    fixedQuery = fixedQuery.replace(/:\s*"(\d+)"/g, ': $1');

    // Fix 6: Common Hasura operators
    fixedQuery = fixedQuery.replace(/equals\s*:/g, '_eq:');
    fixedQuery = fixedQuery.replace(/greater_than\s*:/g, '_gt:');
    fixedQuery = fixedQuery.replace(/less_than\s*:/g, '_lt:');
    fixedQuery = fixedQuery.replace(/greater_than_or_equal\s*:/g, '_gte:');
    fixedQuery = fixedQuery.replace(/less_than_or_equal\s*:/g, '_lte:');

    // Fix 7: Clean up extra whitespace
    fixedQuery = fixedQuery.replace(/\s+/g, ' ').trim();

    return fixedQuery;
  }

  /**
   * Get contextual suggestions based on current page
   */
  async getContextualSuggestions(context: {
    userId: string;
    userRole: string;
    currentPage: string;
    pageData?: Record<string, any>;
  }): Promise<string[]> {
    if (!this.checkRateLimit(context.userId)) {
      return [
        "Rate limit exceeded. Please wait before requesting suggestions.",
      ];
    }

    const suggestionPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are helping with contextual suggestions for the Payroll Matrix application.
      
Current page: ${context.currentPage}
User role: ${context.userRole}

Provide 3-5 short, actionable suggestions for what the user might want to do or ask about on this page.
Each suggestion should be a single sentence that could be used as a prompt.
Focus on data analysis, reporting, or insights relevant to this page.`,
      ],
      ["human", "What are some helpful things I could ask about on this page?"],
    ]);

    try {
      const chain = RunnableSequence.from([
        suggestionPrompt,
        this.ollama,
        new StringOutputParser(),
      ]);

      const response = await chain.invoke({});

      // Parse response into array of suggestions
      const suggestions = response
        .split("\n")
        .filter(line => line.trim())
        .map(line => line.replace(/^[-*•]\s*/, "").trim())
        .filter(suggestion => suggestion.length > 10)
        .slice(0, 5);

      return suggestions.length > 0
        ? suggestions
        : [
            "Show me recent payroll activity",
            "Generate a summary report",
            "Help me understand this data",
          ];
    } catch (error) {
      console.error("Error generating suggestions:", error);
      return [
        "Show me recent activity",
        "Generate a summary",
        "Help me understand this page",
      ];
    }
  }

  /**
   * Clean up rate limit tracking (call periodically)
   */
  public cleanupRateLimits(): void {
    const now = Date.now();
    const hourAgo = now - 60 * 60 * 1000;

    const entries = Array.from(this.rateLimits.entries());
    for (const [userId, tracker] of entries) {
      if (tracker.windowStart < hourAgo) {
        this.rateLimits.delete(userId);
      }
    }
  }
}

// Singleton instance
export const langChainService = new LangChainService();

// Export types
export type { BaseMessage, AIMessage, HumanMessage, SystemMessage };
