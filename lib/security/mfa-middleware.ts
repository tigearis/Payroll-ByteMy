// lib/security/mfa-middleware.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import {
  auditLogger,
  LogLevel,
  LogCategory,
  SOC2EventType,
} from "./audit/logger";

import { securityConfig } from "./config";
import { SecureErrorHandler } from "./error-responses";

// Feature flag check - MFA is disabled if not explicitly enabled
const MFA_FEATURE_ENABLED = securityConfig.auth.mfaEnabled;

// Roles that require MFA
const MFA_REQUIRED_ROLES = ["developer", "org_admin"];

// Routes that require MFA regardless of role
const MFA_REQUIRED_ROUTES = [
  "/api/staff/delete",
  "/api/users/update-role",
  "/api/audit/compliance-report",
  "/api/developer",
  "/api/payrolls/schedule",
];

export interface MFAValidationResult {
  isValid: boolean;
  requiresMFA: boolean;
  mfaVerified: boolean;
  error?: any;
  userId?: string;
  userRole?: string;
}

/**
 * Check if MFA is required for the current user and route
 */
export async function validateMFARequirement(
  request: NextRequest
): Promise<MFAValidationResult> {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return {
        isValid: false,
        requiresMFA: false,
        mfaVerified: false,
        error: SecureErrorHandler.authenticationError(),
      };
    }

    // Extract user role - FIXED: Use actual role first
    const userRole = (sessionClaims?.["https://hasura.io/jwt/claims"]?.[
      "x-hasura-role"
    ] ||
      sessionClaims?.metadata?.role ||
      sessionClaims?.["https://hasura.io/jwt/claims"]?.[
        "x-hasura-default-role"
      ] ||
      (sessionClaims?.metadata as any)?.defaultrole) as string;

    const pathname = request.nextUrl.pathname;

    // Skip MFA validation if feature is disabled
    if (!MFA_FEATURE_ENABLED) {
      return {
        isValid: true,
        requiresMFA: false,
        mfaVerified: true,
        userId,
        userRole,
      };
    }

    // Check if MFA is required
    const requiresMFA =
      securityConfig.auth.mfaRequired &&
      (MFA_REQUIRED_ROLES.includes(userRole) ||
        MFA_REQUIRED_ROUTES.some(route => pathname.startsWith(route)));

    if (!requiresMFA) {
      return {
        isValid: true,
        requiresMFA: false,
        mfaVerified: true,
        userId,
        userRole,
      };
    }

    // Check MFA verification status from session claims
    const mfaVerified =
      sessionClaims?.two_factor_verified === true ||
      sessionClaims?.mfa_verified === true;

    if (!mfaVerified) {
      // Log MFA requirement
      const clientInfo = auditLogger.extractClientInfo(request);
      await auditLogger.logSOC2Event({
        level: LogLevel.WARNING,
        category: LogCategory.SECURITY_EVENT,
        eventType: SOC2EventType.MFA_CHALLENGE,
        userId,
        userRole,
        resourceType: "mfa",
        action: "CHALLENGE",
        success: false,
        ipAddress: clientInfo.ipAddress || "unknown",
        userAgent: clientInfo.userAgent || "unknown",
        metadata: {
          route: pathname,
          reason: "adminrole_or_sensitive_route",
        },
        complianceNote: "MFA required but not verified",
      });

      return {
        isValid: false,
        requiresMFA: true,
        mfaVerified: false,
        error: {
          error: "Multi-factor authentication required",
          code: "MFA_REQUIRED",
          details: {
            message: "This action requires MFA verification",
            redirectUrl: "/mfa-setup",
          },
        },
        userId,
        userRole,
      };
    }

    // Log successful MFA verification
    const clientInfo = auditLogger.extractClientInfo(request);
    await auditLogger.logSOC2Event({
      level: LogLevel.INFO,
      category: LogCategory.AUTHENTICATION,
      eventType: SOC2EventType.MFA_SUCCESS,
      userId,
      userRole,
      resourceType: "mfa",
      action: "VERIFICATION",
      success: true,
      ipAddress: clientInfo.ipAddress || "unknown",
      userAgent: clientInfo.userAgent || "unknown",
      metadata: {
        route: pathname,
      },
      complianceNote: "MFA verification successful",
    });

    return {
      isValid: true,
      requiresMFA: true,
      mfaVerified: true,
      userId,
      userRole,
    };
  } catch (error) {
    console.error("MFA validation error:", error);
    return {
      isValid: false,
      requiresMFA: false,
      mfaVerified: false,
      error: SecureErrorHandler.sanitizeError(error, "mfa_validation"),
    };
  }
}

