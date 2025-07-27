/**
 * SOC2 Audit Log Search and Reporting
 * 
 * Provides search functionality and compliance reporting for audit logs
 */

import { adminApolloClient } from '@/lib/apollo/unified-client';
import { gql } from '@apollo/client';

export interface AuditSearchFilter {
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  userId?: string;
  userEmail?: string;
  action?: string;
  resourceType?: string;
  success?: boolean;
  ipAddress?: string;
  limit?: number;
  offset?: number;
}

export interface AuthEventSearchFilter {
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  userId?: string;
  userEmail?: string;
  eventType?: string;
  success?: boolean;
  ipAddress?: string;
  limit?: number;
  offset?: number;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
  metadata?: any;
  oldValues?: any;
  newValues?: any;
  createdAt: string;
  eventTime?: string;
}

export interface AuthEventEntry {
  id: string;
  eventType: string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  failureReason?: string;
  metadata?: any;
  eventTime: string;
  createdAt: string;
}

// GraphQL queries for audit search
const SEARCH_AUDIT_LOGS = gql`
  query SearchAuditLogs(
    $where: auditLogs_bool_exp
    $limit: Int
    $offset: Int
    $orderBy: [auditLogs_order_by!]
  ) {
    auditLogs(
      where: $where
      limit: $limit
      offset: $offset
      order_by: $orderBy
    ) {
      id
      action
      resourceType
      resourceId
      userId
      ipAddress
      userAgent
      success
      errorMessage
      metadata
      oldValues
      newValues
      createdAt
      eventTime
    }
    auditLogsAggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

const SEARCH_AUTH_EVENTS = gql`
  query SearchAuthEvents(
    $where: authEvents_bool_exp
    $limit: Int
    $offset: Int
    $orderBy: [authEvents_order_by!]
  ) {
    authEvents(
      where: $where
      limit: $limit
      offset: $offset
      order_by: $orderBy
    ) {
      id
      eventType
      userId
      userEmail
      ipAddress
      userAgent
      success
      failureReason
      metadata
      eventTime
      createdAt
    }
    authEventsAggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

/**
 * Search audit logs with filtering and pagination
 */
export async function searchAuditLogs(
  filter: AuditSearchFilter
): Promise<{ logs: AuditLogEntry[]; total: number }> {
  try {
    const where: any = {};
    
    // Date range filter
    if (filter.dateRange) {
      where.createdAt = {
        _gte: filter.dateRange.startDate,
        _lte: filter.dateRange.endDate,
      };
    }
    
    // User filter
    if (filter.userId) {
      where.userId = { _eq: filter.userId };
    }
    
    // Action filter
    if (filter.action) {
      where.action = { _ilike: `%${filter.action}%` };
    }
    
    // Resource type filter
    if (filter.resourceType) {
      where.resourceType = { _eq: filter.resourceType };
    }
    
    // Success filter
    if (filter.success !== undefined) {
      where.success = { _eq: filter.success };
    }
    
    // IP address filter
    if (filter.ipAddress) {
      where.ipAddress = { _eq: filter.ipAddress };
    }

    const { data } = await adminApolloClient.query({
      query: SEARCH_AUDIT_LOGS,
      variables: {
        where,
        limit: filter.limit || 50,
        offset: filter.offset || 0,
        orderBy: [{ createdAt: 'desc' }],
      },
      fetchPolicy: 'network-only',
    });

    return {
      logs: data.auditLogs || [],
      total: data.auditLogsAggregate?.aggregate?.count || 0,
    };
  } catch (error) {
    console.error('Error searching audit logs:', error);
    throw new Error('Failed to search audit logs');
  }
}

/**
 * Search authentication events with filtering and pagination
 */
export async function searchAuthEvents(
  filter: AuthEventSearchFilter
): Promise<{ events: AuthEventEntry[]; total: number }> {
  try {
    const where: any = {};
    
    // Date range filter
    if (filter.dateRange) {
      where.eventTime = {
        _gte: filter.dateRange.startDate,
        _lte: filter.dateRange.endDate,
      };
    }
    
    // User filter
    if (filter.userId) {
      where.userId = { _eq: filter.userId };
    }
    
    // User email filter
    if (filter.userEmail) {
      where.userEmail = { _ilike: `%${filter.userEmail}%` };
    }
    
    // Event type filter
    if (filter.eventType) {
      where.eventType = { _eq: filter.eventType };
    }
    
    // Success filter
    if (filter.success !== undefined) {
      where.success = { _eq: filter.success };
    }
    
    // IP address filter
    if (filter.ipAddress) {
      where.ipAddress = { _eq: filter.ipAddress };
    }

    const { data } = await adminApolloClient.query({
      query: SEARCH_AUTH_EVENTS,
      variables: {
        where,
        limit: filter.limit || 50,
        offset: filter.offset || 0,
        orderBy: [{ eventTime: 'desc' }],
      },
      fetchPolicy: 'network-only',
    });

    return {
      events: data.authEvents || [],
      total: data.authEventsAggregate?.aggregate?.count || 0,
    };
  } catch (error) {
    console.error('Error searching auth events:', error);
    throw new Error('Failed to search authentication events');
  }
}

/**
 * Generate SOC2 compliance reports
 */
export class SOC2ComplianceReporter {
  /**
   * Generate user activity report for a specific time period
   */
  async generateUserActivityReport(
    startDate: string,
    endDate: string,
    userId?: string
  ): Promise<{
    auditLogs: AuditLogEntry[];
    authEvents: AuthEventEntry[];
    summary: {
      totalActions: number;
      successfulActions: number;
      failedActions: number;
      loginAttempts: number;
      successfulLogins: number;
      failedLogins: number;
    };
  }> {
    const auditResult = await searchAuditLogs({
      dateRange: { startDate, endDate },
      userId,
      limit: 1000,
    });
    
    const authResult = await searchAuthEvents({
      dateRange: { startDate, endDate },
      userId,
      limit: 1000,
    });

    const summary = {
      totalActions: auditResult.logs.length,
      successfulActions: auditResult.logs.filter(log => log.success).length,
      failedActions: auditResult.logs.filter(log => !log.success).length,
      loginAttempts: authResult.events.filter(event => 
        event.eventType === 'LOGIN' || event.eventType === 'LOGIN_FAILED'
      ).length,
      successfulLogins: authResult.events.filter(event => 
        event.eventType === 'LOGIN' && event.success
      ).length,
      failedLogins: authResult.events.filter(event => 
        event.eventType === 'LOGIN_FAILED' || (event.eventType === 'LOGIN' && !event.success)
      ).length,
    };

    return {
      auditLogs: auditResult.logs,
      authEvents: authResult.events,
      summary,
    };
  }

  /**
   * Generate security incidents report
   */
  async generateSecurityIncidentsReport(
    startDate: string,
    endDate: string
  ): Promise<{
    failedLogins: AuthEventEntry[];
    permissionDenials: AuditLogEntry[];
    failedActions: AuditLogEntry[];
    suspiciousIpAddresses: string[];
  }> {
    const authResult = await searchAuthEvents({
      dateRange: { startDate, endDate },
      success: false,
      limit: 1000,
    });
    
    const auditResult = await searchAuditLogs({
      dateRange: { startDate, endDate },
      success: false,
      limit: 1000,
    });

    // Extract suspicious IP addresses (multiple failed attempts)
    const ipFailureCounts = new Map<string, number>();
    [...authResult.events, ...auditResult.logs].forEach(event => {
      if (event.ipAddress && !event.success) {
        ipFailureCounts.set(event.ipAddress, (ipFailureCounts.get(event.ipAddress) || 0) + 1);
      }
    });
    
    const suspiciousIpAddresses = Array.from(ipFailureCounts.entries())
      .filter(([, count]) => count >= 5)
      .map(([ip]) => ip);

    return {
      failedLogins: authResult.events,
      permissionDenials: auditResult.logs.filter(log => 
        log.action.includes('PERMISSION_DENIED') || log.errorMessage?.includes('Access denied')
      ),
      failedActions: auditResult.logs,
      suspiciousIpAddresses,
    };
  }

  /**
   * Generate data access compliance report
   */
  async generateDataAccessReport(
    startDate: string,
    endDate: string,
    resourceType?: string
  ): Promise<{
    dataAccess: AuditLogEntry[];
    dataModifications: AuditLogEntry[];
    resourceAccessSummary: Record<string, number>;
    userAccessSummary: Record<string, number>;
  }> {
    const auditResult = await searchAuditLogs({
      dateRange: { startDate, endDate },
      resourceType,
      limit: 5000,
    });

    const dataAccess = auditResult.logs.filter(log => 
      ['READ', 'LIST', 'SEARCH'].includes(log.action)
    );
    
    const dataModifications = auditResult.logs.filter(log => 
      ['CREATE', 'UPDATE', 'DELETE'].includes(log.action)
    );

    // Generate summaries
    const resourceAccessSummary: Record<string, number> = {};
    const userAccessSummary: Record<string, number> = {};

    auditResult.logs.forEach(log => {
      if (log.resourceType) {
        resourceAccessSummary[log.resourceType] = (resourceAccessSummary[log.resourceType] || 0) + 1;
      }
      if (log.userId) {
        userAccessSummary[log.userId] = (userAccessSummary[log.userId] || 0) + 1;
      }
    });

    return {
      dataAccess,
      dataModifications,
      resourceAccessSummary,
      userAccessSummary,
    };
  }
}

export const soc2Reporter = new SOC2ComplianceReporter();