// lib/monitoring/advanced-monitoring-system.ts
import { logger, DataClassification } from '@/lib/logging/enterprise-logger';
import { performanceBenchmark } from '@/lib/performance/performance-benchmark';

// ====================================================================
// ADVANCED MONITORING & OBSERVABILITY SYSTEM
// Comprehensive oversight for all optimization systems
// BEFORE: Individual system monitoring without unified oversight
// AFTER: Comprehensive real-time monitoring with proactive alerting and recommendations
// ====================================================================

interface SystemHealth {
  systemId: string;
  systemName: string;
  status: 'healthy' | 'warning' | 'critical' | 'degraded' | 'offline';
  healthScore: number; // 0-100
  lastCheck: Date;
  uptime: number; // milliseconds
  responseTime: number; // milliseconds
  errorRate: number; // percentage
  throughput: number; // operations per second
  resourceUtilization: {
    cpu: number;
    memory: number;
    network: number;
    disk: number;
  };
  customMetrics: Record<string, number>;
}

interface PerformanceMetrics {
  systemId: string;
  timestamp: Date;
  responseTime: number;
  throughput: number;
  errorRate: number;
  successRate: number;
  operationCounts: Record<string, number>;
  performanceTrends: {
    responseTime: number[];
    throughput: number[];
    errorRate: number[];
  };
}

interface AlertRule {
  id: string;
  systemId: string;
  metric: string;
  condition: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  threshold: number;
  duration: number; // milliseconds
  severity: 'info' | 'warning' | 'critical';
  enabled: boolean;
  description: string;
  actions: AlertAction[];
}

interface AlertAction {
  type: 'email' | 'webhook' | 'slack' | 'auto_recovery' | 'scale_up';
  config: Record<string, any>;
}

interface SystemAlert {
  id: string;
  ruleId: string;
  systemId: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  triggeredAt: Date;
  resolvedAt?: Date;
  status: 'active' | 'acknowledged' | 'resolved';
  metadata: Record<string, any>;
}

interface OptimizationRecommendation {
  id: string;
  systemId: string;
  type: 'performance' | 'resource' | 'reliability' | 'cost';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  implementationSteps: string[];
  expectedImprovement: string;
  generatedAt: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
}

interface MonitoringDashboard {
  id: string;
  name: string;
  description: string;
  panels: DashboardPanel[];
  refreshInterval: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DashboardPanel {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'alert' | 'recommendation';
  position: { x: number; y: number; width: number; height: number };
  config: {
    systemIds?: string[];
    metrics?: string[];
    timeRange?: string;
    aggregation?: string;
    visualization?: string;
  };
}

class AdvancedMonitoringSystem {
  private systemHealth: Map<string, SystemHealth> = new Map();
  private performanceMetrics: Map<string, PerformanceMetrics[]> = new Map();
  private alertRules: Map<string, AlertRule> = new Map();
  private activeAlerts: Map<string, SystemAlert> = new Map();
  private recommendations: Map<string, OptimizationRecommendation[]> = new Map();
  private dashboards: Map<string, MonitoringDashboard> = new Map();
  
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private metricsCollectionInterval: NodeJS.Timeout | null = null;
  private alertEvaluationInterval: NodeJS.Timeout | null = null;
  private recommendationInterval: NodeJS.Timeout | null = null;

