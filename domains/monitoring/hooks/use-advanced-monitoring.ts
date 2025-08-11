// domains/monitoring/hooks/use-advanced-monitoring.ts
import { useState, useCallback, useEffect } from 'react';
import { logger, DataClassification } from '@/lib/logging/enterprise-logger';
import { advancedMonitoringSystem } from '@/lib/monitoring/advanced-monitoring-system';

// ====================================================================
// ADVANCED MONITORING REACT HOOKS
// Comprehensive interface to monitoring system with real-time updates
// Provides unified access to all 11 optimization systems
// ====================================================================

interface MonitoringSystem {
  id: string;
  name: string;
  type: 'cache' | 'database' | 'query' | 'connection' | 'analytics' | 'real-time';
  health: {
    score: number;
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
    lastUpdated: Date;
  };
  metrics: {
    [key: string]: number | string | boolean;
  };
  trends: {
    performance: number[];
    timestamps: string[];
  };
}

interface MonitoringAlert {
  id: string;
  systemId: string;
  systemName: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  acknowledged: boolean;
  autoRecovery: boolean;
}

interface MonitoringRecommendation {
  id: string;
  systemId: string;
  systemName: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedImprovement: number;
  implementationComplexity: 'low' | 'medium' | 'high';
  estimatedTimeHours: number;
  category: 'performance' | 'reliability' | 'cost' | 'security';
}

interface GlobalHealth {
  score: number;
  status: 'healthy' | 'warning' | 'critical';
  totalSystems: number;
  healthySystems: number;
  warningSystems: number;
  criticalSystems: number;
  lastUpdated: Date;
}

interface PerformanceTrends {
  overall: Array<{
    timestamp: string;
    response_time: number;
    throughput: number;
    error_rate: number;
  }>;
  cache: Array<{
    timestamp: string;
    hit_rate: number;
    memory_usage: number;
  }>;
  database: Array<{
    timestamp: string;
    query_time: number;
    connection_utilization: number;
  }>;
}

interface UseAdvancedMonitoringResult {
  // Core data
  systems: MonitoringSystem[];
  globalHealth: GlobalHealth;
  performanceTrends: PerformanceTrends;
  alerts: MonitoringAlert[];
  recommendations: MonitoringRecommendation[];
  
  // State
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Actions
  refreshSystem: (systemId: string) => Promise<void>;
  refreshAll: () => Promise<void>;
  dismissAlert: (alertId: string) => Promise<void>;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  implementRecommendation: (recommendationId: string) => Promise<void>;
  
  // Configuration
  setRefreshInterval: (intervalMs: number) => void;
  enableAutoRecovery: (systemId: string, enabled: boolean) => Promise<void>;
}

