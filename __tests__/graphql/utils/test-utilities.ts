/**
 * Enhanced GraphQL Test Utilities
 * 
 * Comprehensive utilities for testing GraphQL operations across all domains
 * with multi-role authentication and domain-specific helpers.
 */

import { parse, validate, buildSchema, DocumentNode, GraphQLSchema } from 'graphql';
import { readFileSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

// Test user configurations for each role
export const TEST_USERS = {
  developer: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'developer@test-payroll.com',
    name: 'Test Developer',
    role: 'developer',
    clerkUserId: 'clerk_dev_test',
    permissions: 'ALL'
  },
  org_admin: {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'admin@test-payroll.com',
    name: 'Test Admin',
    role: 'org_admin',
    clerkUserId: 'clerk_admin_test',
    permissions: 'ADMIN_LEVEL'
  },
  manager: {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'manager@test-payroll.com',
    name: 'Test Manager',
    role: 'manager',
    clerkUserId: 'clerk_manager_test',
    permissions: 'MANAGER_LEVEL'
  },
  consultant: {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'consultant@test-payroll.com',
    name: 'Test Consultant',
    role: 'consultant',
    clerkUserId: 'clerk_consultant_test',
    permissions: 'CONSULTANT_LEVEL'
  },
  viewer: {
    id: '550e8400-e29b-41d4-a716-446655440004',
    email: 'viewer@test-payroll.com',
    name: 'Test Viewer',
    role: 'viewer',
    clerkUserId: 'clerk_viewer_test',
    permissions: 'VIEWER_LEVEL'
  }
};

export type UserRole = keyof typeof TEST_USERS;

// Domain classifications for security testing
export const DOMAIN_SECURITY_LEVELS = {
  auth: 'CRITICAL',
  audit: 'CRITICAL', 
  permissions: 'CRITICAL',
  users: 'HIGH',
  clients: 'HIGH',
  billing: 'HIGH',
  email: 'HIGH',
  payrolls: 'MEDIUM',
  notes: 'MEDIUM',
  leave: 'MEDIUM',
  'work-schedule': 'MEDIUM',
  'external-systems': 'MEDIUM'
} as const;

export type SecurityLevel = typeof DOMAIN_SECURITY_LEVELS[keyof typeof DOMAIN_SECURITY_LEVELS];

// GraphQL operation types
export interface GraphQLOperation {
  name: string;
  type: 'query' | 'mutation' | 'subscription' | 'fragment';
  document: DocumentNode;
  filePath: string;
  domain: string;
  securityLevel: SecurityLevel;
  variables?: Record<string, any>;
  expectedRoles?: UserRole[];
  shouldFailForRoles?: UserRole[];
}

// Test data generators for each domain
export class TestDataGenerators {
  static user(overrides: Partial<typeof TESTUSERS.developer> = {}) {
    return {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Test User',
      email: 'test@example.com',
      role: 'consultant',
      isActive: true,
      isStaff: true,
      clerkUserId: 'clerk_test_user',
      username: 'testuser',
      image: null,
      managerId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides
    };
  }

  static client(overrides: Partial<any> = {}) {
    return {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Test Client Ltd',
      active: true,
      contactPerson: 'John Doe',
      contactEmail: 'john@testclient.com',
      contactPhone: '+61400000000',
      address: '123 Test Street, Sydney NSW 2000',
      abn: '12 345 678 901',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides
    };
  }

  static payroll(overrides: Partial<any> = {}) {
    return {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Test Payroll',
      status: 'Active',
      employeeCount: 25,
      clientId: '550e8400-e29b-41d4-a716-446655440001',
      primaryConsultantId: '550e8400-e29b-41d4-a716-446655440003',
      backupConsultantId: null,
      managerId: '550e8400-e29b-41d4-a716-446655440002',
      payrollCycleId: '550e8400-e29b-41d4-a716-446655440010',
      supersededDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides
    };
  }

  static auditLog(overrides: Partial<any> = {}) {
    return {
      id: '550e8400-e29b-41d4-a716-446655440005',
      userId: '550e8400-e29b-41d4-a716-446655440000',
      action: 'READ',
      resourceType: 'users',
      resourceId: '550e8400-e29b-41d4-a716-446655440000',
      ipAddress: '192.168.1.1',
      userAgent: 'Jest Test Runner',
      metadata: {},
      timestamp: new Date().toISOString(),
      ...overrides
    };
  }

  static note(overrides: Partial<any> = {}) {
    return {
      id: '550e8400-e29b-41d4-a716-446655440006',
      title: 'Test Note',
      content: 'This is a test note for GraphQL testing',
      authorId: '550e8400-e29b-41d4-a716-446655440000',
      entityType: 'payroll',
      entityId: '550e8400-e29b-41d4-a716-446655440002',
      isPrivate: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides
    };
  }

