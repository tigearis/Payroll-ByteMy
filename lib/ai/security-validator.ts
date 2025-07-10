/**
 * Security Validator for AI-Generated Queries
 * 
 * Provides multiple layers of security validation before executing
 * AI-generated GraphQL queries
 */

import { DocumentNode, visit, Kind } from "graphql";
import { print } from "graphql/language/printer";

// Security configuration
const SECURITY_CONFIG = {
  maxQueryDepth: 6,
  maxQueryComplexity: 100,
  maxFieldCount: 50,
  allowedOperations: ["query"] as const,
  timeoutMs: 30000,
};

// Field access restrictions for specific tables
const FIELD_RESTRICTIONS = {
  users: {
    forbidden: [
      "password_hash",
      "auth_token",
      "clerk_id", 
      "metadata",
      "private_metadata",
      "unsafe_metadata",
      "email_addresses",
      "phone_numbers",
      "web3_wallets",
      "passkeys",
      "backup_codes",
      "totp",
      "external_accounts",
    ],
    allowed: [
      "id",
      "name", 
      "email",
      "position",
      "status",
      "created_at",
      "updated_at",
    ],
  },
  app_settings: {
    forbidden: [
      "secret_key",
      "api_key",
      "webhook_secret",
      "encryption_key",
      "private_config",
    ],
    allowed: [
      "id",
      "name",
      "description", 
      "is_enabled",
      "is_public",
      "value", // Only if is_public = true
    ],
  },
} as const;

interface SecurityValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  complexity: number;
  depth: number;
  fieldCount: number;
}

interface QueryMetrics {
  depth: number;
  complexity: number;
  fieldCount: number;
  operationType: string;
  tablesAccessed: string[];
  fieldsAccessed: Record<string, string[]>;
}

class SecurityValidator {
  /**
   * Comprehensive security validation for AI queries
   */
  async validateQuery(
    query: DocumentNode,
    context: {
      userId: string;
      userRole: string;
      isAIGenerated: boolean;
    }
  ): Promise<SecurityValidationResult> {
    const result: SecurityValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      complexity: 0,
      depth: 0,
      fieldCount: 0,
    };

