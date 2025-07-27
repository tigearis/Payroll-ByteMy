/**
 * Authentication Testing Utilities
 * 
 * Provides utilities for testing GraphQL operations with different user roles
 * and permission levels, integrating with the existing Clerk/Hasura authentication system.
 */

import fetch from 'cross-fetch';
import { UserRole, TEST_USERS, AuthenticationHelper } from './test-utilities';

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: {
      code?: string;
      path?: string[];
    };
  }>;
}

export interface TestExecutionResult<T = any> {
  success: boolean;
  data?: T;
  errors?: string[];
  statusCode?: number;
  executionTime: number;
}

/**
 * GraphQL Test Client for multi-role testing
 */
export class GraphQLTestClient {
  private endpoint: string;
  private adminSecret: string;

  constructor() {
    this.endpoint = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || '';
    this.adminSecret = process.env.HASURA_GRAPHQL_ADMIN_SECRET || '';
    
    if (!this.endpoint || !this.adminSecret) {
      throw new Error('Missing required environment variables for GraphQL testing');
    }
  }

  /**
   * Execute a GraphQL operation as a specific user role
   */
  async executeAsRole<T = any>(
    operation: string,
    variables: Record<string, any> = {},
    role: UserRole
  ): Promise<TestExecutionResult<T>> {
    const startTime = Date.now();
    
    try {
      const headers = this.createHeadersForRole(role);
      
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({
          query: operation,
          variables
        })
      });

      const result: GraphQLResponse<T> = await response.json();
      const executionTime = Date.now() - startTime;

      if (result.errors && result.errors.length > 0) {
        return {
          success: false,
          errors: result.errors.map(error => error.message),
          statusCode: response.status,
          executionTime
        };
      }

      return {
        success: true,
        data: result.data,
        statusCode: response.status,
        executionTime
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      return {
        success: false,
        errors: [error.message],
        executionTime
      };
    }
  }

  /**
   * Execute operation with admin privileges (for setup/teardown)
   */
  async executeAsAdmin<T = any>(
    operation: string,
    variables: Record<string, any> = {}
  ): Promise<TestExecutionResult<T>> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': this.adminSecret
        },
        body: JSON.stringify({
          query: operation,
          variables
        })
      });

      const result: GraphQLResponse<T> = await response.json();
      const executionTime = Date.now() - startTime;

      if (result.errors && result.errors.length > 0) {
        return {
          success: false,
          errors: result.errors.map(error => error.message),
          statusCode: response.status,
          executionTime
        };
      }

      return {
        success: true,
        data: result.data,
        statusCode: response.status,
        executionTime
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      return {
        success: false,
        errors: [error.message],
        executionTime
      };
    }
  }

  /**
   * Test operation across all user roles
   */
  async testAcrossAllRoles<T = any>(
    operation: string,
    variables: Record<string, any> = {},
    expectedRoles: UserRole[] = [],
    shouldFailRoles: UserRole[] = []
  ): Promise<Record<UserRole, TestExecutionResult<T>>> {
    const results: Partial<Record<UserRole, TestExecutionResult<T>>> = {};
    
    for (const role of Object.keys(TEST_USERS) as UserRole[]) {
      results[role] = await this.executeAsRole<T>(operation, variables, role);
    }
    
    return results as Record<UserRole, TestExecutionResult<T>>;
  }

  /**
   * Create appropriate headers for a specific role
   */
  private createHeadersForRole(role: UserRole): Record<string, string> {
    const user = TEST_USERS[role];
    
    // Use admin secret for testing, but with role-specific claims
    return {
      'x-hasura-admin-secret': this.adminSecret,
      'x-hasura-user-id': user.id,
      'x-hasura-role': user.role,
      'x-hasura-allowed-roles': `["${user.role}"]`,
      'x-hasura-is-staff': 'true',
      'x-hasura-is-active': 'true'
    };
  }
}

/**
 * Permission Testing Utilities
 */
export class PermissionTester {
  private client: GraphQLTestClient;

  constructor() {
    this.client = new GraphQLTestClient();
  }

  /**
   * Test that an operation works for expected roles and fails for others
   */
  async testPermissionBoundaries(
    operationName: string,
    operation: string,
    variables: Record<string, any> = {},
    expectedRoles: UserRole[] = [],
    shouldFailRoles: UserRole[] = []
  ): Promise<{
    passed: boolean;
    results: Record<UserRole, TestExecutionResult>;
    violations: string[];
  }> {
    const results = await this.client.testAcrossAllRoles(operation, variables);
    const violations: string[] = [];
    
    // Check that expected roles succeed
    for (const role of expectedRoles) {
      if (!results[role].success) {
        violations.push(`Expected ${role} to succeed for ${operationName}, but failed: ${results[role].errors?.join(', ')}`);
      }
    }
    
    // Check that restricted roles fail
    for (const role of shouldFailRoles) {
      if (results[role].success) {
        violations.push(`Expected ${role} to fail for ${operationName}, but succeeded`);
      }
    }
    
    return {
      passed: violations.length === 0,
      results,
      violations
    };
  }

