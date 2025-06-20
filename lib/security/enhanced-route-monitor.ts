// lib/security/enhanced-route-monitor.ts - Advanced route monitoring and analytics
import { NextRequest } from "next/server";

import { soc2Logger, LogLevel, LogCategory, SOC2EventType } from "../logging/soc2-logger";

interface RouteMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  lastAccessed: number;
  uniqueUsers: Set<string>;
  authFailures: number;
  rateLimitHits: number;
}

interface SecurityAlert {
  id: string;
  type: 'suspicious_pattern' | 'rate_limit_exceeded' | 'auth_failure_spike' | 'unusual_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  route: string;
  userId?: string;
  ipAddress: string;
  timestamp: number;
  details: any;
}

class EnhancedRouteMonitor {
  private static instance: EnhancedRouteMonitor;
  private routeMetrics = new Map<string, RouteMetrics>();
  private userActivityCache = new Map<string, { lastActivity: number; requestCount: number }>();
  private suspiciousIPs = new Set<string>();
  private alerts: SecurityAlert[] = [];
  
  // Rate limiting thresholds
  private readonly RATE_LIMITS: { [key: string]: { requests: number; window: number } } = {
    '/api/auth/token': { requests: 10, window: 60000 }, // 10 requests per minute
    '/api/users': { requests: 50, window: 60000 }, // 50 requests per minute
    '/api/staff/create': { requests: 5, window: 300000 }, // 5 requests per 5 minutes
    '/api/audit/compliance-report': { requests: 3, window: 300000 }, // 3 requests per 5 minutes
    'default': { requests: 100, window: 60000 } // Default: 100 requests per minute
  };

  // Suspicious patterns
  private readonly SUSPICIOUS_PATTERNS = {
    rapidAuthFailures: 5, // 5 auth failures in short time
    unusualAccessTime: { start: 2, end: 6 }, // Access between 2-6 AM
    rapidRoleChanges: 3, // 3 role changes in short time
    bulkDataAccess: 1000 // Accessing more than 1000 records
  };

  private constructor() {
    this.startCleanupInterval();
    this.startAnalyticsInterval();
  }

  static getInstance(): EnhancedRouteMonitor {
    if (!EnhancedRouteMonitor.instance) {
      EnhancedRouteMonitor.instance = new EnhancedRouteMonitor();
    }
    return EnhancedRouteMonitor.instance;
  }

  /**
   * Monitor a route request
   */
  async monitorRequest(
    request: NextRequest,
    userId?: string,
    startTime?: number,
    success = true,
    responseData?: any
  ): Promise<void> {
    const route = this.normalizeRoute(request.nextUrl.pathname);
    const ipAddress = this.getClientIP(request);
    const now = Date.now();
    const duration = startTime ? now - startTime : 0;

    // Update route metrics
    this.updateRouteMetrics(route, userId, duration, success);

    // Check for rate limiting
    if (userId && this.isRateLimited(route, userId)) {
      await this.handleRateLimit(request, userId, route);
    }

    // Monitor for suspicious patterns
    await this.checkSuspiciousPatterns(request, userId, route, responseData);

    // Log significant events
    if (this.isSignificantRoute(route)) {
      await soc2Logger.log({
        level: success ? LogLevel.INFO : LogLevel.WARNING,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.DATA_VIEWED,
        message: `Route accessed: ${route}`,
        userId,
        metadata: {
          route,
          method: request.method,
          duration,
          success,
          ipAddress,
          userAgent: request.headers.get('user-agent'),
          dataSize: responseData ? JSON.stringify(responseData).length : 0
        }
      }, request);
    }
  }

  /**
   * Monitor authentication events
   */
  async monitorAuthEvent(
    request: NextRequest,
    eventType: 'login' | 'logout' | 'token_refresh' | 'auth_failure',
    userId?: string,
    metadata?: any
  ): Promise<void> {
    const ipAddress = this.getClientIP(request);
    
    // Check for auth failure patterns
    if (eventType === 'auth_failure') {
      await this.handleAuthFailure(request, ipAddress, metadata);
    }

    // Log auth events
    await soc2Logger.log({
      level: eventType === 'auth_failure' ? LogLevel.WARNING : LogLevel.INFO,
      category: LogCategory.AUTHENTICATION,
      eventType: eventType === 'login' ? SOC2EventType.LOGIN_SUCCESS : 
                 eventType === 'logout' ? SOC2EventType.LOGOUT :
                 eventType === 'auth_failure' ? SOC2EventType.LOGIN_FAILURE :
                 SOC2EventType.LOGIN_SUCCESS,
      message: `Authentication event: ${eventType}`,
      userId,
      metadata: {
        ...metadata,
        ipAddress,
        timestamp: Date.now()
      }
    }, request);
  }