    try {
      // 1. Basic query structure validation
      this.validateQueryStructure(query, result);

      // 2. Operation type validation
      this.validateOperationType(query, result);

      // 3. Calculate query metrics
      const metrics = this.calculateQueryMetrics(query);
      result.complexity = metrics.complexity;
      result.depth = metrics.depth;
      result.fieldCount = metrics.fieldCount;

      // 4. Depth and complexity validation
      this.validateQueryLimits(metrics, result);

      // 5. Table access validation
      this.validateTableAccess(metrics.tablesAccessed, result);

      // 6. Field-level access validation
      this.validateFieldAccess(metrics.fieldsAccessed, result);

      // 7. Forbidden patterns validation
      this.validateForbiddenPatterns(query, result);

      // 8. Rate limiting validation (if needed)
      await this.validateRateLimit(context.userId, result);

      // Mark as invalid if any errors
      if (result.errors.length > 0) {
        result.isValid = false;
      }

      return result;
    } catch (error) {
      result.isValid = false;
      result.errors.push(`Validation error: ${error instanceof Error ? error.message : "Unknown error"}`);
      return result;
    }
  }

  /**
   * Validate basic query structure
   */
  private validateQueryStructure(query: DocumentNode, result: SecurityValidationResult): void {
    if (!query.definitions || query.definitions.length === 0) {
      result.errors.push("Query must contain at least one definition");
      return;
    }

    // Check for valid GraphQL structure
    try {
      print(query); // This will throw if structure is invalid
    } catch (error) {
      result.errors.push(`Invalid GraphQL structure: ${error instanceof Error ? error.message : "Parse error"}`);
    }
  }

  /**
   * Validate operation type (only queries allowed)
   */
  private validateOperationType(query: DocumentNode, result: SecurityValidationResult): void {
    for (const definition of query.definitions) {
      if (definition.kind === Kind.OPERATION_DEFINITION) {
        if (definition.operation !== "query") {
          result.errors.push(`Operation type '${definition.operation}' not allowed. Only 'query' operations permitted for AI assistant.`);
        }
      }
    }
  }

  /**
   * Calculate query complexity metrics
   */
  private calculateQueryMetrics(query: DocumentNode): QueryMetrics {
    const metrics: QueryMetrics = {
      depth: 0,
      complexity: 0,
      fieldCount: 0,
      operationType: "query",
      tablesAccessed: [],
      fieldsAccessed: {},
    };

    let currentDepth = 0;
    let maxDepth = 0;

    visit(query, {
      OperationDefinition: {
        enter: (node) => {
          metrics.operationType = node.operation;
        },
      },
      Field: {
        enter: (node) => {
          currentDepth++;
          maxDepth = Math.max(maxDepth, currentDepth);
          metrics.fieldCount++;
          
          // Track complexity (each field adds 1, arguments add complexity)
          metrics.complexity += 1;
          if (node.arguments && node.arguments.length > 0) {
            metrics.complexity += node.arguments.length * 0.5;
          }

          // Track table access
          const fieldName = node.name.value;
          if (this.isTableField(fieldName)) {
            if (!metrics.tablesAccessed.includes(fieldName)) {
              metrics.tablesAccessed.push(fieldName);
            }
            
            // Track fields accessed for this table
            if (!metrics.fieldsAccessed[fieldName]) {
              metrics.fieldsAccessed[fieldName] = [];
            }
          }
        },
        leave: () => {
          currentDepth--;
        },
      },
      SelectionSet: {
        enter: (node, key, parent) => {
          // Track fields within selection sets
          if (parent && !Array.isArray(parent) && 'kind' in parent && parent.kind === Kind.FIELD) {
            const parentField = parent as any;
            const tableName = parentField.name.value;
            
            for (const selection of node.selections) {
              if (selection.kind === Kind.FIELD) {
                const fieldName = selection.name.value;
                if (metrics.fieldsAccessed[tableName] && 
                    !metrics.fieldsAccessed[tableName].includes(fieldName)) {
                  metrics.fieldsAccessed[tableName].push(fieldName);
                }
              }
            }
          }
        },
      },
    });

    metrics.depth = maxDepth;
    return metrics;
  }

  /**
   * Validate query limits (depth, complexity, field count)
   */
  private validateQueryLimits(metrics: QueryMetrics, result: SecurityValidationResult): void {
    if (metrics.depth > SECURITYCONFIG.maxQueryDepth) {
      result.errors.push(`Query depth ${metrics.depth} exceeds maximum allowed depth of ${SECURITYCONFIG.maxQueryDepth}`);
    }

    if (metrics.complexity > SECURITYCONFIG.maxQueryComplexity) {
      result.errors.push(`Query complexity ${metrics.complexity} exceeds maximum allowed complexity of ${SECURITYCONFIG.maxQueryComplexity}`);
    }

    if (metrics.fieldCount > SECURITYCONFIG.maxFieldCount) {
      result.errors.push(`Query field count ${metrics.fieldCount} exceeds maximum allowed fields of ${SECURITYCONFIG.maxFieldCount}`);
    }

    // Warnings for high but acceptable values
    if (metrics.complexity > SECURITYCONFIG.maxQueryComplexity * 0.8) {
      result.warnings.push("Query complexity is high and may impact performance");
    }

    if (metrics.depth > SECURITYCONFIG.maxQueryDepth * 0.8) {
      result.warnings.push("Query depth is high and may impact performance");
    }
  }

  /**
   * Validate table access permissions
   */
  private validateTableAccess(tablesAccessed: string[], result: SecurityValidationResult): void {
    const forbiddenTables = [
      "audit_log", "auth_events", "data_access_log", "permission_changes",
      "permission_usage_report", "slow_queries", "user_access_summary",
      "permissions", "roles", "userroles", "role_permissions",
      "billing_invoice_item", "billing_event_log", "billing_invoice", "billing_items",
      "adjustment_rules", "payroll_triggers_status",
    ];

    for (const table of tablesAccessed) {
      if (forbiddenTables.includes(table)) {
        result.errors.push(`Access to table '${table}' is forbidden for AI assistant`);
      }
    }
  }

  /**
   * Validate field-level access permissions
   */
  private validateFieldAccess(
    fieldsAccessed: Record<string, string[]>, 
    result: SecurityValidationResult
  ): void {
    for (const [table, fields] of Object.entries(fieldsAccessed)) {
      const restrictions = FIELD_RESTRICTIONS[table as keyof typeof FIELD_RESTRICTIONS];
      
      if (restrictions) {
        for (const field of fields) {
          // Check forbidden fields
          if ((restrictions.forbidden as readonly string[]).includes(field)) {
            result.errors.push(`Access to field '${field}' in table '${table}' is forbidden`);
          }
          
          // Check if field is in allowed list (if specified)
          if (restrictions.allowed && !(restrictions.allowed as readonly string[]).includes(field)) {
            result.warnings.push(`Field '${field}' in table '${table}' may contain sensitive data`);
          }
        }
      }
    }
  }

  /**
   * Validate against forbidden query patterns
   */
  private validateForbiddenPatterns(query: DocumentNode, result: SecurityValidationResult): void {
    const queryString = print(query).toLowerCase();

    // Forbidden patterns
    const forbiddenPatterns = [
      /mutation\s+/i,
      /subscription\s+/i,
      /\b__schema\b/i,
      /\b__type\b/i,
      /\bintrospection\b/i,
      /password/i,
      /secret/i,
      /token/i,
      /private_key/i,
      /api_key/i,
    ];

    const dangerousPatterns = [
      /delete/i,
      /drop/i,
      /truncate/i,
      /alter/i,
      /create/i,
      /insert/i,
      /update/i,
    ];

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(queryString)) {
        result.errors.push(`Query contains forbidden pattern: ${pattern.source}`);
      }
    }

    for (const pattern of dangerousPatterns) {
      if (pattern.test(queryString)) {
        result.warnings.push(`Query contains potentially dangerous pattern: ${pattern.source}`);
      }
    }
  }

  /**
   * Validate rate limiting (placeholder for future implementation)
   */
  private async validateRateLimit(userId: string, result: SecurityValidationResult): Promise<void> {
    // This could integrate with a Redis-based rate limiter
    // For now, just a placeholder
    return Promise.resolve();
  }

  /**
   * Check if a field name represents a table/collection
   */
  private isTableField(fieldName: string): boolean {
    const tableFields = [
      "payrolls", "payroll_dates", "payroll_cycles", "clients", "users",
      "work_schedule", "holidays", "notes", "leave", "user_skills",
      "consultant_capacity_overview", "team_capacity_by_position",
      "app_settings", "external_systems", "feature_flags", "resources",
    ];
    
    return tableFields.includes(fieldName);
  }

  /**
   * Sanitize query by removing potentially dangerous elements
   */
  sanitizeQuery(query: DocumentNode): DocumentNode {
    // This could remove or modify dangerous parts of the query
    // For now, return as-is since validation should catch issues
    return query;
  }

  /**
   * Get security report for a query
   */
  generateSecurityReport(
    query: DocumentNode,
    validationResult: SecurityValidationResult
  ): string {
    const metrics = this.calculateQueryMetrics(query);
    
    return `
Security Validation Report:
- Status: ${validationResult.isValid ? "APPROVED" : "REJECTED"}
- Complexity: ${metrics.complexity}/${SECURITYCONFIG.maxQueryComplexity}
- Depth: ${metrics.depth}/${SECURITYCONFIG.maxQueryDepth}
- Fields: ${metrics.fieldCount}/${SECURITYCONFIG.maxFieldCount}
- Tables: ${metrics.tablesAccessed.join(", ")}
${validationResult.errors.length > 0 ? `\nErrors:\n${validationResult.errors.map(e => `- ${e}`).join("\n")}` : ""}
${validationResult.warnings.length > 0 ? `\nWarnings:\n${validationResult.warnings.map(w => `- ${w}`).join("\n")}` : ""}
    `.trim();
  }
}

// Export singleton instance
export const securityValidator = new SecurityValidator();

// Export types
export type { SecurityValidationResult, QueryMetrics };