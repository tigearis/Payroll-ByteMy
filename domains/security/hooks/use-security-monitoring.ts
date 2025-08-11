// domains/security/hooks/use-security-monitoring.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { logger, DataClassification } from '@/lib/logging/enterprise-logger';
import { securityMonitoringService, SecurityEvent, SecurityThreat, ComplianceViolation, SecurityMetrics } from '../services/security-monitoring-service';

// ====================================================================
// SECURITY MONITORING HOOK
// React hook for managing security monitoring data and state
// Provides comprehensive security dashboard functionality
// ====================================================================

export interface SecurityReport {
  reportId: string;
  generatedAt: Date;
  timeframe: string;
  executiveSummary: {
    overallRiskScore: number;
    totalEvents: number;
    activeThreats: number;
    complianceScore: number;
    criticalViolations: number;
    securityTrend: 'improving' | 'stable' | 'degrading';
  };
  threatAnalysis: {
    totalThreats: number;
    threatsByType: Record<string, number>;
    threatsBySeverity: Record<string, number>;
    meanTimeToDetection: number;
    meanTimeToResolution: number;
    topTargetedSystems: string[];
  };
  complianceAnalysis: {
    overallScore: number;
    frameworkScores: Record<string, number>;
    violationsByFramework: Record<string, number>;
    criticalViolations: ComplianceViolation[];
    remediationProgress: number;
  };
  securityEventAnalysis: {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    topSourceIPs: Array<{ ip: string; count: number; riskScore: number }>;
    topTargetedUsers: Array<{ userId: string; eventCount: number; riskScore: number }>;
    anomalousActivities: Array<{
      type: string;
      description: string;
      riskScore: number;
      occurrences: number;
    }>;
  };
  recommendations: {
    immediate: Array<{
      priority: 'critical' | 'high';
      category: string;
      action: string;
      estimatedEffort: string;
      businessImpact: string;
    }>;
    shortTerm: Array<{
      priority: 'medium' | 'high';
      category: string;
      action: string;
      estimatedEffort: string;
      businessImpact: string;
    }>;
    longTerm: Array<{
      priority: 'low' | 'medium';
      category: string;
      action: string;
      estimatedEffort: string;
      businessImpact: string;
    }>;
  };
}

interface UseSecurityMonitoringResult {
  // Data
  securityMetrics: SecurityMetrics | null;
  securityEvents: SecurityEvent[] | null;
  activeThreats: SecurityThreat[] | null;
  complianceViolations: ComplianceViolation[] | null;
  securityReport: SecurityReport | null;
  
