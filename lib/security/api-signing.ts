/**
 * API Request Signing
 * 
 * Provides utilities for signing and verifying API requests to ensure
 * integrity and authenticity of API communications.
 */

import crypto from 'crypto';

export interface SignedRequest {
  payload: any;
  signature: string;
  timestamp: number;
  nonce: string;
}

export interface SigningOptions {
  algorithm?: string;
  timestampTolerance?: number; // seconds
  includeNonce?: boolean;
}

export interface VerificationResult {
  valid: boolean;
  error?: string;
  timestamp?: number;
}

/**
 * Default signing options
 */
const DEFAULT_OPTIONS: Required<SigningOptions> = {
  algorithm: 'sha256',
  timestampTolerance: 300, // 5 minutes
  includeNonce: true,
};

/**
 * Generate a cryptographically secure nonce
 */
function generateNonce(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Get API signing key from environment
 */
function getSigningKey(): string {
  const key = process.env.API_SIGNING_KEY;
  if (!key) {
    throw new Error('API_SIGNING_KEY environment variable is required');
  }
  return key;
}

/**
 * Create signature for payload
 */
function createSignature(
  payload: any,
  timestamp: number,
  nonce: string,
  algorithm: string
): string {
  const key = getSigningKey();
  const dataToSign = JSON.stringify({
    payload,
    timestamp,
    nonce,
  });

  return crypto
    .createHmac(algorithm, key)
    .update(dataToSign)
    .digest('hex');
}

/**
 * Sign an API request payload
 */
export function signRequest(
  payload: any,
  options: SigningOptions = {}
): SignedRequest {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = opts.includeNonce ? generateNonce() : '';
  
  const signature = createSignature(payload, timestamp, nonce, opts.algorithm);

  return {
    payload,
    signature,
    timestamp,
    nonce,
  };
}

/**
 * Verify a signed API request
 */
export function verifyRequest(
  signedRequest: SignedRequest,
  options: SigningOptions = {}
): VerificationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  try {
    // Check timestamp tolerance
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timeDiff = Math.abs(currentTimestamp - signedRequest.timestamp);
    
    if (timeDiff > opts.timestampTolerance) {
      return {
        valid: false,
        error: 'Request timestamp is outside tolerance window',
        timestamp: signedRequest.timestamp,
      };
    }

    // Recreate signature
    const expectedSignature = createSignature(
      signedRequest.payload,
      signedRequest.timestamp,
      signedRequest.nonce,
      opts.algorithm
    );

    // Compare signatures using constant-time comparison
    const signatureMatch = crypto.timingSafeEqual(
      Buffer.from(signedRequest.signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );

    if (!signatureMatch) {
      return {
        valid: false,
        error: 'Invalid signature',
      };
    }

    return {
      valid: true,
      timestamp: signedRequest.timestamp,
    };
  } catch (error) {
    return {
      valid: false,
      error: `Verification error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Sign API key for secure transmission
 */
export function signApiKey(apiKey: string, userId: string): string {
  const key = getSigningKey();
  const timestamp = Math.floor(Date.now() / 1000);
  const dataToSign = `${apiKey}:${userId}:${timestamp}`;
  
  const signature = crypto
    .createHmac('sha256', key)
    .update(dataToSign)
    .digest('hex');

  return `${signature}:${timestamp}`;
}

/**
 * Verify signed API key
 */
export function verifyApiKey(
  apiKey: string,
  userId: string,
  signedKey: string,
  toleranceSeconds: number = 3600 // 1 hour
): boolean {
  try {
    const [signature, timestamp] = signedKey.split(':');
    if (!signature || !timestamp) {
      return false;
    }

    const timestampNum = parseInt(timestamp, 10);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    
    // Check timestamp tolerance
    if (Math.abs(currentTimestamp - timestampNum) > toleranceSeconds) {
      return false;
    }

    // Recreate signature
    const key = getSigningKey();
    const dataToSign = `${apiKey}:${userId}:${timestampNum}`;
    const expectedSignature = crypto
      .createHmac('sha256', key)
      .update(dataToSign)
      .digest('hex');

    // Compare signatures
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    return false;
  }
}

/**
 * Generate secure API key
 */
export function generateApiKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash API key for storage
 */
export function hashApiKey(apiKey: string): string {
  return crypto
    .createHash('sha256')
    .update(apiKey)
    .digest('hex');
}

/**
 * Middleware for verifying signed requests
 */
export function createSignatureVerificationMiddleware(options: SigningOptions = {}) {
  return (req: Request, requiredSignature?: string) => {
    if (!requiredSignature) {
      return { valid: false, error: 'No signature provided' };
    }

    try {
      const signedRequest: SignedRequest = JSON.parse(requiredSignature);
      return verifyRequest(signedRequest, options);
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid signature format',
      };
    }
  };
}

/**
 * API signing utilities
 */
export const APISigning = {
  signRequest,
  verifyRequest,
  signApiKey,
  verifyApiKey,
  generateApiKey,
  hashApiKey,
  createSignatureVerificationMiddleware,
};

/**
 * Types for API signing
 */
export type { SignedRequest, SigningOptions, VerificationResult };