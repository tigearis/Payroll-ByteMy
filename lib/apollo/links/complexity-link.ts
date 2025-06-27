/**
 * Query Complexity Analysis Link
 * 
 * This link analyzes GraphQL query complexity and applies limits
 * to prevent expensive queries from overwhelming the system.
 * 
 * Features:
 * - Automatic query complexity calculation
 * - Configurable complexity limits per operation type
 * - Special handling for subscription queries
 * - Development mode warnings for complex queries
 * - Optional query blocking for excessive complexity
 */

import { ApolloLink, Observable, Operation, NextLink, FetchResult } from "@apollo/client";
import { DocumentNode, DefinitionNode, FieldNode, SelectionNode, visit } from "graphql";

interface ComplexityScore {
  queryComplexity: number;
  fieldCount: number;
  nestingDepth: number;
  fragmentCount: number;
}

/**
 * Configuration for Query Complexity Link
 */
export interface ComplexityLinkOptions {
  /**
   * Maximum allowed complexity for queries
   * @default 1000
   */
  maxQueryComplexity?: number;
  
  /**
   * Maximum allowed complexity for mutations
   * @default 500
   */
  maxMutationComplexity?: number;
  
  /**
   * Maximum allowed complexity for subscriptions
   * @default 200
   */
  maxSubscriptionComplexity?: number;
  
  /**
   * Maximum allowed nesting depth
   * @default 10
   */
  maxNestingDepth?: number;
  
  /**
   * Maximum allowed field count
   * @default 100
   */
  maxFieldCount?: number;
  
  /**
   * Whether to block queries that exceed limits
   * @default false (warn only in development)
   */
  blockExcessiveQueries?: boolean;
  
  /**
   * Whether to log complexity analysis in development
   * @default true
   */
  enableLogging?: boolean;
  
  /**
   * Custom complexity calculation weights
   */
  complexityWeights?: {
    fieldWeight?: number;
    nestingWeight?: number;
    fragmentWeight?: number;
    relationshipWeight?: number;
  };
}

/**
 * Calculate the complexity of a GraphQL document
 */
function calculateComplexity(document: DocumentNode, weights?: ComplexityLinkOptions['complexityWeights']): ComplexityScore {
  let fieldCount = 0;
  let nestingDepth = 0;
  let fragmentCount = 0;
  let currentDepth = 0;
  let maxDepth = 0;

  // Count fragments
  document.definitions.forEach(definition => {
    if (definition.kind === "FragmentDefinition") {
      fragmentCount++;
    }
  });

  // Analyze query structure
  visit(document, {
    Field: {
      enter: (node: FieldNode) => {
        fieldCount++;
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
        
        // Extra weight for relationship fields (fields with selections)
        if (node.selectionSet && node.selectionSet.selections.length > 0) {
          fieldCount += weights?.relationshipWeight || 1.5;
        }
      },
      leave: () => {
        currentDepth--;
      }
    },
    InlineFragment: {
      enter: () => {
        fragmentCount += 0.5; // Inline fragments are lighter than named fragments
      }
    }
  });

  nestingDepth = maxDepth;

  // Calculate weighted complexity score
  const queryComplexity = 
    (fieldCount * (weights?.fieldWeight || 1)) +
    (nestingDepth * (weights?.nestingWeight || 2)) +
    (fragmentCount * (weights?.fragmentWeight || 0.5));

  return {
    queryComplexity,
    fieldCount,
    nestingDepth,
    fragmentCount
  };
}

/**
 * Get operation type from document
 */
function getOperationType(document: DocumentNode): string {
  const operationDef = document.definitions.find(
    def => def.kind === "OperationDefinition"
  ) as any;
  
  return operationDef?.operation || "query";
}

/**
 * Get operation name from document
 */
function getOperationName(document: DocumentNode): string {
  const operationDef = document.definitions.find(
    def => def.kind === "OperationDefinition"
  ) as any;
  
  return operationDef?.name?.value || "anonymous";
}

/**
 * Query Complexity Analysis Link
 */
export class ComplexityLink extends ApolloLink {
  private options: Required<ComplexityLinkOptions>;

  constructor(options: ComplexityLinkOptions = {}) {
    super();
    
    this.options = {
      maxQueryComplexity: options.maxQueryComplexity ?? 1000,
      maxMutationComplexity: options.maxMutationComplexity ?? 500,
      maxSubscriptionComplexity: options.maxSubscriptionComplexity ?? 200,
      maxNestingDepth: options.maxNestingDepth ?? 10,
      maxFieldCount: options.maxFieldCount ?? 100,
      blockExcessiveQueries: options.blockExcessiveQueries ?? false,
      enableLogging: options.enableLogging ?? (process.env.NODE_ENV === "development"),
      complexityWeights: {
        fieldWeight: 1,
        nestingWeight: 2,
        fragmentWeight: 0.5,
        relationshipWeight: 1.5,
        ...options.complexityWeights,
      },
    };
  }

  request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    const { query } = operation;
    const operationType = getOperationType(query);
    const operationName = getOperationName(query);
    
    // Calculate complexity
    const complexity = calculateComplexity(query, this.options.complexityWeights);
    
    // Determine complexity limit based on operation type
    let maxComplexity: number;
    switch (operationType) {
      case "mutation":
        maxComplexity = this.options.maxMutationComplexity;
        break;
      case "subscription":
        maxComplexity = this.options.maxSubscriptionComplexity;
        break;
      default:
        maxComplexity = this.options.maxQueryComplexity;
        break;
    }
    
