/**
 * Consolidated API Response Utilities
 *
 * Combines general API response functionality with security-compliant error handling
 */

import { NextResponse } from "next/server";

// Type definitions
export interface ApiError {
  error: string;
  details?: string | Record<string, any>;
  code?: string;
  timestamp?: string;
}

export interface ApiSuccess<T = any> {
  success: true;
  data?: T;
  message?: string;
  timestamp?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface SecureErrorResponse {
  error: string;
  code?: string;
  details?: any;
}

export interface PermissionValidation {
  isValid: boolean;
  error?: SecureErrorResponse;
  userId?: string;
  role?: string;
}

/**
 * Security-compliant error handler that sanitizes error messages in production
 */
export class SecureErrorHandler {
  private static isProduction = process.env.NODE_ENV === "production";

  static sanitizeError(error: any, context?: string): SecureErrorResponse {
    if (this.isProduction) {
      // In production, return generic messages
      if (
        error?.message?.includes("permission") ||
        error?.message?.includes("unauthorized")
      ) {
        return {
          error: "Access denied",
          code: "PERMISSION_DENIED",
        };
      }

      if (
        error?.message?.includes("not found") ||
        error?.message?.includes("does not exist")
      ) {
        return {
          error: "Resource not found",
          code: "RESOURCE_NOT_FOUND",
        };
      }

      if (
        error?.message?.includes("validation") ||
        error?.message?.includes("invalid")
      ) {
        return {
          error: "Invalid request",
          code: "VALIDATION_ERROR",
        };
      }

      // Generic server error for everything else
      return {
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      };
    } else {
      // In development, return detailed errors
      return {
        error: error instanceof Error ? error.message : String(error),
        code: error?.code || "UNKNOWN_ERROR",
        details: {
          context,
          stack: error?.stack,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  static authenticationError(): SecureErrorResponse {
    return {
      error: "Authentication required",
      code: "AUTHENTICATION_REQUIRED",
    };
  }

  static authorizationError(requiredPermission?: string): SecureErrorResponse {
    if (this.isProduction) {
      return {
        error: "Insufficient permissions",
        code: "AUTHORIZATION_FAILED",
      };
    } else {
      return {
        error: "Insufficient permissions",
        code: "AUTHORIZATION_FAILED",
        details: {
          requiredPermission,
          message: `You need '${requiredPermission}' permission to access this resource`,
        },
      };
    }
  }

  static validationError(field?: string): SecureErrorResponse {
    if (this.isProduction) {
      return {
        error: "Invalid request data",
        code: "VALIDATION_ERROR",
      };
    } else {
      return {
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: {
          field,
          message: field
            ? `Invalid value for field: ${field}`
            : "Request validation failed",
        },
      };
    }
  }

  static rateLimitError(): SecureErrorResponse {
    return {
      error: "Too many requests",
      code: "RATE_LIMIT_EXCEEDED",
    };
  }

  static databaseError(): SecureErrorResponse {
    if (this.isProduction) {
      return {
        error: "Service temporarily unavailable",
        code: "SERVICE_UNAVAILABLE",
      };
    } else {
      return {
        error: "Database connection failed",
        code: "DATABASE_ERROR",
      };
    }
  }
}

/**
 * Permission validation utilities
 */
export class PermissionValidator {
  static validateAuthentication(userId?: string | null): PermissionValidation {
    if (!userId) {
      return {
        isValid: false,
        error: SecureErrorHandler.authenticationError(),
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
        error: SecureErrorHandler.authorizationError(
          `One of: ${requiredRoles.join(", ")}`
        ),
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
        error: SecureErrorHandler.authorizationError(permissionName),
      };
    }

    return { isValid: true };
  }
}

/**
 * Standardized API response helpers
 */
export const ApiResponses = {
  // Success responses
  success: <T = any>(data?: T, message?: string, status: number = 200) => {
    return NextResponse.json(
      {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString(),
      } as ApiSuccess<T>,
      { status }
    );
  },

  created: <T = any>(data?: T, message?: string) => {
    return ApiResponses.success(
      data,
      message || "Resource created successfully",
      201
    );
  },

  updated: <T = any>(data?: T, message?: string) => {
    return ApiResponses.success(
      data,
      message || "Resource updated successfully",
      200
    );
  },

  deleted: (message?: string) => {
    return ApiResponses.success(
      null,
      message || "Resource deleted successfully",
      200
    );
  },

  // Client error responses (4xx)
  badRequest: (
    message: string = "Bad request",
    details?: string | Record<string, any>
  ) => {
    return NextResponse.json(
      {
        error: message,
        details,
        code: "BAD_REQUEST",
        timestamp: new Date().toISOString(),
      } as ApiError,
      { status: 400 }
    );
  },

  unauthorized: (message: string = "Unauthorized", details?: string) => {
    return NextResponse.json(
      {
        error: message,
        details,
        code: "UNAUTHORIZED",
        timestamp: new Date().toISOString(),
      } as ApiError,
      { status: 401 }
    );
  },

  forbidden: (message: string = "Forbidden", details?: string) => {
    return NextResponse.json(
      {
        error: message,
        details,
        code: "FORBIDDEN",
        timestamp: new Date().toISOString(),
      } as ApiError,
      { status: 403 }
    );
  },

  notFound: (message: string = "Not found", details?: string) => {
    return NextResponse.json(
      {
        error: message,
        details,
        code: "NOT_FOUND",
        timestamp: new Date().toISOString(),
      } as ApiError,
      { status: 404 }
    );
  },

  conflict: (
    message: string = "Conflict",
    details?: string | Record<string, any>
  ) => {
    return NextResponse.json(
      {
        error: message,
        details,
        code: "CONFLICT",
        timestamp: new Date().toISOString(),
      } as ApiError,
      { status: 409 }
    );
  },

  validationError: (
    errors: ValidationError[],
    message: string = "Validation failed"
  ) => {
    return NextResponse.json(
      {
        error: message,
        details: errors,
        code: "VALIDATION_ERROR",
        timestamp: new Date().toISOString(),
      } as ApiError,
      { status: 422 }
    );
  },

  rateLimited: (
    message: string = "Rate limit exceeded",
    retryAfter?: number
  ) => {
    const headers: Record<string, string> = {};
    if (retryAfter) {
      headers["Retry-After"] = retryAfter.toString();
    }

    return NextResponse.json(
      {
        error: message,
        code: "RATE_LIMITED",
        timestamp: new Date().toISOString(),
      } as ApiError,
      {
        status: 429,
        headers,
      }
    );
  },

  // Server error responses (5xx)
  serverError: (
    message: string = "Internal server error",
    details?: string | Record<string, any>
  ) => {
    // Log server errors for debugging
    console.error("Server error:", {
      message,
      details,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: message,
        details: process.env.NODE_ENV === "development" ? details : undefined,
        code: "INTERNAL_ERROR",
        timestamp: new Date().toISOString(),
      } as ApiError,
      { status: 500 }
    );
  },

  serviceUnavailable: (
    message: string = "Service unavailable",
    details?: string
  ) => {
    return NextResponse.json(
      {
        error: message,
        details,
        code: "SERVICE_UNAVAILABLE",
        timestamp: new Date().toISOString(),
      } as ApiError,
      { status: 503 }
    );
  },

  gatewayTimeout: (message: string = "Gateway timeout", details?: string) => {
    return NextResponse.json(
      {
        error: message,
        details,
        code: "GATEWAY_TIMEOUT",
        timestamp: new Date().toISOString(),
      } as ApiError,
      { status: 504 }
    );
  },

  // Security-aware error responses
  secureError: (error: any, context?: string, status: number = 500) => {
    const sanitized = SecureErrorHandler.sanitizeError(error, context);
    return NextResponse.json(sanitized, { status });
  },

  authenticationRequired: () => {
    const error = SecureErrorHandler.authenticationError();
    return NextResponse.json(error, { status: 401 });
  },

  insufficientPermissions: (requiredPermission?: string) => {
    const error = SecureErrorHandler.authorizationError(requiredPermission);
    return NextResponse.json(error, { status: 403 });
  },

  // Adding missing methods
  invalidInput: (field: string, message: string) => {
    return NextResponse.json(
      {
        error: "Invalid input",
        details: { field, message },
        code: "INVALID_INPUT",
        timestamp: new Date().toISOString(),
      } as ApiError,
      { status: 400 }
    );
  },

  duplicateResource: (resourceType: string, field: string) => {
    return NextResponse.json(
      {
        error: `${resourceType} already exists`,
        details: {
          field,
          message: `${resourceType} with this ${field} already exists`,
        },
        code: "DUPLICATE_RESOURCE",
        timestamp: new Date().toISOString(),
      } as ApiError,
      { status: 409 }
    );
  },
};

/**
 * Standalone error handler function for API routes
 */
export function handleApiError(error: any, context: string): NextResponse {
  console.error(`API Error in ${context}:`, error);

  if (error?.status && error?.message) {
    return NextResponse.json(
      {
        error: error.message,
        code: "API_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: error.status }
    );
  }

  return ApiResponses.serverError("Internal server error", {
    context,
    message: error?.message || "Unknown error",
  });
}
