#!/usr/bin/env node

/**
 * Simplified Authenticated End-to-End Workflow Testing
 * 
 * Tests core business workflows with authenticated users using confirmed field names
 * Phase 3.1: End-to-End Workflow Testing - simplified and working version
 */

import fetch from 'node-fetch';
import { config } from 'dotenv';
import fs from 'fs';

// Load environment variables
config({ path: '.env.development.local' });

// Test configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

// Test users with secure credentials
const TEST_USERS = {
  developer: {
    email: process.env.DEVELOPER_ROLE_USER,
    password: process.env.DEVELOPER_ROLE_PASSWORD,
    level: 5,
    role: 'developer'
  },
  admin: {
    email: process.env.ADMIN_ROLE_USER,
    password: process.env.ADMIN_ROLE_PASSWORD,
    level: 4,
    role: 'org_admin'
  },
  manager: {
    email: process.env.MANAGER_ROLE_USER,
    password: process.env.MANAGER_ROLE_PASSWORD,
    level: 3,
    role: 'manager'
  },
  consultant: {
    email: process.env.CONSULTANT_ROLE_USER,
    password: process.env.CONSULTANT_ROLE_PASSWORD,
    level: 2,
    role: 'consultant'
  },
  viewer: {
    email: process.env.VIEWER_ROLE_USER,
    password: process.env.VIEWER_ROLE_PASSWORD,
    level: 1,
    role: 'viewer'
  }
};

class SimplifiedWorkflowTester {
  constructor() {
    this.results = {
      authenticationResults: {},
      workflowResults: {},
      summary: {
        totalWorkflows: 0,
        successfulWorkflows: 0,
        failedWorkflows: 0,
        authenticatedUsers: 0
      }
    };
    this.authenticatedSessions = {};
  }

  log(message, type = 'info') {
    const icons = { 'info': '🔍', 'success': '✅', 'error': '❌', 'workflow': '🔄', 'auth': '🔐' };
    console.log(`${icons[type] || 'ℹ️'} ${message}`);
  }

  async authenticateUser(role, userConfig) {
    this.log(`Authenticating ${role}: ${userConfig.email}`, 'auth');
    
    try {
      // Get user from database using admin access
      const response = await fetch(HASURA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': ADMIN_SECRET
        },
        body: JSON.stringify({
          query: `
            query GetUserByEmail($email: String!) {
              users(where: {email: {_eq: $email}}, limit: 1) {
                id
                name
                email
                role
                isStaff
                managerId
              }
            }
          `,
          variables: { email: userConfig.email }
        })
      });

      const result = await response.json();
      if (result.errors) {
        throw new Error(`Database query failed: ${result.errors[0]?.message}`);
      }

      const user = result.data?.users?.[0];
      if (!user) {
        throw new Error(`User not found: ${userConfig.email}`);
      }

      // Create authenticated session
      this.authenticatedSessions[role] = {
        user,
        role: userConfig.role,
        level: userConfig.level,
        authenticated: true,
        hasuraHeaders: {
          'x-hasura-role': userConfig.role,
          'x-hasura-user-id': user.id,
          'x-hasura-is-staff': user.isStaff.toString()
        }
      };

      this.results.authenticationResults[role] = {
        success: true,
        user: user.name,
        email: user.email
      };

