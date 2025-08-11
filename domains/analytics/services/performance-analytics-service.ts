// domains/analytics/services/performance-analytics-service.ts
import { logger, DataClassification } from '@/lib/logging/enterprise-logger';
import { advancedMonitoringSystem } from '@/lib/monitoring/advanced-monitoring-system';
import { testRunner } from '@/lib/testing/test-runner';

// ====================================================================
// ADVANCED PERFORMANCE ANALYTICS SERVICE
// Comprehensive performance analytics with trend analysis and predictions
// Business impact visualization and optimization recommendations
// ====================================================================

export interface PerformanceMetric {
  id: string;
  systemId: string;
  systemName: string;
  metricType: 'response_time' | 'throughput' | 'error_rate' | 'memory_usage' | 'cpu_usage' | 'cache_hit_rate';
  value: number;
  unit: string;
  timestamp: Date;
  threshold?: {
    warning: number;
    critical: number;
  };
  tags: Record<string, string>;
}

export interface PerformanceTrend {
  systemId: string;
  metricType: string;
  timeframe: '1h' | '24h' | '7d' | '30d';
  trend: 'improving' | 'stable' | 'degrading' | 'critical';
  changePercent: number;
  dataPoints: Array<{
    timestamp: Date;
    value: number;
    baseline?: number;
  }>;
  prediction?: {
    nextValue: number;
    confidence: number;
    timeframe: string;
  };
}

export interface BusinessImpactAnalysis {
  systemId: string;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  estimatedUserImpact: number; // percentage of users affected
  estimatedRevenueImpact: number; // dollars per day
  businessProcessesAffected: string[];
  mitigationStrategies: string[];
  urgencyScore: number; // 1-100
}

export interface PerformanceInsight {
  id: string;
  type: 'optimization_opportunity' | 'performance_regression' | 'capacity_warning' | 'business_impact';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  affectedSystems: string[];
  recommendations: string[];
  estimatedImpact: {
    performanceGain?: string;
    costSaving?: number;
    userExperienceImprovement?: string;
  };
  createdAt: Date;
  expiresAt?: Date;
}

export interface PerformanceAnalyticsConfig {
  metricRetentionDays: number;
  analysisIntervals: {
    realTime: number; // milliseconds
    trending: number; // minutes
    prediction: number; // hours
  };
  alertThresholds: {
    performanceRegression: number; // percentage change
    capacityWarning: number; // percentage utilization
    businessImpact: number; // dollar threshold
  };
  businessMetrics: {
    averageRevenuePerUser: number;
    userSessionValue: number;
    costPerSlowRequest: number;
  };
}

class PerformanceAnalyticsService {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private trends: Map<string, PerformanceTrend[]> = new Map();
  private insights: PerformanceInsight[] = [];
  private config: PerformanceAnalyticsConfig;

  constructor() {
    this.config = {
      metricRetentionDays: 90,
      analysisIntervals: {
        realTime: 5000, // 5 seconds
        trending: 15, // 15 minutes  
        prediction: 4 // 4 hours
      },
      alertThresholds: {
        performanceRegression: 20, // 20% degradation
        capacityWarning: 80, // 80% utilization
        businessImpact: 1000 // $1000/day impact
      },
      businessMetrics: {
        averageRevenuePerUser: 50, // $50/user/month
        userSessionValue: 2.50, // $2.50 per session
        costPerSlowRequest: 0.001 // $0.001 per slow request
      }
    };

    this.initializeAnalytics();
  }

  /**
   * Initialize analytics system and start monitoring
   */
  private initializeAnalytics(): void {
    logger.info('Initializing Advanced Performance Analytics Service', {
      namespace: 'performance_analytics',
      operation: 'initialization',
      classification: DataClassification.INTERNAL,
      metadata: {
        retentionDays: this.config.metricRetentionDays,
        analysisIntervals: this.config.analysisIntervals
      }
    });

    // Start real-time metric collection
    setInterval(() => {
      this.collectRealTimeMetrics();
    }, this.config.analysisIntervals.realTime);

    // Start trend analysis
    setInterval(() => {
      this.analyzeTrends();
    }, this.config.analysisIntervals.trending * 60 * 1000);

    // Start predictive analysis
    setInterval(() => {
      this.generatePredictiveInsights();
    }, this.config.analysisIntervals.prediction * 60 * 60 * 1000);
  }

