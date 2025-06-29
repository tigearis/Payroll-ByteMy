/**
 * Simplified Role Monitoring
 * 
 * Basic role monitoring and security alerts.
 * Replaces the complex SOC2 role monitoring system.
 */

import { auditLogger } from './audit/logger';

export interface RoleEscalationAttempt {
  userId: string;
  currentRole: string;
  attemptedRole: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  context?: string;
}

export interface SecurityAlert {
  id: string;
  type: 'role_escalation' | 'suspicious_activity' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

class SimpleRoleMonitor {
  private alerts: SecurityAlert[] = [];

  /**
   * Log a role escalation attempt
   */
  async logRoleEscalationAttempt(attempt: RoleEscalationAttempt): Promise<void> {
    console.warn('🚨 Role escalation attempt detected:', attempt);

    // Create security alert
    const alert: SecurityAlert = {
      id: this.generateAlertId(),
      type: 'role_escalation',
      severity: 'high',
      userId: attempt.userId,
      description: `User attempted to escalate from ${attempt.currentRole} to ${attempt.attemptedRole}`,
      timestamp: attempt.timestamp,
      metadata: attempt,
    };

    this.alerts.push(alert);

    // Log to audit system
    await auditLogger.logSecurity(
      'permission_escalation',
      attempt.userId,
      {
        currentRole: attempt.currentRole,
        attemptedRole: attempt.attemptedRole,
        context: attempt.context,
        ipAddress: attempt.ipAddress,
        userAgent: attempt.userAgent,
      }
    );

    // In production, this would trigger real alerts (email, Slack, etc.)
    this.triggerAlert(alert);
  }

  /**
   * Monitor suspicious authentication patterns
   */
  async monitorAuthPattern(
    userId: string,
    pattern: 'multiple_failures' | 'unusual_location' | 'rapid_requests',
    metadata?: Record<string, any>
  ): Promise<void> {
    const alert: SecurityAlert = {
      id: this.generateAlertId(),
      type: 'suspicious_activity',
      severity: pattern === 'multiple_failures' ? 'high' : 'medium',
      userId,
      description: `Suspicious authentication pattern detected: ${pattern}`,
      timestamp: new Date().toISOString(),
      metadata,
    };

    this.alerts.push(alert);

    await auditLogger.logSecurity('suspicious_activity', userId, metadata);

    this.triggerAlert(alert);
  }

  /**
   * Check if user can access resource
   */
  canAccess(
    userRole: string,
    requiredRole: string,
    resource?: string
  ): boolean {
    const roleHierarchy: Record<string, number> = {
      viewer: 1,
      consultant: 2,
      manager: 3,
      org_admin: 4,
      developer: 5,
    };

    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    const hasAccess = userLevel >= requiredLevel;

    if (!hasAccess && resource) {
      // Log access denial
      auditLogger.logSecurity('access_denied', undefined, {
        userRole,
        requiredRole,
        resource,
      });
    }

    return hasAccess;
  }

  /**
   * Get recent security alerts
   */
  getRecentAlerts(limit: number = 10): SecurityAlert[] {
    return this.alerts
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * Get security metrics
   */
  getSecurityMetrics(): {
    totalAlerts: number;
    alertsByType: Record<string, number>;
    alertsBySeverity: Record<string, number>;
    recentEscalationAttempts: number;
  } {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentAlerts = this.alerts.filter(
      alert => new Date(alert.timestamp) > last24Hours
    );

    const alertsByType = this.alerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const alertsBySeverity = this.alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentEscalationAttempts = recentAlerts.filter(
      alert => alert.type === 'role_escalation'
    ).length;

    return {
      totalAlerts: this.alerts.length,
      alertsByType,
      alertsBySeverity,
      recentEscalationAttempts,
    };
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private triggerAlert(alert: SecurityAlert): void {
    // In production, this would send notifications
    console.warn('🚨 SECURITY ALERT:', {
      id: alert.id,
      type: alert.type,
      severity: alert.severity,
      description: alert.description,
      userId: alert.userId,
      timestamp: alert.timestamp,
    });

    // For critical alerts, you might want to:
    // - Send email notifications
    // - Post to Slack
    // - Trigger incident response
    if (alert.severity === 'critical') {
      console.error('🔥 CRITICAL SECURITY ALERT - IMMEDIATE ATTENTION REQUIRED');
    }
  }
}

// Export singleton instance
export const roleMonitor = new SimpleRoleMonitor();

// Export convenience functions
export const logRoleEscalationAttempt = roleMonitor.logRoleEscalationAttempt.bind(roleMonitor);
export const monitorAuthPattern = roleMonitor.monitorAuthPattern.bind(roleMonitor);
export const canAccess = roleMonitor.canAccess.bind(roleMonitor);
export const getRecentAlerts = roleMonitor.getRecentAlerts.bind(roleMonitor);
export const getSecurityMetrics = roleMonitor.getSecurityMetrics.bind(roleMonitor);

// Export types
export type { RoleEscalationAttempt, SecurityAlert };

// Backward compatibility
export { roleMonitor as monitor };
export default roleMonitor;