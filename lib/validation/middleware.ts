/**
 * Input Validation Middleware
 * 
 * Middleware functions for validating API route inputs using Zod schemas.
 * Provides consistent validation across all endpoints with detailed error reporting.
 * 
 * Security: Prevents injection attacks and ensures data integrity
 * SOC2 Compliance: Input validation is required for data protection
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateRequestBody, validateQueryParams, ApiErrorSchema } from './schemas';

// ============================================================================
// Validation Middleware Types
// ============================================================================

interface ValidationOptions {
  body?: z.ZodSchema<any>;
  query?: z.ZodSchema<any>;
  params?: z.ZodSchema<any>;
}

interface ValidationResult {
  body?: any;
  query?: any;
  params?: any;
  errors?: string[];
}

// ============================================================================
// Core Validation Middleware
// ============================================================================

/**
 * Comprehensive request validation middleware
 */
export function withValidation(options: ValidationOptions) {
  return function <T extends any[]>(
    handler: (
      request: NextRequest,
      context: { params?: any },
      validated: ValidationResult
    ) => Promise<NextResponse> | NextResponse
  ) {
    return async function (
      request: NextRequest,
      context: { params?: any }
    ): Promise<NextResponse> {
      try {
        const validated: ValidationResult = {};
        const allErrors: string[] = [];

        // Validate request body
        if (options.body && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
          try {
            const bodyText = await request.text();
            const bodyData = bodyText ? JSON.parse(bodyText) : {};
            
            const bodyValidation = validateRequestBody(options.body, bodyData);
            if (bodyValidation.success) {
              validated.body = bodyValidation.data;
            } else {
              allErrors.push(...bodyValidation.errors.map(err => `Body: ${err}`));
            }
          } catch (error) {
            allErrors.push('Body: Invalid JSON format');
          }
        }

        // Validate query parameters
        if (options.query) {
          const url = new URL(request.url);
          const queryData = Object.fromEntries(url.searchParams.entries());
          
          const queryValidation = validateQueryParams(options.query, queryData);
          if (queryValidation.success) {
            validated.query = queryValidation.data;
          } else {
            allErrors.push(...queryValidation.errors.map(err => `Query: ${err}`));
          }
        }

        // Validate route parameters
        if (options.params && context.params) {
          const paramsValidation = validateRequestBody(options.params, context.params);
          if (paramsValidation.success) {
            validated.params = paramsValidation.data;
          } else {
            allErrors.push(...paramsValidation.errors.map(err => `Params: ${err}`));
          }
        }

        // Return validation errors if any
        if (allErrors.length > 0) {
          return NextResponse.json(
            {
              error: 'Validation Error',
              message: 'Request validation failed',
              code: 'VALIDATION_FAILED',
              details: {
                errors: allErrors,
                timestamp: new Date().toISOString()
              }
            },
            { status: 400 }
          );
        }

        // Call the handler with validated data
        return await handler(request, context, validated);

      } catch (error) {
        console.error('❌ Validation middleware error:', error);
        
        return NextResponse.json(
          {
            error: 'Internal Server Error',
            message: 'Request processing failed',
            code: 'VALIDATION_MIDDLEWARE_ERROR',
            timestamp: new Date().toISOString()
          },
          { status: 500 }
        );
      }
    };
  };
}

/**
 * Body-only validation middleware (for simple cases)
 */
export function withBodyValidation<T>(schema: z.ZodSchema<T>) {
  return withValidation({ body: schema });
}

/**
 * Query-only validation middleware (for GET requests)
 */
export function withQueryValidation<T>(schema: z.ZodSchema<T>) {
  return withValidation({ query: schema });
}

/**
 * Params-only validation middleware (for route parameters)
 */
export function withParamsValidation<T>(schema: z.ZodSchema<T>) {
  return withValidation({ params: schema });
}

// ============================================================================
// Specialized Validation Helpers
// ============================================================================

/**
 * Validate file upload with security checks
 */
export function validateFileUpload(
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
  } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  // Check file extension
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  if (!allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`
    };
  }

  // Additional security checks
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    return {
      valid: false,
      error: 'Invalid file name. Path traversal characters not allowed'
    };
  }

  return { valid: true };
}

/**
 * Sanitize and validate CSV upload
 */
export function validateCSVContent(
  content: string,
  options: {
    maxRows?: number;
    maxColumns?: number;
    requiredHeaders?: string[];
  } = {}
): { valid: boolean; data?: any[]; error?: string } {
  const {
    maxRows = 1000,
    maxColumns = 50,
    requiredHeaders = []
  } = options;

  try {
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return { valid: false, error: 'CSV file is empty' };
    }

    if (lines.length > maxRows) {
      return { 
        valid: false, 
        error: `Too many rows. Maximum allowed: ${maxRows}` 
      };
    }

    // Parse headers
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    if (headers.length > maxColumns) {
      return { 
        valid: false, 
        error: `Too many columns. Maximum allowed: ${maxColumns}` 
      };
    }

    // Check required headers
    const missingHeaders = requiredHeaders.filter(req => !headers.includes(req));
    if (missingHeaders.length > 0) {
      return {
        valid: false,
        error: `Missing required headers: ${missingHeaders.join(', ')}`
      };
    }

    // Parse data rows
    const data = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      
      if (values.length !== headers.length) {
        throw new Error(`Row ${index + 2}: Column count mismatch`);
      }

      return headers.reduce((obj, header, i) => {
        obj[header] = values[i];
        return obj;
      }, {} as Record<string, string>);
    });

    return { valid: true, data };

  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid CSV format'
    };
  }
}

// ============================================================================
// Error Response Helpers
// ============================================================================

/**
 * Create standardized validation error response
 */
export function createValidationErrorResponse(
  errors: string[],
  message: string = 'Validation failed'
): NextResponse {
  return NextResponse.json(
    {
      error: 'Validation Error',
      message,
      code: 'VALIDATION_FAILED',
      details: {
        errors,
        timestamp: new Date().toISOString()
      }
    },
    { status: 400 }
  );
}

/**
 * Create standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    },
    { status }
  );
}

/**
 * Create standardized error response
 */
export function createErrorResponse(
  error: string,
  message: string,
  code?: string,
  status: number = 500,
  details?: any
): NextResponse {
  return NextResponse.json(
    {
      error,
      message,
      code,
      details,
      timestamp: new Date().toISOString()
    },
    { status }
  );
}

// ============================================================================
// Rate Limiting Integration (for next middleware)
// ============================================================================

/**
 * Extract client identifier for rate limiting
 */
export function getClientIdentifier(request: NextRequest): string {
  // Try to get user ID from auth first
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    try {
      // Extract user ID from JWT if available
      const token = authHeader.replace('Bearer ', '');
      // This would integrate with your auth system
      // For now, use a simple approach
    } catch (error) {
      // Fallback to IP-based limiting
    }
  }

  // Fallback to IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 
    request.headers.get('x-real-ip') || 
    'unknown';

  return ip;
}

/**
 * Security headers middleware
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent XSS attacks
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // HSTS for HTTPS
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  return response;
}

// ============================================================================
// Export all validation middleware
// ============================================================================

export {
  withValidation,
  withBodyValidation,
  withQueryValidation, 
  withParamsValidation,
  validateFileUpload,
  validateCSVContent,
  createValidationErrorResponse,
  createSuccessResponse,
  createErrorResponse,
  getClientIdentifier,
  addSecurityHeaders
};