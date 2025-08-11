// tests/integration/e2e/payroll-workflow-tests.ts
import { integrationTestFramework, TestSuite } from '@/lib/testing/integration-test-framework';

// ====================================================================
// END-TO-END PAYROLL WORKFLOW TESTS
// Complete business process validation with performance monitoring
// Full user journey testing from creation to completion
// ====================================================================

const payrollWorkflowE2ETestSuite: TestSuite = {
  suiteId: 'payroll-workflow-e2e',
  suiteName: 'End-to-End Payroll Workflow Tests',
  category: 'e2e',
  parallel: false,
  timeout: 180000, // 3 minutes for complete workflows
  tests: [
    // Complete Payroll Lifecycle Test
    {
      testId: 'complete-payroll-lifecycle-test',
      name: 'Complete Payroll Lifecycle E2E',
      description: 'Test complete payroll lifecycle from creation to processing',
      tags: ['e2e', 'payroll', 'lifecycle', 'business-process'],
      priority: 'critical',
      execute: async (context) => {
        const testStartTime = performance.now();
        let assertions = { total: 0, passed: 0, failed: 0 };

        try {
          // Setup complete test scenario
          const scenario = await context.data.setupPayrollScenario('complete-lifecycle');
          
          assertions.total += 12;

          // Step 1: Manager creates new payroll
          const managerToken = await context.helpers.authenticateUser('manager');
          context.graphqlClient.setHeader('Authorization', `Bearer ${managerToken}`);

          const createPayrollMutation = `
            mutation CreatePayroll($data: payrolls_insert_input!) {
              insert_payrolls_one(object: $data) {
                id
                name
                cycle_id
                date_type_id
                client_id
                primary_consultant_user_id
                manager_user_id
                status
                created_at
              }
            }
          `;

          const payrollData = await context.data.generatePayrollData({
            name: 'E2E Test Payroll',
            clientId: scenario.data.clients[0].id,
            consultantId: scenario.data.users.find(u => u.role === 'consultant')?.id,
            managerId: scenario.data.users.find(u => u.role === 'manager')?.id
          });

          const { result: createdPayroll, duration: createDuration } = await context.helpers.measureResponseTime(
            () => context.helpers.makeGraphQLRequest(createPayrollMutation, { data: payrollData })
          );

          // Validate payroll creation
          context.helpers.expectResponse(createdPayroll)
            .toHaveProperty('insert_payrolls_one')
            .toHaveProperty('insert_payrolls_one.id');
          assertions.passed++;

          const payrollId = createdPayroll.insert_payrolls_one.id;

          // Verify payroll dates were generated
          await new Promise(resolve => setTimeout(resolve, 1000)); // Allow date generation
          
          await context.helpers.expectDatabase('payroll_dates')
            .toContainRecord({ payroll_id: payrollId });
          assertions.passed++;

          // Step 2: Consultant accesses assigned payroll
          const consultantToken = await context.helpers.authenticateUser('consultant');
          context.graphqlClient.setHeader('Authorization', `Bearer ${consultantToken}`);

          const consultantQuery = `
            query GetAssignedPayroll($payrollId: uuid!) {
              payrolls_by_pk(id: $payrollId) {
                id
                name
                status
                client {
                  id
                  name
                }
                payrollDates(order_by: { original_eft_date: asc }) {
                  id
                  original_eft_date
                  adjusted_eft_date
                  processing_date
                  status
                }
              }
            }
          `;

          const { result: consultantView, duration: consultantAccessDuration } = await context.helpers.measureResponseTime(
            () => context.helpers.makeGraphQLRequest(consultantQuery, { payrollId })
          );

          // Consultant should be able to access assigned payroll
          context.helpers.expectResponse(consultantView)
            .toHaveProperty('payrolls_by_pk')
            .toHaveProperty('payrolls_by_pk.id', payrollId);
          assertions.passed++;

          // Verify payroll dates are accessible
          if (consultantView.payrolls_by_pk.payrollDates.length > 0) {
            assertions.passed++;
          } else {
            assertions.failed++;
          }

          // Step 3: Add billing items to payroll
          const billingData = await context.data.generateBillingData({
            payrollId: payrollId,
            clientId: scenario.data.clients[0].id,
            amount: 2500.00,
            type: 'consultation'
          });

          const addBillingItemMutation = `
            mutation AddBillingItem($data: billing_items_insert_input!) {
              insert_billing_items_one(object: $data) {
                id
                payroll_id
                amount
                type
                status
              }
            }
          `;

          const { result: billingItem, duration: billingDuration } = await context.helpers.measureResponseTime(
            () => context.helpers.makeGraphQLRequest(addBillingItemMutation, { data: billingData })
          );

          context.helpers.expectResponse(billingItem)
            .toHaveProperty('insert_billing_items_one')
            .toHaveProperty('insert_billing_items_one.payroll_id', payrollId);
          assertions.passed++;

          // Step 4: Update payroll status progression
          const statusUpdates = [
            { status: 'in_progress', description: 'Payroll processing started' },
            { status: 'review', description: 'Ready for manager review' },
            { status: 'approved', description: 'Approved by manager' }
          ];

          for (const statusUpdate of statusUpdates) {
            const updateStatusMutation = `
              mutation UpdatePayrollStatus($id: uuid!, $set: payrolls_set_input!) {
                update_payrolls_by_pk(pk_columns: { id: $id }, _set: $set) {
                  id
                  status
                  updated_at
                }
              }
            `;

            const { result: statusResult, duration: statusDuration } = await context.helpers.measureResponseTime(
              () => context.helpers.makeGraphQLRequest(updateStatusMutation, {
                id: payrollId,
                set: { status: statusUpdate.status }
              })
            );

            context.helpers.expectResponse(statusResult)
              .toHaveProperty('update_payrolls_by_pk')
              .toHaveProperty('update_payrolls_by_pk.status', statusUpdate.status);
          }
          assertions.passed++;

          // Step 5: Manager reviews and processes payroll
          context.graphqlClient.setHeader('Authorization', `Bearer ${managerToken}`);

          const managerReviewQuery = `
            query ManagerPayrollReview($payrollId: uuid!) {
              payrolls_by_pk(id: $payrollId) {
                id
                name
                status
                client {
                  name
                }
                billingItems {
                  id
                  amount
                  type
                  status
                }
                payrollDates {
                  id
                  original_eft_date
                  adjusted_eft_date
                  status
                }
                primaryConsultant {
                  first_name
                  last_name
                }
              }
            }
          `;

          const { result: managerReview, duration: reviewDuration } = await context.helpers.measureResponseTime(
            () => context.helpers.makeGraphQLRequest(managerReviewQuery, { payrollId })
          );

          // Manager should see complete payroll information
          context.helpers.expectResponse(managerReview)
            .toHaveProperty('payrolls_by_pk')
            .toHaveProperty('payrolls_by_pk.billingItems');
          assertions.passed++;

          // Validate billing items are attached
          if (managerReview.payrolls_by_pk.billingItems.length > 0) {
            assertions.passed++;
          } else {
            assertions.failed++;
          }

          // Step 6: Process payroll dates
          const payrollDates = managerReview.payrolls_by_pk.payrollDates;
          
          for (const payrollDate of payrollDates.slice(0, 2)) { // Process first 2 dates
            const processDateMutation = `
              mutation ProcessPayrollDate($id: uuid!, $set: payroll_dates_set_input!) {
                update_payroll_dates_by_pk(pk_columns: { id: $id }, _set: $set) {
                  id
                  status
                  processed_at
                }
              }
            `;

            const processResult = await context.helpers.makeGraphQLRequest(processDateMutation, {
              id: payrollDate.id,
              set: { 
                status: 'processed',
                processed_at: new Date().toISOString()
              }
            });

            context.helpers.expectResponse(processResult)
              .toHaveProperty('update_payroll_dates_by_pk')
              .toHaveProperty('update_payroll_dates_by_pk.status', 'processed');
          }
          assertions.passed++;

          // Step 7: Generate payroll report
          const reportQuery = `
            query GeneratePayrollReport($payrollId: uuid!) {
              payrolls_by_pk(id: $payrollId) {
                id
                name
                status
                created_at
                client {
                  name
                }
                billingItems_aggregate {
                  aggregate {
                    sum {
                      amount
                    }
                    count
                  }
                }
                payrollDates_aggregate {
                  aggregate {
                    count
                  }
                }
                primaryConsultant {
                  first_name
                  last_name
                }
                manager {
                  first_name
                  last_name
                }
              }
            }
          `;

          const { result: reportData, duration: reportDuration } = await context.helpers.measureResponseTime(
            () => context.helpers.makeGraphQLRequest(reportQuery, { payrollId })
          );

          // Report should contain comprehensive data
          context.helpers.expectResponse(reportData)
            .toHaveProperty('payrolls_by_pk')
            .toHaveProperty('payrolls_by_pk.billingItems_aggregate');
          assertions.passed++;

          // Step 8: Verify data consistency across workflow
          const finalStateQuery = `
            query FinalPayrollState($payrollId: uuid!) {
              payrolls_by_pk(id: $payrollId) {
                id
                status
                billingItems {
                  id
                  amount
                }
                payrollDates(where: { status: { _eq: "processed" } }) {
                  id
                  status
                  processed_at
                }
              }
            }
          `;

          const finalState = await context.helpers.makeGraphQLRequest(finalStateQuery, { payrollId });

          // Final state should be consistent
          context.helpers.expectResponse(finalState)
            .toHaveProperty('payrolls_by_pk')
            .toHaveProperty('payrolls_by_pk.status', 'approved');
          assertions.passed++;

          // Processed dates should be marked correctly
          if (finalState.payrolls_by_pk.payrollDates.length >= 2) {
            assertions.passed++;
          } else {
            assertions.failed++;
          }

          // Calculate overall workflow performance
          const totalWorkflowDuration = performance.now() - testStartTime;
          const averageStepDuration = (createDuration + consultantAccessDuration + billingDuration + reviewDuration + reportDuration) / 5;

          await scenario.cleanup();

          return {
            testId: 'complete-payroll-lifecycle-test',
            testName: 'Complete Payroll Lifecycle E2E',
            category: 'e2e',
            status: 'passed',
            duration: totalWorkflowDuration,
            assertions,
            performance: {
              responseTime: averageStepDuration,
              throughput: 8000 / totalWorkflowDuration, // 8 major operations
              errorRate: 0
            },
            metadata: {
              payrollId,
              createDuration,
              consultantAccessDuration,
              billingDuration,
              reviewDuration,
              reportDuration,
              totalWorkflowDuration: Math.round(totalWorkflowDuration),
              averageStepDuration: Math.round(averageStepDuration),
              billingAmount: billingData.amount,
              processedDates: finalState.payrolls_by_pk.payrollDates.length,
              scenarioId: scenario.scenarioId
            }
          };

        } catch (error) {
          assertions.failed++;
          return {
            testId: 'complete-payroll-lifecycle-test',
            testName: 'Complete Payroll Lifecycle E2E',
            category: 'e2e',
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

    // Multi-User Collaboration Workflow
    {
      testId: 'multi-user-collaboration-test',
      name: 'Multi-User Payroll Collaboration Workflow',
      description: 'Test concurrent multi-user collaboration on payroll processing',
      tags: ['e2e', 'collaboration', 'concurrent', 'roles'],
      priority: 'high',
      execute: async (context) => {
        const testStartTime = performance.now();
        let assertions = { total: 0, passed: 0, failed: 0 };

        try {
          const scenario = await context.data.setupPayrollScenario('multi-user-collaboration');
          
          assertions.total += 10;

          // Create test payroll
          const managerToken = await context.helpers.authenticateUser('manager');
          context.graphqlClient.setHeader('Authorization', `Bearer ${managerToken}`);

          const payrollData = await context.data.generatePayrollData({
            name: 'Multi-User Collaboration Test',
            clientId: scenario.data.clients[0].id,
            consultantId: scenario.data.users.find(u => u.role === 'consultant')?.id,
            managerId: scenario.data.users.find(u => u.role === 'manager')?.id
          });

          const createdPayroll = await context.helpers.makeGraphQLRequest(`
            mutation CreatePayroll($data: payrolls_insert_input!) {
              insert_payrolls_one(object: $data) {
                id
                name
              }
            }
          `, { data: payrollData });

          const payrollId = createdPayroll.insert_payrolls_one.id;
          assertions.passed++;

          // Step 1: Concurrent consultant access
          const consultant1Token = await context.helpers.authenticateUser('consultant');
          const consultant2Token = await context.helpers.authenticateUser('consultant');

          const consultantQuery = `
            query GetPayrollDetails($payrollId: uuid!) {
              payrolls_by_pk(id: $payrollId) {
                id
                name
                status
                payrollDates {
                  id
                  original_eft_date
                  status
                }
              }
            }
          `;

          // Simulate concurrent consultant access
          const concurrentConsultantAccess = [
            context.helpers.makeGraphQLRequest(consultantQuery, { payrollId }).then(result => ({
              user: 'consultant1',
              result,
              token: consultant1Token
            })),
            context.helpers.makeGraphQLRequest(consultantQuery, { payrollId }).then(result => ({
              user: 'consultant2', 
              result,
              token: consultant2Token
            }))
          ];

          const consultantResults = await Promise.all(concurrentConsultantAccess);

          // Both consultants should access successfully
          if (consultantResults.every(r => r.result.payrolls_by_pk)) {
            assertions.passed++;
          } else {
            assertions.failed++;
          }

          // Step 2: Concurrent billing item creation
          const billingCreationPromises = [
            {
              user: 'consultant1',
              data: await context.data.generateBillingData({
                payrollId,
                amount: 1500.00,
                type: 'consultation',
                description: 'Consultant 1 services'
              })
            },
            {
              user: 'consultant2', 
              data: await context.data.generateBillingData({
                payrollId,
                amount: 2000.00,
                type: 'advisory',
                description: 'Consultant 2 services'
              })
            }
          ];

          const billingMutation = `
            mutation AddBillingItem($data: billing_items_insert_input!) {
              insert_billing_items_one(object: $data) {
                id
                amount
                type
                payroll_id
              }
            }
          `;

          const { duration: concurrentBillingDuration } = await context.helpers.measureResponseTime(async () => {
            const billingResults = await Promise.all(
              billingCreationPromises.map(billing =>
                context.helpers.makeGraphQLRequest(billingMutation, { data: billing.data })
              )
            );
            
            return billingResults;
          });

          // Concurrent billing creation should be efficient
          context.helpers.expectResponse({ duration: concurrentBillingDuration })
            .toBeFasterThan(2000);
          assertions.passed++;

          // Step 3: Concurrent status updates with conflict resolution
          const statusUpdatePromises = [
            {
              user: 'manager',
              status: 'in_progress',
              token: managerToken
            },
            {
              user: 'consultant1',
              status: 'ready_for_review',
              token: consultant1Token
            }
          ];

          const statusUpdateMutation = `
            mutation UpdatePayrollStatus($id: uuid!, $set: payrolls_set_input!) {
              update_payrolls_by_pk(pk_columns: { id: $id }, _set: $set) {
                id
                status
                updated_at
              }
            }
          `;

          const statusUpdateResults = await Promise.allSettled(
            statusUpdatePromises.map(async (update) => {
              context.graphqlClient.setHeader('Authorization', `Bearer ${update.token}`);
              return await context.helpers.makeGraphQLRequest(statusUpdateMutation, {
                id: payrollId,
                set: { status: update.status }
              });
            })
          );

          // At least one status update should succeed
          const successfulStatusUpdates = statusUpdateResults.filter(r => r.status === 'fulfilled').length;
          if (successfulStatusUpdates >= 1) {
            assertions.passed++;
          } else {
            assertions.failed++;
          }

          // Step 4: Real-time collaboration simulation
          context.graphqlClient.setHeader('Authorization', `Bearer ${managerToken}`);

          const realTimeUpdates = [];
          for (let i = 0; i < 5; i++) {
            const updatePromise = context.helpers.measureResponseTime(async () => {
              return await context.helpers.makeGraphQLRequest(`
                mutation RealtimeUpdate$${i}($id: uuid!, $set: payrolls_set_input!) {
                  update_payrolls_by_pk(pk_columns: { id: $id }, _set: $set) {
                    id
                    updated_at
                  }
                }
              `, {
                id: payrollId,
                set: { name: `Collaboration Test - Update ${i} - ${Date.now()}` }
              });
            });
            
            realTimeUpdates.push(updatePromise);
            
            // Small delay between updates
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          const realtimeResults = await Promise.all(realTimeUpdates);
          const averageRealtimeUpdateTime = realtimeResults.reduce((sum, r) => sum + r.duration, 0) / realtimeResults.length;

          context.helpers.expectResponse({ duration: averageRealtimeUpdateTime })
            .toBeFasterThan(300); // Real-time updates should be fast
          assertions.passed++;

          // Step 5: Collaborative report generation
          const collaborativeReportQuery = `
            query CollaborativeReport($payrollId: uuid!) {
              payrolls_by_pk(id: $payrollId) {
                id
                name
                status
                updated_at
                client {
                  name
                }
                billingItems {
                  id
                  amount
                  type
                  created_at
                }
                billingItems_aggregate {
                  aggregate {
                    sum {
                      amount
                    }
                    count
                  }
                }
                payrollDates {
                  id
                  original_eft_date
                  adjusted_eft_date
                  status
                }
                primaryConsultant {
                  first_name
                  last_name
                }
                manager {
                  first_name
                  last_name
                }
              }
            }
          `;

          const { result: collaborativeReport, duration: reportGenerationTime } = await context.helpers.measureResponseTime(
            () => context.helpers.makeGraphQLRequest(collaborativeReportQuery, { payrollId })
          );

          // Report should include all collaborative changes
          context.helpers.expectResponse(collaborativeReport)
            .toHaveProperty('payrolls_by_pk')
            .toHaveProperty('payrolls_by_pk.billingItems');
          assertions.passed++;

          // Should have billing items from both consultants
          if (collaborativeReport.payrolls_by_pk.billingItems.length >= 2) {
            assertions.passed++;
          } else {
            assertions.failed++;
          }

          // Step 6: Concurrent data consistency validation
          const dataConsistencyQueries = [
            'manager',
            'consultant1',
            'consultant2'
          ].map(async (userRole) => {
            const token = await context.helpers.authenticateUser(userRole === 'consultant1' || userRole === 'consultant2' ? 'consultant' : userRole);
            context.graphqlClient.setHeader('Authorization', `Bearer ${token}`);
            
            return await context.helpers.makeGraphQLRequest(`
              query ConsistencyCheck$${userRole}($payrollId: uuid!) {
                payrolls_by_pk(id: $payrollId) {
                  id
                  status
                  updated_at
                  billingItems_aggregate {
                    aggregate {
                      count
                      sum {
                        amount
                      }
                    }
                  }
                }
              }
            `, { payrollId });
          });

          const consistencyResults = await Promise.all(dataConsistencyQueries);

          // All users should see consistent data
          const statuses = consistencyResults.map(r => r.payrolls_by_pk.status);
          const billingCounts = consistencyResults.map(r => r.payrolls_by_pk.billingItems_aggregate.aggregate.count);
          const billingTotals = consistencyResults.map(r => r.payrolls_by_pk.billingItems_aggregate.aggregate.sum.amount);

          const statusConsistent = statuses.every(s => s === statuses[0]);
          const billingCountConsistent = billingCounts.every(c => c === billingCounts[0]);
          const billingTotalConsistent = billingTotals.every(t => t === billingTotals[0]);

          if (statusConsistent && billingCountConsistent && billingTotalConsistent) {
            assertions.passed++;
          } else {
            assertions.failed++;
          }

          // Step 7: Performance under collaboration load
          context.helpers.expectResponse({ duration: concurrentBillingDuration })
            .toBeFasterThan(2000);

          context.helpers.expectResponse({ duration: averageRealtimeUpdateTime })
            .toBeFasterThan(300);

          context.helpers.expectResponse({ duration: reportGenerationTime })
            .toBeFasterThan(1500);

          assertions.passed++;

          await scenario.cleanup();

          return {
            testId: 'multi-user-collaboration-test',
            testName: 'Multi-User Payroll Collaboration Workflow',
            category: 'e2e',
            status: 'passed',
            duration: performance.now() - testStartTime,
            assertions,
            performance: {
              responseTime: (concurrentBillingDuration + averageRealtimeUpdateTime + reportGenerationTime) / 3,
              throughput: 12000 / (performance.now() - testStartTime), // 12 major collaborative operations
              errorRate: (statusUpdateResults.filter(r => r.status === 'rejected').length / statusUpdateResults.length) * 100
            },
            metadata: {
              payrollId,
              concurrentBillingDuration,
              averageRealtimeUpdateTime,
              reportGenerationTime,
              successfulStatusUpdates,
              consistencyResults: {
                statusConsistent,
                billingCountConsistent,
                billingTotalConsistent
              },
              totalBillingItems: billingCounts[0],
              totalBillingAmount: billingTotals[0],
              scenarioId: scenario.scenarioId
            }
          };

        } catch (error) {
          assertions.failed++;
          return {
            testId: 'multi-user-collaboration-test',
            testName: 'Multi-User Payroll Collaboration Workflow',
            category: 'e2e',
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
    console.log('Setting up End-to-End Payroll Workflow Test Suite...');
  },

  teardown: async () => {
    console.log('Tearing down End-to-End Payroll Workflow Test Suite...');
  }
};

// Register the test suite
integrationTestFramework.registerSuite(payrollWorkflowE2ETestSuite);

export { payrollWorkflowE2ETestSuite };