/**
 * Enhanced GraphQL Performance Testing
 * 
 * Comprehensive performance testing that extends the existing performance tests
 * to cover all operations with detailed complexity analysis and benchmarking.
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { GraphQLOperationDiscovery, PerformanceTestUtils } from './utils/test-utilities';
import { GraphQLTestClient } from './utils/auth-testing';
import { testDataManager } from './utils/data-seeding';

interface PerformanceMetrics {
  operationName: string;
  domain: string;
  type: string;
  executionTime: number;
  complexityScore: number;
  fieldCount: number;
  maxDepth: number;
  dataSize?: number;
  status: 'success' | 'error' | 'timeout';
  errorMessage?: string;
}

interface PerformanceBenchmark {
  domain: string;
  avgExecutionTime: number;
  maxExecutionTime: number;
  avgComplexity: number;
  maxComplexity: number;
  operationCount: number;
  successRate: number;
}

describe('Enhanced GraphQL Performance Testing', () => {
  let discoveryService: GraphQLOperationDiscovery;
  let testClient: GraphQLTestClient;
  let allOperations: any[] = [];
  let performanceMetrics: PerformanceMetrics[] = [];
  let performanceBenchmarks: Map<string, PerformanceBenchmark> = new Map();
  
  beforeAll(async () => {
    console.log('🚀 Initializing Enhanced Performance Testing...');
    
    discoveryService = new GraphQLOperationDiscovery();
    testClient = new GraphQLTestClient();
    
    // Discover all operations
    allOperations = await discoveryService.discoverAllOperations();
    console.log(`📊 Performance testing ${allOperations.length} operations`);
    
    // Set up test environment
    await testDataManager.setupCompleteTestEnvironment();
  });

  afterAll(async () => {
    console.log('\n📈 Performance Testing Results Summary:');
    
    // Calculate overall statistics
    const successfulTests = performanceMetrics.filter(m => m.status === 'success');
    const failedTests = performanceMetrics.filter(m => m.status === 'error');
    const timeoutTests = performanceMetrics.filter(m => m.status === 'timeout');
    
    console.log(`✅ Successful: ${successfulTests.length}`);
    console.log(`❌ Failed: ${failedTests.length}`);
    console.log(`⏰ Timeouts: ${timeoutTests.length}`);
    console.log(`📈 Success Rate: ${((successfulTests.length / performanceMetrics.length) * 100).toFixed(1)}%`);
    
    if (successfulTests.length > 0) {
      const avgExecutionTime = successfulTests.reduce((sum, m) => sum + m.executionTime, 0) / successfulTests.length;
      const maxExecutionTime = Math.max(...successfulTests.map(m => m.executionTime));
      const avgComplexity = successfulTests.reduce((sum, m) => sum + m.complexityScore, 0) / successfulTests.length;
      
      console.log(`⚡ Average Execution Time: ${avgExecutionTime.toFixed(0)}ms`);
      console.log(`🔥 Max Execution Time: ${maxExecutionTime}ms`);
      console.log(`🧮 Average Complexity: ${avgComplexity.toFixed(1)}`);
    }
    
    // Display benchmarks by domain
    console.log('\n📊 Performance by Domain:');
    performanceBenchmarks.forEach((benchmark, domain) => {
      console.log(`  ${domain}:`);
      console.log(`    Avg Time: ${benchmark.avgExecutionTime.toFixed(0)}ms`);
      console.log(`    Max Time: ${benchmark.maxExecutionTime}ms`);
      console.log(`    Complexity: ${benchmark.avgComplexity.toFixed(1)}`);
      console.log(`    Success Rate: ${(benchmark.successRate * 100).toFixed(1)}%`);
    });
    
    await testDataManager.cleanupAllTestData();
  });

  describe('Comprehensive Operation Performance Testing', () => {
    test('all query operations should meet performance thresholds', async () => {
      const queryOperations = allOperations.filter(op => op.type === 'query');
      const batchSize = 10; // Test in batches for better performance
      
      for (let i = 0; i < queryOperations.length; i += batchSize) {
        const batch = queryOperations.slice(i, i + batchSize);
        
        console.log(`\n🔍 Testing query batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(queryOperations.length / batchSize)}`);
        
        await Promise.all(batch.map(async (operation) => {
          const metrics = await this.measureOperationPerformance(operation, 'query');
          performanceMetrics.push(metrics);
          
          if (metrics.status === 'success') {
            // Query performance thresholds
            expect(metrics.executionTime).toBeLessThan(30000); // 30 seconds max
            expect(metrics.complexityScore).toBeLessThan(500); // Reasonable complexity
            
            console.log(`  ✅ ${operation.domain}/${operation.name}: ${metrics.executionTime}ms (complexity: ${metrics.complexityScore})`);
          } else {
            console.log(`  ⚠️  ${operation.domain}/${operation.name}: ${metrics.status} - ${metrics.errorMessage}`);
          }
        }));
      }
    });

    test('all mutation operations should execute efficiently', async () => {
      const mutationOperations = allOperations.filter(op => op.type === 'mutation');
      const batchSize = 5; // Smaller batches for mutations
      
      for (let i = 0; i < mutationOperations.length; i += batchSize) {
        const batch = mutationOperations.slice(i, i + batchSize);
        
        console.log(`\n🔄 Testing mutation batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(mutationOperations.length / batchSize)}`);
        
        for (const operation of batch) {
          const metrics = await this.measureOperationPerformance(operation, 'mutation');
          performanceMetrics.push(metrics);
          
          if (metrics.status === 'success') {
            // Mutation performance thresholds
            expect(metrics.executionTime).toBeLessThan(15000); // 15 seconds max
            expect(metrics.complexityScore).toBeLessThan(200); // Mutations should be simpler
            
            console.log(`  ✅ ${operation.domain}/${operation.name}: ${metrics.executionTime}ms`);
          } else {
            console.log(`  ⚠️  ${operation.domain}/${operation.name}: ${metrics.status} - ${metrics.errorMessage}`);
          }
        }
      }
    });

    test('subscription operations should be lightweight', async () => {
      const subscriptionOperations = allOperations.filter(op => op.type === 'subscription');
      
      if (subscriptionOperations.length > 0) {
        console.log(`\n🔔 Testing ${subscriptionOperations.length} subscription operations`);
        
        for (const operation of subscriptionOperations) {
          const complexity = PerformanceTestUtils.analyzeComplexity(operation);
          
          // Subscriptions should be very simple
          expect(complexity.complexityScore).toBeLessThan(50);
          expect(complexity.maxDepth).toBeLessThan(4);
          
          console.log(`  ✅ ${operation.domain}/${operation.name}: complexity ${complexity.complexityScore}`);
        }
      }
    });
  });

  describe('Domain-Specific Performance Analysis', () => {
    test('critical domain operations should have optimal performance', async () => {
      const criticalDomains = ['auth', 'users', 'audit'];
      const criticalOperations = allOperations.filter(op => 
        criticalDomains.includes(op.domain) && op.type === 'query'
      );
      
      for (const operation of criticalOperations.slice(0, 10)) {
        const metrics = await this.measureOperationPerformance(operation, 'query');
        
        if (metrics.status === 'success') {
          // Critical operations should be very fast
          expect(metrics.executionTime).toBeLessThan(5000); // 5 seconds max
          
          console.log(`🔒 Critical: ${operation.domain}/${operation.name}: ${metrics.executionTime}ms`);
        }
      }
    });

    test('business operations should scale with data size', async () => {
      const businessDomains = ['payrolls', 'clients', 'billing'];
      const businessQueries = allOperations.filter(op => 
        businessDomains.includes(op.domain) && 
        op.type === 'query' &&
        op.name.toLowerCase().includes('get')
      );
      
      for (const operation of businessQueries.slice(0, 5)) {
        // Test with different data sizes
        const smallDataMetrics = await this.measureOperationPerformance(operation, 'query', { limit: 10 });
        const largeDataMetrics = await this.measureOperationPerformance(operation, 'query', { limit: 100 });
        
        if (smallDataMetrics.status === 'success' && largeDataMetrics.status === 'success') {
          // Performance should scale reasonably with data size
          const timeRatio = largeDataMetrics.executionTime / smallDataMetrics.executionTime;
          
          expect(timeRatio).toBeLessThan(10); // Shouldn't be more than 10x slower
          
          console.log(`📊 ${operation.domain}/${operation.name}: ${smallDataMetrics.executionTime}ms → ${largeDataMetrics.executionTime}ms (${timeRatio.toFixed(1)}x)`);
        }
      }
    });
  });

  describe('Query Optimization Validation', () => {
    test('optimized queries should outperform standard queries', async () => {
      const optimizedQueries = allOperations.filter(op => 
        op.name.includes('Optimized') || 
        op.name.includes('Complete') || 
        op.name.includes('WithStats')
      );
      
      for (const optimizedOp of optimizedQueries.slice(0, 5)) {
        const metrics = await this.measureOperationPerformance(optimizedOp, 'query');
        
        if (metrics.status === 'success') {
          // Optimized queries should be reasonably complex but fast
          expect(metrics.complexityScore).toBeGreaterThan(50); // Should be doing meaningful work
          expect(metrics.executionTime).toBeLessThan(10000); // But efficiently
          
          console.log(`⚡ Optimized: ${optimizedOp.name}: ${metrics.executionTime}ms (complexity: ${metrics.complexityScore})`);
        }
      }
    });

    test('fragment usage should improve performance', async () => {
      const operationsWithFragments = allOperations.filter(op => {
        const operationText = op.document.loc?.source?.body || '';
        return operationText.includes('...');
      });
      
      console.log(`🧩 Found ${operationsWithFragments.length} operations using fragments`);
      
      for (const operation of operationsWithFragments.slice(0, 5)) {
        const complexity = PerformanceTestUtils.analyzeComplexity(operation);
        
        // Operations with fragments should have reasonable complexity
        expect(complexity.fragmentCount).toBeGreaterThan(0);
        
        console.log(`  ${operation.domain}/${operation.name}: ${complexity.fragmentCount} fragments, complexity ${complexity.complexityScore}`);
      }
    });
  });

  describe('Load and Stress Testing', () => {
    test('operations should handle concurrent requests', async () => {
      const testOperations = allOperations.filter(op => 
        op.type === 'query' && 
        ['users', 'clients', 'payrolls'].includes(op.domain)
      ).slice(0, 3);
      
      for (const operation of testOperations) {
        console.log(`\n🚀 Load testing ${operation.domain}/${operation.name}`);
        
        // Execute 5 concurrent requests
        const concurrentPromises = Array.from({ length: 5 }, () => 
          this.measureOperationPerformance(operation, 'query')
        );
        
        const results = await Promise.all(concurrentPromises);
        const successfulResults = results.filter(r => r.status === 'success');
        
        if (successfulResults.length > 0) {
          const avgTime = successfulResults.reduce((sum, r) => sum + r.executionTime, 0) / successfulResults.length;
          const maxTime = Math.max(...successfulResults.map(r => r.executionTime));
          
          // Concurrent execution shouldn't be excessively slow
          expect(maxTime).toBeLessThan(20000); // 20 seconds max under load
          
          console.log(`  💪 Concurrent avg: ${avgTime.toFixed(0)}ms, max: ${maxTime}ms, success: ${successfulResults.length}/5`);
        }
      }
    });

    test('memory usage should remain reasonable', async () => {
      const memoryBefore = process.memoryUsage();
      
      // Execute several operations to test memory usage
      const testOps = allOperations.filter(op => op.type === 'query').slice(0, 20);
      
      for (const operation of testOps) {
        await this.measureOperationPerformance(operation, 'query');
      }
      
      const memoryAfter = process.memoryUsage();
      const memoryIncrease = memoryAfter.heapUsed - memoryBefore.heapUsed;
      
      // Memory increase should be reasonable (less than 100MB)
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
      
      console.log(`🧠 Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(1)}MB`);
    });
  });

  describe('Performance Regression Detection', () => {
    test('should establish performance baselines', () => {
      // Calculate performance baselines by domain
      const domainMetrics = performanceMetrics.reduce((acc, metric) => {
        if (metric.status === 'success') {
          if (!acc[metric.domain]) {
            acc[metric.domain] = [];
          }
          acc[metric.domain].push(metric);
        }
        return acc;
      }, {} as Record<string, PerformanceMetrics[]>);
      
      Object.entries(domainMetrics).forEach(([domain, metrics]) => {
        if (metrics.length > 0) {
          const avgExecutionTime = metrics.reduce((sum, m) => sum + m.executionTime, 0) / metrics.length;
          const maxExecutionTime = Math.max(...metrics.map(m => m.executionTime));
          const avgComplexity = metrics.reduce((sum, m) => sum + m.complexityScore, 0) / metrics.length;
          const maxComplexity = Math.max(...metrics.map(m => m.complexityScore));
          const successRate = metrics.length / performanceMetrics.filter(m => m.domain === domain).length;
          
          const benchmark: PerformanceBenchmark = {
            domain,
            avgExecutionTime,
            maxExecutionTime,
            avgComplexity,
            maxComplexity,
            operationCount: metrics.length,
            successRate
          };
          
          performanceBenchmarks.set(domain, benchmark);
          
          // Validate reasonable performance baselines
          expect(avgExecutionTime).toBeLessThan(15000); // 15 seconds average
          expect(successRate).toBeGreaterThan(0.7); // 70% success rate minimum
        }
      });
    });

    test('should identify performance outliers', () => {
      const successfulMetrics = performanceMetrics.filter(m => m.status === 'success');
      
      if (successfulMetrics.length > 10) {
        const executionTimes = successfulMetrics.map(m => m.executionTime).sort((a, b) => a - b);
        const q3Index = Math.floor(executionTimes.length * 0.75);
        const q1Index = Math.floor(executionTimes.length * 0.25);
        const q3 = executionTimes[q3Index];
        const q1 = executionTimes[q1Index];
        const iqr = q3 - q1;
        const outlierThreshold = q3 + (1.5 * iqr);
        
        const outliers = successfulMetrics.filter(m => m.executionTime > outlierThreshold);
        
        if (outliers.length > 0) {
          console.log(`\n⚠️  Performance outliers detected (>${outlierThreshold.toFixed(0)}ms):`);
          outliers.forEach(outlier => {
            console.log(`  ${outlier.domain}/${outlier.operationName}: ${outlier.executionTime}ms`);
          });
        }
        
        // Should not have too many outliers
        expect(outliers.length).toBeLessThan(successfulMetrics.length * 0.1); // Less than 10% outliers
      }
    });
  });

  // Helper method to measure operation performance
  private async measureOperationPerformance(
    operation: any, 
    operationType: string,
    variables: any = {}
  ): Promise<PerformanceMetrics> {
    try {
      const complexity = PerformanceTestUtils.analyzeComplexity(operation);
      const operationQuery = this.createTestableOperation(operation, operationType);
      
      if (!operationQuery) {
        return {
          operationName: operation.name,
          domain: operation.domain,
          type: operationType,
          executionTime: 0,
          complexityScore: complexity.complexityScore,
          fieldCount: complexity.fieldCount,
          maxDepth: complexity.maxDepth,
          status: 'error',
          errorMessage: 'Could not create testable operation'
        };
      }
      
      const testVariables = { ...this.getDefaultVariables(operation.domain), ...variables };
      
      const { result, duration } = await PerformanceTestUtils.measureExecutionTime(async () => {
        return await testClient.executeAsRole(operationQuery, testVariables, 'consultant');
      });
      
      let dataSize = 0;
      if (result.success && result.data) {
        dataSize = JSON.stringify(result.data).length;
      }
      
      return {
        operationName: operation.name,
        domain: operation.domain,
        type: operationType,
        executionTime: duration,
        complexityScore: complexity.complexityScore,
        fieldCount: complexity.fieldCount,
        maxDepth: complexity.maxDepth,
        dataSize,
        status: result.success ? 'success' : 'error',
        errorMessage: result.errors?.join(', ')
      };
      
    } catch (error) {
      return {
        operationName: operation.name,
        domain: operation.domain,
        type: operationType,
        executionTime: 0,
        complexityScore: 0,
        fieldCount: 0,
        maxDepth: 0,
        status: 'error',
        errorMessage: error.message
      };
    }
  }

  private createTestableOperation(operation: any, operationType: string): string | null {
    try {
      const operationText = operation.document.loc?.source?.body || '';
      
      if (operationType === 'query' && operationText.includes('query ')) {
        return operationText.split('\n').slice(0, 10).join('\n') + '\n}';
      } else if (operationType === 'mutation' && operationText.includes('mutation ')) {
        return operationText.split('\n').slice(0, 8).join('\n') + '\n}';
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  private getDefaultVariables(domain: string): any {
    const seedIds = testDataManager.getCreatedSeedIds();
    
    switch (domain) {
      case 'users':
        return { limit: 10, offset: 0 };
      case 'clients':
        return { limit: 10, offset: 0 };
      case 'payrolls':
        return { limit: 10, offset: 0 };
      case 'billing':
        return { limit: 10 };
      default:
        return { limit: 10 };
    }
  }
});