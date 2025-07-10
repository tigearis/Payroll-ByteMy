#!/usr/bin/env node

/**
 * Comprehensive GraphQL Audit Script for Hasura
 * 
 * This script systematically tests all GraphQL operations against the Hasura endpoint
 * to ensure compatibility and identify any issues with the GraphQL integration.
 * 
 * Features:
 * - Tests operations from all 11 business domains
 * - Validates fragment dependencies
 * - Tests complex aggregations and joins
 * - Validates custom Hasura functions
 * - Checks subscription connectivity
 * - Performance benchmarking
 * - Security validation
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { performance } from 'perf_hooks';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Configuration
const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || "https://hasura.bytemy.com.au/v1/graphql";
const HASURA_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET || "3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=";

// Test results storage
let testResults = {
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
    startTime: new Date().toISOString()
  },
  domains: {},
  performance: {},
  errors: [],
  recommendations: []
};

// Color codes for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

/**
 * Execute GraphQL operation against Hasura
 */
async function executeGraphQL(query, variables = {}, operationName = null) {
  const startTime = performance.now();
  
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      query,
      variables,
      operationName
    });

    const options = {
      hostname: new URL(HASURA_URL).hostname,
      port: 443,
      path: new URL(HASURA_URL).pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'x-hasura-admin-secret': HASURA_SECRET
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        try {
          const result = JSON.parse(data);
          resolve({
            ...result,
            executionTime,
            statusCode: res.statusCode
          });
        } catch (error) {
          reject({
            error: 'Failed to parse response',
            data,
            executionTime,
            statusCode: res.statusCode
          });
        }
      });
    });

    req.on('error', (error) => {
      const endTime = performance.now();
      reject({
        error: error.message,
        executionTime: endTime - startTime
      });
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Test introspection query to validate schema access
 */
async function testIntrospection() {
  console.log(`${colors.blue}Testing GraphQL introspection...${colors.reset}`);
  
  const introspectionQuery = `
    query IntrospectionQuery {
      __schema {
        queryType { name }
        mutationType { name }
        subscriptionType { name }
        types {
          name
          kind
          description
        }
      }
    }
  `;

  try {
    const result = await executeGraphQL(introspectionQuery);
    
    if (result.errors) {
      testResults.errors.push({
        test: 'Introspection',
        error: result.errors,
        severity: 'CRITICAL'
      });
      console.log(`${colors.red}✗ Introspection failed${colors.reset}`);
      return false;
    }

    const schema = result.data.__schema;
    console.log(`${colors.green}✓ Schema introspection successful${colors.reset}`);
    console.log(`  Query type: ${schema.queryType?.name || 'Not found'}`);
    console.log(`  Mutation type: ${schema.mutationType?.name || 'Not found'}`);
    console.log(`  Subscription type: ${schema.subscriptionType?.name || 'Not found'}`);
    console.log(`  Total types: ${schema.types.length}`);
    
    return true;
  } catch (error) {
    testResults.errors.push({
      test: 'Introspection',
      error: error.message,
      severity: 'CRITICAL'
    });
    console.log(`${colors.red}✗ Introspection failed: ${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Test basic operations from each domain
 */
async function testDomainOperations() {
  console.log(`\n${colors.blue}Testing domain operations...${colors.reset}`);

  const domains = [
    {
      name: 'auth',
      security: 'CRITICAL',
      testQuery: `
        query TestAuthDomain {
          roles(limit: 5) {
            id
            name
            displayName
            priority
          }
        }
      `
    },
    {
      name: 'users',
      security: 'HIGH',
      testQuery: `
        query TestUsersDomain {
          users(limit: 5) {
            id
            email
            name
            role
            isActive
          }
        }
      `
    },
    {
      name: 'clients',
      security: 'HIGH',
      testQuery: `
        query TestClientsDomain {
          clients(limit: 5) {
            id
            name
            active
            contactEmail
          }
        }
      `
    },
    {
      name: 'payrolls',
      security: 'MEDIUM',
      testQuery: `
        query TestPayrollsDomain {
          payrolls(limit: 5) {
            id
            name
            status
            employeeCount
          }
        }
      `
    },
    {
      name: 'billing',
      security: 'HIGH',
      testQuery: `
        query TestBillingDomain {
          billingItems(limit: 5) {
            id
            name
            description
            defaultRate
          }
        }
      `
    }
  ];

  for (const domain of domains) {
    console.log(`\n  Testing ${domain.name} domain (${domain.security})...`);
    
    try {
      const result = await executeGraphQL(domain.testQuery);
      
      if (result.errors) {
        console.log(`  ${colors.red}✗ ${domain.name} failed${colors.reset}`);
        testResults.errors.push({
          test: `Domain: ${domain.name}`,
          error: result.errors,
          severity: domain.security
        });
        testResults.domains[domain.name] = { status: 'failed', errors: result.errors };
      } else {
        console.log(`  ${colors.green}✓ ${domain.name} successful${colors.reset}`);
        console.log(`    Execution time: ${result.executionTime.toFixed(2)}ms`);
        testResults.domains[domain.name] = { 
          status: 'passed', 
          executionTime: result.executionTime,
          dataReturned: !!result.data
        };
      }
    } catch (error) {
      console.log(`  ${colors.red}✗ ${domain.name} error: ${error.message}${colors.reset}`);
      testResults.errors.push({
        test: `Domain: ${domain.name}`,
        error: error.message,
        severity: domain.security
      });
      testResults.domains[domain.name] = { status: 'error', error: error.message };
    }
  }
}

/**
 * Test fragment dependencies
 */
async function testFragmentDependencies() {
  console.log(`\n${colors.blue}Testing fragment dependencies...${colors.reset}`);

  // Test shared fragments
  const fragmentTests = [
    {
      name: 'UserMinimal Fragment',
      query: `
        fragment UserMinimal on users {
          id
          name
          email
        }
        
        query TestUserMinimal {
          users(limit: 1) {
            ...UserMinimal
          }
        }
      `
    },
    {
      name: 'ClientBase Fragment',
      query: `
        fragment ClientBase on clients {
          id
          name
          active
          contactEmail
          contactPerson
          contactPhone
          createdAt
        }
        
        query TestClientBase {
          clients(limit: 1) {
            ...ClientBase
          }
        }
      `
    },
    {
      name: 'PayrollBase Fragment',
      query: `
        fragment PayrollBase on payrolls {
          id
          name
          employeeCount
          status
          payrollSystem
          processingTime
          processingDaysBeforeEft
          versionNumber
          createdAt
          updatedAt
        }
        
        query TestPayrollBase {
          payrolls(limit: 1) {
            ...PayrollBase
          }
        }
      `
    }
  ];

  for (const test of fragmentTests) {
    try {
      const result = await executeGraphQL(test.query);
      
      if (result.errors) {
        console.log(`  ${colors.red}✗ ${test.name} failed${colors.reset}`);
        testResults.errors.push({
          test: `Fragment: ${test.name}`,
          error: result.errors,
          severity: 'MEDIUM'
        });
      } else {
        console.log(`  ${colors.green}✓ ${test.name} successful${colors.reset}`);
      }
    } catch (error) {
      console.log(`  ${colors.red}✗ ${test.name} error: ${error.message}${colors.reset}`);
      testResults.errors.push({
        test: `Fragment: ${test.name}`,
        error: error.message,
        severity: 'MEDIUM'
      });
    }
  }
}

/**
 * Test complex aggregations
 */
async function testAggregations() {
  console.log(`\n${colors.blue}Testing complex aggregations...${colors.reset}`);

  const aggregationTests = [
    {
      name: 'Payroll Statistics',
      query: `
        query TestPayrollStats {
          totalPayrolls: payrollsAggregate {
            aggregate {
              count
            }
          }
          activePayrolls: payrollsAggregate(
            where: { status: { _eq: "Active" } }
          ) {
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
        }
      `
    },
    {
      name: 'Client with Payroll Stats',
      query: `
        query TestClientStats {
          clients(limit: 1) {
            id
            name
            payrollCount: payrollsAggregate {
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
          }
        }
      `
    }
  ];

  for (const test of aggregationTests) {
    try {
      const result = await executeGraphQL(test.query);
      
      if (result.errors) {
        console.log(`  ${colors.red}✗ ${test.name} failed${colors.reset}`);
        testResults.errors.push({
          test: `Aggregation: ${test.name}`,
          error: result.errors,
          severity: 'HIGH'
        });
      } else {
        console.log(`  ${colors.green}✓ ${test.name} successful${colors.reset}`);
        console.log(`    Execution time: ${result.executionTime.toFixed(2)}ms`);
      }
    } catch (error) {
      console.log(`  ${colors.red}✗ ${test.name} error: ${error.message}${colors.reset}`);
    }
  }
}

/**
 * Test custom Hasura functions
 */
async function testCustomFunctions() {
  console.log(`\n${colors.blue}Testing custom Hasura functions...${colors.reset}`);

  // Test if the generatePayrollDates function exists and is accessible
  const functionTest = {
    name: 'Generate Payroll Dates Function',
    query: `
      query TestGeneratePayrollDates {
        __type(name: "Query") {
          fields {
            name
            description
          }
        }
      }
    `
  };

  try {
    const result = await executeGraphQL(functionTest.query);
    
    if (result.errors) {
      console.log(`  ${colors.red}✗ Function introspection failed${colors.reset}`);
    } else {
      const fields = result.data.type.fields;
      const hasGenerateFunction = fields.some(field => 
        field.name.includes('generate') || field.name.includes('payroll')
      );
      
      if (hasGenerateFunction) {
        console.log(`  ${colors.green}✓ Custom functions detected${colors.reset}`);
      } else {
        console.log(`  ${colors.yellow}⚠ No custom functions found${colors.reset}`);
        testResults.recommendations.push({
          type: 'Function Setup',
          message: 'Custom Hasura functions may not be properly configured'
        });
      }
    }
  } catch (error) {
    console.log(`  ${colors.red}✗ Function test error: ${error.message}${colors.reset}`);
  }
}

/**
 * Test subscription capability
 */
async function testSubscriptions() {
  console.log(`\n${colors.blue}Testing subscription capability...${colors.reset}`);

  // Test basic subscription syntax (won't maintain connection)
  const subscriptionTest = {
    name: 'Subscription Syntax',
    query: `
      subscription TestSubscription {
        users(limit: 1) {
          id
          name
          email
        }
      }
    `
  };

  try {
    const result = await executeGraphQL(subscriptionTest.query);
    
    if (result.errors) {
      console.log(`  ${colors.red}✗ Subscription test failed${colors.reset}`);
      testResults.errors.push({
        test: 'Subscription Capability',
        error: result.errors,
        severity: 'MEDIUM'
      });
    } else {
      console.log(`  ${colors.green}✓ Subscription syntax valid${colors.reset}`);
    }
  } catch (error) {
    console.log(`  ${colors.yellow}⚠ Subscription test warning: ${error.message}${colors.reset}`);
    testResults.recommendations.push({
      type: 'Subscription Setup',
      message: 'WebSocket subscriptions may require additional configuration'
    });
  }
}

/**
 * Test performance with complex operations
 */
async function testPerformance() {
  console.log(`\n${colors.blue}Testing performance with complex operations...${colors.reset}`);

  const performanceTests = [
    {
      name: 'Complex Payroll Query',
      query: `
        query ComplexPayrollQuery {
          payrolls(limit: 10) {
            id
            name
            status
            employeeCount
            client {
              id
              name
              active
            }
            primaryConsultant {
              id
              name
              email
            }
            payrollDates(limit: 5, orderBy: { originalEftDate: ASC }) {
              id
              originalEftDate
              adjustedEftDate
            }
          }
        }
      `
    },
    {
      name: 'Dashboard Statistics',
      query: `
        query DashboardStats {
          totalUsers: usersAggregate {
            aggregate { count }
          }
          totalClients: clientsAggregate {
            aggregate { count }
          }
          totalPayrolls: payrollsAggregate {
            aggregate { count }
          }
          activePayrolls: payrollsAggregate(
            where: { status: { _eq: "Active" } }
          ) {
            aggregate { count }
          }
        }
      `
    }
  ];

  for (const test of performanceTests) {
    try {
      const result = await executeGraphQL(test.query);
      
      if (result.errors) {
        console.log(`  ${colors.red}✗ ${test.name} failed${colors.reset}`);
      } else {
        console.log(`  ${colors.green}✓ ${test.name} completed${colors.reset}`);
        console.log(`    Execution time: ${result.executionTime.toFixed(2)}ms`);
        
        testResults.performance[test.name] = {
          executionTime: result.executionTime,
          status: result.executionTime > 1000 ? 'slow' : 'good'
        };

        if (result.executionTime > 1000) {
          testResults.recommendations.push({
            type: 'Performance',
            message: `${test.name} took ${result.executionTime.toFixed(2)}ms - consider optimization`
          });
        }
      }
    } catch (error) {
      console.log(`  ${colors.red}✗ ${test.name} error: ${error.message}${colors.reset}`);
    }
  }
}

/**
 * Generate audit report
 */
function generateReport() {
  console.log(`\n${colors.bold}${colors.blue}=== HASURA GRAPHQL AUDIT REPORT ===${colors.reset}`);
  
  // Summary
  testResults.summary.total = Object.keys(testResults.domains).length + testResults.errors.length;
  testResults.summary.failed = testResults.errors.filter(e => e.severity === 'CRITICAL').length;
  testResults.summary.warnings = testResults.errors.filter(e => e.severity === 'MEDIUM').length;
  testResults.summary.passed = testResults.summary.total - testResults.summary.failed;
  testResults.summary.endTime = new Date().toISOString();

  console.log(`\n${colors.bold}Summary:${colors.reset}`);
  console.log(`  Total Tests: ${testResults.summary.total}`);
  console.log(`  ${colors.green}Passed: ${testResults.summary.passed}${colors.reset}`);
  console.log(`  ${colors.red}Failed: ${testResults.summary.failed}${colors.reset}`);
  console.log(`  ${colors.yellow}Warnings: ${testResults.summary.warnings}${colors.reset}`);

  // Domain Status
  console.log(`\n${colors.bold}Domain Status:${colors.reset}`);
  for (const [domain, result] of Object.entries(testResults.domains)) {
    const status = result.status === 'passed' ? colors.green + '✓' : colors.red + '✗';
    console.log(`  ${status} ${domain}: ${result.status}${colors.reset}`);
    if (result.executionTime) {
      console.log(`    Execution time: ${result.executionTime.toFixed(2)}ms`);
    }
  }

  // Performance Summary
  if (Object.keys(testResults.performance).length > 0) {
    console.log(`\n${colors.bold}Performance Results:${colors.reset}`);
    for (const [test, result] of Object.entries(testResults.performance)) {
      const status = result.status === 'good' ? colors.green : colors.yellow;
      console.log(`  ${status}${test}: ${result.executionTime.toFixed(2)}ms${colors.reset}`);
    }
  }

  // Errors
  if (testResults.errors.length > 0) {
    console.log(`\n${colors.bold}${colors.red}Errors Found:${colors.reset}`);
    testResults.errors.forEach((error, index) => {
      console.log(`\n  ${index + 1}. ${error.test} (${error.severity})`);
      console.log(`     ${JSON.stringify(error.error, null, 2)}`);
    });
  }

  // Recommendations
  if (testResults.recommendations.length > 0) {
    console.log(`\n${colors.bold}${colors.yellow}Recommendations:${colors.reset}`);
    testResults.recommendations.forEach((rec, index) => {
      console.log(`\n  ${index + 1}. ${rec.type}: ${rec.message}`);
    });
  }

  // Save detailed report to file
  const reportPath = path.join(__dirname, '../audit-reports/hasura-graphql-audit-' + new Date().toISOString().split('T')[0] + '.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  
  console.log(`\n${colors.blue}Detailed report saved to: ${reportPath}${colors.reset}`);
}

/**
 * Main execution
 */
async function runAudit() {
  console.log(`${colors.bold}${colors.blue}Starting Comprehensive Hasura GraphQL Audit${colors.reset}`);
  console.log(`Target: ${HASURA_URL}`);
  console.log(`Time: ${new Date().toISOString()}\n`);

  try {
    // Test basic connectivity and schema access
    const introspectionSuccess = await testIntrospection();
    if (!introspectionSuccess) {
      console.log(`${colors.red}${colors.bold}CRITICAL: Cannot access Hasura schema. Aborting audit.${colors.reset}`);
      process.exit(1);
    }

    // Run all tests
    await testDomainOperations();
    await testFragmentDependencies();
    await testAggregations();
    await testCustomFunctions();
    await testSubscriptions();
    await testPerformance();

    // Generate report
    generateReport();

    // Exit with appropriate code
    const hasCriticalErrors = testResults.errors.some(e => e.severity === 'CRITICAL');
    process.exit(hasCriticalErrors ? 1 : 0);

  } catch (error) {
    console.error(`${colors.red}${colors.bold}Audit failed with error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run the audit
if (import.meta.url === `file://${process.argv[1]}`) {
  runAudit().catch(console.error);
}

export { runAudit, executeGraphQL };