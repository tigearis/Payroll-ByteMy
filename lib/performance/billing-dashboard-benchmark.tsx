// lib/performance/billing-dashboard-benchmark.tsx
import React from "react";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

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

class BillingDashboardBenchmark {
  private results: BenchmarkResult[] = [];
  private readonly maxResults = 1000;
  private benchmarkStartTime = Date.now();

  startOperation(operation: string): {
    operationId: string;
    startTime: number;
  } {
    const operationId = `${operation}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime =
      typeof performance !== "undefined" && performance.now
        ? performance.now()
        : Date.now();
    logger.debug("Billing dashboard operation started", {
      namespace: "billing_dashboard_benchmark",
      operation: "start_timing",
      classification: DataClassification.INTERNAL,
      metadata: { operation, operationId, timestamp: new Date().toISOString() },
    });
    return { operationId, startTime };
  }

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
    const endTime =
      typeof performance !== "undefined" && performance.now
        ? performance.now()
        : Date.now();
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

    this.results.push(result);
    if (this.results.length > this.maxResults) this.results.shift();

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
        dataSize,
        metadata: options.metadata,
      });
      return { result, benchmark };
    } catch (error) {
      this.endOperation(operationId, startTime, operation, {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: options.metadata,
      });
      throw error;
    }
  }

  measureSync<T>(
    operation: string,
    fn: () => T,
    options: {
      metadata?: Record<string, any>;
      getDataSize?: (result: T) => number;
    } = {}
  ): { result: T; benchmark: BenchmarkResult } {
    const { operationId, startTime } = this.startOperation(operation);
    const result = fn();
    const dataSize = options.getDataSize
      ? options.getDataSize(result)
      : undefined;
    const benchmark = this.endOperation(operationId, startTime, operation, {
      success: true,
      dataSize,
      metadata: options.metadata,
    });
    return { result, benchmark };
  }

  getSummary(timeframeMinutes?: number): BenchmarkSummary {
    let relevantResults = this.results;
    if (timeframeMinutes) {
      const cutoffTime = Date.now() - timeframeMinutes * 60 * 1000;
      relevantResults = this.results.filter(
        r => new Date(r.metadata?.timestamp || 0).getTime() > cutoffTime
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
    const p95Index = Math.ceil(durations.length * 0.95) - 1;
    const medianIndex = Math.floor(durations.length / 2);
    const operationBreakdown: Record<
      string,
      { count: number; averageDuration: number; successRate: number }
    > = {};
    for (const result of relevantResults) {
      if (!operationBreakdown[result.operation])
        operationBreakdown[result.operation] = {
          count: 0,
          averageDuration: 0,
          successRate: 0,
        };
      operationBreakdown[result.operation].count++;
    }
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
          ? durations.reduce((s, d) => s + d, 0) / durations.length
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

  getPerformanceComparison() {
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
      this.getSummaryFrom(optimizedResults);
    const legacySummary: BenchmarkSummary | undefined =
      legacyResults.length > 0 ? this.getSummaryFrom(legacyResults) : undefined;
    let improvementPercentage = 0;
    let recommendation = "Continue monitoring performance metrics";
    if (legacySummary && legacySummary.averageDuration > 0) {
      improvementPercentage =
        ((legacySummary.averageDuration - optimizedSummary.averageDuration) /
          legacySummary.averageDuration) *
        100;
      if (improvementPercentage >= 80)
        recommendation =
          "🎉 Excellent! Achieved target 80-90% performance improvement";
      else if (improvementPercentage >= 60)
        recommendation =
          "✅ Good improvement achieved, monitor for further optimizations";
      else if (improvementPercentage >= 30)
        recommendation =
          "⚠️ Moderate improvement, investigate additional optimizations";
      else
        recommendation =
          "🔴 Performance improvement below expectations, review implementation";
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

  private getSummaryFrom(results: BenchmarkResult[]): BenchmarkSummary {
    return this.getSummaryForResults(results);
  }

  private getSummaryForResults(results: BenchmarkResult[]): BenchmarkSummary {
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
          ? durations.reduce((s, d) => s + d, 0) / durations.length
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

export const billingDashboardBenchmark = new BillingDashboardBenchmark();

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
    async <T,>(
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

export function withBillingDashboardBenchmark<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  operation: string
) {
  const BenchmarkedComponent: React.FC<P> = (props: P) => {
    const renderStartTime = React.useRef<number>(0);
    const [hasLoaded, setHasLoaded] = React.useState(false);
    React.useLayoutEffect(() => {
      renderStartTime.current =
        typeof performance !== "undefined" && performance.now
          ? performance.now()
          : Date.now();
    }, []);
    React.useEffect(() => {
      if (!hasLoaded) {
        const now =
          typeof performance !== "undefined" && performance.now
            ? performance.now()
            : Date.now();
        const renderDuration = now - renderStartTime.current;
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
    return <WrappedComponent {...props} />;
  };
  BenchmarkedComponent.displayName = `withBenchmark(${(WrappedComponent as any).displayName || WrappedComponent.name})`;
  return BenchmarkedComponent;
}

setInterval(
  () => {
    billingDashboardBenchmark.logPerformanceReport(15);
  },
  15 * 60 * 1000
);