  /**
   * Collect real-time performance metrics from all systems
   */
  private async collectRealTimeMetrics(): Promise<void> {
    try {
      // Get metrics from Advanced Monitoring System
      const monitoringMetrics = await advancedMonitoringSystem.getComprehensiveSystemHealth();
      
      // Get performance test results
      const testResults = await this.getLatestTestResults();
      
      // Transform and store metrics
      for (const systemHealth of monitoringMetrics) {
        const systemMetrics = this.transformSystemHealthToMetrics(systemHealth);
        this.storeMetrics(systemHealth.systemId, systemMetrics);
      }

      // Store test performance metrics
      if (testResults) {
        const testMetrics = this.transformTestResultsToMetrics(testResults);
        this.storeMetrics('integration_tests', testMetrics);
      }

      // Clean up old metrics
      this.cleanupOldMetrics();

    } catch (error) {
      logger.error('Failed to collect real-time metrics', {
        namespace: 'performance_analytics',
        operation: 'collect_metrics_error',
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Transform system health data to performance metrics
   */
  private transformSystemHealthToMetrics(systemHealth: any): PerformanceMetric[] {
    const metrics: PerformanceMetric[] = [];
    const timestamp = new Date();

    // Response time metric
    if (systemHealth.performance?.averageResponseTime) {
      metrics.push({
        id: `${systemHealth.systemId}_response_time_${timestamp.getTime()}`,
        systemId: systemHealth.systemId,
        systemName: systemHealth.systemName,
        metricType: 'response_time',
        value: systemHealth.performance.averageResponseTime,
        unit: 'ms',
        timestamp,
        threshold: {
          warning: 1000,
          critical: 3000
        },
        tags: {
          system: systemHealth.systemId,
          category: systemHealth.category
        }
      });
    }

    // Throughput metric
    if (systemHealth.performance?.throughput) {
      metrics.push({
        id: `${systemHealth.systemId}_throughput_${timestamp.getTime()}`,
        systemId: systemHealth.systemId,
        systemName: systemHealth.systemName,
        metricType: 'throughput',
        value: systemHealth.performance.throughput,
        unit: 'req/sec',
        timestamp,
        threshold: {
          warning: 10,
          critical: 5
        },
        tags: {
          system: systemHealth.systemId,
          category: systemHealth.category
        }
      });
    }

    // Error rate metric
    if (systemHealth.performance?.errorRate !== undefined) {
      metrics.push({
        id: `${systemHealth.systemId}_error_rate_${timestamp.getTime()}`,
        systemId: systemHealth.systemId,
        systemName: systemHealth.systemName,
        metricType: 'error_rate',
        value: systemHealth.performance.errorRate,
        unit: '%',
        timestamp,
        threshold: {
          warning: 1,
          critical: 5
        },
        tags: {
          system: systemHealth.systemId,
          category: systemHealth.category
        }
      });
    }

    // Cache hit rate for cache-enabled systems
    if (systemHealth.performance?.cacheHitRate !== undefined) {
      metrics.push({
        id: `${systemHealth.systemId}_cache_hit_rate_${timestamp.getTime()}`,
        systemId: systemHealth.systemId,
        systemName: systemHealth.systemName,
        metricType: 'cache_hit_rate',
        value: systemHealth.performance.cacheHitRate,
        unit: '%',
        timestamp,
        threshold: {
          warning: 70,
          critical: 50
        },
        tags: {
          system: systemHealth.systemId,
          category: systemHealth.category
        }
      });
    }

    return metrics;
  }

  /**
   * Transform test results to performance metrics
   */
  private transformTestResultsToMetrics(testResults: any): PerformanceMetric[] {
    const metrics: PerformanceMetric[] = [];
    const timestamp = new Date();

    // Overall test performance
    metrics.push({
      id: `integration_tests_response_time_${timestamp.getTime()}`,
      systemId: 'integration_tests',
      systemName: 'Integration Test Suite',
      metricType: 'response_time',
      value: testResults.performanceAnalysis?.apiPerformance?.averageResponseTime || 0,
      unit: 'ms',
      timestamp,
      threshold: {
        warning: 2000,
        critical: 5000
      },
      tags: {
        testType: 'integration',
        category: 'quality_assurance'
      }
    });

    // Test throughput
    metrics.push({
      id: `integration_tests_throughput_${timestamp.getTime()}`,
      systemId: 'integration_tests',
      systemName: 'Integration Test Suite',
      metricType: 'throughput',
      value: testResults.performanceAnalysis?.apiPerformance?.throughput || 0,
      unit: 'req/sec',
      timestamp,
      threshold: {
        warning: 5,
        critical: 2
      },
      tags: {
        testType: 'integration',
        category: 'quality_assurance'
      }
    });

    return metrics;
  }

  /**
   * Store metrics for a system
   */
  private storeMetrics(systemId: string, metrics: PerformanceMetric[]): void {
    if (!this.metrics.has(systemId)) {
      this.metrics.set(systemId, []);
    }

    const systemMetrics = this.metrics.get(systemId)!;
    systemMetrics.push(...metrics);

    // Keep only metrics within retention period
    const cutoffDate = new Date(Date.now() - (this.config.metricRetentionDays * 24 * 60 * 60 * 1000));
    const filteredMetrics = systemMetrics.filter(m => m.timestamp > cutoffDate);
    this.metrics.set(systemId, filteredMetrics);
  }

  /**
   * Analyze performance trends
   */
  private async analyzeTrends(): Promise<void> {
    try {
      logger.info('Analyzing performance trends', {
        namespace: 'performance_analytics',
        operation: 'analyze_trends',
        classification: DataClassification.INTERNAL
      });

      const systemIds = Array.from(this.metrics.keys());

      for (const systemId of systemIds) {
        const systemMetrics = this.metrics.get(systemId) || [];
        const trends = await this.calculateTrendsForSystem(systemId, systemMetrics);
        this.trends.set(systemId, trends);
      }

      // Generate insights based on trends
      await this.generateTrendBasedInsights();

    } catch (error) {
      logger.error('Failed to analyze performance trends', {
        namespace: 'performance_analytics',
        operation: 'analyze_trends_error',
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Calculate trends for a specific system
   */
  private async calculateTrendsForSystem(systemId: string, metrics: PerformanceMetric[]): Promise<PerformanceTrend[]> {
    const trends: PerformanceTrend[] = [];
    const metricTypes = [...new Set(metrics.map(m => m.metricType))];

    for (const metricType of metricTypes) {
      const typeMetrics = metrics.filter(m => m.metricType === metricType);
      
      if (typeMetrics.length < 10) continue; // Need sufficient data points

      // Calculate trends for different timeframes
      const timeframes: Array<{ key: '1h' | '24h' | '7d' | '30d', hours: number }> = [
        { key: '1h', hours: 1 },
        { key: '24h', hours: 24 },
        { key: '7d', hours: 168 },
        { key: '30d', hours: 720 }
      ];

      for (const timeframe of timeframes) {
        const cutoffTime = new Date(Date.now() - (timeframe.hours * 60 * 60 * 1000));
        const recentMetrics = typeMetrics.filter(m => m.timestamp > cutoffTime);

        if (recentMetrics.length < 5) continue;

        const trend = await this.calculateTrendAnalysis(systemId, metricType, timeframe.key, recentMetrics);
        trends.push(trend);
      }
    }

    return trends;
  }

  /**
   * Calculate trend analysis for specific metric type and timeframe
   */
  private async calculateTrendAnalysis(
    systemId: string, 
    metricType: string, 
    timeframe: '1h' | '24h' | '7d' | '30d', 
    metrics: PerformanceMetric[]
  ): Promise<PerformanceTrend> {
    // Sort metrics by timestamp
    const sortedMetrics = metrics.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // Calculate baseline (average of first 25% of data points)
    const baselineCount = Math.max(1, Math.floor(sortedMetrics.length * 0.25));
    const baselineMetrics = sortedMetrics.slice(0, baselineCount);
    const baseline = baselineMetrics.reduce((sum, m) => sum + m.value, 0) / baselineMetrics.length;

    // Calculate recent average (last 25% of data points)
    const recentCount = Math.max(1, Math.floor(sortedMetrics.length * 0.25));
    const recentMetrics = sortedMetrics.slice(-recentCount);
    const recent = recentMetrics.reduce((sum, m) => sum + m.value, 0) / recentMetrics.length;

    // Calculate change percentage
    const changePercent = baseline > 0 ? ((recent - baseline) / baseline) * 100 : 0;

    // Determine trend direction
    let trend: 'improving' | 'stable' | 'degrading' | 'critical';
    if (Math.abs(changePercent) <= 5) {
      trend = 'stable';
    } else if (metricType === 'error_rate' || metricType === 'response_time') {
      // For error rate and response time, lower is better
      if (changePercent < -10) trend = 'improving';
      else if (changePercent < 20) trend = 'degrading';
      else trend = 'critical';
    } else {
      // For throughput and cache hit rate, higher is better
      if (changePercent > 10) trend = 'improving';
      else if (changePercent > -20) trend = 'degrading';
      else trend = 'critical';
    }

    // Generate data points for visualization
    const dataPoints = sortedMetrics.map(m => ({
      timestamp: m.timestamp,
      value: m.value,
      baseline
    }));

    // Generate prediction (simple linear regression)
    const prediction = this.generateSimplePrediction(sortedMetrics, timeframe);

    return {
      systemId,
      metricType,
      timeframe,
      trend,
      changePercent: Math.round(changePercent * 100) / 100,
      dataPoints,
      prediction
    };
  }

  /**
   * Generate simple prediction using linear regression
   */
  private generateSimplePrediction(metrics: PerformanceMetric[], timeframe: string): {
    nextValue: number;
    confidence: number;
    timeframe: string;
  } {
    if (metrics.length < 5) {
      return {
        nextValue: metrics[metrics.length - 1]?.value || 0,
        confidence: 0.3,
        timeframe: 'insufficient_data'
      };
    }

    // Simple linear regression
    const n = metrics.length;
    const sumX = metrics.reduce((sum, _, i) => sum + i, 0);
    const sumY = metrics.reduce((sum, m) => sum + m.value, 0);
    const sumXY = metrics.reduce((sum, m, i) => sum + (i * m.value), 0);
    const sumXX = metrics.reduce((sum, _, i) => sum + (i * i), 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const nextValue = slope * n + intercept;
    
    // Calculate R-squared for confidence
    const meanY = sumY / n;
    const ssTotal = metrics.reduce((sum, m) => sum + Math.pow(m.value - meanY, 2), 0);
    const ssResidual = metrics.reduce((sum, m, i) => {
      const predicted = slope * i + intercept;
      return sum + Math.pow(m.value - predicted, 2);
    }, 0);
    
    const rSquared = 1 - (ssResidual / ssTotal);
    const confidence = Math.max(0, Math.min(1, rSquared));

    return {
      nextValue: Math.round(nextValue * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      timeframe: `next_${timeframe}`
    };
  }

  /**
   * Generate insights based on trend analysis
   */
  private async generateTrendBasedInsights(): Promise<void> {
    const insights: PerformanceInsight[] = [];

    // Analyze all system trends
    for (const [systemId, systemTrends] of this.trends) {
      // Look for critical trends
      const criticalTrends = systemTrends.filter(t => t.trend === 'critical');
      const degradingTrends = systemTrends.filter(t => t.trend === 'degrading');
      const improvingTrends = systemTrends.filter(t => t.trend === 'improving');

      // Generate critical performance regression insights
      for (const criticalTrend of criticalTrends) {
        insights.push({
          id: `${systemId}_${criticalTrend.metricType}_critical_${Date.now()}`,
          type: 'performance_regression',
          severity: 'critical',
          title: `Critical Performance Regression in ${systemId}`,
          description: `${criticalTrend.metricType} has degraded by ${Math.abs(criticalTrend.changePercent)}% over the last ${criticalTrend.timeframe}`,
          affectedSystems: [systemId],
          recommendations: this.generateRecommendations(systemId, criticalTrend),
          estimatedImpact: this.calculateBusinessImpact(systemId, criticalTrend),
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        });
      }

      // Generate optimization opportunity insights
      for (const improvingTrend of improvingTrends.slice(0, 3)) { // Top 3 improvements
        if (improvingTrend.changePercent > 15) { // Significant improvement
          insights.push({
            id: `${systemId}_${improvingTrend.metricType}_opportunity_${Date.now()}`,
            type: 'optimization_opportunity',
            severity: 'info',
            title: `Performance Optimization Success in ${systemId}`,
            description: `${improvingTrend.metricType} has improved by ${improvingTrend.changePercent}% over the last ${improvingTrend.timeframe}`,
            affectedSystems: [systemId],
            recommendations: [
              'Document this optimization pattern for replication in other systems',
              'Monitor continued improvement and establish new baseline',
              'Consider scaling this optimization approach'
            ],
            estimatedImpact: {
              performanceGain: `${improvingTrend.changePercent}% improvement`,
              userExperienceImprovement: 'Significant improvement in user experience'
            },
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          });
        }
      }
    }

    // Update insights collection
    this.insights = [...this.insights, ...insights];
    
    // Clean up expired insights
    this.insights = this.insights.filter(i => !i.expiresAt || i.expiresAt > new Date());

    logger.info('Generated trend-based insights', {
      namespace: 'performance_analytics',
      operation: 'generate_insights',
      classification: DataClassification.INTERNAL,
      metadata: {
        newInsights: insights.length,
        totalActiveInsights: this.insights.length
      }
    });
  }

  /**
   * Generate recommendations based on performance trend
   */
  private generateRecommendations(systemId: string, trend: PerformanceTrend): string[] {
    const recommendations: string[] = [];

    switch (trend.metricType) {
      case 'response_time':
        recommendations.push(
          'Review recent code changes for performance regressions',
          'Check database query performance and indexing',
          'Monitor memory usage and garbage collection',
          'Consider implementing caching for frequently accessed data'
        );
        break;

      case 'throughput':
        recommendations.push(
          'Investigate connection pool utilization',
          'Review concurrent request handling capacity',
          'Check for resource bottlenecks (CPU, memory, I/O)',
          'Consider horizontal scaling if demand has increased'
        );
        break;

      case 'error_rate':
        recommendations.push(
          'Review application logs for specific error patterns',
          'Check external service dependencies',
          'Verify input validation and error handling',
          'Monitor third-party service status'
        );
        break;

      case 'cache_hit_rate':
        recommendations.push(
          'Review cache eviction policies',
          'Check cache size limits and memory allocation',
          'Analyze cache key patterns for optimization',
          'Consider cache warming strategies'
        );
        break;

      default:
        recommendations.push(
          'Investigate recent system changes',
          'Review monitoring alerts and logs',
          'Check system resource utilization',
          'Consider performance profiling'
        );
    }

    return recommendations;
  }

  /**
   * Calculate business impact of performance trend
   */
  private calculateBusinessImpact(systemId: string, trend: PerformanceTrend): {
    performanceGain?: string;
    costSaving?: number;
    userExperienceImprovement?: string;
  } {
    const impact: any = {};

    if (trend.metricType === 'response_time') {
      const avgResponseIncrease = Math.abs(trend.changePercent);
      const estimatedUserImpact = Math.min(100, avgResponseIncrease * 2); // Rough estimate
      const dailyCostImpact = estimatedUserImpact * this.config.businessMetrics.costPerSlowRequest * 1000;

      impact.costSaving = Math.round(dailyCostImpact);
      impact.userExperienceImprovement = `${estimatedUserImpact}% of users experiencing slower response times`;
    }

    if (trend.metricType === 'error_rate') {
      const errorIncrease = Math.abs(trend.changePercent);
      const sessionImpact = errorIncrease * 0.1; // Rough conversion
      const revenueLoss = sessionImpact * this.config.businessMetrics.userSessionValue * 100;

      impact.costSaving = Math.round(revenueLoss);
      impact.userExperienceImprovement = `${errorIncrease}% increase in user-facing errors`;
    }

    return impact;
  }

  /**
   * Generate predictive insights using machine learning patterns
   */
  private async generatePredictiveInsights(): Promise<void> {
    try {
      logger.info('Generating predictive insights', {
        namespace: 'performance_analytics',
        operation: 'predictive_analysis',
        classification: DataClassification.INTERNAL
      });

      const insights: PerformanceInsight[] = [];

      // Analyze prediction patterns across all systems
      for (const [systemId, systemTrends] of this.trends) {
        for (const trend of systemTrends) {
          if (trend.prediction && trend.prediction.confidence > 0.7) {
            const predictedChange = ((trend.prediction.nextValue - trend.dataPoints[trend.dataPoints.length - 1]?.value || 0) / (trend.dataPoints[trend.dataPoints.length - 1]?.value || 1)) * 100;

            // Generate capacity warning if prediction shows significant degradation
            if (Math.abs(predictedChange) > this.config.alertThresholds.performanceRegression) {
              insights.push({
                id: `${systemId}_${trend.metricType}_capacity_warning_${Date.now()}`,
                type: 'capacity_warning',
                severity: predictedChange > 30 ? 'critical' : 'warning',
                title: `Predicted Performance Degradation in ${systemId}`,
                description: `Based on current trends, ${trend.metricType} is predicted to ${predictedChange > 0 ? 'increase' : 'decrease'} by ${Math.abs(predictedChange)}% in the ${trend.prediction.timeframe}`,
                affectedSystems: [systemId],
                recommendations: [
                  'Proactively investigate current performance patterns',
                  'Consider preventive scaling or optimization',
                  'Monitor leading indicators more closely',
                  'Prepare contingency plans for capacity expansion'
                ],
                estimatedImpact: {
                  performanceGain: `Prevent ${Math.abs(predictedChange)}% degradation`,
                  userExperienceImprovement: 'Maintain optimal user experience'
                },
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours
              });
            }
          }
        }
      }

      // Add new predictive insights
      this.insights = [...this.insights, ...insights];

      logger.info('Generated predictive insights', {
        namespace: 'performance_analytics',
        operation: 'predictive_analysis_complete',
        classification: DataClassification.INTERNAL,
        metadata: {
          newPredictiveInsights: insights.length,
          totalInsights: this.insights.length
        }
      });

    } catch (error) {
      logger.error('Failed to generate predictive insights', {
        namespace: 'performance_analytics',
        operation: 'predictive_analysis_error',
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Get latest test results from test runner
   */
  private async getLatestTestResults(): Promise<any> {
    try {
      // This would typically query a database or cache for latest test results
      // For now, return null to indicate no recent test results
      return null;
    } catch (error) {
      logger.error('Failed to get latest test results', {
        namespace: 'performance_analytics',
        operation: 'get_test_results_error',
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : String(error)
      });
      return null;
    }
  }

  /**
   * Clean up old metrics based on retention policy
   */
  private cleanupOldMetrics(): void {
    const cutoffDate = new Date(Date.now() - (this.config.metricRetentionDays * 24 * 60 * 60 * 1000));
    let totalCleaned = 0;

    for (const [systemId, metrics] of this.metrics) {
      const beforeCount = metrics.length;
      const filteredMetrics = metrics.filter(m => m.timestamp > cutoffDate);
      this.metrics.set(systemId, filteredMetrics);
      totalCleaned += beforeCount - filteredMetrics.length;
    }

    if (totalCleaned > 0) {
      logger.info('Cleaned up old performance metrics', {
        namespace: 'performance_analytics',
        operation: 'cleanup_metrics',
        classification: DataClassification.INTERNAL,
        metadata: {
          metricsRemoved: totalCleaned,
          retentionDays: this.config.metricRetentionDays
        }
      });
    }
  }

  // ==================== PUBLIC API METHODS ====================

  /**
   * Get performance metrics for a specific system and timeframe
   */
  public getPerformanceMetrics(systemId: string, timeframe: '1h' | '24h' | '7d' | '30d'): PerformanceMetric[] {
    const systemMetrics = this.metrics.get(systemId) || [];
    const hours = { '1h': 1, '24h': 24, '7d': 168, '30d': 720 }[timeframe];
    const cutoffTime = new Date(Date.now() - (hours * 60 * 60 * 1000));

    return systemMetrics.filter(m => m.timestamp > cutoffTime);
  }

  /**
   * Get performance trends for a specific system
   */
  public getPerformanceTrends(systemId: string): PerformanceTrend[] {
    return this.trends.get(systemId) || [];
  }

  /**
   * Get all active performance insights
   */
  public getPerformanceInsights(filterBy?: {
    type?: string;
    severity?: string;
    systemId?: string;
  }): PerformanceInsight[] {
    let filteredInsights = this.insights.filter(i => !i.expiresAt || i.expiresAt > new Date());

    if (filterBy) {
      if (filterBy.type) {
        filteredInsights = filteredInsights.filter(i => i.type === filterBy.type);
      }
      if (filterBy.severity) {
        filteredInsights = filteredInsights.filter(i => i.severity === filterBy.severity);
      }
      if (filterBy.systemId) {
        filteredInsights = filteredInsights.filter(i => i.affectedSystems.includes(filterBy.systemId!));
      }
    }

    return filteredInsights.sort((a, b) => {
      // Sort by severity (critical > warning > info) then by creation date
      const severityOrder = { critical: 3, warning: 2, info: 1 };
      const aSeverity = severityOrder[a.severity] || 0;
      const bSeverity = severityOrder[b.severity] || 0;

      if (aSeverity !== bSeverity) {
        return bSeverity - aSeverity;
      }

      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  /**
   * Get comprehensive analytics dashboard data
   */
  public async getAnalyticsDashboardData(): Promise<{
    systemOverview: Array<{
      systemId: string;
      systemName: string;
      healthScore: number;
      currentMetrics: Record<string, number>;
      trends: Record<string, 'improving' | 'stable' | 'degrading' | 'critical'>;
    }>;
    globalTrends: PerformanceTrend[];
    criticalInsights: PerformanceInsight[];
    businessImpactSummary: {
      totalSystemsMonitored: number;
      systemsWithIssues: number;
      estimatedDailyImpact: number;
      topPerformingSystems: string[];
      systemsNeedingAttention: string[];
    };
  }> {
    const systemOverview = [];
    const allTrends: PerformanceTrend[] = [];

    // Build system overview
    for (const [systemId] of this.metrics) {
      const recentMetrics = this.getPerformanceMetrics(systemId, '1h');
      const systemTrends = this.getPerformanceTrends(systemId);

      if (recentMetrics.length === 0) continue;

      // Calculate health score based on recent metrics
      let healthScore = 100;
      const latestMetrics: Record<string, number> = {};
      const trendSummary: Record<string, 'improving' | 'stable' | 'degrading' | 'critical'> = {};

      // Get latest metrics by type
      const metricTypes = [...new Set(recentMetrics.map(m => m.metricType))];
      for (const metricType of metricTypes) {
        const typeMetrics = recentMetrics.filter(m => m.metricType === metricType);
        if (typeMetrics.length > 0) {
          const latest = typeMetrics[typeMetrics.length - 1];
          latestMetrics[metricType] = latest.value;

          // Check thresholds for health score
          if (latest.threshold) {
            if (latest.value > latest.threshold.critical) {
              healthScore -= 30;
            } else if (latest.value > latest.threshold.warning) {
              healthScore -= 10;
            }
          }
        }
      }

      // Get trend summary
      for (const trend of systemTrends) {
        if (trend.timeframe === '24h') {
          trendSummary[trend.metricType] = trend.trend;
        }
      }

      systemOverview.push({
        systemId,
        systemName: systemId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        healthScore: Math.max(0, Math.min(100, healthScore)),
        currentMetrics: latestMetrics,
        trends: trendSummary
      });

      allTrends.push(...systemTrends);
    }

    // Get critical insights
    const criticalInsights = this.getPerformanceInsights({
      severity: 'critical'
    }).slice(0, 10); // Top 10 critical insights

    // Calculate business impact summary
    const systemsWithIssues = systemOverview.filter(s => s.healthScore < 80).length;
    const topPerformingSystems = systemOverview
      .filter(s => s.healthScore >= 95)
      .sort((a, b) => b.healthScore - a.healthScore)
      .slice(0, 5)
      .map(s => s.systemId);
    const systemsNeedingAttention = systemOverview
      .filter(s => s.healthScore < 80)
      .sort((a, b) => a.healthScore - b.healthScore)
      .slice(0, 5)
      .map(s => s.systemId);

    const estimatedDailyImpact = criticalInsights.reduce((sum, insight) => {
      return sum + (insight.estimatedImpact.costSaving || 0);
    }, 0);

    return {
      systemOverview,
      globalTrends: allTrends.filter(t => t.timeframe === '24h'), // 24h trends for global view
      criticalInsights,
      businessImpactSummary: {
        totalSystemsMonitored: systemOverview.length,
        systemsWithIssues,
        estimatedDailyImpact,
        topPerformingSystems,
        systemsNeedingAttention
      }
    };
  }

  /**
   * Generate comprehensive performance report
   */
  public async generatePerformanceReport(
    timeframe: '24h' | '7d' | '30d' = '24h'
  ): Promise<{
    reportId: string;
    generatedAt: Date;
    timeframe: string;
    executiveSummary: {
      overallHealthScore: number;
      totalSystemsAnalyzed: number;
      criticalIssuesFound: number;
      optimizationOpportunities: number;
      estimatedBusinessImpact: number;
    };
    systemAnalysis: Array<{
      systemId: string;
      healthScore: number;
      keyMetrics: Record<string, { current: number; trend: string; changePercent: number }>;
      recommendations: string[];
      businessImpact: string;
    }>;
    insights: PerformanceInsight[];
    recommendations: {
      immediate: string[];
      shortTerm: string[];
      longTerm: string[];
    };
  }> {
    const reportId = `performance_report_${Date.now()}`;
    const dashboardData = await this.getAnalyticsDashboardData();

    // Calculate overall health score
    const overallHealthScore = dashboardData.systemOverview.length > 0
      ? dashboardData.systemOverview.reduce((sum, s) => sum + s.healthScore, 0) / dashboardData.systemOverview.length
      : 0;

    // Analyze each system
    const systemAnalysis = dashboardData.systemOverview.map(system => {
      const systemTrends = this.getPerformanceTrends(system.systemId);
      const keyMetrics: Record<string, { current: number; trend: string; changePercent: number }> = {};

      for (const trend of systemTrends) {
        if (trend.timeframe === timeframe) {
          keyMetrics[trend.metricType] = {
            current: trend.dataPoints[trend.dataPoints.length - 1]?.value || 0,
            trend: trend.trend,
            changePercent: trend.changePercent
          };
        }
      }

      // Get system-specific insights for recommendations
      const systemInsights = this.getPerformanceInsights({ systemId: system.systemId });
      const recommendations = [...new Set(systemInsights.flatMap(i => i.recommendations))].slice(0, 5);

      const businessImpact = system.healthScore < 80 
        ? `System requires attention - potential impact on user experience and operational efficiency`
        : system.healthScore > 95
        ? `System performing optimally - contributing positively to business objectives`
        : `System performing adequately - monitor for potential improvements`;

      return {
        systemId: system.systemId,
        healthScore: system.healthScore,
        keyMetrics,
        recommendations,
        businessImpact
      };
    });

    // Generate tiered recommendations
    const allInsights = this.getPerformanceInsights();
    const criticalInsights = allInsights.filter(i => i.severity === 'critical');
    const warningInsights = allInsights.filter(i => i.severity === 'warning');

    const recommendations = {
      immediate: criticalInsights.slice(0, 5).map(i => i.recommendations[0]).filter(Boolean),
      shortTerm: warningInsights.slice(0, 5).map(i => i.recommendations[0]).filter(Boolean),
      longTerm: [
        'Implement automated performance regression testing',
        'Establish performance budgets for all critical systems',
        'Create performance-focused development guidelines',
        'Implement predictive scaling based on usage patterns',
        'Establish regular performance review cycles'
      ]
    };

    const report = {
      reportId,
      generatedAt: new Date(),
      timeframe,
      executiveSummary: {
        overallHealthScore: Math.round(overallHealthScore),
        totalSystemsAnalyzed: dashboardData.systemOverview.length,
        criticalIssuesFound: criticalInsights.length,
        optimizationOpportunities: allInsights.filter(i => i.type === 'optimization_opportunity').length,
        estimatedBusinessImpact: dashboardData.businessImpactSummary.estimatedDailyImpact
      },
      systemAnalysis,
      insights: allInsights.slice(0, 20), // Top 20 insights
      recommendations
    };

    logger.info('Generated comprehensive performance report', {
      namespace: 'performance_analytics',
      operation: 'generate_report',
      classification: DataClassification.INTERNAL,
      metadata: {
        reportId,
        timeframe,
        systemsAnalyzed: report.executiveSummary.totalSystemsAnalyzed,
        criticalIssues: report.executiveSummary.criticalIssuesFound
      }
    });

    return report;
  }
}

// Export singleton instance
export const performanceAnalyticsService = new PerformanceAnalyticsService();

// Export types for external use
export type {
  PerformanceMetric,
  PerformanceTrend,
  BusinessImpactAnalysis,
  PerformanceInsight,
  PerformanceAnalyticsConfig
};