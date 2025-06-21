// app/api/admin/api-keys/route.ts
import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/lib/auth/api-auth";
import { auditLogger, LogLevel, LogCategory, SOC2EventType } from "@/lib/security/audit/logger";
import { apiKeyManager } from "@/lib/security/api-signing";

// List API keys (admin only)
export const GET = withAuth(async (request: NextRequest, session) => {
  try {
    const clientInfo = auditLogger.extractClientInfo(request);
    await auditLogger.logSOC2Event({
      level: LogLevel.INFO,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
      userId: session.userId,
      userRole: session.role,
      resourceType: "api_keys",
      action: "LIST",
      success: true,
      ipAddress: clientInfo.ipAddress || "unknown",
      userAgent: clientInfo.userAgent || "unknown",
      complianceNote: "API keys list accessed"
    });

    const keys = apiKeyManager.listKeys();
    
    return NextResponse.json({
      success: true,
      keys: keys.map(key => ({
        ...key,
        // Mask the API key for security
        apiKey: `${key.apiKey.substring(0, 8)  }...${  key.apiKey.slice(-4)}`,
        fullKey: key.apiKey // Include full key for copying
      }))
    });

  } catch (error) {
    console.error("Error listing API keys:", error);
    return NextResponse.json(
      { error: "Failed to list API keys" },
      { status: 500 }
    );
  }
}, {
  allowedRoles: ["developer"]
});

// Create new API key (admin only)
export const POST = withAuth(async (request: NextRequest, session) => {
  try {
    const body = await request.json();
    const { permissions = [] } = body;

    // Generate new key pair
    const { apiKey, apiSecret } = apiKeyManager.generateKeyPair();
    
    // Store the key with permissions
    apiKeyManager.storeKey(apiKey, apiSecret, permissions);

    const clientInfo = auditLogger.extractClientInfo(request);
    await auditLogger.logSOC2Event({
      level: LogLevel.AUDIT,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.SYSTEM_CONFIG_CHANGE,
      userId: session.userId,
      userRole: session.role,
      resourceId: apiKey,
      resourceType: "api_key",
      action: "CREATE",
      success: true,
      metadata: {
        permissions,
        createdBy: session.userId
      },
      ipAddress: clientInfo.ipAddress || "unknown",
      userAgent: clientInfo.userAgent || "unknown",
      complianceNote: "New API key created"
    });

    return NextResponse.json({
      success: true,
      apiKey,
      apiSecret,
      permissions,
      warning: "Store the API secret securely. It will not be shown again."
    });

  } catch (error) {
    console.error("Error creating API key:", error);
    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500 }
    );
  }
}, {
  allowedRoles: ["developer"]
});

// Revoke API key (admin only)
export const DELETE = withAuth(async (request: NextRequest, session) => {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get("apiKey");

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    // Revoke the key
    apiKeyManager.revokeKey(apiKey);

    const clientInfo = auditLogger.extractClientInfo(request);
    await auditLogger.logSOC2Event({
      level: LogLevel.AUDIT,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.SYSTEM_CONFIG_CHANGE,
      userId: session.userId,
      userRole: session.role,
      resourceId: apiKey,
      resourceType: "api_key",
      action: "DELETE",
      success: true,
      metadata: {
        revokedBy: session.userId
      },
      ipAddress: clientInfo.ipAddress || "unknown",
      userAgent: clientInfo.userAgent || "unknown",
      complianceNote: "API key revoked"
    });

    return NextResponse.json({
      success: true,
      message: "API key revoked successfully"
    });

  } catch (error) {
    console.error("Error revoking API key:", error);
    return NextResponse.json(
      { error: "Failed to revoke API key" },
      { status: 500 }
    );
  }
}, {
  allowedRoles: ["developer"]
});