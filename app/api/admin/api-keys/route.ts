import { handleApiError, createSuccessResponse } from "@/lib/shared/error-handling";
// app/api/admin/api-keys/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withEnhancedAuth } from "@/lib/auth/enhanced-api-auth";
import { apiKeyManager } from "@/lib/security/api-signing";
import { logger, LogLevel, LogCategory, SOC2EventType } from "@/lib/logging";

// List API keys (admin only)
export const GET = withEnhancedAuth(
  async (request: NextRequest, context) => {
    try {
      const userRole =
        typeof context.userRole === "string" ? context.userRole : "unknown";
      await logger.logSOC2Event(SOC2EventType.DATA_ACCESSED, {
        level: LogLevel.INFO,
        category: LogCategory.SYSTEM_ACCESS,
        message: "API keys list accessed",
        userId: context.userId,
        userRole: userRole,
        entityType: "api_keys",
      });

      const keys = apiKeyManager.listKeys();

      return NextResponse.json({
        success: true,
        keys: keys.map((key) => ({
          ...key,
          // Mask the API key for security
          apiKey: key.apiKey.substring(0, 8) + "..." + key.apiKey.slice(-4),
          fullKey: key.apiKey, // Include full key for copying
        })),
      });
    } catch (error) {
      return handleApiError(error, "admin");
    }
  },
  {
    minimumRole: "developer",
  }
);

// Create new API key (admin only)
export const POST = withEnhancedAuth(
  async (request: NextRequest, context) => {
    try {
      const body = await request.json();
      const { permissions = [] } = body;
      const userRole =
        typeof context.userRole === "string" ? context.userRole : "unknown";

      // Generate new key pair
      const { apiKey, apiSecret } = apiKeyManager.generateKeyPair();

      // Store the key with permissions
      apiKeyManager.storeKey(apiKey, apiSecret, permissions);

      await logger.logSOC2Event(SOC2EventType.CONFIG_CHANGED, {
        level: LogLevel.AUDIT,
        category: LogCategory.SYSTEM_ACCESS,
        message: "New API key created",
        userId: context.userId,
        userRole: userRole,
        entityType: "api_key",
        entityId: apiKey,
        metadata: {
          permissions,
          createdBy: context.userId,
        },
      });

      return NextResponse.json({
        success: true,
        apiKey,
        apiSecret,
        permissions,
        warning: "Store the API secret securely. It will not be shown again.",
      });
    } catch (error) {
      return handleApiError(error, "admin");
    }
  },
  {
    minimumRole: "developer",
  }
);

// Revoke API key (admin only)
export const DELETE = withEnhancedAuth(
  async (request: NextRequest, context) => {
    try {
      const { searchParams } = new URL(request.url);
      const apiKey = searchParams.get("apiKey");
      const userRole =
        typeof context.userRole === "string" ? context.userRole : "unknown";

      if (!apiKey) {
        return NextResponse.json(
          { error: "API key is required" },
          { status: 400 }
        );
      }

      // Revoke the key
      apiKeyManager.revokeKey(apiKey);

      await logger.logSOC2Event(SOC2EventType.CONFIG_CHANGED, {
        level: LogLevel.AUDIT,
        category: LogCategory.SYSTEM_ACCESS,
        message: "API key revoked",
        userId: context.userId,
        userRole: userRole,
        entityType: "api_key",
        entityId: apiKey,
        metadata: {
          revokedBy: context.userId,
        },
      });

      return NextResponse.json({
        success: true,
        message: "API key revoked successfully",
      });
    } catch (error) {
      return handleApiError(error, "admin");
    }
  },
  {
    minimumRole: "developer",
  }
);
