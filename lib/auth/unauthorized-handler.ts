/**
 * Unauthorized Access Handler
 * 
 * Provides utilities for handling unauthorized access attempts
 * and managing access denied scenarios.
 */

import type { UserRole } from "@/lib/permissions/hierarchical-permissions";

export interface UnauthorizedContext {
  userId?: string;
  userRole?: UserRole;
  requiredPermission?: string;
  requiredRole?: UserRole;
  resource?: string;
  action?: string;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
}

export interface UnauthorizedResponse {
  type: 'redirect' | 'modal' | 'toast' | 'inline';
  message: string;
  details?: string;
  redirectUrl?: string;
  retryAction?: () => void;
  contactSupport?: boolean;
}

/**
 * Handle unauthorized access attempts
 */
export function handleUnauthorizedAccess(context: UnauthorizedContext): UnauthorizedResponse {
  // Log the unauthorized access attempt
  logUnauthorizedAccess(context);

  // Determine the appropriate response based on context
  const response = determineUnauthorizedResponse(context);
  
  return response;
}

/**
 * Log unauthorized access attempts for security monitoring
 */
function logUnauthorizedAccess(context: UnauthorizedContext): void {
  const logEntry = {
    event: 'unauthorized_access',
    timestamp: context.timestamp.toISOString(),
    userId: context.userId || 'anonymous',
    userRole: context.userRole || 'none',
    requiredPermission: context.requiredPermission,
    requiredRole: context.requiredRole,
    resource: context.resource,
    action: context.action,
    userAgent: context.userAgent,
    ip: context.ip,
  };

  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.warn('🚫 Unauthorized access attempt:', logEntry);
  }

  // In production, this would typically send to an audit logging service
  // TODO: Integrate with audit logging system
}

/**
 * Determine the appropriate response for unauthorized access
 */
function determineUnauthorizedResponse(context: UnauthorizedContext): UnauthorizedResponse {
  const { userRole, requiredPermission, requiredRole, resource, action } = context;

  // User not authenticated
  if (!userRole) {
    return {
      type: 'redirect',
      message: 'Authentication required',
      details: 'You must sign in to access this resource.',
      redirectUrl: '/sign-in',
    };
  }

  // User has insufficient role
  if (requiredRole && userRole) {
    const roleHierarchy: Record<UserRole, number> = {
      viewer: 1,
      consultant: 2,
      manager: 3,
      org_admin: 4,
      developer: 5
    };

    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    if (userLevel < requiredLevel) {
      return {
        type: 'inline',
        message: 'Insufficient access level',
        details: `You need ${requiredRole} access or higher. Your current role: ${userRole}`,
        contactSupport: true,
      };
    }
  }

  // User lacks specific permission
  if (requiredPermission) {
    return {
      type: 'inline',
      message: 'Access denied',
      details: `You don't have permission to ${action || 'access'} ${resource || 'this resource'}.`,
      contactSupport: true,
    };
  }

  // Generic access denied
  return {
    type: 'inline',
    message: 'Access denied',
    details: 'You don\'t have permission to access this resource.',
    contactSupport: true,
  };
}

/**
 * Create unauthorized context from current environment
 */
export function createUnauthorizedContext(
  userRole?: UserRole,
  requiredPermission?: string,
  requiredRole?: UserRole,
  resource?: string,
  action?: string
): UnauthorizedContext {
  return {
    userRole: userRole || 'viewer',
    ...(requiredPermission && { requiredPermission }),
    ...(requiredRole && { requiredRole }),
    ...(resource && { resource }),
    ...(action && { action }),
    timestamp: new Date(),
    ...(typeof window !== 'undefined' && window.navigator.userAgent && { 
      userAgent: window.navigator.userAgent 
    }),
    // IP would typically be extracted from request headers on server side
  };
}

/**
 * Handle unauthorized API access
 */
export function handleUnauthorizedApiAccess(
  context: Omit<UnauthorizedContext, 'timestamp'>
): Response {
  const fullContext: UnauthorizedContext = {
    ...context,
    timestamp: new Date(),
  };

  logUnauthorizedAccess(fullContext);

  const statusCode = context.userRole ? 403 : 401;
  const message = context.userRole 
    ? 'Forbidden: Insufficient permissions'
    : 'Unauthorized: Authentication required';

  return new Response(
    JSON.stringify({
      error: message,
      code: context.userRole ? 'FORBIDDEN' : 'UNAUTHORIZED',
      details: context.requiredPermission || context.requiredRole,
      timestamp: fullContext.timestamp.toISOString(),
    }),
    {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Unauthorized access error class
 */
export class UnauthorizedError extends Error {
  public readonly code: string;
  public readonly context: UnauthorizedContext;

  constructor(
    message: string,
    context: UnauthorizedContext,
    code: string = 'UNAUTHORIZED'
  ) {
    super(message);
    this.name = 'UnauthorizedError';
    this.code = code;
    this.context = context;
  }
}

/**
 * Permission denied error class
 */
export class PermissionDeniedError extends UnauthorizedError {
  constructor(
    permission: string,
    context: Omit<UnauthorizedContext, 'timestamp' | 'requiredPermission'>
  ) {
    const fullContext: UnauthorizedContext = {
      ...context,
      requiredPermission: permission,
      timestamp: new Date(),
    };

    super(
      `Permission denied: ${permission}`,
      fullContext,
      'PERMISSION_DENIED'
    );
  }
}

/**
 * Insufficient role error class
 */
export class InsufficientRoleError extends UnauthorizedError {
  constructor(
    requiredRole: UserRole,
    context: Omit<UnauthorizedContext, 'timestamp' | 'requiredRole'>
  ) {
    const fullContext: UnauthorizedContext = {
      ...context,
      requiredRole,
      timestamp: new Date(),
    };

    super(
      `Insufficient role: ${requiredRole} required`,
      fullContext,
      'INSUFFICIENT_ROLE'
    );
  }
}

/**
 * Utility functions for common unauthorized scenarios
 */
export const UnauthorizedHandlers = {
  handleUnauthorizedAccess,
  createUnauthorizedContext,
  handleUnauthorizedApiAccess,
  logUnauthorizedAccess,
};

// Error classes already exported above - removing duplicate exports