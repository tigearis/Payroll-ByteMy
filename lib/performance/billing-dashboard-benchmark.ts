// lib/performance/billing-dashboard-benchmark.ts
import React from "react";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

// ====================================================================
// BILLING DASHBOARD PERFORMANCE BENCHMARKING
// Measures the 80-90% performance improvement from mega-query optimization
// ====================================================================

export interface BenchmarkResult {
  operation: string;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  dataSize?: number;
  error?: string;
  metadata?: Record<string, any>;
}

export interface BenchmarkSummary {
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  averageDuration: number;
  medianDuration: number;
  minDuration: number;
  maxDuration: number;
  p95Duration: number;
  totalDataSize: number;
  operationBreakdown: Record<
    string,
    {
      count: number;
      averageDuration: number;
      successRate: number;
    }
  >;
}

/**
 * Performance benchmarking system for billing dashboard optimization
 * Tracks query performance to validate the 80-90% improvement claims
 */
class BillingDashboardBenchmark {
  private results: BenchmarkResult[] = [];
  private readonly maxResults = 1000; // Keep last 1000 results
  private benchmarkStartTime = Date.now();

  /**
   * Start timing an operation
   */
  startOperation(operation: string): {
    operationId: string;
    startTime: number;
  } {
    const operationId = `${operation}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = performance.now();

    logger.debug("Billing dashboard operation started", {
      namespace: "billing_dashboard_benchmark",
      operation: "start_timing",
      classification: DataClassification.INTERNAL,
      metadata: {
        operation,
        operationId,
        timestamp: new Date().toISOString(),
      },
    });

    return { operationId, startTime };
  }

  /**
   * End timing an operation and record results
   */
  endOperation(
    operationId: string,
    startTime: number,
    operation: string,
    options: {
      success?: boolean;
      dataSize?: number;
      error?: string;
      metadata?: Record<string, any>;
    } = {}
  ): BenchmarkResult {
    const endTime = performance.now();
    const duration = endTime - startTime;
    const { success = true, dataSize, error, metadata = {} } = options;

    const result: BenchmarkResult = {
      operation,
      startTime,
      endTime,
      duration,
      success,
      ...(dataSize !== undefined && { dataSize }),
      ...(error && { error }),
      metadata: {
        operationId,
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    };

    // Store result with size limit
    this.results.push(result);
    if (this.results.length > this.maxResults) {
      this.results.shift();
    }

    // Log performance result
    logger.info("Billing dashboard operation completed", {
      namespace: "billing_dashboard_benchmark",
      operation: "operation_completed",
      classification: DataClassification.INTERNAL,
      metadata: {
        operation,
        operationId,
        durationMs: Math.round(duration),
        success,
        ...(dataSize !== undefined && { dataSize }),
        ...(error && { error }),
        timestamp: new Date().toISOString(),
      },
    });

    return result;
  }

  /**
   * Measure a function execution time
   */
  async measureAsync<T>(
    operation: string,
    fn: () => Promise<T>,
    options: {
      metadata?: Record<string, any>;
      getDataSize?: (result: T) => number;
    } = {}
  ): Promise<{ result: T; benchmark: BenchmarkResult }> {
    const { operationId, startTime } = this.startOperation(operation);

    try {
      const result = await fn();
      const dataSize = options.getDataSize
        ? options.getDataSize(result)
        : undefined;

      const benchmark = this.endOperation(operationId, startTime, operation, {
        success: true,
        dataSize: dataSize as number | undefined,
        metadata: (options.metadata || {}) as Record<string, any>,
      });

      return { result, benchmark };
    } catch (error) {
      const benchmark = this.endOperation(operationId, startTime, operation, {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: (options.metadata || {}) as Record<string, any>,
      });

      throw error;
    }
  }

  /**
   * Measure synchronous function execution
   */
  measureSync<T>(
    operation: string,
    fn: () => T,
    options: {
      metadata?: Record<string, any>;
      getDataSize?: (result: T) => number;
    } = {}
  ): { result: T; benchmark: BenchmarkResult } {
    const { operationId, startTime } = this.startOperation(operation);

    try {
      const result = fn();
      const dataSize = options.getDataSize
        ? options.getDataSize(result)
        : undefined;

      const benchmark = this.endOperation(operationId, startTime, operation, {
        success: true,
        dataSize: dataSize as number | undefined,
        metadata: (options.metadata || {}) as Record<string, any>,
      });

      return { result, benchmark };
    } catch (error) {
      const benchmark = this.endOperation(operationId, startTime, operation, {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: (options.metadata || {}) as Record<string, any>,
      });

      throw error;
    }
  }

  /**
   * Get comprehensive benchmark summary
   */
  getSummary(timeframeMinutes?: number): BenchmarkSummary {
    let relevantResults = this.results;

    // Filter by timeframe if specified
    if (timeframeMinutes) {
      const cutoffTime = Date.now() - timeframeMinutes * 60 * 1000;
      relevantResults = this.results.filter(
        result =>
          new Date(result.metadata?.timestamp || 0).getTime() > cutoffTime
      );
    }

    if (relevantResults.length === 0) {
      return {
        totalOperations: 0,
        successfulOperations: 0,
        failedOperations: 0,
        averageDuration: 0,
        medianDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        p95Duration: 0,
        totalDataSize: 0,
        operationBreakdown: {},
      };
    }

    const successfulResults = relevantResults.filter(r => r.success);
    const durations = successfulResults
      .map(r => r.duration)
      .sort((a, b) => a - b);

    // Calculate percentiles
    const p95Index = Math.ceil(durations.length * 0.95) - 1;
    const medianIndex = Math.floor(durations.length / 2);

    // Operation breakdown
    const operationBreakdown: Record<
      string,
      { count: number; averageDuration: number; successRate: number }
    > = {};

    for (const result of relevantResults) {
      if (!operationBreakdown[result.operation]) {
        operationBreakdown[result.operation] = {
          count: 0,
          averageDuration: 0,
          successRate: 0,
        };
      }
      operationBreakdown[result.operation].count++;
    }

    // Calculate averages and success rates
    for (const [operation, breakdown] of Object.entries(operationBreakdown)) {
      const operationResults = relevantResults.filter(
        r => r.operation === operation
      );
      const successfulOperationResults = operationResults.filter(
        r => r.success
      );

      breakdown.averageDuration =
        successfulOperationResults.length > 0
          ? successfulOperationResults.reduce((sum, r) => sum + r.duration, 0) /
            successfulOperationResults.length
          : 0;
      breakdown.successRate =
        operationResults.length > 0
          ? (successfulOperationResults.length / operationResults.length) * 100
          : 0;
    }

    return {
      totalOperations: relevantResults.length,
      successfulOperations: successfulResults.length,
      failedOperations: relevantResults.length - successfulResults.length,
      averageDuration:
        durations.length > 0
          ? durations.reduce((sum, d) => sum + d, 0) / durations.length
          : 0,
      medianDuration: durations.length > 0 ? durations[medianIndex] : 0,
      minDuration: durations.length > 0 ? Math.min(...durations) : 0,
      maxDuration: durations.length > 0 ? Math.max(...durations) : 0,
      p95Duration:
        durations.length > 0
          ? durations[p95Index] || durations[durations.length - 1]
          : 0,
      totalDataSize: relevantResults.reduce(
        (sum, r) => sum + (r.dataSize || 0),
        0
      ),
      operationBreakdown,
    };
  }

  /**
   * Get performance comparison between old and new dashboard approaches
   */
  getPerformanceComparison(): {
    optimizedQueries: BenchmarkSummary;
    legacyMegaQuery?: BenchmarkSummary | undefined;
    improvementPercentage: number;
    recommendation: string;
  } {
    const optimizedResults = this.results.filter(
      r =>
        r.operation.includes("optimized") ||
        r.operation.includes("dashboard_summary") ||
        r.operation.includes("billing_items") ||
        r.operation.includes("billing_stats")
    );

    const legacyResults = this.results.filter(
      r =>
        r.operation.includes("legacy") ||
        r.operation.includes("mega_query") ||
        r.operation.includes("complete_dashboard")
    );

    const optimizedSummary: BenchmarkSummary =
      this.calculateSummaryForResults(optimizedResults);
    const legacySummary =
      legacyResults.length > 0
        ? this.calculateSummaryForResults(legacyResults)
        : undefined;

    let improvementPercentage = 0;
    let recommendation = "Continue monitoring performance metrics";

    if (legacySummary && legacySummary.averageDuration > 0) {
      improvementPercentage =
        ((legacySummary.averageDuration - optimizedSummary.averageDuration) /
          legacySummary.averageDuration) *
        100;

      if (improvementPercentage >= 80) {
        recommendation =
          "🎉 Excellent! Achieved target 80-90% performance improvement";
      } else if (improvementPercentage >= 60) {
        recommendation =
          "✅ Good improvement achieved, monitor for further optimizations";
      } else if (improvementPercentage >= 30) {
        recommendation =
          "⚠️ Moderate improvement, investigate additional optimizations";
      } else {
        recommendation =
          "🔴 Performance improvement below expectations, review implementation";
      }
    }

    logger.info("Billing dashboard performance comparison", {
      namespace: "billing_dashboard_benchmark",
      operation: "performance_comparison",
      classification: DataClassification.INTERNAL,
      metadata: {
        optimizedAverageDuration: Math.round(optimizedSummary.averageDuration),
        legacyAverageDuration: legacySummary
          ? Math.round(legacySummary.averageDuration)
          : null,
        improvementPercentage: Math.round(improvementPercentage * 100) / 100,
        recommendation,
        timestamp: new Date().toISOString(),
      },
    });

    return {
      optimizedQueries: optimizedSummary,
      legacyMegaQuery: legacySummary,
      improvementPercentage,
      recommendation,
    };
  }

  /**
   * Log comprehensive performance report
   */
  logPerformanceReport(timeframeMinutes = 60): void {
    const summary = this.getSummary(timeframeMinutes);
    const comparison = this.getPerformanceComparison();

    logger.info("Billing dashboard performance report", {
      namespace: "billing_dashboard_benchmark",
      operation: "performance_report",
      classification: DataClassification.INTERNAL,
      metadata: {
        timeframeMinutes,
        summary: {
          totalOperations: summary.totalOperations,
          averageDuration: Math.round(summary.averageDuration),
          medianDuration: Math.round(summary.medianDuration),
          p95Duration: Math.round(summary.p95Duration),
          successRate:
            summary.totalOperations > 0
              ? Math.round(
                  (summary.successfulOperations / summary.totalOperations) * 100
                )
              : 0,
        },
        comparison: {
          improvementPercentage:
            Math.round(comparison.improvementPercentage * 100) / 100,
          recommendation: comparison.recommendation,
        },
        operationBreakdown: Object.fromEntries(
          Object.entries(summary.operationBreakdown).map(([op, data]) => [
            op,
            {
              count: data.count,
              avgDuration: Math.round(data.averageDuration),
              successRate: Math.round(data.successRate),
            },
          ])
        ),
        benchmarkUptime: Math.round(
          (Date.now() - this.benchmarkStartTime) / 60000
        ),
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Clear benchmark history
   */
  clear(): void {
    const previousCount = this.results.length;
    this.results = [];
    this.benchmarkStartTime = Date.now();

    logger.info("Billing dashboard benchmark history cleared", {
      namespace: "billing_dashboard_benchmark",
      operation: "clear_history",
      classification: DataClassification.INTERNAL,
      metadata: {
        clearedResults: previousCount,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Calculate summary for specific results array
   */
  private calculateSummaryForResults(
    results: BenchmarkResult[]
  ): BenchmarkSummary {
    if (results.length === 0) {
      return {
        totalOperations: 0,
        successfulOperations: 0,
        failedOperations: 0,
        averageDuration: 0,
        medianDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        p95Duration: 0,
        totalDataSize: 0,
        operationBreakdown: {},
      };
    }

    const successfulResults = results.filter(r => r.success);
    const durations = successfulResults
      .map(r => r.duration)
      .sort((a, b) => a - b);

    const p95Index = Math.ceil(durations.length * 0.95) - 1;
    const medianIndex = Math.floor(durations.length / 2);

    return {
      totalOperations: results.length,
      successfulOperations: successfulResults.length,
      failedOperations: results.length - successfulResults.length,
      averageDuration:
        durations.length > 0
          ? durations.reduce((sum, d) => sum + d, 0) / durations.length
          : 0,
      medianDuration: durations.length > 0 ? durations[medianIndex] : 0,
      minDuration: durations.length > 0 ? Math.min(...durations) : 0,
      maxDuration: durations.length > 0 ? Math.max(...durations) : 0,
      p95Duration:
        durations.length > 0
          ? durations[p95Index] || durations[durations.length - 1]
          : 0,
      totalDataSize: results.reduce((sum, r) => sum + (r.dataSize || 0), 0),
      operationBreakdown: {},
    };
  }
}

// Singleton instance for application-wide use
export const billingDashboardBenchmark = new BillingDashboardBenchmark();

/**
 * React hook for measuring component render performance
 */
export const useBillingDashboardBenchmark = () => {
  const [isTracking, setIsTracking] = React.useState(false);
  const [currentOperation, setCurrentOperation] = React.useState<string | null>(
    null
  );
  const [operationData, setOperationData] = React.useState<{
    operationId: string;
    startTime: number;
  } | null>(null);

  const startTracking = React.useCallback((operation: string) => {
    const data = billingDashboardBenchmark.startOperation(operation);
    setOperationData(data);
    setCurrentOperation(operation);
    setIsTracking(true);
    return data;
  }, []);

  const endTracking = React.useCallback(
    (
      options: {
        success?: boolean;
        dataSize?: number;
        error?: string;
        metadata?: Record<string, any>;
      } = {}
    ) => {
      if (operationData && currentOperation) {
        const result = billingDashboardBenchmark.endOperation(
          operationData.operationId,
          operationData.startTime,
          currentOperation,
          options
        );

        setIsTracking(false);
        setCurrentOperation(null);
        setOperationData(null);

        return result;
      }
      return null;
    },
    [operationData, currentOperation]
  );

  const measureAsync = React.useCallback(
    async <T>(
      operation: string,
      fn: () => Promise<T>,
      options: {
        metadata?: Record<string, any>;
        getDataSize?: (result: T) => number;
      } = {}
    ) => {
      return billingDashboardBenchmark.measureAsync(operation, fn, options);
    },
    []
  );

  return {
    isTracking,
    currentOperation,
    startTracking,
    endTracking,
    measureAsync,
    getSummary: () => billingDashboardBenchmark.getSummary(),
    getComparison: () => billingDashboardBenchmark.getPerformanceComparison(),
    logReport: (timeframeMinutes?: number) =>
      billingDashboardBenchmark.logPerformanceReport(timeframeMinutes),
  };
};

// Performance monitoring middleware for React components
export function withBillingDashboardBenchmark<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  operation: string
) {
  const BenchmarkedComponent: React.FC<P> = (props: P) => {
    const renderStartTime = React.useRef<number>(0);
    const [hasLoaded, setHasLoaded] = React.useState(false);

    React.useLayoutEffect(() => {
      renderStartTime.current = performance.now();
    }, []);

    React.useEffect(() => {
      if (!hasLoaded) {
        const renderDuration = performance.now() - renderStartTime.current;
        billingDashboardBenchmark.endOperation(
          `${operation}_${Date.now()}`,
          renderStartTime.current,
          operation,
          {
            success: true,
            metadata: {
              renderDuration: Math.round(renderDuration),
              componentType: "react_component",
            },
          }
        );
        setHasLoaded(true);
      }
    }, [hasLoaded]);

    return React.createElement(WrappedComponent, { ...(props as any) });
  };

  BenchmarkedComponent.displayName = `withBenchmark(${WrappedComponent.displayName || WrappedComponent.name})`;
  return BenchmarkedComponent;
}

// Auto-report performance every 15 minutes
setInterval(
  () => {
    billingDashboardBenchmark.logPerformanceReport(15);
  },
  15 * 60 * 1000
);