  static billingEvent(overrides: Partial<any> = {}) {
    return {
      id: '550e8400-e29b-41d4-a716-446655440007',
      clientId: '550e8400-e29b-41d4-a716-446655440001',
      payrollId: '550e8400-e29b-41d4-a716-446655440002',
      eventType: 'payroll_processing',
      amount: 2500.00,
      description: 'Test payroll processing fee',
      billingDate: new Date().toISOString(),
      status: 'pending',
      ...overrides
    };
  }

  static workScheduleAssignment(overrides: Partial<any> = {}) {
    return {
      id: '550e8400-e29b-41d4-a716-446655440008',
      userId: '550e8400-e29b-41d4-a716-446655440003',
      payrollId: '550e8400-e29b-41d4-a716-446655440002',
      assignmentDate: new Date().toISOString(),
      estimatedHours: 8.0,
      actualHours: null,
      status: 'assigned',
      priority: 'medium',
      ...overrides
    };
  }

  static leave(overrides: Partial<any> = {}) {
    return {
      id: '550e8400-e29b-41d4-a716-446655440009',
      userId: '550e8400-e29b-41d4-a716-446655440000',
      leaveType: 'annual',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      totalDays: 7,
      status: 'approved',
      reason: 'Vacation',
      ...overrides
    };
  }
}

// GraphQL operation discovery utilities
export class GraphQLOperationDiscovery {
  private schema: GraphQLSchema;
  
  constructor() {
    const schemaPath = join(process.cwd(), 'shared/schema/schema.graphql');
    const schemaSDL = readFileSync(schemaPath, 'utf8');
    this.schema = buildSchema(schemaSDL);
  }

  /**
   * Discover all GraphQL operations across all domains
   */
  async discoverAllOperations(): Promise<GraphQLOperation[]> {
    const operations: GraphQLOperation[] = [];
    
    // Get all GraphQL files
    const graphqlFiles = await this.getGraphQLFiles();
    
    for (const filePath of graphqlFiles) {
      const fileOperations = await this.parseOperationsFromFile(filePath);
      operations.push(...fileOperations);
    }
    
    return operations;
  }

  /**
   * Get all GraphQL files from domains and shared
   */
  private async getGraphQLFiles(): Promise<string[]> {
    const patterns = [
      'domains/*/graphql/*.graphql',
      'shared/graphql/*.graphql'
    ];
    
    const files: string[] = [];
    for (const pattern of patterns) {
      const matchedFiles = await glob(pattern, { cwd: process.cwd() });
      files.push(...matchedFiles);
    }
    
    return files;
  }

  /**
   * Parse GraphQL operations from a file
   */
  private async parseOperationsFromFile(filePath: string): Promise<GraphQLOperation[]> {
    const content = readFileSync(join(process.cwd(), filePath), 'utf8');
    const operations: GraphQLOperation[] = [];
    
    // Extract domain from file path
    const domain = this.extractDomainFromPath(filePath);
    const securityLevel = DOMAIN_SECURITY_LEVELS[domain as keyof typeof DOMAIN_SECURITY_LEVELS] || 'MEDIUM';
    
    // Split content by operation boundaries
    const operationBlocks = content
      .split(/(?=query\s|mutation\s|subscription\s|fragment\s)/)
      .filter(block => block.trim().length > 0)
      .filter(block => !block.trim().startsWith('#'));

    for (const block of operationBlocks) {
      if (block.trim()) {
        try {
          const document = parse(block);
          const operationName = this.extractOperationName(block);
          const operationType = this.extractOperationType(block);
          
          if (operationName && operationType) {
            operations.push({
              name: operationName,
              type: operationType,
              document,
              filePath,
              domain,
              securityLevel,
              expectedRoles: this.getExpectedRoles(operationType, securityLevel),
              shouldFailForRoles: this.getShouldFailRoles(operationType, securityLevel)
            });
          }
        } catch (error) {
          console.warn(`Failed to parse operation in ${filePath}: ${error.message}`);
        }
      }
    }
    
    return operations;
  }

