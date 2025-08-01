/**
 * Hasura-aware GraphQL Query Generator
 *
 * Generates and executes GraphQL queries for the AI assistant
 * using the existing Apollo Client infrastructure and schema
 */

import { DocumentNode, gql } from "@apollo/client";
import {
  clientApolloClient,
  serverApolloClient,
} from "../apollo/unified-client";
import { introspectSchema } from "../hasura";
import { langChainService } from "./langchain-service";
import { generateSchemaContext } from "./schema-parser";

// Import existing Apollo clients

// Approved tables for AI access
const SAFE_TABLES = [
  "payrolls",
  "payroll_dates",
  "payroll_cycles",
  "payroll_dashboard_stats",
  "current_payrolls",
  "payroll_version_results",
  "payroll_assignments",
  "payroll_assignment_audit",
  "payroll_activation_results",
  "latest_payroll_version_results",
  "payroll_version_history_results",
  "clients",
  "work_schedule",
  "holidays",
  "notes",
  "leave",
  "user_skills",
  "payroll_required_skills",
  "consultant_capacity_overview",
  "team_capacity_by_position",
  "payroll_date_types",
  "external_systems",
  "feature_flags",
  "resources",
  "position_admin_defaults",
] as const;

const RESTRICTED_TABLES = ["users", "app_settings"] as const;

const FORBIDDEN_TABLES = [
  // Audit tables
  "audit_log",
  "auth_events",
  "data_access_log",
  "permission_changes",
  "permission_usage_report",
  "slow_queries",
  "user_access_summary",
  // Auth/Permission tables
  "permissions",
  "roles",
  "userroles",
  "role_permissions",
  "usersrole_backup",
  // Financial tables
  "billing_invoice_item",
  "billing_event_log",
  "billing_invoice",
  "billing_items",
  "billing_plan",
  "client_billing_assignment",
  // System internals
  "adjustment_rules",
  "payroll_triggers_status",
] as const;

type SafeTable = (typeof SAFE_TABLES)[number];
type RestrictedTable = (typeof RESTRICTED_TABLES)[number];
type ForbiddenTable = (typeof FORBIDDEN_TABLES)[number];

interface QueryGenerationContext {
  userId: string;
  userRole: string;
  currentPage?: string;
  isServerSide?: boolean;
  hasuraConfig?: {
    endpoint: string;
    adminSecret: string;
    role?: string;
  };
}

interface GeneratedQuery {
  query: DocumentNode;
  variables?: Record<string, any>;
  explanation: string;
  tablesToAccess: string[];
}