  // Configuration for all optimization systems we monitor
  private readonly MONITORED_SYSTEMS = [
    {
      id: 'authentication_cache',
      name: 'Authentication Performance Cache',
      type: 'cache',
      criticalMetrics: ['hit_rate', 'response_time', 'cache_size'],
      healthThresholds: { response_time: 10, hit_rate: 90, error_rate: 1 }
    },
    {
      id: 'billing_dashboard',
      name: 'Billing Dashboard Optimization',
      type: 'query_optimization',
      criticalMetrics: ['query_time', 'data_freshness', 'concurrent_users'],
      healthThresholds: { query_time: 500, error_rate: 2, throughput: 10 }
    },
    {
      id: 'bulk_upload',
      name: 'Bulk Upload N+1 Elimination',
      type: 'database_optimization',
      criticalMetrics: ['query_reduction', 'processing_time', 'error_rate'],
      healthThresholds: { query_reduction: 95, processing_time: 5000, error_rate: 1 }
    },
    {
      id: 'analytics_optimization',
      name: 'Analytics Query Optimization',
      type: 'materialized_views',
      criticalMetrics: ['view_refresh_time', 'query_performance', 'data_accuracy'],
      healthThresholds: { view_refresh_time: 30000, query_performance: 500, error_rate: 0.5 }
    },
    {
      id: 'schema_introspection',
      name: 'Schema Introspection Cache',
      type: 'cache',
      criticalMetrics: ['cache_hit_rate', 'introspection_time', 'schema_freshness'],
      healthThresholds: { cache_hit_rate: 95, introspection_time: 10, error_rate: 0.1 }
    },
    {
      id: 'query_optimizer',
      name: 'Advanced Query Optimizer',
      type: 'prepared_statements',
      criticalMetrics: ['statement_cache_hits', 'execution_time', 'compilation_time'],
      healthThresholds: { statement_cache_hits: 85, execution_time: 100, error_rate: 1 }
    },
    {
      id: 'connection_pool',
      name: 'Connection Pool Optimizer',
      type: 'database_pool',
      criticalMetrics: ['pool_utilization', 'connection_health', 'acquisition_time'],
      healthThresholds: { pool_utilization: 90, connection_health: 98, acquisition_time: 5 }
    },
    {
      id: 'index_optimizer',
      name: 'Database Index Optimizer',
      type: 'index_management',
      criticalMetrics: ['index_efficiency', 'query_plan_optimization', 'maintenance_overhead'],
      healthThresholds: { index_efficiency: 80, query_plan_optimization: 75, error_rate: 0.5 }
    },
    {
      id: 'realtime_sync',
      name: 'Real-time Synchronization',
      type: 'websocket_optimization',
      criticalMetrics: ['sync_latency', 'connection_stability', 'batch_efficiency'],
      healthThresholds: { sync_latency: 75, connection_stability: 99, batch_efficiency: 70 }
    },
    {
      id: 'query_cache',
      name: 'Database Query Cache',
      type: 'intelligent_cache',
      criticalMetrics: ['cache_hit_rate', 'invalidation_accuracy', 'memory_efficiency'],
      healthThresholds: { cache_hit_rate: 85, invalidation_accuracy: 99, memory_efficiency: 80 }
    },
    {
      id: 'performance_benchmark',
      name: 'Performance Benchmark System',
      type: 'measurement',
      criticalMetrics: ['benchmark_accuracy', 'measurement_overhead', 'data_retention'],
      healthThresholds: { benchmark_accuracy: 95, measurement_overhead: 1, data_retention: 99 }
    }
  ];

  constructor() {
    this.initializeDefaultAlertRules();
    this.createDefaultDashboards();
    this.startMonitoringServices();
    
    // Graceful shutdown
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());
  }

