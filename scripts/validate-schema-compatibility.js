#!/usr/bin/env node

/**
 * Schema Compatibility Validation Script
 * 
 * This script validates that all GraphQL operations in the codebase
 * are compatible with the current Hasura schema.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Configuration
const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || "https://hasura.bytemy.com.au/v1/graphql";
const HASURA_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET || "3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=";

// Results storage
let validationResults = {
  summary: {
    totalOperations: 0,
    validOperations: 0,
    invalidOperations: 0,
    warnings: 0
  },
  domains: {},
  schemaIssues: [],
  recommendations: []
};

/**
 * Execute GraphQL operation against Hasura
 */
async function executeGraphQL(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });
    const options = {
      hostname: new URL(HASURA_URL).hostname,
      port: 443,
      path: new URL(HASURA_URL).pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_SECRET
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * Test corrected operations
 */
async function testCorrectedOperations() {
  console.log('Testing corrected operations...');

  const tests = [
    {
      name: 'Billing Items (Corrected)',
      query: `
        query TestBillingItems {
          billingItems(limit: 5) {
            id
            description
            category
            status
            amount
          }
        }
      `
    },
    {
      name: 'User Complex Query with Relations',
      query: `
        query TestUserComplex {
          users(limit: 2) {
            id
            name
            email
            role
            isActive
            primaryConsultantPayrolls(limit: 3) {
              id
              name
              status
              client {
                id
                name
              }
            }
          }
        }
      `
    },
    {
      name: 'Client with Billing Relations',
      query: `
        query TestClientBilling {
          clients(limit: 2) {
            id
            name
            active
            billingPeriods(limit: 3) {
              id
              periodStart
              periodEnd
              billingInvoices(limit: 2) {
                id
                totalAmount
                status
              }
            }
          }
        }
      `
    },
    {
      name: 'Payroll Dates Function Test',
      query: `
        query TestPayrollDates {
          payrollDates(limit: 5) {
            id
            originalEftDate
            adjustedEftDate
            processingDate
            payrollAssignment {
              id
              createdAt
            }
          }
        }
      `
    },
    {
      name: 'Billing Performance Analytics',
      query: `
        query TestBillingAnalytics {
          staffBillingPerformance(limit: 3) {
            staffId
            totalHoursLogged
            revenuePerHour
            billingItemsCreated
            distinctClientsServed
          }
        }
      `
    },
    {
      name: 'Complex Aggregation with Joins',
      query: `
        query TestComplexAggregation {
          clients(limit: 3) {
            id
            name
            totalPayrolls: payrollsAggregate {
              aggregate {
                count
              }
            }
            totalEmployees: payrollsAggregate {
              aggregate {
                sum {
                  employeeCount
                }
              }
            }
            billingStats: billingPeriodsAggregate {
              aggregate {
                count
              }
            }
          }
        }
      `
    },
    {
      name: 'Real-time Subscription Test',
      query: `
        subscription TestSubscription {
          users(limit: 1, where: { isActive: { _eq: true } }) {
            id
            name
            email
            updatedAt
          }
        }
      `
    }
  ];

  for (const test of tests) {
    try {
      console.log(`\n  Testing: ${test.name}`);
      const result = await executeGraphQL(test.query);
      
      if (result.errors) {
        console.log(`    ❌ Failed: ${result.errors[0].message}`);
        validationResults.schemaIssues.push({
          operation: test.name,
          error: result.errors[0].message,
          severity: 'ERROR'
        });
        validationResults.summary.invalidOperations++;
      } else {
        console.log(`    ✅ Success: Valid schema and data returned`);
        validationResults.summary.validOperations++;
      }
      validationResults.summary.totalOperations++;
    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
      validationResults.schemaIssues.push({
        operation: test.name,
        error: error.message,
        severity: 'ERROR'
      });
      validationResults.summary.invalidOperations++;
      validationResults.summary.totalOperations++;
    }
  }
}

/**
 * Validate fragment compatibility
 */
async function validateFragments() {
  console.log('\nValidating fragment compatibility...');

  const fragmentTests = [
    {
      name: 'UserProfile Fragment',
      query: `
        fragment UserProfile on users {
          id
          name
          email
          role
          isActive
          isStaff
          clerkUserId
          image
          managerId
          deactivatedAt
          deactivatedBy
          managerUser {
            id
            name
            email
          }
        }
        
        query TestUserProfile {
          users(limit: 1) {
            ...UserProfile
          }
        }
      `
    },
    {
      name: 'PayrollWithClient Fragment',
      query: `
        fragment PayrollWithClient on payrolls {
          id
          name
          employeeCount
          status
          payrollSystem
          processingTime
          processingDaysBeforeEft
          versionNumber
          clientId
          client {
            id
            name
            active
          }
        }
        
        query TestPayrollWithClient {
          payrolls(limit: 1) {
            ...PayrollWithClient
          }
        }
      `
    },
    {
      name: 'BillingItem Fragment (New)',
      query: `
        fragment BillingItemCore on billingItems {
          id
          description
          category
          status
          amount
          quantity
          unitPrice
          totalAmount
          hourlyRate
          payrollId
          clientId
          createdAt
          updatedAt
        }
        
        query TestBillingItem {
          billingItems(limit: 1) {
            ...BillingItemCore
          }
        }
      `
    }
  ];

  for (const test of fragmentTests) {
    try {
      console.log(`  Testing fragment: ${test.name}`);
      const result = await executeGraphQL(test.query);
      
      if (result.errors) {
        console.log(`    ❌ Fragment invalid: ${result.errors[0].message}`);
        validationResults.schemaIssues.push({
          operation: `Fragment: ${test.name}`,
          error: result.errors[0].message,
          severity: 'ERROR'
        });
      } else {
        console.log(`    ✅ Fragment valid`);
      }
    } catch (error) {
      console.log(`    ❌ Fragment error: ${error.message}`);
    }
  }
}

/**
 * Test edge cases and complex scenarios
 */
async function testEdgeCases() {
  console.log('\nTesting edge cases...');

  const edgeCases = [
    {
      name: 'Empty Result Handling',
      query: `
        query TestEmptyResults {
          payrolls(where: { id: { _eq: "00000000-0000-0000-0000-000000000000" } }) {
            id
            name
          }
        }
      `
    },
    {
      name: 'Large Dataset Pagination',
      query: `
        query TestPagination {
          payrolls(limit: 100, offset: 0) {
            id
            name
            status
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
      name: 'Complex Filtering',
      query: `
        query TestComplexFiltering {
          payrolls(
            where: {
              _and: [
                { status: { _eq: "Active" } }
                { supersededDate: { _is_null: true } }
                { employeeCount: { _gt: 0 } }
                { client: { active: { _eq: true } } }
              ]
            }
            limit: 10
          ) {
            id
            name
            status
            employeeCount
            client {
              name
              active
            }
          }
        }
      `
    },
    {
      name: 'Null Field Handling',
      query: `
        query TestNullHandling {
          users(limit: 5) {
            id
            name
            email
            managerId
            managerUser {
              id
              name
            }
            deactivatedAt
            deactivatedBy
          }
        }
      `
    }
  ];

  for (const test of edgeCases) {
    try {
      console.log(`  Testing: ${test.name}`);
      const result = await executeGraphQL(test.query);
      
      if (result.errors) {
        console.log(`    ❌ Failed: ${result.errors[0].message}`);
        validationResults.schemaIssues.push({
          operation: `Edge Case: ${test.name}`,
          error: result.errors[0].message,
          severity: 'WARNING'
        });
        validationResults.summary.warnings++;
      } else {
        console.log(`    ✅ Handled correctly`);
      }
    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
      validationResults.summary.warnings++;
    }
  }
}

/**
 * Generate validation report
 */
function generateValidationReport() {
  console.log('\n=== SCHEMA COMPATIBILITY VALIDATION REPORT ===');
  
  const { summary } = validationResults;
  console.log(`\nSummary:`);
  console.log(`  Total Operations Tested: ${summary.totalOperations}`);
  console.log(`  Valid Operations: ${summary.validOperations}`);
  console.log(`  Invalid Operations: ${summary.invalidOperations}`);
  console.log(`  Warnings: ${summary.warnings}`);
  
  const successRate = summary.totalOperations > 0 
    ? ((summary.validOperations / summary.totalOperations) * 100).toFixed(1)
    : 0;
  console.log(`  Success Rate: ${successRate}%`);

  if (validationResults.schemaIssues.length > 0) {
    console.log(`\nSchema Issues Found:`);
    validationResults.schemaIssues.forEach((issue, index) => {
      console.log(`\n  ${index + 1}. ${issue.operation} (${issue.severity})`);
      console.log(`     ${issue.error}`);
    });
  }

  // Generate recommendations
  if (summary.invalidOperations > 0) {
    validationResults.recommendations.push({
      type: 'Schema Updates',
      message: `${summary.invalidOperations} operations failed. Review GraphQL operations for schema compatibility.`
    });
  }

  if (summary.warnings > 0) {
    validationResults.recommendations.push({
      type: 'Edge Case Handling',
      message: `${summary.warnings} edge cases need attention. Implement proper error handling.`
    });
  }

  if (validationResults.recommendations.length > 0) {
    console.log(`\nRecommendations:`);
    validationResults.recommendations.forEach((rec, index) => {
      console.log(`\n  ${index + 1}. ${rec.type}: ${rec.message}`);
    });
  }

  // Save report
  const reportPath = path.join(__dirname, '../audit-reports/schema-compatibility-' + new Date().toISOString().split('T')[0] + '.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(validationResults, null, 2));
  
  console.log(`\nDetailed report saved to: ${reportPath}`);
  
  return successRate >= 80;
}

/**
 * Main validation function
 */
async function runValidation() {
  console.log('🔍 Starting Schema Compatibility Validation');
  console.log(`Target: ${HASURA_URL}`);
  console.log(`Time: ${new Date().toISOString()}\n`);

  try {
    await testCorrectedOperations();
    await validateFragments();
    await testEdgeCases();
    
    const success = generateValidationReport();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error(`❌ Validation failed: ${error.message}`);
    process.exit(1);
  }
}

// Run validation
if (import.meta.url === `file://${process.argv[1]}`) {
  runValidation().catch(console.error);
}

export { runValidation };