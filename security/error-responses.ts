// lib/security/error-responses.ts
// Standardized error responses that prevent information disclosure

export interface SecureErrorResponse {
  error: string;
  code?: string;
  details?: any;
}

export class SecureErrorHandler {
  private static isProduction = process.env.NODE_ENV === 'production';

  // Sanitize error messages for production
  static sanitizeError(error: any, context?: string): SecureErrorResponse {
    if (this.isProduction) {
      // In production, return generic messages
      if (error?.message?.includes('permission') || error?.message?.includes('unauthorized')) {
        return {
          error: "Access denied",
          code: "PERMISSION_DENIED"
        };
      }
      
      if (error?.message?.includes('not found') || error?.message?.includes('does not exist')) {
        return {
          error: "Resource not found",
          code: "RESOURCE_NOT_FOUND"
        };
      }
      
      if (error?.message?.includes('validation') || error?.message?.includes('invalid')) {
        return {
          error: "Invalid request",
          code: "VALIDATION_ERROR"
        };
      }
      
      // Generic server error for everything else
      return {
        error: "Internal server error",
        code: "INTERNAL_ERROR"
      };
    } else {
      // In development, return detailed errors
      return {
        error: error instanceof Error ? error.message : String(error),
        code: error?.code || "UNKNOWN_ERROR",
        details: {
          context,
          stack: error?.stack,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  // Standardized authentication error
  static authenticationError(): SecureErrorResponse {
    return {
      error: "Authentication required",
      code: "AUTHENTICATION_REQUIRED"
    };
  }

  // Standardized authorization error
  static authorizationError(requiredPermission?: string): SecureErrorResponse {
    if (this.isProduction) {
      return {
        error: "Insufficient permissions",
        code: "AUTHORIZATION_FAILED"
      };
    } else {
      return {
        error: "Insufficient permissions",
        code: "AUTHORIZATION_FAILED",
        details: {
          requiredPermission,
          message: `You need '${requiredPermission}' permission to access this resource`
        }
      };
    }
  }

  // Standardized validation error
  static validationError(field?: string): SecureErrorResponse {
    if (this.isProduction) {
      return {
        error: "Invalid request data",
        code: "VALIDATION_ERROR"
      };
    } else {
      return {
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: {
          field,
          message: field ? `Invalid value for field: ${field}` : "Request validation failed"
        }
      };
    }
  }

  // Rate limiting error
  static rateLimitError(): SecureErrorResponse {
    return {
      error: "Too many requests",
      code: "RATE_LIMIT_EXCEEDED"
    };
  }

  // Database connection error
  static databaseError(): SecureErrorResponse {
    if (this.isProduction) {
      return {
        error: "Service temporarily unavailable",
        code: "SERVICE_UNAVAILABLE"
      };
    } else {
      return {
        error: "Database connection failed",
        code: "DATABASE_ERROR"
      };
    }
  }
}

// Standardized permission validation
export interface PermissionValidation {
  isValid: boolean;
  error?: SecureErrorResponse;
  userId?: string;
  role?: string;
}

export class PermissionValidator {
  static validateAuthentication(userId?: string | null): PermissionValidation {
    if (!userId) {
      return {
        isValid: false,
        error: SecureErrorHandler.authenticationError()
      };
    }
    
    return { isValid: true, userId };
  }

  static validateRole(
    userRole: string | undefined,
    requiredRoles: string[]
  ): PermissionValidation {
    if (!userRole || !requiredRoles.includes(userRole)) {
      return {
        isValid: false,
        error: SecureErrorHandler.authorizationError(`One of: ${requiredRoles.join(', ')}`)
      };
    }
    
    return { isValid: true, role: userRole };
  }

  static validatePermission(
    hasPermission: boolean,
    permissionName: string
  ): PermissionValidation {
    if (!hasPermission) {
      return {
        isValid: false,
        error: SecureErrorHandler.authorizationError(permissionName)
      };
    }
    
    return { isValid: true };
  }
}