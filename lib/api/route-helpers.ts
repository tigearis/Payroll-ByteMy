import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

// Standard API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Common validation patterns
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = "Insufficient permissions") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = "NotFoundError";
  }
}

// Standard API response builders
export function successResponse<T>(
  data?: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      ...(data !== undefined && { data }),
      ...(message && { message }),
    },
    { status }
  );
}

export function errorResponse(
  error: string | Error,
  status: number = 500,
  code?: string
): NextResponse<ApiResponse> {
  const errorMessage = error instanceof Error ? error.message : error;
  
  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
      ...(code && { code }),
    },
    { status }
  );
}

// Standard error status mapping
export function getErrorStatus(error: Error): number {
  if (error instanceof ValidationError) return 400;
  if (error instanceof AuthorizationError) return 403;
  if (error instanceof NotFoundError) return 404;
  return 500;
}

// Route handler wrapper that provides standardized error handling
export function withErrorHandling<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
): (...args: T) => Promise<NextResponse> {
  return async (...args: T) => {
    try {
      return await handler(...args);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      const status = getErrorStatus(err);
      
      // Log the error with appropriate classification
      logger.error(`API route error: ${err.message}`, {
        error: err.name,
        status,
        classification: "INTERNAL" as any,
      });
      
      return errorResponse(err, status);
    }
  };
}

// Validation helpers
export async function validateRequestBody<T>(
  req: NextRequest,
  validator: (data: unknown) => T
): Promise<T> {
  try {
    const body = await req.json();
    return validator(body);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ValidationError("Invalid JSON in request body");
    }
    throw error;
  }
}

export function validateRequiredFields<T extends Record<string, unknown>>(
  data: T,
  requiredFields: (keyof T)[]
): void {
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new ValidationError(`${String(field)} is required`, String(field));
    }
  }
}

// Parameter validation for dynamic routes
export async function validateParams<T extends Record<string, string>>(
  params: Promise<T>,
  validators?: Partial<Record<keyof T, (value: string) => boolean>>
): Promise<T> {
  const resolvedParams = await params;
  
  if (validators) {
    for (const [key, validator] of Object.entries(validators)) {
      const value = resolvedParams[key as keyof T];
      if (value && validator && !validator(value)) {
        throw new ValidationError(`Invalid ${key}: ${value}`);
      }
    }
  }
  
  return resolvedParams;
}

// Common parameter validators
export const paramValidators = {
  uuid: (value: string): boolean =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value),
  
  email: (value: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    
  role: (value: string): boolean =>
    ["developer", "org_admin", "manager", "consultant", "viewer"].includes(value),
    
  status: (value: string): boolean =>
    ["active", "inactive", "locked", "pending"].includes(value),
};

// Rate limiting helper (basic implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60 * 1000 // 1 minute
): void {
  const now = Date.now();
  const key = identifier;
  const current = rateLimitMap.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return;
  }
  
  if (current.count >= maxRequests) {
    throw new Error("Rate limit exceeded");
  }
  
  current.count++;
}

// Utility to extract client IP for rate limiting
export function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIP = req.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return "unknown";
}

// Helper for paginated responses
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number = 1,
  limit: number = 20
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

// Query parameter parsing helpers
export function getSearchParams(req: NextRequest) {
  return {
    getString: (key: string, defaultValue?: string): string | undefined => {
      const value = req.nextUrl.searchParams.get(key);
      return value || defaultValue;
    },
    
    getNumber: (key: string, defaultValue?: number): number | undefined => {
      const value = req.nextUrl.searchParams.get(key);
      if (!value) return defaultValue;
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? defaultValue : parsed;
    },
    
    getBoolean: (key: string, defaultValue?: boolean): boolean | undefined => {
      const value = req.nextUrl.searchParams.get(key);
      if (!value) return defaultValue;
      return value.toLowerCase() === "true";
    },
    
    getArray: (key: string): string[] => {
      const value = req.nextUrl.searchParams.get(key);
      return value ? value.split(",").map(v => v.trim()) : [];
    },
  };
}

// Authentication and authorization helpers
export async function requireAuth(): Promise<{ userId: string; sessionClaims: any }> {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    throw new AuthorizationError("Authentication required");
  }
  
  return { userId, sessionClaims };
}

export async function requirePermissions(allowedRoles: string[]): Promise<{ userId: string; role: string }> {
  const { userId, sessionClaims } = await requireAuth();
  
  const userRole = (sessionClaims as any)?.metadata?.role as string;
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    throw new AuthorizationError(`Insufficient permissions. Required: ${allowedRoles.join(", ")}`);
  }
  
  return { userId, role: userRole };
}

export async function requireAdminSecret(req: NextRequest): Promise<void> {
  const adminSecret = req.headers.get('x-admin-secret');
  
  if (adminSecret !== process.env.HASURA_ADMIN_SECRET) {
    throw new AuthorizationError("Invalid admin secret");
  }
}

export async function requireRole(allowedRoles: string[]): Promise<{ userId: string; role: string }> {
  const { userId, sessionClaims } = await requireAuth();
  
  const userRole = (sessionClaims as any)?.metadata?.role as string;
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    throw new AuthorizationError(`Admin role required. Required: ${allowedRoles.join(", ")}`);
  }
  
  return { userId, role: userRole };
}