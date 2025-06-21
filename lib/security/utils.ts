/**
 * Security Utilities
 * Helper functions for security operations
 */

import crypto from 'crypto';

import { securityConfig } from './config';

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash a password using PBKDF2
 */
export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = crypto.randomBytes(securityConfig.encryption.saltLength).toString('hex');
  const hash = crypto.pbkdf2Sync(
    password,
    salt,
    securityConfig.encryption.iterations,
    64,
    'sha512'
  ).toString('hex');
  
  return { hash, salt };
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string,
  salt: string
): Promise<boolean> {
  const verifyHash = crypto.pbkdf2Sync(
    password,
    salt,
    securityConfig.encryption.iterations,
    64,
    'sha512'
  ).toString('hex');
  
  return hash === verifyHash;
}

/**
 * Encrypt sensitive data
 */
export function encryptData(data: string, key: string): {
  encrypted: string;
  iv: string;
  tag: string;
} {
  const iv = crypto.randomBytes(securityConfig.encryption.ivLength);
  const cipher = crypto.createCipheriv(
    securityConfig.encryption.algorithm,
    Buffer.from(key, 'hex'),
    iv
  );
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = (cipher as any).getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
  };
}

/**
 * Decrypt sensitive data
 */
export function decryptData(
  encrypted: string,
  key: string,
  iv: string,
  tag: string
): string {
  const decipher = crypto.createDecipheriv(
    securityConfig.encryption.algorithm,
    Buffer.from(key, 'hex'),
    Buffer.from(iv, 'hex')
  );
  
  (decipher as any).setAuthTag(Buffer.from(tag, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  // Remove any potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const { passwordPolicy } = securityConfig.auth;
  
  if (password.length < passwordPolicy.minLength) {
    errors.push(`Password must be at least ${passwordPolicy.minLength} characters long`);
  }
  
  if (passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (passwordPolicy.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (passwordPolicy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return generateSecureToken(32);
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken && token.length === 64;
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  const masked = Array.isArray(data) ? [...data] : { ...data };
  
  for (const key in masked) {
    if (securityConfig.audit.sensitiveFields.some(field => 
      key.toLowerCase().includes(field.toLowerCase())
    )) {
      masked[key] = '***REDACTED***';
    } else if (typeof masked[key] === 'object') {
      masked[key] = maskSensitiveData(masked[key]);
    }
  }
  
  return masked;
}

/**
 * Generate request signature for API calls
 */
export function generateRequestSignature(
  method: string,
  path: string,
  timestamp: number,
  body: string,
  secret: string
): string {
  const message = `${method}:${path}:${timestamp}:${body}`;
  return crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');
}

/**
 * Verify request signature
 */
export function verifyRequestSignature(
  signature: string,
  method: string,
  path: string,
  timestamp: number,
  body: string,
  secret: string
): boolean {
  const expectedSignature = generateRequestSignature(method, path, timestamp, body, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Check if IP is rate limited
 */
export function checkRateLimit(
  ip: string,
  endpoint: string,
  attempts: Map<string, { count: number; resetTime: number }>
): { allowed: boolean; retryAfter?: number } {
  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  const limit = (securityConfig.rateLimit.endpoints as any)[endpoint] || securityConfig.rateLimit;
  
  const record = attempts.get(key);
  
  if (!record || record.resetTime < now) {
    attempts.set(key, {
      count: 1,
      resetTime: now + limit.windowMs,
    });
    return { allowed: true };
  }
  
  if (record.count >= limit.max) {
    return {
      allowed: false,
      retryAfter: Math.ceil((record.resetTime - now) / 1000),
    };
  }
  
  record.count++;
  return { allowed: true };
}