  // State
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Actions
  refreshData: () => Promise<void>;
  generateSecurityReport: (timeframe?: '24h' | '7d' | '30d') => Promise<void>;
  getSecurityEvents: (filter?: {
    type?: string;
    severity?: string;
    timeframe?: string;
    userId?: string;
  }) => SecurityEvent[];
  getActiveThreats: (filter?: {
    type?: string;
    severity?: string;
    status?: string;
  }) => SecurityThreat[];
  getComplianceViolations: (status?: string) => ComplianceViolation[];
  clearError: () => void;
  recordSecurityEvent: (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => Promise<void>;
}

export const useSecurityMonitoring = (): UseSecurityMonitoringResult => {
  // State management
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[] | null>(null);
  const [activeThreats, setActiveThreats] = useState<SecurityThreat[] | null>(null);
  const [complianceViolations, setComplianceViolations] = useState<ComplianceViolation[] | null>(null);
  const [securityReport, setSecurityReport] = useState<SecurityReport | null>(null);
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
   * Load comprehensive security monitoring data
   */
  const loadSecurityData = useCallback(async (): Promise<void> => {
    try {
      // Cancel any existing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      
      setLoading(true);
      setError(null);

      logger.info('Loading security monitoring data', {
        namespace: 'security_monitoring_hook',
        operation: 'load_security_data',
        classification: DataClassification.INTERNAL,
        metadata: { timestamp: new Date().toISOString() }
      });

      // Load security metrics
      const metricsData = securityMonitoringService.getSecurityMetrics();
      if (!mountedRef.current) return;
      setSecurityMetrics(metricsData);

      // Load security events (last 24 hours by default)
      const eventsData = securityMonitoringService.getSecurityEvents({
        timeframe: '24h'
      });
      if (!mountedRef.current) return;
      setSecurityEvents(eventsData);

      // Load active threats
      const threatsData = securityMonitoringService.getActiveThreats();
      if (!mountedRef.current) return;
      setActiveThreats(threatsData);

      // Load compliance violations
      const violationsData = securityMonitoringService.getComplianceViolations();
      if (!mountedRef.current) return;
      setComplianceViolations(violationsData);

      setLastUpdated(new Date());

      logger.info('Successfully loaded security monitoring data', {
        namespace: 'security_monitoring_hook',
        operation: 'load_security_data_success',
        classification: DataClassification.INTERNAL,
        metadata: {
          eventsLoaded: eventsData.length,
          threatsLoaded: threatsData.length,
          violationsLoaded: violationsData.length,
          riskScore: metricsData.riskScore,
          complianceScore: metricsData.complianceScore
        }
      });

    } catch (err) {
      if (!mountedRef.current) return;

      const errorMessage = err instanceof Error ? err.message : 'Failed to load security data';
      setError(errorMessage);

      logger.error('Failed to load security monitoring data', {
        namespace: 'security_monitoring_hook',
        operation: 'load_security_data_error',
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
   * Refresh all security data
   */
  const refreshData = useCallback(async (): Promise<void> => {
    await loadSecurityData();
  }, [loadSecurityData]);

  /**
   * Generate comprehensive security report
   */
  const generateSecurityReport = useCallback(async (timeframe: '24h' | '7d' | '30d' = '24h'): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      logger.info('Generating security report', {
        namespace: 'security_monitoring_hook',
        operation: 'generate_security_report',
        classification: DataClassification.INTERNAL,
        metadata: { timeframe }
      });

      // Generate comprehensive security report
      const report = await generateSecurityReportData(timeframe);
      
      if (!mountedRef.current) return;

      setSecurityReport(report);

      logger.info('Successfully generated security report', {
        namespace: 'security_monitoring_hook',
        operation: 'generate_security_report_success',
        classification: DataClassification.INTERNAL,
        metadata: {
          reportId: report.reportId,
          timeframe: report.timeframe,
          overallRiskScore: report.executiveSummary.overallRiskScore,
          totalThreats: report.threatAnalysis.totalThreats
        }
      });

    } catch (err) {
      if (!mountedRef.current) return;

      const errorMessage = err instanceof Error ? err.message : 'Failed to generate security report';
      setError(errorMessage);

      logger.error('Failed to generate security report', {
        namespace: 'security_monitoring_hook',
        operation: 'generate_security_report_error',
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
   * Generate security report data
   */
  const generateSecurityReportData = async (timeframe: string): Promise<SecurityReport> => {
    const reportId = `security_report_${Date.now()}`;
    const currentMetrics = securityMonitoringService.getSecurityMetrics();
    const recentEvents = securityMonitoringService.getSecurityEvents({ timeframe });
    const threats = securityMonitoringService.getActiveThreats();
    const violations = securityMonitoringService.getComplianceViolations();

    // Analyze threat data
    const threatsByType = threats.reduce((acc, threat) => {
      acc[threat.type] = (acc[threat.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const threatsBySeverity = threats.reduce((acc, threat) => {
      acc[threat.severity] = (acc[threat.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Analyze event data
    const eventsByType = recentEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eventsBySeverity = recentEvents.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get top source IPs
    const ipCounts = new Map<string, { count: number; totalRiskScore: number }>();
    recentEvents.forEach(event => {
      if (event.ipAddress) {
        const current = ipCounts.get(event.ipAddress) || { count: 0, totalRiskScore: 0 };
        current.count++;
        current.totalRiskScore += event.riskScore;
        ipCounts.set(event.ipAddress, current);
      }
    });

    const topSourceIPs = Array.from(ipCounts.entries())
      .map(([ip, data]) => ({
        ip,
        count: data.count,
        riskScore: Math.round(data.totalRiskScore / data.count)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get top targeted users
    const userCounts = new Map<string, { count: number; totalRiskScore: number }>();
    recentEvents.forEach(event => {
      if (event.userId) {
        const current = userCounts.get(event.userId) || { count: 0, totalRiskScore: 0 };
        current.count++;
        current.totalRiskScore += event.riskScore;
        userCounts.set(event.userId, current);
      }
    });

    const topTargetedUsers = Array.from(userCounts.entries())
      .map(([userId, data]) => ({
        userId,
        eventCount: data.count,
        riskScore: Math.round(data.totalRiskScore / data.count)
      }))
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 10);

    // Analyze compliance data
    const violationsByFramework = violations.reduce((acc, violation) => {
      acc[violation.framework] = (acc[violation.framework] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const criticalViolations = violations.filter(v => v.severity === 'critical');

    // Calculate framework scores (placeholder logic)
    const frameworkScores = {
      'SOC2': Math.max(0, 100 - (violationsByFramework['SOC2'] || 0) * 10),
      'GDPR': Math.max(0, 100 - (violationsByFramework['GDPR'] || 0) * 15),
      'CUSTOM': Math.max(0, 100 - (violationsByFramework['CUSTOM'] || 0) * 5)
    };

    // Detect anomalous activities
    const anomalousActivities = [
      {
        type: 'High-frequency login failures',
        description: 'Multiple failed login attempts detected',
        riskScore: 75,
        occurrences: recentEvents.filter(e => 
          e.type === 'authentication' && 
          e.details.success === false
        ).length
      },
      {
        type: 'Unusual data access patterns',
        description: 'Access to sensitive data outside normal hours',
        riskScore: 60,
        occurrences: recentEvents.filter(e => 
          e.type === 'data_access' && 
          e.riskScore > 50
        ).length
      }
    ].filter(activity => activity.occurrences > 0);

    // Generate security trend (simplified logic)
    const securityTrend: 'improving' | 'stable' | 'degrading' = 
      currentMetrics.riskScore < 30 ? 'improving' :
      currentMetrics.riskScore < 60 ? 'stable' : 'degrading';

    // Generate recommendations
    const recommendations = generateSecurityRecommendations(
      currentMetrics,
      threats,
      violations,
      recentEvents
    );

    return {
      reportId,
      generatedAt: new Date(),
      timeframe,
      executiveSummary: {
        overallRiskScore: currentMetrics.riskScore,
        totalEvents: currentMetrics.totalEvents,
        activeThreats: threats.length,
        complianceScore: currentMetrics.complianceScore,
        criticalViolations: criticalViolations.length,
        securityTrend
      },
      threatAnalysis: {
        totalThreats: threats.length,
        threatsByType,
        threatsBySeverity,
        meanTimeToDetection: currentMetrics.meanTimeToDetection,
        meanTimeToResolution: currentMetrics.meanTimeToResponse,
        topTargetedSystems: [...new Set(threats.flatMap(t => t.affectedSystems))].slice(0, 5)
      },
      complianceAnalysis: {
        overallScore: currentMetrics.complianceScore,
        frameworkScores,
        violationsByFramework,
        criticalViolations,
        remediationProgress: Math.round(
          violations.filter(v => v.status === 'remediated').length / Math.max(1, violations.length) * 100
        )
      },
      securityEventAnalysis: {
        totalEvents: recentEvents.length,
        eventsByType,
        eventsBySeverity,
        topSourceIPs,
        topTargetedUsers,
        anomalousActivities
      },
      recommendations
    };
  };

  /**
   * Generate security recommendations
   */
  const generateSecurityRecommendations = (
    metrics: SecurityMetrics,
    threats: SecurityThreat[],
    violations: ComplianceViolation[],
    events: SecurityEvent[]
  ) => {
    const recommendations = {
      immediate: [] as Array<{
        priority: 'critical' | 'high';
        category: string;
        action: string;
        estimatedEffort: string;
        businessImpact: string;
      }>,
      shortTerm: [] as Array<{
        priority: 'medium' | 'high';
        category: string;
        action: string;
        estimatedEffort: string;
        businessImpact: string;
      }>,
      longTerm: [] as Array<{
        priority: 'low' | 'medium';
        category: string;
        action: string;
        estimatedEffort: string;
        businessImpact: string;
      }>
    };

    // Critical threats require immediate action
    const criticalThreats = threats.filter(t => t.severity === 'critical');
    if (criticalThreats.length > 0) {
      recommendations.immediate.push({
        priority: 'critical',
        category: 'Threat Response',
        action: `Address ${criticalThreats.length} critical security threat(s) immediately`,
        estimatedEffort: '2-4 hours',
        businessImpact: 'Prevents potential data breach and system compromise'
      });
    }

    // High-risk compliance violations
    const criticalViolations = violations.filter(v => v.severity === 'critical' && v.status === 'open');
    if (criticalViolations.length > 0) {
      recommendations.immediate.push({
        priority: 'critical',
        category: 'Compliance',
        action: `Remediate ${criticalViolations.length} critical compliance violation(s)`,
        estimatedEffort: '4-8 hours',
        businessImpact: 'Maintains regulatory compliance and avoids penalties'
      });
    }

    // High frequency of failed authentications
    const authFailures = events.filter(e => 
      e.type === 'authentication' && 
      e.details.success === false
    ).length;
    
    if (authFailures > 50) {
      recommendations.immediate.push({
        priority: 'high',
        category: 'Authentication Security',
        action: 'Implement additional authentication controls due to high failure rate',
        estimatedEffort: '1-2 days',
        businessImpact: 'Reduces risk of successful brute force attacks'
      });
    }

    // Medium-term recommendations
    if (metrics.riskScore > 60) {
      recommendations.shortTerm.push({
        priority: 'high',
        category: 'Risk Management',
        action: 'Implement comprehensive security monitoring improvements',
        estimatedEffort: '1-2 weeks',
        businessImpact: 'Reduces overall security risk and improves threat detection'
      });
    }

    if (metrics.complianceScore < 85) {
      recommendations.shortTerm.push({
        priority: 'medium',
        category: 'Compliance',
        action: 'Review and update compliance monitoring procedures',
        estimatedEffort: '3-5 days',
        businessImpact: 'Improves compliance posture and reduces audit risk'
      });
    }

    // Long-term recommendations
    recommendations.longTerm.push({
      priority: 'medium',
      category: 'Security Culture',
      action: 'Implement regular security awareness training program',
      estimatedEffort: '2-4 weeks',
      businessImpact: 'Reduces human error-based security incidents'
    });

    recommendations.longTerm.push({
      priority: 'low',
      category: 'Automation',
      action: 'Enhance automated threat detection and response capabilities',
      estimatedEffort: '1-2 months',
      businessImpact: 'Improves response times and reduces manual security operations'
    });

    return recommendations;
  };

  /**
   * Get filtered security events
   */
  const getSecurityEvents = useCallback((filter?: {
    type?: string;
    severity?: string;
    timeframe?: string;
    userId?: string;
  }) => {
    return securityMonitoringService.getSecurityEvents(filter);
  }, []);

  /**
   * Get filtered active threats
   */
  const getActiveThreats = useCallback((filter?: {
    type?: string;
    severity?: string;
    status?: string;
  }) => {
    const threats = securityMonitoringService.getActiveThreats();
    
    if (!filter) return threats;

    return threats.filter(threat => {
      if (filter.type && threat.type !== filter.type) return false;
      if (filter.severity && threat.severity !== filter.severity) return false;
      if (filter.status && threat.status !== filter.status) return false;
      return true;
    });
  }, []);

  /**
   * Get filtered compliance violations
   */
  const getComplianceViolations = useCallback((status?: string) => {
    return securityMonitoringService.getComplianceViolations(status);
  }, []);

  /**
   * Record a security event
   */
  const recordSecurityEvent = useCallback(async (eventData: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<void> => {
    try {
      const event: SecurityEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        ...eventData
      };

      await securityMonitoringService.recordSecurityEvent(event);

      // Refresh data to include new event
      await loadSecurityData();

      logger.info('Security event recorded successfully', {
        namespace: 'security_monitoring_hook',
        operation: 'record_security_event',
        classification: DataClassification.INTERNAL,
        metadata: {
          eventType: event.type,
          severity: event.severity,
          riskScore: event.riskScore
        }
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to record security event';
      setError(errorMessage);

      logger.error('Failed to record security event', {
        namespace: 'security_monitoring_hook',
        operation: 'record_security_event_error',
        classification: DataClassification.INTERNAL,
        error: errorMessage
      });
    }
  }, [loadSecurityData]);

  // Load initial data on mount
  useEffect(() => {
    loadSecurityData();

    // Cleanup function
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadSecurityData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    // Data
    securityMetrics,
    securityEvents,
    activeThreats,
    complianceViolations,
    securityReport,
    
    // State
    loading,
    error,
    lastUpdated,
    
    // Actions
    refreshData,
    generateSecurityReport,
    getSecurityEvents,
    getActiveThreats,
    getComplianceViolations,
    clearError,
    recordSecurityEvent
  };
};