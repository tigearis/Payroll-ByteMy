/**
 * Role Security Monitoring
 * Monitors and alerts on suspicious role-related activities
 */

import { auditLogger, LogLevel, SOC2EventType, LogCategory } from './audit/logger';
import { Role, getAllowedRoles, hasRoleLevel } from '../auth/permissions';
import { adminApolloClient } from '../apollo/unified-client';
import { gql } from '@apollo/client';

export interface RoleMismatchEvent {
  userId: string;
  clerkUserId: string;
  jwtRole: string;
  databaseRole: string;
  requestPath: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export interface RoleEscalationAttempt {
  userId: string;
  currentRole: string;
  attemptedRole: string;
  allowedRoles: string[];
  requestPath: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export interface SecurityAlert {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: string;
  message: string;
  userId: string;
  metadata: any;
  timestamp: Date;
}

/**
 * Monitors role mismatches between JWT and database
 */
export async function monitorRoleMismatch(event: RoleMismatchEvent): Promise<void> {
  console.warn('🚨 Role mismatch detected:', {
    userId: event.userId,
    jwtRole: event.jwtRole,
    databaseRole: event.databaseRole,
    path: event.requestPath
  });

  // Log security event
  await auditLogger.logSOC2Event({
    level: LogLevel.WARNING,
    eventType: SOC2EventType.SECURITY_VIOLATION,
    category: LogCategory.SECURITY_EVENT,
    complianceNote: 'Role mismatch detected between JWT claims and database',
    success: false,
    userId: event.userId,
    resourceType: 'role_validation',
    action: 'role_mismatch',
    metadata: {
      jwtRole: event.jwtRole,
      databaseRole: event.databaseRole,
      clerkUserId: event.clerkUserId,
      requestPath: event.requestPath,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      severity: determineRoleMismatchSeverity(event.jwtRole, event.databaseRole)
    }
  });

  // Create security alert if severity is high
  const severity = determineRoleMismatchSeverity(event.jwtRole, event.databaseRole);
  if (severity === 'HIGH' || severity === 'CRITICAL') {
    await createSecurityAlert({
      level: severity,
      type: 'ROLE_MISMATCH',
      message: `Critical role mismatch: JWT claims ${event.jwtRole} but database has ${event.databaseRole}`,
      userId: event.userId,
      metadata: event,
      timestamp: event.timestamp
    });
  }

  // Increment role mismatch counter for pattern detection
  await incrementSecurityMetric('role_mismatch', event.userId);
}

/**
 * Monitors role escalation attempts
 */
export async function monitorRoleEscalation(attempt: RoleEscalationAttempt): Promise<void> {
  console.error('🔥 Role escalation attempt detected:', {
    userId: attempt.userId,
    currentRole: attempt.currentRole,
    attemptedRole: attempt.attemptedRole,
    path: attempt.requestPath
  });

  // Log security event
  await auditLogger.logSOC2Event({
    level: LogLevel.ERROR,
    eventType: SOC2EventType.SECURITY_VIOLATION,
    category: LogCategory.SECURITY_EVENT,
    complianceNote: 'Unauthorized role escalation attempt detected',
    success: false,
    userId: attempt.userId,
    resourceType: 'role_escalation',
    action: 'escalation_attempt',
    metadata: {
      currentRole: attempt.currentRole,
      attemptedRole: attempt.attemptedRole,
      allowedRoles: attempt.allowedRoles,
      requestPath: attempt.requestPath,
      ipAddress: attempt.ipAddress,
      userAgent: attempt.userAgent,
      escalationLevel: calculateEscalationLevel(attempt.currentRole, attempt.attemptedRole)
    }
  });

  // Always create critical alert for escalation attempts
  await createSecurityAlert({
    level: 'CRITICAL',
    type: 'ROLE_ESCALATION',
    message: `User attempted to escalate from ${attempt.currentRole} to ${attempt.attemptedRole}`,
    userId: attempt.userId,
    metadata: attempt,
    timestamp: attempt.timestamp
  });

  // Increment escalation counter
  await incrementSecurityMetric('role_escalation', attempt.userId);
  
  // Check for repeated attempts (potential attack)
  const recentAttempts = await getSecurityMetricCount('role_escalation', attempt.userId, 3600); // 1 hour
  if (recentAttempts >= 3) {
    await createSecurityAlert({
      level: 'CRITICAL',
      type: 'REPEATED_ESCALATION',
      message: `Multiple role escalation attempts detected: ${recentAttempts} in last hour`,
      userId: attempt.userId,
      metadata: { recentAttempts, timeWindow: '1 hour' },
      timestamp: new Date()
    });
  }
}

/**
 * Monitors suspicious authentication patterns
 */
export async function monitorAuthenticationPattern(
  userId: string,
  eventType: 'login' | 'token_refresh' | 'role_change',
  metadata: any
): Promise<void> {
  // Check for rapid role changes
  if (eventType === 'role_change') {
    const recentChanges = await getSecurityMetricCount('role_change', userId, 1800); // 30 minutes
    if (recentChanges >= 3) {
      await createSecurityAlert({
        level: 'HIGH',
        type: 'RAPID_ROLE_CHANGES',
        message: `Suspicious pattern: ${recentChanges} role changes in 30 minutes`,
        userId,
        metadata: { recentChanges, ...metadata },
        timestamp: new Date()
      });
    }
  }

  // Check for token refresh anomalies
  if (eventType === 'token_refresh') {
    const recentRefreshes = await getSecurityMetricCount('token_refresh', userId, 300); // 5 minutes
    if (recentRefreshes >= 10) {
      await createSecurityAlert({
        level: 'MEDIUM',
        type: 'EXCESSIVE_TOKEN_REFRESH',
        message: `Unusual token refresh pattern: ${recentRefreshes} refreshes in 5 minutes`,
        userId,
        metadata: { recentRefreshes, ...metadata },
        timestamp: new Date()
      });
    }
  }

  await incrementSecurityMetric(eventType, userId);
}

/**
 * Helper functions
 */
function determineRoleMismatchSeverity(jwtRole: string, databaseRole: string): SecurityAlert['level'] {
  // Higher privileges in JWT than database is more critical
  if (hasRoleLevel(jwtRole as Role, 'org_admin') && !hasRoleLevel(databaseRole as Role, 'org_admin')) {
    return 'CRITICAL';
  }
  
  if (hasRoleLevel(jwtRole as Role, 'manager') && !hasRoleLevel(databaseRole as Role, 'manager')) {
    return 'HIGH';
  }
  
  return 'MEDIUM';
}

function calculateEscalationLevel(currentRole: string, attemptedRole: string): number {
  const roleValues = { viewer: 1, consultant: 2, manager: 3, org_admin: 4, developer: 5 };
  const current = roleValues[currentRole as keyof typeof roleValues] || 0;
  const attempted = roleValues[attemptedRole as keyof typeof roleValues] || 0;
  return attempted - current;
}

async function createSecurityAlert(alert: SecurityAlert): Promise<void> {
  console.error(`🚨 SECURITY ALERT [${alert.level}]: ${alert.message}`);
  
  // Store alert in database for dashboard/monitoring
  const CREATE_ALERT = gql`
    mutation CreateSecurityAlert(
      $level: String!
      $type: String!
      $message: String!
      $userId: String!
      $metadata: jsonb!
    ) {
      insertSecurityAlert(
        object: {
          level: $level
          type: $type
          message: $message
          userId: $userId
          metadata: $metadata
          createdAt: "now()"
          resolved: false
        }
      ) {
        id
        createdAt
      }
    }
  `;

  try {
    await adminApolloClient.mutate({
      mutation: CREATE_ALERT,
      variables: {
        level: alert.level,
        type: alert.type,
        message: alert.message,
        userId: alert.userId,
        metadata: alert.metadata
      }
    });
  } catch (error) {
    console.error('Failed to store security alert:', error);
    // Continue execution - alerting failure shouldn't break the app
  }

  // For critical alerts, also send to external monitoring
  if (alert.level === 'CRITICAL') {
    await sendCriticalAlert(alert);
  }
}

async function incrementSecurityMetric(metricType: string, userId: string): Promise<void> {
  const INCREMENT_METRIC = gql`
    mutation IncrementSecurityMetric(
      $metricType: String!
      $userId: String!
    ) {
      insertSecurityMetric(
        object: {
          metricType: $metricType
          userId: $userId
          timestamp: "now()"
        }
      ) {
        id
      }
    }
  `;

  try {
    await adminApolloClient.mutate({
      mutation: INCREMENT_METRIC,
      variables: { metricType, userId }
    });
  } catch (error) {
    console.error('Failed to increment security metric:', error);
  }
}

async function getSecurityMetricCount(
  metricType: string, 
  userId: string, 
  timeWindowSeconds: number
): Promise<number> {
  const GET_METRIC_COUNT = gql`
    query GetSecurityMetricCount(
      $metricType: String!
      $userId: String!
      $since: timestamptz!
    ) {
      securityMetricsAggregate(
        where: {
          metricType: { _eq: $metricType }
          userId: { _eq: $userId }
          timestamp: { _gte: $since }
        }
      ) {
        aggregate {
          count
        }
      }
    }
  `;

  try {
    const since = new Date(Date.now() - timeWindowSeconds * 1000).toISOString();
    const { data } = await adminApolloClient.query({
      query: GET_METRIC_COUNT,
      variables: { metricType, userId, since }
    });
    
    return data?.securityMetricsAggregate?.aggregate?.count || 0;
  } catch (error) {
    console.error('Failed to get security metric count:', error);
    return 0;
  }
}

async function sendCriticalAlert(alert: SecurityAlert): Promise<void> {
  // Placeholder for external alerting (Slack, PagerDuty, email, etc.)
  console.error('🚨🚨🚨 CRITICAL SECURITY ALERT 🚨🚨🚨');
  console.error(`Type: ${alert.type}`);
  console.error(`Message: ${alert.message}`);
  console.error(`User: ${alert.userId}`);
  console.error(`Time: ${alert.timestamp.toISOString()}`);
  
  // In production, integrate with:
  // - Slack webhooks
  // - PagerDuty API
  // - Email alerts
  // - SMS alerts
  // - Security team notifications
}

/**
 * Role validation wrapper with monitoring
 */
export async function validateRoleWithMonitoring(
  userId: string,
  clerkUserId: string,
  jwtRole: string,
  databaseRole: string,
  context: {
    requestPath: string;
    ipAddress: string;
    userAgent: string;
  }
): Promise<{ isValid: boolean; warnings: string[] }> {
  const warnings: string[] = [];
  
  // Check for role mismatch
  if (jwtRole !== databaseRole) {
    await monitorRoleMismatch({
      userId,
      clerkUserId,
      jwtRole,
      databaseRole,
      requestPath: context.requestPath,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      timestamp: new Date()
    });
    
    warnings.push(`Role mismatch: JWT=${jwtRole}, DB=${databaseRole}`);
    
    // Fail validation for critical mismatches
    const severity = determineRoleMismatchSeverity(jwtRole, databaseRole);
    if (severity === 'CRITICAL') {
      return { isValid: false, warnings };
    }
  }
  
  return { isValid: true, warnings };
}

/**
 * Export monitoring functions for use in middleware and API routes
 */
export const roleSecurityMonitor = {
  monitorRoleMismatch,
  monitorRoleEscalation,
  monitorAuthenticationPattern,
  validateRoleWithMonitoring,
  createSecurityAlert
};