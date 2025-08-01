/**
 * API Audit Middleware for SOC2 Compliance
 * 
 * Automatically logs all API requests and responses for audit trail
 */

import { NextRequest, NextResponse } from 'next/server';
import { auditLogger } from './audit-logger';
import { auth } from '@clerk/nextjs/server';

export interface ApiAuditEvent {
  method: string;
  path: string;
  userId?: string;
  userEmail?: string;
  statusCode: number;
  responseTime: number;
  ipAddress: string;
  userAgent: string;
  requestId?: string;
  requestBody?: any;
  responseBody?: any;
  error?: string;
}

/**
 * Audit middleware for API routes
 * Logs all API requests with user context and performance metrics
 */
export async function auditApiRequest(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const startTime = Date.now();
  const context = auditLogger.extractRequestContext(request);
  
  // Get user authentication context
  let userId: string | undefined;
  let userEmail: string | undefined;
  
  try {
    const { userId: authUserId, sessionClaims } = await auth();
    userId = authUserId || undefined;
    userEmail = sessionClaims?.email as string | undefined;
  } catch (error) {
    // Not authenticated or auth error - continue without user context
  }

  let response: NextResponse;
  let error: string | undefined;
  
  try {
    // Execute the actual API handler
    response = await handler(request);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
    response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }

  const responseTime = Date.now() - startTime;
  
  // Log the API request for audit trail
  const auditEvent: ApiAuditEvent = {
    method: request.method,
    path: request.nextUrl.pathname,
    ...(userId && { userId }),
    ...(userEmail && { userEmail }),
    statusCode: response.status,
    responseTime,
    ...(error && { error }),
    ...context,
  };

  // Log to audit system
  try {
    await auditLogger.log({
      ...(userId && { userId }),
      action: `API_${request.method}`,
      entityType: 'api_request',
      entityId: request.nextUrl.pathname,
      success: response.status < 400,
      ...(error && { errorMessage: error }),
      metadata: {
        method: request.method,
        path: request.nextUrl.pathname,
        statusCode: response.status,
        responseTime,
        ...(userEmail && { userEmail }),
      },
      ...context,
    });
  } catch (auditError) {
    console.error('Failed to log API audit event:', auditError);
  }

  // Add audit headers to response
  response.headers.set('X-Audit-Logged', 'true');
  response.headers.set('X-Response-Time', `${responseTime}ms`);
  
  return response;
}

/**
 * Audit wrapper for API route handlers
 * Use this to wrap your API route handlers for automatic audit logging
 */
export function withAudit(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    return auditApiRequest(request, handler);
  };
}

/**
 * Audit authentication events
 */
export async function auditAuthEvent(
  eventType: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'PERMISSION_DENIED',
  request: NextRequest,
  userContext?: { userId?: string; userEmail?: string },
  error?: string
) {
  const context = auditLogger.extractRequestContext(request);
  
  try {
    await auditLogger.logAuthEvent({
      eventType,
      ...(userContext?.userId && { userId: userContext.userId }),
      ...(userContext?.userEmail && { userEmail: userContext.userEmail }),
      success: eventType !== 'LOGIN_FAILED' && eventType !== 'PERMISSION_DENIED',
      ...(error && { failureReason: error }),
      metadata: {
        path: request.nextUrl.pathname,
        method: request.method,
      },
      ...context,
    });
  } catch (auditError) {
    console.error('Failed to log auth audit event:', auditError);
  }
}

/**
 * Audit data access events
 */
export async function auditDataAccess(
  request: NextRequest,
  action: 'READ' | 'LIST' | 'SEARCH',
  resourceType: string,
  resourceId?: string,
  userContext?: { userId?: string; userEmail?: string }
) {
  const context = auditLogger.extractRequestContext(request);
  
  try {
    await auditLogger.dataAccess(
      userContext?.userId || 'anonymous',
      action,
      resourceType,
      resourceId,
      context
    );
  } catch (auditError) {
    console.error('Failed to log data access audit event:', auditError);
  }
}

/**
 * Audit data modification events
 */
export async function auditDataModification(
  request: NextRequest,
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  resourceType: string,
  resourceId: string,
  userContext?: { userId?: string; userEmail?: string },
  oldValues?: Record<string, any>,
  newValues?: Record<string, any>
) {
  const context = auditLogger.extractRequestContext(request);
  
  try {
    await auditLogger.dataModification(
      userContext?.userId || 'anonymous',
      action,
      resourceType,
      resourceId,
      oldValues,
      newValues,
      context
    );
  } catch (auditError) {
    console.error('Failed to log data modification audit event:', auditError);
  }
}