    // Check if query exceeds limits
    const exceedsComplexity = complexity.queryComplexity > maxComplexity;
    const exceedsDepth = complexity.nestingDepth > this.options.maxNestingDepth;
    const exceedsFieldCount = complexity.fieldCount > this.options.maxFieldCount;
    
    const hasViolations = exceedsComplexity || exceedsDepth || exceedsFieldCount;
    
    // Log complexity analysis in development
    if (this.options.enableLogging) {
      const violationWarnings = [];
      if (exceedsComplexity) {
        violationWarnings.push(`Complexity: ${complexity.queryComplexity} > ${maxComplexity}`);
      }
      if (exceedsDepth) {
        violationWarnings.push(`Depth: ${complexity.nestingDepth} > ${this.options.maxNestingDepth}`);
      }
      if (exceedsFieldCount) {
        violationWarnings.push(`Fields: ${complexity.fieldCount} > ${this.options.maxFieldCount}`);
      }
      
      if (violationWarnings.length > 0) {
        console.warn(
          `🚨 GraphQL Query Complexity Warning: ${operationName} (${operationType})`,
          `\n  Violations: ${violationWarnings.join(", ")}`,
          `\n  Analysis:`,
          `\n    - Complexity Score: ${complexity.queryComplexity}`,
          `\n    - Field Count: ${complexity.fieldCount}`,
          `\n    - Nesting Depth: ${complexity.nestingDepth}`,
          `\n    - Fragment Count: ${complexity.fragmentCount}`,
          `\n  Consider optimizing this query for better performance.`
        );
      } else if (complexity.queryComplexity > maxComplexity * 0.7) {
        // Warn when approaching limits
        console.info(
          `⚠️ GraphQL Query approaching complexity limit: ${operationName}`,
          `\n  Complexity: ${complexity.queryComplexity}/${maxComplexity}`,
          `\n  Consider monitoring this query's performance.`
        );
      }
    }
    
    // Block query if configured to do so and limits are exceeded
    if (this.options.blockExcessiveQueries && hasViolations) {
      return new Observable(observer => {
        const errorMessage = `Query complexity exceeded limits: ${operationName} (${operationType})`;
        const violationDetails = [];
        
        if (exceedsComplexity) {
          violationDetails.push(`complexity: ${complexity.queryComplexity} > ${maxComplexity}`);
        }
        if (exceedsDepth) {
          violationDetails.push(`depth: ${complexity.nestingDepth} > ${this.options.maxNestingDepth}`);
        }
        if (exceedsFieldCount) {
          violationDetails.push(`fields: ${complexity.fieldCount} > ${this.options.maxFieldCount}`);
        }
        
        observer.error(new Error(`${errorMessage}. Violations: ${violationDetails.join(", ")}`));
      });
    }
    
    // Add complexity metrics to operation context for monitoring
    operation.setContext({
      ...operation.getContext(),
      complexityAnalysis: {
        ...complexity,
        operationType,
        operationName,
        withinLimits: !hasViolations,
        limits: {
          maxComplexity,
          maxNestingDepth: this.options.maxNestingDepth,
          maxFieldCount: this.options.maxFieldCount,
        }
      }
    });
    
    // Continue with the operation
    return forward(operation);
  }
}

/**
 * Create Query Complexity Link with default configuration optimized for the payroll system
 */
export function createComplexityLink(options?: ComplexityLinkOptions): ComplexityLink {
  return new ComplexityLink({
    // Conservative limits for production stability
    maxQueryComplexity: 800,      // Reasonable for dashboard queries
    maxMutationComplexity: 400,   // Mutations should be focused
    maxSubscriptionComplexity: 150, // Keep subscriptions lightweight
    maxNestingDepth: 8,           // Prevent deeply nested queries
    maxFieldCount: 75,            // Reasonable field limit
    blockExcessiveQueries: false, // Warn only by default
    enableLogging: process.env.NODE_ENV === "development",
    complexityWeights: {
      fieldWeight: 1,
      nestingWeight: 3,     // Heavily penalize deep nesting
      fragmentWeight: 0.3,  // Fragments are good for reuse
      relationshipWeight: 2, // Relationships can be expensive
    },
    ...options,
  });
}

/**
 * Create strict complexity link for production environments
 */
export function createStrictComplexityLink(): ComplexityLink {
  return new ComplexityLink({
    maxQueryComplexity: 500,
    maxMutationComplexity: 300,
    maxSubscriptionComplexity: 100,
    maxNestingDepth: 6,
    maxFieldCount: 50,
    blockExcessiveQueries: process.env.NODE_ENV === "production",
    enableLogging: true,
    complexityWeights: {
      fieldWeight: 1,
      nestingWeight: 4,
      fragmentWeight: 0.2,
      relationshipWeight: 3,
    },
  });
}

/**
 * Create permissive complexity link for development/testing
 */
export function createPermissiveComplexityLink(): ComplexityLink {
  return new ComplexityLink({
    maxQueryComplexity: 2000,
    maxMutationComplexity: 1000,
    maxSubscriptionComplexity: 500,
    maxNestingDepth: 15,
    maxFieldCount: 200,
    blockExcessiveQueries: false,
    enableLogging: true,
    complexityWeights: {
      fieldWeight: 0.5,
      nestingWeight: 1,
      fragmentWeight: 0.1,
      relationshipWeight: 1,
    },
  });
}