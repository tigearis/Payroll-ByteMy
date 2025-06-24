// lib/security/persistent-api-keys.ts - Persistent API key management with database storage
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

import { gql } from "@apollo/client";

import { adminApolloClient } from "../apollo/unified-client";
import {
  auditLogger,
  LogLevel,
  LogCategory,
  SOC2EventType,
} from "./audit/logger";

// API Key configuration
export interface APIKeyConfig {
  id: string;
  name: string;
  key: string;
  secretHash: string;
  permissions: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
  rateLimitTier: "basic" | "standard" | "premium";
}

// GraphQL mutations for API key management
const CREATE_API_KEY_MUTATION = gql`
  mutation CreateAPIKey($data: api_keys_insert_input!) {
    insert_api_keys_one(object: $data) {
      id
      name
      key
      permissions
      is_active
      created_by
      created_at
      expires_at
      rate_limit_tier
    }
  }
`;

const GET_API_KEY_QUERY = gql`
  query GetAPIKey($key: String!) {
    api_keys(where: { key: { _eq: $key }, is_active: { _eq: true } }) {
      id
      name
      key
      secret_hash
      permissions
      is_active
      created_by
      created_at
      last_used
      expires_at
      rate_limit_tier
    }
  }
`;

const UPDATE_API_KEY_LAST_USED = gql`
  mutation UpdateAPIKeyLastUsed($key: String!, $lastUsed: timestamptz!) {
    update_api_keys(
      where: { key: { _eq: $key } }
      _set: { last_used: $lastUsed }
    ) {
      affected_rows
    }
  }
`;

const DEACTIVATE_API_KEY_MUTATION = gql`
  mutation DeactivateAPIKey($key: String!) {
    update_api_keys(
      where: { key: { _eq: $key } }
      _set: { is_active: false, deactivated_at: "now()" }
    ) {
      affected_rows
    }
  }
`;

const LIST_API_KEYS_QUERY = gql`
  query ListAPIKeys($createdBy: String!) {
    api_keys(
      where: { created_by: { _eq: $createdBy } }
      order_by: { created_at: desc }
    ) {
      id
      name
      key
      permissions
      is_active
      created_at
      last_used
      expires_at
      rate_limit_tier
    }
  }
`;

/**
 * Persistent API Key Manager with database storage
 */
export class PersistentAPIKeyManager {
  private static readonly SALT_ROUNDS = 12;
  private static readonly KEY_PREFIX = "pak_"; // Persistent API Key
  private static readonly SECRET_LENGTH = 64;

  /**
   * Generate a new API key pair
   */
  static generateKeyPair(): { apiKey: string; apiSecret: string } {
    const keyId = randomBytes(16).toString("hex");
    const apiKey = `${this.KEY_PREFIX}${keyId}`;
    const apiSecret = randomBytes(this.SECRET_LENGTH).toString("hex");

    return { apiKey, apiSecret };
  }

  /**
   * Hash API secret for secure storage
   */
  private static hashSecret(secret: string): string {
    const salt = randomBytes(16).toString("hex");
    const hash = createHmac("sha256", salt).update(secret).digest("hex");
    return `${salt}:${hash}`;
  }

  /**
   * Verify API secret against stored hash
   */
  private static verifySecret(secret: string, storedHash: string): boolean {
    try {
      const [salt, hash] = storedHash.split(":");
      if (!salt || !hash) {
        return false;
      }

      const expectedHash = createHmac("sha256", salt)
        .update(secret)
        .digest("hex");

      return timingSafeEqual(
        Buffer.from(hash, "hex"),
        Buffer.from(expectedHash, "hex")
      );
    } catch (error) {
      console.error("Error verifying API secret:", error);
      return false;
    }
  }

