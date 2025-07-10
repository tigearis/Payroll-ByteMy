/**
 * Standardized Error Handling System
 * 
 * Provides consistent error responses across all API endpoints while
 * preventing information disclosure and maintaining security.
 * 
 * Security: Prevents sensitive information leakage in error messages
 * SOC2 Compliance: Proper error handling and logging for audit trails
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// ============================================================================
// Error Types and Interfaces
// ============================================================================

export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // Validation
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Resources
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  
  // Business Logic
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  INVALID_OPERATION = 'INVALID_OPERATION',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
  
  // External Services
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  INTEGRATION_FAILURE = 'INTEGRATION_FAILURE',
  
  // System
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

export interface StandardError {
  error: string;
  message: string;
  code: ErrorCode;
  details?: Record<string, any>;
  timestamp: string;
  requestId?: string;
  path?: string;
}

export interface ErrorLogEntry {
  level: 'error' | 'warn' | 'info';
  error: StandardError;
  originalError?: any;
  stack?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
}

// ============================================================================
// Error Classes
// ============================================================================

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, any>;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    details?: Record<string, any>,
    isOperational: boolean = true
  ) {
    super(message);
    
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, ErrorCode.VALIDATION_FAILED, 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, ErrorCode.UNAUTHORIZED, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, ErrorCode.FORBIDDEN, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, ErrorCode.RESOURCE_NOT_FOUND, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, ErrorCode.RESOURCE_CONFLICT, 409);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, ErrorCode.RATE_LIMIT_EXCEEDED, 429, { retryAfter });
    this.name = 'RateLimitError';
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string, rule?: string) {
    super(message, ErrorCode.BUSINESS_RULE_VIOLATION, 422, { rule });
    this.name = 'BusinessRuleError';
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string = 'External service error') {
    super(message, ErrorCode.EXTERNAL_SERVICE_ERROR, 502, { service });
    this.name = 'ExternalServiceError';
  }
}

// ============================================================================
// Error Response Creation
// ============================================================================

/**
 * Create standardized error response
 */
export function createErrorResponse(
  error: Error | AppError,
  requestId?: string,
  path?: string
): NextResponse {
  let standardError: StandardError;
  let statusCode: number;

  if (error instanceof AppError) {
    standardError = {
      error: error.name,
      message: error.message,
      code: error.code,
      details: error.details,
      timestamp: new Date().toISOString(),
      requestId,
      path
    };
    statusCode = error.statusCode;
  } else if (error instanceof ZodError) {
    // Handle Zod validation errors
    const validationErrors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code
    }));

    standardError = {
      error: 'ValidationError',
      message: 'Input validation failed',
      code: ErrorCode.VALIDATION_FAILED,
      details: { validationErrors },
      timestamp: new Date().toISOString(),
      requestId,
      path
    };
    statusCode = 400;
  } else {
    // Handle unknown errors - don't expose internal details
    const isProduction = process.env.NODE_ENV === 'production';
    
    standardError = {
      error: 'InternalServerError',
      message: isProduction ? 'An internal error occurred' : error.message,
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      details: isProduction ? undefined : { 
        stack: error.stack,
        originalMessage: error.message 
      },
      timestamp: new Date().toISOString(),
      requestId,
      path
    };
    statusCode = 500;
  }

  // Log error for monitoring
  logError({
    level: statusCode >= 500 ? 'error' : 'warn',
    error: standardError,
    originalError: error,
    stack: error.stack
  });

  return NextResponse.json(standardError, { status: statusCode });
}

/**
 * Create success response with consistent format
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  statusCode: number = 200,
  requestId?: string
): NextResponse {
  const response = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
    requestId
  };

  return NextResponse.json(response, { status: statusCode });
}

// ============================================================================
// Error Logging
// ============================================================================

/**
 * Log error with context
 */
export function logError(entry: ErrorLogEntry): void {
  const logEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  };

  // In development, log to console with full details
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Error Log:', JSON.stringify(logEntry, null, 2));
    if (entry.originalError?.stack) {
      console.error('Stack Trace:', entry.originalError.stack);
    }
  } else {
    // In production, use structured logging
    console.error(JSON.stringify(logEntry));
  }

  // TODO: Send to external monitoring service (DataDog, Sentry, etc.)
  // await sendToMonitoringService(logEntry);
}

