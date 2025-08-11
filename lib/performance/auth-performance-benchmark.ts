// lib/performance/auth-performance-benchmark.ts
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";
import { getHierarchicalPermissionsFromDatabase as getPermissionsOriginal } from "@/lib/permissions/hierarchical-permissions";
import { getHierarchicalPermissionsFromDatabase as getPermissionsOptimized } from "@/lib/permissions/hierarchical-permissions-optimized";
import { PermissionCacheMonitor } from "@/lib/permissions/permission-cache";

interface PerformanceBenchmarkResult {
  testName: string;
  originalTimeMs: number;
  optimizedTimeMs: number;
  improvementPercent: number;
  cacheHitRate: number;
  testCases: number;
}

/**
 * Authentication Performance Benchmark Suite
 * 
 * Measures the performance improvement from implementing permission caching
 * vs the original database-heavy approach
 */
export class AuthPerformanceBenchmark {
  private testUserId: string;
  
  constructor(testUserId: string = "test-user-benchmark") {
    this.testUserId = testUserId;
  }

  /**
   * Run comprehensive performance benchmark
   */
  async runBenchmark(): Promise<PerformanceBenchmarkResult[]> {
    logger.info('Starting authentication performance benchmark', {
      namespace: 'auth_performance',
      operation: 'start_benchmark',
      classification: DataClassification.INTERNAL,
      metadata: {
        testUserId: this.testUserId,
        timestamp: new Date().toISOString()
      }
    });

    const results: PerformanceBenchmarkResult[] = [];
    
    // Test 1: Single permission lookup
    results.push(await this.benchmarkSingleLookup());
    
    // Test 2: Repeated lookups (simulates real API usage)
    results.push(await this.benchmarkRepeatedLookups());
    
    // Test 3: Cold start vs warm cache
    results.push(await this.benchmarkCacheWarming());
    
    // Test 4: Concurrent requests simulation
    results.push(await this.benchmarkConcurrentRequests());

    // Generate summary report
    this.generateBenchmarkReport(results);
    
    return results;
  }

  /**
   * Benchmark single permission lookup
   */
  private async benchmarkSingleLookup(): Promise<PerformanceBenchmarkResult> {
    logger.info('Running single lookup benchmark', {
      namespace: 'auth_performance',
      operation: 'single_lookup_test',
      classification: DataClassification.INTERNAL,
      metadata: {
        timestamp: new Date().toISOString()
      }
    });

    // Original system timing
    const originalStart = Date.now();
    try {
      await getPermissionsOriginal(this.testUserId);
    } catch (error) {
      // Expected to fail - we're measuring timing, not success
    }
    const originalTime = Date.now() - originalStart;

    // Optimized system timing
    const optimizedStart = Date.now();
    try {
      await getPermissionsOptimized(this.testUserId);
    } catch (error) {
      // Expected to fail - we're measuring timing, not success  
    }
    const optimizedTime = Date.now() - optimizedStart;

    const improvement = ((originalTime - optimizedTime) / originalTime) * 100;
    const metrics = PermissionCacheMonitor.getPerformanceMetrics();

    return {
      testName: "Single Permission Lookup",
      originalTimeMs: originalTime,
      optimizedTimeMs: optimizedTime,
      improvementPercent: Math.round(improvement * 100) / 100,
      cacheHitRate: metrics.hitRate,
      testCases: 1
    };
  }

