// lib/security/api-signing.ts
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

import { NextRequest, NextResponse } from "next/server";

import {
  auditLogger,
  LogLevel,
  LogCategory,
  SOC2EventType,
} from "./audit/logger";

import { ApiResponses } from "@/lib/api-responses";

// Configuration for API signing
const SIGNING_CONFIG = {
  algorithm: "sha256",
  timestampTolerance: 5 * 60 * 1000, // 5 minutes
  nonceWindow: 10 * 60 * 1000, // 10 minutes
  secretRotationInterval: 24 * 60 * 60 * 1000, // 24 hours
};

// In-memory nonce store (in production, use Redis or database)
const nonceStore = new Map<string, number>();

// Enhanced cleanup with memory management and error handling
const cleanupInterval = setInterval(() => {
  try {
    const now = Date.now();
    const initialSize = nonceStore.size;
    let cleanedCount = 0;
    
    for (const [nonce, timestamp] of nonceStore.entries()) {
      if (now - timestamp > SIGNING_CONFIG.nonceWindow) {
        nonceStore.delete(nonce);
        cleanedCount++;
      }
    }
    
    // Log cleanup stats for monitoring
    if (cleanedCount > 0) {
      console.log(`🧹 [NONCE CLEANUP] Removed ${cleanedCount} expired nonces (${initialSize} → ${nonceStore.size})`);
    }
    
    // Prevent memory growth beyond reasonable limits
    if (nonceStore.size > 10000) {
      console.warn(`⚠️ [MEMORY WARNING] Nonce store size: ${nonceStore.size}. Consider Redis for production.`);
    }
  } catch (error) {
    console.error("❌ [NONCE CLEANUP ERROR]:", error);
  }
}, 60000); // Clean up every minute

// Cleanup function for graceful shutdown
export function cleanupNonceStore(): void {
  try {
    clearInterval(cleanupInterval);
    const size = nonceStore.size;
    nonceStore.clear();
    console.log(`🧹 [SHUTDOWN] Cleared nonce store (${size} entries)`);
  } catch (error) {
    console.error("❌ [SHUTDOWN ERROR] Failed to cleanup nonce store:", error);
  }
}

/**
 * Generate API signature for request
 */
export function generateSignature(
  method: string,
  path: string,
  body: string,
  timestamp: string,
  nonce: string,
  secret: string
): string {
  const payload = `${method}|${path}|${body}|${timestamp}|${nonce}`;
  return createHmac(SIGNING_CONFIG.algorithm, secret)
    .update(payload)
    .digest("hex");
}

/**
 * Generate nonce for request
 */
export function generateNonce(): string {
  return randomBytes(16).toString("hex");
}

/**
 * Get current timestamp for signing
 */
export function getSigningTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

/**
 * Create signed request headers
 */
export function createSignedHeaders(
  method: string,
  path: string,
  body: string = "",
  apiKey: string,
  apiSecret: string
): Record<string, string> {
  const timestamp = getSigningTimestamp();
  const nonce = generateNonce();
  const signature = generateSignature(
    method,
    path,
    body,
    timestamp,
    nonce,
    apiSecret
  );

  return {
    "X-API-Key": apiKey,
    "X-Timestamp": timestamp,
    "X-Nonce": nonce,
    "X-Signature": signature,
    "Content-Type": "application/json",
  };
}

/**
 * Validate API signature
 */
export interface SignatureValidationResult {
  isValid: boolean;
  error?: any;
  apiKey?: string;
  timestamp?: number;
  nonce?: string;
}

