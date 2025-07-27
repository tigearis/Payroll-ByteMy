#!/usr/bin/env ts-node

/**
 * Comprehensive Hasura GraphQL Operations Testing Script
 * 
 * This script tests all GraphQL operations across all user roles to identify
 * permission issues, missing fields, and other GraphQL errors.
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// ES module equivalent of __dirname
const filename = fileURLToPath(import.meta.url);
const dirname = dirname(filename);

// Load environment variables
config({ path: resolve(__dirname, '../.env') });

interface TestOperation {
  name: string;
  type: 'query' | 'mutation' | 'subscription';
  operation: string;
  variables?: Record<string, any>;
  expectedRoles: string[];
  shouldFailForRoles?: string[];
  domain: string;
}

interface TestResult {
  operation: string;
  role: string;
  success: boolean;
  error?: string;
  response?: any;
  executionTime?: number;
}

// Environment validation
const HASURA_ENDPOINT = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

if (!HASURA_ENDPOINT || !ADMIN_SECRET) {
  console.error('❌ Missing required environment variables:');
  console.error('  NEXT_PUBLIC_HASURA_GRAPHQL_URL:', !!HASURA_ENDPOINT);
  console.error('  HASURA_GRAPHQL_ADMIN_SECRET:', !!ADMIN_SECRET);
  process.exit(1);
}

// TypeScript type guards
const hasuraEndpoint: string = HASURA_ENDPOINT;
const adminSecret: string = ADMIN_SECRET;

console.log('🔧 Environment Configuration:');
console.log('  Hasura Endpoint:', HASURA_ENDPOINT);
console.log('  Admin Secret:', ADMIN_SECRET ? '✓ Present' : '❌ Missing');
console.log('');

// All user roles defined in the system
const USER_ROLES = [
  'developer',
  'org_admin', 
  'manager',
  'consultant',
  'viewer',
  'anonymous' // For testing unauthorized access
];

// Comprehensive list of ALL GraphQL operations from the codebase
const ALL_OPERATIONS: TestOperation[] = [
  // ============================================
  // USER MANAGEMENT OPERATIONS
  // ============================================
  {
    name: 'GetUsers',
    type: 'query',
    domain: 'users',
    operation: `
      query GetUsers($limit: Int, $offset: Int, $where: usersBoolExp) {
        users(limit: $limit, offset: $offset, where: $where, orderBy: {createdAt: DESC}) {
          id
          name
          email
          role
          isStaff
          clerkUserId
          createdAt
          updatedAt
          managerId
        }
        usersAggregate(where: $where) {
          aggregate {
            count
          }
        }
      }
    `,
    variables: { limit: 10, offset: 0 },
    expectedRoles: ['developer', 'org_admin', 'manager'],
    shouldFailForRoles: ['consultant', 'viewer', 'anonymous']
  },
  
  {
    name: 'GetUsersForDropdown',
    type: 'query', 
    domain: 'users',
    operation: `
      query GetUsersForDropdown {
        users(where: {isActive: {_eq: true}}, orderBy: {name: ASC}) {
          id
          name
          email
          role
        }
      }
    `,
    expectedRoles: ['developer', 'org_admin', 'manager', 'consultant'],
    shouldFailForRoles: ['viewer', 'anonymous']
  },

  {
    name: 'GetManagers',
    type: 'query',
    domain: 'users', 
    operation: `
      query GetManagers {
        users(
          where: {
            _and: [
              {isActive: {_eq: true}},
              {role: {_in: ["manager", "org_admin", "developer"]}}
            ]
          },
          orderBy: {name: ASC}
        ) {
          id
          name
          email
          role
        }
      }
    `,
    expectedRoles: ['developer', 'org_admin', 'manager'],
    shouldFailForRoles: ['consultant', 'viewer', 'anonymous']
  },

  {
    name: 'GetCurrentUser',
    type: 'query',
    domain: 'users',
    operation: `
      query GetCurrentUser {
        users(limit: 1) {
          id
          name
          email
          role
          isStaff
          clerkUserId
          managerId
          createdAt
          updatedAt
        }
      }
    `,
    expectedRoles: ['developer', 'org_admin', 'manager', 'consultant', 'viewer'],
    shouldFailForRoles: ['anonymous']
  },

  {
    name: 'CreateUser',
    type: 'mutation',
    domain: 'users',
    operation: `
      mutation CreateUser(
        $name: String!,
        $email: String!,
        $role: String!,
        $isStaff: Boolean = true,
        $managerId: String = null,
        $clerkUserId: String = null
      ) {
        insertUsersOne(object: {
          name: $name,
          email: $email,
          role: $role,
          isStaff: $isStaff,
          managerId: $managerId,
          clerkUserId: $clerkUserId,
          isActive: true
        }) {
          id
          name
          email
          role
          createdAt
        }
      }
    `,
    variables: {
      name: 'Test User',
      email: 'test@example.com',
      role: 'viewer'
    },
    expectedRoles: ['developer', 'org_admin', 'manager'],
    shouldFailForRoles: ['consultant', 'viewer', 'anonymous']
  },

  // ============================================
  // CLIENT MANAGEMENT OPERATIONS
  // ============================================
  {
    name: 'GetClients',
    type: 'query',
    domain: 'clients',
    operation: `
      query GetClients {
        clients(where: {is_active: {_eq: true}}, order_by: {name: asc}) {
          id
          name
          contact_email
          contact_phone
          address
          abn
          is_active
          created_at
          updated_at
        }
      }
    `,
    expectedRoles: ['developer', 'org_admin', 'manager', 'consultant'],
    shouldFailForRoles: ['viewer', 'anonymous']
  },

  {
    name: 'GetAllClientsPaginated',
    type: 'query',
    domain: 'clients', 
    operation: `
      query GetAllClientsPaginated($limit: Int, $offset: Int, $where: clients_bool_exp) {
        clients(limit: $limit, offset: $offset, where: $where, order_by: {created_at: desc}) {
          id
          name
          contact_email
          contact_phone
          address
          abn
          is_active
          created_at
          updated_at
          payrolls_aggregate {
            aggregate {
              count
            }
          }
        }
        clients_aggregate(where: $where) {
          aggregate {
            count
          }
        }
      }
    `,
    variables: { limit: 10, offset: 0 },
    expectedRoles: ['developer', 'org_admin', 'manager', 'consultant'],
    shouldFailForRoles: ['viewer', 'anonymous']
  },

  {
    name: 'GetClientStats',
    type: 'query',
    domain: 'clients',
    operation: `
      query GetClientStats {
        clients_aggregate {
          aggregate {
            count
          }
        }
        active_clients: clients_aggregate(where: {is_active: {_eq: true}}) {
          aggregate {
            count
          }
        }
      }
    `,
    expectedRoles: ['developer', 'org_admin', 'manager', 'consultant'],
    shouldFailForRoles: ['viewer', 'anonymous']
  },

  // ============================================
  // PAYROLL OPERATIONS
  // ============================================
  {
    name: 'GetPayrolls',
    type: 'query',
    domain: 'payrolls',
    operation: `
      query GetPayrolls($limit: Int, $offset: Int, $where: payrolls_bool_exp) {
        payrolls(limit: $limit, offset: $offset, where: $where, order_by: {created_at: desc}) {
          id
          client_id
          frequency
          status
          is_active
          created_at
          updated_at
          client {
            id
            name
          }
          primary_consultant {
            id
            name
            email
          }
        }
        payrolls_aggregate(where: $where) {
          aggregate {
            count
          }
        }
      }
    `,
    variables: { limit: 10, offset: 0 },
    expectedRoles: ['developer', 'org_admin', 'manager', 'consultant'],
    shouldFailForRoles: ['viewer', 'anonymous']
  },

  {
    name: 'GetUpcomingPayrolls',
    type: 'query',
    domain: 'payrolls',
    operation: `
      query GetUpcomingPayrolls {
        payrolls(
          where: {
            _and: [
              {is_active: {_eq: true}},
              {status: {_neq: "completed"}}
            ]
          },
          order_by: {created_at: desc},
          limit: 5
        ) {
          id
          frequency
          status
          client {
            id
            name
          }
          primary_consultant {
            name
          }
        }
      }
    `,
    expectedRoles: ['developer', 'org_admin', 'manager', 'consultant'],
    shouldFailForRoles: ['viewer', 'anonymous']
  },

  // ============================================
  // DASHBOARD OPERATIONS
  // ============================================
  {
    name: 'GetDashboardStats',
    type: 'query',
    domain: 'dashboard',
    operation: `
      query GetDashboardStats {
        clients_aggregate {
          aggregate {
            count
          }
        }
        payrolls_aggregate {
          aggregate {
            count
          }
        }
        active_payrolls: payrolls_aggregate(where: {is_active: {_eq: true}}) {
          aggregate {
            count
          }
        }
        users_aggregate {
          aggregate {
            count
          }
        }
      }
    `,
    expectedRoles: ['developer', 'org_admin', 'manager'],
    shouldFailForRoles: ['consultant', 'viewer', 'anonymous']
  },

  // ============================================
  // AUTHENTICATION/AUDIT OPERATIONS
  // ============================================
  {
    name: 'CreateAuditLog',
    type: 'mutation',
    domain: 'audit',
    operation: `
      mutation CreateAuditLog(
        $userId: String,
        $action: String!,
        $resource: String,
        $metadata: jsonb
      ) {
        insert_audit_logs_one(object: {
          user_id: $userId,
          action: $action,
          resource: $resource,
          metadata: $metadata
        }) {
          id
          created_at
        }
      }
    `,
    variables: {
      action: 'TEST_ACTION',
      resource: 'test_resource',
      metadata: { test: true }
    },
    expectedRoles: ['developer', 'org_admin'],
    shouldFailForRoles: ['manager', 'consultant', 'viewer', 'anonymous']
  }
];

async function testOperationWithRole(
  operation: TestOperation, 
  role: string
): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': adminSecret,
    };

    // Don't set role for anonymous testing
    if (role !== 'anonymous') {
      headers['x-hasura-role'] = role;
    }

    const response = await fetch(hasuraEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: operation.operation,
        variables: operation.variables || {},
      }),
    });

    const result = await response.json();
    const executionTime = Date.now() - startTime;
    
    if (result.errors) {
      return {
        operation: operation.name,
        role,
        success: false,
        error: result.errors[0]?.message || 'Unknown GraphQL error',
        executionTime,
      };
    }

    return {
      operation: operation.name,
      role,
      success: true,
      response: result.data,
      executionTime,
    };
  } catch (error) {
    return {
      operation: operation.name,
      role,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime: Date.now() - startTime,
    };
  }
}

async function runComprehensiveRoleTests(): Promise<void> {
  console.log('🧪 Starting comprehensive Hasura role testing...\n');
  console.log(`Testing ${ALL_OPERATIONS.length} operations across ${USER_ROLES.length} roles\n`);
  
  const allResults: TestResult[] = [];
  let totalTests = 0;
  let completedTests = 0;
  
  // Calculate total tests
  totalTests = ALL_OPERATIONS.length * USER_ROLES.length;
  
  for (const operation of ALL_OPERATIONS) {
    console.log(`\n📋 Testing: ${operation.name} (${operation.type}) - ${operation.domain} domain`);
    console.log('─'.repeat(60));
    
    for (const role of USER_ROLES) {
      const result = await testOperationWithRole(operation, role);
      allResults.push(result);
      completedTests++;
      
      // Check if result matches expectations
      const shouldSucceed = operation.expectedRoles?.includes(role) && 
                           !operation.shouldFailForRoles?.includes(role);
      const actuallySucceeded = result.success;
      
      if (shouldSucceed === actuallySucceeded) {
        if (actuallySucceeded) {
          console.log(`  ✅ ${role.padEnd(12)}: SUCCESS (${result.executionTime}ms)`);
        } else {
          console.log(`  ⚪ ${role.padEnd(12)}: EXPECTED FAILURE`);
        }
      } else {
        if (actuallySucceeded) {
          console.log(`  ⚠️  ${role.padEnd(12)}: UNEXPECTED SUCCESS (should fail)`);
        } else {
          console.log(`  ❌ ${role.padEnd(12)}: UNEXPECTED FAILURE - ${result.error}`);
        }
      }
      
      // Progress indicator
      if (completedTests % 10 === 0) {
        console.log(`\n📊 Progress: ${completedTests}/${totalTests} tests completed (${Math.round(completedTests/totalTests*100)}%)\n`);
      }
    }
  }
  
  // Generate comprehensive report
  generateTestReport(allResults);
}

function generateTestReport(results: TestResult[]): void {
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPREHENSIVE HASURA TEST REPORT');
  console.log('='.repeat(80));
  
  // Summary statistics
  const totalTests = results.length;
  const successfulTests = results.filter(r => r.success).length;
  const failedTests = totalTests - successfulTests;
  
  console.log(`\n📈 SUMMARY STATISTICS:`);
  console.log(`  Total tests run: ${totalTests}`);
  console.log(`  Successful: ${successfulTests} (${Math.round(successfulTests/totalTests*100)}%)`);
  console.log(`  Failed: ${failedTests} (${Math.round(failedTests/totalTests*100)}%)`);
  
  // Performance statistics
  const executionTimes = results.map(r => r.executionTime || 0);
  const avgTime = executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length;
  const maxTime = Math.max(...executionTimes);
  const minTime = Math.min(...executionTimes);
  
  console.log(`\n⏱️  PERFORMANCE STATISTICS:`);
  console.log(`  Average execution time: ${Math.round(avgTime)}ms`);
  console.log(`  Fastest operation: ${minTime}ms`);
  console.log(`  Slowest operation: ${maxTime}ms`);
  
  // Group by operation
  console.log(`\n📋 RESULTS BY OPERATION:`);
  console.log('-'.repeat(80));
  
  const operationGroups = results.reduce((acc, result) => {
    if (!acc[result.operation]) acc[result.operation] = [];
    acc[result.operation].push(result);
    return acc;
  }, {} as Record<string, TestResult[]>);
  
  for (const [operation, operationResults] of Object.entries(operationGroups)) {
    const successes = operationResults.filter(r => r.success);
    const failures = operationResults.filter(r => !r.success);
    
    console.log(`\n${operation}:`);
    console.log(`  ✅ Success (${successes.length}): ${successes.map(r => r.role).join(', ')}`);
    if (failures.length > 0) {
      console.log(`  ❌ Failed (${failures.length}): ${failures.map(r => `${r.role}`).join(', ')}`);
      // Show first error as example
      if (failures[0]) {
        console.log(`     Example error: ${failures[0].error}`);
      }
    }
  }
  
  // Group by role
  console.log(`\n👥 RESULTS BY ROLE:`);
  console.log('-'.repeat(80));
  
  const roleGroups = results.reduce((acc, result) => {
    if (!acc[result.role]) acc[result.role] = [];
    acc[result.role].push(result);
    return acc;
  }, {} as Record<string, TestResult[]>);
  
  for (const [role, roleResults] of Object.entries(roleGroups)) {
    const successes = roleResults.filter(r => r.success);
    const failures = roleResults.filter(r => !r.success);
    
    console.log(`\n${role.toUpperCase()}:`);
    console.log(`  Success rate: ${successes.length}/${roleResults.length} (${Math.round(successes.length/roleResults.length*100)}%)`);
    if (failures.length > 0) {
      console.log(`  Common failures: ${failures.slice(0, 3).map(f => f.operation).join(', ')}`);
    }
  }
  
  // Critical errors section
  const criticalErrors = results.filter(r => 
    !r.success && 
    !r.error?.includes('permission') && 
    !r.error?.includes('access') &&
    r.role !== 'anonymous'
  );
  
  if (criticalErrors.length > 0) {
    console.log(`\n🚨 CRITICAL ERRORS (non-permission issues):`);
    console.log('-'.repeat(80));
    criticalErrors.forEach(error => {
      console.log(`❌ ${error.operation} (${error.role}): ${error.error}`);
    });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ Hasura testing complete!');
  console.log('='.repeat(80));
}

// Main execution
runComprehensiveRoleTests().catch((error) => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});