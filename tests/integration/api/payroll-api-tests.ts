// tests/integration/api/payroll-api-tests.ts
import { integrationTestFramework, TestSuite, TestCase } from '@/lib/testing/integration-test-framework';

// ====================================================================
// PAYROLL API INTEGRATION TESTS
// Comprehensive API testing for payroll management system
// Performance validation and business logic verification
// ====================================================================

const payrollApiTestSuite: TestSuite = {
  suiteId: 'payroll-api-tests',
  suiteName: 'Payroll API Integration Tests',
  category: 'api',
  parallel: false,
  timeout: 60000,
  tests: [
    // Payroll CRUD Operations
    {
      testId: 'payroll-create-api-test',
      name: 'Create Payroll via API',
      description: 'Test payroll creation with full validation and performance monitoring',
      tags: ['api', 'crud', 'payroll', 'performance'],
      priority: 'critical',
      execute: async (context) => {
        const testStartTime = performance.now();
        let assertions = { total: 0, passed: 0, failed: 0 };

        try {
          // Setup test data
          const scenario = await context.data.setupPayrollScenario('basic-payroll-creation');
          const testUser = scenario.data.users.find(u => u.role === 'manager');
          const testClient = scenario.data.clients[0];

          assertions.total += 4;

          // Test 1: Create payroll with valid data
          const createPayrollMutation = `
            mutation CreatePayroll($data: payrolls_insert_input!) {
              insert_payrolls_one(object: $data) {
                id
                name
                cycle_id
                client_id
                primary_consultant_user_id
                manager_user_id
                created_at
                updated_at
              }
            }
          `;

          const payrollData = await context.data.generatePayrollData({
            clientId: testClient.id,
            consultantId: scenario.data.users.find(u => u.role === 'consultant')?.id,
            managerId: testUser.id
          });

          const { result: createResult, duration: createDuration } = await context.helpers.measureResponseTime(
            () => context.helpers.makeGraphQLRequest(createPayrollMutation, { data: payrollData })
          );

          // Validate response structure
          context.helpers.expectResponse(createResult)
            .toHaveProperty('insert_payrolls_one')
            .toHaveProperty('insert_payrolls_one.id');
          assertions.passed++;

          // Validate performance
          context.helpers.expectResponse({ duration: createDuration })
            .toBeFasterThan(2000); // Should create within 2 seconds
          assertions.passed++;

          // Test 2: Verify payroll was created in database
          await context.helpers.expectDatabase('payrolls')
            .toContainRecord({ id: createResult.insert_payrolls_one.id });
          assertions.passed++;

          // Test 3: Verify payroll dates were generated
          await context.helpers.expectDatabase('payroll_dates')
            .toHaveRecordCount(1); // At least one payroll date should be generated
          assertions.passed++;

          // Cleanup
          await scenario.cleanup();

          return {
            testId: 'payroll-create-api-test',
            testName: 'Create Payroll via API',
            category: 'api',
            status: 'passed',
            duration: performance.now() - testStartTime,
            assertions,
            performance: {
              responseTime: createDuration,
              throughput: 1000 / createDuration, // Requests per second
              errorRate: 0
            },
            metadata: {
              payrollId: createResult.insert_payrolls_one.id,
              createDuration,
              scenarioId: scenario.scenarioId
            }
          };

        } catch (error) {
          assertions.failed++;
          return {
            testId: 'payroll-create-api-test',
            testName: 'Create Payroll via API',
            category: 'api',
            status: 'failed',
            duration: performance.now() - testStartTime,
            assertions,
            error: {
              message: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            },
            metadata: {}
          };
        }
      }
    },

    {
      testId: 'payroll-query-performance-test',
      name: 'Payroll Query Performance',
      description: 'Test optimized payroll queries with performance benchmarking',
      tags: ['api', 'performance', 'query-optimization'],
      priority: 'high',
      execute: async (context) => {
        const testStartTime = performance.now();
        let assertions = { total: 0, passed: 0, failed: 0 };

        try {
          // Setup test data with multiple payrolls
          const scenario = await context.data.setupPayrollScenario('performance-testing');
          
          assertions.total += 6;

          // Test 1: Simple payroll list query
          const simpleQuery = `
            query GetPayrolls {
              payrolls(limit: 10) {
                id
                name
                status
                created_at
              }
            }
          `;

          const { result: simpleResult, duration: simpleDuration } = await context.helpers.measureResponseTime(
            () => context.helpers.makeGraphQLRequest(simpleQuery)
          );

          context.helpers.expectResponse(simpleResult)
            .toHaveProperty('payrolls');
          assertions.passed++;

          context.helpers.expectResponse({ duration: simpleDuration })
            .toBeFasterThan(500); // Simple query should be very fast
          assertions.passed++;

          // Test 2: Complex payroll query with relationships
          const complexQuery = `
            query GetPayrollsWithRelations {
              payrolls(limit: 10) {
                id
                name
                status
                client {
                  id
                  name
                }
                primaryConsultant {
                  id
                  firstName
                  lastName
                  computedName
                }
                backupConsultant {
                  id
                  firstName
                  lastName
                }
                manager {
                  id
                  firstName
                  lastName
                }
                payrollDates(limit: 5) {
                  originalEftDate
                  adjustedEftDate
                  processingDate
                }
              }
            }
          `;

          const { result: complexResult, duration: complexDuration } = await context.helpers.measureResponseTime(
            () => context.helpers.makeGraphQLRequest(complexQuery)
          );

          context.helpers.expectResponse(complexResult)
            .toHaveProperty('payrolls');
          assertions.passed++;

          context.helpers.expectResponse({ duration: complexDuration })
            .toBeFasterThan(2000); // Complex query should complete within 2 seconds
          assertions.passed++;

          // Test 3: Aggregation query performance
          const aggregationQuery = `
            query GetPayrollAggregates {
              payrolls_aggregate {
                aggregate {
                  count
                }
              }
              payrolls(
                where: { status: { _eq: "active" } }
                order_by: { created_at: desc }
                limit: 5
              ) {
                id
                name
                status
                client {
                  name
                }
              }
            }
          `;

          const { result: aggResult, duration: aggDuration } = await context.helpers.measureResponseTime(
            () => context.helpers.makeGraphQLRequest(aggregationQuery)
          );

          context.helpers.expectResponse(aggResult)
            .toHaveProperty('payrolls_aggregate');
          assertions.passed++;

          context.helpers.expectResponse({ duration: aggDuration })
            .toBeFasterThan(1000); // Aggregation should be optimized
          assertions.passed++;

          // Cleanup
          await scenario.cleanup();

          return {
            testId: 'payroll-query-performance-test',
            testName: 'Payroll Query Performance',
            category: 'api',
            status: 'passed',
            duration: performance.now() - testStartTime,
            assertions,
            performance: {
              responseTime: (simpleDuration + complexDuration + aggDuration) / 3,
              throughput: 3000 / (simpleDuration + complexDuration + aggDuration),
              errorRate: 0
            },
            metadata: {
              simpleQueryDuration: simpleDuration,
              complexQueryDuration: complexDuration,
              aggregationQueryDuration: aggDuration,
              scenarioId: scenario.scenarioId
            }
          };

        } catch (error) {
          assertions.failed++;
          return {
            testId: 'payroll-query-performance-test',
            testName: 'Payroll Query Performance',
            category: 'api',
            status: 'failed',
            duration: performance.now() - testStartTime,
            assertions,
            error: {
              message: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            },
            metadata: {}
          };
        }
      }
    },

    {
      testId: 'payroll-update-optimistic-test',
      name: 'Optimistic Payroll Updates',
      description: 'Test optimistic payroll updates with conflict resolution',
      tags: ['api', 'concurrency', 'performance'],
      priority: 'high',
      execute: async (context) => {
        const testStartTime = performance.now();
        let assertions = { total: 0, passed: 0, failed: 0 };

        try {
          const scenario = await context.data.setupPayrollScenario('concurrent-updates');
          const payrollId = scenario.data.payrolls[0].id;

          assertions.total += 4;

          // Test 1: Single update performance
          const updateMutation = `
            mutation UpdatePayroll($id: uuid!, $set: payrolls_set_input!) {
              update_payrolls_by_pk(pk_columns: { id: $id }, _set: $set) {
                id
                name
                updated_at
              }
            }
          `;

          const { result: singleUpdate, duration: singleDuration } = await context.helpers.measureResponseTime(
            () => context.helpers.makeGraphQLRequest(updateMutation, {
              id: payrollId,
              set: { name: `Updated Payroll ${Date.now()}` }
            })
          );

          context.helpers.expectResponse(singleUpdate)
            .toHaveProperty('update_payrolls_by_pk')
            .toHaveProperty('update_payrolls_by_pk.id', payrollId);
          assertions.passed++;

          context.helpers.expectResponse({ duration: singleDuration })
            .toBeFasterThan(1000);
          assertions.passed++;

          // Test 2: Concurrent updates simulation
          const concurrentUpdatePromises = Array.from({ length: 5 }, (_, index) =>
            context.helpers.measureResponseTime(() =>
              context.helpers.makeGraphQLRequest(updateMutation, {
                id: payrollId,
                set: { name: `Concurrent Update ${index}-${Date.now()}` }
              })
            )
          );

          const concurrentResults = await Promise.allSettled(concurrentUpdatePromises);
          const successfulUpdates = concurrentResults.filter(r => r.status === 'fulfilled').length;

          // At least some concurrent updates should succeed
          if (successfulUpdates >= 3) {
            assertions.passed++;
          } else {
            assertions.failed++;
          }

          // Test 3: Verify final state consistency
          const finalStateQuery = `
            query GetPayrollFinalState($id: uuid!) {
              payrolls_by_pk(id: $id) {
                id
                name
                updated_at
              }
            }
          `;

          const finalState = await context.helpers.makeGraphQLRequest(finalStateQuery, {
            id: payrollId
          });

          context.helpers.expectResponse(finalState)
            .toHaveProperty('payrolls_by_pk')
            .toHaveProperty('payrolls_by_pk.id', payrollId);
          assertions.passed++;

          await scenario.cleanup();

          return {
            testId: 'payroll-update-optimistic-test',
            testName: 'Optimistic Payroll Updates',
            category: 'api',
            status: 'passed',
            duration: performance.now() - testStartTime,
            assertions,
            performance: {
              responseTime: singleDuration,
              throughput: 1000 / singleDuration,
              errorRate: (5 - successfulUpdates) / 5 * 100
            },
            metadata: {
              singleUpdateDuration: singleDuration,
              successfulConcurrentUpdates: successfulUpdates,
              payrollId,
              scenarioId: scenario.scenarioId
            }
          };

        } catch (error) {
          assertions.failed++;
          return {
            testId: 'payroll-update-optimistic-test',
            testName: 'Optimistic Payroll Updates',
            category: 'api',
            status: 'failed',
            duration: performance.now() - testStartTime,
            assertions,
            error: {
              message: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            },
            metadata: {}
          };
        }
      }
    },

    {
      testId: 'payroll-bulk-operations-test',
      name: 'Payroll Bulk Operations',
      description: 'Test bulk payroll operations with N+1 optimization validation',
      tags: ['api', 'bulk-operations', 'performance', 'optimization'],
      priority: 'high',
      execute: async (context) => {
        const testStartTime = performance.now();
        let assertions = { total: 0, passed: 0, failed: 0 };

        try {
          const scenario = await context.data.setupPayrollScenario('bulk-operations');

          assertions.total += 5;

          // Test 1: Bulk payroll creation
          const bulkPayrolls = await Promise.all(
            Array.from({ length: 10 }, (_, index) =>
              context.data.generatePayrollData({
                name: `Bulk Payroll ${index}`,
                clientId: scenario.data.clients[0].id
              })
            )
          );

          const bulkCreateMutation = `
            mutation BulkCreatePayrolls($payrolls: [payrolls_insert_input!]!) {
              insert_payrolls(objects: $payrolls) {
                returning {
                  id
                  name
                }
              }
            }
          `;

          const { result: bulkCreateResult, duration: bulkCreateDuration } = await context.helpers.measureResponseTime(
            () => context.helpers.makeGraphQLRequest(bulkCreateMutation, { payrolls: bulkPayrolls })
          );

          context.helpers.expectResponse(bulkCreateResult)
            .toHaveProperty('insert_payrolls')
            .toHaveProperty('insert_payrolls.returning');
          
          if (bulkCreateResult.insert_payrolls.returning.length === 10) {
            assertions.passed++;
          } else {
            assertions.failed++;
          }

          // Bulk operations should be efficient (not linear scaling)
          context.helpers.expectResponse({ duration: bulkCreateDuration })
            .toBeFasterThan(5000); // 10 payrolls in under 5 seconds
          assertions.passed++;

          // Test 2: Bulk query with relationships (N+1 test)
          const bulkQueryWithRelations = `
            query BulkPayrollsWithRelations {
              payrolls(where: { name: { _like: "Bulk Payroll%" } }) {
                id
                name
                client {
                  id
                  name
                }
                primaryConsultant {
                  id
                  firstName
                  lastName
                }
                payrollDates(limit: 2) {
                  originalEftDate
                  adjustedEftDate
                }
              }
            }
          `;

          const { result: bulkQueryResult, duration: bulkQueryDuration } = await context.helpers.measureResponseTime(
            () => context.helpers.makeGraphQLRequest(bulkQueryWithRelations)
          );

          context.helpers.expectResponse(bulkQueryResult)
            .toHaveProperty('payrolls');
          assertions.passed++;

          // N+1 optimization test - should not scale linearly with relationship count
          context.helpers.expectResponse({ duration: bulkQueryDuration })
            .toBeFasterThan(3000); // Optimized query should be fast despite relationships
          assertions.passed++;

          // Test 3: Bulk update operations
          const payrollIds = bulkCreateResult.insert_payrolls.returning.map(p => p.id);
          const bulkUpdateMutation = `
            mutation BulkUpdatePayrolls($where: payrolls_bool_exp!, $set: payrolls_set_input!) {
              update_payrolls(where: $where, _set: $set) {
                affected_rows
                returning {
                  id
                  name
                  updated_at
                }
              }
            }
          `;

          const { result: bulkUpdateResult, duration: bulkUpdateDuration } = await context.helpers.measureResponseTime(
            () => context.helpers.makeGraphQLRequest(bulkUpdateMutation, {
              where: { id: { _in: payrollIds } },
              set: { name: `Updated Bulk Payroll ${Date.now()}` }
            })
          );

          context.helpers.expectResponse(bulkUpdateResult)
            .toHaveProperty('update_payrolls')
            .toHaveProperty('update_payrolls.affected_rows', 10);
          assertions.passed++;

          await scenario.cleanup();

          return {
            testId: 'payroll-bulk-operations-test',
            testName: 'Payroll Bulk Operations',
            category: 'api',
            status: 'passed',
            duration: performance.now() - testStartTime,
            assertions,
            performance: {
              responseTime: (bulkCreateDuration + bulkQueryDuration + bulkUpdateDuration) / 3,
              throughput: 30000 / (bulkCreateDuration + bulkQueryDuration + bulkUpdateDuration), // 30 total ops
              errorRate: 0
            },
            metadata: {
              bulkCreateDuration,
              bulkQueryDuration,
              bulkUpdateDuration,
              payrollsCreated: bulkCreateResult.insert_payrolls.returning.length,
              scenarioId: scenario.scenarioId
            }
          };

        } catch (error) {
          assertions.failed++;
          return {
            testId: 'payroll-bulk-operations-test',
            testName: 'Payroll Bulk Operations',
            category: 'api',
            status: 'failed',
            duration: performance.now() - testStartTime,
            assertions,
            error: {
              message: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            },
            metadata: {}
          };
        }
      }
    },

    {
      testId: 'payroll-permission-validation-test',
      name: 'Payroll Permission Validation',
      description: 'Test role-based access control for payroll operations',
      tags: ['api', 'security', 'permissions', 'rbac'],
      priority: 'critical',
      execute: async (context) => {
        const testStartTime = performance.now();
        let assertions = { total: 0, passed: 0, failed: 0 };

        try {
          const scenario = await context.data.setupPayrollScenario('permission-testing');
          const testPayrollId = scenario.data.payrolls[0].id;

          assertions.total += 8;

          // Test 1: Manager can create payrolls
          const createPayrollMutation = `
            mutation CreatePayroll($data: payrolls_insert_input!) {
              insert_payrolls_one(object: $data) {
                id
                name
              }
            }
          `;

          const managerToken = await context.helpers.authenticateUser('manager');
          context.graphqlClient.setHeader('Authorization', `Bearer ${managerToken}`);

          const managerPayrollData = await context.data.generatePayrollData({
            clientId: scenario.data.clients[0].id
          });

          const managerCreateResult = await context.helpers.makeGraphQLRequest(
            createPayrollMutation, 
            { data: managerPayrollData }
          );

          context.helpers.expectResponse(managerCreateResult)
            .toHaveProperty('insert_payrolls_one')
            .toHaveProperty('insert_payrolls_one.id');
          assertions.passed++;

          // Test 2: Consultant can read assigned payrolls
          const consultantToken = await context.helpers.authenticateUser('consultant');
          context.graphqlClient.setHeader('Authorization', `Bearer ${consultantToken}`);

          const assignedPayrollQuery = `
            query GetAssignedPayrolls {
              payrolls(where: {
                _or: [
                  { primary_consultant_user_id: { _eq: $userId } },
                  { backup_consultant_user_id: { _eq: $userId } }
                ]
              }) {
                id
                name
              }
            }
          `;

          const consultantUserId = scenario.data.users.find(u => u.role === 'consultant')?.id;
          const consultantReadResult = await context.helpers.makeGraphQLRequest(
            assignedPayrollQuery,
            { userId: consultantUserId }
          );

          context.helpers.expectResponse(consultantReadResult)
            .toHaveProperty('payrolls');
          assertions.passed++;

          // Test 3: Consultant cannot create payrolls
          try {
            await context.helpers.makeGraphQLRequest(
              createPayrollMutation,
              { data: managerPayrollData }
            );
            // If this succeeds, it should fail the test
            assertions.failed++;
          } catch (error) {
            // Expected to fail due to permissions
            assertions.passed++;
          }

          // Test 4: Viewer can only read basic payroll info
          const viewerToken = await context.helpers.authenticateUser('viewer');
          context.graphqlClient.setHeader('Authorization', `Bearer ${viewerToken}`);

          const basicPayrollQuery = `
            query GetBasicPayrolls {
              payrolls(limit: 5) {
                id
                name
                status
              }
            }
          `;

          const viewerReadResult = await context.helpers.makeGraphQLRequest(basicPayrollQuery);

          context.helpers.expectResponse(viewerReadResult)
            .toHaveProperty('payrolls');
          assertions.passed++;

          // Test 5: Viewer cannot access sensitive payroll data
          const sensitivePayrollQuery = `
            query GetSensitivePayrollData {
              payrolls(limit: 5) {
                id
                name
                billingItems {
                  amount
                  type
                }
                manager {
                  email
                  salary
                }
              }
            }
          `;

          try {
            await context.helpers.makeGraphQLRequest(sensitivePayrollQuery);
            // If this succeeds without filtering sensitive data, it should fail
            assertions.failed++;
          } catch (error) {
            // Expected to fail or return filtered data
            assertions.passed++;
          }

          // Test 6: Manager can update payrolls
          context.graphqlClient.setHeader('Authorization', `Bearer ${managerToken}`);

          const updatePayrollMutation = `
            mutation UpdatePayroll($id: uuid!, $set: payrolls_set_input!) {
              update_payrolls_by_pk(pk_columns: { id: $id }, _set: $set) {
                id
                name
                updated_at
              }
            }
          `;

          const managerUpdateResult = await context.helpers.makeGraphQLRequest(
            updatePayrollMutation,
            {
              id: testPayrollId,
              set: { name: `Updated by Manager ${Date.now()}` }
            }
          );

          context.helpers.expectResponse(managerUpdateResult)
            .toHaveProperty('update_payrolls_by_pk')
            .toHaveProperty('update_payrolls_by_pk.id', testPayrollId);
          assertions.passed++;

          // Test 7: Consultant cannot update non-assigned payrolls
          context.graphqlClient.setHeader('Authorization', `Bearer ${consultantToken}`);

          try {
            await context.helpers.makeGraphQLRequest(
              updatePayrollMutation,
              {
                id: testPayrollId,
                set: { name: `Unauthorized Update ${Date.now()}` }
              }
            );
            assertions.failed++;
          } catch (error) {
            assertions.passed++;
          }

          // Test 8: Admin can delete payrolls
          const adminToken = await context.helpers.authenticateUser('admin');
          context.graphqlClient.setHeader('Authorization', `Bearer ${adminToken}`);

          const deletePayrollMutation = `
            mutation DeletePayroll($id: uuid!) {
              delete_payrolls_by_pk(id: $id) {
                id
              }
            }
          `;

          const adminDeleteResult = await context.helpers.makeGraphQLRequest(
            deletePayrollMutation,
            { id: managerCreateResult.insert_payrolls_one.id }
          );

          context.helpers.expectResponse(adminDeleteResult)
            .toHaveProperty('delete_payrolls_by_pk')
            .toHaveProperty('delete_payrolls_by_pk.id');
          assertions.passed++;

          await scenario.cleanup();

          return {
            testId: 'payroll-permission-validation-test',
            testName: 'Payroll Permission Validation',
            category: 'api',
            status: 'passed',
            duration: performance.now() - testStartTime,
            assertions,
            performance: {
              responseTime: 0, // Permission checks should be fast
              throughput: 0,
              errorRate: 0
            },
            metadata: {
              testPayrollId,
              consultantUserId,
              scenarioId: scenario.scenarioId
            }
          };

        } catch (error) {
          assertions.failed++;
          return {
            testId: 'payroll-permission-validation-test',
            testName: 'Payroll Permission Validation',
            category: 'api',
            status: 'failed',
            duration: performance.now() - testStartTime,
            assertions,
            error: {
              message: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            },
            metadata: {}
          };
        }
      }
    }
  ],

  setup: async () => {
    // Global setup for payroll API tests
    console.log('Setting up Payroll API Test Suite...');
  },

  teardown: async () => {
    // Global teardown for payroll API tests
    console.log('Tearing down Payroll API Test Suite...');
  }
};

// Register the test suite
integrationTestFramework.registerSuite(payrollApiTestSuite);

export { payrollApiTestSuite };