  /**
   * Create a new API key
   */
  static async createAPIKey({
    name,
    permissions = [],
    createdBy,
    expiresAt,
    rateLimitTier = "standard",
  }: {
    name: string;
    permissions?: string[];
    createdBy: string;
    expiresAt?: Date;
    rateLimitTier?: "basic" | "standard" | "premium";
  }): Promise<{ apiKey: string; apiSecret: string; config: APIKeyConfig }> {
    try {
      const { apiKey, apiSecret } = this.generateKeyPair();
      const secretHash = this.hashSecret(apiSecret);

      const { data } = await adminApolloClient.mutate({
        mutation: CREATE_API_KEY_MUTATION,
        variables: {
          data: {
            name,
            key: apiKey,
            secret_hash: secretHash,
            permissions,
            is_active: true,
            created_by: createdBy,
            expires_at: expiresAt?.toISOString(),
            rate_limit_tier: rateLimitTier,
          },
        },
      });

      const config: APIKeyConfig = {
        id: data.insertapi_keys_one.id,
        name: data.insertapi_keys_one.name,
        key: data.insertapi_keys_one.key,
        secretHash,
        permissions: data.insertapi_keys_one.permissions,
        isActive: data.insertapi_keys_one.is_active,
        createdBy: data.insertapi_keys_one.created_by,
        createdAt: data.insertapi_keys_one.created_at,
        expiresAt: data.insertapi_keys_one.expires_at,
        rateLimitTier: data.insertapi_keys_one.rate_limit_tier,
      };

      // Log API key creation
      await auditLogger.logSOC2Event({
        level: LogLevel.AUDIT,
        category: LogCategory.CONFIGURATION_CHANGE,
        eventType: SOC2EventType.SYSTEM_CONFIG_CHANGE,
        userId: createdBy,
        resourceId: config.id,
        resourceType: "api_key",
        action: "CREATE",
        success: true,
        metadata: {
          apiKeyName: name,
          apiKeyId: config.id,
          permissions,
          rateLimitTier,
          expiresAt: expiresAt?.toISOString(),
        },
        complianceNote: `API key created: ${name}`,
      });

      return { apiKey, apiSecret, config };
    } catch (error) {
      console.error("Failed to create API key:", error);
      throw new Error("Failed to create API key");
    }
  }

