// lib/security/auth-audit.ts - Authentication audit logging functions
import { NextRequest } from "next/server";

import { soc2Logger, LogLevel, LogCategory, SOC2EventType } from "../logging/soc2-logger";

/**
 * Log successful authentication events
 */
export async function logSuccessfulLogin(
  userId: string,
  userEmail: string,
  ipAddress: string,
  userAgent: string,
  request?: NextRequest,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await soc2Logger.log({
      level: LogLevel.AUDIT,
      category: LogCategory.AUTHENTICATION,
      eventType: SOC2EventType.LOGIN_SUCCESS,
      message: `Successful authentication for user ${userEmail}`,
      userId,
      userEmail,
      metadata: {
        ipAddress,
        userAgent,
        timestamp: new Date().toISOString(),
        authenticationMethod: 'clerk_jwt',
        sessionType: 'web',
        ...metadata
      }
    }, request);

    console.log(`✅ [AUTH AUDIT] Successful login logged for user: ${userId}`);
  } catch (error) {
    console.error('Failed to log successful authentication:', error);
    // Don't throw - logging failures shouldn't break auth flow
  }
}

/**
 * Log failed authentication events
 */
export async function logFailedLogin(
  attemptedEmail: string,
  ipAddress: string,
  userAgent: string,
  errorMessage: string,
  request?: NextRequest,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await soc2Logger.log({
      level: LogLevel.SECURITY,
      category: LogCategory.AUTHENTICATION,
      eventType: SOC2EventType.LOGIN_FAILURE,
      message: `Failed authentication attempt for ${attemptedEmail}: ${errorMessage}`,
      userEmail: attemptedEmail,
      metadata: {
        ipAddress,
        userAgent,
        errorMessage,
        timestamp: new Date().toISOString(),
        authenticationMethod: 'clerk_jwt',
        failureReason: categorizeAuthFailure(errorMessage),
        ...metadata
      }
    }, request);

    console.log(`🚨 [AUTH AUDIT] Failed login logged for email: ${attemptedEmail}`);
  } catch (error) {
    console.error('Failed to log failed authentication:', error);
    // Don't throw - logging failures shouldn't break auth flow
  }
}

/**
 * Log token refresh events
 */
export async function logTokenRefresh(
  userId: string,
  userEmail: string,
  ipAddress: string,
  userAgent: string,
  request?: NextRequest,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await soc2Logger.log({
      level: LogLevel.INFO,
      category: LogCategory.AUTHENTICATION,
      eventType: SOC2EventType.LOGIN_SUCCESS, // Token refresh is a form of re-authentication
      message: `Token refresh for user ${userEmail}`,
      userId,
      userEmail,
      metadata: {
        ipAddress,
        userAgent,
        timestamp: new Date().toISOString(),
        authenticationMethod: 'token_refresh',
        operation: 'token_refresh',
        ...metadata
      }
    }, request);

    console.log(`🔄 [AUTH AUDIT] Token refresh logged for user: ${userId}`);
  } catch (error) {
    console.error('Failed to log token refresh:', error);
  }
}

/**
 * Log logout events
 */
export async function logLogout(
  userId: string,
  userEmail: string,
  ipAddress: string,
  userAgent: string,
  request?: NextRequest,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await soc2Logger.log({
      level: LogLevel.AUDIT,
      category: LogCategory.AUTHENTICATION,
      eventType: SOC2EventType.LOGOUT,
      message: `User logout: ${userEmail}`,
      userId,
      userEmail,
      metadata: {
        ipAddress,
        userAgent,
        timestamp: new Date().toISOString(),
        logoutType: metadata?.logoutType || 'user_initiated',
        ...metadata
      }
    }, request);

    console.log(`👋 [AUTH AUDIT] Logout logged for user: ${userId}`);
  } catch (error) {
    console.error('Failed to log logout:', error);
  }
}

/**
 * Log session timeout events
 */
export async function logSessionTimeout(
  userId: string,
  userEmail: string,
  ipAddress: string,
  userAgent: string,
  request?: NextRequest,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await soc2Logger.log({
      level: LogLevel.WARNING,
      category: LogCategory.AUTHENTICATION,
      eventType: SOC2EventType.SESSION_TIMEOUT,
      message: `Session timeout for user ${userEmail}`,
      userId,
      userEmail,
      metadata: {
        ipAddress,
        userAgent,
        timestamp: new Date().toISOString(),
        timeoutReason: metadata?.timeoutReason || 'idle_timeout',
        sessionDuration: metadata?.sessionDuration,
        ...metadata
      }
    }, request);

    console.log(`⏰ [AUTH AUDIT] Session timeout logged for user: ${userId}`);
  } catch (error) {
    console.error('Failed to log session timeout:', error);
  }
}