  /**
   * Extract domain from file path
   */
  private extractDomainFromPath(filePath: string): string {
    const match = filePath.match(/domains\/([^\/]+)\//);
    return match ? match[1] : 'shared';
  }

  /**
   * Extract operation name from GraphQL block
   */
  private extractOperationName(block: string): string | null {
    const match = block.match(/(?:query|mutation|subscription|fragment)\s+(\w+)/);
    return match ? match[1] : null;
  }

  /**
   * Extract operation type from GraphQL block
   */
  private extractOperationType(block: string): GraphQLOperation['type'] | null {
    if (block.includes('query ')) return 'query';
    if (block.includes('mutation ')) return 'mutation';
    if (block.includes('subscription ')) return 'subscription';
    if (block.includes('fragment ')) return 'fragment';
    return null;
  }

  /**
   * Get expected roles for operation based on type and security level
   */
  private getExpectedRoles(type: string, securityLevel: SecurityLevel): UserRole[] {
    if (securityLevel === 'CRITICAL') {
      if (type === 'mutation') {
        return ['developer', 'org_admin']; // Only highest roles can modify critical data
      }
      return ['developer', 'org_admin', 'manager']; // Read access for managers
    }
    
    if (securityLevel === 'HIGH') {
      if (type === 'mutation') {
        return ['developer', 'org_admin', 'manager']; // Managers can modify high-level data
      }
      return ['developer', 'org_admin', 'manager', 'consultant']; // Consultants can read
    }
    
    // MEDIUM security level
    return ['developer', 'org_admin', 'manager', 'consultant']; // All except viewer for operations
  }

  /**
   * Get roles that should fail for operation
   */
  private getShouldFailRoles(type: string, securityLevel: SecurityLevel): UserRole[] {
    if (securityLevel === 'CRITICAL') {
      if (type === 'mutation') {
        return ['manager', 'consultant', 'viewer'];
      }
      return ['consultant', 'viewer'];
    }
    
    if (securityLevel === 'HIGH') {
      if (type === 'mutation') {
        return ['consultant', 'viewer'];
      }
      return ['viewer'];
    }
    
    // MEDIUM security level
    if (type === 'mutation') {
      return ['viewer'];
    }
    return [];
  }

  /**
   * Validate operation against schema
   */
  validateOperation(operation: GraphQLOperation): { valid: boolean; errors: string[] } {
    try {
      const errors = validate(this.schema, operation.document);
      return {
        valid: errors.length === 0,
        errors: errors.map(error => error.message)
      };
    } catch (error) {
      return {
        valid: false,
        errors: [error.message]
      };
    }
  }
}

// Authentication helpers for testing
export class AuthenticationHelper {
  /**
   * Create mock headers for a specific user role
   */
  static createAuthHeaders(role: UserRole): Record<string, string> {
    const user = TEST_USERS[role];
    
    return {
      'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET || '',
      'x-hasura-user-id': user.id,
      'x-hasura-role': user.role,
      'x-hasura-allowed-roles': JSON.stringify([user.role]),
      'x-hasura-permissions': user.permissions
    };
  }

  /**
   * Create JWT claims for a specific user role
   */
  static createJWTClaims(role: UserRole) {
    const user = TEST_USERS[role];
    
    return {
      sub: user.clerkUserId,
      email: user.email,
      name: user.name,
      metadata: {
        databaseId: user.id,
        role: user.role,
        permissions: user.permissions,
        isStaff: true,
        isActive: true
      }
    };
  }

  /**
   * Check if a role should have access to an operation
   */
  static shouldHaveAccess(role: UserRole, operation: GraphQLOperation): boolean {
    return operation.expectedRoles?.includes(role) ?? false;
  }

  /**
   * Check if a role should fail for an operation
   */
  static shouldFail(role: UserRole, operation: GraphQLOperation): boolean {
    return operation.shouldFailForRoles?.includes(role) ?? false;
  }
}

// Performance testing utilities
export class PerformanceTestUtils {
  /**
   * Measure operation execution time
   */
  static async measureExecutionTime<T>(
    operation: () => Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const start = Date.now();
    const result = await operation();
    const duration = Date.now() - start;
    
    return { result, duration };
  }

  /**
   * Analyze query complexity
   */
  static analyzeComplexity(operation: GraphQLOperation): {
    fieldCount: number;
    maxDepth: number;
    complexityScore: number;
  } {
    let fieldCount = 0;
    let maxDepth = 0;

    const traverse = (node: any, depth = 0) => {
      maxDepth = Math.max(maxDepth, depth);

      if (node.kind === 'Field') {
        fieldCount++;
      }

      if (node.selectionSet) {
        node.selectionSet.selections.forEach((selection: any) => {
          traverse(selection, depth + 1);
        });
      }

      Object.values(node).forEach(value => {
        if (Array.isArray(value)) {
          value.forEach(item => {
            if (item && typeof item === 'object' && item.kind) {
              traverse(item, depth);
            }
          });
        }
      });
    };

    operation.document.definitions.forEach(definition => traverse(definition));

    const complexityScore = fieldCount * 1 + maxDepth * 2;

    return { fieldCount, maxDepth, complexityScore };
  }
}

// Export all utilities
export const testUtils = {
  TestDataGenerators,
  GraphQLOperationDiscovery,
  AuthenticationHelper,
  PerformanceTestUtils,
  TEST_USERS,
  DOMAIN_SECURITY_LEVELS
};