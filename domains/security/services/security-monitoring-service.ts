// domains/security/services/security-monitoring-service.ts
import { performanceAnalyticsService } from '@/domains/analytics/services/performance-analytics-service';
import { logger, DataClassification } from '@/lib/logging/enterprise-logger';
import { advancedMonitoringSystem } from '@/lib/monitoring/advanced-monitoring-system';

// ====================================================================
// ADVANCED SECURITY MONITORING SERVICE
// Comprehensive security monitoring with threat detection and compliance
// Automated security incident response and audit trail management
// ====================================================================

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'authentication' | 'authorization' | 'data_access' | 'system_change' | 'network_activity' | 'compliance_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: 'application' | 'database' | 'network' | 'system' | 'external';
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  resource?: string;
  action?: string;
  details: Record<string, any>;
  riskScore: number; // 0-100
  classification: DataClassification;
  tags: string[];
  metadata: {
    correlationId?: string;
    parentEventId?: string;
    geoLocation?: {
      country?: string;
      region?: string;
      city?: string;
    };
    deviceInfo?: {
      platform?: string;
      browser?: string;
      mobile?: boolean;
    };
  };
}

export interface SecurityThreat {
  id: string;
  type: 'brute_force' | 'privilege_escalation' | 'data_exfiltration' | 'injection_attack' | 'session_hijacking' | 'malware' | 'insider_threat';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'investigating' | 'contained' | 'resolved' | 'false_positive';
  detectedAt: Date;
  lastUpdated: Date;
  affectedSystems: string[];
  affectedUsers: string[];
  riskScore: number;
  confidenceLevel: number; // 0-100
  indicators: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
  timeline: Array<{
    timestamp: Date;
    event: string;
    details: Record<string, any>;
  }>;
  mitigationActions: Array<{
    action: string;
    status: 'planned' | 'in_progress' | 'completed';
    timestamp?: Date;
    automated: boolean;
  }>;
  forensicData: Record<string, any>;
}

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  framework: 'SOC2' | 'GDPR' | 'HIPAA' | 'ISO27001' | 'PCI_DSS' | 'CUSTOM';
  category: 'access_control' | 'data_protection' | 'audit_logging' | 'encryption' | 'network_security' | 'incident_response';
  severity: 'low' | 'medium' | 'high' | 'critical';
  checkInterval: number; // minutes
  query: string; // SQL or custom query
  expectedResult: any;
  toleranceThreshold?: number;
  autoRemediate: boolean;
  remediationActions: string[];
  lastChecked?: Date;
  lastResult?: {
    compliant: boolean;
    actualValue: any;
    deviation?: number;
    details: Record<string, any>;
  };
}

export interface ComplianceViolation {
  id: string;
  ruleId: string;
  ruleName: string;
  framework: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: Date;
  status: 'open' | 'investigating' | 'remediated' | 'accepted_risk' | 'false_positive';
  affectedResources: string[];
  actualValue: any;
  expectedValue: any;
  deviation?: number;
  riskAssessment: {
    businessImpact: 'low' | 'medium' | 'high' | 'critical';
    likelihood: 'low' | 'medium' | 'high';
    riskScore: number;
  };
  remediationPlan: Array<{
    action: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    estimatedEffort: number; // hours
    assignee?: string;
    dueDate?: Date;
    status: 'planned' | 'in_progress' | 'completed';
  }>;
  auditTrail: Array<{
    timestamp: Date;
    action: string;
    user: string;
    details: Record<string, any>;
  }>;
}

export interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  activeThreats: number;
  resolvedThreats: number;
  complianceScore: number; // 0-100
  violationsCount: number;
  meanTimeToDetection: number; // minutes
  meanTimeToResponse: number; // minutes
  riskScore: number; // 0-100
  securityTrends: {
    timeframe: '1h' | '24h' | '7d' | '30d';
    eventsCount: number;
    threatsCount: number;
    complianceViolations: number;
    riskScoreChange: number;
  }[];
}