class HasuraQueryGenerator {
  /**
   * Get comprehensive schema context for AI using introspection
   */
  async getSchemaContext(hasuraConfig?: {
    endpoint: string;
    adminSecret: string;
    role?: string;
  }): Promise<string> {
    try {
      // Try dynamic introspection first if hasura config is available
      if (hasuraConfig) {
        console.log('🔍 [Query Generator] Using dynamic schema introspection');
        const dynamicSchema = await this.generateDynamicSchemaContext(hasuraConfig);
        if (dynamicSchema) {
          return dynamicSchema;
        }
      }
      
      // Fallback to static schema context from introspection.json
      console.log('🔍 [Query Generator] Using static schema context');
      return await generateSchemaContext();
    } catch (error) {
      console.error('❌ [Query Generator] Failed to load schema, using fallback:', error);
      
      // Fallback to basic schema context if introspection fails
      return `
# Available Tables and Common Fields (Fallback)

## CORE BUSINESS TABLES:
clients (
  id, name, active, contactEmail, contactPerson, contactPhone, createdAt, updatedAt
  payrolls ( id, name, status, goLiveDate, supersededDate )
)

payrolls (
  id, name, status, clientId, managerUserId, primaryConsultantUserId, backupConsultantUserId, 
  createdAt, updatedAt, goLiveDate, supersededDate, payrollSystem, billingStatus,
  employeeCount, processingTime, estimatedHours, actualHours, estimatedRevenue, actualRevenue
  client ( id, name, active )
  manager ( id, name, email )
  primaryConsultant ( id, name, email )
  backupConsultant ( id, name, email )
  timeEntries ( hoursSpent, description )
  billingItems ( id, description, rate, quantity )
)

users (
  id, name, email, position, role, status, isActive, createdAt, updatedAt
  managedPayrolls ( id, name, status )
  primaryConsultantPayrolls ( id, name, status )
  backupConsultantPayrolls ( id, name, status )
)

workSchedule (
  id, userId, workDay, workHours, adminTimeHours, date, type, status
  user ( id, name, position )
)

timeEntries (
  id, clientId, payrollId, hoursSpent, description, createdAt, workDate
  client ( name )
  payroll ( name )
  user ( name )
)

## QUERY PATTERNS:
# - Use orderBy: for sorting with { field: ASC } or { field: DESC }
# - Use where: for filtering with conditions like { _eq: "value" }
# - Limit results with limit: N
# - Use relationships with nested field selection

## IMPORTANT FIELD NAMING:
# - Use camelCase: contactEmail, createdAt, goLiveDate, managerUserId
# - Date fields: createdAt, updatedAt, goLiveDate, supersededDate (NOT startDate/endDate)
# - User references: managerUserId, primaryConsultantUserId, backupConsultantUserId
# - Boolean operators: _eq, _neq, _gt, _gte, _lt, _lte, _in, _nin, _like, _ilike
# - Sort directions: ASC, DESC (uppercase)
# - Always use double quotes for string values
      `;
    }
  }

  /**
   * Generate dynamic schema context using live Hasura introspection
   */
  private async generateDynamicSchemaContext(hasuraConfig: {
    endpoint: string;
    adminSecret: string;
    role?: string;
  }): Promise<string | null> {
    try {
      const tables = await introspectSchema(hasuraConfig);
      
      if (!tables || tables.length === 0) {
        return null;
      }

      let context = `# GraphQL Schema Context - Live Introspection from Hasura

## Available Tables and Field Information

The following tables are available for querying with their complete field structures and relationships:

`;

      // Filter tables by business domain
      const businessTables = tables.filter((table: any) => 
        ['clients', 'payrolls', 'users', 'workSchedule', 'timeEntries', 'billingItems', 'payrollDates', 'notes', 'leave', 'userSkill'].includes(table.name)
      );
      
      const systemTables = tables.filter((table: any) => 
        !['clients', 'payrolls', 'users', 'workSchedule', 'timeEntries', 'billingItems', 'payrollDates', 'notes', 'leave', 'userSkill'].includes(table.name)
      );

      context += `## Core Business Tables (Primary Focus for User Queries)\n\n`;
      
      for (const table of businessTables) {
        context += this.generateDynamicTableDocumentation(table);
      }

      context += `## Supporting System Tables (Available but less commonly used)\n\n`;
      
      for (const table of systemTables.slice(0, 10)) { // Limit to first 10 to avoid context overflow
        context += this.generateDynamicTableDocumentation(table, true);
      }

      context += this.generateQueryPatterns();
      context += this.generateBusinessContext();

      return context;
    } catch (error) {
      console.error('❌ [Query Generator] Dynamic schema generation failed:', error);
      return null;
    }
  }

  /**
   * Generate documentation for a table from dynamic introspection
   */
  private generateDynamicTableDocumentation(table: any, isSystemTable = false): string {
    let doc = `### ${table.name}\n`;
    
    // Core fields
    const coreFields = table.columns || [];
    if (coreFields.length > 0) {
      doc += `**Core Fields:**\n`;
      for (const field of coreFields) {
        const nullable = field.nullable ? '' : '!';
        doc += `- ${field.name}: ${field.type}${nullable}`;
        if (field.isPrimaryKey) doc += ' (Primary Key)';
        if (field.isForeignKey) doc += ' (Foreign Key)';
        doc += '\n';
      }
      doc += '\n';
    }

    // Relationships (only for business tables)
    if (!isSystemTable && table.relationships && table.relationships.length > 0) {
      doc += `**Relationships:**\n`;
      for (const rel of table.relationships) {
        doc += `- ${rel.name} → ${rel.remoteTable} (${rel.type})\n`;
      }
      doc += '\n';
    }

    return doc;
  }

