// domains/analytics/hooks/use-performance-analytics.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { logger, DataClassification } from '@/lib/logging/enterprise-logger';
import { performanceAnalyticsService, PerformanceInsight } from '../services/performance-analytics-service';

// ====================================================================
// PERFORMANCE ANALYTICS HOOK
// React hook for managing performance analytics data and state
// Provides comprehensive analytics dashboard functionality
// ====================================================================

export interface DashboardData {
  systemOverview: Array<{
    systemId: string;
    systemName: string;
    healthScore: number;
    currentMetrics: Record<string, number>;
    trends: Record<string, 'improving' | 'stable' | 'degrading' | 'critical'>;
  }>;
  globalTrends: Array<{
    systemId: string;
    metricType: string;
    timeframe: string;
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
  }>;
  criticalInsights: PerformanceInsight[];
  businessImpactSummary: {
    totalSystemsMonitored: number;
    systemsWithIssues: number;
    estimatedDailyImpact: number;
    topPerformingSystems: string[];
    systemsNeedingAttention: string[];
  };
}

export interface PerformanceReport {
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
}

interface UsePerformanceAnalyticsResult {
  // Data
  dashboardData: DashboardData | null;
  performanceInsights: PerformanceInsight[] | null;
  performanceReport: PerformanceReport | null;
  
  // State
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Actions
  refreshData: () => Promise<void>;
  generateReport: (timeframe?: '24h' | '7d' | '30d') => Promise<void>;
  getSystemMetrics: (systemId: string, timeframe: '1h' | '24h' | '7d' | '30d') => any[];
  getSystemTrends: (systemId: string) => any[];
  clearError: () => void;
}

export const usePerformanceAnalytics = (): UsePerformanceAnalyticsResult => {
  // State management
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [performanceInsights, setPerformanceInsights] = useState<PerformanceInsight[] | null>(null);
  const [performanceReport, setPerformanceReport] = useState<PerformanceReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Refs for cleanup
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Load comprehensive dashboard data
   */
  const loadDashboardData = useCallback(async (): Promise<void> => {
    try {
      // Cancel any existing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      
      setLoading(true);
      setError(null);

      logger.info('Loading performance analytics dashboard data', {
        namespace: 'performance_analytics_hook',
        operation: 'load_dashboard_data',
        classification: DataClassification.INTERNAL,
        metadata: { timestamp: new Date().toISOString() }
      });

      // Load dashboard data from service
      const dashboardResult = await performanceAnalyticsService.getAnalyticsDashboardData();
      
      // Check if component is still mounted
      if (!mountedRef.current) return;

      // Transform dashboard data to match component expectations
      const transformedDashboardData: DashboardData = {
        systemOverview: dashboardResult.systemOverview,
        globalTrends: dashboardResult.globalTrends.map(trend => ({
          systemId: trend.systemId,
          metricType: trend.metricType,
          timeframe: trend.timeframe,
          trend: trend.trend,
          changePercent: trend.changePercent,
          dataPoints: trend.dataPoints,
          prediction: trend.prediction
        })),
        criticalInsights: dashboardResult.criticalInsights,
        businessImpactSummary: dashboardResult.businessImpactSummary
      };

      setDashboardData(transformedDashboardData);

      // Load performance insights
      const insights = performanceAnalyticsService.getPerformanceInsights();
      setPerformanceInsights(insights);

      setLastUpdated(new Date());

      logger.info('Successfully loaded performance analytics dashboard data', {
        namespace: 'performance_analytics_hook',
        operation: 'load_dashboard_data_success',
        classification: DataClassification.INTERNAL,
        metadata: {
          systemsLoaded: transformedDashboardData.systemOverview.length,
          insightsLoaded: insights.length,
          criticalInsights: transformedDashboardData.criticalInsights.length
        }
      });

    } catch (err) {
      if (!mountedRef.current) return;

      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMessage);

      logger.error('Failed to load performance analytics dashboard data', {
        namespace: 'performance_analytics_hook',
        operation: 'load_dashboard_data_error',
        classification: DataClassification.INTERNAL,
        error: errorMessage
      });
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  /**
   * Refresh all analytics data
   */
  const refreshData = useCallback(async (): Promise<void> => {
    await loadDashboardData();
  }, [loadDashboardData]);

  /**
   * Generate comprehensive performance report
   */
  const generateReport = useCallback(async (timeframe: '24h' | '7d' | '30d' = '24h'): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      logger.info('Generating performance report', {
        namespace: 'performance_analytics_hook',
        operation: 'generate_report',
        classification: DataClassification.INTERNAL,
        metadata: { timeframe }
      });

      const reportResult = await performanceAnalyticsService.generatePerformanceReport(timeframe);
      
      if (!mountedRef.current) return;

      // Transform report data
      const transformedReport: PerformanceReport = {
        reportId: reportResult.reportId,
        generatedAt: reportResult.generatedAt,
        timeframe: reportResult.timeframe,
        executiveSummary: reportResult.executiveSummary,
        systemAnalysis: reportResult.systemAnalysis,
        insights: reportResult.insights,
        recommendations: reportResult.recommendations
      };

      setPerformanceReport(transformedReport);

      logger.info('Successfully generated performance report', {
        namespace: 'performance_analytics_hook',
        operation: 'generate_report_success',
        classification: DataClassification.INTERNAL,
        metadata: {
          reportId: transformedReport.reportId,
          timeframe: transformedReport.timeframe,
          systemsAnalyzed: transformedReport.executiveSummary.totalSystemsAnalyzed
        }
      });

    } catch (err) {
      if (!mountedRef.current) return;

      const errorMessage = err instanceof Error ? err.message : 'Failed to generate report';
      setError(errorMessage);

      logger.error('Failed to generate performance report', {
        namespace: 'performance_analytics_hook',
        operation: 'generate_report_error',
        classification: DataClassification.INTERNAL,
        error: errorMessage,
        metadata: { timeframe }
      });
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  /**
   * Get performance metrics for a specific system
   */
  const getSystemMetrics = useCallback((
    systemId: string, 
    timeframe: '1h' | '24h' | '7d' | '30d'
  ) => {
    try {
      return performanceAnalyticsService.getPerformanceMetrics(systemId, timeframe);
    } catch (err) {
      logger.error('Failed to get system metrics', {
        namespace: 'performance_analytics_hook',
        operation: 'get_system_metrics_error',
        classification: DataClassification.INTERNAL,
        error: err instanceof Error ? err.message : String(err),
        metadata: { systemId, timeframe }
      });
      return [];
    }
  }, []);

  /**
   * Get performance trends for a specific system
   */
  const getSystemTrends = useCallback((systemId: string) => {
    try {
      return performanceAnalyticsService.getPerformanceTrends(systemId);
    } catch (err) {
      logger.error('Failed to get system trends', {
        namespace: 'performance_analytics_hook',
        operation: 'get_system_trends_error',
        classification: DataClassification.INTERNAL,
        error: err instanceof Error ? err.message : String(err),
        metadata: { systemId }
      });
      return [];
    }
  }, []);

  // Load initial data on mount
  useEffect(() => {
    loadDashboardData();

    // Cleanup function
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadDashboardData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    // Data
    dashboardData,
    performanceInsights,
    performanceReport,
    
    // State
    loading,
    error,
    lastUpdated,
    
    // Actions
    refreshData,
    generateReport,
    getSystemMetrics,
    getSystemTrends,
    clearError
  };
};