export async function validateSignature(
  request: NextRequest,
  getApiSecret: (apiKey: string) => Promise<string | null>
): Promise<SignatureValidationResult> {
  try {
    // Extract signature headers
    const apiKey = request.headers.get("x-api-key");
    const timestamp = request.headers.get("x-timestamp");
    const nonce = request.headers.get("x-nonce");
    const signature = request.headers.get("x-signature");

    if (!apiKey || !timestamp || !nonce || !signature) {
      return {
        isValid: false,
        error: ApiResponses.badRequest(
          "Missing required signature headers"
        ),
      };
    }

    // Validate timestamp
    const timestampMs = parseInt(timestamp) * 1000;
    const now = Date.now();

    if (Math.abs(now - timestampMs) > SIGNING_CONFIG.timestampTolerance) {
      const clientInfo = auditLogger.extractClientInfo(request);
      await auditLogger.logSOC2Event({
        level: LogLevel.WARNING,
        category: LogCategory.SECURITY_EVENT,
        eventType: SOC2EventType.SECURITY_VIOLATION,
        resourceType: "apirequest",
        action: "TIMESTAMP_VALIDATION",
        success: false,
        ipAddress: clientInfo.ipAddress || "unknown",
        userAgent: clientInfo.userAgent || "unknown",
        metadata: {
          apiKey,
          timestamp,
          timeDiff: now - timestampMs,
          tolerance: SIGNING_CONFIG.timestampTolerance,
        },
        complianceNote: "API request with invalid timestamp",
      });

      return {
        isValid: false,
        error: ApiResponses.badRequest(
          "Request timestamp out of tolerance"
        ),
      };
    }

    // Check nonce for replay attacks
    if (nonceStore.has(nonce)) {
      const clientInfo = auditLogger.extractClientInfo(request);
      await auditLogger.logSOC2Event({
        level: LogLevel.SECURITY,
        category: LogCategory.SECURITY_EVENT,
        eventType: SOC2EventType.SUSPICIOUS_ACTIVITY,
        resourceType: "apirequest",
        action: "REPLAY_ATTACK",
        success: false,
        ipAddress: clientInfo.ipAddress || "unknown",
        userAgent: clientInfo.userAgent || "unknown",
        metadata: {
          apiKey,
          nonce,
          originalTimestamp: nonceStore.get(nonce),
        },
        complianceNote: "API request replay attack detected",
      });

      return {
        isValid: false,
        error: ApiResponses.badRequest(
          "Nonce already used (replay attack)"
        ),
      };
    }

    // Get API secret for the key
    const apiSecret = await getApiSecret(apiKey);
    if (!apiSecret) {
      const clientInfo = auditLogger.extractClientInfo(request);
      await auditLogger.logSOC2Event({
        level: LogLevel.WARNING,
        category: LogCategory.SECURITY_EVENT,
        eventType: SOC2EventType.UNAUTHORIZED_ACCESS_ATTEMPT,
        resourceType: "api_key",
        action: "VALIDATION",
        success: false,
        ipAddress: clientInfo.ipAddress || "unknown",
        userAgent: clientInfo.userAgent || "unknown",
        metadata: { apiKey },
        complianceNote: "API request with invalid API key",
      });

      return {
        isValid: false,
        error: ApiResponses.authenticationRequired(),
      };
    }

    // Read request body
    const body = await request.text();

    // Generate expected signature
    const method = request.method;
    const path = request.nextUrl.pathname + request.nextUrl.search;
    const expectedSignature = generateSignature(
      method,
      path,
      body,
      timestamp,
      nonce,
      apiSecret
    );

    // Compare signatures using timing-safe comparison
    const signatureBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      const clientInfo = auditLogger.extractClientInfo(request);
      await auditLogger.logSOC2Event({
        level: LogLevel.WARNING,
        category: LogCategory.SECURITY_EVENT,
        eventType: SOC2EventType.UNAUTHORIZED_ACCESS_ATTEMPT,
        resourceType: "api_signature",
        action: "VALIDATION",
        success: false,
        ipAddress: clientInfo.ipAddress || "unknown",
        userAgent: clientInfo.userAgent || "unknown",
        metadata: {
          apiKey,
          method,
          path,
          expectedLength: expectedBuffer.length,
          actualLength: signatureBuffer.length,
        },
        complianceNote: "API request with invalid signature",
      });

      return {
        isValid: false,
        error: ApiResponses.authenticationRequired(),
      };
    }

    // Store nonce to prevent replay
    nonceStore.set(nonce, now);

    // Log successful validation
    const clientInfo = auditLogger.extractClientInfo(request);
    await auditLogger.logSOC2Event({
      level: LogLevel.INFO,
      category: LogCategory.AUTHENTICATION,
      eventType: SOC2EventType.LOGIN_SUCCESS,
      resourceType: "api_signature",
      action: "VALIDATION",
      success: true,
      ipAddress: clientInfo.ipAddress || "unknown",
      userAgent: clientInfo.userAgent || "unknown",
      metadata: {
        apiKey,
        method,
        path,
      },
      complianceNote: "API signature validation successful",
    });

    return {
      isValid: true,
      apiKey,
      timestamp: timestampMs,
      nonce,
    };
  } catch (error) {
    console.error("Signature validation error:", error);
    return {
      isValid: false,
      error: ApiResponses.secureError(error, "signature_validation"),
    };
  }
}

/**
 * Middleware wrapper for API signature validation
 */
export function withSignatureValidation(
  handler: (
    req: NextRequest,
    context: { apiKey: string; timestamp: number }
  ) => Promise<NextResponse>,
  getApiSecret: (apiKey: string) => Promise<string | null>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const validation = await validateSignature(request, getApiSecret);

    if (!validation.isValid) {
      const status =
        validation.error?.code === "AUTHENTICATION_REQUIRED" ? 401 : 400;
      return NextResponse.json(validation.error, { status });
    }

    return handler(request, {
      apiKey: validation.apiKey!,
      timestamp: validation.timestamp!,
    });
  };
}

/**
 * API Key Management
 * NOTE: Use PersistentAPIKeyManager from persistent-api-keys.ts for database-backed key management
 */

/**
 * Client-side utility for making signed requests
 */
export class SignedAPIClient {
  constructor(
    private apiKey: string,
    private apiSecret: string,
    private baseUrl: string = ""
  ) {}

  async request(method: string, path: string, body?: any): Promise<Response> {
    const bodyString = body ? JSON.stringify(body) : "";
    const headers = createSignedHeaders(
      method,
      path,
      bodyString,
      this.apiKey,
      this.apiSecret
    );

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      ...(bodyString && { body: bodyString }),
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response;
  }

  async get(path: string): Promise<Response> {
    return this.request("GET", path);
  }

  async post(path: string, body: any): Promise<Response> {
    return this.request("POST", path, body);
  }

  async put(path: string, body: any): Promise<Response> {
    return this.request("PUT", path, body);
  }

  async delete(path: string): Promise<Response> {
    return this.request("DELETE", path);
  }
}

// Export default instances
// Note: Use PersistentAPIKeyManager for new implementations