  /**
   * Benchmark repeated lookups (simulates real API usage pattern)
   */
  private async benchmarkRepeatedLookups(): Promise<PerformanceBenchmarkResult> {
    const testCount = 50;
    
    logger.info('Running repeated lookups benchmark', {
      namespace: 'auth_performance',
      operation: 'repeated_lookups_test',
      classification: DataClassification.INTERNAL,
      metadata: {
        testCount,
        timestamp: new Date().toISOString()
      }
    });

    // Original system - multiple lookups
    const originalStart = Date.now();
    for (let i = 0; i < testCount; i++) {
      try {
        await getPermissionsOriginal(this.testUserId);
      } catch (error) {
        // Expected to fail - we're measuring timing
      }
    }
    const originalTotalTime = Date.now() - originalStart;

    // Optimized system - multiple lookups (should benefit from caching)
    const optimizedStart = Date.now();
    for (let i = 0; i < testCount; i++) {
      try {
        await getPermissionsOptimized(this.testUserId);
      } catch (error) {
        // Expected to fail - we're measuring timing
      }
    }
    const optimizedTotalTime = Date.now() - optimizedStart;

    const improvement = ((originalTotalTime - optimizedTotalTime) / originalTotalTime) * 100;
    const metrics = PermissionCacheMonitor.getPerformanceMetrics();

    return {
      testName: "Repeated Lookups (50x)",
      originalTimeMs: originalTotalTime,
      optimizedTimeMs: optimizedTotalTime,
      improvementPercent: Math.round(improvement * 100) / 100,
      cacheHitRate: metrics.hitRate,
      testCases: testCount
    };
  }

  /**
   * Benchmark cache warming effects
   */
  private async benchmarkCacheWarming(): Promise<PerformanceBenchmarkResult> {
    logger.info('Running cache warming benchmark', {
      namespace: 'auth_performance',
      operation: 'cache_warming_test',
      classification: DataClassification.INTERNAL,
      metadata: {
        timestamp: new Date().toISOString()
      }
    });

    // Measure cold start (first call)
    const coldStart = Date.now();
    try {
      await getPermissionsOptimized(this.testUserId + "-cold");
    } catch (error) {
      // Expected to fail
    }
    const coldTime = Date.now() - coldStart;

    // Measure warm cache (second call to same user)
    const warmStart = Date.now();
    try {
      await getPermissionsOptimized(this.testUserId + "-cold");
    } catch (error) {
      // Expected to fail
    }
    const warmTime = Date.now() - warmStart;

    const improvement = ((coldTime - warmTime) / coldTime) * 100;
    const metrics = PermissionCacheMonitor.getPerformanceMetrics();

    return {
      testName: "Cache Warming (Cold vs Warm)",
      originalTimeMs: coldTime,
      optimizedTimeMs: warmTime,
      improvementPercent: Math.round(improvement * 100) / 100,
      cacheHitRate: metrics.hitRate,
      testCases: 2
    };
  }

  /**
   * Benchmark concurrent requests (simulates load)
   */
  private async benchmarkConcurrentRequests(): Promise<PerformanceBenchmarkResult> {
    const concurrentCount = 20;
    
    logger.info('Running concurrent requests benchmark', {
      namespace: 'auth_performance',
      operation: 'concurrent_test',
      classification: DataClassification.INTERNAL,
      metadata: {
        concurrentCount,
        timestamp: new Date().toISOString()
      }
    });

    // Original system - concurrent requests
    const originalStart = Date.now();
    const originalPromises = Array.from({ length: concurrentCount }, (_, i) => 
      getPermissionsOriginal(this.testUserId + "-concurrent-" + i).catch(() => {})
    );
    await Promise.all(originalPromises);
    const originalTotalTime = Date.now() - originalStart;

    // Optimized system - concurrent requests
    const optimizedStart = Date.now();
    const optimizedPromises = Array.from({ length: concurrentCount }, (_, i) => 
      getPermissionsOptimized(this.testUserId + "-concurrent-" + i).catch(() => {})
    );
    await Promise.all(optimizedPromises);
    const optimizedTotalTime = Date.now() - optimizedStart;

    const improvement = ((originalTotalTime - optimizedTotalTime) / originalTotalTime) * 100;
    const metrics = PermissionCacheMonitor.getPerformanceMetrics();

    return {
      testName: "Concurrent Requests (20 parallel)",
      originalTimeMs: originalTotalTime,
      optimizedTimeMs: optimizedTotalTime,
      improvementPercent: Math.round(improvement * 100) / 100,
      cacheHitRate: metrics.hitRate,
      testCases: concurrentCount
    };
  }

