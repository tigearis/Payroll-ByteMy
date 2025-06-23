/**
 * Client Information Extraction Utilities
 * 
 * Shared utility to extract client IP and user agent from requests.
 * Consolidates duplicate implementations across authentication and security modules.
 * 
 * Used by:
 * - lib/auth/service-auth.ts
 * - lib/auth/api-auth.ts  
 * - lib/security/auth-audit.ts
 * - lib/security/audit/logger.ts
 * - lib/security/api-signing.ts
 * - lib/security/enhanced-route-monitor.ts
 * - lib/security/mfa-middleware.ts
 */

import { NextRequest } from 'next/server';

export interface ClientInfo {
  clientIP: string;
  userAgent: string;
}

/**
 * Extract client IP address from request headers
 * Supports various proxy configurations (Cloudflare, load balancers, etc.)
 */
export function extractClientIP(request: NextRequest): string {
  // Try different header sources in order of preference
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  const remoteAddr = request.headers.get('x-remote-addr');
  
  // x-forwarded-for can contain multiple IPs, take the first (original client)
  if (forwarded) {
    const firstIP = forwarded.split(',')[0].trim();
    if (firstIP) return firstIP;
  }
  
  // Try other headers
  if (realIP) return realIP;
  if (cfConnectingIP) return cfConnectingIP;
  if (remoteAddr) return remoteAddr;
  
  return 'unknown';
}

/**
 * Extract user agent from request headers
 */
export function extractUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}

/**
 * Extract both client IP and user agent in one call
 * This is the most commonly used function across the codebase
 */
export function extractClientInfo(request: NextRequest): ClientInfo {
  return {
    clientIP: extractClientIP(request),
    userAgent: extractUserAgent(request),
  };
}

/**
 * Extract additional client information for enhanced logging
 * 
 * @future-enhancement Could be extended to include:
 * - Geographic location (via IP lookup)
 * - ISP information
 * - Browser/device detection
 * - Security threat scoring
 */
export function extractEnhancedClientInfo(request: NextRequest) {
  const basic = extractClientInfo(request);
  
  return {
    ...basic,
    referer: request.headers.get('referer') || undefined,
    origin: request.headers.get('origin') || undefined,
    acceptLanguage: request.headers.get('accept-language') || undefined,
    acceptEncoding: request.headers.get('accept-encoding') || undefined,
    connection: request.headers.get('connection') || undefined,
    // Future enhancement: Add geolocation, threat scoring, etc.
  };
}

/**
 * Validate if an IP address appears to be valid
 * Basic validation - could be enhanced with proper IP parsing
 * 
 * @future-enhancement Add proper IPv4/IPv6 validation
 */
export function isValidIP(ip: string): boolean {
  if (!ip || ip === 'unknown') return false;
  
  // Basic IPv4 check
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipv4Regex.test(ip)) return true;
  
  // Basic IPv6 check (simplified)
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  if (ipv6Regex.test(ip)) return true;
  
  return false;
}

/**
 * Check if IP is from a private/internal network
 * Useful for distinguishing internal vs external requests
 * 
 * @future-enhancement Add more comprehensive private IP ranges
 */
export function isPrivateIP(ip: string): boolean {
  if (!isValidIP(ip)) return false;
  
  // Common private IP ranges
  const privateRanges = [
    /^127\./, // Loopback
    /^10\./, // Class A private
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Class B private
    /^192\.168\./, // Class C private
    /^::1$/, // IPv6 loopback
    /^fc00:/, // IPv6 private
  ];
  
  return privateRanges.some(range => range.test(ip));
}