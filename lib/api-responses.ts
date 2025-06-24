import { NextResponse } from "next/server";

/**
 * Standardized API response utilities for consistent error handling
 * across all API routes in the application.
 */

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

/**
 * Standardized API response helper functions
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

  // Specialized error responses
  authenticationRequired: () => {
    return ApiResponses.unauthorized(
      "Authentication required",
      "Please sign in to access this resource"
    );
  },

  insufficientPermissions: (requiredPermissions?: string[]) => {
    return ApiResponses.forbidden(
      "Insufficient permissions",
      requiredPermissions
        ? `Required permissions: ${requiredPermissions.join(", ")}`
        : undefined
    );
  },

  invalidCredentials: () => {
    return ApiResponses.unauthorized(
      "Invalid credentials",
      "The provided credentials are incorrect"
    );
  },

  resourceNotFound: (resourceType: string, id?: string) => {
    return ApiResponses.notFound(
      `${resourceType} not found`,
      id ? `No ${resourceType.toLowerCase()} found with ID: ${id}` : undefined
    );
  },

  duplicateResource: (resourceType: string, field?: string) => {
    return ApiResponses.conflict(
      `${resourceType} already exists`,
      field
        ? `A ${resourceType.toLowerCase()} with this ${field} already exists`
        : undefined
    );
  },

  invalidInput: (field: string, reason: string) => {
    return ApiResponses.validationError([
      {
        field,
        message: reason,
        code: "INVALID_INPUT",
      },
    ]);
  },

  missingRequiredField: (field: string) => {
    return ApiResponses.validationError([
      {
        field,
        message: `${field} is required`,
        code: "REQUIRED_FIELD",
      },
    ]);
  },

  // Development-only responses
  notImplemented: (message: string = "Not implemented") => {
    if (process.env.NODE_ENV === "production") {
      return ApiResponses.notFound();
    }
    return NextResponse.json(
      {
        error: message,
        code: "NOT_IMPLEMENTED",
        timestamp: new Date().toISOString(),
      } as ApiError,
      { status: 501 }
    );
  },

  // Security-focused error handling (from security/error-responses.ts)
  secureError: (error: any, context?: string) => {
    const isProduction = process.env.NODE_ENV === "production";
    
    if (isProduction) {
      // In production, return sanitized generic messages
      if (
        error?.message?.includes("permission") ||
        error?.message?.includes("unauthorized")
      ) {
        return ApiResponses.forbidden("Access denied", "PERMISSION_DENIED");
      }

      if (
        error?.message?.includes("not found") ||
        error?.message?.includes("does not exist")
      ) {
        return ApiResponses.notFound("Resource not found");
      }

      if (
        error?.message?.includes("validation") ||
        error?.message?.includes("invalid")
      ) {
        return ApiResponses.badRequest("Invalid request");
      }

      // Generic server error for everything else
      return ApiResponses.serverError("Internal server error");
    } else {
      // In development, return detailed errors
      return ApiResponses.serverError(
        error instanceof Error ? error.message : String(error),
        {
          context,
          stack: error?.stack,
          timestamp: new Date().toISOString(),
        }
      );
    }
  },
};

/**
 * Helper function to safely handle API response errors
 */
export function handleApiError(error: unknown, context?: string): Response {
  console.error(`API Error${context ? ` in ${context}` : ""}:`, error);

  if (error instanceof Error) {
    return ApiResponses.serverError("An unexpected error occurred", {
      message: error.message,
      context,
    });
  }

  return ApiResponses.serverError("An unknown error occurred", { context });
}

/**
 * Helper function to validate required fields
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const field of requiredFields) {
    if (
      !data[field] ||
      (typeof data[field] === "string" && !data[field].trim())
    ) {
      errors.push({
        field,
        message: `${field} is required`,
        code: "REQUIRED_FIELD",
      });
    }
  }

  return errors;
}

/**
 * Middleware to wrap API handlers with standardized error handling
 */
export function withErrorHandling(
  handler: (req: Request, ...args: any[]) => Promise<Response>
) {
  return async (req: Request, ...args: any[]): Promise<Response> => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      return handleApiError(error, handler.name);
    }
  };
}

/**
 * Permission validation utilities (from security/error-responses.ts)
 */
export class PermissionValidator {
  static hasPermission(userPermissions: string[], requiredPermission: string): boolean {
    return userPermissions.includes(requiredPermission);
  }

  static hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.some(permission => userPermissions.includes(permission));
  }

  static hasAllPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.every(permission => userPermissions.includes(permission));
  }

  static validatePermission(
    userPermissions: string[], 
    requiredPermission: string,
    context?: string
  ): Response | null {
    if (!this.hasPermission(userPermissions, requiredPermission)) {
      return ApiResponses.insufficientPermissions([requiredPermission]);
    }
    return null;
  }

  static validateAnyPermission(
    userPermissions: string[], 
    requiredPermissions: string[],
    context?: string
  ): Response | null {
    if (!this.hasAnyPermission(userPermissions, requiredPermissions)) {
      return ApiResponses.insufficientPermissions(requiredPermissions);
    }
    return null;
  }
}

/**
 * Alternative response interface for backward compatibility (from shared/responses.ts)
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Backward compatibility helpers (from shared/responses.ts)
 */
export function successResponse<T>(data: T, message?: string): NextResponse {
  return ApiResponses.success(data, message);
}

export function errorResponse(error: string, status: number = 400): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
    } as ApiResponse,
    { status }
  );
}

export function validationErrorResponse(errors: string[]): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: "Validation failed",
      details: errors,
    } as ApiResponse,
    { status: 400 }
  );
}