  /**
   * Get route analytics
   */
  getRouteAnalytics(): { [route: string]: Omit<RouteMetrics, 'uniqueUsers'> & { uniqueUsers: number } } {
    const analytics: any = {};
    
    this.routeMetrics.forEach((metrics, route) => {
      analytics[route] = {
        ...metrics,
        uniqueUsers: metrics.uniqueUsers.size
      };
      delete analytics[route].uniqueUsers;
    });
    
    return analytics;
  }

  /**
   * Get security alerts
   */
  getSecurityAlerts(severity?: SecurityAlert['severity']): SecurityAlert[] {
    if (severity) {
      return this.alerts.filter(alert => alert.severity === severity);
    }
    return [...this.alerts];
  }

  /**
   * Get user activity summary
   */
  getUserActivitySummary(): { [userId: string]: { lastActivity: number; requestCount: number } } {
    return Object.fromEntries(this.userActivityCache.entries());
  }

  // Private methods

  private normalizeRoute(pathname: string): string {
    // Normalize dynamic routes
    return pathname
      .replace(/\/api\/users\/[^\/]+$/, '/api/users/[id]')
      .replace(/\/api\/payrolls\/[^\/]+$/, '/api/payrolls/[id]')
      .replace(/\/api\/payroll-dates\/[^\/]+$/, '/api/payroll-dates/[id]');
  }

  private getClientIP(request: NextRequest): string {
    return request.headers.get('x-forwarded-for')?.split(',')[0] ||
           request.headers.get('x-real-ip') ||
           request.headers.get('cf-connecting-ip') ||
           'unknown';
  }

  private updateRouteMetrics(route: string, userId?: string, duration = 0, success = true): void {
    if (!this.routeMetrics.has(route)) {
      this.routeMetrics.set(route, {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        lastAccessed: 0,
        uniqueUsers: new Set(),
        authFailures: 0,
        rateLimitHits: 0
      });
    }

    const metrics = this.routeMetrics.get(route)!;
    metrics.totalRequests++;
    metrics.lastAccessed = Date.now();

    if (success) {
      metrics.successfulRequests++;
    } else {
      metrics.failedRequests++;
    }

    if (userId) {
      metrics.uniqueUsers.add(userId);
    }

    // Update average response time
    if (duration > 0) {
      const totalTime = metrics.averageResponseTime * (metrics.totalRequests - 1) + duration;
      metrics.averageResponseTime = Math.round(totalTime / metrics.totalRequests);
    }
  }

  private isRateLimited(route: string, userId: string): boolean {
    const limits = this.RATE_LIMITS[route] || this.RATE_LIMITS.default;
    const userActivity = this.userActivityCache.get(userId);
    
    if (!userActivity) {
      this.userActivityCache.set(userId, { lastActivity: Date.now(), requestCount: 1 });
      return false;
    }

    const now = Date.now();
    const timeSinceLastActivity = now - userActivity.lastActivity;

    // Reset count if outside window
    if (timeSinceLastActivity > limits.window) {
      userActivity.requestCount = 1;
      userActivity.lastActivity = now;
      return false;
    }

    // Increment count
    userActivity.requestCount++;
    userActivity.lastActivity = now;

    return userActivity.requestCount > limits.requests;
  }

  private async handleRateLimit(request: NextRequest, userId: string, route: string): Promise<void> {
    const metrics = this.routeMetrics.get(route);
    if (metrics) {
      metrics.rateLimitHits++;
    }

    const alert: SecurityAlert = {
      id: crypto.randomUUID(),
      type: 'rate_limit_exceeded',
      severity: 'medium',
      route,
      userId,
      ipAddress: this.getClientIP(request),
      timestamp: Date.now(),
      details: {
        userActivity: this.userActivityCache.get(userId),
        limits: this.RATE_LIMITS[route] || this.RATE_LIMITS.default
      }
    };

    this.alerts.push(alert);
    
    await soc2Logger.log({
      level: LogLevel.WARNING,
      category: LogCategory.SECURITY_EVENT,
      eventType: SOC2EventType.RATE_LIMIT_EXCEEDED,
      message: `Rate limit exceeded for route: ${route}`,
      userId,
      metadata: alert.details
    }, request);
  }

  private async checkSuspiciousPatterns(
    request: NextRequest,
    userId?: string,
    route?: string,
    responseData?: any
  ): Promise<void> {
    const now = Date.now();
    const hour = new Date(now).getHours();
    const ipAddress = this.getClientIP(request);

    // Check for unusual access times
    if (hour >= this.SUSPICIOUS_PATTERNS.unusualAccessTime.start && 
        hour <= this.SUSPICIOUS_PATTERNS.unusualAccessTime.end) {
      await this.createAlert('unusual_access', 'low', route, userId, ipAddress, {
        accessTime: hour,
        reason: 'Access during unusual hours'
      }, request);
    }

    // Check for bulk data access
    if (responseData && Array.isArray(responseData.users) && 
        responseData.users.length > this.SUSPICIOUS_PATTERNS.bulkDataAccess) {
      await this.createAlert('suspicious_pattern', 'high', route, userId, ipAddress, {
        recordCount: responseData.users.length,
        reason: 'Bulk data access detected'
      }, request);
    }

    // Check for rapid auth failures
    if (!userId) {
      const recentFailures = this.alerts.filter(alert => 
        alert.ipAddress === ipAddress &&
        alert.type === 'auth_failure_spike' &&
        now - alert.timestamp < 300000 // 5 minutes
      ).length;

      if (recentFailures >= this.SUSPICIOUS_PATTERNS.rapidAuthFailures) {
        this.suspiciousIPs.add(ipAddress);
        await this.createAlert('auth_failure_spike', 'critical', route, userId, ipAddress, {
          failureCount: recentFailures,
          timeWindow: '5 minutes'
        }, request);
      }
    }
  }

