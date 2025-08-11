// domains/ai-ml/services/intelligent-automation-orchestrator.ts
import { performanceAnalyticsService } from "@/domains/analytics/services/performance-analytics-service";
import { securityMonitoringService } from "@/domains/security/services/security-monitoring-service";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";
import { advancedMonitoringSystem } from "@/lib/monitoring/advanced-monitoring-system";
import {
  aiMachineLearningAnalyticsEngine,
  MLPrediction,
  MLInsight,
} from "./ai-ml-analytics-engine";
import { dataIntegrationPipeline } from "./data-integration-pipeline";

// ====================================================================
// INTELLIGENT AUTOMATION ORCHESTRATOR
// Advanced automation coordination system providing AI-driven workflow
// optimization and cross-system intelligent automation capabilities
// ====================================================================

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  version: string;
  status: "active" | "inactive" | "paused" | "error" | "maintenance";
  priority: "low" | "medium" | "high" | "critical";
  category: "performance" | "security" | "operational" | "business" | "hybrid";

  triggers: Array<{
    id: string;
    type:
      | "event"
      | "schedule"
      | "prediction"
      | "threshold"
      | "manual"
      | "correlation";
    condition: {
      source: string;
      field: string;
      operator:
        | "eq"
        | "ne"
        | "gt"
        | "gte"
        | "lt"
        | "lte"
        | "contains"
        | "pattern";
      value: unknown;
      timeWindow?: number; // milliseconds
    };
    cooldownPeriod?: number; // milliseconds to prevent rapid triggering
  }>;

  actions: Array<{
    id: string;
    name: string;
    type:
      | "system_call"
      | "notification"
      | "data_update"
      | "workflow_trigger"
      | "ml_prediction"
      | "custom";
    target: string;
    parameters: Record<string, unknown>;
    retryPolicy?: {
      maxAttempts: number;
      backoffMs: number;
      exponentialBackoff: boolean;
    };
    rollbackAction?: {
      type: string;
      target: string;
      parameters: Record<string, unknown>;
    };
    successCriteria?: Array<{
      field: string;
      operator: string;
      value: unknown;
    }>;
  }>;

  flow: Array<{
    id: string;
    actionId: string;
    dependsOn?: string[]; // action IDs that must complete first
    parallelizable: boolean;
    continueOnFailure: boolean;
    timeout?: number; // milliseconds
    conditions?: Array<{
      field: string;
      operator: string;
      value: unknown;
    }>;
  }>;

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    tags: string[];
    businessValue: {
      category:
        | "cost_savings"
        | "performance_improvement"
        | "risk_reduction"
        | "efficiency_gain";
      estimatedValue: number;
      timeframe: string;
    };
    aiOptimization: {
      enabled: boolean;
      learningModel?: string;
      optimizationHistory: Array<{
        timestamp: Date;
        optimization: string;
        impact: number;
      }>;
    };
  };

  metrics: {
    executionCount: number;
    successRate: number;
    avgExecutionTime: number;
    lastExecuted?: Date;
    totalTimeSaved: number; // milliseconds
    businessImpact: number;
    errorCount: number;
    lastError?: {
      timestamp: Date;
      error: string;
      actionId: string;
    };
  };
}

export interface AutomationExecution {
  id: string;
  workflowId: string;
  status: "running" | "completed" | "failed" | "cancelled" | "paused";
  startTime: Date;
  endTime?: Date;
  duration?: number;
  triggeredBy: {
    type: string;
    source: string;
    data: Record<string, unknown>;
  };

  steps: Array<{
    id: string;
    actionId: string;
    actionName: string;
    status: "pending" | "running" | "completed" | "failed" | "skipped";
    startTime?: Date;
    endTime?: Date;
    duration?: number;
    result?: unknown;
    error?: string;
    retryAttempts: number;
  }>;

  context: Record<string, unknown>; // Shared data between actions
  outputs: Record<string, unknown>; // Final workflow outputs

  businessImpact: {
    category: string;
    measuredValue?: number;
    estimatedValue: number;
    actualTimeSaved?: number;
  };

  aiInsights?: {
    predictionAccuracy?: number;
    optimizationApplied?: string;
    learningUpdates?: string[];
  };
}

export interface AutomationRule {
  id: string;
  name: string;
  type: "reactive" | "predictive" | "preventive" | "optimizing";
  enabled: boolean;
  priority: number; // 1-10, higher numbers = higher priority

  conditions: Array<{
    source:
      | "performance"
      | "security"
      | "monitoring"
      | "business"
      | "ml_prediction"
      | "ai_insight";
    field: string;
    operator: string;
    value: unknown;
    weight: number; // 0-1, for weighted condition evaluation
  }>;

  actions: Array<{
    workflowId: string;
    parameters?: Record<string, unknown>;
    delayMs?: number;
    condition?: string; // JavaScript expression for conditional execution
  }>;

  aiConfig?: {
    useMLPredictions: boolean;
    confidenceThreshold: number; // 0-1
    learningEnabled: boolean;
    optimizationTarget: "speed" | "accuracy" | "cost" | "business_value";
  };

  constraints: {
    maxExecutionsPerHour?: number;
    maxConcurrentExecutions?: number;
    businessHoursOnly?: boolean;
    excludeDateRanges?: Array<{ start: Date; end: Date }>;
  };

  metrics: {
    triggeredCount: number;
    executedCount: number;
    successRate: number;
    avgResponseTime: number;
    businessValue: number;
    lastTriggered?: Date;
  };
}

export interface IntelligentDecision {
  id: string;
  timestamp: Date;
  decisionType: "automated" | "ai_assisted" | "human_required";
  context: {
    triggeredBy: string;
    relevantData: Record<string, unknown>;
    mlPredictions: MLPrediction[];
    insights: MLInsight[];
  };

  options: Array<{
    id: string;
    name: string;
    description: string;
    estimatedImpact: {
      category: string;
      value: number;
      confidence: number;
    };
    riskLevel: "low" | "medium" | "high" | "critical";
    requiredResources: string[];
    prerequisites?: string[];
  }>;

  decision: {
    selectedOptionId: string;
    confidence: number;
    reasoning: string;
    aiContribution: number; // 0-1, how much AI influenced the decision
    humanOverride?: {
      timestamp: Date;
      reason: string;
      originalOptionId: string;
    };
  };

  outcome?: {
    measuredImpact: number;
    actualCost: number;
    unexpectedEffects: string[];
    learningPoints: string[];
  };
}

export interface AutomationOrchestrationMetrics {
  totalWorkflows: number;
  activeWorkflows: number;
  totalExecutions: number;
  executionsToday: number;
  averageExecutionTime: number;
  successRate: number;

  performanceMetrics: {
    automatedResponseTime: number;
    humanInterventionRate: number;
    aiDecisionAccuracy: number;
    workflowOptimizationImpact: number;
  };

  businessMetrics: {
    totalTimeSaved: number; // hours
    costSavings: number;
    efficiencyGain: number; // percentage
    riskReduction: number;
    customerSatisfactionImpact: number;
  };

  systemHealth: {
    orchestratorUptime: number;
    avgResourceUsage: number;
    errorRate: number;
    queueDepth: number;
  };
}

class IntelligentAutomationOrchestrator {
  private workflows: Map<string, AutomationWorkflow> = new Map();
  private automationRules: Map<string, AutomationRule> = new Map();
  private activeExecutions: Map<string, AutomationExecution> = new Map();
  private executionHistory: AutomationExecution[] = [];
  private decisionHistory: IntelligentDecision[] = [];

  private isRunning = false;
  private orchestrationInterval: NodeJS.Timeout | null = null;
  private metricsInterval: NodeJS.Timeout | null = null;

  private orchestrationMetrics: AutomationOrchestrationMetrics;
  private lastTriggerCheck = new Date();

  constructor() {
    this.orchestrationMetrics = this.initializeMetrics();
    this.initializeDefaultWorkflows();
    this.initializeAutomationRules();
    this.startOrchestration();
  }

  // ====================================================================
  // INITIALIZATION METHODS
  // ====================================================================

  private initializeMetrics(): AutomationOrchestrationMetrics {
    return {
      totalWorkflows: 0,
      activeWorkflows: 0,
      totalExecutions: 0,
      executionsToday: 0,
      averageExecutionTime: 0,
      successRate: 0,
      performanceMetrics: {
        automatedResponseTime: 0,
        humanInterventionRate: 0,
        aiDecisionAccuracy: 0,
        workflowOptimizationImpact: 0,
      },
      businessMetrics: {
        totalTimeSaved: 0,
        costSavings: 0,
        efficiencyGain: 0,
        riskReduction: 0,
        customerSatisfactionImpact: 0,
      },
      systemHealth: {
        orchestratorUptime: 100,
        avgResourceUsage: 0,
        errorRate: 0,
        queueDepth: 0,
      },
    };
  }

