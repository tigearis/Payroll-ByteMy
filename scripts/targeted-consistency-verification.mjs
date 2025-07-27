#!/usr/bin/env node

/**
 * Targeted Data Consistency Verification
 * 
 * Phase 3.2: Focused testing on confirmed existing tables and relationships
 */

import fetch from 'node-fetch';
import { config } from 'dotenv';
import fs from 'fs';

// Load environment variables
config({ path: '.env.development.local' });

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

class TargetedConsistencyVerifier {
  constructor() {
    this.results = {
      coreTableConsistency: {},
      relationshipTests: {},
      businessLogicConsistency: {},
      summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        successRate: 0
      }
    };
  }

  log(message, type = 'info') {
    const icons = { 'info': '🔍', 'success': '✅', 'error': '❌', 'warning': '⚠️' };
    console.log(`${icons[type]} ${message}`);
  }

  async executeHasuraQuery(query, variables = {}) {
    const response = await fetch(HASURA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': ADMIN_SECRET
      },
      body: JSON.stringify({ query, variables })
    });

    const result = await response.json();
    if (result.errors) {
      throw new Error(`Hasura query failed: ${result.errors[0]?.message}`);
    }
    return result.data;
  }

  async testCoreTableConsistency() {
    this.log('📊 Testing core table data consistency');

    const tests = [
      {
        name: 'users_basic_fields',
        query: `
          query TestUsersConsistency {
            users {
              id
              name
              email
              role
              isStaff
              managerId
              createdAt
              updatedAt
            }
            usersAggregate {
              aggregate {
                count
              }
            }
          }
        `
      },
      {
        name: 'clients_basic_fields', 
        query: `
          query TestClientsConsistency {
            clients {
              id
              name
              contactEmail
              active
              createdAt
              updatedAt
            }
            clientsAggregate {
              aggregate {
                count
              }
            }
          }
        `
      },
      {
        name: 'payrolls_basic_fields',
        query: `
          query TestPayrollsConsistency {
            payrolls {
              id
              name
              status
              clientId
              createdAt
              updatedAt
            }
            payrollsAggregate {
              aggregate {
                count
              }
            }
          }
        `
      },
      {
        name: 'roles_and_permissions',
        query: `
          query TestRolesPermissions {
            roles {
              id
              name
              displayName
              priority
            }
            permissions {
              id
              action
              resourceId
            }
            rolesAggregate {
              aggregate {
                count
              }
            }
            permissionsAggregate {
              aggregate {
                count
              }
            }
          }
        `
      }
    ];

    for (const test of tests) {
      try {
        const result = await this.executeHasuraQuery(test.query);
        
        // Extract data and aggregate info
        const tableData = Object.keys(result).filter(key => !key.includes('Aggregate'));
        const aggregateData = Object.keys(result).filter(key => key.includes('Aggregate'));
        
        let consistent = true;
        const tableResults = {};

        for (const table of tableData) {
          const records = result[table] || [];
          const aggregateKey = table + 'Aggregate';
          const expectedCount = result[aggregateKey]?.aggregate?.count || 0;
          const actualCount = records.length;

          tableResults[table] = {
            recordCount: actualCount,
            aggregateCount: expectedCount,
            consistent: actualCount === expectedCount,
            sampleRecord: records[0] || null
          };

          if (actualCount !== expectedCount) {
            consistent = false;
          }
        }

        this.results.coreTableConsistency[test.name] = {
          success: true,
          consistent,
          tables: tableResults
        };

        if (consistent) {
          this.log(`  ✅ ${test.name}: All tables consistent`);
          this.results.summary.passedTests++;
        } else {
          this.log(`  ⚠️ ${test.name}: Count mismatches detected`, 'warning');
          this.results.summary.failedTests++;
        }

      } catch (error) {
        this.results.coreTableConsistency[test.name] = {
          success: false,
          error: error.message
        };
        this.log(`  ❌ ${test.name}: ${error.message}`, 'error');
        this.results.summary.failedTests++;
      }

      this.results.summary.totalTests++;
    }
  }

  async testRelationshipConsistency() {
    this.log('🔗 Testing relationship data consistency');

    const relationshipTests = [
      {
        name: 'users_with_managers',
        query: `
          query TestUserManagerRelationships {
            users(where: {managerId: {_isNull: false}}) {
              id
              name
              managerId
              manager {
                id
                name
                role
              }
            }
          }
        `
      },
      {
        name: 'payrolls_with_clients',
        query: `
          query TestPayrollClientRelationships {
            payrolls(limit: 10) {
              id
              name
              clientId
              client {
                id
                name
                active
              }
            }
          }
        `
      },
      {
        name: 'users_with_role_assignments',
        query: `
          query TestUserRoleAssignments {
            users(limit: 10) {
              id
              name
              role
              assignedRoles {
                id
                roleId
                assignedRole {
                  id
                  name
                  priority
                }
              }
            }
          }
        `
      }
    ];

    for (const test of relationshipTests) {
      try {
        const result = await this.executeHasuraQuery(test.query);
        const mainTable = Object.keys(result)[0];
        const records = result[mainTable] || [];

        let consistentRelationships = 0;
        let totalRelationships = 0;
        const issues = [];

        for (const record of records) {
          // Check relationship consistency based on test type
          if (test.name === 'users_with_managers') {
            totalRelationships++;
            if (record.managerId && record.manager && record.manager.id === record.managerId) {
              consistentRelationships++;
            } else {
              issues.push(`User ${record.id} manager mismatch`);
            }
          } else if (test.name === 'payrolls_with_clients') {
            totalRelationships++;
            if (record.clientId && record.client && record.client.id === record.clientId) {
              consistentRelationships++;
            } else {
              issues.push(`Payroll ${record.id} client mismatch`);
            }
          } else if (test.name === 'users_with_role_assignments') {
            totalRelationships++;
            if (record.assignedRoles && record.assignedRoles.length > 0) {
              const validAssignments = record.assignedRoles.filter(ar => 
                ar.assignedRole && ar.assignedRole.id === ar.roleId
              );
              if (validAssignments.length === record.assignedRoles.length) {
                consistentRelationships++;
              } else {
                issues.push(`User ${record.id} role assignment mismatch`);
              }
            } else {
              consistentRelationships++; // No assignments is valid
            }
          }
        }

        const consistencyRate = totalRelationships > 0 ? 
          Math.round((consistentRelationships / totalRelationships) * 100) : 100;

        this.results.relationshipTests[test.name] = {
          success: true,
          totalRelationships,
          consistentRelationships,
          consistencyRate,
          issues: issues.slice(0, 5) // First 5 issues
        };

        if (consistencyRate >= 95) {
          this.log(`  ✅ ${test.name}: ${consistencyRate}% consistent (${consistentRelationships}/${totalRelationships})`);
          this.results.summary.passedTests++;
        } else {
          this.log(`  ⚠️ ${test.name}: ${consistencyRate}% consistent (${issues.length} issues)`, 'warning');
          this.results.summary.failedTests++;
        }

      } catch (error) {
        this.results.relationshipTests[test.name] = {
          success: false,
          error: error.message
        };
        this.log(`  ❌ ${test.name}: ${error.message}`, 'error');
        this.results.summary.failedTests++;
      }

      this.results.summary.totalTests++;
    }
  }

  async testBusinessLogicConsistency() {
    this.log('🧮 Testing business logic consistency');

    const businessTests = [
      {
        name: 'role_hierarchy_consistency',
        description: 'Verify role hierarchy is maintained correctly',
        query: `
          query TestRoleHierarchy {
            users {
              id
              name
              role
              managerId
              manager {
                role
              }
            }
          }
        `
      },
      {
        name: 'active_status_consistency',
        description: 'Verify active status fields are consistent',
        query: `
          query TestActiveStatus {
            clients {
              id
              name
              active
              payrolls {
                id
                name
                status
              }
            }
          }
        `
      },
      {
        name: 'timestamp_consistency',
        description: 'Verify created/updated timestamps are logical',
        query: `
          query TestTimestamps {
            users(orderBy: {createdAt: DESC}, limit: 20) {
              id
              name
              createdAt
              updatedAt
            }
            clients(orderBy: {createdAt: DESC}, limit: 20) {
              id
              name
              createdAt
              updatedAt
            }
          }
        `
      }
    ];

    for (const test of businessTests) {
      try {
        const result = await this.executeHasuraQuery(test.query);
        let businessLogicValid = true;
        const validationResults = [];

        if (test.name === 'role_hierarchy_consistency') {
          const users = result.users || [];
          const roleHierarchy = ['developer', 'org_admin', 'manager', 'consultant', 'viewer'];
          
          for (const user of users) {
            if (user.managerId && user.manager) {
              const userRoleIndex = roleHierarchy.indexOf(user.role);
              const managerRoleIndex = roleHierarchy.indexOf(user.manager.role);
              
              if (userRoleIndex > managerRoleIndex) {
                validationResults.push({
                  type: 'hierarchy_violation',
                  user: user.name,
                  userRole: user.role,
                  managerRole: user.manager.role
                });
                businessLogicValid = false;
              }
            }
          }
        } else if (test.name === 'active_status_consistency') {
          const clients = result.clients || [];
          
          for (const client of clients) {
            if (!client.active && client.payrolls) {
              const activePayrolls = client.payrolls.filter(p => p.status === 'active');
              if (activePayrolls.length > 0) {
                validationResults.push({
                  type: 'inactive_client_active_payrolls',
                  client: client.name,
                  activePayrolls: activePayrolls.length
                });
                businessLogicValid = false;
              }
            }
          }
        } else if (test.name === 'timestamp_consistency') {
          const allRecords = [...(result.users || []), ...(result.clients || [])];
          
          for (const record of allRecords) {
            if (record.createdAt && record.updatedAt) {
              const created = new Date(record.createdAt);
              const updated = new Date(record.updatedAt);
              
              if (updated < created) {
                validationResults.push({
                  type: 'invalid_timestamps',
                  record: record.id,
                  created: record.createdAt,
                  updated: record.updatedAt
                });
                businessLogicValid = false;
              }
            }
          }
        }

        this.results.businessLogicConsistency[test.name] = {
          success: true,
          valid: businessLogicValid,
          validationResults: validationResults.slice(0, 10), // First 10 issues
          description: test.description
        };

        if (businessLogicValid) {
          this.log(`  ✅ ${test.name}: Business logic valid`);
          this.results.summary.passedTests++;
        } else {
          this.log(`  ⚠️ ${test.name}: ${validationResults.length} business logic issues`, 'warning');
          this.results.summary.failedTests++;
        }

      } catch (error) {
        this.results.businessLogicConsistency[test.name] = {
          success: false,
          error: error.message
        };
        this.log(`  ❌ ${test.name}: ${error.message}`, 'error');
        this.results.summary.failedTests++;
      }

      this.results.summary.totalTests++;
    }
  }

  async runTargetedConsistencyTests() {
    this.log('🚀 Starting Targeted Data Consistency Verification');
    this.log('=' .repeat(60));

    try {
      await this.testCoreTableConsistency();
      await this.testRelationshipConsistency();
      await this.testBusinessLogicConsistency();

      this.generateTargetedReport();

    } catch (error) {
      this.log(`💥 Targeted consistency verification failed: ${error.message}`, 'error');
      throw error;
    }
  }

  generateTargetedReport() {
    this.log('\n📊 TARGETED DATA CONSISTENCY REPORT', 'info');
    this.log('=' .repeat(60));

    const { totalTests, passedTests, failedTests } = this.results.summary;
    const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    this.results.summary.successRate = successRate;

    // Summary
    this.log(`\n📈 Test Summary:`);
    this.log(`   Total Tests: ${totalTests}`);
    this.log(`   Passed: ${passedTests} (${successRate}%)`);
    this.log(`   Failed: ${failedTests}`);

    // Core Table Results
    this.log(`\n📊 Core Table Consistency:`);
    Object.entries(this.results.coreTableConsistency).forEach(([testName, result]) => {
      if (result.success) {
        const status = result.consistent ? '✅ Consistent' : '⚠️ Issues';
        this.log(`   ${testName}: ${status}`);
        if (result.tables) {
          Object.entries(result.tables).forEach(([table, data]) => {
            this.log(`     ${table}: ${data.recordCount} records (aggregate: ${data.aggregateCount})`);
          });
        }
      } else {
        this.log(`   ${testName}: ❌ Error - ${result.error}`);
      }
    });

    // Relationship Results
    this.log(`\n🔗 Relationship Consistency:`);
    Object.entries(this.results.relationshipTests).forEach(([testName, result]) => {
      if (result.success) {
        this.log(`   ${testName}: ${result.consistencyRate}% (${result.consistentRelationships}/${result.totalRelationships})`);
        if (result.issues && result.issues.length > 0) {
          this.log(`     Issues: ${result.issues.slice(0, 3).join(', ')}`);
        }
      } else {
        this.log(`   ${testName}: ❌ Error - ${result.error}`);
      }
    });

    // Business Logic Results
    this.log(`\n🧮 Business Logic Consistency:`);
    Object.entries(this.results.businessLogicConsistency).forEach(([testName, result]) => {
      if (result.success) {
        const status = result.valid ? '✅ Valid' : '⚠️ Issues';
        this.log(`   ${testName}: ${status}`);
        if (!result.valid && result.validationResults) {
          this.log(`     ${result.validationResults.length} validation issues found`);
        }
      } else {
        this.log(`   ${testName}: ❌ Error - ${result.error}`);
      }
    });

    // Final Assessment
    this.log(`\n🏆 Final Assessment:`);
    if (successRate >= 90) {
      this.log(`   🎉 Excellent! Data consistency is well maintained`);
      this.log(`   ✅ Phase 3.2: Data Consistency Verification - COMPLETED SUCCESSFULLY`);
    } else if (successRate >= 70) {
      this.log(`   👍 Good! Minor consistency issues identified`);
      this.log(`   ⚠️ Phase 3.2: Data Consistency Verification - COMPLETED WITH WARNINGS`);
    } else {
      this.log(`   ❌ Significant consistency issues require attention`);
      this.log(`   🚨 Phase 3.2: Data Consistency Verification - NEEDS REVIEW`);
    }

    // Recommendations
    this.log(`\n💡 Recommendations:`);
    if (successRate < 90) {
      this.log(`   1. 🔧 Address identified consistency issues`);
    }
    this.log(`   2. 🔄 Implement automated consistency monitoring`);
    this.log(`   3. 📊 Set up real-time data validation`);
    this.log(`   4. 🧪 Schedule regular consistency checks`);

    // Save results
    const reportFile = `test-results/targeted-consistency-${Date.now()}.json`;
    try {
      fs.mkdirSync('test-results', { recursive: true });
      fs.writeFileSync(reportFile, JSON.stringify(this.results, null, 2));
      this.log(`\n💾 Detailed results saved to: ${reportFile}`, 'success');
    } catch (error) {
      this.log(`Failed to save results: ${error.message}`, 'error');
    }

    this.log('\n' + '=' .repeat(60));
  }
}

// Main execution
async function main() {
  console.log('🔍 Targeted Data Consistency Verification');
  console.log('Phase 3.2: Testing data integrity with confirmed schema\n');

  if (!HASURA_URL || !ADMIN_SECRET) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
  }

  console.log('✅ Environment validated');
  console.log(`📡 Hasura endpoint: ${HASURA_URL}\n`);

  const verifier = new TargetedConsistencyVerifier();
  await verifier.runTargetedConsistencyTests();
}

main().catch(error => {
  console.error('💥 Targeted consistency verification failed:', error);
  process.exit(1);
});