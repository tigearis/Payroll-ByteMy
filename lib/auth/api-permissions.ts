/**
 * API Permission Protection
 * 
 * Secure middleware functions for protecting API routes with permission checks.
 * Uses hash-based permission verification for enhanced security.
 */

import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { hasRoleLevel } from '@/lib/auth/simple-permissions';
import { 
  type UserRole,
  hasHierarchicalPermission,
  hasAnyHierarchicalPermission,
  getEffectivePermissions
} from '@/lib/permissions/hierarchical-permissions';

// Helper function to sanitize role
function sanitizeRole(role: string | undefined): UserRole {
  const validRoles: UserRole[] = ['developer', 'org_admin', 'manager', 'consultant', 'viewer'];
  return validRoles.includes(role as UserRole) ? (role as UserRole) : 'viewer';
}

// Helper function for emergency bypass (for development)
function bypassPermissions(): boolean {
  return process.env.NODE_ENV === 'development' && process.env.BYPASS_PERMISSIONS === 'true';
}

export interface AuthContext {
  userId: string;
  role: UserRole;
  permissions: string[];
  user: any;
}

/**
 * Get authenticated user context with permissions
 */
export async function getAuthContext(): Promise<{
  success: boolean;
  context?: AuthContext;
  response?: NextResponse;
}> {
  try {
    // Check for emergency bypass
    if (bypassPermissions()) {
      console.warn('⚠️ PERMISSION BYPASS ACTIVE - DEVELOPMENT ONLY');
      return {
        success: true,
        context: {
          userId: 'bypass',
          role: 'developer',
          permissions: ['*'],
          user: null
        }
      };
    }

    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Unauthorized', message: 'No valid session found' },
          { status: 401 }
        )
      };
    }

    // Get user details
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Unauthorized', message: 'User not found' },
          { status: 401 }
        )
      };
    }

    // Get and validate role
    const rawRole = user.publicMetadata?.role as string;
    const role = sanitizeRole(rawRole);

    // Get excluded permissions from metadata for hierarchical system
    const excludedPermissions = (user.publicMetadata?.excludedPermissions as string[]) || [];

    // Calculate current permissions using hierarchical system
    const permissions = getEffectivePermissions(role, excludedPermissions);

    return {
      success: true,
      context: {
        userId,
        role,
        permissions,
        user
      }
    };

  } catch (error) {
    console.error('❌ Auth context error:', error);
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Internal Server Error', message: 'Authentication failed' },
        { status: 500 }
      )
    };
  }
}

/**
 * Require specific permission for API access
 */
export async function requirePermission(
  resource: string,
  action: string
): Promise<{
  authorized: boolean;
  context?: AuthContext;
  response?: NextResponse;
}> {
  const { success, context, response } = await getAuthContext();

  if (!success || !context) {
    return { authorized: false, response };
  }

  const permission = `${resource}.${action}`;
  
  if (!hasHierarchicalPermission(context.role, permission, context.user?.publicMetadata?.excludedPermissions || [])) {
    console.warn(`🚫 Permission denied: User ${context.userId} (${context.role}) attempted ${permission}`);
    
    return {
      authorized: false,
      response: NextResponse.json(
        { 
          error: 'Forbidden',
          message: `Missing required permission: ${permission}`,
          code: 'INSUFFICIENT_PERMISSIONS',
          required: permission,
          userRole: context.role
        },
        { status: 403 }
      )
    };
  }

  console.log(`✅ Permission granted: User ${context.userId} (${context.role}) accessed ${permission}`);
  
  return { 
    authorized: true, 
    context 
  };
}

/**
 * Require any of the specified permissions
 */
export async function requireAnyPermission(
  requiredPermissions: string[]
): Promise<{
  authorized: boolean;
  context?: AuthContext;
  response?: NextResponse;
}> {
  const { success, context, response } = await getAuthContext();

  if (!success || !context) {
    return { authorized: false, response };
  }

  const excludedPermissions = context.user?.publicMetadata?.excludedPermissions || [];
  const hasAny = hasAnyHierarchicalPermission(context.role, requiredPermissions, excludedPermissions);

  if (!hasAny) {
    return {
      authorized: false,
      response: NextResponse.json(
        { 
          error: 'Forbidden',
          message: `Missing required permissions. Need one of: ${requiredPermissions.join(', ')}`,
          code: 'INSUFFICIENT_PERMISSIONS',
          required: requiredPermissions,
          userRole: context.role
        },
        { status: 403 }
      )
    };
  }

  return { 
    authorized: true, 
    context 
  };
}

/**
 * Require minimum role level
 */
export async function requireRole(
  minRole: UserRole
): Promise<{
  authorized: boolean;
  context?: AuthContext;
  response?: NextResponse;
}> {
  const { success, context, response } = await getAuthContext();

  if (!success || !context) {
    return { authorized: false, response };
  }

  const hasAccess = hasRoleLevel(context.role, minRole);

  if (!hasAccess) {
    // Log permission check for audit
    await logPermissionCheck(
      'role',
      minRole,
      false,
      context
    );

    return {
      authorized: false,
      response: NextResponse.json(
        { 
          error: 'Forbidden',
          message: `Insufficient role. Required: ${minRole}, Current: ${context.role}`,
          code: 'INSUFFICIENT_ROLE',
          required: minRole,
          userRole: context.role
        },
        { status: 403 }
      )
    };
  }

  // Log successful role check
  await logPermissionCheck(
    'role',
    minRole,
    true,
    context
  );

  return { 
    authorized: true, 
    context 
  };
}

/**
 * Developer-only access
 */
export async function requireDeveloper(): Promise<{
  authorized: boolean;
  context?: AuthContext;
  response?: NextResponse;
}> {
  return requireRole('developer');
}

/**
 * Admin or above access
 */
export async function requireAdmin(): Promise<{
  authorized: boolean;
  context?: AuthContext;
  response?: NextResponse;
}> {
  return requireRole('org_admin');
}

/**
 * Manager or above access
 */
export async function requireManager(): Promise<{
  authorized: boolean;
  context?: AuthContext;
  response?: NextResponse;
}> {
  return requireRole('manager');
}

/**
 * Audit log helper for permission checks
 */
export async function logPermissionCheck(
  resource: string,
  action: string,
  granted: boolean,
  context?: AuthContext,
  additionalData?: any
) {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId: context?.userId || 'unknown',
      userRole: context?.role || 'unknown',
      resource,
      action,
      permission: `${resource}.${action}`,
      granted,
      additionalData
    };

    // TODO: Send to audit logging system
    console.log(`🔍 Permission Check:`, logEntry);
    
    // In production, you might want to send this to an external service
    // await auditLogger.log(logEntry);
  } catch (error) {
    console.error('Failed to log permission check:', error);
  }
}