/**
 * Log security event
 */
export function logSecurityEvent(
  event: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  details: Record<string, any>,
  userId?: string,
  ipAddress?: string
): void {
  const securityEvent = {
    type: 'security_event',
    event,
    severity,
    details,
    userId,
    ipAddress,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  };

  // Always log security events
  console.warn('🔒 Security Event:', JSON.stringify(securityEvent, null, 2));

  // TODO: Send to security monitoring system
  // await sendToSecurityMonitoring(securityEvent);
}

// ============================================================================
// Error Handling Middleware
// ============================================================================

/**
 * Global error handling middleware
 */
export function withErrorHandling() {
  return function <T extends any[]>(
    handler: (...args: T) => Promise<NextResponse> | NextResponse
  ) {
    return async function (...args: T): Promise<NextResponse> {
      try {
        return await handler(...args);
      } catch (error) {
        // Extract request information if available
        const request = args[0] as any;
        const requestId = request?.headers?.get?.('x-request-id') || 
          crypto.randomUUID?.() || 
          Math.random().toString(36);
        const path = request?.url ? new URL(request.url).pathname : undefined;

        return createErrorResponse(error as Error, requestId, path);
      }
    };
  };
}

// ============================================================================
// Specific Error Factories
// ============================================================================

/**
 * Create authentication required error
 */
export function createAuthError(message?: string): NextResponse {
  return createErrorResponse(new AuthenticationError(message));
}

/**
 * Create authorization error
 */
export function createForbiddenError(message?: string): NextResponse {
  return createErrorResponse(new AuthorizationError(message));
}

/**
 * Create validation error
 */
export function createValidationError(
  message: string,
  validationErrors?: Array<{ field: string; message: string }>
): NextResponse {
  return createErrorResponse(
    new ValidationError(message, { validationErrors })
  );
}

/**
 * Create not found error
 */
export function createNotFoundError(resource?: string): NextResponse {
  return createErrorResponse(new NotFoundError(resource));
}

/**
 * Create conflict error
 */
export function createConflictError(message?: string): NextResponse {
  return createErrorResponse(new ConflictError(message));
}

/**
 * Create rate limit error
 */
export function createRateLimitError(retryAfter?: number): NextResponse {
  const response = createErrorResponse(new RateLimitError(undefined, retryAfter));
  
  if (retryAfter) {
    response.headers.set('Retry-After', retryAfter.toString());
  }
  
  return response;
}

/**
 * Create business rule violation error
 */
export function createBusinessRuleError(message: string, rule?: string): NextResponse {
  return createErrorResponse(new BusinessRuleError(message, rule));
}

// ============================================================================
// Error Recovery Helpers
// ============================================================================

/**
 * Retry operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }

      // Exponential backoff with jitter
      const delay = baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      logError({
        level: 'warn',
        error: {
          error: 'RetryAttempt',
          message: `Operation failed, retrying (attempt ${attempt}/${maxAttempts})`,
          code: ErrorCode.INTERNAL_SERVER_ERROR,
          timestamp: new Date().toISOString()
        },
        originalError: lastError
      });
    }
  }

  throw lastError!;
}

/**
 * Circuit breaker pattern for external services
 */
export class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private failureThreshold: number = 5,
    private recoveryTimeMs: number = 60000
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeMs) {
        this.state = 'half-open';
      } else {
        throw new ExternalServiceError('circuit-breaker', 'Circuit breaker is open');
      }
    }

    try {
      const result = await operation();
      
      if (this.state === 'half-open') {
        this.reset();
      }
      
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'open';
      logSecurityEvent(
        'circuit_breaker_opened',
        'medium',
        { failureCount: this.failureCount },
        undefined,
        undefined
      );
    }
  }

  private reset(): void {
    this.failureCount = 0;
    this.state = 'closed';
  }

  getState(): string {
    return this.state;
  }
}

// ============================================================================
// All exports are already declared above as individual exports
// ============================================================================