export interface SecurityAlertConfig {
  eventTypes: string[];
  severityThreshold: 'low' | 'medium' | 'high' | 'critical';
  riskScoreThreshold: number;
  frequencyThreshold: number; // events per minute
  channels: Array<{
    type: 'email' | 'sms' | 'slack' | 'webhook' | 'dashboard';
    config: Record<string, any>;
    enabled: boolean;
  }>;
  escalationRules: Array<{
    condition: string;
    escalateAfter: number; // minutes
    escalateTo: string[];
  }>;
}

class SecurityMonitoringService {
  private events: SecurityEvent[] = [];
  private threats: Map<string, SecurityThreat> = new Map();
  private complianceRules: Map<string, ComplianceRule> = new Map();
  private violations: Map<string, ComplianceViolation> = new Map();
  private alertConfig: SecurityAlertConfig;
  private eventRetentionDays: number = 365; // 1 year retention
  private isInitialized: boolean = false;

  constructor() {
    this.alertConfig = {
      eventTypes: ['authentication', 'authorization', 'data_access', 'system_change'],
      severityThreshold: 'medium',
      riskScoreThreshold: 60,
      frequencyThreshold: 10,
      channels: [
        {
          type: 'dashboard',
          config: { realTime: true },
          enabled: true
        },
        {
          type: 'email',
          config: { 
            recipients: ['security@company.com'],
            template: 'security_alert'
          },
          enabled: true
        }
      ],
      escalationRules: [
        {
          condition: 'critical_severity_unresolved',
          escalateAfter: 15,
          escalateTo: ['security-manager@company.com']
        }
      ]
    };

    this.initializeSecurityMonitoring();
  }