  /**
   * Generate comprehensive benchmark report
   */
  private generateBenchmarkReport(results: PerformanceBenchmarkResult[]): void {
    const totalImprovement = results.reduce((sum, result) => sum + result.improvementPercent, 0) / results.length;
    const totalTimeOriginal = results.reduce((sum, result) => sum + result.originalTimeMs, 0);
    const totalTimeOptimized = results.reduce((sum, result) => sum + result.optimizedTimeMs, 0);
    const overallImprovement = ((totalTimeOriginal - totalTimeOptimized) / totalTimeOriginal) * 100;

    logger.info('Authentication performance benchmark completed', {
      namespace: 'auth_performance',
      operation: 'benchmark_report',
      classification: DataClassification.INTERNAL,
      metadata: {
        testResults: results,
        overallImprovementPercent: Math.round(overallImprovement * 100) / 100,
        averageImprovementPercent: Math.round(totalImprovement * 100) / 100,
        totalOriginalTimeMs: totalTimeOriginal,
        totalOptimizedTimeMs: totalTimeOptimized,
        timeSavingsMs: totalTimeOriginal - totalTimeOptimized,
        cacheMetrics: PermissionCacheMonitor.getPerformanceMetrics(),
        timestamp: new Date().toISOString()
      }
    });

    // Console summary for immediate visibility
    console.log("\n🚀 AUTHENTICATION PERFORMANCE BENCHMARK RESULTS");
    console.log("================================================");
    
    results.forEach(result => {
      console.log(`\n📊 ${result.testName}:`);
      console.log(`   Original: ${result.originalTimeMs}ms`);
      console.log(`   Optimized: ${result.optimizedTimeMs}ms`);
      console.log(`   Improvement: ${result.improvementPercent}% faster`);
      console.log(`   Cache Hit Rate: ${result.cacheHitRate}%`);
    });

    console.log(`\n🎯 OVERALL PERFORMANCE IMPROVEMENT: ${Math.round(overallImprovement)}%`);
    console.log(`⚡ Time Savings: ${totalTimeOriginal - totalTimeOptimized}ms total`);
    console.log(`📈 Cache Effectiveness: ${PermissionCacheMonitor.getPerformanceMetrics().hitRate}% hit rate\n`);
  }

  /**
   * Quick benchmark for API endpoint testing
   */
  static async quickBenchmark(userId: string): Promise<number> {
    const start = Date.now();
    try {
      await getPermissionsOptimized(userId);
    } catch (error) {
      // Timing test - errors expected
    }
    const responseTime = Date.now() - start;
    
    logger.debug('Quick auth benchmark completed', {
      namespace: 'auth_performance',
      operation: 'quick_benchmark',
      classification: DataClassification.INTERNAL,
      metadata: {
        userId,
        responseTimeMs: responseTime,
        timestamp: new Date().toISOString()
      }
    });

    return responseTime;
  }
}

/**
 * Performance monitoring middleware for API endpoints
 */
export function createAuthPerformanceMiddleware() {
  return {
    beforeAuth: async (userId: string) => {
      const startTime = Date.now();
      
      logger.debug('Authentication performance monitoring started', {
        namespace: 'auth_performance',
        operation: 'middleware_start',
        classification: DataClassification.INTERNAL,
        metadata: {
          userId,
          timestamp: new Date().toISOString()
        }
      });

      return { startTime };
    },
    
    afterAuth: (context: { startTime: number }, userId: string) => {
      const responseTime = Date.now() - context.startTime;
      const metrics = PermissionCacheMonitor.getPerformanceMetrics();
      
      logger.info('Authentication performance monitoring completed', {
        namespace: 'auth_performance', 
        operation: 'middleware_complete',
        classification: DataClassification.INTERNAL,
        metadata: {
          userId,
          authResponseTimeMs: responseTime,
          cacheHitRate: metrics.hitRate,
          isCached: responseTime < 50, // Assume cached if very fast
          timestamp: new Date().toISOString()
        }
      });

      return responseTime;
    }
  };
}

export default AuthPerformanceBenchmark;