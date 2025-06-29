/**
 * Service Authentication Module
 * 
 * Provides centralized authentication for service operations using Hasura admin secret.
 * This module handles:
 * - Admin secret validation
 * - Optional IP restrictions (future enhancement)
 * - Audit logging for service operations
 * - Rate limiting for security
 * 
 * @future-enhancement Potential improvements:
 * - CIDR notation support for IP restrictions (currently simple string matching)
 * - Redis-based rate limiting for distributed deployments
 * - Webhook signature validation for external services
 * - API key authentication as alternative to admin secret
 * - Mutual TLS (mTLS) support for high-security environments
 * - Integration with external threat intelligence APIs
 * - Advanced anomaly detection for suspicious access patterns
 */

import { NextRequest } from 'next/server';
import { auditLogger, LogLevel, LogCategory, AuditAction, DataClassification } from '@/lib/security/audit/logger';
import { extractClientInfo } from '@/lib/utils/client-info';

// Types for service authentication
export interface ServiceAuthConfig {
  enableIPRestrictions?: boolean;
  enableRateLimiting?: boolean;
  enableAuditLogging?: boolean;
}

export interface ServiceAuthResult {
  isValid: boolean;
  reason?: string;
  metadata?: {
    clientIP?: string;
    userAgent?: string;
    operation?: string;
  };
}

export interface ServiceOperation {
  type: 'webhook' | 'cron' | 'admin' | 'sync';
  name: string;
  userId?: string;
  metadata?: Record<string, any>;
}

// Rate limiting store (in-memory for now, could be Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// extractClientInfo moved to shared utility: @/lib/utils/client-info

/**
 * Validate admin secret from request headers
 */
export function validateAdminSecret(request: NextRequest): boolean {
  const adminSecret = process.env.HASURA_GRAPHQL_ADMIN_SECRET;
  
  if (!adminSecret) {
    console.error('🔒 HASURA_GRAPHQL_ADMIN_SECRET not configured');
    return false;
  }
  
  // Check for admin secret in headers
  const headerSecret = request.headers.get('x-hasura-admin-secret');
  const authHeader = request.headers.get('authorization');
  
  // Support both x-hasura-admin-secret header and Authorization header
  if (headerSecret === adminSecret) {
    return true;
  }
  
  if (authHeader === `Bearer ${adminSecret}`) {
    return true;
  }
  
  return false;
}

/**
 * Validate IP restrictions (optional)
 */
export function validateIPRestrictions(request: NextRequest): boolean {
  const allowedIPs = process.env.SERVICE_ALLOWED_IPS;
  
  // If no IP restrictions configured, allow all
  if (!allowedIPs) {
    return true;
  }
  
  const { clientIP } = extractClientInfo(request);
  const allowedIPList = allowedIPs.split(',').map(ip => ip.trim());
  
  // Simple IP matching (could be enhanced with CIDR support)
  return allowedIPList.includes(clientIP) || allowedIPList.includes('*');
}

/**
 * Check rate limits for service operations
 */
export function checkRateLimit(clientIP: string, operation: string): boolean {
  if (!process.env.ENABLE_RATE_LIMITING) {
    return true; // Rate limiting disabled
  }
  
  const key = `${clientIP}:${operation}`;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 60; // Max requests per window
  
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    // Reset window
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (entry.count >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  entry.count++;
  return true;
}

/**
 * Log service authentication events
 */
export async function logServiceAuth(
  operation: ServiceOperation,
  result: ServiceAuthResult,
  request: NextRequest
) {
  if (!process.env.ENABLE_AUDIT_LOGGING) {
    return; // Audit logging disabled
  }
  
  const { clientIP, userAgent } = extractClientInfo(request);
  
  const logEntry = {
    timestamp: new Date().toISOString(),
    type: 'SERVICE_AUTH',
    operation: operation.name,
    operationType: operation.type,
    success: result.isValid,
    clientIP,
    userAgent,
    userId: operation.userId,
    reason: result.reason,
    metadata: {
      ...operation.metadata,
      ...result.metadata,
    },
  };
  
  // Log to console for development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 Service Auth:', JSON.stringify(logEntry, null, 2));
  }
  
  // Send to audit logging service
  try {
    const auditEntry: any = {
      userId: 'service',
      userRole: 'system',
      action: AuditAction.READ,
      entityType: 'service_auth',
      entityId: String(operation),
      dataClassification: DataClassification.CRITICAL,
      success: logEntry.success,
      requestId: `service-${Date.now()}`,
      method: 'SERVICE_AUTH',
      ipAddress: logEntry.clientIP,
      userAgent: logEntry.userAgent,
    };
    
    if (logEntry.reason) {
      auditEntry.errorMessage = logEntry.reason;
    }
    
    await auditLogger.logAuditEvent(auditEntry);
  } catch (error) {
    console.error('Failed to log service authentication to audit service:', error);
  }
}

/**
 * Main service authentication function
 */
export async function authenticateServiceRequest(
  request: NextRequest,
  operation: ServiceOperation,
  config: ServiceAuthConfig = {}
): Promise<ServiceAuthResult> {
  const { clientIP, userAgent } = extractClientInfo(request);
  
  // 1. Validate admin secret
  if (!validateAdminSecret(request)) {
    const result: ServiceAuthResult = {
      isValid: false,
      reason: 'Invalid or missing admin secret',
      metadata: { clientIP, userAgent },
    };
    
    await logServiceAuth(operation, result, request);
    return result;
  }
  
  // 2. Check IP restrictions (if enabled)
  if (config.enableIPRestrictions && !validateIPRestrictions(request)) {
    const result: ServiceAuthResult = {
      isValid: false,
      reason: 'IP address not in allowed list',
      metadata: { clientIP, userAgent },
    };
    
    await logServiceAuth(operation, result, request);
    return result;
  }
  
  // 3. Check rate limits (if enabled)
  if (config.enableRateLimiting && !checkRateLimit(clientIP, operation.name)) {
    const result: ServiceAuthResult = {
      isValid: false,
      reason: 'Rate limit exceeded',
      metadata: { clientIP, userAgent },
    };
    
    await logServiceAuth(operation, result, request);
    return result;
  }
  
  // Authentication successful
  const result: ServiceAuthResult = {
    isValid: true,
    metadata: { clientIP, userAgent, operation: operation.name },
  };
  
  if (config.enableAuditLogging) {
    await logServiceAuth(operation, result, request);
  }
  
  return result;
}

/**
 * Helper function to create admin headers for GraphQL requests
 */
export function createAdminHeaders(): Record<string, string> {
  const adminSecret = process.env.HASURA_GRAPHQL_ADMIN_SECRET;
  
  if (!adminSecret) {
    throw new Error('HASURA_GRAPHQL_ADMIN_SECRET not configured');
  }
  
  return {
    'x-hasura-admin-secret': adminSecret,
    'Content-Type': 'application/json',
  };
}

/**
 * Validate service authentication for Apollo Client operations
 */
export function validateServiceOperation(operationType: string): boolean {
  const allowedOperations = [
    'webhook',
    'cron',
    'admin',
    'sync',
    'mutation',
    'query',
    'subscription',
  ];
  
  return allowedOperations.includes(operationType.toLowerCase());
}

/**
 * Security middleware for service endpoints
 */
export async function requireServiceAuth(
  request: NextRequest,
  operation: ServiceOperation,
  config: ServiceAuthConfig = {}
) {
  const authResult = await authenticateServiceRequest(request, operation, config);
  
  if (!authResult.isValid) {
    throw new Error(`Service authentication failed: ${authResult.reason}`);
  }
  
  return authResult;
}