  /**
   * Generate query patterns and examples
   */
  private generateQueryPatterns(): string {
    return `
## Common Query Patterns and Best Practices

### Basic Query Structure
\`\`\`graphql
query QueryName {
  tableName(
    where: { field: { _eq: "value" } }
    orderBy: { field: ASC }
    limit: 10
  ) {
    field1
    field2
    relationship {
      relatedField
    }
  }
}
\`\`\`

### Filter Operators Available
- **Equality**: \`_eq\`, \`_neq\`
- **Comparison**: \`_gt\`, \`_gte\`, \`_lt\`, \`_lte\`
- **List Operations**: \`_in\`, \`_nin\`
- **Text Search**: \`_like\`, \`_ilike\`
- **Null Checks**: \`_is_null\`

### Relationship Queries
- Use nested selection to fetch related data
- Example: \`client { name contactEmail }\` within a payroll query
- Prefer specific field selection over \`*\` for performance

### Performance Guidelines
- Always include \`limit\` for large datasets
- Use \`orderBy\` for consistent results
- Select only needed fields
- Use appropriate filters to reduce result sets

`;
  }

  /**
   * Generate business context and common use cases
   */
  private generateBusinessContext(): string {
    return `
## Business Context and Common Use Cases

### Payroll Management Queries
- Active payrolls with client information
- Payrolls by status, date range, or consultant
- Payroll profitability and performance metrics
- Time tracking and hours analysis

### Client Management Queries  
- Active clients with contact information
- Client billing status and invoice history
- Client-payroll relationships and activity
- Client profitability and revenue analysis

### Staff and Resource Management
- User capacity and work schedule analysis
- Skill matching for payroll assignments
- Team performance and utilization metrics
- Leave management and availability

### Financial and Billing Queries
- Revenue analysis by client/payroll/period
- Time entry summaries and billing rates
- Invoice generation and payment tracking
- Profitability analysis and cost management

### Reporting and Analytics
- Dashboard metrics and KPIs
- Period-over-period comparisons
- Resource utilization reports
- Client satisfaction and retention metrics

## Field Naming Conventions
- Use camelCase for field names: \`contactEmail\`, \`createdAt\`, \`startDate\`
- Boolean fields often start with \`is\`: \`isActive\`, \`isStaff\`
- ID fields end with \`Id\`: \`clientId\`, \`userId\`, \`payrollId\`
- Timestamp fields often end with \`At\`: \`createdAt\`, \`updatedAt\`
- Use UPPERCASE for sort directions: \`ASC\`, \`DESC\`
- Use camelCase for arguments: \`where\`, \`orderBy\`, \`limit\`, \`offset\`

`;
  }

