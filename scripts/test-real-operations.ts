#!/usr/bin/env ts-node

/**
 * Test Real GraphQL Operations
 * 
 * Tests the actual GraphQL operations used in the application
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: resolve(__dirname, '../.env') });

const HASURA_ENDPOINT = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

if (!HASURA_ENDPOINT || !ADMIN_SECRET) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

// TypeScript type guards
const hasuraEndpoint: string = HASURA_ENDPOINT;
const adminSecret: string = ADMIN_SECRET;

console.log('🧪 Testing real GraphQL operations from the application...\n');

// Real operations actually used in the app
const realOperations = [
  {
    name: 'GetUsers - Basic List',
    query: `
      query GetUsers($limit: Int = 50, $offset: Int = 0, $where: usersBoolExp) {
        users(limit: $limit, offset: $offset, where: $where, orderBy: { name: ASC }) {
          id
          name
          email
          role
          isActive
          isStaff
          clerkUserId
          managerId
          createdAt
          updatedAt
        }
      }
    `,
    variables: { limit: 10, offset: 0 },
    roles: ['developer', 'org_admin', 'manager'],
    domain: 'users'
  },
  
  {
    name: 'GetManagers - Manager Dropdown',
    query: `
      query GetManagers {
        users(where: { role: { _in: ["manager", "org_admin"] }, isActive: { _eq: true } }) {
          id
          name
          email
          role
          isActive
          isStaff
          clerkUserId
          managerId
        }
      }
    `,
    roles: ['developer', 'org_admin', 'manager'],
    domain: 'users'
  },
  
  {
    name: 'GetUserStats - Dashboard Statistics',
    query: `
      query GetUserStats {
        usersAggregate {
          aggregate { count }
        }
        activeUsers: usersAggregate(where: { isActive: { _eq: true } }) {
          aggregate { count }
        }
      }
    `,
    roles: ['developer', 'org_admin', 'manager'],
    domain: 'users'
  },

  {
    name: 'GetClientStats - Dashboard Client Stats',
    query: `
      query GetClientStats {
        clientsAggregate {
          aggregate { count }
        }
        active_clients: clientsAggregate(where: { active: { _eq: true } }) {
          aggregate { count }
        }
        inactive_clients: clientsAggregate(where: { active: { _eq: false } }) {
          aggregate { count }
        }
      }
    `,
    roles: ['developer', 'org_admin', 'manager'],
    domain: 'clients'
  },

  {
    name: 'GetClients - Basic Client List',
    query: `
      query GetClients {
        clients(where: { active: { _eq: true } }, orderBy: { name: ASC }) {
          id
          name
          contactEmail
          contactPhone
          contactPerson
          active
          createdAt
          updatedAt
        }
      }
    `,
    roles: ['developer', 'org_admin', 'manager', 'consultant'],
    domain: 'clients'
  },

  {
    name: 'GetPayrollDashboardStats - Dashboard Payroll Stats',
    query: `
      query GetPayrollDashboardStats {
        totalPayrolls: payrollsAggregate(where: { supersededDate: { _isNull: true } }) {
          aggregate { count }
        }
        activePayrolls: payrollsAggregate(where: { supersededDate: { _isNull: true }, status: { _eq: "Active" } }) {
          aggregate { count }
        }
      }
    `,
    roles: ['developer', 'org_admin', 'manager'],
    domain: 'payrolls'
  },

  {
    name: 'GetUpcomingPayrolls - Dashboard Upcoming',
    query: `
      query GetUpcomingPayrolls($limit: Int = 10) {
        payrolls(
          where: {
            supersededDate: { _isNull: true }
            status: { _eq: "Active" }
          }
          orderBy: { updatedAt: DESC }
          limit: $limit
        ) {
          id
          name
          status
          clientId
          employeeCount
          supersededDate
          goLiveDate
          updatedAt
        }
      }
    `,
    variables: { limit: 5 },
    roles: ['developer', 'org_admin', 'manager'],
    domain: 'payrolls'
  },

  {
    name: 'CreateUser - User Creation Mutation',
    query: `
      mutation CreateUserByEmail(
        $name: String!,
        $email: String!,
        $role: user_role!,
        $managerId: uuid,
        $isStaff: Boolean = true,
        $clerkUserId: String
      ) {
        insertUser(
          object: {
            name: $name
            email: $email
            role: $role
            managerId: $managerId
            isStaff: $isStaff
            clerkUserId: $clerkUserId
          }
        ) {
          id
          name
          email
          role
          isStaff
          clerkUserId
          createdAt
        }
      }
    `,
    variables: {
      name: 'Test User GraphQL Fixed',
      email: 'test-graphql-fixed@example.com',
      role: 'viewer'
    },
    roles: ['developer', 'org_admin', 'manager'],
    domain: 'users',
    isMutation: true
  }
];

async function testOperation(op: any, role: string) {
  try {
    // For testing purposes, we'll use a known user ID from the database
    // In real application, this comes from the JWT token
    const testUserId = '7898704c-ee5c-4ade-81f3-80a4388413fb'; // This is from our earlier query
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': adminSecret,
      'x-hasura-role': role,
    };

    // Add session variables that might be required for permission rules
    if (role !== 'anonymous' && role !== 'developer') {
      headers['x-hasura-user-id'] = testUserId;
    }

    const response = await fetch(hasuraEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: op.query,
        variables: op.variables || {}
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      return {
        success: false,
        error: result.errors[0]?.message || 'Unknown error'
      };
    }

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

async function runRealOperationTests() {
  console.log('Testing real GraphQL operations...\n');
  
  const results: any[] = [];
  let passed = 0;
  let total = 0;
  
  for (const op of realOperations) {
    console.log(`📋 Testing: ${op.name} (${op.domain})`);
    console.log('─'.repeat(60));
    
    for (const role of op.roles) {
      total++;
      const result = await testOperation(op, role);
      
      if (result.success) {
        console.log(`  ✅ ${role.padEnd(12)}: SUCCESS`);
        if (result.data) {
          const dataKeys = Object.keys(result.data);
          if (dataKeys.length > 0) {
            console.log(`     Data: ${dataKeys.join(', ')}`);
          }
        }
        passed++;
      } else {
        console.log(`  ❌ ${role.padEnd(12)}: FAILED - ${result.error}`);
      }
      
      results.push({
        operation: op.name,
        domain: op.domain,
        role,
        success: result.success,
        error: result.error
      });
    }
    
    // Test with unauthorized role
    const unauthorizedResult = await testOperation(op, 'viewer');
    if (!unauthorizedResult.success) {
      console.log(`  ⚪ viewer       : EXPECTED FAILURE (${unauthorizedResult.error})`);
    } else {
      console.log(`  ⚠️  viewer       : UNEXPECTED SUCCESS (should fail)`);
    }
    
    console.log('');
  }
  
  console.log('='.repeat(80));
  console.log(`📊 REAL OPERATIONS TEST RESULTS`);
  console.log('='.repeat(80));
  console.log(`Total tests: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${total - passed}`);
  console.log(`Success rate: ${Math.round(passed/total*100)}%`);
  
  // Group failures by domain
  const failures = results.filter(r => !r.success);
  if (failures.length > 0) {
    console.log('\n❌ FAILURES BY DOMAIN:');
    const failuresByDomain = failures.reduce((acc: any, fail) => {
      if (!acc[fail.domain]) acc[fail.domain] = [];
      acc[fail.domain].push(fail);
      return acc;
    }, {});
    
    for (const [domain, domainFailures] of Object.entries(failuresByDomain) as any) {
      console.log(`\n  ${domain.toUpperCase()}:`);
      domainFailures.forEach((fail: any) => {
        console.log(`    • ${fail.operation} (${fail.role}): ${fail.error}`);
      });
    }
  }
  
  if (passed === total) {
    console.log('\n🎉 All GraphQL operations are working correctly!');
    console.log('✅ Schema matches the application requirements');
    console.log('✅ Permissions are configured properly');
    console.log('✅ No GraphQL errors detected');
  } else {
    console.log('\n🔧 Issues found that need to be addressed:');
    
    const schemaErrors = failures.filter(f => 
      f.error.includes('not found') || 
      f.error.includes('Unknown') ||
      f.error.includes('field')
    );
    
    const permissionErrors = failures.filter(f => 
      f.error.includes('permission') || 
      f.error.includes('access')
    );
    
    if (schemaErrors.length > 0) {
      console.log('📋 Schema Issues: Field names or types don\'t match');
    }
    
    if (permissionErrors.length > 0) {
      console.log('🔒 Permission Issues: Role access not configured correctly');
    }
  }
  
  console.log('\n' + '='.repeat(80));
}

runRealOperationTests().catch(console.error);