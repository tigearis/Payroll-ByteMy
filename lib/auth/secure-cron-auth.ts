/**
 * Secure Cron Job Authentication
 * Replaces simple secret authentication with HMAC signature validation
 */

import crypto from "crypto";
import { NextRequest } from "next/server";

export interface CronAuthResult {
  isValid: boolean;
  error?: string;
  timestamp?: number;
  operation?: string;
}

export interface CronRequestData {
  timestamp: number;
  operation: string;
  payload?: any;
}

/**
 * Validates HMAC-signed cron job requests
 */
export function validateSecureCronRequest(request: NextRequest): CronAuthResult {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return { isValid: false, error: "CRON_SECRET not configured" };
  }

  // Extract headers
  const signature = request.headers.get("x-cron-signature");
  const timestamp = request.headers.get("x-cron-timestamp");
  const operation = request.headers.get("x-cron-operation");

  if (!signature || !timestamp || !operation) {
    return {
      isValid: false,
      error: "Missing required headers: x-cron-signature, x-cron-timestamp, x-cron-operation"
    };
  }

  // Validate timestamp (prevent replay attacks)
  const now = Math.floor(Date.now() / 1000);
  const requestTime = parseInt(timestamp);
  const maxAge = 300; // 5 minutes

  if (Math.abs(now - requestTime) > maxAge) {
    return {
      isValid: false,
      error: "Request timestamp too old or in future",
      timestamp: requestTime
    };
  }

  // Create expected signature
  const payload = `${timestamp}:${operation}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  // Compare signatures securely
  const providedSignature = signature.replace("sha256=", "");
  const isValidSignature = crypto.timingSafeEqual(
    Buffer.from(expectedSignature, "hex"),
    Buffer.from(providedSignature, "hex")
  );

  if (!isValidSignature) {
    return {
      isValid: false,
      error: "Invalid signature",
      timestamp: requestTime,
      operation
    };
  }

  return {
    isValid: true,
    timestamp: requestTime,
    operation
  };
}

/**
 * Generates HMAC signature for outgoing cron requests
 */
export function generateCronSignature(operation: string, secret: string): {
  signature: string;
  timestamp: number;
  headers: Record<string, string>;
} {
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = `${timestamp}:${operation}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return {
    signature: `sha256=${signature}`,
    timestamp,
    headers: {
      "x-cron-signature": `sha256=${signature}`,
      "x-cron-timestamp": timestamp.toString(),
      "x-cron-operation": operation,
      "content-type": "application/json"
    }
  };
}

/**
 * Validates and extracts cron request data with body verification
 */
export async function validateCronRequestWithBody(
  request: NextRequest
): Promise<CronAuthResult & { data?: any }> {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return { isValid: false, error: "CRON_SECRET not configured" };
  }

  // Extract headers
  const signature = request.headers.get("x-cron-signature");
  const timestamp = request.headers.get("x-cron-timestamp");
  const operation = request.headers.get("x-cron-operation");

  if (!signature || !timestamp || !operation) {
    return {
      isValid: false,
      error: "Missing required headers"
    };
  }

  // Validate timestamp
  const now = Math.floor(Date.now() / 1000);
  const requestTime = parseInt(timestamp);
  const maxAge = 300; // 5 minutes

  if (Math.abs(now - requestTime) > maxAge) {
    return {
      isValid: false,
      error: "Request timestamp expired",
      timestamp: requestTime
    };
  }

  // Get request body
  let body = "";
  try {
    body = await request.text();
  } catch (error) {
    return {
      isValid: false,
      error: "Failed to read request body",
      timestamp: requestTime,
      operation
    };
  }

  // Create payload including body for signature verification
  const payload = `${timestamp}:${operation}:${body}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  // Compare signatures
  const providedSignature = signature.replace("sha256=", "");
  const isValidSignature = crypto.timingSafeEqual(
    Buffer.from(expectedSignature, "hex"),
    Buffer.from(providedSignature, "hex")
  );

  if (!isValidSignature) {
    return {
      isValid: false,
      error: "Invalid signature for request body",
      timestamp: requestTime,
      operation
    };
  }

  // Parse body as JSON if present
  let data = null;
  if (body) {
    try {
      data = JSON.parse(body);
    } catch {
      // Keep as string if not valid JSON
      data = body;
    }
  }

  return {
    isValid: true,
    timestamp: requestTime,
    operation,
    data
  };
}

/**
 * Wrapper function for backward compatibility
 */
export function validateCronRequest(request: NextRequest): boolean {
  const result = validateSecureCronRequest(request);
  if (!result.isValid) {
    console.warn(`Cron auth failed: ${result.error}`);
  }
  return result.isValid;
}

/**
 * Enhanced cron authentication middleware
 */
export function withSecureCronAuth(
  handler: (request: NextRequest, authData: CronAuthResult) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    const authResult = validateSecureCronRequest(request);
    
    if (!authResult.isValid) {
      console.error("Cron authentication failed:", authResult.error);
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: authResult.error,
          code: "CRON_AUTH_FAILED"
        }),
        {
          status: 401,
          headers: { "content-type": "application/json" }
        }
      );
    }

    console.log(`✅ Cron auth success: ${authResult.operation} at ${authResult.timestamp}`);
    return handler(request, authResult);
  };
}

/**
 * Create authenticated cron client for making requests
 */
export class SecureCronClient {
  private secret: string;
  private baseUrl: string;

  constructor(secret: string, baseUrl: string) {
    this.secret = secret;
    this.baseUrl = baseUrl;
  }

  async makeRequest(operation: string, endpoint: string, data?: any): Promise<Response> {
    const { headers } = generateCronSignature(operation, this.secret);
    
    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        ...headers,
        "content-type": "application/json"
      }
    };

    if (data) {
      requestOptions.body = JSON.stringify(data);
      // Regenerate signature with body
      const timestamp = Math.floor(Date.now() / 1000);
      const payload = `${timestamp}:${operation}:${requestOptions.body}`;
      const signature = crypto
        .createHmac("sha256", this.secret)
        .update(payload)
        .digest("hex");
      
      requestOptions.headers = {
        ...requestOptions.headers,
        "x-cron-signature": `sha256=${signature}`,
        "x-cron-timestamp": timestamp.toString()
      };
    }

    return fetch(`${this.baseUrl}${endpoint}`, requestOptions);
  }
}

/**
 * Utility to create cron client
 */
export function createSecureCronClient(): SecureCronClient | null {
  const secret = process.env.CRON_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  if (!secret || !baseUrl) {
    console.error("Missing CRON_SECRET or NEXT_PUBLIC_APP_URL environment variables");
    return null;
  }
  
  return new SecureCronClient(secret, baseUrl);
}