export const useAdvancedMonitoring = (): UseAdvancedMonitoringResult => {
  const [state, setState] = useState({
    systems: [] as MonitoringSystem[],
    globalHealth: {
      score: 0,
      status: 'healthy' as 'healthy' | 'warning' | 'critical',
      totalSystems: 0,
      healthySystems: 0,
      warningSystems: 0,
      criticalSystems: 0,
      lastUpdated: new Date()
    },
    performanceTrends: {
      overall: [],
      cache: [],
      database: []
    } as PerformanceTrends,
    alerts: [] as MonitoringAlert[],
    recommendations: [] as MonitoringRecommendation[],
    loading: false,
    error: null as string | null,
    lastUpdated: null as Date | null
  });

  const [refreshInterval, setRefreshIntervalState] = useState(30000); // 30 seconds default

  /**
   * Load comprehensive monitoring data
   */
  const loadMonitoringData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      logger.debug('Loading advanced monitoring data', {
        namespace: 'advanced_monitoring_hook',
        operation: 'load_monitoring_data',
        classification: DataClassification.INTERNAL,
        metadata: { timestamp: new Date().toISOString() }
      });

      // Get comprehensive system health
      const systemHealth = await advancedMonitoringSystem.getComprehensiveSystemHealth();
      const globalMetrics = await advancedMonitoringSystem.getGlobalPerformanceMetrics();
      const activeAlerts = await advancedMonitoringSystem.getActiveAlerts();
      const currentRecommendations = await advancedMonitoringSystem.getOptimizationRecommendations();

      // Transform system health data
      const systems: MonitoringSystem[] = systemHealth.systems.map(system => ({
        id: system.id,
        name: system.name,
        type: system.type as any,
        health: {
          score: system.health.score,
          status: system.health.status,
          issues: system.health.issues,
          recommendations: system.health.recommendations,
          lastUpdated: system.health.lastChecked
        },
        metrics: {
          response_time: system.performance.averageResponseTime,
          throughput: system.performance.throughput,
          error_rate: system.performance.errorRate,
          availability: system.performance.availability,
          ...system.metrics // Include any additional metrics
        },
        trends: {
          performance: system.trends.performance,
          timestamps: system.trends.timestamps.map(ts => ts.toISOString())
        }
      }));

      // Calculate global health
      const totalSystems = systems.length;
      const healthySystems = systems.filter(s => s.health.status === 'healthy').length;
      const warningSystems = systems.filter(s => s.health.status === 'warning').length;
      const criticalSystems = systems.filter(s => s.health.status === 'critical').length;
      
      const globalHealthScore = totalSystems > 0 
        ? Math.round((systems.reduce((sum, s) => sum + s.health.score, 0) / totalSystems))
        : 0;

      let globalStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (criticalSystems > 0) globalStatus = 'critical';
      else if (warningSystems > 0) globalStatus = 'warning';

      // Transform alerts
      const alerts: MonitoringAlert[] = activeAlerts.map(alert => ({
        id: alert.id,
        systemId: alert.systemId,
        systemName: alert.systemName,
        severity: alert.severity as any,
        message: alert.message,
        timestamp: alert.timestamp.toISOString(),
        acknowledged: alert.acknowledged,
        autoRecovery: alert.autoRecovery
      }));

      // Transform recommendations
      const recommendations: MonitoringRecommendation[] = currentRecommendations.map(rec => ({
        id: rec.id,
        systemId: rec.systemId,
        systemName: rec.systemName,
        title: rec.title,
        description: rec.description,
        priority: rec.priority as any,
        estimatedImprovement: rec.estimatedImprovementPercent,
        implementationComplexity: rec.complexity as any,
        estimatedTimeHours: rec.estimatedHours,
        category: rec.category as any
      }));

      // Generate performance trends (simulated data for demonstration)
      const now = new Date();
      const performanceTrends: PerformanceTrends = {
        overall: Array.from({ length: 20 }, (_, i) => ({
          timestamp: new Date(now.getTime() - (19 - i) * 60000).toISOString(),
          response_time: 50 + Math.random() * 20,
          throughput: 1000 + Math.random() * 200,
          error_rate: Math.random() * 2
        })),
        cache: Array.from({ length: 20 }, (_, i) => ({
          timestamp: new Date(now.getTime() - (19 - i) * 60000).toISOString(),
          hit_rate: 85 + Math.random() * 10,
          memory_usage: 60 + Math.random() * 15
        })),
        database: Array.from({ length: 20 }, (_, i) => ({
          timestamp: new Date(now.getTime() - (19 - i) * 60000).toISOString(),
          query_time: 20 + Math.random() * 10,
          connection_utilization: 40 + Math.random() * 20
        }))
      };

      setState(prev => ({
        ...prev,
        systems,
        globalHealth: {
          score: globalHealthScore,
          status: globalStatus,
          totalSystems,
          healthySystems,
          warningSystems,
          criticalSystems,
          lastUpdated: new Date()
        },
        performanceTrends,
        alerts,
        recommendations,
        loading: false,
        error: null,
        lastUpdated: new Date()
      }));

      logger.info('Advanced monitoring data loaded successfully', {
        namespace: 'advanced_monitoring_hook',
        operation: 'load_monitoring_data_success',
        classification: DataClassification.INTERNAL,
        metadata: {
          totalSystems,
          healthySystems,
          warningSystems,
          criticalSystems,
          totalAlerts: alerts.length,
          totalRecommendations: recommendations.length,
          globalHealthScore,
          globalStatus
        }
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load monitoring data';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      logger.error('Failed to load advanced monitoring data', {
        namespace: 'advanced_monitoring_hook',
        operation: 'load_monitoring_data_error',
        classification: DataClassification.INTERNAL,
        error: errorMessage
      });
    }
  }, []);

  /**
   * Refresh specific system
   */
  const refreshSystem = useCallback(async (systemId: string) => {
    try {
      logger.debug('Refreshing specific system', {
        namespace: 'advanced_monitoring_hook',
        operation: 'refresh_system',
        classification: DataClassification.INTERNAL,
        metadata: { systemId }
      });

      const systemHealth = await advancedMonitoringSystem.getSystemHealth(systemId);
      
      setState(prev => ({
        ...prev,
        systems: prev.systems.map(system => 
          system.id === systemId 
            ? {
                ...system,
                health: {
                  ...systemHealth.health,
                  lastUpdated: systemHealth.health.lastChecked
                },
                metrics: {
                  ...system.metrics,
                  response_time: systemHealth.performance.averageResponseTime,
                  throughput: systemHealth.performance.throughput,
                  error_rate: systemHealth.performance.errorRate,
                  availability: systemHealth.performance.availability
                }
              }
            : system
        ),
        lastUpdated: new Date()
      }));

      logger.info('System refreshed successfully', {
        namespace: 'advanced_monitoring_hook',
        operation: 'refresh_system_success',
        classification: DataClassification.INTERNAL,
        metadata: { 
          systemId,
          healthScore: systemHealth.health.score,
          status: systemHealth.health.status
        }
      });

    } catch (error) {
      logger.error('Failed to refresh system', {
        namespace: 'advanced_monitoring_hook',
        operation: 'refresh_system_error',
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : String(error),
        metadata: { systemId }
      });
    }
  }, []);

  /**
   * Refresh all systems
   */
  const refreshAll = useCallback(async () => {
    await loadMonitoringData();
  }, [loadMonitoringData]);

  /**
   * Dismiss alert
   */
  const dismissAlert = useCallback(async (alertId: string) => {
    try {
      await advancedMonitoringSystem.dismissAlert(alertId);
      
      setState(prev => ({
        ...prev,
        alerts: prev.alerts.filter(alert => alert.id !== alertId)
      }));

      logger.info('Alert dismissed', {
        namespace: 'advanced_monitoring_hook',
        operation: 'dismiss_alert',
        classification: DataClassification.INTERNAL,
        metadata: { alertId }
      });

    } catch (error) {
      logger.error('Failed to dismiss alert', {
        namespace: 'advanced_monitoring_hook',
        operation: 'dismiss_alert_error',
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : String(error),
        metadata: { alertId }
      });
    }
  }, []);

  /**
   * Acknowledge alert
   */
  const acknowledgeAlert = useCallback(async (alertId: string) => {
    try {
      await advancedMonitoringSystem.acknowledgeAlert(alertId);
      
      setState(prev => ({
        ...prev,
        alerts: prev.alerts.map(alert =>
          alert.id === alertId
            ? { ...alert, acknowledged: true }
            : alert
        )
      }));

      logger.info('Alert acknowledged', {
        namespace: 'advanced_monitoring_hook',
        operation: 'acknowledge_alert',
        classification: DataClassification.INTERNAL,
        metadata: { alertId }
      });

    } catch (error) {
      logger.error('Failed to acknowledge alert', {
        namespace: 'advanced_monitoring_hook',
        operation: 'acknowledge_alert_error',
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : String(error),
        metadata: { alertId }
      });
    }
  }, []);

  /**
   * Implement recommendation
   */
  const implementRecommendation = useCallback(async (recommendationId: string) => {
    try {
      const recommendation = state.recommendations.find(rec => rec.id === recommendationId);
      if (!recommendation) {
        throw new Error('Recommendation not found');
      }

      logger.info('Implementing recommendation', {
        namespace: 'advanced_monitoring_hook',
        operation: 'implement_recommendation',
        classification: DataClassification.INTERNAL,
        metadata: {
          recommendationId,
          title: recommendation.title,
          priority: recommendation.priority,
          systemId: recommendation.systemId
        }
      });

      // This would trigger the actual implementation
      await advancedMonitoringSystem.implementRecommendation(recommendationId);
      
      // Remove implemented recommendation
      setState(prev => ({
        ...prev,
        recommendations: prev.recommendations.filter(rec => rec.id !== recommendationId)
      }));

      // Refresh the affected system
      await refreshSystem(recommendation.systemId);

    } catch (error) {
      logger.error('Failed to implement recommendation', {
        namespace: 'advanced_monitoring_hook',
        operation: 'implement_recommendation_error',
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : String(error),
        metadata: { recommendationId }
      });
    }
  }, [state.recommendations, refreshSystem]);

  /**
   * Set refresh interval
   */
  const setRefreshInterval = useCallback((intervalMs: number) => {
    setRefreshIntervalState(intervalMs);
    
    logger.info('Refresh interval updated', {
      namespace: 'advanced_monitoring_hook',
      operation: 'set_refresh_interval',
      classification: DataClassification.INTERNAL,
      metadata: { intervalMs }
    });
  }, []);

  /**
   * Enable/disable auto recovery for system
   */
  const enableAutoRecovery = useCallback(async (systemId: string, enabled: boolean) => {
    try {
      await advancedMonitoringSystem.setAutoRecovery(systemId, enabled);
      
      logger.info('Auto recovery setting updated', {
        namespace: 'advanced_monitoring_hook',
        operation: 'enable_auto_recovery',
        classification: DataClassification.INTERNAL,
        metadata: { systemId, enabled }
      });

    } catch (error) {
      logger.error('Failed to update auto recovery setting', {
        namespace: 'advanced_monitoring_hook',
        operation: 'enable_auto_recovery_error',
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : String(error),
        metadata: { systemId, enabled }
      });
    }
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(() => {
      loadMonitoringData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, loadMonitoringData]);

  // Initial load
  useEffect(() => {
    loadMonitoringData();
  }, [loadMonitoringData]);

  return {
    ...state,
    refreshSystem,
    refreshAll,
    dismissAlert,
    acknowledgeAlert,
    implementRecommendation,
    setRefreshInterval,
    enableAutoRecovery
  };
};

/**
 * Hook for individual system monitoring
 */
export const useSystemMonitoring = (systemId: string) => {
  const [system, setSystem] = useState<MonitoringSystem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSystem = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const systemHealth = await advancedMonitoringSystem.getSystemHealth(systemId);
      
      const systemData: MonitoringSystem = {
        id: systemId,
        name: systemHealth.name,
        type: systemHealth.type as any,
        health: {
          score: systemHealth.health.score,
          status: systemHealth.health.status,
          issues: systemHealth.health.issues,
          recommendations: systemHealth.health.recommendations,
          lastUpdated: systemHealth.health.lastChecked
        },
        metrics: {
          response_time: systemHealth.performance.averageResponseTime,
          throughput: systemHealth.performance.throughput,
          error_rate: systemHealth.performance.errorRate,
          availability: systemHealth.performance.availability,
          ...systemHealth.metrics
        },
        trends: {
          performance: systemHealth.trends.performance,
          timestamps: systemHealth.trends.timestamps.map(ts => ts.toISOString())
        }
      };

      setSystem(systemData);
      setLoading(false);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load system data';
      setError(errorMessage);
      setLoading(false);
    }
  }, [systemId]);

  useEffect(() => {
    refreshSystem();
  }, [refreshSystem]);

  return {
    system,
    loading,
    error,
    refreshSystem
  };
};

// Export types
export type {
  MonitoringSystem,
  MonitoringAlert,
  MonitoringRecommendation,
  GlobalHealth,
  PerformanceTrends,
  UseAdvancedMonitoringResult
};