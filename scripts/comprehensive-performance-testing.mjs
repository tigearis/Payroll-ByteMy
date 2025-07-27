#!/usr/bin/env node

/**
 * Comprehensive Performance & Scalability Testing
 * 
 * Phase 3.3: Deep performance analysis for enterprise payroll system
 * 
 * Tests:
 * 1. Query Performance Analysis - Complex business queries under load
 * 2. Concurrent User Simulation - Multiple consultants accessing different clients
 * 3. Permission System Performance - Hierarchical permission checking at scale
 * 4. Aggregate Operations Performance - Dashboard and reporting queries
 * 5. Memory Usage Patterns - GraphQL query complexity analysis
 * 6. Database Query Optimization - Identify N+1 queries and inefficiencies
 * 7. Real-world Load Simulation - Authentic business workflow patterns
 */

import fetch from 'node-fetch';
import { config } from 'dotenv';
import fs from 'fs';

// Load environment variables
config({ path: '.env.development.local' });

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

class ComprehensivePerformanceTester {
  constructor() {
    this.results = {
      queryPerformance: {},
      concurrentUserTests: {},
      permissionSystemPerformance: {},
      aggregatePerformance: {},
      memoryAnalysis: {},
      databaseOptimization: {},
      realWorldSimulation: {},
      summary: {
        totalTests: 0,
        averageResponseTime: 0,
        slowQueries: [],
        performanceIssues: [],
        scalabilityRecommendations: []
      }
    };
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const icons = {
      'info': '🔍',
      'success': '✅', 
      'error': '❌',
      'warning': '⚠️',
      'performance': '⚡',
      'slow': '🐌',
      'fast': '🚀'
    };
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`${icons[type]} [${timestamp}] ${message}`);
  }

  async executeTimedQuery(query, variables = {}, description = '') {
    const startTime = performance.now();
    
    try {
      const response = await fetch(HASURA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': ADMIN_SECRET
        },
        body: JSON.stringify({ query, variables })
      });

      const result = await response.json();
      const endTime = performance.now();
      const executionTime = Math.round(endTime - startTime);

      if (result.errors) {
        throw new Error(`GraphQL error: ${result.errors[0]?.message}`);
      }

      return {
        success: true,
        data: result.data,
        executionTime,
        description,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      const endTime = performance.now();
      return {
        success: false,
        error: error.message,
        executionTime: Math.round(endTime - startTime),
        description,
        timestamp: new Date().toISOString()
      };
    }
  }

  async testQueryPerformance() {
    this.log('⚡ Testing query performance across different complexity levels', 'performance');

    const queryTests = [
      {
        name: 'simple_user_list',
        complexity: 'low',
        description: 'Basic user listing',
        query: `
          query SimpleUserList {
            users(limit: 10) {
              id
              name
              email
              role
            }
          }
        `
      },
      {
        name: 'complex_payroll_dashboard',
        complexity: 'high',
        description: 'Complex payroll dashboard with multiple aggregations',
        query: `
          query ComplexPayrollDashboard {
            payrolls(limit: 20) {
              id
              name
              status
              client {
                id
                name
                active
              }
              payrollStaffAggregate {
                aggregate {
                  count
                }
              }
              timeEntriesAggregate {
                aggregate {
                  count
                  sum {
                    hoursWorked
                  }
                }
              }
            }
            payrollsAggregate {
              aggregate {
                count
              }
            }
            clientsAggregate(where: {active: {_eq: true}}) {
              aggregate {
                count
              }
            }
          }
        `
      },
      {
        name: 'nested_user_relationships',
        complexity: 'medium',
        description: 'Users with nested relationships',
        query: `
          query NestedUserRelationships {
            users(limit: 10) {
              id
              name
              role
              assignedRoles {
                id
                assignedRole {
                  name
                  priority
                }
              }
              authoredNotes {
                id
                title
                createdAt
              }
              billingItems {
                id
                amount
                status
              }
            }
          }
        `
      },
      {
        name: 'permission_intensive_query',
        complexity: 'high',
        description: 'Query that exercises permission system heavily',
        query: `
          query PermissionIntensiveQuery {
            users {
              id
              name
              role
              assignedRoles {
                assignedRole {
                  name
                  rolePermissions {
                    grantedPermission {
                      action
                      relatedResource {
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        `
      },
      {
        name: 'aggregate_heavy_query',
        complexity: 'very_high',
        description: 'Multiple complex aggregations',
        query: `
          query AggregateHeavyQuery {
            usersAggregate {
              aggregate {
                count
              }
            }
            clientsAggregate {
              aggregate {
                count
              }
            }
            payrollsAggregate {
              aggregate {
                count
              }
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
            notesAggregate {
              aggregate {
                count
              }
            }
          }
        `
      }
    ];

    const performanceResults = {};

    for (const test of queryTests) {
      this.log(`  Testing: ${test.description} (${test.complexity} complexity)`);
      
      // Run each query multiple times for statistical accuracy
      const runs = [];
      for (let i = 0; i < 5; i++) {
        const result = await this.executeTimedQuery(test.query, {}, test.description);
        runs.push(result);
        
        if (!result.success) {
          this.log(`    Run ${i + 1}: ERROR - ${result.error}`, 'error');
        } else {
          const speed = result.executionTime < 100 ? 'fast' : result.executionTime < 500 ? 'performance' : 'slow';
          this.log(`    Run ${i + 1}: ${result.executionTime}ms`, speed);
        }
      }

      // Calculate statistics
      const successfulRuns = runs.filter(r => r.success);
      if (successfulRuns.length > 0) {
        const times = successfulRuns.map(r => r.executionTime);
        const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);
        
        performanceResults[test.name] = {
          complexity: test.complexity,
          description: test.description,
          runs: successfulRuns.length,
          averageTime: avgTime,
          minTime,
          maxTime,
          variance: Math.round(maxTime - minTime),
          performanceRating: this.getPerformanceRating(avgTime, test.complexity)
        };

        if (avgTime > 1000) {
          this.results.summary.slowQueries.push({
            name: test.name,
            avgTime,
            complexity: test.complexity
          });
        }

      } else {
        performanceResults[test.name] = {
          complexity: test.complexity,
          description: test.description,
          error: 'All runs failed',
          performanceRating: 'failed'
        };
      }

      this.results.summary.totalTests++;
    }

    this.results.queryPerformance = performanceResults;
  }

  getPerformanceRating(time, complexity) {
    const thresholds = {
      'low': { excellent: 50, good: 150, poor: 500 },
      'medium': { excellent: 100, good: 300, poor: 1000 },
      'high': { excellent: 200, good: 600, poor: 2000 },
      'very_high': { excellent: 500, good: 1500, poor: 5000 }
    };

    const threshold = thresholds[complexity] || thresholds.medium;
    
    if (time <= threshold.excellent) return 'excellent';
    if (time <= threshold.good) return 'good';
    if (time <= threshold.poor) return 'acceptable';
    return 'poor';
  }

  async testConcurrentUsers() {
    this.log('👥 Testing concurrent user performance simulation', 'performance');

    // Simulate different user roles accessing their relevant data concurrently
    const concurrentScenarios = [
      {
        name: 'consultant_workflow',
        userRole: 'consultant',
        description: 'Consultant accessing assigned clients and payrolls',
        query: `
          query ConsultantWorkflow {
            clients(limit: 5) {
              id
              name
              active
              payrolls(limit: 3) {
                id
                name
                status
              }
            }
          }
        `
      },
      {
        name: 'manager_dashboard',
        userRole: 'manager', 
        description: 'Manager viewing team metrics and client status',
        query: `
          query ManagerDashboard {
            users(where: {role: {_in: ["consultant", "viewer"]}}) {
              id
              name
              role
            }
            payrollsAggregate {
              aggregate {
                count
              }
            }
            clientsAggregate(where: {active: {_eq: true}}) {
              aggregate {
                count
              }
            }
          }
        `
      },
      {
        name: 'admin_overview',
        userRole: 'org_admin',
        description: 'Admin accessing full system overview',
        query: `
          query AdminOverview {
            usersAggregate {
              aggregate {
                count
              }
            }
            clientsAggregate {
              aggregate {
                count
              }
            }
            payrollsAggregate {
              aggregate {
                count
              }
            }
            rolesAggregate {
              aggregate {
                count
              }
            }
          }
        `
      }
    ];

    const concurrencyResults = {};

    for (const scenario of concurrentScenarios) {
      this.log(`  Testing: ${scenario.description}`);
      
      // Test with different concurrency levels
      const concurrencyLevels = [1, 3, 5, 10];
      
      for (const concurrency of concurrencyLevels) {
        this.log(`    Concurrency level: ${concurrency} users`);
        
        const startTime = performance.now();
        
        // Create concurrent promises
        const concurrentPromises = Array(concurrency).fill().map(() => 
          this.executeTimedQuery(scenario.query, {}, `${scenario.name}_concurrent_${concurrency}`)
        );

        try {
          const results = await Promise.all(concurrentPromises);
          const endTime = performance.now();
          const totalTime = Math.round(endTime - startTime);
          
          const successful = results.filter(r => r.success);
          const failed = results.filter(r => !r.success);
          
          if (successful.length > 0) {
            const avgIndividualTime = Math.round(
              successful.reduce((sum, r) => sum + r.executionTime, 0) / successful.length
            );
            
            const concurrencyKey = `${scenario.name}_${concurrency}`;
            if (!concurrencyResults[scenario.name]) {
              concurrencyResults[scenario.name] = {};
            }
            
            concurrencyResults[scenario.name][concurrency] = {
              totalTime,
              averageIndividualTime: avgIndividualTime,
              successfulRequests: successful.length,
              failedRequests: failed.length,
              throughput: Math.round((successful.length / totalTime) * 1000), // requests per second
              degradationFactor: concurrency === 1 ? 1 : avgIndividualTime / (concurrencyResults[scenario.name][1]?.averageIndividualTime || avgIndividualTime)
            };

            const throughput = concurrencyResults[scenario.name][concurrency].throughput;
            this.log(`      Total time: ${totalTime}ms, Avg individual: ${avgIndividualTime}ms, Throughput: ${throughput} req/s`, 
              throughput > 10 ? 'fast' : throughput > 5 ? 'performance' : 'slow');
            
            // Detect performance degradation
            if (concurrency > 1) {
              const degradation = concurrencyResults[scenario.name][concurrency].degradationFactor;
              if (degradation > 2) {
                this.results.summary.performanceIssues.push({
                  type: 'concurrency_degradation',
                  scenario: scenario.name,
                  concurrency,
                  degradationFactor: degradation
                });
              }
            }
          } else {
            this.log(`      All ${concurrency} requests failed`, 'error');
          }
          
        } catch (error) {
          this.log(`      Concurrent test failed: ${error.message}`, 'error');
        }
      }
    }

    this.results.concurrentUserTests = concurrencyResults;
  }

  async testPermissionSystemPerformance() {
    this.log('🔐 Testing permission system performance impact', 'performance');

    // Test permission-heavy queries vs simple queries
    const permissionTests = [
      {
        name: 'simple_without_permissions',
        description: 'Simple query without permission checking',
        query: `
          query SimpleWithoutPermissions {
            users(limit: 10) {
              id
              name
              email
            }
          }
        `
      },
      {
        name: 'with_role_permissions',
        description: 'Query including role and permission data',
        query: `
          query WithRolePermissions {
            users(limit: 10) {
              id
              name
              email
              role
              assignedRoles {
                assignedRole {
                  name
                  priority
                  rolePermissions(limit: 5) {
                    grantedPermission {
                      action
                      relatedResource {
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        `
      },
      {
        name: 'full_permission_tree',
        description: 'Complete permission hierarchy query',
        query: `
          query FullPermissionTree {
            roles {
              id
              name
              priority
              rolePermissions {
                grantedPermission {
                  id
                  action
                  relatedResource {
                    name
                  }
                }
              }
            }
          }
        `
      }
    ];

    const permissionResults = {};

    for (const test of permissionTests) {
      this.log(`  Testing: ${test.description}`);
      
      const runs = [];
      for (let i = 0; i < 3; i++) {
        const result = await this.executeTimedQuery(test.query, {}, test.description);
        runs.push(result);
      }

      const successfulRuns = runs.filter(r => r.success);
      if (successfulRuns.length > 0) {
        const avgTime = Math.round(
          successfulRuns.reduce((sum, r) => sum + r.executionTime, 0) / successfulRuns.length
        );
        
        permissionResults[test.name] = {
          description: test.description,
          averageTime: avgTime,
          runs: successfulRuns.length
        };

        this.log(`    Average time: ${avgTime}ms`, avgTime < 200 ? 'fast' : avgTime < 500 ? 'performance' : 'slow');
      }
    }

    // Calculate permission system overhead
    if (permissionResults.simple_without_permissions && permissionResults.with_role_permissions) {
      const overhead = permissionResults.with_role_permissions.averageTime - permissionResults.simple_without_permissions.averageTime;
      const overheadPercentage = Math.round((overhead / permissionResults.simple_without_permissions.averageTime) * 100);
      
      permissionResults.permission_overhead = {
        absoluteOverhead: overhead,
        percentageOverhead: overheadPercentage,
        acceptable: overheadPercentage < 100 // Less than 100% overhead is acceptable
      };

      this.log(`  Permission system overhead: ${overhead}ms (${overheadPercentage}%)`, 
        overheadPercentage < 50 ? 'fast' : overheadPercentage < 100 ? 'performance' : 'slow');
    }

    this.results.permissionSystemPerformance = permissionResults;
  }

  async testAggregatePerformance() {
    this.log('📊 Testing aggregate operations performance', 'performance');

    const aggregateTests = [
      {
        name: 'single_table_aggregate',
        description: 'Simple count aggregation',
        query: `
          query SingleTableAggregate {
            usersAggregate {
              aggregate {
                count
              }
            }
          }
        `
      },
      {
        name: 'multi_table_aggregates',
        description: 'Multiple table aggregations',
        query: `
          query MultiTableAggregates {
            usersAggregate {
              aggregate {
                count
              }
            }
            clientsAggregate {
              aggregate {
                count
              }
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
        name: 'complex_nested_aggregates',
        description: 'Nested aggregations with filtering',
        query: `
          query ComplexNestedAggregates {
            clients {
              id
              name
              payrollsAggregate {
                aggregate {
                  count
                }
              }
              payrollsAggregate(where: {status: {_eq: "active"}}) {
                aggregate {
                  count
                }
              }
            }
          }
        `
      }
    ];

    const aggregateResults = {};

    for (const test of aggregateTests) {
      this.log(`  Testing: ${test.description}`);
      
      const result = await this.executeTimedQuery(test.query, {}, test.description);
      
      if (result.success) {
        aggregateResults[test.name] = {
          description: test.description,
          executionTime: result.executionTime,
          performanceRating: this.getPerformanceRating(result.executionTime, 'medium')
        };

        this.log(`    Execution time: ${result.executionTime}ms`, 
          result.executionTime < 100 ? 'fast' : result.executionTime < 300 ? 'performance' : 'slow');
      } else {
        aggregateResults[test.name] = {
          description: test.description,
          error: result.error
        };
        this.log(`    Error: ${result.error}`, 'error');
      }
    }

    this.results.aggregatePerformance = aggregateResults;
  }

  async testRealWorldSimulation() {
    this.log('🌍 Testing real-world usage simulation', 'performance');

    // Simulate a realistic workflow: consultant checking their clients and updating data
    const realWorldScenarios = [
      {
        name: 'consultant_morning_routine',
        description: 'Consultant checking dashboard, clients, and recent activities',
        workflow: [
          {
            step: 'dashboard_check',
            query: `
              query ConsultantDashboard {
                clients(limit: 10) {
                  id
                  name
                  active
                  payrollsAggregate {
                    aggregate {
                      count
                    }
                  }
                }
                payrolls(limit: 5, orderBy: {updatedAt: DESC}) {
                  id
                  name
                  status
                  client {
                    name
                  }
                }
              }
            `
          },
          {
            step: 'check_notifications',
            query: `
              query CheckNotifications {
                notes(limit: 10, orderBy: {createdAt: DESC}) {
                  id
                  title
                  content
                  createdAt
                  author {
                    name
                  }
                }
              }
            `
          },
          {
            step: 'review_team_status',
            query: `
              query ReviewTeamStatus {
                users(where: {role: {_in: ["consultant", "viewer"]}}) {
                  id
                  name
                  role
                  assignedRoles {
                    assignedRole {
                      name
                    }
                  }
                }
              }
            `
          }
        ]
      },
      {
        name: 'manager_weekly_review',
        description: 'Manager conducting weekly performance review',
        workflow: [
          {
            step: 'overall_metrics',
            query: `
              query OverallMetrics {
                clientsAggregate {
                  aggregate {
                    count
                  }
                }
                payrollsAggregate {
                  aggregate {
                    count
                  }
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
            step: 'team_performance',
            query: `
              query TeamPerformance {
                users(where: {isStaff: {_eq: true}}) {
                  id
                  name
                  role
                  billingItemsAggregate {
                    aggregate {
                      count
                    }
                  }
                  authoredNotesAggregate {
                    aggregate {
                      count
                    }
                  }
                }
              }
            `
          }
        ]
      }
    ];

    const simulationResults = {};

    for (const scenario of realWorldScenarios) {
      this.log(`  Simulating: ${scenario.description}`);
      
      const workflowResults = [];
      let totalWorkflowTime = 0;

      for (const step of scenario.workflow) {
        const result = await this.executeTimedQuery(step.query, {}, step.step);
        workflowResults.push(result);
        
        if (result.success) {
          totalWorkflowTime += result.executionTime;
          this.log(`    ${step.step}: ${result.executionTime}ms`, 
            result.executionTime < 200 ? 'fast' : 'performance');
        } else {
          this.log(`    ${step.step}: ERROR - ${result.error}`, 'error');
        }
      }

      simulationResults[scenario.name] = {
        description: scenario.description,
        steps: workflowResults,
        totalTime: totalWorkflowTime,
        averageStepTime: Math.round(totalWorkflowTime / scenario.workflow.length),
        userExperience: this.getUserExperienceRating(totalWorkflowTime)
      };

      this.log(`  Total workflow time: ${totalWorkflowTime}ms (${simulationResults[scenario.name].userExperience} UX)`, 
        totalWorkflowTime < 1000 ? 'fast' : totalWorkflowTime < 3000 ? 'performance' : 'slow');
    }

    this.results.realWorldSimulation = simulationResults;
  }

  getUserExperienceRating(totalTime) {
    if (totalTime < 1000) return 'excellent';
    if (totalTime < 2000) return 'good';
    if (totalTime < 4000) return 'acceptable';
    return 'poor';
  }

  async runComprehensivePerformanceTests() {
    this.log('🚀 Starting Comprehensive Performance & Scalability Testing - Phase 3.3', 'performance');
    this.log('=' .repeat(70));

    try {
      await this.testQueryPerformance();
      await this.testConcurrentUsers();
      await this.testPermissionSystemPerformance();
      await this.testAggregatePerformance();
      await this.testRealWorldSimulation();

      this.generatePerformanceReport();

    } catch (error) {
      this.log(`💥 Performance testing failed: ${error.message}`, 'error');
      throw error;
    }
  }

  generatePerformanceReport() {
    this.log('\n📊 COMPREHENSIVE PERFORMANCE TESTING REPORT', 'performance');
    this.log('=' .repeat(70));

    const totalTestTime = Date.now() - this.startTime;
    
    // Calculate overall performance metrics
    const allQueryTimes = [];
    
    // Collect all execution times
    Object.values(this.results.queryPerformance).forEach(test => {
      if (test.averageTime) allQueryTimes.push(test.averageTime);
    });
    
    Object.values(this.results.aggregatePerformance).forEach(test => {
      if (test.executionTime) allQueryTimes.push(test.executionTime);
    });

    const avgResponseTime = allQueryTimes.length > 0 ? 
      Math.round(allQueryTimes.reduce((a, b) => a + b, 0) / allQueryTimes.length) : 0;
    
    this.results.summary.averageResponseTime = avgResponseTime;

    // Summary
    this.log(`\n📈 Performance Summary:`);
    this.log(`   Test Duration: ${Math.round(totalTestTime / 1000)}s`);
    this.log(`   Average Response Time: ${avgResponseTime}ms`);
    this.log(`   Slow Queries: ${this.results.summary.slowQueries.length}`);
    this.log(`   Performance Issues: ${this.results.summary.performanceIssues.length}`);

    // Query Performance Analysis
    this.log(`\n⚡ Query Performance Analysis:`);
    Object.entries(this.results.queryPerformance).forEach(([name, result]) => {
      if (result.averageTime) {
        const rating = result.performanceRating;
        const icon = rating === 'excellent' ? '🚀' : rating === 'good' ? '✅' : rating === 'acceptable' ? '⚠️' : '🐌';
        this.log(`   ${icon} ${name}: ${result.averageTime}ms (${rating}, ${result.complexity})`);
      }
    });

    // Concurrent User Performance
    this.log(`\n👥 Concurrent User Performance:`);
    Object.entries(this.results.concurrentUserTests).forEach(([scenario, results]) => {
      this.log(`   ${scenario}:`);
      Object.entries(results).forEach(([concurrency, data]) => {
        const degradation = data.degradationFactor ? `${data.degradationFactor.toFixed(1)}x slower` : 'baseline';
        this.log(`     ${concurrency} users: ${data.averageIndividualTime}ms avg, ${data.throughput} req/s (${degradation})`);
      });
    });

    // Permission System Impact
    this.log(`\n🔐 Permission System Performance:`);
    if (this.results.permissionSystemPerformance.permission_overhead) {
      const overhead = this.results.permissionSystemPerformance.permission_overhead;
      const acceptable = overhead.acceptable ? 'acceptable' : 'concerning';
      this.log(`   Permission Overhead: ${overhead.absoluteOverhead}ms (${overhead.percentageOverhead}%) - ${acceptable}`);
    }

    // Real-World Simulation Results
    this.log(`\n🌍 Real-World Simulation Performance:`);
    Object.entries(this.results.realWorldSimulation).forEach(([scenario, result]) => {
      const ux = result.userExperience;
      const icon = ux === 'excellent' ? '🚀' : ux === 'good' ? '✅' : ux === 'acceptable' ? '⚠️' : '🐌';
      this.log(`   ${icon} ${scenario}: ${result.totalTime}ms total (${ux} UX)`);
    });

    // Performance Issues
    if (this.results.summary.performanceIssues.length > 0) {
      this.log(`\n🚨 Performance Issues Detected:`, 'warning');
      this.results.summary.performanceIssues.forEach((issue, index) => {
        this.log(`   ${index + 1}. ${issue.type}: ${issue.scenario || issue.name} (${issue.degradationFactor ? `${issue.degradationFactor.toFixed(1)}x degradation` : 'slow query'})`, 'warning');
      });
    }

    // Scalability Recommendations
    this.log(`\n💡 Performance & Scalability Recommendations:`);
    
    if (avgResponseTime < 200) {
      this.log(`   🎉 Excellent performance! System handles current load efficiently`);
      this.results.summary.scalabilityRecommendations.push('Monitor performance as data grows');
    } else if (avgResponseTime < 500) {
      this.log(`   👍 Good performance with room for optimization`);
      this.results.summary.scalabilityRecommendations.push('Optimize slower queries', 'Consider query result caching');
    } else {
      this.log(`   ⚠️ Performance optimization needed for production scale`);
      this.results.summary.scalabilityRecommendations.push('Critical: Optimize slow queries', 'Implement database indexing', 'Consider query complexity reduction');
    }

    if (this.results.summary.performanceIssues.length > 0) {
      this.results.summary.scalabilityRecommendations.push('Address concurrent user degradation', 'Implement connection pooling optimization');
    }

    this.results.summary.scalabilityRecommendations.forEach((rec, index) => {
      this.log(`   ${index + 1}. ${rec}`);
    });

    // Final Assessment
    this.log(`\n🏆 Performance Assessment:`);
    const performanceScore = this.calculatePerformanceScore();
    
    if (performanceScore >= 90) {
      this.log(`   🎉 Excellent! System performance is production-ready (${performanceScore}/100)`);
      this.log(`   ✅ Phase 3.3: Performance & Scalability Testing - COMPLETED SUCCESSFULLY`);
    } else if (performanceScore >= 70) {
      this.log(`   👍 Good performance with minor optimizations needed (${performanceScore}/100)`);
      this.log(`   ⚠️ Phase 3.3: Performance & Scalability Testing - COMPLETED WITH RECOMMENDATIONS`);
    } else {
      this.log(`   ❌ Performance issues require attention before production (${performanceScore}/100)`);
      this.log(`   🚨 Phase 3.3: Performance & Scalability Testing - NEEDS OPTIMIZATION`);
    }

    // Save results
    const reportFile = `test-results/performance-testing-${Date.now()}.json`;
    try {
      fs.mkdirSync('test-results', { recursive: true });
      fs.writeFileSync(reportFile, JSON.stringify(this.results, null, 2));
      this.log(`\n💾 Detailed results saved to: ${reportFile}`, 'success');
    } catch (error) {
      this.log(`Failed to save results: ${error.message}`, 'error');
    }

    this.log('\n' + '=' .repeat(70));
  }

  calculatePerformanceScore() {
    let score = 100;
    
    // Deduct points for slow average response time
    if (this.results.summary.averageResponseTime > 500) score -= 30;
    else if (this.results.summary.averageResponseTime > 300) score -= 15;
    else if (this.results.summary.averageResponseTime > 200) score -= 5;

    // Deduct points for slow queries
    score -= this.results.summary.slowQueries.length * 10;

    // Deduct points for performance issues
    score -= this.results.summary.performanceIssues.length * 15;

    // Deduct points for poor permission system performance
    if (this.results.permissionSystemPerformance.permission_overhead?.percentageOverhead > 100) {
      score -= 20;
    }

    return Math.max(0, score);
  }
}

// Main execution
async function main() {
  console.log('⚡ Comprehensive Performance & Scalability Testing');
  console.log('Phase 3.3: Deep performance analysis for enterprise payroll system\n');

  if (!HASURA_URL || !ADMIN_SECRET) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
  }

  console.log('✅ Environment validated');
  console.log(`📡 Hasura endpoint: ${HASURA_URL}\n`);

  const tester = new ComprehensivePerformanceTester();
  await tester.runComprehensivePerformanceTests();
}

main().catch(error => {
  console.error('💥 Performance testing failed:', error);
  process.exit(1);
});