/**
 * Middleware wrapper that enforces MFA for protected routes
 */
export function withMFA(
  handler: (
    req: NextRequest,
    mfaContext: { userId: string; userRole: string }
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const mfaResult = await validateMFARequirement(request);

    if (!mfaResult.isValid) {
      const status = mfaResult.error?.code === "MFA_REQUIRED" ? 403 : 401;
      return NextResponse.json(mfaResult.error, { status });
    }

    return handler(request, {
      userId: mfaResult.userId!,
      userRole: mfaResult.userRole!,
    });
  };
}

/**
 * Enhanced auth wrapper that includes MFA validation
 */
export function withAuthAndMFA(
  handler: (
    req: NextRequest,
    context: { userId: string; userRole: string }
  ) => Promise<NextResponse>,
  options?: {
    requiredRole?: string;
    allowedRoles?: string[];
    forceMFA?: boolean;
  }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // First, validate basic authentication
      const { userId, sessionClaims } = await auth();

      if (!userId) {
        return NextResponse.json(SecureErrorHandler.authenticationError(), {
          status: 401,
        });
      }

      const userRole = (sessionClaims?.["https://hasura.io/jwt/claims"]?.[
        "x-hasura-role"
      ] ||
        sessionClaims?.metadata?.role ||
        sessionClaims?.["https://hasura.io/jwt/claims"]?.[
          "x-hasura-default-role"
        ] ||
        (sessionClaims?.metadata as any)?.defaultrole) as string;

      // Check role requirements
      if (options?.requiredRole && userRole !== options.requiredRole) {
        return NextResponse.json(
          SecureErrorHandler.authorizationError(options.requiredRole),
          { status: 403 }
        );
      }

      if (options?.allowedRoles && !options.allowedRoles.includes(userRole)) {
        return NextResponse.json(
          SecureErrorHandler.authorizationError(
            `One of: ${options.allowedRoles.join(", ")}`
          ),
          { status: 403 }
        );
      }

      // Validate MFA if required and feature is enabled
      if (MFA_FEATURE_ENABLED) {
        const mfaResult = await validateMFARequirement(request);

        if (options?.forceMFA || mfaResult.requiresMFA) {
          if (!mfaResult.mfaVerified) {
            return NextResponse.json(mfaResult.error, { status: 403 });
          }
        }
      }

      return handler(request, { userId, userRole });
    } catch (error) {
      console.error("Auth + MFA validation error:", error);
      return NextResponse.json(
        SecureErrorHandler.sanitizeError(error, "auth_mfa_middleware"),
        { status: 500 }
      );
    }
  };
}

/**
 * Check if user has MFA enabled
 */
export async function getUserMFAStatus(userId: string): Promise<{
  enabled: boolean;
  methods: string[];
  verified: boolean;
}> {
  try {
    // Return disabled status if MFA feature is not enabled
    if (!MFA_FEATURE_ENABLED) {
      return {
        enabled: false,
        methods: [],
        verified: true, // Consider verified when feature is disabled
      };
    }

    // This would typically call Clerk's API to get MFA status
    // For now, we'll check the session claims
    const { sessionClaims } = await auth();

    const mfaEnabled = sessionClaims?.two_factor_enabled === true;
    const mfaVerified = sessionClaims?.two_factor_verified === true;

    return {
      enabled: mfaEnabled,
      methods: mfaEnabled ? ["totp"] : [],
      verified: mfaVerified,
    };
  } catch (error) {
    console.error("Error getting MFA status:", error);
    return {
      enabled: false,
      methods: [],
      verified: !MFA_FEATURE_ENABLED, // Consider verified when feature is disabled
    };
  }
}
