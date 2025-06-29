/**
 * JWT Claims Validation
 * Provides security validation for JWT tokens and claims
 */

import { auditLogger, LogLevel, SOC2EventType, LogCategory } from '@/lib/security/audit/logger';
import { Role, isValidUserRole, getAllowedRoles } from './permissions';

export interface JWTClaims {
  'x-hasura-user-id'?: string;
  'x-hasura-default-role'?: string;
  'x-hasura-allowed-roles'?: string[];
  'x-hasura-clerk-user-id'?: string;
  'x-hasura-org-id'?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  claims?: JWTClaims;
}

export interface SecurityContext {
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  requestPath?: string;
}

/**
 * Validates JWT claims for security compliance
 */
export async function validateJWTClaims(
  sessionClaims: any,
  context?: SecurityContext
): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Extract Hasura claims
  const hasuraClaims = sessionClaims?.["https://hasura.io/jwt/claims"] as JWTClaims;
  
  if (!hasuraClaims) {
    errors.push("Missing Hasura JWT claims - potential JWT template issue");
    await logSecurityEvent(
      "JWT_VALIDATION_FAILURE",
      "Missing Hasura claims in JWT token",
      context,
      { sessionClaims }
    );
    return { isValid: false, errors, warnings };
  }

  // Validate required claims
  if (!hasuraClaims['x-hasura-user-id']) {
    errors.push("Missing x-hasura-user-id claim");
  }

  if (!hasuraClaims['x-hasura-default-role']) {
    errors.push("Missing x-hasura-default-role claim");
  }

  if (!hasuraClaims['x-hasura-allowed-roles']) {
    errors.push("Missing x-hasura-allowed-roles claim");
  }

  // Validate role format
  const defaultRole = hasuraClaims['x-hasura-default-role'];
  if (defaultRole && !isValidUserRole(defaultRole)) {
    errors.push(`Invalid default role: ${defaultRole}`);
  }

  // Validate allowed roles
  const allowedRoles = hasuraClaims['x-hasura-allowed-roles'];
  if (allowedRoles) {
    if (!Array.isArray(allowedRoles)) {
      errors.push("x-hasura-allowed-roles must be an array");
    } else {
      // Check if default role is in allowed roles
      if (defaultRole && !allowedRoles.includes(defaultRole)) {
        errors.push("Default role not in allowed roles");
      }

      // Validate role hierarchy - ensure user doesn't have roles above their level
      if (defaultRole && isValidUserRole(defaultRole)) {
        const expectedAllowedRoles = getAllowedRoles(defaultRole as Role);
        const hasInvalidRoles = allowedRoles.some(role => 
          !expectedAllowedRoles.includes(role as Role)
        );
        
        if (hasInvalidRoles) {
          warnings.push("User has roles above their hierarchy level");
          await logSecurityEvent(
            "ROLE_HIERARCHY_VIOLATION",
            "User has roles above their expected hierarchy",
            context,
            { 
              defaultRole, 
              allowedRoles, 
              expectedAllowedRoles 
            }
          );
        }
      }
    }
  }

  // Validate UUID format for user ID
  const userId = hasuraClaims['x-hasura-user-id'];
  if (userId && !isValidUUID(userId)) {
    errors.push("Invalid UUID format for x-hasura-user-id");
  }

  // Check for role escalation attempts
  if (context?.requestPath?.includes('x-hasura-role')) {
    const requestedRole = extractRequestedRole(context.requestPath);
    if (requestedRole && allowedRoles && !allowedRoles.includes(requestedRole)) {
      errors.push("Attempted role escalation - requested role not in allowed roles");
      await logSecurityEvent(
        "ROLE_ESCALATION_ATTEMPT",
        "User attempted to use unauthorized role",
        context,
        { requestedRole, allowedRoles, defaultRole }
      );
    }
  }

  const isValid = errors.length === 0;

  // Log validation result for monitoring
  if (!isValid) {
    await logSecurityEvent(
      "JWT_VALIDATION_FAILURE",
      "JWT claims validation failed",
      context,
      { errors, warnings, claims: hasuraClaims }
    );
  } else if (warnings.length > 0) {
    await logSecurityEvent(
      "JWT_VALIDATION_WARNING",
      "JWT claims validation completed with warnings",
      context,
      { warnings, claims: hasuraClaims }
    );
  }

  return {
    isValid,
    errors,
    warnings,
    claims: hasuraClaims
  };
}

/**
 * Validates role switching requests
 */
export function validateRoleSwitch(
  currentRole: string,
  requestedRole: string,
  allowedRoles: string[]
): ValidationResult {
  const errors: string[] = [];
  
  if (!allowedRoles.includes(requestedRole)) {
    errors.push(`Role ${requestedRole} not in user's allowed roles`);
  }

  if (!isValidUserRole(requestedRole)) {
    errors.push(`Invalid role format: ${requestedRole}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

/**
 * Compares database user data with JWT claims for consistency
 */
export async function validateUserDataConsistency(
  jwtClaims: JWTClaims,
  databaseUser: any,
  context?: SecurityContext
): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!databaseUser) {
    errors.push("Database user not found for JWT claims");
    return { isValid: false, errors, warnings };
  }

  // Check role consistency
  if (jwtClaims['x-hasura-default-role'] !== databaseUser.role) {
    errors.push("Role mismatch between JWT and database");
    await logSecurityEvent(
      "ROLE_MISMATCH",
      "JWT role does not match database role",
      context,
      {
        jwtRole: jwtClaims['x-hasura-default-role'],
        dbRole: databaseUser.role,
        userId: jwtClaims['x-hasura-user-id']
      }
    );
  }

  // Check user ID consistency
  if (jwtClaims['x-hasura-user-id'] !== databaseUser.id) {
    errors.push("User ID mismatch between JWT and database");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    claims: jwtClaims
  };
}

/**
 * Helper functions
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

function extractRequestedRole(requestPath: string): string | null {
  const match = requestPath.match(/x-hasura-role[=:]([^&\s]+)/);
  return match ? match[1] : null;
}

async function logSecurityEvent(
  eventType: string,
  message: string,
  context?: SecurityContext,
  metadata?: any
): Promise<void> {
  try {
    await auditLogger.logSOC2Event({
      level: LogLevel.WARNING,
      eventType: SOC2EventType.SECURITY_VIOLATION,
      category: LogCategory.SECURITY_EVENT,
      complianceNote: message,
      success: false,
      userId: context?.userId || 'unknown',
      resourceType: 'jwt_validation',
      action: eventType,
      metadata: {
        ...metadata,
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
        requestPath: context?.requestPath
      }
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

/**
 * Middleware-compatible validation function
 */
export function createJWTValidator() {
  return {
    validateClaims: validateJWTClaims,
    validateRoleSwitch,
    validateConsistency: validateUserDataConsistency
  };
}