/**
 * Log role/permission changes
 */
export async function logRoleChange(
  targetUserId: string,
  targetUserEmail: string,
  adminUserId: string,
  adminUserEmail: string,
  oldRole: string,
  newRole: string,
  ipAddress: string,
  userAgent: string,
  request?: NextRequest,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await soc2Logger.log({
      level: LogLevel.AUDIT,
      category: LogCategory.AUTHORIZATION,
      eventType: SOC2EventType.ROLE_ASSIGNED,
      message: `Role change: ${targetUserEmail} from ${oldRole} to ${newRole} by ${adminUserEmail}`,
      userId: adminUserId,
      userEmail: adminUserEmail,
      entityType: 'user',
      entityId: targetUserId,
      metadata: {
        targetUserId,
        targetUserEmail,
        oldRole,
        newRole,
        adminUserId,
        adminUserEmail,
        ipAddress,
        userAgent,
        timestamp: new Date().toISOString(),
        changeReason: metadata?.reason || 'administrative_action',
        ...metadata
      }
    }, request);

    console.log(`🔄 [AUTH AUDIT] Role change logged: ${targetUserEmail} ${oldRole} -> ${newRole}`);
  } catch (error) {
    console.error('Failed to log role change:', error);
  }
}

/**
 * Log unauthorized access attempts
 */
export async function logUnauthorizedAccess(
  attemptedResource: string,
  userId?: string,
  userEmail?: string,
  ipAddress?: string,
  userAgent?: string,
  request?: NextRequest,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await soc2Logger.log({
      level: LogLevel.SECURITY,
      category: LogCategory.SECURITY_EVENT,
      eventType: SOC2EventType.UNAUTHORIZED_ACCESS,
      message: `Unauthorized access attempt to ${attemptedResource}`,
      userId,
      userEmail,
      metadata: {
        attemptedResource,
        ipAddress,
        userAgent,
        timestamp: new Date().toISOString(),
        accessMethod: metadata?.accessMethod || 'api',
        userRole: metadata?.userRole,
        requiredRole: metadata?.requiredRole,
        ...metadata
      }
    }, request);

    console.log(`🚨 [AUTH AUDIT] Unauthorized access logged: ${attemptedResource}`);
  } catch (error) {
    console.error('Failed to log unauthorized access:', error);
  }
}

/**
 * Log MFA events
 */
export async function logMFAEvent(
  eventType: 'setup' | 'challenge' | 'success' | 'failure' | 'disabled',
  userId: string,
  userEmail: string,
  ipAddress: string,
  userAgent: string,
  request?: NextRequest,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const soc2EventType = {
      'setup': SOC2EventType.MFA_ENABLED,
      'challenge': SOC2EventType.MFA_CHALLENGE,
      'success': SOC2EventType.MFA_SUCCESS,
      'failure': SOC2EventType.MFA_CHALLENGE,
      'disabled': SOC2EventType.MFA_DISABLED
    }[eventType];

    const logLevel = eventType === 'failure' ? LogLevel.WARNING : LogLevel.AUDIT;

    await soc2Logger.log({
      level: logLevel,
      category: LogCategory.AUTHENTICATION,
      eventType: soc2EventType,
      message: `MFA ${eventType} for user ${userEmail}`,
      userId,
      userEmail,
      metadata: {
        ipAddress,
        userAgent,
        timestamp: new Date().toISOString(),
        mfaMethod: metadata?.mfaMethod || 'totp',
        mfaEventType: eventType,
        ...metadata
      }
    }, request);

    console.log(`🔐 [AUTH AUDIT] MFA ${eventType} logged for user: ${userId}`);
  } catch (error) {
    console.error('Failed to log MFA event:', error);
  }
}

/**
 * Helper function to categorize authentication failures
 */
function categorizeAuthFailure(errorMessage: string): string {
  const lowerError = errorMessage.toLowerCase();
  
  if (lowerError.includes('unauthorized') || lowerError.includes('no active session')) {
    return 'invalid_credentials';
  }
  if (lowerError.includes('forbidden') || lowerError.includes('insufficient')) {
    return 'insufficient_permissions';
  }
  if (lowerError.includes('token')) {
    return 'invalid_token';
  }
  if (lowerError.includes('expired')) {
    return 'expired_session';
  }
  if (lowerError.includes('rate limit')) {
    return 'rate_limited';
  }
  
  return 'unknown_error';
}

/**
 * Utility function to extract client info from request
 */
export function extractClientInfo(request: NextRequest): {
  ipAddress: string;
  userAgent: string;
} {
  const ipAddress = 
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown';
    
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return { ipAddress, userAgent };
}