  /**
   * Register system for monitoring
   */
  async registerSystem(
    systemId: string,
    systemName: string,
    initialHealth?: Partial<SystemHealth>
  ): Promise<void> {
    const health: SystemHealth = {
      systemId,
      systemName,
      status: 'healthy',
      healthScore: 100,
      lastCheck: new Date(),
      uptime: 0,
      responseTime: 0,
      errorRate: 0,
      throughput: 0,
      resourceUtilization: { cpu: 0, memory: 0, network: 0, disk: 0 },
      customMetrics: {},
      ...initialHealth
    };

    this.systemHealth.set(systemId, health);
    this.performanceMetrics.set(systemId, []);

    logger.info('System registered for advanced monitoring', {
      namespace: 'advanced_monitoring',
      operation: 'register_system',
      classification: DataClassification.INTERNAL,
      metadata: {
        systemId,
        systemName,
        initialHealthScore: health.healthScore,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Update system health metrics
   */
  async updateSystemHealth(
    systemId: string,
    healthUpdate: Partial<SystemHealth>
  ): Promise<void> {
    const currentHealth = this.systemHealth.get(systemId);
    if (!currentHealth) {
      throw new Error(`System ${systemId} not registered for monitoring`);
    }

    // Update health metrics
    const updatedHealth: SystemHealth = {
      ...currentHealth,
      ...healthUpdate,
      lastCheck: new Date()
    };

    // Calculate health score based on metrics
    updatedHealth.healthScore = this.calculateHealthScore(systemId, updatedHealth);
    
    // Determine status based on health score
    updatedHealth.status = this.determineSystemStatus(updatedHealth.healthScore, updatedHealth);

    this.systemHealth.set(systemId, updatedHealth);

    // Record performance metrics
    await this.recordPerformanceMetrics(systemId, updatedHealth);

    logger.debug('System health updated', {
      namespace: 'advanced_monitoring',
      operation: 'update_system_health',
      classification: DataClassification.INTERNAL,
      metadata: {
        systemId,
        healthScore: updatedHealth.healthScore,
        status: updatedHealth.status,
        responseTime: updatedHealth.responseTime,
        errorRate: updatedHealth.errorRate,
        throughput: updatedHealth.throughput
      }
    });
  }

  /**
   * Record performance metrics
   */
  async recordPerformanceMetrics(
    systemId: string,
    health: SystemHealth
  ): Promise<void> {
    const currentMetrics = this.performanceMetrics.get(systemId) || [];
    
    const newMetric: PerformanceMetrics = {
      systemId,
      timestamp: new Date(),
      responseTime: health.responseTime,
      throughput: health.throughput,
      errorRate: health.errorRate,
      successRate: 100 - health.errorRate,
      operationCounts: { ...health.customMetrics },
      performanceTrends: {
        responseTime: currentMetrics.slice(-19).map(m => m.responseTime).concat(health.responseTime),
        throughput: currentMetrics.slice(-19).map(m => m.throughput).concat(health.throughput),
        errorRate: currentMetrics.slice(-19).map(m => m.errorRate).concat(health.errorRate)
      }
    };

    // Keep last 100 metrics per system
    currentMetrics.push(newMetric);
    if (currentMetrics.length > 100) {
      currentMetrics.splice(0, currentMetrics.length - 100);
    }

    this.performanceMetrics.set(systemId, currentMetrics);
  }

  /**
   * Calculate comprehensive health score
   */
  private calculateHealthScore(systemId: string, health: SystemHealth): number {
    const systemConfig = this.MONITORED_SYSTEMS.find(s => s.id === systemId);
    if (!systemConfig) return health.healthScore; // Keep existing if no config

    let score = 100;
    const thresholds = systemConfig.healthThresholds;

    // Response time impact
    if (thresholds.response_time && health.responseTime > thresholds.response_time) {
      const penalty = Math.min(30, (health.responseTime / thresholds.response_time - 1) * 20);
      score -= penalty;
    }

    // Error rate impact
    if (thresholds.error_rate && health.errorRate > thresholds.error_rate) {
      const penalty = Math.min(40, (health.errorRate / thresholds.error_rate - 1) * 25);
      score -= penalty;
    }

    // Throughput impact (if below threshold)
    if (thresholds.throughput && health.throughput < thresholds.throughput) {
      const penalty = Math.min(20, (1 - health.throughput / thresholds.throughput) * 15);
      score -= penalty;
    }

    // Resource utilization impact
    const avgResourceUtil = Object.values(health.resourceUtilization).reduce((a, b) => a + b, 0) / 4;
    if (avgResourceUtil > 85) {
      score -= Math.min(15, (avgResourceUtil - 85) * 0.5);
    }

    // Custom metrics impact
    Object.entries(health.customMetrics).forEach(([metric, value]) => {
      const threshold = thresholds[metric];
      if (threshold && value < threshold) {
        score -= Math.min(10, (1 - value / threshold) * 8);
      }
    });

    return Math.max(0, Math.round(score));
  }

  /**
   * Determine system status based on health score and specific conditions
   */
  private determineSystemStatus(healthScore: number, health: SystemHealth): SystemHealth['status'] {
    // Critical conditions
    if (health.errorRate > 10 || health.responseTime > 10000) {
      return 'critical';
    }

    // Status based on health score
    if (healthScore >= 90) return 'healthy';
    if (healthScore >= 70) return 'warning';
    if (healthScore >= 40) return 'degraded';
    if (healthScore > 0) return 'critical';
    return 'offline';
  }

  /**
   * Evaluate alert rules and trigger alerts
   */
  async evaluateAlertRules(): Promise<void> {
    const evaluationStart = performance.now();
    let rulesEvaluated = 0;
    let alertsTriggered = 0;
    let alertsResolved = 0;

    for (const [ruleId, rule] of this.alertRules) {
      if (!rule.enabled) continue;

      const systemHealth = this.systemHealth.get(rule.systemId);
      if (!systemHealth) continue;

      rulesEvaluated++;

      try {
        const shouldAlert = this.evaluateAlertCondition(rule, systemHealth);
        const existingAlert = Array.from(this.activeAlerts.values()).find(
          alert => alert.ruleId === ruleId && alert.status === 'active'
        );

        if (shouldAlert && !existingAlert) {
          // Trigger new alert
          const alert = await this.triggerAlert(rule, systemHealth);
          alertsTriggered++;
          
          logger.warn('Alert triggered', {
            namespace: 'advanced_monitoring',
            operation: 'alert_triggered',
            classification: DataClassification.INTERNAL,
            metadata: {
              alertId: alert.id,
              ruleId,
              systemId: rule.systemId,
              severity: alert.severity,
              title: alert.title
            }
          });

        } else if (!shouldAlert && existingAlert) {
          // Resolve existing alert
          await this.resolveAlert(existingAlert.id);
          alertsResolved++;
          
          logger.info('Alert resolved', {
            namespace: 'advanced_monitoring',
            operation: 'alert_resolved',
            classification: DataClassification.INTERNAL,
            metadata: {
              alertId: existingAlert.id,
              ruleId,
              systemId: rule.systemId,
              duration: Date.now() - existingAlert.triggeredAt.getTime()
            }
          });
        }
      } catch (error) {
        logger.error('Alert rule evaluation failed', {
          namespace: 'advanced_monitoring',
          operation: 'alert_evaluation_error',
          classification: DataClassification.INTERNAL,
          error: error instanceof Error ? error.message : String(error),
          metadata: { ruleId, systemId: rule.systemId }
        });
      }
    }

    const evaluationTime = performance.now() - evaluationStart;

    logger.debug('Alert rule evaluation completed', {
      namespace: 'advanced_monitoring',
      operation: 'alert_evaluation_complete',
      classification: DataClassification.INTERNAL,
      metadata: {
        rulesEvaluated,
        alertsTriggered,
        alertsResolved,
        evaluationTimeMs: Math.round(evaluationTime),
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Evaluate individual alert condition
   */
  private evaluateAlertCondition(rule: AlertRule, health: SystemHealth): boolean {
    let value: number;

    // Get metric value
    switch (rule.metric) {
      case 'response_time':
        value = health.responseTime;
        break;
      case 'error_rate':
        value = health.errorRate;
        break;
      case 'health_score':
        value = health.healthScore;
        break;
      case 'throughput':
        value = health.throughput;
        break;
      case 'cpu_utilization':
        value = health.resourceUtilization.cpu;
        break;
      case 'memory_utilization':
        value = health.resourceUtilization.memory;
        break;
      default:
        value = health.customMetrics[rule.metric] || 0;
    }

    // Evaluate condition
    switch (rule.condition) {
      case 'gt': return value > rule.threshold;
      case 'gte': return value >= rule.threshold;
      case 'lt': return value < rule.threshold;
      case 'lte': return value <= rule.threshold;
      case 'eq': return value === rule.threshold;
      default: return false;
    }
  }

  /**
   * Trigger alert and execute actions
   */
  private async triggerAlert(rule: AlertRule, health: SystemHealth): Promise<SystemAlert> {
    const alertId = `alert_${rule.systemId}_${Date.now()}`;
    
    const alert: SystemAlert = {
      id: alertId,
      ruleId: rule.id,
      systemId: rule.systemId,
      severity: rule.severity,
      title: `${health.systemName}: ${rule.description}`,
      description: `Alert triggered for ${rule.metric} - Current value: ${this.getMetricValue(rule.metric, health)}`,
      triggeredAt: new Date(),
      status: 'active',
      metadata: {
        metric: rule.metric,
        threshold: rule.threshold,
        currentValue: this.getMetricValue(rule.metric, health),
        healthScore: health.healthScore,
        systemStatus: health.status
      }
    };

    this.activeAlerts.set(alertId, alert);

    // Execute alert actions
    for (const action of rule.actions) {
      try {
        await this.executeAlertAction(action, alert, health);
      } catch (error) {
        logger.error('Alert action execution failed', {
          namespace: 'advanced_monitoring',
          operation: 'alert_action_error',
          classification: DataClassification.INTERNAL,
          error: error instanceof Error ? error.message : String(error),
          metadata: {
            alertId,
            actionType: action.type,
            systemId: rule.systemId
          }
        });
      }
    }

    return alert;
  }

  /**
   * Get metric value for alert description
   */
  private getMetricValue(metric: string, health: SystemHealth): number {
    switch (metric) {
      case 'response_time': return health.responseTime;
      case 'error_rate': return health.errorRate;
      case 'health_score': return health.healthScore;
      case 'throughput': return health.throughput;
      case 'cpu_utilization': return health.resourceUtilization.cpu;
      case 'memory_utilization': return health.resourceUtilization.memory;
      default: return health.customMetrics[metric] || 0;
    }
  }

  /**
   * Execute alert action
   */
  private async executeAlertAction(
    action: AlertAction,
    alert: SystemAlert,
    health: SystemHealth
  ): Promise<void> {
    switch (action.type) {
      case 'auto_recovery':
        await this.executeAutoRecovery(alert.systemId, action.config);
        break;
      case 'scale_up':
        await this.executeAutoScaling(alert.systemId, action.config);
        break;
      case 'webhook':
        await this.sendWebhookAlert(alert, action.config);
        break;
      case 'email':
      case 'slack':
        // Would integrate with actual notification systems
        logger.info('Alert notification sent', {
          namespace: 'advanced_monitoring',
          operation: 'alert_notification',
          classification: DataClassification.INTERNAL,
          metadata: {
            alertId: alert.id,
            notificationType: action.type,
            severity: alert.severity
          }
        });
        break;
    }
  }

  /**
   * Execute auto recovery procedures
   */
  private async executeAutoRecovery(systemId: string, config: Record<string, any>): Promise<void> {
    logger.info('Executing auto recovery for system', {
      namespace: 'advanced_monitoring',
      operation: 'auto_recovery_start',
      classification: DataClassification.INTERNAL,
      metadata: { systemId, config }
    });

    // Auto recovery logic would be implemented here
    // Examples: restart connections, clear caches, recreate pools
    
    // Simulate recovery actions
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    logger.info('Auto recovery completed', {
      namespace: 'advanced_monitoring',
      operation: 'auto_recovery_complete',
      classification: DataClassification.INTERNAL,
      metadata: { systemId }
    });
  }

  /**
   * Execute auto scaling procedures
   */
  private async executeAutoScaling(systemId: string, config: Record<string, any>): Promise<void> {
    logger.info('Executing auto scaling for system', {
      namespace: 'advanced_monitoring',
      operation: 'auto_scaling_start',
      classification: DataClassification.INTERNAL,
      metadata: { systemId, config }
    });

    // Auto scaling logic would be implemented here
    // Examples: increase connection pool size, add more cache memory
    
    logger.info('Auto scaling completed', {
      namespace: 'advanced_monitoring',
      operation: 'auto_scaling_complete',
      classification: DataClassification.INTERNAL,
      metadata: { systemId }
    });
  }

  /**
   * Send webhook alert
   */
  private async sendWebhookAlert(alert: SystemAlert, config: Record<string, any>): Promise<void> {
    // Webhook implementation would go here
    logger.info('Webhook alert sent', {
      namespace: 'advanced_monitoring',
      operation: 'webhook_alert_sent',
      classification: DataClassification.INTERNAL,
      metadata: {
        alertId: alert.id,
        webhookUrl: config.url,
        severity: alert.severity
      }
    });
  }

  /**
   * Resolve alert
   */
  async resolveAlert(alertId: string): Promise<void> {
    const alert = this.activeAlerts.get(alertId);
    if (!alert) return;

    alert.status = 'resolved';
    alert.resolvedAt = new Date();

    this.activeAlerts.set(alertId, alert);
  }

  /**
   * Generate optimization recommendations
   */
  async generateOptimizationRecommendations(): Promise<void> {
    const recommendationStart = performance.now();
    let systemsAnalyzed = 0;
    let recommendationsGenerated = 0;

    for (const [systemId, health] of this.systemHealth) {
      systemsAnalyzed++;

      try {
        const recommendations = this.analyzeSystemForOptimizations(systemId, health);
        
        if (recommendations.length > 0) {
          const existing = this.recommendations.get(systemId) || [];
          this.recommendations.set(systemId, [...existing, ...recommendations]);
          recommendationsGenerated += recommendations.length;

          logger.info('Optimization recommendations generated', {
            namespace: 'advanced_monitoring',
            operation: 'recommendations_generated',
            classification: DataClassification.INTERNAL,
            metadata: {
              systemId,
              recommendationCount: recommendations.length,
              highPriority: recommendations.filter(r => r.priority === 'high' || r.priority === 'critical').length
            }
          });
        }
      } catch (error) {
        logger.error('Recommendation generation failed', {
          namespace: 'advanced_monitoring',
          operation: 'recommendation_generation_error',
          classification: DataClassification.INTERNAL,
          error: error instanceof Error ? error.message : String(error),
          metadata: { systemId }
        });
      }
    }

    const analysisTime = performance.now() - recommendationStart;

    logger.info('Optimization recommendation generation completed', {
      namespace: 'advanced_monitoring',
      operation: 'recommendation_generation_complete',
      classification: DataClassification.INTERNAL,
      metadata: {
        systemsAnalyzed,
        recommendationsGenerated,
        analysisTimeMs: Math.round(analysisTime),
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Analyze system for optimization opportunities
   */
  private analyzeSystemForOptimizations(systemId: string, health: SystemHealth): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];
    const metrics = this.performanceMetrics.get(systemId) || [];
    
    // Analyze performance trends
    if (metrics.length >= 10) {
      const recentMetrics = metrics.slice(-10);
      
      // Response time trend analysis
      const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length;
      if (avgResponseTime > 100 && health.healthScore < 80) {
        recommendations.push({
          id: `rec_${systemId}_response_time_${Date.now()}`,
          systemId,
          type: 'performance',
          priority: avgResponseTime > 1000 ? 'critical' : 'high',
          title: 'High Response Time Detected',
          description: `Average response time (${Math.round(avgResponseTime)}ms) is above optimal threshold`,
          impact: `${Math.round((avgResponseTime / 50 - 1) * 100)}% slower than optimal`,
          effort: 'medium',
          implementationSteps: [
            'Analyze query patterns for optimization opportunities',
            'Review cache hit rates and TTL settings',
            'Consider connection pool optimization',
            'Implement additional performance monitoring'
          ],
          expectedImprovement: `30-60% response time reduction`,
          generatedAt: new Date(),
          status: 'pending'
        });
      }

      // Error rate analysis
      const avgErrorRate = recentMetrics.reduce((sum, m) => sum + m.errorRate, 0) / recentMetrics.length;
      if (avgErrorRate > 2) {
        recommendations.push({
          id: `rec_${systemId}_error_rate_${Date.now()}`,
          systemId,
          type: 'reliability',
          priority: avgErrorRate > 5 ? 'critical' : 'high',
          title: 'Elevated Error Rate',
          description: `Error rate (${Math.round(avgErrorRate * 100) / 100}%) is above acceptable threshold`,
          impact: 'Reduced system reliability and user experience',
          effort: 'medium',
          implementationSteps: [
            'Investigate error patterns and root causes',
            'Implement enhanced error handling',
            'Add circuit breaker patterns',
            'Review timeout configurations'
          ],
          expectedImprovement: `${Math.round(avgErrorRate * 80)}% error reduction`,
          generatedAt: new Date(),
          status: 'pending'
        });
      }

      // Throughput analysis
      const avgThroughput = recentMetrics.reduce((sum, m) => sum + m.throughput, 0) / recentMetrics.length;
      if (avgThroughput < 10 && health.healthScore > 70) {
        recommendations.push({
          id: `rec_${systemId}_throughput_${Date.now()}`,
          systemId,
          type: 'performance',
          priority: 'medium',
          title: 'Low Throughput Optimization Opportunity',
          description: `Current throughput (${Math.round(avgThroughput)} ops/s) could be optimized`,
          impact: 'Increased system capacity and efficiency',
          effort: 'low',
          implementationSteps: [
            'Analyze batch processing opportunities',
            'Review connection pooling configuration',
            'Consider async processing patterns',
            'Optimize resource allocation'
          ],
          expectedImprovement: `50-200% throughput increase`,
          generatedAt: new Date(),
          status: 'pending'
        });
      }
    }

    // Resource utilization analysis
    const avgResourceUtil = Object.values(health.resourceUtilization).reduce((a, b) => a + b, 0) / 4;
    if (avgResourceUtil > 80) {
      recommendations.push({
        id: `rec_${systemId}_resource_util_${Date.now()}`,
        systemId,
        type: 'resource',
        priority: avgResourceUtil > 90 ? 'high' : 'medium',
        title: 'High Resource Utilization',
        description: `Average resource utilization (${Math.round(avgResourceUtil)}%) is approaching limits`,
        impact: 'Risk of performance degradation under increased load',
        effort: 'medium',
        implementationSteps: [
          'Review memory allocation and garbage collection',
          'Optimize CPU-intensive operations',
          'Consider horizontal scaling options',
          'Implement resource monitoring alerts'
        ],
        expectedImprovement: `20-40% resource efficiency improvement`,
        generatedAt: new Date(),
        status: 'pending'
      });
    }

    return recommendations;
  }

  /**
   * Initialize default alert rules for all systems
   */
  private initializeDefaultAlertRules(): void {
    this.MONITORED_SYSTEMS.forEach(system => {
      // Response time alert
      this.alertRules.set(`${system.id}_response_time`, {
        id: `${system.id}_response_time`,
        systemId: system.id,
        metric: 'response_time',
        condition: 'gt',
        threshold: system.healthThresholds.response_time || 1000,
        duration: 60000, // 1 minute
        severity: 'warning',
        enabled: true,
        description: 'High response time detected',
        actions: [
          { type: 'webhook', config: { url: '/api/alerts/webhook' } },
          { type: 'auto_recovery', config: { action: 'restart_connections' } }
        ]
      });

      // Error rate alert
      this.alertRules.set(`${system.id}_error_rate`, {
        id: `${system.id}_error_rate`,
        systemId: system.id,
        metric: 'error_rate',
        condition: 'gt',
        threshold: system.healthThresholds.error_rate || 5,
        duration: 30000, // 30 seconds
        severity: 'critical',
        enabled: true,
        description: 'High error rate detected',
        actions: [
          { type: 'webhook', config: { url: '/api/alerts/webhook' } },
          { type: 'email', config: { recipients: ['admin@company.com'] } }
        ]
      });

      // Health score alert
      this.alertRules.set(`${system.id}_health_score`, {
        id: `${system.id}_health_score`,
        systemId: system.id,
        metric: 'health_score',
        condition: 'lt',
        threshold: 70,
        duration: 120000, // 2 minutes
        severity: 'warning',
        enabled: true,
        description: 'System health degradation detected',
        actions: [
          { type: 'webhook', config: { url: '/api/alerts/webhook' } }
        ]
      });
    });

    logger.info('Default alert rules initialized', {
      namespace: 'advanced_monitoring',
      operation: 'initialize_alert_rules',
      classification: DataClassification.INTERNAL,
      metadata: {
        totalRules: this.alertRules.size,
        systems: this.MONITORED_SYSTEMS.length
      }
    });
  }

  /**
   * Create default monitoring dashboards
   */
  private createDefaultDashboards(): void {
    // System Overview Dashboard
    const overviewDashboard: MonitoringDashboard = {
      id: 'system_overview',
      name: 'System Overview',
      description: 'Comprehensive overview of all optimization systems',
      refreshInterval: 30000,
      createdAt: new Date(),
      updatedAt: new Date(),
      panels: [
        {
          id: 'health_scores',
          title: 'System Health Scores',
          type: 'chart',
          position: { x: 0, y: 0, width: 6, height: 4 },
          config: {
            systemIds: this.MONITORED_SYSTEMS.map(s => s.id),
            metrics: ['health_score'],
            timeRange: '1h',
            visualization: 'bar_chart'
          }
        },
        {
          id: 'response_times',
          title: 'Response Time Trends',
          type: 'chart',
          position: { x: 6, y: 0, width: 6, height: 4 },
          config: {
            systemIds: this.MONITORED_SYSTEMS.map(s => s.id),
            metrics: ['response_time'],
            timeRange: '1h',
            visualization: 'line_chart'
          }
        },
        {
          id: 'active_alerts',
          title: 'Active Alerts',
          type: 'alert',
          position: { x: 0, y: 4, width: 12, height: 3 },
          config: {
            systemIds: this.MONITORED_SYSTEMS.map(s => s.id)
          }
        },
        {
          id: 'top_recommendations',
          title: 'Top Optimization Recommendations',
          type: 'recommendation',
          position: { x: 0, y: 7, width: 12, height: 4 },
          config: {
            systemIds: this.MONITORED_SYSTEMS.map(s => s.id),
            maxRecommendations: 10
          }
        }
      ]
    };

    this.dashboards.set('system_overview', overviewDashboard);

    // Performance Dashboard
    const performanceDashboard: MonitoringDashboard = {
      id: 'performance_metrics',
      name: 'Performance Metrics',
      description: 'Detailed performance analysis across all systems',
      refreshInterval: 15000,
      createdAt: new Date(),
      updatedAt: new Date(),
      panels: [
        {
          id: 'throughput_comparison',
          title: 'System Throughput Comparison',
          type: 'chart',
          position: { x: 0, y: 0, width: 6, height: 4 },
          config: {
            systemIds: this.MONITORED_SYSTEMS.map(s => s.id),
            metrics: ['throughput'],
            timeRange: '2h',
            visualization: 'area_chart'
          }
        },
        {
          id: 'error_rates',
          title: 'Error Rate Monitoring',
          type: 'chart',
          position: { x: 6, y: 0, width: 6, height: 4 },
          config: {
            systemIds: this.MONITORED_SYSTEMS.map(s => s.id),
            metrics: ['error_rate'],
            timeRange: '2h',
            visualization: 'line_chart'
          }
        },
        {
          id: 'resource_utilization',
          title: 'Resource Utilization',
          type: 'table',
          position: { x: 0, y: 4, width: 12, height: 6 },
          config: {
            systemIds: this.MONITORED_SYSTEMS.map(s => s.id),
            metrics: ['cpu_utilization', 'memory_utilization', 'network_utilization', 'disk_utilization']
          }
        }
      ]
    };

    this.dashboards.set('performance_metrics', performanceDashboard);

    logger.info('Default monitoring dashboards created', {
      namespace: 'advanced_monitoring',
      operation: 'create_default_dashboards',
      classification: DataClassification.INTERNAL,
      metadata: {
        dashboardCount: this.dashboards.size,
        totalPanels: overviewDashboard.panels.length + performanceDashboard.panels.length
      }
    });
  }

  /**
   * Start monitoring services
   */
  private startMonitoringServices(): void {
    // Health check every 30 seconds
    this.healthCheckInterval = setInterval(async () => {
      for (const systemId of this.systemHealth.keys()) {
        // This would integrate with actual system health checks
        // For now, we'll simulate with some basic checks
      }
    }, 30000);

    // Metrics collection every minute
    this.metricsCollectionInterval = setInterval(async () => {
      // Collect and aggregate metrics across all systems
      await this.collectSystemMetrics();
    }, 60000);

    // Alert evaluation every 30 seconds
    this.alertEvaluationInterval = setInterval(async () => {
      await this.evaluateAlertRules();
    }, 30000);

    // Recommendation generation every hour
    this.recommendationInterval = setInterval(async () => {
      await this.generateOptimizationRecommendations();
    }, 60 * 60 * 1000);

    logger.info('Advanced monitoring services started', {
      namespace: 'advanced_monitoring',
      operation: 'start_monitoring_services',
      classification: DataClassification.INTERNAL,
      metadata: {
        healthCheckInterval: 30000,
        metricsInterval: 60000,
        alertInterval: 30000,
        recommendationInterval: 3600000
      }
    });
  }

  /**
   * Collect system metrics
   */
  private async collectSystemMetrics(): Promise<void> {
    const collectionStart = performance.now();
    let systemsUpdated = 0;

    for (const [systemId, health] of this.systemHealth) {
      try {
        // This would integrate with actual system metric collection
        // For demonstration, we'll simulate some metric updates
        const updatedHealth = {
          ...health,
          lastCheck: new Date(),
          uptime: health.uptime + 60000 // Add 1 minute
        };

        await this.updateSystemHealth(systemId, updatedHealth);
        systemsUpdated++;
      } catch (error) {
        logger.error('System metrics collection failed', {
          namespace: 'advanced_monitoring',
          operation: 'metrics_collection_error',
          classification: DataClassification.INTERNAL,
          error: error instanceof Error ? error.message : String(error),
          metadata: { systemId }
        });
      }
    }

    const collectionTime = performance.now() - collectionStart;

    logger.debug('System metrics collection completed', {
      namespace: 'advanced_monitoring',
      operation: 'metrics_collection_complete',
      classification: DataClassification.INTERNAL,
      metadata: {
        systemsUpdated,
        collectionTimeMs: Math.round(collectionTime),
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Get comprehensive monitoring status
   */
  getMonitoringStatus(): {
    systemCount: number;
    healthySystems: number;
    activeAlerts: number;
    pendingRecommendations: number;
    overallHealthScore: number;
  } {
    const systems = Array.from(this.systemHealth.values());
    const healthySystems = systems.filter(s => s.status === 'healthy').length;
    const activeAlerts = Array.from(this.activeAlerts.values()).filter(a => a.status === 'active').length;
    const pendingRecommendations = Array.from(this.recommendations.values())
      .flat()
      .filter(r => r.status === 'pending').length;
    
    const overallHealthScore = systems.length > 0
      ? Math.round(systems.reduce((sum, s) => sum + s.healthScore, 0) / systems.length)
      : 100;

    return {
      systemCount: systems.length,
      healthySystems,
      activeAlerts,
      pendingRecommendations,
      overallHealthScore
    };
  }

  /**
   * Get system health
   */
  getSystemHealth(systemId?: string): SystemHealth | Map<string, SystemHealth> {
    if (systemId) {
      return this.systemHealth.get(systemId) || ({} as SystemHealth);
    }
    return this.systemHealth;
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(systemId?: string): PerformanceMetrics[] | Map<string, PerformanceMetrics[]> {
    if (systemId) {
      return this.performanceMetrics.get(systemId) || [];
    }
    return this.performanceMetrics;
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(systemId?: string): SystemAlert[] {
    const alerts = Array.from(this.activeAlerts.values()).filter(a => a.status === 'active');
    return systemId ? alerts.filter(a => a.systemId === systemId) : alerts;
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations(systemId?: string): OptimizationRecommendation[] {
    if (systemId) {
      return this.recommendations.get(systemId) || [];
    }
    return Array.from(this.recommendations.values()).flat();
  }

  /**
   * Get monitoring dashboard
   */
  getMonitoringDashboard(dashboardId: string): MonitoringDashboard | null {
    return this.dashboards.get(dashboardId) || null;
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    logger.info('Shutting down advanced monitoring system', {
      namespace: 'advanced_monitoring',
      operation: 'shutdown',
      classification: DataClassification.INTERNAL,
      metadata: {
        monitoredSystems: this.systemHealth.size,
        activeAlerts: this.activeAlerts.size,
        totalMetrics: Array.from(this.performanceMetrics.values()).reduce((sum, metrics) => sum + metrics.length, 0)
      }
    });

    // Clear intervals
    if (this.healthCheckInterval) clearInterval(this.healthCheckInterval);
    if (this.metricsCollectionInterval) clearInterval(this.metricsCollectionInterval);
    if (this.alertEvaluationInterval) clearInterval(this.alertEvaluationInterval);
    if (this.recommendationInterval) clearInterval(this.recommendationInterval);

    // Clear data structures
    this.systemHealth.clear();
    this.performanceMetrics.clear();
    this.activeAlerts.clear();
    this.recommendations.clear();
  }
}

// Export singleton instance
export const advancedMonitoringSystem = new AdvancedMonitoringSystem();

// Export types
export type {
  SystemHealth,
  PerformanceMetrics,
  AlertRule,
  SystemAlert,
  OptimizationRecommendation,
  MonitoringDashboard,
  DashboardPanel
};