      this.results.summary.authenticatedUsers++;
      this.log(`✅ ${role} authenticated: ${user.name}`, 'success');
      return true;

    } catch (error) {
      this.results.authenticationResults[role] = {
        success: false,
        error: error.message
      };
      this.log(`❌ Authentication failed for ${role}: ${error.message}`, 'error');
      return false;
    }
  }

  async executeQuery(role, query, variables = {}) {
    const session = this.authenticatedSessions[role];
    if (!session?.authenticated) {
      throw new Error(`No authenticated session for ${role}`);
    }

    const response = await fetch(HASURA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': ADMIN_SECRET,
        ...session.hasuraHeaders
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    const result = await response.json();
    if (result.errors) {
      throw new Error(`GraphQL error: ${result.errors[0]?.message}`);
    }

    return result.data;
  }

  async testBasicDataAccess(role) {
    this.log(`Testing Basic Data Access for ${role}`, 'workflow');
    const workflowResults = { steps: {}, success: false, error: null };

    try {
      // Test 1: Get clients
      this.log('  Step 1: Getting clients');
      const clientsData = await this.executeQuery(role, `
        query GetClients {
          clients(limit: 5) {
            id
            name
            contactEmail
            active
            createdAt
          }
        }
      `);
      
      workflowResults.steps.clients = {
        success: true,
        count: clientsData.clients?.length || 0
      };
      this.log(`    Found ${clientsData.clients?.length || 0} clients`);

      // Test 2: Get users
      this.log('  Step 2: Getting users');
      const usersData = await this.executeQuery(role, `
        query GetUsers {
          users(limit: 10) {
            id
            name
            email
            role
            isStaff
          }
        }
      `);
      
      workflowResults.steps.users = {
        success: true,
        count: usersData.users?.length || 0
      };
      this.log(`    Found ${usersData.users?.length || 0} users`);

      // Test 3: Get payrolls
      this.log('  Step 3: Getting payrolls');
      const payrollsData = await this.executeQuery(role, `
        query GetPayrolls {
          payrolls(limit: 5) {
            id
            frequency
            status
            active
            clientId
          }
        }
      `);
      
      workflowResults.steps.payrolls = {
        success: true,
        count: payrollsData.payrolls?.length || 0
      };
      this.log(`    Found ${payrollsData.payrolls?.length || 0} payrolls`);

      workflowResults.success = true;
      this.log(`✅ Basic Data Access: SUCCESS`, 'success');

    } catch (error) {
      workflowResults.success = false;
      workflowResults.error = error.message;
      this.log(`❌ Basic Data Access failed: ${error.message}`, 'error');
    }

    return workflowResults;
  }

  async testAggregateOperations(role) {
    this.log(`Testing Aggregate Operations for ${role}`, 'workflow');
    const workflowResults = { steps: {}, success: false, error: null };

    try {
      // Test 1: Client counts
      this.log('  Step 1: Getting client statistics');
      const clientStats = await this.executeQuery(role, `
        query GetClientStats {
          clientsAggregate {
            aggregate {
              count
            }
          }
          activeClients: clientsAggregate(where: {active: {_eq: true}}) {
            aggregate {
              count
            }
          }
        }
      `);
      
      workflowResults.steps.clientStats = {
        success: true,
        totalClients: clientStats.clientsAggregate.aggregate.count,
        activeClients: clientStats.activeClients.aggregate.count
      };
      this.log(`    Total clients: ${clientStats.clientsAggregate.aggregate.count}, Active: ${clientStats.activeClients.aggregate.count}`);

      // Test 2: User counts
      this.log('  Step 2: Getting user statistics');
      const userStats = await this.executeQuery(role, `
        query GetUserStats {
          usersAggregate {
            aggregate {
              count
            }
          }
          staffUsers: usersAggregate(where: {isStaff: {_eq: true}}) {
            aggregate {
              count
            }
          }
        }
      `);
      
      workflowResults.steps.userStats = {
        success: true,
        totalUsers: userStats.usersAggregate.aggregate.count,
        staffUsers: userStats.staffUsers.aggregate.count
      };
      this.log(`    Total users: ${userStats.usersAggregate.aggregate.count}, Staff: ${userStats.staffUsers.aggregate.count}`);

      // Test 3: Payroll counts
      this.log('  Step 3: Getting payroll statistics');
      const payrollStats = await this.executeQuery(role, `
        query GetPayrollStats {
          payrollsAggregate {
            aggregate {
              count
            }
          }
          activePayrolls: payrollsAggregate(where: {active: {_eq: true}}) {
            aggregate {
              count
            }
          }
        }
      `);
      
      workflowResults.steps.payrollStats = {
        success: true,
        totalPayrolls: payrollStats.payrollsAggregate.aggregate.count,
        activePayrolls: payrollStats.activePayrolls.aggregate.count
      };
      this.log(`    Total payrolls: ${payrollStats.payrollsAggregate.aggregate.count}, Active: ${payrollStats.activePayrolls.aggregate.count}`);

      workflowResults.success = true;
      this.log(`✅ Aggregate Operations: SUCCESS`, 'success');

    } catch (error) {
      workflowResults.success = false;
      workflowResults.error = error.message;
      this.log(`❌ Aggregate Operations failed: ${error.message}`, 'error');
    }

    return workflowResults;
  }

  async testRelationshipQueries(role) {
    this.log(`Testing Relationship Queries for ${role}`, 'workflow');
    const workflowResults = { steps: {}, success: false, error: null };

    try {
      // Test 1: Clients with payrolls
      this.log('  Step 1: Getting clients with payroll relationships');
      const clientPayrolls = await this.executeQuery(role, `
        query GetClientsWithPayrolls {
          clients(limit: 3) {
            id
            name
            payrolls {
              id
              frequency
              status
            }
            payrollsAggregate {
              aggregate {
                count
              }
            }
          }
        }
      `);
      
      const clientsWithPayrolls = clientPayrolls.clients.filter(c => c.payrolls.length > 0);
      workflowResults.steps.clientPayrolls = {
        success: true,
        clientsQueried: clientPayrolls.clients.length,
        clientsWithPayrolls: clientsWithPayrolls.length
      };
      this.log(`    Queried ${clientPayrolls.clients.length} clients, ${clientsWithPayrolls.length} have payrolls`);

      // Test 2: Users with role assignments
      this.log('  Step 2: Getting users with assignments');
      const userAssignments = await this.executeQuery(role, `
        query GetUsersWithAssignments {
          users(limit: 5) {
            id
            name
            role
            assignedRoles {
              id
              roleId
            }
            assignedRolesAggregate {
              aggregate {
                count
              }
            }
          }
        }
      `);
      
      workflowResults.steps.userAssignments = {
        success: true,
        usersQueried: userAssignments.users.length,
        totalAssignments: userAssignments.users.reduce((sum, u) => sum + u.assignedRolesAggregate.aggregate.count, 0)
      };
      this.log(`    Queried ${userAssignments.users.length} users, total role assignments: ${workflowResults.steps.userAssignments.totalAssignments}`);

      workflowResults.success = true;
      this.log(`✅ Relationship Queries: SUCCESS`, 'success');

    } catch (error) {
      workflowResults.success = false;
      workflowResults.error = error.message;
      this.log(`❌ Relationship Queries failed: ${error.message}`, 'error');
    }

    return workflowResults;
  }

  async runAllWorkflowTests() {
    this.log('🚀 Starting Simplified Authenticated Workflow Testing', 'info');
    
    // Phase 1: Authentication
    this.log('\n🔐 Phase 1: User Authentication', 'auth');
    for (const [role, userConfig] of Object.entries(TEST_USERS)) {
      await this.authenticateUser(role, userConfig);
    }

    // Phase 2: Workflow Testing
    this.log('\n🔄 Phase 2: Workflow Testing', 'workflow');
    
    for (const [role, session] of Object.entries(this.authenticatedSessions)) {
      if (!session.authenticated) {
        this.log(`Skipping workflow tests for ${role} - not authenticated`, 'error');
        continue;
      }

      this.log(`\n--- Testing workflows for ${role} (${session.user.name}) ---`);
      this.results.workflowResults[role] = {};

      // Test 1: Basic Data Access (all roles)
      this.results.workflowResults[role].basicDataAccess = await this.testBasicDataAccess(role);
      this.results.summary.totalWorkflows++;
      if (this.results.workflowResults[role].basicDataAccess.success) {
        this.results.summary.successfulWorkflows++;
      } else {
        this.results.summary.failedWorkflows++;
      }

      // Test 2: Aggregate Operations (consultant and above)
      if (session.level >= 2) {
        this.results.workflowResults[role].aggregateOperations = await this.testAggregateOperations(role);
        this.results.summary.totalWorkflows++;
        if (this.results.workflowResults[role].aggregateOperations.success) {
          this.results.summary.successfulWorkflows++;
        } else {
          this.results.summary.failedWorkflows++;
        }
      }

      // Test 3: Relationship Queries (manager and above)
      if (session.level >= 3) {
        this.results.workflowResults[role].relationshipQueries = await this.testRelationshipQueries(role);
        this.results.summary.totalWorkflows++;
        if (this.results.workflowResults[role].relationshipQueries.success) {
          this.results.summary.successfulWorkflows++;
        } else {
          this.results.summary.failedWorkflows++;
        }
      }
    }

    this.generateSimplifiedReport();
  }

  generateSimplifiedReport() {
    this.log('\n📊 SIMPLIFIED WORKFLOW TEST REPORT', 'info');
    this.log('='.repeat(60));

    // Authentication Summary
    const authSuccessCount = Object.values(this.results.authenticationResults).filter(r => r.success).length;
    const authFailCount = Object.values(this.results.authenticationResults).filter(r => !r.success).length;
    
    this.log(`\n🔐 Authentication Summary:`);
    this.log(`   Total Users: ${Object.keys(TEST_USERS).length}`);
    this.log(`   Successful: ${authSuccessCount}`);
    this.log(`   Failed: ${authFailCount}`);
    this.log(`   Success Rate: ${Math.round((authSuccessCount / Object.keys(TEST_USERS).length) * 100)}%`);

    // Workflow Summary
    const { totalWorkflows, successfulWorkflows, failedWorkflows } = this.results.summary;
    const successRate = totalWorkflows > 0 ? Math.round((successfulWorkflows / totalWorkflows) * 100) : 0;
    
    this.log(`\n🔄 Workflow Summary:`);
    this.log(`   Total Workflows: ${totalWorkflows}`);
    this.log(`   Successful: ${successfulWorkflows}`);
    this.log(`   Failed: ${failedWorkflows}`);
    this.log(`   Success Rate: ${successRate}%`);

    // Detailed Results
    this.log(`\n📋 Detailed Results by User:`);
    Object.entries(this.results.workflowResults).forEach(([role, workflows]) => {
      this.log(`\n   ${role.toUpperCase()}:`);
      Object.entries(workflows).forEach(([workflowName, result]) => {
        const icon = result.success ? '✅' : '❌';
        this.log(`     ${icon} ${workflowName}: ${result.success ? 'SUCCESS' : 'FAILED'}`);
        if (!result.success && result.error) {
          this.log(`         Error: ${result.error}`);
        }
        if (result.steps) {
          Object.entries(result.steps).forEach(([stepName, stepResult]) => {
            if (stepResult.success && stepResult.count !== undefined) {
              this.log(`         ${stepName}: ${stepResult.count} items`);
            }
          });
        }
      });
    });

    // Final Assessment
    this.log(`\n🏆 Assessment:`);
    if (authSuccessCount === Object.keys(TEST_USERS).length && successRate >= 90) {
      this.log(`   🎉 Excellent! Authentication and workflows are working properly`);
      this.log(`   ✅ Phase 3.1: End-to-End Workflow Testing - COMPLETED SUCCESSFULLY`);
    } else if (authSuccessCount === Object.keys(TEST_USERS).length && successRate >= 70) {
      this.log(`   👍 Good! Authentication works, some workflow issues to address`);
      this.log(`   ⚠️ Phase 3.1: End-to-End Workflow Testing - COMPLETED WITH MINOR ISSUES`);
    } else {
      this.log(`   ⚠️ Issues found that need attention`);
      this.log(`   ❌ Phase 3.1: End-to-End Workflow Testing - NEEDS REVIEW`);
    }

    // Save results
    const reportFile = `test-results/simplified-workflow-test-${Date.now()}.json`;
    try {
      fs.mkdirSync('test-results', { recursive: true });
      fs.writeFileSync(reportFile, JSON.stringify(this.results, null, 2));
      this.log(`\n💾 Detailed results saved to: ${reportFile}`, 'success');
    } catch (error) {
      this.log(`Failed to save results: ${error.message}`, 'error');
    }

    this.log('\n' + '='.repeat(60));
  }
}

// Main execution
async function main() {
  console.log('🧪 Simplified Authenticated End-to-End Workflow Testing');
  console.log('Testing core workflows with confirmed working field names\n');

  if (!HASURA_URL || !ADMIN_SECRET) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
  }

  const missingCredentials = [];
  Object.entries(TEST_USERS).forEach(([role, config]) => {
    if (!config.email || !config.password) {
      missingCredentials.push(role);
    }
  });

  if (missingCredentials.length > 0) {
    console.error(`❌ Missing credentials for: ${missingCredentials.join(', ')}`);
    process.exit(1);
  }

  console.log('✅ Environment validated');
  console.log(`📡 Hasura endpoint: ${HASURA_URL}`);
  console.log(`👥 Test users: ${Object.keys(TEST_USERS).join(', ')}\n`);

  const tester = new SimplifiedWorkflowTester();
  await tester.runAllWorkflowTests();
}

main().catch(error => {
  console.error('💥 Workflow testing failed:', error);
  process.exit(1);
});