  /**
   * Test hierarchical permissions (higher roles should have access to lower role operations)
   */
  async testHierarchicalAccess(
    operation: string,
    variables: Record<string, any> = {},
    minimumRole: UserRole
  ): Promise<{ passed: boolean; violations: string[] }> {
    const roleHierarchy: UserRole[] = ['viewer', 'consultant', 'manager', 'org_admin', 'developer'];
    const minimumIndex = roleHierarchy.indexOf(minimumRole);
    const violations: string[] = [];
    
    for (let i = 0; i < roleHierarchy.length; i++) {
      const role = roleHierarchy[i];
      const result = await this.client.executeAsRole(operation, variables, role);
      
      if (i >= minimumIndex) {
        // Should succeed
        if (!result.success) {
          violations.push(`Expected ${role} (hierarchy level ${i}) to succeed with minimum role ${minimumRole}, but failed`);
        }
      } else {
        // Should fail
        if (result.success) {
          violations.push(`Expected ${role} (hierarchy level ${i}) to fail with minimum role ${minimumRole}, but succeeded`);
        }
      }
    }
    
    return {
      passed: violations.length === 0,
      violations
    };
  }
}

/**
 * Test Data Setup and Cleanup
 */
export class TestDataManager {
  private client: GraphQLTestClient;

  constructor() {
    this.client = new GraphQLTestClient();
  }

  /**
   * Set up test users in the database if they don't exist
   */
  async setupTestUsers(): Promise<void> {
    for (const [role, userData] of Object.entries(TEST_USERS)) {
      const checkUserQuery = `
        query CheckUser($id: uuid!) {
          users(where: { id: { _eq: $id } }) {
            id
            name
            email
            role
          }
        }
      `;

      const userExists = await this.client.executeAsAdmin(checkUserQuery, { id: userData.id });
      
      if (!userExists.success || !userExists.data?.users?.length) {
        // Create test user
        const createUserMutation = `
          mutation CreateTestUser($object: users_insert_input!) {
            insert_users_one(object: $object) {
              id
              name
              email
              role
            }
          }
        `;

        await this.client.executeAsAdmin(createUserMutation, {
          object: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            clerkUserId: userData.clerkUserId,
            isActive: true,
            isStaff: true,
            username: userData.email.split('@')[0]
          }
        });
      }
    }
  }

  /**
   * Clean up test data after tests
   */
  async cleanupTestData(): Promise<void> {
    // Delete test users (mark as inactive instead of hard delete)
    const deactivateUsersQuery = `
      mutation DeactivateTestUsers($userIds: [uuid!]!) {
        update_users(
          where: { id: { _in: $userIds } }
          _set: { isActive: false, deactivatedAt: "now()" }
        ) {
          affected_rows
        }
      }
    `;

    const userIds = Object.values(TEST_USERS).map(user => user.id);
    await this.client.executeAsAdmin(deactivateUsersQuery, { userIds });
  }

  /**
   * Create test client data
   */
  async setupTestClient(): Promise<string> {
    const createClientMutation = `
      mutation CreateTestClient($object: clients_insert_input!) {
        insert_clients_one(object: $object) {
          id
          name
        }
      }
    `;

    const testClientId = '550e8400-e29b-41d4-a716-446655440100';
    const result = await this.client.executeAsAdmin(createClientMutation, {
      object: {
        id: testClientId,
        name: 'Test Client for GraphQL Testing',
        active: true,
        contactPerson: 'Test Contact',
        contactEmail: 'test@testclient.com'
      }
    });

    return testClientId;
  }

  /**
   * Create test payroll data
   */
  async setupTestPayroll(clientId?: string): Promise<string> {
    const testClientId = clientId || await this.setupTestClient();
    
    const createPayrollMutation = `
      mutation CreateTestPayroll($object: payrolls_insert_input!) {
        insert_payrolls_one(object: $object) {
          id
          name
        }
      }
    `;

    const testPayrollId = '550e8400-e29b-41d4-a716-446655440200';
    await this.client.executeAsAdmin(createPayrollMutation, {
      object: {
        id: testPayrollId,
        name: 'Test Payroll for GraphQL Testing',
        status: 'Active',
        employeeCount: 10,
        clientId: testClientId,
        primaryConsultantId: TESTUSERS.consultant.id
      }
    });

    return testPayrollId;
  }
}

// Export utilities
export const authTestUtils = {
  GraphQLTestClient,
  PermissionTester,
  TestDataManager
};