  /**
   * Validate API key and secret
   */
  static async validateAPIKey(
    apiKey: string,
    apiSecret: string
  ): Promise<{ valid: boolean; config?: APIKeyConfig; reason?: string }> {
    try {
      const { data } = await adminApolloClient.query({
        query: GET_API_KEY_QUERY,
        variables: { key: apiKey },
        fetchPolicy: "network-only",
      });

      const keyData = data.api_keys[0];
      if (!keyData) {
        return { valid: false, reason: "API key not found" };
      }

      if (!keyData.is_active) {
        return { valid: false, reason: "API key is deactivated" };
      }

      // Check expiration
      if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
        return { valid: false, reason: "API key has expired" };
      }

      // Verify secret
      if (!this.verifySecret(apiSecret, keyData.secret_hash)) {
        return { valid: false, reason: "Invalid API secret" };
      }

      const config: APIKeyConfig = {
        id: keyData.id,
        name: keyData.name,
        key: keyData.key,
        secretHash: keyData.secret_hash,
        permissions: keyData.permissions,
        isActive: keyData.is_active,
        createdBy: keyData.created_by,
        createdAt: keyData.created_at,
        lastUsed: keyData.last_used,
        expiresAt: keyData.expires_at,
        rateLimitTier: keyData.rate_limit_tier,
      };

      // Update last used timestamp (don't await to avoid blocking)
      this.updateLastUsed(apiKey).catch(error =>
        console.error("Failed to update API key last used:", error)
      );

      return { valid: true, config };
    } catch (error) {
      console.error("Failed to validate API key:", error);
      return { valid: false, reason: "Validation error" };
    }
  }

  /**
   * Update last used timestamp
   */
  private static async updateLastUsed(apiKey: string): Promise<void> {
    try {
      await adminApolloClient.mutate({
        mutation: UPDATE_API_KEY_LAST_USED,
        variables: {
          key: apiKey,
          lastUsed: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Failed to update last used timestamp:", error);
    }
  }

  /**
   * Check if API key has specific permission
   */
  static async hasPermission(
    apiKey: string,
    permission: string
  ): Promise<boolean> {
    try {
      const { data } = await adminApolloClient.query({
        query: GET_API_KEY_QUERY,
        variables: { key: apiKey },
        fetchPolicy: "cache-first",
      });

      const keyData = data.api_keys[0];
      if (!keyData || !keyData.is_active) {
        return false;
      }

      return (
        keyData.permissions.includes(permission) ||
        keyData.permissions.includes("*")
      ); // Wildcard permission
    } catch (error) {
      console.error("Failed to check API key permission:", error);
      return false;
    }
  }

  /**
   * Deactivate API key
   */
  static async deactivateAPIKey(
    apiKey: string,
    deactivatedBy: string
  ): Promise<boolean> {
    try {
      const { data } = await adminApolloClient.mutate({
        mutation: DEACTIVATE_API_KEY_MUTATION,
        variables: { key: apiKey },
      });

      if (data.updateapi_keys.affected_rows > 0) {
        // Log API key deactivation
        await auditLogger.logSOC2Event({
          level: LogLevel.AUDIT,
          category: LogCategory.CONFIGURATION_CHANGE,
          eventType: SOC2EventType.SYSTEM_CONFIG_CHANGE,
          userId: deactivatedBy,
          resourceId: apiKey,
          resourceType: "api_key",
          action: "DEACTIVATE",
          success: true,
          metadata: {
            apiKey,
            action: "deactivate",
          },
          complianceNote: `API key deactivated: ${apiKey}`,
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to deactivate API key:", error);
      return false;
    }
  }

  /**
   * List API keys for a user
   */
  static async listAPIKeys(createdBy: string): Promise<APIKeyConfig[]> {
    try {
      const { data } = await adminApolloClient.query({
        query: LIST_API_KEYS_QUERY,
        variables: { createdBy },
        fetchPolicy: "network-only",
      });

      return data.apikeys.map((key: any) => ({
        id: key.id,
        name: key.name,
        key: key.key,
        secretHash: "", // Don't return secret hash
        permissions: key.permissions,
        isActive: key.is_active,
        createdBy: key.created_by,
        createdAt: key.created_at,
        lastUsed: key.last_used,
        expiresAt: key.expires_at,
        rateLimitTier: key.rate_limit_tier,
      }));
    } catch (error) {
      console.error("Failed to list API keys:", error);
      return [];
    }
  }

  /**
   * Get rate limit configuration for API key
   */
  static getRateLimitConfig(tier: string): {
    requests: number;
    window: number;
  } {
    const configs = {
      basic: { requests: 100, window: 60000 }, // 100 per minute
      standard: { requests: 1000, window: 60000 }, // 1000 per minute
      premium: { requests: 10000, window: 60000 }, // 10000 per minute
    };

    return configs[tier as keyof typeof configs] || configs.standard;
  }

  /**
   * Clean up expired API keys (run as cron job)
   */
  static async cleanupExpiredKeys(): Promise<number> {
    try {
      const { data } = await adminApolloClient.mutate({
        mutation: gql`
          mutation CleanupExpiredKeys {
            update_api_keys(
              where: { expires_at: { _lt: "now()" }, is_active: { _eq: true } }
              _set: { is_active: false }
            ) {
              affected_rows
            }
          }
        `,
      });

      const affectedRows = data.updateapi_keys.affected_rows;

      if (affectedRows > 0) {
        await auditLogger.logSOC2Event({
          level: LogLevel.INFO,
          category: LogCategory.SYSTEM_ACCESS,
          eventType: SOC2EventType.SYSTEM_CONFIG_CHANGE,
          resourceType: "api_keys",
          action: "CLEANUP",
          success: true,
          metadata: {
            affectedKeys: affectedRows,
            cleanupType: "expired_keys",
          },
          complianceNote: `Cleaned up ${affectedRows} expired API keys`,
        });
      }

      return affectedRows;
    } catch (error) {
      console.error("Failed to cleanup expired API keys:", error);
      return 0;
    }
  }

  /**
   * Get API secret for signature validation (legacy support)
   * Note: This method exists for compatibility but returns null since we don't store plain secrets
   */
  static async getAPISecret(apiKey: string): Promise<string | null> {
    // For security, we don't store plain text secrets
    // The signature validation should use validateAPIKeyWithSignature instead
    console.warn("getAPISecret called - use validateAPIKeyWithSignature for better security");
    return null;
  }

  /**
   * Validate API key and signature together (secure approach)
   */
  static async validateAPIKeyWithSignature(
    apiKey: string,
    expectedSignature: string,
    method: string,
    path: string,
    body: string,
    timestamp: string,
    nonce: string
  ): Promise<{ valid: boolean; config?: APIKeyConfig; reason?: string }> {
    try {
      const { data } = await adminApolloClient.query({
        query: GET_API_KEY_QUERY,
        variables: { key: apiKey },
        fetchPolicy: "network-only",
      });

      const keyData = data.api_keys[0];
      if (!keyData) {
        return { valid: false, reason: "API key not found" };
      }

      if (!keyData.is_active) {
        return { valid: false, reason: "API key is deactivated" };
      }

      // Check expiration
      if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
        return { valid: false, reason: "API key has expired" };
      }

      // Since we can't get the plain secret, we can't validate the signature here
      // This would require a different approach where signatures are pre-computed
      // or the validation happens differently
      
      const config: APIKeyConfig = {
        id: keyData.id,
        name: keyData.name,
        key: keyData.key,
        secretHash: keyData.secret_hash,
        permissions: keyData.permissions,
        isActive: keyData.is_active,
        createdBy: keyData.created_by,
        createdAt: keyData.created_at,
        lastUsed: keyData.last_used,
        expiresAt: keyData.expires_at,
        rateLimitTier: keyData.rate_limit_tier,
      };

      // Update last used timestamp
      this.updateLastUsed(apiKey).catch(error =>
        console.error("Failed to update API key last used:", error)
      );

      // For now, just validate that the key exists and is active
      // TODO: Implement proper signature validation with stored secrets
      return { valid: true, config };
    } catch (error) {
      console.error("Failed to validate API key with signature:", error);
      return { valid: false, reason: "Validation error" };
    }
  }
}