  private async handleAuthFailure(request: NextRequest, ipAddress: string, metadata?: any): Promise<void> {
    const route = this.normalizeRoute(request.nextUrl.pathname);
    const metrics = this.routeMetrics.get(route);
    if (metrics) {
      metrics.authFailures++;
    }

    await this.createAlert('auth_failure_spike', 'medium', route, undefined, ipAddress, {
      ...metadata,
      reason: 'Authentication failure'
    }, request);
  }

  private async createAlert(
    type: SecurityAlert['type'],
    severity: SecurityAlert['severity'],
    route?: string,
    userId?: string,
    ipAddress?: string,
    details?: any,
    request?: NextRequest
  ): Promise<void> {
    const alert: SecurityAlert = {
      id: crypto.randomUUID(),
      type,
      severity,
      route: route || 'unknown',
      userId,
      ipAddress: ipAddress || 'unknown',
      timestamp: Date.now(),
      details
    };

    this.alerts.push(alert);

    // Keep only recent alerts (last 24 hours)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    this.alerts = this.alerts.filter(a => a.timestamp > oneDayAgo);

    if (request) {
      await soc2Logger.log({
        level: severity === 'critical' ? LogLevel.CRITICAL : 
               severity === 'high' ? LogLevel.ERROR :
               severity === 'medium' ? LogLevel.WARNING : LogLevel.INFO,
        category: LogCategory.SECURITY_EVENT,
        eventType: SOC2EventType.SUSPICIOUS_ACTIVITY,
        message: `Security alert: ${type}`,
        userId,
        metadata: {
          alertId: alert.id,
          severity,
          details
        }
      }, request);
    }
  }

  private isSignificantRoute(route: string): boolean {
    const significantRoutes = [
      '/api/users',
      '/api/staff/create',
      '/api/staff/delete',
      '/api/audit/compliance-report',
      '/api/admin/api-keys',
      '/api/payrolls'
    ];
    
    return significantRoutes.some(sr => route.startsWith(sr));
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      
      // Clean up old user activity
      const userIdsToDelete: string[] = [];
      
      this.userActivityCache.forEach((activity, userId) => {
        if (activity.lastActivity < oneDayAgo) {
          userIdsToDelete.push(userId);
        }
      });
      
      userIdsToDelete.forEach(userId => this.userActivityCache.delete(userId));

      // Clean up old alerts
      this.alerts = this.alerts.filter(alert => alert.timestamp > oneDayAgo);
      
      console.log(`🧹 Cleaned up old monitoring data`);
    }, 60 * 60 * 1000); // Run every hour
  }

  private startAnalyticsInterval(): void {
    setInterval(() => {
      const analytics = this.getRouteAnalytics();
      const alertCount = this.alerts.length;
      const suspiciousIPCount = this.suspiciousIPs.size;
      
      console.log(`📊 Route Analytics Summary:`, {
        totalRoutes: Object.keys(analytics).length,
        totalAlerts: alertCount,
        suspiciousIPs: suspiciousIPCount,
        mostActiveRoute: this.getMostActiveRoute(analytics)
      });
    }, 5 * 60 * 1000); // Run every 5 minutes
  }

  private getMostActiveRoute(analytics: any): string {
    let mostActive = '';
    let maxRequests = 0;
    
    for (const [route, metrics] of Object.entries(analytics) as [string, any][]) {
      if (metrics.totalRequests > maxRequests) {
        maxRequests = metrics.totalRequests;
        mostActive = route;
      }
    }
    
    return mostActive;
  }
}

// Export class and singleton instance
export { EnhancedRouteMonitor };
export const routeMonitor = EnhancedRouteMonitor.getInstance();

// Helper functions for easy integration
export const monitorRequest = (request: NextRequest, userId?: string, startTime?: number, success = true, responseData?: any) => 
  routeMonitor.monitorRequest(request, userId, startTime, success, responseData);

export const monitorAuthEvent = (request: NextRequest, eventType: 'login' | 'logout' | 'token_refresh' | 'auth_failure', userId?: string, metadata?: any) =>
  routeMonitor.monitorAuthEvent(request, eventType, userId, metadata);