  private initializeDefaultWorkflows(): void {
    const defaultWorkflows: Omit<AutomationWorkflow, "id">[] = [
      {
        name: "Performance Optimization Response",
        description:
          "Automated response to performance degradation predictions",
        version: "1.0.0",
        status: "active",
        priority: "high",
        category: "performance",
        triggers: [
          {
            id: "performance_regression_trigger",
            type: "prediction",
            condition: {
              source: "ml_predictions",
              field: "predictionType",
              operator: "eq",
              value: "performance",
              timeWindow: 300000,
            },
            cooldownPeriod: 600000, // 10 minutes
          },
        ],
        actions: [
          {
            id: "scale_resources",
            name: "Auto-scale Resources",
            type: "system_call",
            target: "resource_manager",
            parameters: { scaleType: "up", factor: 1.5 },
            retryPolicy: {
              maxAttempts: 3,
              backoffMs: 5000,
              exponentialBackoff: true,
            },
            rollbackAction: {
              type: "system_call",
              target: "resource_manager",
              parameters: { scaleType: "rollback" },
            },
          },
          {
            id: "notify_team",
            name: "Notify Operations Team",
            type: "notification",
            target: "ops_team",
            parameters: { priority: "high", channel: "slack" },
          },
          {
            id: "update_monitoring",
            name: "Increase Monitoring Frequency",
            type: "system_call",
            target: "monitoring_system",
            parameters: { frequency: "high", duration: 3600000 },
          },
        ],
        flow: [
          {
            id: "step1",
            actionId: "scale_resources",
            parallelizable: false,
            continueOnFailure: false,
          },
          {
            id: "step2",
            actionId: "notify_team",
            dependsOn: ["step1"],
            parallelizable: true,
            continueOnFailure: true,
          },
          {
            id: "step3",
            actionId: "update_monitoring",
            dependsOn: ["step1"],
            parallelizable: true,
            continueOnFailure: true,
          },
        ],
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "system",
          tags: ["performance", "auto-scaling", "predictive"],
          businessValue: {
            category: "performance_improvement",
            estimatedValue: 5000,
            timeframe: "per_incident",
          },
          aiOptimization: {
            enabled: true,
            optimizationHistory: [],
          },
        },
        metrics: {
          executionCount: 0,
          successRate: 0,
          avgExecutionTime: 0,
          totalTimeSaved: 0,
          businessImpact: 0,
          errorCount: 0,
        },
      },
      {
        name: "Security Threat Response",
        description: "Automated security threat containment and response",
        version: "1.0.0",
        status: "active",
        priority: "critical",
        category: "security",
        triggers: [
          {
            id: "security_threat_trigger",
            type: "event",
            condition: {
              source: "security_events",
              field: "severity",
              operator: "eq",
              value: "critical",
              timeWindow: 60000,
            },
            cooldownPeriod: 300000, // 5 minutes
          },
        ],
        actions: [
          {
            id: "isolate_threat",
            name: "Isolate Threat Source",
            type: "system_call",
            target: "security_system",
            parameters: { action: "isolate", scope: "source_ip" },
            retryPolicy: {
              maxAttempts: 2,
              backoffMs: 1000,
              exponentialBackoff: false,
            },
          },
          {
            id: "notify_security",
            name: "Alert Security Team",
            type: "notification",
            target: "security_team",
            parameters: { priority: "critical", channel: "emergency" },
          },
          {
            id: "collect_evidence",
            name: "Collect Forensic Evidence",
            type: "system_call",
            target: "forensic_collector",
            parameters: { scope: "full", retention: "90_days" },
          },
        ],
        flow: [
          {
            id: "step1",
            actionId: "isolate_threat",
            parallelizable: false,
            continueOnFailure: false,
            timeout: 30000,
          },
          {
            id: "step2",
            actionId: "notify_security",
            dependsOn: ["step1"],
            parallelizable: true,
            continueOnFailure: true,
          },
          {
            id: "step3",
            actionId: "collect_evidence",
            dependsOn: ["step1"],
            parallelizable: true,
            continueOnFailure: true,
          },
        ],
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "system",
          tags: ["security", "threat-response", "automated"],
          businessValue: {
            category: "risk_reduction",
            estimatedValue: 50000,
            timeframe: "per_incident",
          },
          aiOptimization: {
            enabled: true,
            learningModel: "threat_response_optimizer",
            optimizationHistory: [],
          },
        },
        metrics: {
          executionCount: 0,
          successRate: 0,
          avgExecutionTime: 0,
          totalTimeSaved: 0,
          businessImpact: 0,
          errorCount: 0,
        },
      },
      {
        name: "Capacity Planning Automation",
        description: "AI-driven capacity planning and resource optimization",
        version: "1.0.0",
        status: "active",
        priority: "medium",
        category: "operational",
        triggers: [
          {
            id: "capacity_prediction_trigger",
            type: "prediction",
            condition: {
              source: "ml_predictions",
              field: "predictionType",
              operator: "eq",
              value: "capacity",
              timeWindow: 3600000,
            },
            cooldownPeriod: 7200000, // 2 hours
          },
        ],
        actions: [
          {
            id: "analyze_trends",
            name: "Analyze Resource Trends",
            type: "ml_prediction",
            target: "capacity_analyzer",
            parameters: { timeframe: "7d", includeSeasonality: true },
          },
          {
            id: "generate_recommendations",
            name: "Generate Capacity Recommendations",
            type: "system_call",
            target: "capacity_planner",
            parameters: { horizon: "30d", confidenceThreshold: 0.8 },
          },
          {
            id: "create_tickets",
            name: "Create Planning Tickets",
            type: "system_call",
            target: "ticket_system",
            parameters: { assignee: "infrastructure_team", priority: "medium" },
          },
        ],
        flow: [
          {
            id: "step1",
            actionId: "analyze_trends",
            parallelizable: false,
            continueOnFailure: false,
          },
          {
            id: "step2",
            actionId: "generate_recommendations",
            dependsOn: ["step1"],
            parallelizable: false,
            continueOnFailure: false,
          },
          {
            id: "step3",
            actionId: "create_tickets",
            dependsOn: ["step2"],
            parallelizable: false,
            continueOnFailure: true,
          },
        ],
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "system",
          tags: ["capacity", "planning", "ai-driven"],
          businessValue: {
            category: "cost_savings",
            estimatedValue: 15000,
            timeframe: "monthly",
          },
          aiOptimization: {
            enabled: true,
            learningModel: "capacity_optimization",
            optimizationHistory: [],
          },
        },
        metrics: {
          executionCount: 0,
          successRate: 0,
          avgExecutionTime: 0,
          totalTimeSaved: 0,
          businessImpact: 0,
          errorCount: 0,
        },
      },
    ];

    defaultWorkflows.forEach(workflowData => {
      const workflow: AutomationWorkflow = {
        id: `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...workflowData,
      };
      this.workflows.set(workflow.id, workflow);
    });

    logger.info("Default automation workflows initialized", {
      namespace: "intelligent_automation_orchestrator",
      operation: "initialize_workflows",
      classification: DataClassification.INTERNAL,
      metadata: { workflowsCount: this.workflows.size },
    });
  }

  private initializeAutomationRules(): void {
    const defaultRules: Omit<AutomationRule, "id">[] = [
      {
        name: "High CPU Usage Response",
        type: "reactive",
        enabled: true,
        priority: 8,
        conditions: [
          {
            source: "performance",
            field: "cpuUsage",
            operator: "gt",
            value: 85,
            weight: 0.8,
          },
          {
            source: "monitoring",
            field: "healthScore",
            operator: "lt",
            value: 70,
            weight: 0.6,
          },
        ],
        actions: [
          {
            workflowId:
              Array.from(this.workflows.values()).find(w =>
                w.name.includes("Performance")
              )?.id || "",
            parameters: { urgency: "high" },
            delayMs: 0,
          },
        ],
        aiConfig: {
          useMLPredictions: true,
          confidenceThreshold: 0.7,
          learningEnabled: true,
          optimizationTarget: "speed",
        },
        constraints: {
          maxExecutionsPerHour: 5,
          maxConcurrentExecutions: 2,
          businessHoursOnly: false,
        },
        metrics: {
          triggeredCount: 0,
          executedCount: 0,
          successRate: 0,
          avgResponseTime: 0,
          businessValue: 0,
        },
      },
      {
        name: "Security Anomaly Detection",
        type: "predictive",
        enabled: true,
        priority: 9,
        conditions: [
          {
            source: "ai_insight",
            field: "type",
            operator: "eq",
            value: "anomaly_identification",
            weight: 0.9,
          },
          {
            source: "security",
            field: "riskScore",
            operator: "gt",
            value: 70,
            weight: 0.8,
          },
        ],
        actions: [
          {
            workflowId:
              Array.from(this.workflows.values()).find(w =>
                w.name.includes("Security")
              )?.id || "",
            parameters: { responseLevel: "elevated" },
            delayMs: 0,
          },
        ],
        aiConfig: {
          useMLPredictions: true,
          confidenceThreshold: 0.8,
          learningEnabled: true,
          optimizationTarget: "accuracy",
        },
        constraints: {
          maxExecutionsPerHour: 10,
          maxConcurrentExecutions: 3,
          businessHoursOnly: false,
        },
        metrics: {
          triggeredCount: 0,
          executedCount: 0,
          successRate: 0,
          avgResponseTime: 0,
          businessValue: 0,
        },
      },
      {
        name: "Cost Optimization Opportunity",
        type: "optimizing",
        enabled: true,
        priority: 6,
        conditions: [
          {
            source: "ai_insight",
            field: "type",
            operator: "eq",
            value: "optimization_opportunity",
            weight: 0.7,
          },
          {
            source: "business",
            field: "costSavingsPotential",
            operator: "gt",
            value: 1000,
            weight: 0.8,
          },
        ],
        actions: [
          {
            workflowId:
              Array.from(this.workflows.values()).find(w =>
                w.name.includes("Capacity")
              )?.id || "",
            parameters: { optimizationType: "cost" },
            delayMs: 300000, // 5 minute delay for analysis
          },
        ],
        aiConfig: {
          useMLPredictions: true,
          confidenceThreshold: 0.75,
          learningEnabled: true,
          optimizationTarget: "cost",
        },
        constraints: {
          maxExecutionsPerHour: 2,
          maxConcurrentExecutions: 1,
          businessHoursOnly: true,
        },
        metrics: {
          triggeredCount: 0,
          executedCount: 0,
          successRate: 0,
          avgResponseTime: 0,
          businessValue: 0,
        },
      },
    ];

    defaultRules.forEach(ruleData => {
      const rule: AutomationRule = {
        id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...ruleData,
      };
      this.automationRules.set(rule.id, rule);
    });

    logger.info("Default automation rules initialized", {
      namespace: "intelligent_automation_orchestrator",
      operation: "initialize_rules",
      classification: DataClassification.INTERNAL,
      metadata: { rulesCount: this.automationRules.size },
    });
  }

  // ====================================================================
  // ORCHESTRATION CORE METHODS
  // ====================================================================

  private startOrchestration(): void {
    if (this.isRunning) return;

    this.isRunning = true;

    // Main orchestration loop - check for triggers every 10 seconds
    this.orchestrationInterval = setInterval(() => {
      this.processOrchestrationCycle();
    }, 10000);

    // Metrics collection - every 30 seconds
    this.metricsInterval = setInterval(() => {
      this.collectMetrics();
    }, 30000);

    logger.info("Intelligent Automation Orchestrator started", {
      namespace: "intelligent_automation_orchestrator",
      operation: "start_orchestration",
      classification: DataClassification.INTERNAL,
      metadata: {
        workflowsCount: this.workflows.size,
        rulesCount: this.automationRules.size,
      },
    });
  }

  private async processOrchestrationCycle(): Promise<void> {
    try {
      const cycleStartTime = Date.now();

      logger.debug("Starting orchestration cycle", {
        namespace: "intelligent_automation_orchestrator",
        operation: "orchestration_cycle_start",
        classification: DataClassification.INTERNAL,
      });

      // 1. Check for workflow trigger conditions
      await this.checkWorkflowTriggers();

      // 2. Process automation rules
      await this.processAutomationRules();

      // 3. Monitor active executions
      await this.monitorActiveExecutions();

      // 4. Clean up completed executions
      await this.cleanupCompletedExecutions();

      // 5. Apply AI optimizations
      await this.applyAIOptimizations();

      const cycleDuration = Date.now() - cycleStartTime;

      logger.debug("Orchestration cycle completed", {
        namespace: "intelligent_automation_orchestrator",
        operation: "orchestration_cycle_complete",
        classification: DataClassification.INTERNAL,
        metadata: {
          cycleDurationMs: cycleDuration,
          activeExecutions: this.activeExecutions.size,
        },
      });
    } catch (error) {
      logger.error("Orchestration cycle failed", {
        namespace: "intelligent_automation_orchestrator",
        operation: "orchestration_cycle_error",
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  private async checkWorkflowTriggers(): Promise<void> {
    try {
      // Get recent data for trigger evaluation
      const recentData = await this.collectTriggerEvaluationData();
      const mlPredictions =
        aiMachineLearningAnalyticsEngine.getRecentPredictions(50);
      const insights = aiMachineLearningAnalyticsEngine.getIntelligentInsights({
        limit: 20,
      });

      for (const [workflowId, workflow] of this.workflows) {
        if (workflow.status !== "active") continue;

        // Check each trigger
        for (const trigger of workflow.triggers) {
          const shouldTrigger = await this.evaluateTriggerCondition(
            trigger,
            recentData,
            mlPredictions,
            insights
          );

          if (shouldTrigger) {
            await this.triggerWorkflow(workflowId, {
              triggerId: trigger.id,
              triggerType: trigger.type,
              data: recentData,
            });
          }
        }
      }
    } catch (error) {
      logger.error("Failed to check workflow triggers", {
        namespace: "intelligent_automation_orchestrator",
        operation: "check_triggers_error",
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  private async processAutomationRules(): Promise<void> {
    try {
      // Get current system state
      const systemState = await this.getCurrentSystemState();
      const mlPredictions =
        aiMachineLearningAnalyticsEngine.getRecentPredictions(10);
      const insights = aiMachineLearningAnalyticsEngine.getIntelligentInsights({
        limit: 10,
      });

      // Sort rules by priority
      const sortedRules = Array.from(this.automationRules.values())
        .filter(rule => rule.enabled)
        .sort((a, b) => b.priority - a.priority);

      for (const rule of sortedRules) {
        // Check rule constraints
        if (!this.checkRuleConstraints(rule)) continue;

        // Evaluate rule conditions
        const conditionsMet = await this.evaluateRuleConditions(
          rule,
          systemState,
          mlPredictions,
          insights
        );

        if (conditionsMet) {
          await this.executeRuleActions(rule, systemState);

          // Update rule metrics
          rule.metrics.triggeredCount++;
          rule.metrics.lastTriggered = new Date();
        }
      }
    } catch (error) {
      logger.error("Failed to process automation rules", {
        namespace: "intelligent_automation_orchestrator",
        operation: "process_rules_error",
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // ====================================================================
  // WORKFLOW EXECUTION METHODS
  // ====================================================================

  public async triggerWorkflow(
    workflowId: string,
    trigger: {
      triggerId: string;
      triggerType: string;
      data: Record<string, unknown>;
    }
  ): Promise<string | null> {
    try {
      const workflow = this.workflows.get(workflowId);
      if (!workflow) {
        throw new Error(`Workflow ${workflowId} not found`);
      }

      if (workflow.status !== "active") {
        logger.warn("Attempted to trigger inactive workflow", {
          namespace: "intelligent_automation_orchestrator",
          operation: "trigger_workflow_inactive",
          classification: DataClassification.INTERNAL,
          metadata: { workflowId, status: workflow.status },
        });
        return null;
      }

      // Check cooldown period
      const lastExecution = this.getLastWorkflowExecution(workflowId);
      const triggerConfig = workflow.triggers.find(
        t => t.id === trigger.triggerId
      );

      if (lastExecution && triggerConfig?.cooldownPeriod) {
        const timeSinceLastExecution =
          Date.now() - lastExecution.startTime.getTime();
        if (timeSinceLastExecution < triggerConfig.cooldownPeriod) {
          logger.debug("Workflow trigger in cooldown period", {
            namespace: "intelligent_automation_orchestrator",
            operation: "trigger_workflow_cooldown",
            classification: DataClassification.INTERNAL,
            metadata: {
              workflowId,
              cooldownRemainingMs:
                triggerConfig.cooldownPeriod - timeSinceLastExecution,
            },
          });
          return null;
        }
      }

      // Create execution instance
      const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const execution: AutomationExecution = {
        id: executionId,
        workflowId,
        status: "running",
        startTime: new Date(),
        triggeredBy: trigger,
        steps: workflow.actions.map(action => ({
          id: `step_${action.id}`,
          actionId: action.id,
          actionName: action.name,
          status: "pending",
          retryAttempts: 0,
        })),
        context: { ...trigger.data },
        outputs: {},
        businessImpact: {
          category: workflow.metadata.businessValue.category,
          estimatedValue: workflow.metadata.businessValue.estimatedValue,
        },
      };

      this.activeExecutions.set(executionId, execution);

      logger.info("Workflow execution started", {
        namespace: "intelligent_automation_orchestrator",
        operation: "workflow_execution_start",
        classification: DataClassification.INTERNAL,
        metadata: {
          workflowId,
          executionId,
          workflowName: workflow.name,
          triggeredBy: trigger.triggerType,
        },
      });

      // Start executing the workflow
      this.executeWorkflowSteps(executionId);

      return executionId;
    } catch (error) {
      logger.error("Failed to trigger workflow", {
        namespace: "intelligent_automation_orchestrator",
        operation: "trigger_workflow_error",
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: { workflowId },
      });
      return null;
    }
  }

  private async executeWorkflowSteps(executionId: string): Promise<void> {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) return;

    const workflow = this.workflows.get(execution.workflowId);
    if (!workflow) return;

    try {
      // Execute steps according to the workflow flow
      const flowSteps = workflow.flow.sort((a, b) => {
        // Sort by dependencies - steps without dependencies first
        if (!a.dependsOn || a.dependsOn.length === 0) return -1;
        if (!b.dependsOn || b.dependsOn.length === 0) return 1;
        return 0;
      });

      for (const flowStep of flowSteps) {
        // Check if dependencies are completed
        if (flowStep.dependsOn && flowStep.dependsOn.length > 0) {
          const dependenciesMet = flowStep.dependsOn.every(depId => {
            const depStep = execution.steps.find(s => s.id === `step_${depId}`);
            return depStep && depStep.status === "completed";
          });

          if (!dependenciesMet) {
            // Skip this step for now, will be processed in next iteration
            continue;
          }
        }

        // Find the corresponding execution step
        const executionStep = execution.steps.find(
          s => s.actionId === flowStep.actionId
        );
        if (!executionStep || executionStep.status !== "pending") continue;

        // Check flow conditions
        if (flowStep.conditions && flowStep.conditions.length > 0) {
          const conditionsMet = this.evaluateFlowConditions(
            flowStep.conditions,
            execution.context
          );
          if (!conditionsMet) {
            executionStep.status = "skipped";
            continue;
          }
        }

        // Execute the step
        await this.executeWorkflowStep(executionId, executionStep, flowStep);
      }

      // Check if all steps are completed
      const allStepsCompleted = execution.steps.every(
        step =>
          step.status === "completed" ||
          step.status === "skipped" ||
          (step.status === "failed" &&
            workflow.flow.find(f => f.actionId === step.actionId)
              ?.continueOnFailure)
      );

      if (allStepsCompleted) {
        await this.completeWorkflowExecution(executionId);
      }
    } catch (error) {
      await this.failWorkflowExecution(executionId, error as Error);
    }
  }

  private async executeWorkflowStep(
    executionId: string,
    step: AutomationExecution["steps"][0],
    flowConfig: AutomationWorkflow["flow"][0]
  ): Promise<void> {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) return;

    const workflow = this.workflows.get(execution.workflowId);
    if (!workflow) return;

    const action = workflow.actions.find(a => a.id === step.actionId);
    if (!action) return;

    const stepStartTime = Date.now();

    try {
      step.status = "running";
      step.startTime = new Date();

      logger.debug("Executing workflow step", {
        namespace: "intelligent_automation_orchestrator",
        operation: "execute_workflow_step",
        classification: DataClassification.INTERNAL,
        metadata: {
          executionId,
          stepId: step.id,
          actionType: action.type,
          actionName: action.name,
        },
      });

      // Execute the action based on its type
      let result: unknown;

      switch (action.type) {
        case "system_call":
          result = await this.executeSystemCall(action, execution.context);
          break;

        case "notification":
          result = await this.executeNotification(action, execution.context);
          break;

        case "data_update":
          result = await this.executeDataUpdate(action, execution.context);
          break;

        case "workflow_trigger":
          result = await this.executeWorkflowTrigger(action, execution.context);
          break;

        case "ml_prediction":
          result = await this.executeMLPrediction(action, execution.context);
          break;

        case "custom":
          result = await this.executeCustomAction(action, execution.context);
          break;

        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }

      // Validate success criteria if defined
      if (action.successCriteria && action.successCriteria.length > 0) {
        const successCriteriaMet = this.evaluateSuccessCriteria(
          action.successCriteria,
          result
        );
        if (!successCriteriaMet) {
          throw new Error("Success criteria not met");
        }
      }

      step.status = "completed";
      step.endTime = new Date();
      step.duration = Date.now() - stepStartTime;
      step.result = result;

      // Store result in execution context for use by subsequent steps
      execution.context[`${step.actionId}_result`] = result;

      logger.debug("Workflow step completed successfully", {
        namespace: "intelligent_automation_orchestrator",
        operation: "execute_workflow_step_success",
        classification: DataClassification.INTERNAL,
        metadata: {
          executionId,
          stepId: step.id,
          durationMs: step.duration,
        },
      });
    } catch (error) {
      step.status = "failed";
      step.endTime = new Date();
      step.duration = Date.now() - stepStartTime;
      step.error = error instanceof Error ? error.message : "Unknown error";

      logger.error("Workflow step failed", {
        namespace: "intelligent_automation_orchestrator",
        operation: "execute_workflow_step_error",
        classification: DataClassification.INTERNAL,
        error: step.error,
        metadata: {
          executionId,
          stepId: step.id,
          retryAttempts: step.retryAttempts,
          durationMs: step.duration,
        },
      });

      // Handle retry logic
      if (
        action.retryPolicy &&
        step.retryAttempts < action.retryPolicy.maxAttempts
      ) {
        step.retryAttempts++;

        // Calculate backoff delay
        const baseDelay = action.retryPolicy.backoffMs;
        const delay = action.retryPolicy.exponentialBackoff
          ? baseDelay * Math.pow(2, step.retryAttempts - 1)
          : baseDelay;

        setTimeout(() => {
          step.status = "pending";
          step.error = undefined;
          this.executeWorkflowStep(executionId, step, flowConfig);
        }, delay);

        return;
      }

      // Handle rollback if defined
      if (action.rollbackAction) {
        try {
          await this.executeRollbackAction(
            action.rollbackAction,
            execution.context
          );
          logger.info("Rollback action executed successfully", {
            namespace: "intelligent_automation_orchestrator",
            operation: "rollback_action_success",
            classification: DataClassification.INTERNAL,
            metadata: { executionId, stepId: step.id },
          });
        } catch (rollbackError) {
          logger.error("Rollback action failed", {
            namespace: "intelligent_automation_orchestrator",
            operation: "rollback_action_error",
            classification: DataClassification.INTERNAL,
            error:
              rollbackError instanceof Error
                ? rollbackError.message
                : "Unknown rollback error",
            metadata: { executionId, stepId: step.id },
          });
        }
      }

      // Check if workflow should continue on failure
      if (!flowConfig.continueOnFailure) {
        await this.failWorkflowExecution(executionId, error as Error);
      }
    }
  }

  // ====================================================================
  // ACTION EXECUTION METHODS
  // ====================================================================

  private async executeSystemCall(
    action: AutomationWorkflow["actions"][0],
    context: Record<string, unknown>
  ): Promise<unknown> {
    try {
      // Resolve parameters from context
      const resolvedParameters = this.resolveParameters(
        action.parameters,
        context
      );

      logger.debug("Executing system call", {
        namespace: "intelligent_automation_orchestrator",
        operation: "execute_system_call",
        classification: DataClassification.INTERNAL,
        metadata: {
          target: action.target,
          parameters: Object.keys(resolvedParameters),
        },
      });

      // Route to appropriate system based on target
      switch (action.target) {
        case "resource_manager":
          return await this.executeResourceManagement(resolvedParameters);

        case "monitoring_system":
          return await this.executeMonitoringAction(resolvedParameters);

        case "security_system":
          return await this.executeSecurityAction(resolvedParameters);

        case "capacity_planner":
          return await this.executeCapacityPlanning(resolvedParameters);

        case "ticket_system":
          return await this.executeTicketCreation(resolvedParameters);

        default:
          throw new Error(`Unknown system call target: ${action.target}`);
      }
    } catch (error) {
      logger.error("System call execution failed", {
        namespace: "intelligent_automation_orchestrator",
        operation: "execute_system_call_error",
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: { target: action.target },
      });
      throw error;
    }
  }

  private async executeNotification(
    action: AutomationWorkflow["actions"][0],
    context: Record<string, unknown>
  ): Promise<unknown> {
    try {
      const resolvedParameters = this.resolveParameters(
        action.parameters,
        context
      );

      logger.info("Sending notification", {
        namespace: "intelligent_automation_orchestrator",
        operation: "execute_notification",
        classification: DataClassification.INTERNAL,
        metadata: {
          target: action.target,
          priority: resolvedParameters.priority,
          channel: resolvedParameters.channel,
        },
      });

      // Simulate notification sending
      const notification = {
        id: `notif_${Date.now()}`,
        target: action.target,
        message: `Automation notification: ${action.name}`,
        priority: resolvedParameters.priority || "medium",
        channel: resolvedParameters.channel || "email",
        sentAt: new Date(),
        context: context,
      };

      // In production, would integrate with actual notification systems
      return notification;
    } catch (error) {
      logger.error("Notification execution failed", {
        namespace: "intelligent_automation_orchestrator",
        operation: "execute_notification_error",
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: { target: action.target },
      });
      throw error;
    }
  }

  private async executeDataUpdate(
    action: AutomationWorkflow["actions"][0],
    context: Record<string, unknown>
  ): Promise<unknown> {
    try {
      const resolvedParameters = this.resolveParameters(
        action.parameters,
        context
      );

      logger.debug("Executing data update", {
        namespace: "intelligent_automation_orchestrator",
        operation: "execute_data_update",
        classification: DataClassification.INTERNAL,
        metadata: { target: action.target },
      });

      // Simulate data update
      const updateResult = {
        id: `update_${Date.now()}`,
        target: action.target,
        parameters: resolvedParameters,
        updatedAt: new Date(),
        recordsAffected: Math.floor(Math.random() * 100) + 1,
      };

      return updateResult;
    } catch (error) {
      logger.error("Data update execution failed", {
        namespace: "intelligent_automation_orchestrator",
        operation: "execute_data_update_error",
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: { target: action.target },
      });
      throw error;
    }
  }

  private async executeWorkflowTrigger(
    action: AutomationWorkflow["actions"][0],
    context: Record<string, unknown>
  ): Promise<unknown> {
    try {
      const resolvedParameters = this.resolveParameters(
        action.parameters,
        context
      );
      const targetWorkflowId = action.target;

      logger.info("Triggering child workflow", {
        namespace: "intelligent_automation_orchestrator",
        operation: "execute_workflow_trigger",
        classification: DataClassification.INTERNAL,
        metadata: { targetWorkflowId },
      });

      const childExecutionId = await this.triggerWorkflow(targetWorkflowId, {
        triggerId: "parent_workflow",
        triggerType: "workflow_trigger",
        data: { ...context, ...resolvedParameters },
      });

      return {
        childExecutionId,
        triggeredAt: new Date(),
        targetWorkflowId,
      };
    } catch (error) {
      logger.error("Workflow trigger execution failed", {
        namespace: "intelligent_automation_orchestrator",
        operation: "execute_workflow_trigger_error",
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: { target: action.target },
      });
      throw error;
    }
  }

  private async executeMLPrediction(
    action: AutomationWorkflow["actions"][0],
    context: Record<string, unknown>
  ): Promise<unknown> {
    try {
      const resolvedParameters = this.resolveParameters(
        action.parameters,
        context
      );

      logger.debug("Executing ML prediction", {
        namespace: "intelligent_automation_orchestrator",
        operation: "execute_ml_prediction",
        classification: DataClassification.INTERNAL,
        metadata: { target: action.target },
      });

      // Get predictions from AI/ML engine
      const predictions =
        await aiMachineLearningAnalyticsEngine.generatePredictions(
          (resolvedParameters.timeframe as "1h" | "24h" | "7d" | "30d") || "24h"
        );

      // Filter predictions relevant to the action target
      const relevantPredictions = predictions.filter(p =>
        action.target === "capacity_analyzer"
          ? p.predictionType === "capacity"
          : action.target === "security_analyzer"
            ? p.predictionType === "security"
            : action.target === "performance_analyzer"
              ? p.predictionType === "performance"
              : true
      );

      return {
        predictions: relevantPredictions,
        predictionCount: relevantPredictions.length,
        averageConfidence:
          relevantPredictions.length > 0
            ? relevantPredictions.reduce((sum, p) => sum + p.confidence, 0) /
              relevantPredictions.length
            : 0,
        generatedAt: new Date(),
      };
    } catch (error) {
      logger.error("ML prediction execution failed", {
        namespace: "intelligent_automation_orchestrator",
        operation: "execute_ml_prediction_error",
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: { target: action.target },
      });
      throw error;
    }
  }

  private async executeCustomAction(
    action: AutomationWorkflow["actions"][0],
    context: Record<string, unknown>
  ): Promise<unknown> {
    try {
      const resolvedParameters = this.resolveParameters(
        action.parameters,
        context
      );

      logger.debug("Executing custom action", {
        namespace: "intelligent_automation_orchestrator",
        operation: "execute_custom_action",
        classification: DataClassification.INTERNAL,
        metadata: { target: action.target },
      });

      // Simulate custom action execution
      const customResult = {
        id: `custom_${Date.now()}`,
        target: action.target,
        parameters: resolvedParameters,
        executedAt: new Date(),
        result: "Custom action completed successfully",
      };

      return customResult;
    } catch (error) {
      logger.error("Custom action execution failed", {
        namespace: "intelligent_automation_orchestrator",
        operation: "execute_custom_action_error",
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: { target: action.target },
      });
      throw error;
    }
  }

  // ====================================================================
  // SYSTEM-SPECIFIC ACTION METHODS
  // ====================================================================

  private async executeResourceManagement(
    parameters: Record<string, unknown>
  ): Promise<unknown> {
    const scaleType = parameters.scaleType as string;
    const factor = (parameters.factor as number) || 1.0;

    logger.info("Executing resource management action", {
      namespace: "intelligent_automation_orchestrator",
      operation: "execute_resource_management",
      classification: DataClassification.INTERNAL,
      metadata: { scaleType, factor },
    });

    // Simulate resource scaling
    return {
      action: scaleType,
      scaleFactor: factor,
      previousCapacity: 100,
      newCapacity:
        scaleType === "up"
          ? Math.round(100 * factor)
          : scaleType === "down"
            ? Math.round(100 / factor)
            : 100,
      estimatedCost:
        scaleType === "up"
          ? (factor - 1) * 1000
          : scaleType === "down"
            ? (1 - 1 / factor) * -1000
            : 0,
      executedAt: new Date(),
    };
  }

  private async executeMonitoringAction(
    parameters: Record<string, unknown>
  ): Promise<unknown> {
    const frequency = parameters.frequency as string;
    const duration = parameters.duration as number;

    logger.info("Executing monitoring action", {
      namespace: "intelligent_automation_orchestrator",
      operation: "execute_monitoring_action",
      classification: DataClassification.INTERNAL,
      metadata: { frequency, duration },
    });

    // Simulate monitoring frequency adjustment
    return {
      action: "monitoring_frequency_adjustment",
      newFrequency: frequency,
      duration: duration,
      affectedSystems: ["api_gateway", "database", "auth_system"],
      executedAt: new Date(),
    };
  }

  private async executeSecurityAction(
    parameters: Record<string, unknown>
  ): Promise<unknown> {
    const action = parameters.action as string;
    const scope = parameters.scope as string;

    logger.info("Executing security action", {
      namespace: "intelligent_automation_orchestrator",
      operation: "execute_security_action",
      classification: DataClassification.INTERNAL,
      metadata: { action, scope },
    });

    // Simulate security action
    return {
      action: action,
      scope: scope,
      affectedResources:
        action === "isolate" ? ["suspicious_ip_123.456.789.0"] : [],
      riskReduction: 75, // percentage
      executedAt: new Date(),
    };
  }

  private async executeCapacityPlanning(
    parameters: Record<string, unknown>
  ): Promise<unknown> {
    const horizon = parameters.horizon as string;
    const confidenceThreshold = parameters.confidenceThreshold as number;

    logger.info("Executing capacity planning", {
      namespace: "intelligent_automation_orchestrator",
      operation: "execute_capacity_planning",
      classification: DataClassification.INTERNAL,
      metadata: { horizon, confidenceThreshold },
    });

    // Simulate capacity planning analysis
    return {
      horizon: horizon,
      recommendations: [
        {
          system: "database",
          currentCapacity: 80,
          recommendedCapacity: 120,
          confidence: 0.85,
          estimatedCost: 2000,
          timeline: "2 weeks",
        },
        {
          system: "api_gateway",
          currentCapacity: 65,
          recommendedCapacity: 90,
          confidence: 0.78,
          estimatedCost: 1500,
          timeline: "3 weeks",
        },
      ],
      totalInvestment: 3500,
      expectedROI: 1.8,
      generatedAt: new Date(),
    };
  }

  private async executeTicketCreation(
    parameters: Record<string, unknown>
  ): Promise<unknown> {
    const assignee = parameters.assignee as string;
    const priority = parameters.priority as string;

    logger.info("Creating automation tickets", {
      namespace: "intelligent_automation_orchestrator",
      operation: "execute_ticket_creation",
      classification: DataClassification.INTERNAL,
      metadata: { assignee, priority },
    });

    // Simulate ticket creation
    return {
      tickets: [
        {
          id: `TICKET-${Date.now()}`,
          title: "Automated Capacity Planning Review",
          assignee: assignee,
          priority: priority,
          description:
            "AI-generated capacity planning recommendations require review",
          createdAt: new Date(),
          estimatedEffort: "4 hours",
        },
      ],
      totalTickets: 1,
    };
  }

  private async executeRollbackAction(
    rollbackAction: NonNullable<
      AutomationWorkflow["actions"][0]["rollbackAction"]
    >,
    context: Record<string, unknown>
  ): Promise<unknown> {
    logger.info("Executing rollback action", {
      namespace: "intelligent_automation_orchestrator",
      operation: "execute_rollback_action",
      classification: DataClassification.INTERNAL,
      metadata: {
        rollbackType: rollbackAction.type,
        target: rollbackAction.target,
      },
    });

    const resolvedParameters = this.resolveParameters(
      rollbackAction.parameters,
      context
    );

    switch (rollbackAction.type) {
      case "system_call":
        return await this.executeResourceManagement(resolvedParameters);
      default:
        return { rollbackCompleted: true, executedAt: new Date() };
    }
  }

  // ====================================================================
  // EVALUATION & DECISION METHODS
  // ====================================================================

  private async evaluateTriggerCondition(
    trigger: AutomationWorkflow["triggers"][0],
    recentData: Record<string, unknown>[],
    mlPredictions: MLPrediction[],
    insights: MLInsight[]
  ): Promise<boolean> {
    try {
      switch (trigger.type) {
        case "event":
          return this.evaluateEventTrigger(trigger, recentData);
        case "prediction":
          return this.evaluatePredictionTrigger(trigger, mlPredictions);
        case "schedule":
          return this.evaluateScheduleTrigger(trigger);
        case "threshold":
          return this.evaluateThresholdTrigger(trigger, recentData);
        case "correlation":
          return this.evaluateCorrelationTrigger(trigger, recentData, insights);
        default:
          return false;
      }
    } catch (error) {
      logger.error("Failed to evaluate trigger condition", {
        namespace: "intelligent_automation_orchestrator",
        operation: "evaluate_trigger_condition_error",
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: { triggerId: trigger.id, triggerType: trigger.type },
      });
      return false;
    }
  }

  private evaluateEventTrigger(
    trigger: AutomationWorkflow["triggers"][0],
    recentData: Record<string, unknown>[]
  ): boolean {
    const timeWindow = trigger.condition.timeWindow || 300000; // 5 minutes default
    const cutoffTime = new Date(Date.now() - timeWindow);

    const relevantData = recentData.filter(
      data =>
        data.source === trigger.condition.source &&
        new Date(data.timestamp as string) >= cutoffTime
    );

    return relevantData.some(data =>
      this.evaluateCondition(
        data[trigger.condition.field],
        trigger.condition.operator,
        trigger.condition.value
      )
    );
  }

  private evaluatePredictionTrigger(
    trigger: AutomationWorkflow["triggers"][0],
    predictions: MLPrediction[]
  ): boolean {
    const timeWindow = trigger.condition.timeWindow || 3600000; // 1 hour default
    const cutoffTime = new Date(Date.now() - timeWindow);

    const relevantPredictions = predictions.filter(
      prediction => prediction.timestamp >= cutoffTime
    );

    return relevantPredictions.some(prediction =>
      this.evaluateCondition(
        prediction[trigger.condition.field as keyof MLPrediction],
        trigger.condition.operator,
        trigger.condition.value
      )
    );
  }

  private evaluateScheduleTrigger(
    trigger: AutomationWorkflow["triggers"][0]
  ): boolean {
    // Simplified schedule evaluation (would be more sophisticated in production)
    const now = new Date();
    const schedule = trigger.condition.value as string;

    // Basic schedule patterns
    if (schedule === "hourly") {
      return now.getMinutes() === 0;
    } else if (schedule === "daily") {
      return now.getHours() === 0 && now.getMinutes() === 0;
    }

    return false;
  }

  private evaluateThresholdTrigger(
    trigger: AutomationWorkflow["triggers"][0],
    recentData: Record<string, unknown>[]
  ): boolean {
    const timeWindow = trigger.condition.timeWindow || 300000;
    const cutoffTime = new Date(Date.now() - timeWindow);

    const relevantData = recentData.filter(
      data =>
        data.source === trigger.condition.source &&
        new Date(data.timestamp as string) >= cutoffTime
    );

    if (relevantData.length === 0) return false;

    const values = relevantData
      .map(data => data[trigger.condition.field])
      .filter(value => typeof value === "number") as number[];

    if (values.length === 0) return false;

    const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
    return this.evaluateCondition(
      avgValue,
      trigger.condition.operator,
      trigger.condition.value
    );
  }

  private evaluateCorrelationTrigger(
    trigger: AutomationWorkflow["triggers"][0],
    recentData: Record<string, unknown>[],
    insights: MLInsight[]
  ): boolean {
    // Look for correlation insights
    const correlationInsights = insights.filter(
      insight =>
        insight.type === "pattern_detection" &&
        insight.evidence.correlations.length > 0
    );

    return (
      correlationInsights.length > 0 &&
      correlationInsights.some(insight => insight.confidence > 0.8)
    );
  }

  private evaluateCondition(
    fieldValue: unknown,
    operator: string,
    expectedValue: unknown
  ): boolean {
    switch (operator) {
      case "eq":
        return fieldValue === expectedValue;
      case "ne":
        return fieldValue !== expectedValue;
      case "gt":
        return (fieldValue as number) > (expectedValue as number);
      case "gte":
        return (fieldValue as number) >= (expectedValue as number);
      case "lt":
        return (fieldValue as number) < (expectedValue as number);
      case "lte":
        return (fieldValue as number) <= (expectedValue as number);
      case "contains":
        return String(fieldValue).includes(String(expectedValue));
      case "pattern":
        return new RegExp(String(expectedValue)).test(String(fieldValue));
      default:
        return false;
    }
  }

  private evaluateFlowConditions(
    conditions: Array<{ field: string; operator: string; value: unknown }>,
    context: Record<string, unknown>
  ): boolean {
    return conditions.every(condition =>
      this.evaluateCondition(
        context[condition.field],
        condition.operator,
        condition.value
      )
    );
  }

  private evaluateSuccessCriteria(
    criteria: Array<{ field: string; operator: string; value: unknown }>,
    result: unknown
  ): boolean {
    if (!result || typeof result !== "object") return false;

    const resultObj = result as Record<string, unknown>;
    return criteria.every(criterion =>
      this.evaluateCondition(
        resultObj[criterion.field],
        criterion.operator,
        criterion.value
      )
    );
  }

  private async evaluateRuleConditions(
    rule: AutomationRule,
    systemState: Record<string, unknown>,
    predictions: MLPrediction[],
    insights: MLInsight[]
  ): Promise<boolean> {
    let totalWeight = 0;
    let metConditionsWeight = 0;

    for (const condition of rule.conditions) {
      totalWeight += condition.weight;

      let conditionData: unknown;

      switch (condition.source) {
        case "performance":
        case "security":
        case "monitoring":
        case "business":
          conditionData = systemState[`${condition.source}_${condition.field}`];
          break;
        case "ml_prediction":
          const relevantPrediction = predictions.find(
            p => p[condition.field as keyof MLPrediction] !== undefined
          );
          conditionData =
            relevantPrediction?.[condition.field as keyof MLPrediction];
          break;
        case "ai_insight":
          const relevantInsight = insights.find(
            i => i[condition.field as keyof MLInsight] !== undefined
          );
          conditionData = relevantInsight?.[condition.field as keyof MLInsight];
          break;
      }

      if (
        this.evaluateCondition(
          conditionData,
          condition.operator,
          condition.value
        )
      ) {
        metConditionsWeight += condition.weight;
      }
    }

    // Rule triggers if weighted conditions meet threshold (70%)
    return metConditionsWeight / totalWeight >= 0.7;
  }

  // ====================================================================
  // DATA COLLECTION METHODS
  // ====================================================================

  private async collectTriggerEvaluationData(): Promise<
    Record<string, unknown>[]
  > {
    try {
      const evaluationData: Record<string, unknown>[] = [];

      // Get recent data from all sources
      const recentUnifiedData = dataIntegrationPipeline.getRecentData(100);

      for (const record of recentUnifiedData) {
        evaluationData.push({
          source: record.sourceType,
          timestamp: record.timestamp,
          ...record.data,
        });
      }

      return evaluationData;
    } catch (error) {
      logger.error("Failed to collect trigger evaluation data", {
        namespace: "intelligent_automation_orchestrator",
        operation: "collect_trigger_data_error",
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return [];
    }
  }

  private async getCurrentSystemState(): Promise<Record<string, unknown>> {
    try {
      const systemState: Record<string, unknown> = {};

      // Get performance metrics
      const performanceMetrics =
        performanceAnalyticsService.getMetricsForSystem("all", "5m");
      if (performanceMetrics && performanceMetrics.length > 0) {
        const latestPerf = performanceMetrics[performanceMetrics.length - 1];
        systemState.performance_responseTime = latestPerf.responseTime;
        systemState.performance_throughput = latestPerf.throughput;
        systemState.performance_errorRate = latestPerf.errorRate;
        systemState.performance_cpuUsage = latestPerf.cpuUsage;
      }

      // Get security metrics
      const securityMetrics = securityMonitoringService.getSecurityMetrics();
      if (securityMetrics) {
        systemState.security_riskScore = securityMetrics.riskScore;
        systemState.security_activeThreats = securityMetrics.activeThreats;
        systemState.security_complianceScore = securityMetrics.complianceScore;
      }

      // Get monitoring data
      const monitoringHealth =
        await advancedMonitoringSystem.getSystemHealth("all");
      if (monitoringHealth && monitoringHealth.length > 0) {
        const avgHealth =
          monitoringHealth.reduce((sum, h) => sum + (h.healthScore || 0), 0) /
          monitoringHealth.length;
        systemState.monitoring_avgHealthScore = avgHealth;
        systemState.monitoring_systemCount = monitoringHealth.length;
      }

      // Get business metrics (simplified)
      systemState.business_costSavingsPotential = Math.random() * 5000;
      systemState.business_userSatisfaction = 75 + Math.random() * 20;

      return systemState;
    } catch (error) {
      logger.error("Failed to collect current system state", {
        namespace: "intelligent_automation_orchestrator",
        operation: "collect_system_state_error",
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return {};
    }
  }

  // ====================================================================
  // EXECUTION MANAGEMENT METHODS
  // ====================================================================

  private async monitorActiveExecutions(): Promise<void> {
    for (const [executionId, execution] of this.activeExecutions) {
      // Check for timeouts
      const executionDuration = Date.now() - execution.startTime.getTime();
      const maxExecutionTime = 30 * 60 * 1000; // 30 minutes

      if (executionDuration > maxExecutionTime) {
        await this.timeoutWorkflowExecution(executionId);
        continue;
      }

      // Check if execution is stuck
      const stuckSteps = execution.steps.filter(
        step =>
          step.status === "running" &&
          step.startTime &&
          Date.now() - step.startTime.getTime() > 10 * 60 * 1000 // 10 minutes
      );

      if (stuckSteps.length > 0) {
        logger.warn("Workflow execution has stuck steps", {
          namespace: "intelligent_automation_orchestrator",
          operation: "monitor_stuck_execution",
          classification: DataClassification.INTERNAL,
          metadata: {
            executionId,
            stuckStepsCount: stuckSteps.length,
            executionDurationMs: executionDuration,
          },
        });
      }

      // Continue executing workflow if needed
      const hasRunnableSteps = execution.steps.some(
        step => step.status === "pending"
      );
      if (hasRunnableSteps && execution.status === "running") {
        this.executeWorkflowSteps(executionId);
      }
    }
  }

  private async completeWorkflowExecution(executionId: string): Promise<void> {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) return;

    const workflow = this.workflows.get(execution.workflowId);
    if (!workflow) return;

    execution.status = "completed";
    execution.endTime = new Date();
    execution.duration =
      execution.endTime.getTime() - execution.startTime.getTime();

    // Calculate business impact
    const measuredImpact = this.calculateMeasuredBusinessImpact(execution);
    execution.businessImpact.measuredValue = measuredImpact;

    // Update workflow metrics
    workflow.metrics.executionCount++;
    workflow.metrics.successRate = this.calculateWorkflowSuccessRate(
      workflow.id
    );
    workflow.metrics.avgExecutionTime = this.calculateAverageExecutionTime(
      workflow.id
    );
    workflow.metrics.lastExecuted = execution.endTime;
    workflow.metrics.totalTimeSaved += execution.duration || 0;
    workflow.metrics.businessImpact += measuredImpact;

    // Move to history
    this.executionHistory.push(execution);
    this.activeExecutions.delete(executionId);

    // Apply AI learning
    if (workflow.metadata.aiOptimization.enabled) {
      await this.applyWorkflowLearning(workflow, execution);
    }

    logger.info("Workflow execution completed successfully", {
      namespace: "intelligent_automation_orchestrator",
      operation: "workflow_execution_complete",
      classification: DataClassification.INTERNAL,
      metadata: {
        executionId,
        workflowId: execution.workflowId,
        durationMs: execution.duration,
        businessImpact: measuredImpact,
      },
    });
  }

  private async failWorkflowExecution(
    executionId: string,
    error: Error
  ): Promise<void> {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) return;

    const workflow = this.workflows.get(execution.workflowId);
    if (!workflow) return;

    execution.status = "failed";
    execution.endTime = new Date();
    execution.duration =
      execution.endTime.getTime() - execution.startTime.getTime();

    // Update workflow metrics
    workflow.metrics.executionCount++;
    workflow.metrics.errorCount++;
    workflow.metrics.successRate = this.calculateWorkflowSuccessRate(
      workflow.id
    );
    workflow.metrics.lastError = {
      timestamp: new Date(),
      error: error.message,
      actionId:
        execution.steps.find(s => s.status === "failed")?.actionId || "unknown",
    };

    // Move to history
    this.executionHistory.push(execution);
    this.activeExecutions.delete(executionId);

    logger.error("Workflow execution failed", {
      namespace: "intelligent_automation_orchestrator",
      operation: "workflow_execution_failed",
      classification: DataClassification.INTERNAL,
      error: error.message,
      metadata: {
        executionId,
        workflowId: execution.workflowId,
        durationMs: execution.duration,
      },
    });
  }

  private async timeoutWorkflowExecution(executionId: string): Promise<void> {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) return;

    execution.status = "cancelled";
    execution.endTime = new Date();
    execution.duration =
      execution.endTime.getTime() - execution.startTime.getTime();

    // Cancel running steps
    execution.steps.forEach(step => {
      if (step.status === "running" || step.status === "pending") {
        step.status = "cancelled";
        step.endTime = new Date();
        step.error = "Execution timeout";
      }
    });

    this.executionHistory.push(execution);
    this.activeExecutions.delete(executionId);

    logger.warn("Workflow execution timed out", {
      namespace: "intelligent_automation_orchestrator",
      operation: "workflow_execution_timeout",
      classification: DataClassification.INTERNAL,
      metadata: {
        executionId,
        workflowId: execution.workflowId,
        durationMs: execution.duration,
      },
    });
  }

  private async cleanupCompletedExecutions(): Promise<void> {
    // Keep only recent executions in history (last 1000)
    if (this.executionHistory.length > 1000) {
      this.executionHistory = this.executionHistory
        .sort(
          (a, b) => (b.endTime?.getTime() || 0) - (a.endTime?.getTime() || 0)
        )
        .slice(0, 1000);
    }

    // Clean up decision history (last 500)
    if (this.decisionHistory.length > 500) {
      this.decisionHistory = this.decisionHistory
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 500);
    }
  }

  // ====================================================================
  // AI OPTIMIZATION METHODS
  // ====================================================================

  private async applyAIOptimizations(): Promise<void> {
    try {
      // Get AI insights for optimization
      const insights = aiMachineLearningAnalyticsEngine.getIntelligentInsights({
        type: "optimization_opportunity",
        limit: 10,
      });

      for (const insight of insights) {
        if (insight.confidence > 0.8) {
          await this.applyOptimizationInsight(insight);
        }
      }

      // Optimize workflow parameters based on performance
      await this.optimizeWorkflowParameters();

      // Update automation rules based on success rates
      await this.optimizeAutomationRules();
    } catch (error) {
      logger.error("Failed to apply AI optimizations", {
        namespace: "intelligent_automation_orchestrator",
        operation: "apply_ai_optimizations_error",
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  private async applyOptimizationInsight(insight: MLInsight): Promise<void> {
    try {
      // Find workflows that could benefit from this optimization
      const relevantWorkflows = Array.from(this.workflows.values()).filter(
        workflow =>
          workflow.metadata.aiOptimization.enabled &&
          insight.affectedSystems.some(
            system =>
              (workflow.category === "performance" &&
                system.includes("performance")) ||
              (workflow.category === "security" &&
                system.includes("security")) ||
              (workflow.category === "operational" &&
                system.includes("monitoring"))
          )
      );

      for (const workflow of relevantWorkflows) {
        // Apply optimization based on insight recommendations
        const optimization = this.generateWorkflowOptimization(
          workflow,
          insight
        );

        if (optimization) {
          await this.applyWorkflowOptimization(workflow, optimization);

          // Record optimization history
          workflow.metadata.aiOptimization.optimizationHistory.push({
            timestamp: new Date(),
            optimization: optimization.description,
            impact: optimization.estimatedImpact,
          });
        }
      }
    } catch (error) {
      logger.error("Failed to apply optimization insight", {
        namespace: "intelligent_automation_orchestrator",
        operation: "apply_optimization_insight_error",
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: { insightId: insight.id },
      });
    }
  }

  private generateWorkflowOptimization(
    workflow: AutomationWorkflow,
    insight: MLInsight
  ): {
    description: string;
    estimatedImpact: number;
    changes: Array<{ type: string; target: string; value: unknown }>;
  } | null {
    // Generate optimization suggestions based on insight
    const changes: Array<{ type: string; target: string; value: unknown }> = [];
    let estimatedImpact = 0;

    // Example optimizations based on insight type and recommendations
    if (
      insight.recommendations.immediate.some(rec =>
        rec.includes("response time")
      )
    ) {
      // Reduce cooldown periods for faster response
      const currentCooldown = workflow.triggers[0]?.cooldownPeriod || 600000;
      const newCooldown = Math.max(60000, currentCooldown * 0.8); // Reduce by 20%

      changes.push({
        type: "trigger_cooldown",
        target: workflow.triggers[0]?.id || "",
        value: newCooldown,
      });

      estimatedImpact += 15; // 15% improvement estimate
    }

    if (insight.recommendations.shortTerm.some(rec => rec.includes("retry"))) {
      // Optimize retry policies
      changes.push({
        type: "retry_policy",
        target: "all_actions",
        value: { maxAttempts: 2, backoffMs: 2000, exponentialBackoff: true },
      });

      estimatedImpact += 10; // 10% improvement estimate
    }

    return changes.length > 0
      ? {
          description: `AI optimization based on insight: ${insight.title}`,
          estimatedImpact,
          changes,
        }
      : null;
  }

  private async applyWorkflowOptimization(
    workflow: AutomationWorkflow,
    optimization: ReturnType<typeof this.generateWorkflowOptimization>
  ): Promise<void> {
    if (!optimization) return;

    try {
      for (const change of optimization.changes) {
        switch (change.type) {
          case "trigger_cooldown":
            const trigger = workflow.triggers.find(t => t.id === change.target);
            if (trigger) {
              trigger.cooldownPeriod = change.value as number;
            }
            break;

          case "retry_policy":
            workflow.actions.forEach(action => {
              action.retryPolicy = change.value as NonNullable<
                typeof action.retryPolicy
              >;
            });
            break;
        }
      }

      logger.info("Applied workflow optimization", {
        namespace: "intelligent_automation_orchestrator",
        operation: "apply_workflow_optimization",
        classification: DataClassification.INTERNAL,
        metadata: {
          workflowId: workflow.id,
          optimization: optimization.description,
          estimatedImpact: optimization.estimatedImpact,
        },
      });
    } catch (error) {
      logger.error("Failed to apply workflow optimization", {
        namespace: "intelligent_automation_orchestrator",
        operation: "apply_workflow_optimization_error",
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: { workflowId: workflow.id },
      });
    }
  }

  private async optimizeWorkflowParameters(): Promise<void> {
    // Analyze workflow performance and optimize parameters
    for (const workflow of this.workflows.values()) {
      if (!workflow.metadata.aiOptimization.enabled) continue;

      const recentExecutions = this.executionHistory
        .filter(exec => exec.workflowId === workflow.id)
        .slice(-10); // Last 10 executions

      if (recentExecutions.length < 5) continue; // Need enough data

      // Calculate average execution time and success rate
      const avgExecutionTime =
        recentExecutions.reduce((sum, exec) => sum + (exec.duration || 0), 0) /
        recentExecutions.length;
      const successRate =
        recentExecutions.filter(exec => exec.status === "completed").length /
        recentExecutions.length;

      // Optimize based on performance
      if (avgExecutionTime > 300000 && successRate > 0.8) {
        // > 5 minutes but high success rate
        // Increase parallelization
        workflow.flow.forEach(step => {
          if (!step.dependsOn || step.dependsOn.length === 0) {
            step.parallelizable = true;
          }
        });
      }

      if (successRate < 0.7) {
        // Low success rate
        // Increase retry attempts
        workflow.actions.forEach(action => {
          if (action.retryPolicy) {
            action.retryPolicy.maxAttempts = Math.min(
              action.retryPolicy.maxAttempts + 1,
              5
            );
          }
        });
      }
    }
  }

  private async optimizeAutomationRules(): Promise<void> {
    // Optimize automation rules based on their success rates and business impact
    for (const rule of this.automationRules.values()) {
      if (rule.metrics.triggeredCount < 10) continue; // Need enough data

      const successRate =
        rule.metrics.executedCount / rule.metrics.triggeredCount;
      const avgBusinessValue =
        rule.metrics.businessValue / Math.max(rule.metrics.executedCount, 1);

      // Adjust rule priority based on performance
      if (successRate > 0.9 && avgBusinessValue > 1000) {
        rule.priority = Math.min(rule.priority + 1, 10); // Increase priority
      } else if (successRate < 0.5 || avgBusinessValue < 100) {
        rule.priority = Math.max(rule.priority - 1, 1); // Decrease priority
      }

      // Adjust confidence thresholds for ML-based rules
      if (rule.aiConfig?.useMLPredictions) {
        if (successRate > 0.85) {
          rule.aiConfig.confidenceThreshold = Math.max(
            rule.aiConfig.confidenceThreshold - 0.05,
            0.5
          );
        } else if (successRate < 0.6) {
          rule.aiConfig.confidenceThreshold = Math.min(
            rule.aiConfig.confidenceThreshold + 0.1,
            0.95
          );
        }
      }
    }
  }

  private async applyWorkflowLearning(
    workflow: AutomationWorkflow,
    execution: AutomationExecution
  ): Promise<void> {
    try {
      // Learn from execution patterns to improve future performance
      const learningPoints: string[] = [];

      // Analyze step performance
      const slowSteps = execution.steps.filter(
        step => (step.duration || 0) > 60000
      ); // > 1 minute
      if (slowSteps.length > 0) {
        learningPoints.push(
          `Optimize slow steps: ${slowSteps.map(s => s.actionName).join(", ")}`
        );
      }

      // Analyze failure patterns
      const failedSteps = execution.steps.filter(
        step => step.status === "failed"
      );
      if (failedSteps.length > 0) {
        learningPoints.push(
          `Review failure patterns in: ${failedSteps.map(s => s.actionName).join(", ")}`
        );
      }

      // Store learning insights
      if (execution.aiInsights) {
        execution.aiInsights.learningUpdates = learningPoints;
      }

      logger.debug("Applied workflow learning", {
        namespace: "intelligent_automation_orchestrator",
        operation: "apply_workflow_learning",
        classification: DataClassification.INTERNAL,
        metadata: {
          workflowId: workflow.id,
          executionId: execution.id,
          learningPointsCount: learningPoints.length,
        },
      });
    } catch (error) {
      logger.error("Failed to apply workflow learning", {
        namespace: "intelligent_automation_orchestrator",
        operation: "apply_workflow_learning_error",
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: { workflowId: workflow.id, executionId: execution.id },
      });
    }
  }

  // ====================================================================
  // UTILITY METHODS
  // ====================================================================

  private resolveParameters(
    parameters: Record<string, unknown>,
    context: Record<string, unknown>
  ): Record<string, unknown> {
    const resolved: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(parameters)) {
      if (typeof value === "string" && value.startsWith("$")) {
        // Resolve context variable
        const contextKey = value.substring(1);
        resolved[key] = context[contextKey] ?? value;
      } else {
        resolved[key] = value;
      }
    }

    return resolved;
  }

  private checkRuleConstraints(rule: AutomationRule): boolean {
    const now = new Date();
    const currentHour = now.getHours();

    // Check business hours constraint
    if (
      rule.constraints.businessHoursOnly &&
      (currentHour < 9 || currentHour >= 17)
    ) {
      return false;
    }

    // Check execution frequency limits
    if (rule.constraints.maxExecutionsPerHour) {
      const oneHourAgo = new Date(now.getTime() - 3600000);
      const recentExecutions = this.executionHistory.filter(
        exec =>
          exec.startTime >= oneHourAgo &&
          this.getWorkflowsByRuleId(rule.id).some(w => w.id === exec.workflowId)
      ).length;

      if (recentExecutions >= rule.constraints.maxExecutionsPerHour) {
        return false;
      }
    }

    // Check concurrent executions
    if (rule.constraints.maxConcurrentExecutions) {
      const concurrentExecutions = Array.from(
        this.activeExecutions.values()
      ).filter(exec =>
        this.getWorkflowsByRuleId(rule.id).some(w => w.id === exec.workflowId)
      ).length;

      if (concurrentExecutions >= rule.constraints.maxConcurrentExecutions) {
        return false;
      }
    }

    return true;
  }

  private getWorkflowsByRuleId(ruleId: string): AutomationWorkflow[] {
    // This would be more sophisticated in production with proper rule-workflow mapping
    return Array.from(this.workflows.values()).filter(workflow =>
      workflow.metadata.tags.some(tag => tag.includes("automation"))
    );
  }

  private async executeRuleActions(
    rule: AutomationRule,
    systemState: Record<string, unknown>
  ): Promise<void> {
    try {
      for (const action of rule.actions) {
        // Apply delay if specified
        if (action.delayMs && action.delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, action.delayMs));
        }

        // Check conditional execution
        if (action.condition) {
          try {
            // Simple condition evaluation (in production, would use proper expression engine)
            const shouldExecute = Function(
              `"use strict"; return (${action.condition})`
            )();
            if (!shouldExecute) continue;
          } catch (error) {
            logger.error("Failed to evaluate rule action condition", {
              namespace: "intelligent_automation_orchestrator",
              operation: "evaluate_rule_condition_error",
              classification: DataClassification.INTERNAL,
              error: error instanceof Error ? error.message : "Unknown error",
              metadata: { ruleId: rule.id, condition: action.condition },
            });
            continue;
          }
        }

        // Execute workflow
        await this.triggerWorkflow(action.workflowId, {
          triggerId: rule.id,
          triggerType: "automation_rule",
          data: { ...systemState, ...action.parameters },
        });

        rule.metrics.executedCount++;
      }
    } catch (error) {
      logger.error("Failed to execute rule actions", {
        namespace: "intelligent_automation_orchestrator",
        operation: "execute_rule_actions_error",
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: { ruleId: rule.id },
      });
    }
  }

  private getLastWorkflowExecution(
    workflowId: string
  ): AutomationExecution | null {
    const workflowExecutions = [
      ...Array.from(this.activeExecutions.values()),
      ...this.executionHistory,
    ].filter(exec => exec.workflowId === workflowId);

    if (workflowExecutions.length === 0) return null;

    return workflowExecutions.reduce((latest, current) =>
      current.startTime > latest.startTime ? current : latest
    );
  }

  private calculateWorkflowSuccessRate(workflowId: string): number {
    const executions = this.executionHistory.filter(
      exec => exec.workflowId === workflowId
    );
    if (executions.length === 0) return 0;

    const successCount = executions.filter(
      exec => exec.status === "completed"
    ).length;
    return (successCount / executions.length) * 100;
  }

  private calculateAverageExecutionTime(workflowId: string): number {
    const executions = this.executionHistory.filter(
      exec => exec.workflowId === workflowId && exec.duration !== undefined
    );

    if (executions.length === 0) return 0;

    const totalDuration = executions.reduce(
      (sum, exec) => sum + (exec.duration || 0),
      0
    );
    return Math.round(totalDuration / executions.length);
  }

  private calculateMeasuredBusinessImpact(
    execution: AutomationExecution
  ): number {
    // Simplified business impact calculation
    const baseSaving = execution.businessImpact.estimatedValue;
    const executionEfficiency =
      execution.steps.filter(s => s.status === "completed").length /
      execution.steps.length;
    const timeSavingMultiplier = execution.duration
      ? Math.max(0.5, 1 - execution.duration / 1800000)
      : 1; // 30 min baseline

    return Math.round(baseSaving * executionEfficiency * timeSavingMultiplier);
  }

  private collectMetrics(): void {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Calculate today's executions
      const todayExecutions = this.executionHistory.filter(
        exec => exec.startTime >= oneDayAgo
      );
      const completedExecutions = this.executionHistory.filter(
        exec => exec.status === "completed"
      );

      // Update orchestration metrics
      this.orchestrationMetrics = {
        totalWorkflows: this.workflows.size,
        activeWorkflows: Array.from(this.workflows.values()).filter(
          w => w.status === "active"
        ).length,
        totalExecutions: this.executionHistory.length,
        executionsToday: todayExecutions.length,
        averageExecutionTime:
          completedExecutions.length > 0
            ? completedExecutions.reduce(
                (sum, exec) => sum + (exec.duration || 0),
                0
              ) / completedExecutions.length
            : 0,
        successRate:
          this.executionHistory.length > 0
            ? (completedExecutions.length / this.executionHistory.length) * 100
            : 0,

        performanceMetrics: {
          automatedResponseTime: this.calculateAutomatedResponseTime(),
          humanInterventionRate: this.calculateHumanInterventionRate(),
          aiDecisionAccuracy: this.calculateAIDecisionAccuracy(),
          workflowOptimizationImpact: this.calculateOptimizationImpact(),
        },

        businessMetrics: {
          totalTimeSaved: this.calculateTotalTimeSaved(),
          costSavings: this.calculateCostSavings(),
          efficiencyGain: this.calculateEfficiencyGain(),
          riskReduction: this.calculateRiskReduction(),
          customerSatisfactionImpact:
            this.calculateCustomerSatisfactionImpact(),
        },

        systemHealth: {
          orchestratorUptime: this.isRunning ? 100 : 0,
          avgResourceUsage: Math.random() * 40 + 30, // Simulated
          errorRate: this.calculateSystemErrorRate(),
          queueDepth: this.activeExecutions.size,
        },
      };
    } catch (error) {
      logger.error("Failed to collect orchestration metrics", {
        namespace: "intelligent_automation_orchestrator",
        operation: "collect_metrics_error",
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Metrics calculation helper methods
  private calculateAutomatedResponseTime(): number {
    const recentExecutions = this.executionHistory.slice(-50);
    if (recentExecutions.length === 0) return 0;

    const responseTimes = recentExecutions
      .filter(exec => exec.duration)
      .map(exec => exec.duration!);

    return responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) /
          responseTimes.length /
          1000 // Convert to seconds
      : 0;
  }

  private calculateHumanInterventionRate(): number {
    const totalExecutions = this.executionHistory.length;
    const humanInterventions = this.decisionHistory.filter(
      d => d.decision.humanOverride
    ).length;

    return totalExecutions > 0
      ? (humanInterventions / totalExecutions) * 100
      : 0;
  }

  private calculateAIDecisionAccuracy(): number {
    const aiDecisions = this.decisionHistory.filter(
      d => d.decisionType === "automated"
    );
    if (aiDecisions.length === 0) return 0;

    const successfulDecisions = aiDecisions.filter(
      d => d.outcome && d.outcome.measuredImpact > 0
    ).length;

    return (successfulDecisions / aiDecisions.length) * 100;
  }

  private calculateOptimizationImpact(): number {
    const workflows = Array.from(this.workflows.values());
    const optimizedWorkflows = workflows.filter(
      w =>
        w.metadata.aiOptimization.enabled &&
        w.metadata.aiOptimization.optimizationHistory.length > 0
    );

    if (optimizedWorkflows.length === 0) return 0;

    const totalImpact = optimizedWorkflows.reduce((sum, workflow) => {
      return (
        sum +
        workflow.metadata.aiOptimization.optimizationHistory.reduce(
          (wSum, opt) => wSum + opt.impact,
          0
        )
      );
    }, 0);

    return totalImpact / optimizedWorkflows.length;
  }

  private calculateTotalTimeSaved(): number {
    const workflows = Array.from(this.workflows.values());
    const totalTimeSavedMs = workflows.reduce(
      (sum, w) => sum + w.metrics.totalTimeSaved,
      0
    );
    return totalTimeSavedMs / (1000 * 60 * 60); // Convert to hours
  }

  private calculateCostSavings(): number {
    const workflows = Array.from(this.workflows.values());
    return workflows.reduce((sum, w) => sum + w.metrics.businessImpact, 0);
  }

  private calculateEfficiencyGain(): number {
    const totalAutomatedTasks = this.executionHistory.length;
    const successfulTasks = this.executionHistory.filter(
      exec => exec.status === "completed"
    ).length;

    if (totalAutomatedTasks === 0) return 0;

    // Assume each successful automation saves 30 minutes of manual work
    const manualTimeEquivalent = successfulTasks * 0.5; // 30 minutes = 0.5 hours
    const actualAutomationTime = this.calculateTotalTimeSaved();

    return manualTimeEquivalent > 0
      ? ((manualTimeEquivalent - actualAutomationTime) / manualTimeEquivalent) *
          100
      : 0;
  }

  private calculateRiskReduction(): number {
    // Calculate risk reduction based on security workflows executed
    const securityWorkflows = Array.from(this.workflows.values()).filter(
      w => w.category === "security"
    );
    const securityExecutions = this.executionHistory.filter(
      exec =>
        securityWorkflows.some(w => w.id === exec.workflowId) &&
        exec.status === "completed"
    );

    return securityExecutions.length * 5; // 5% risk reduction per security automation
  }

  private calculateCustomerSatisfactionImpact(): number {
    // Simplified customer satisfaction impact based on performance and availability improvements
    const performanceWorkflows = Array.from(this.workflows.values()).filter(
      w => w.category === "performance"
    );
    const performanceExecutions = this.executionHistory.filter(
      exec =>
        performanceWorkflows.some(w => w.id === exec.workflowId) &&
        exec.status === "completed"
    );

    return Math.min(performanceExecutions.length * 2, 20); // Up to 20% improvement
  }

  private calculateSystemErrorRate(): number {
    const totalExecutions = this.executionHistory.length;
    const failedExecutions = this.executionHistory.filter(
      exec => exec.status === "failed"
    ).length;

    return totalExecutions > 0 ? (failedExecutions / totalExecutions) * 100 : 0;
  }

  // ====================================================================
  // PUBLIC API METHODS
  // ====================================================================

  /**
   * Get all workflows
   */
  public getWorkflows(): AutomationWorkflow[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Get workflow by ID
   */
  public getWorkflow(workflowId: string): AutomationWorkflow | null {
    return this.workflows.get(workflowId) || null;
  }

  /**
   * Get automation rules
   */
  public getAutomationRules(): AutomationRule[] {
    return Array.from(this.automationRules.values());
  }

  /**
   * Get active executions
   */
  public getActiveExecutions(): AutomationExecution[] {
    return Array.from(this.activeExecutions.values());
  }

  /**
   * Get execution history
   */
  public getExecutionHistory(limit: number = 100): AutomationExecution[] {
    return this.executionHistory
      .sort(
        (a, b) =>
          (b.endTime?.getTime() || b.startTime.getTime()) -
          (a.endTime?.getTime() || a.startTime.getTime())
      )
      .slice(0, limit);
  }

  /**
   * Get orchestration metrics
   */
  public getOrchestrationMetrics(): AutomationOrchestrationMetrics {
    return { ...this.orchestrationMetrics };
  }

  /**
   * Get execution by ID
   */
  public getExecution(executionId: string): AutomationExecution | null {
    return (
      this.activeExecutions.get(executionId) ||
      this.executionHistory.find(exec => exec.id === executionId) ||
      null
    );
  }

  /**
   * Cancel execution
   */
  public async cancelExecution(executionId: string): Promise<boolean> {
    const execution = this.activeExecutions.get(executionId);
    if (!execution || execution.status !== "running") return false;

    execution.status = "cancelled";
    execution.endTime = new Date();
    execution.duration =
      execution.endTime.getTime() - execution.startTime.getTime();

    // Cancel running steps
    execution.steps.forEach(step => {
      if (step.status === "running" || step.status === "pending") {
        step.status = "cancelled";
        step.endTime = new Date();
      }
    });

    this.executionHistory.push(execution);
    this.activeExecutions.delete(executionId);

    logger.info("Workflow execution cancelled", {
      namespace: "intelligent_automation_orchestrator",
      operation: "cancel_execution",
      classification: DataClassification.INTERNAL,
      metadata: { executionId, workflowId: execution.workflowId },
    });

    return true;
  }

  /**
   * Stop orchestration
   */
  public stopOrchestration(): void {
    if (!this.isRunning) return;

    this.isRunning = false;

    if (this.orchestrationInterval) {
      clearInterval(this.orchestrationInterval);
      this.orchestrationInterval = null;
    }

    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }

    logger.info("Intelligent Automation Orchestrator stopped", {
      namespace: "intelligent_automation_orchestrator",
      operation: "stop_orchestration",
      classification: DataClassification.INTERNAL,
    });
  }

  /**
   * Get system health
   */
  public getSystemHealth(): {
    status: "healthy" | "degraded" | "critical";
    uptime: number;
    activeWorkflows: number;
    queueDepth: number;
    errorRate: number;
    lastUpdate: Date;
  } {
    const errorRate = this.orchestrationMetrics.systemHealth.errorRate;
    let status: "healthy" | "degraded" | "critical" = "healthy";

    if (errorRate > 10 || this.activeExecutions.size > 50) {
      status = "degraded";
    }
    if (errorRate > 25 || this.activeExecutions.size > 100) {
      status = "critical";
    }

    return {
      status,
      uptime: this.orchestrationMetrics.systemHealth.orchestratorUptime,
      activeWorkflows: this.orchestrationMetrics.activeWorkflows,
      queueDepth: this.orchestrationMetrics.systemHealth.queueDepth,
      errorRate,
      lastUpdate: new Date(),
    };
  }
}

// ====================================================================
// SINGLETON EXPORT
// ====================================================================

export const intelligentAutomationOrchestrator =
  new IntelligentAutomationOrchestrator();
export default intelligentAutomationOrchestrator;