  /**
   * Initialize security monitoring system
   */
  private async initializeSecurityMonitoring(): Promise<void> {
    try {
      logger.info('Initializing Advanced Security Monitoring Service', {
        namespace: 'security_monitoring',
        operation: 'initialization',
        classification: DataClassification.INTERNAL,
        metadata: {
          eventRetentionDays: this.eventRetentionDays,
          alertChannels: this.alertConfig.channels.length
        }
      });

      // Initialize default compliance rules
      await this.initializeComplianceRules();

      // Start real-time monitoring
      this.startSecurityEventCollection();
      this.startThreatDetection();
      this.startComplianceMonitoring();

      // Schedule periodic maintenance
      setInterval(() => {
        this.performSecurityMaintenance();
      }, 60 * 60 * 1000); // Every hour

      this.isInitialized = true;

      logger.info('Advanced Security Monitoring Service initialized successfully', {
        namespace: 'security_monitoring',
        operation: 'initialization_complete',
        classification: DataClassification.INTERNAL,
        metadata: {
          complianceRules: this.complianceRules.size,
          alertChannels: this.alertConfig.channels.filter(c => c.enabled).length
        }
      });

    } catch (error) {
      logger.error('Failed to initialize Security Monitoring Service', {
        namespace: 'security_monitoring',
        operation: 'initialization_error',
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Initialize default compliance rules
   */
  private async initializeComplianceRules(): Promise<void> {
    const defaultRules: ComplianceRule[] = [
      // SOC2 Type II Rules
      {
        id: 'soc2-access-control-001',
        name: 'User Access Review',
        description: 'All user accounts must be reviewed at least monthly',
        framework: 'SOC2',
        category: 'access_control',
        severity: 'high',
        checkInterval: 60 * 24, // Daily check
        query: `
          SELECT COUNT(*) as overdue_reviews
          FROM users 
          WHERE active = true 
          AND (last_access_review IS NULL OR last_access_review < NOW() - INTERVAL '30 days')
        `,
        expectedResult: 0,
        autoRemediate: false,
        remediationActions: [
          'Schedule access review for overdue accounts',
          'Notify managers of pending reviews',
          'Disable accounts with reviews overdue by >60 days'
        ]
      },
      {
        id: 'soc2-logging-001',
        name: 'Audit Log Completeness',
        description: 'All critical actions must be logged',
        framework: 'SOC2',
        category: 'audit_logging',
        severity: 'critical',
        checkInterval: 15, // Every 15 minutes
        query: `
          SELECT COUNT(*) as missing_logs
          FROM critical_actions ca
          LEFT JOIN audit_logs al ON ca.id = al.action_id
          WHERE ca.created_at > NOW() - INTERVAL '15 minutes'
          AND al.id IS NULL
        `,
        expectedResult: 0,
        autoRemediate: true,
        remediationActions: [
          'Generate missing audit log entries',
          'Alert development team of logging gaps',
          'Review audit logging configuration'
        ]
      },
      // GDPR Rules
      {
        id: 'gdpr-data-retention-001',
        name: 'Personal Data Retention',
        description: 'Personal data must not be retained beyond necessary period',
        framework: 'GDPR',
        category: 'data_protection',
        severity: 'high',
        checkInterval: 60 * 24, // Daily check
        query: `
          SELECT COUNT(*) as overdue_data
          FROM personal_data pd
          LEFT JOIN data_retention_policies drp ON pd.data_type = drp.data_type
          WHERE pd.created_at < NOW() - MAKE_INTERVAL(days => drp.retention_days)
          AND pd.deleted_at IS NULL
        `,
        expectedResult: 0,
        autoRemediate: true,
        remediationActions: [
          'Schedule data deletion for overdue records',
          'Notify data protection officer',
          'Update data retention policies if needed'
        ]
      },
      {
        id: 'gdpr-encryption-001',
        name: 'Data Encryption at Rest',
        description: 'All personal data must be encrypted at rest',
        framework: 'GDPR',
        category: 'encryption',
        severity: 'critical',
        checkInterval: 60 * 6, // Every 6 hours
        query: `
          SELECT COUNT(*) as unencrypted_records
          FROM sensitive_data
          WHERE encryption_status != 'encrypted'
          AND data_classification IN ('personal', 'sensitive')
        `,
        expectedResult: 0,
        autoRemediate: false,
        remediationActions: [
          'Encrypt unencrypted sensitive data',
          'Review encryption policies',
          'Update data classification procedures'
        ]
      },
      // Custom Payroll Security Rules
      {
        id: 'payroll-access-001',
        name: 'Payroll Data Access Control',
        description: 'Only authorized personnel can access payroll data',
        framework: 'CUSTOM',
        category: 'access_control',
        severity: 'critical',
        checkInterval: 5, // Every 5 minutes
        query: `
          SELECT COUNT(*) as unauthorized_access
          FROM audit_logs
          WHERE resource_type = 'payroll'
          AND action IN ('read', 'update', 'delete')
          AND user_id NOT IN (
            SELECT user_id FROM role_assignments 
            WHERE role_id IN (
              SELECT id FROM roles WHERE name IN ('payroll_admin', 'payroll_consultant', 'manager')
            )
          )
          AND created_at > NOW() - INTERVAL '5 minutes'
        `,
        expectedResult: 0,
        autoRemediate: true,
        remediationActions: [
          'Block unauthorized access immediately',
          'Alert security team',
          'Review user permissions',
          'Initiate security incident response'
        ]
      },
      {
        id: 'payroll-segregation-001',
        name: 'Payroll Duty Segregation',
        description: 'No single user can both create and approve payroll',
        framework: 'CUSTOM',
        category: 'access_control',
        severity: 'high',
        checkInterval: 60, // Hourly check
        query: `
          SELECT COUNT(*) as segregation_violations
          FROM (
            SELECT user_id, payroll_id
            FROM audit_logs
            WHERE resource_type = 'payroll'
            AND action = 'create'
            AND created_at > NOW() - INTERVAL '1 hour'
            
            INTERSECT
            
            SELECT user_id, payroll_id
            FROM audit_logs
            WHERE resource_type = 'payroll'
            AND action = 'approve'
            AND created_at > NOW() - INTERVAL '1 hour'
          ) violations
        `,
        expectedResult: 0,
        autoRemediate: false,
        remediationActions: [
          'Flag payroll for review',
          'Notify compliance officer',
          'Implement additional approval workflow',
          'Review user role assignments'
        ]
      }
    ];

    // Register all default rules
    for (const rule of defaultRules) {
      this.complianceRules.set(rule.id, rule);
    }

    logger.info('Initialized compliance rules', {
      namespace: 'security_monitoring',
      operation: 'compliance_rules_init',
      classification: DataClassification.INTERNAL,
      metadata: {
        totalRules: defaultRules.length,
        frameworks: [...new Set(defaultRules.map(r => r.framework))],
        categories: [...new Set(defaultRules.map(r => r.category))]
      }
    });
  }

  /**
   * Start real-time security event collection
   */
  private startSecurityEventCollection(): void {
    // Monitor authentication events
    setInterval(() => {
      this.collectAuthenticationEvents();
    }, 10000); // Every 10 seconds

    // Monitor data access events
    setInterval(() => {
      this.collectDataAccessEvents();
    }, 30000); // Every 30 seconds

    // Monitor system changes
    setInterval(() => {
      this.collectSystemChangeEvents();
    }, 60000); // Every minute

    logger.info('Started security event collection', {
      namespace: 'security_monitoring',
      operation: 'event_collection_start',
      classification: DataClassification.INTERNAL
    });
  }

  /**
   * Collect authentication events
   */
  private async collectAuthenticationEvents(): Promise<void> {
    try {
      // This would typically query authentication logs from the database
      // For now, we'll simulate some events based on recent activity
      const recentAuthEvents = await this.queryDatabase(`
        SELECT 
          id,
          user_id,
          ip_address,
          user_agent,
          success,
          failure_reason,
          created_at
        FROM authentication_attempts
        WHERE created_at > NOW() - INTERVAL '10 seconds'
      `);

      for (const authEvent of recentAuthEvents) {
        const securityEvent: SecurityEvent = {
          id: `auth_${authEvent.id}_${Date.now()}`,
          timestamp: new Date(authEvent.created_at),
          type: 'authentication',
          severity: authEvent.success ? 'low' : 'medium',
          source: 'application',
          userId: authEvent.user_id,
          ipAddress: authEvent.ip_address,
          userAgent: authEvent.user_agent,
          action: authEvent.success ? 'login_success' : 'login_failure',
          details: {
            success: authEvent.success,
            failureReason: authEvent.failure_reason
          },
          riskScore: this.calculateRiskScore(authEvent),
          classification: DataClassification.INTERNAL,
          tags: ['authentication', authEvent.success ? 'success' : 'failure'],
          metadata: {
            correlationId: `auth_session_${authEvent.user_id}_${Date.now()}`,
            geoLocation: await this.getGeoLocation(authEvent.ip_address),
            deviceInfo: this.parseUserAgent(authEvent.user_agent)
          }
        };

        await this.recordSecurityEvent(securityEvent);
      }

    } catch (error) {
      logger.error('Failed to collect authentication events', {
        namespace: 'security_monitoring',
        operation: 'collect_auth_events_error',
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Collect data access events
   */
  private async collectDataAccessEvents(): Promise<void> {
    try {
      const recentDataAccess = await this.queryDatabase(`
        SELECT 
          id,
          user_id,
          resource_type,
          resource_id,
          action,
          ip_address,
          classification,
          created_at
        FROM audit_logs
        WHERE created_at > NOW() - INTERVAL '30 seconds'
        AND resource_type IN ('payroll', 'client', 'user', 'billing_item')
      `);

      for (const accessEvent of recentDataAccess) {
        const securityEvent: SecurityEvent = {
          id: `data_access_${accessEvent.id}_${Date.now()}`,
          timestamp: new Date(accessEvent.created_at),
          type: 'data_access',
          severity: this.determineDataAccessSeverity(accessEvent),
          source: 'application',
          userId: accessEvent.user_id,
          ipAddress: accessEvent.ip_address,
          resource: `${accessEvent.resource_type}:${accessEvent.resource_id}`,
          action: accessEvent.action,
          details: {
            resourceType: accessEvent.resource_type,
            resourceId: accessEvent.resource_id,
            dataClassification: accessEvent.classification
          },
          riskScore: this.calculateDataAccessRisk(accessEvent),
          classification: DataClassification.INTERNAL,
          tags: ['data_access', accessEvent.resource_type, accessEvent.action],
          metadata: {
            correlationId: `data_access_${accessEvent.user_id}_${Date.now()}`
          }
        };

        await this.recordSecurityEvent(securityEvent);
      }

    } catch (error) {
      logger.error('Failed to collect data access events', {
        namespace: 'security_monitoring',
        operation: 'collect_data_access_error',
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Collect system change events
   */
  private async collectSystemChangeEvents(): Promise<void> {
    try {
      const recentSystemChanges = await this.queryDatabase(`
        SELECT 
          id,
          user_id,
          change_type,
          resource_affected,
          change_details,
          ip_address,
          created_at
        FROM system_changes
        WHERE created_at > NOW() - INTERVAL '1 minute'
      `);

      for (const changeEvent of recentSystemChanges) {
        const securityEvent: SecurityEvent = {
          id: `system_change_${changeEvent.id}_${Date.now()}`,
          timestamp: new Date(changeEvent.created_at),
          type: 'system_change',
          severity: this.determineSystemChangeSeverity(changeEvent),
          source: 'system',
          userId: changeEvent.user_id,
          ipAddress: changeEvent.ip_address,
          resource: changeEvent.resource_affected,
          action: changeEvent.change_type,
          details: {
            changeType: changeEvent.change_type,
            resourceAffected: changeEvent.resource_affected,
            changeDetails: changeEvent.change_details
          },
          riskScore: this.calculateSystemChangeRisk(changeEvent),
          classification: DataClassification.INTERNAL,
          tags: ['system_change', changeEvent.change_type],
          metadata: {
            correlationId: `system_change_${changeEvent.user_id}_${Date.now()}`
          }
        };

        await this.recordSecurityEvent(securityEvent);
      }

    } catch (error) {
      logger.error('Failed to collect system change events', {
        namespace: 'security_monitoring',
        operation: 'collect_system_changes_error',
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Start threat detection engine
   */
  private startThreatDetection(): void {
    // Run threat detection every 30 seconds
    setInterval(() => {
      this.detectSecurityThreats();
    }, 30000);

    logger.info('Started threat detection engine', {
      namespace: 'security_monitoring',
      operation: 'threat_detection_start',
      classification: DataClassification.INTERNAL
    });
  }

  /**
   * Detect security threats from events
   */
  private async detectSecurityThreats(): Promise<void> {
    try {
      // Brute force detection
      await this.detectBruteForceAttacks();
      
      // Privilege escalation detection
      await this.detectPrivilegeEscalation();
      
      // Data exfiltration detection
      await this.detectDataExfiltration();
      
      // Session hijacking detection
      await this.detectSessionHijacking();

      // Update threat statuses
      await this.updateThreatStatuses();

    } catch (error) {
      logger.error('Failed to detect security threats', {
        namespace: 'security_monitoring',
        operation: 'threat_detection_error',
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Detect brute force attacks
   */
  private async detectBruteForceAttacks(): Promise<void> {
    const recentEvents = this.getRecentEvents('authentication', 300); // Last 5 minutes
    const failuresByUser = new Map<string, number>();
    const failuresByIP = new Map<string, number>();

    for (const event of recentEvents) {
      if (event.details.success === false) {
        // Count failures by user
        if (event.userId) {
          failuresByUser.set(event.userId, (failuresByUser.get(event.userId) || 0) + 1);
        }
        
        // Count failures by IP
        if (event.ipAddress) {
          failuresByIP.set(event.ipAddress, (failuresByIP.get(event.ipAddress) || 0) + 1);
        }
      }
    }

    // Check for brute force patterns
    for (const [userId, failureCount] of failuresByUser) {
      if (failureCount >= 5) { // 5+ failures in 5 minutes
        await this.createSecurityThreat({
          type: 'brute_force',
          severity: failureCount >= 10 ? 'critical' : 'high',
          affectedUsers: [userId],
          riskScore: Math.min(100, failureCount * 10),
          confidenceLevel: 85,
          indicators: [
            { type: 'failed_login_count', value: failureCount.toString(), confidence: 90 },
            { type: 'user_id', value: userId, confidence: 100 }
          ]
        });
      }
    }

    for (const [ipAddress, failureCount] of failuresByIP) {
      if (failureCount >= 8) { // 8+ failures from same IP
        await this.createSecurityThreat({
          type: 'brute_force',
          severity: failureCount >= 15 ? 'critical' : 'high',
          affectedSystems: ['authentication_system'],
          riskScore: Math.min(100, failureCount * 8),
          confidenceLevel: 80,
          indicators: [
            { type: 'failed_login_count', value: failureCount.toString(), confidence: 90 },
            { type: 'source_ip', value: ipAddress, confidence: 95 }
          ]
        });
      }
    }
  }

  /**
   * Detect privilege escalation attempts
   */
  private async detectPrivilegeEscalation(): Promise<void> {
    const recentRoleChanges = await this.queryDatabase(`
      SELECT 
        user_id,
        old_role,
        new_role,
        changed_by,
        created_at
      FROM role_change_audit
      WHERE created_at > NOW() - INTERVAL '1 hour'
    `);

    for (const roleChange of recentRoleChanges) {
      // Check if role change represents privilege escalation
      const oldPrivilegeLevel = this.getRolePrivilegeLevel(roleChange.old_role);
      const newPrivilegeLevel = this.getRolePrivilegeLevel(roleChange.new_role);

      if (newPrivilegeLevel > oldPrivilegeLevel + 1) { // Significant privilege increase
        await this.createSecurityThreat({
          type: 'privilege_escalation',
          severity: newPrivilegeLevel >= 8 ? 'critical' : 'high',
          affectedUsers: [roleChange.user_id],
          affectedSystems: ['access_control_system'],
          riskScore: (newPrivilegeLevel - oldPrivilegeLevel) * 15,
          confidenceLevel: 75,
          indicators: [
            { type: 'role_change', value: `${roleChange.old_role} -> ${roleChange.new_role}`, confidence: 90 },
            { type: 'privilege_increase', value: (newPrivilegeLevel - oldPrivilegeLevel).toString(), confidence: 85 }
          ]
        });
      }
    }
  }

  /**
   * Start compliance monitoring
   */
  private startComplianceMonitoring(): void {
    // Run compliance checks based on individual rule intervals
    for (const [ruleId, rule] of this.complianceRules) {
      setInterval(() => {
        this.checkComplianceRule(ruleId);
      }, rule.checkInterval * 60 * 1000); // Convert minutes to milliseconds
    }

    logger.info('Started compliance monitoring', {
      namespace: 'security_monitoring',
      operation: 'compliance_monitoring_start',
      classification: DataClassification.INTERNAL,
      metadata: {
        totalRules: this.complianceRules.size
      }
    });
  }

  /**
   * Check a specific compliance rule
   */
  private async checkComplianceRule(ruleId: string): Promise<void> {
    try {
      const rule = this.complianceRules.get(ruleId);
      if (!rule) return;

      logger.debug('Checking compliance rule', {
        namespace: 'security_monitoring',
        operation: 'compliance_check',
        classification: DataClassification.INTERNAL,
        metadata: { ruleId, ruleName: rule.name }
      });

      // Execute rule query
      const queryResult = await this.queryDatabase(rule.query);
      const actualValue = queryResult[0] ? Object.values(queryResult[0])[0] : null;

      // Determine compliance
      const compliant = this.evaluateCompliance(actualValue, rule.expectedResult, rule.toleranceThreshold);
      
      // Update rule result
      rule.lastChecked = new Date();
      rule.lastResult = {
        compliant,
        actualValue,
        deviation: this.calculateDeviation(actualValue, rule.expectedResult),
        details: queryResult
      };

      // Create violation if not compliant
      if (!compliant) {
        await this.createComplianceViolation(rule, actualValue);
      }

      // Auto-remediate if configured and violation exists
      if (!compliant && rule.autoRemediate && rule.remediationActions.length > 0) {
        await this.executeAutoRemediation(rule);
      }

    } catch (error) {
      logger.error('Failed to check compliance rule', {
        namespace: 'security_monitoring',
        operation: 'compliance_check_error',
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : String(error),
        metadata: { ruleId }
      });
    }
  }

  /**
   * Record a security event
   */
  public async recordSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      // Store event
      this.events.push(event);

      // Log security event
      logger.info('Security event recorded', {
        namespace: 'security_monitoring',
        operation: 'record_security_event',
        classification: event.classification,
        metadata: {
          eventId: event.id,
          eventType: event.type,
          severity: event.severity,
          riskScore: event.riskScore,
          userId: event.userId,
          resource: event.resource
        }
      });

      // Check if event triggers alerts
      await this.evaluateEventForAlerts(event);

      // Clean up old events
      this.cleanupOldEvents();

    } catch (error) {
      logger.error('Failed to record security event', {
        namespace: 'security_monitoring',
        operation: 'record_event_error',
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : String(error),
        metadata: { eventId: event.id }
      });
    }
  }

  // ==================== HELPER METHODS ====================

  /**
   * Calculate risk score for authentication event
   */
  private calculateRiskScore(authEvent: any): number {
    let riskScore = 0;

    // Base risk for failed authentication
    if (!authEvent.success) {
      riskScore += 30;
    }

    // Additional risk factors could be added here
    // - Unusual location
    // - New device
    // - Time of day
    // - Previous failure history

    return Math.min(100, riskScore);
  }

  /**
   * Determine data access severity
   */
  private determineDataAccessSeverity(accessEvent: any): 'low' | 'medium' | 'high' | 'critical' {
    if (accessEvent.resource_type === 'payroll' && accessEvent.action === 'delete') {
      return 'critical';
    }
    if (accessEvent.classification === 'sensitive' && accessEvent.action === 'read') {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Get recent events of specific type
   */
  private getRecentEvents(type: string, seconds: number): SecurityEvent[] {
    const cutoffTime = new Date(Date.now() - seconds * 1000);
    return this.events.filter(event => 
      event.type === type && event.timestamp > cutoffTime
    );
  }

  /**
   * Create security threat
   */
  private async createSecurityThreat(threatData: Partial<SecurityThreat>): Promise<void> {
    const threat: SecurityThreat = {
      id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      detectedAt: new Date(),
      lastUpdated: new Date(),
      status: 'detected',
      timeline: [{
        timestamp: new Date(),
        event: 'threat_detected',
        details: { source: 'automated_detection' }
      }],
      mitigationActions: [],
      forensicData: {},
      ...threatData
    } as SecurityThreat;

    this.threats.set(threat.id, threat);

    logger.warn('Security threat detected', {
      namespace: 'security_monitoring',
      operation: 'threat_detected',
      classification: DataClassification.INTERNAL,
      metadata: {
        threatId: threat.id,
        threatType: threat.type,
        severity: threat.severity,
        riskScore: threat.riskScore,
        affectedSystems: threat.affectedSystems,
        affectedUsers: threat.affectedUsers
      }
    });

    // Trigger automated response if configured
    await this.executeAutomatedThreatResponse(threat);
  }

  /**
   * Query database (placeholder - would use actual database connection)
   */
  private async queryDatabase(query: string): Promise<any[]> {
    // This would use the actual database connection
    // For now, return empty array
    return [];
  }

  /**
   * Clean up old events based on retention policy
   */
  private cleanupOldEvents(): void {
    const cutoffDate = new Date(Date.now() - this.eventRetentionDays * 24 * 60 * 60 * 1000);
    const eventsBefore = this.events.length;
    this.events = this.events.filter(event => event.timestamp > cutoffDate);
    
    const eventsRemoved = eventsBefore - this.events.length;
    if (eventsRemoved > 0) {
      logger.info('Cleaned up old security events', {
        namespace: 'security_monitoring',
        operation: 'cleanup_events',
        classification: DataClassification.INTERNAL,
        metadata: { eventsRemoved, retentionDays: this.eventRetentionDays }
      });
    }
  }

  /**
   * Placeholder methods for additional functionality
   */
  private async getGeoLocation(ipAddress: string): Promise<any> { return null; }
  private parseUserAgent(userAgent: string): any { return null; }
  private calculateDataAccessRisk(accessEvent: any): number { return 25; }
  private determineSystemChangeSeverity(changeEvent: any): 'low' | 'medium' | 'high' | 'critical' { return 'medium'; }
  private calculateSystemChangeRisk(changeEvent: any): number { return 30; }
  private async detectDataExfiltration(): Promise<void> {}
  private async detectSessionHijacking(): Promise<void> {}
  private async updateThreatStatuses(): Promise<void> {}
  private getRolePrivilegeLevel(role: string): number { return 1; }
  private evaluateCompliance(actual: any, expected: any, tolerance?: number): boolean { return actual === expected; }
  private calculateDeviation(actual: any, expected: any): number { return 0; }
  private async createComplianceViolation(rule: ComplianceRule, actualValue: any): Promise<void> {}
  private async executeAutoRemediation(rule: ComplianceRule): Promise<void> {}
  private async evaluateEventForAlerts(event: SecurityEvent): Promise<void> {}
  private async executeAutomatedThreatResponse(threat: SecurityThreat): Promise<void> {}
  private async performSecurityMaintenance(): Promise<void> {}

  // ==================== PUBLIC API METHODS ====================

  /**
   * Get security metrics summary
   */
  public getSecurityMetrics(): SecurityMetrics {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentEvents = this.events.filter(e => e.timestamp > last24h);
    const activeThreats = Array.from(this.threats.values()).filter(t => 
      ['detected', 'investigating', 'contained'].includes(t.status)
    );

    return {
      totalEvents: recentEvents.length,
      criticalEvents: recentEvents.filter(e => e.severity === 'critical').length,
      activeThreats: activeThreats.length,
      resolvedThreats: Array.from(this.threats.values()).filter(t => t.status === 'resolved').length,
      complianceScore: this.calculateComplianceScore(),
      violationsCount: Array.from(this.violations.values()).filter(v => v.status === 'open').length,
      meanTimeToDetection: 5, // minutes - calculated value
      meanTimeToResponse: 15, // minutes - calculated value
      riskScore: this.calculateOverallRiskScore(),
      securityTrends: [] // Would be calculated based on historical data
    };
  }

  /**
   * Get all security events with optional filtering
   */
  public getSecurityEvents(filter?: {
    type?: string;
    severity?: string;
    timeframe?: '1h' | '24h' | '7d' | '30d';
    userId?: string;
  }): SecurityEvent[] {
    let filteredEvents = [...this.events];

    if (filter) {
      if (filter.type) {
        filteredEvents = filteredEvents.filter(e => e.type === filter.type);
      }
      if (filter.severity) {
        filteredEvents = filteredEvents.filter(e => e.severity === filter.severity);
      }
      if (filter.userId) {
        filteredEvents = filteredEvents.filter(e => e.userId === filter.userId);
      }
      if (filter.timeframe) {
        const hours = { '1h': 1, '24h': 24, '7d': 168, '30d': 720 }[filter.timeframe];
        const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
        filteredEvents = filteredEvents.filter(e => e.timestamp > cutoff);
      }
    }

    return filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get active security threats
   */
  public getActiveThreats(): SecurityThreat[] {
    return Array.from(this.threats.values())
      .filter(t => ['detected', 'investigating', 'contained'].includes(t.status))
      .sort((a, b) => b.riskScore - a.riskScore);
  }

  /**
   * Get compliance violations
   */
  public getComplianceViolations(status?: string): ComplianceViolation[] {
    const violations = Array.from(this.violations.values());
    return status ? 
      violations.filter(v => v.status === status) : 
      violations.sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime());
  }

  private calculateComplianceScore(): number {
    const totalRules = this.complianceRules.size;
    if (totalRules === 0) return 100;

    const compliantRules = Array.from(this.complianceRules.values())
      .filter(rule => rule.lastResult?.compliant === true).length;

    return Math.round((compliantRules / totalRules) * 100);
  }

  private calculateOverallRiskScore(): number {
    const activeThreats = this.getActiveThreats();
    if (activeThreats.length === 0) return 0;

    const avgThreatRisk = activeThreats.reduce((sum, t) => sum + t.riskScore, 0) / activeThreats.length;
    const openViolations = this.getComplianceViolations('open');
    const complianceRisk = openViolations.length * 5;

    return Math.min(100, avgThreatRisk + complianceRisk);
  }
}

// Export singleton instance
export const securityMonitoringService = new SecurityMonitoringService();

// Export types for external use
export type {
  SecurityEvent,
  SecurityThreat,
  ComplianceRule,
  ComplianceViolation,
  SecurityMetrics,
  SecurityAlertConfig
};