  /**
   * Generate GraphQL query using AI
   */
  async generateQuery(
    userRequest: string,
    context: QueryGenerationContext
  ): Promise<GeneratedQuery> {
    try {
      // Get AI-generated query with dynamic schema context
      const schemaContext = await this.getSchemaContext(context.hasuraConfig);
      const aiResponse = await langChainService.generateGraphQLQuery(
        userRequest,
        {
          userId: context.userId,
          userRole: context.userRole,
          currentPage: context.currentPage || "Dashboard",
          availableSchema: schemaContext,
        }
      );

      // Parse and validate the query
      const query = this.parseAndValidateQuery(aiResponse.query);

      // Extract tables being accessed
      const tablesToAccess = this.extractTablesFromQuery(aiResponse.query);

      return {
        query,
        variables: aiResponse.variables || {},
        explanation: aiResponse.explanation,
        tablesToAccess,
      };
    } catch (error) {
      console.error("Error generating query:", error);
      throw new Error(
        `Failed to generate query: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Execute a generated query
   */
  async executeQuery(
    generatedQuery: GeneratedQuery,
    context: QueryGenerationContext & { jwtToken?: string }
  ): Promise<any> {
    try {
      const client = context.isServerSide
        ? serverApolloClient
        : clientApolloClient;

      // Prepare headers for Hasura authentication
      const headers: Record<string, string> = {};
      
      if (context.jwtToken) {
        headers.authorization = `Bearer ${context.jwtToken}`;
        console.log("🔑 [AI Query] Using JWT token for Hasura authentication");
      } else {
        console.warn("⚠️ [AI Query] No JWT token provided, query may fail");
      }

      // Set the user role for Hasura
      headers["x-hasura-role"] = context.userRole || "viewer";

      const result = await client.query({
        query: generatedQuery.query,
        variables: generatedQuery.variables || {},
        errorPolicy: "all", // Return partial data with errors
        fetchPolicy: "no-cache", // Always fetch fresh data for AI queries
        context: {
          headers,
        },
      });

      if (result.errors && result.errors.length > 0) {
        console.warn("GraphQL errors:", result.errors);
        // Still return data if available, but log errors
      }

      return {
        data: result.data,
        errors: result.errors,
        explanation: generatedQuery.explanation,
        tablesToAccess: generatedQuery.tablesToAccess,
      };
    } catch (error) {
      console.error("Error executing query:", error);
      throw new Error(
        `Failed to execute query: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Parse query string and convert to DocumentNode
   */
  private parseAndValidateQuery(queryString: string): DocumentNode {
    try {
      // Clean up the query string
      let cleanQuery = queryString.trim();

      // Remove markdown code blocks if present
      cleanQuery = cleanQuery
        .replace(/```(?:graphql)?\s*/, "")
        .replace(/```\s*$/, "");

      // Remove any leading/trailing stray braces
      cleanQuery = cleanQuery
        .replace(/^\s*\{\s*/, "query {")
        .replace(/\s*\}\s*$/, "}");

      // Remove any single stray closing brace at the end if there are more closing than opening braces
      const openCount = (cleanQuery.match(/{/g) || []).length;
      const closeCount = (cleanQuery.match(/}/g) || []).length;
      if (closeCount > openCount) {
        cleanQuery = cleanQuery.replace(/}\s*$/, "");
      }

      // Log the raw and cleaned query for debugging
      console.log("[AI Query] Raw query string:", queryString);
      console.log("[AI Query] Cleaned query string:", cleanQuery);
      console.log("[AI Query] Cleaned query length:", cleanQuery.length);
      console.log("[AI Query] Query starts with:", cleanQuery.substring(0, 50));
      console.log("[AI Query] Query ends with:", cleanQuery.substring(Math.max(0, cleanQuery.length - 50)));

      // Ensure query starts with 'query' or '{'
      if (!cleanQuery.startsWith("query") && !cleanQuery.startsWith("{")) {
        throw new Error(
          "Invalid query format - must start with 'query' or '{'"
        );
      }

      // Basic validation: check if query looks complete
      if (cleanQuery.trim().length < 10) {
        throw new Error("Query appears to be incomplete - too short");
      }

      // Check for balanced braces
      const openBraces = (cleanQuery.match(/{/g) || []).length;
      const closeBraces = (cleanQuery.match(/}/g) || []).length;
      if (openBraces === 0) {
        throw new Error("Query appears to be incomplete - no opening braces found");
      }
      if (openBraces !== closeBraces) {
        console.warn(`[AI Query] Brace mismatch: ${openBraces} open, ${closeBraces} close`);
        // Try to fix by adding missing closing braces
        const missingBraces = openBraces - closeBraces;
        if (missingBraces > 0) {
          cleanQuery += '}'.repeat(missingBraces);
          console.log("[AI Query] Added missing closing braces:", missingBraces);
        } else if (missingBraces < 0) {
          // Too many closing braces, try to remove extras from the end
          const extraBraces = Math.abs(missingBraces);
          for (let i = 0; i < extraBraces; i++) {
            cleanQuery = cleanQuery.replace(/}\s*$/, '');
          }
          console.log("[AI Query] Removed extra closing braces:", extraBraces);
        }
      }

      // Parse with GraphQL
      const parsedQuery = gql`
        ${cleanQuery}
      `;

      return parsedQuery;
    } catch (error) {
      console.error("Query parsing error:", error);
      throw new Error(
        `Invalid GraphQL query: ${error instanceof Error ? error.message : "Parse error"}`
      );
    }
  }

  /**
   * Extract table names from query string
   */
  private extractTablesFromQuery(queryString: string): string[] {
    const tables: string[] = [];

    // Look for table names in the query
    [...SAFE_TABLES, ...RESTRICTED_TABLES].forEach(table => {
      if (queryString.includes(table)) {
        tables.push(table);
      }
    });

    // Check for forbidden tables
    FORBIDDEN_TABLES.forEach(table => {
      if (queryString.includes(table)) {
        throw new Error(
          `Access to table '${table}' is forbidden for AI assistant`
        );
      }
    });

    return tables;
  }

  /**
   * Get suggested queries based on context
   */
  async getSuggestedQueries(context: QueryGenerationContext): Promise<
    Array<{
      title: string;
      description: string;
      query: string;
    }>
  > {
    const suggestions = [
      {
        title: "Recent Payrolls",
        description: "Show payrolls from the last 30 days",
        query: `query RecentPayrolls {
          payrolls(
            where: { created_at: { _gte: "${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}" } }
            order_by: { created_at: desc }
            limit: 10
          ) {
            id
            name
            status
            start_date
            end_date
            client {
              id
              name
            }
            manager {
              id
              name
            }
          }
        }`,
      },
      {
        title: "Active Clients",
        description: "List all active clients",
        query: `query ActiveClients {
          clients(
            where: { active: { _eq: true } }
            order_by: { name: asc }
          ) {
            id
            name
            active
            contactPerson
            contactEmail
            createdAt
          }
        }`,
      },
      {
        title: "Today's Schedule",
        description: "Show today's work schedule",
        query: `query TodaySchedule {
          work_schedule(
            where: { date: { _eq: "${new Date().toISOString().split("T")[0]}" } }
            order_by: { hours: desc }
          ) {
            id
            hours
            type
            status
            user {
              id
              name
              position
            }
          }
        }`,
      },
      {
        title: "Upcoming Holidays",
        description: "Show holidays in the next 3 months",
        query: `query UpcomingHolidays {
          holidays(
            where: {
              date: {
                _gte: "${new Date().toISOString().split("T")[0]}"
                _lte: "${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}"
              }
            }
            order_by: { date: asc }
          ) {
            id
            name
            date
            is_public_holiday
            region
          }
        }`,
      },
    ];

    // Filter suggestions based on user role and current page
    return suggestions.filter(suggestion => {
      // All users can see basic queries
      return true;
    });
  }

  /**
   * Validate table access permissions
   */
  private validateTableAccess(tables: string[], userRole: string): void {
    for (const table of tables) {
      // Check if table is forbidden
      if (FORBIDDEN_TABLES.includes(table as ForbiddenTable)) {
        throw new Error(
          `Access denied: Table '${table}' is not accessible to AI assistant`
        );
      }

      // For restricted tables, additional validation could be added here
      if (RESTRICTED_TABLES.includes(table as RestrictedTable)) {
        // Currently allowing restricted tables with field-level filtering in Hasura
        continue;
      }

      // Safe tables are always allowed
      if (SAFE_TABLES.includes(table as SafeTable)) {
        continue;
      }

      // Unknown table
      throw new Error(`Unknown table '${table}' requested`);
    }
  }
}

// Export singleton instance
export const hasuraQueryGenerator = new HasuraQueryGenerator();

// Export types
export type { QueryGenerationContext, GeneratedQuery };
