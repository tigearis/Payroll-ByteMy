/**
 * Permission Calculation Service
 *
 * Provides centralized permission calculation with role inheritance,
 * user overrides, and expiry handling. This service replaces fragmented
 * permission checking across the application with a unified approach.
 */

import { gql } from "@apollo/client";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import {
  getHierarchicalPermissionsFromDatabase,
  getEffectivePermissions,
  type UserRole,
} from "./hierarchical-permissions";

// Permission override interface matching database schema
export interface PermissionOverride {
  id: string;
  user_id: string;
  resource: string;
  operation: string;
  granted: boolean;
  expires_at?: string;
  created_at: string;
  created_by_user_id: string;
  conditions?: Record<string, any>;
  role?: string;
}

// Calculated permission result
export interface EffectivePermission {
  resource: string;
  action: string;
  granted: boolean;
  source: "role" | "user_override" | "role_override";
  granted_by: string;
  conditions?: Record<string, any>;
  expires_at?: string;
}

// Cache interface for performance
interface PermissionCache {
  userId: string;
  role: string;
  permissions: string[];
  effectivePermissions: EffectivePermission[];
  calculatedAt: number;
  expiresAt: number;
}

// In-memory cache with TTL
const permissionCache = new Map<string, PermissionCache>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_CLEANUP_INTERVAL = 60 * 1000; // Clean every minute

// Periodic cache cleanup
setInterval(() => {
  const now = Date.now();
  for (const [key, cache] of permissionCache.entries()) {
    if (cache.expiresAt < now) {
      permissionCache.delete(key);
    }
  }
}, CACHE_CLEANUP_INTERVAL);

/**
 * Permission Calculation Service Class
 */
export class PermissionCalculationService {
  private static instance: PermissionCalculationService;

  private constructor() {}

  static getInstance(): PermissionCalculationService {
    if (!PermissionCalculationService.instance) {
      PermissionCalculationService.instance =
        new PermissionCalculationService();
    }
    return PermissionCalculationService.instance;
  }

  /**
   * Calculate effective permissions for a user
   */
  async calculateUserPermissions(
    userId: string,
    userRole: UserRole,
    forceRefresh = false
  ): Promise<{
    permissions: string[];
    effectivePermissions: EffectivePermission[];
    calculatedAt: number;
    fromCache: boolean;
  }> {
    const cacheKey = `${userId}:${userRole}`;

    // Check cache first (unless forced refresh)
    if (!forceRefresh) {
      const cached = permissionCache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        return {
          permissions: cached.permissions,
          effectivePermissions: cached.effectivePermissions,
          calculatedAt: cached.calculatedAt,
          fromCache: true,
        };
      }
    }

    try {
      // Fetch permission overrides from database
      const overrides = await this.fetchPermissionOverrides(userId);

      // Calculate effective permissions with inheritance
      const effectivePermissions = await this.calculateEffectivePermissions(
        userRole,
        overrides
      );

      // Convert to flat permission array format
      const permissions = effectivePermissions
        .filter(p => p.granted)
        .map(p => `${p.resource}:${p.action}`);

      const result = {
        permissions,
        effectivePermissions,
        calculatedAt: Date.now(),
        fromCache: false,
      };

      // Cache the result
      permissionCache.set(cacheKey, {
        userId,
        role: userRole,
        permissions,
        effectivePermissions,
        calculatedAt: result.calculatedAt,
        expiresAt: Date.now() + CACHE_TTL,
      });

      return result;
    } catch (error) {
      console.error("Error calculating user permissions:", error);

      // Fallback to role-based permissions only
      const rolePermissions = getEffectivePermissions(userRole);
      const flatPermissions = rolePermissions.map((p: string) =>
        p.replace(".", ":")
      );

      const fallbackEffective = rolePermissions.map((permission: string) => {
        const [resource, action] = permission.split(".");
        return {
          resource,
          action,
          granted: true,
          source: "role" as const,
          granted_by: userRole,
        };
      });

      return {
        permissions: flatPermissions,
        effectivePermissions: fallbackEffective,
        calculatedAt: Date.now(),
        fromCache: false,
      };
    }
  }

  /**
   * Fetch permission overrides from database
   */
  private async fetchPermissionOverrides(
    userId: string
  ): Promise<PermissionOverride[]> {
    const GET_PERMISSION_OVERRIDES = gql`
      query GetUserPermissionOverrides($userId: uuid!) {
        permission_overrides(
          where: {
            user_id: { _eq: $userId }
            _and: [
              {
                _or: [
                  { expires_at: { _is_null: true } }
                  { expires_at: { _gt: "now()" } }
                ]
              }
            ]
          }
          order_by: { created_at: desc }
        ) {
          id
          user_id
          resource
          operation
          granted
          expires_at
          created_at
          created_by_user_id
          conditions
          role
        }
      }
    `;

    try {
      const result = await adminApolloClient.query({
        query: GET_PERMISSION_OVERRIDES,
        variables: { userId },
        fetchPolicy: "network-only",
      });

      return result.data?.permission_overrides || [];
    } catch (error) {
      console.error("Failed to fetch permission overrides:", error);
      return [];
    }
  }

  /**
   * Calculate effective permissions with inheritance and overrides
   */
  private async calculateEffectivePermissions(
    userRole: UserRole,
    overrides: PermissionOverride[]
  ): Promise<EffectivePermission[]> {
    const now = new Date();
    const effectivePermissions = new Map<string, EffectivePermission>();

    // Start with base role permissions
    const rolePermissions = getEffectivePermissions(userRole);

    rolePermissions.forEach((permission: string) => {
      const [resource, action] = permission.split(".");
      const key = `${resource}:${action}`;

      effectivePermissions.set(key, {
        resource,
        action,
        granted: true,
        source: "role",
        granted_by: userRole,
      });
    });

    // Apply user-specific overrides (most recent takes precedence)
    const validOverrides = overrides.filter(override => {
      // Filter out expired overrides
      if (override.expires_at && new Date(override.expires_at) < now) {
        return false;
      }
      return true;
    });

    // Group overrides by permission key to handle duplicates
    const overrideMap = new Map<string, PermissionOverride>();

    validOverrides.forEach(override => {
      const key = `${override.resource}:${override.operation}`;

      // Keep the most recent override for each permission
      const existing = overrideMap.get(key);
      if (
        !existing ||
        new Date(override.created_at) > new Date(existing.created_at)
      ) {
        overrideMap.set(key, override);
      }
    });

    // Apply the final overrides
    overrideMap.forEach((override, key) => {
      const [resource, action] = key.split(":");

      effectivePermissions.set(key, {
        resource,
        action,
        granted: override.granted,
        source: override.role ? "role_override" : "user_override",
        granted_by: override.role || override.created_by_user_id,
        ...(override.conditions && { conditions: override.conditions }),
        ...(override.expires_at && { expires_at: override.expires_at }),
      });
    });

    return Array.from(effectivePermissions.values());
  }

  /**
   * Check if user has a specific permission
   */
  async hasPermission(
    userId: string,
    userRole: UserRole,
    resource: string,
    action: string
  ): Promise<boolean> {
    // Emergency bypass for development
    if (process.env.DISABLE_PERMISSIONS === "true") {
      console.warn("⚠️ PERMISSIONS DISABLED - DEVELOPMENT MODE ONLY");
      return true;
    }

    const { permissions } = await this.calculateUserPermissions(
      userId,
      userRole
    );
    const permissionKey = `${resource}:${action}`;

    return permissions.includes(permissionKey);
  }

  /**
   * Check if user has any of the required permissions
   */
  async hasAnyPermission(
    userId: string,
    userRole: UserRole,
    requiredPermissions: string[]
  ): Promise<boolean> {
    if (process.env.DISABLE_PERMISSIONS === "true") {
      return true;
    }

    const { permissions } = await this.calculateUserPermissions(
      userId,
      userRole
    );

    return requiredPermissions.some(required => {
      // Handle both formats: resource.action and resource:action
      const normalizedRequired = required.includes(":")
        ? required
        : required.replace(".", ":");
      return permissions.includes(normalizedRequired);
    });
  }

  /**
   * Check if user has all required permissions
   */
  async hasAllPermissions(
    userId: string,
    userRole: UserRole,
    requiredPermissions: string[]
  ): Promise<boolean> {
    if (process.env.DISABLE_PERMISSIONS === "true") {
      return true;
    }

    const { permissions } = await this.calculateUserPermissions(
      userId,
      userRole
    );

    return requiredPermissions.every(required => {
      // Handle both formats: resource.action and resource:action
      const normalizedRequired = required.includes(":")
        ? required
        : required.replace(".", ":");
      return permissions.includes(normalizedRequired);
    });
  }

  /**
   * Get all permissions for a specific resource
   */
  async getResourcePermissions(
    userId: string,
    userRole: UserRole,
    resource: string
  ): Promise<string[]> {
    const { permissions } = await this.calculateUserPermissions(
      userId,
      userRole
    );
    const prefix = `${resource}:`;

    return permissions
      .filter(p => p.startsWith(prefix))
      .map(p => p.substring(prefix.length));
  }

  /**
   * Check if user can access a resource (has any permission on it)
   */
  async canAccessResource(
    userId: string,
    userRole: UserRole,
    resource: string
  ): Promise<boolean> {
    const { permissions } = await this.calculateUserPermissions(
      userId,
      userRole
    );
    const prefix = `${resource}:`;

    return permissions.some(p => p.startsWith(prefix));
  }

  /**
   * Add permission override for a user
   */
  async addPermissionOverride(
    userId: string,
    resource: string,
    operation: string,
    granted: boolean,
    createdByUserId: string,
    expiresAt?: string,
    conditions?: Record<string, any>
  ): Promise<PermissionOverride> {
    const ADD_PERMISSION_OVERRIDE = gql`
      mutation AddPermissionOverride(
        $object: permission_overrides_insert_input!
      ) {
        insert_permission_overrides_one(object: $object) {
          id
          user_id
          resource
          operation
          granted
          expires_at
          created_at
          created_by_user_id
          conditions
        }
      }
    `;

    const result = await adminApolloClient.mutate({
      mutation: ADD_PERMISSION_OVERRIDE,
      variables: {
        object: {
          user_id: userId,
          resource,
          operation,
          granted,
          created_by_user_id: createdByUserId,
          expires_at: expiresAt,
          conditions,
        },
      },
    });

    // Clear cache for this user
    this.clearUserCache(userId);

    return result.data.insert_permission_overrides_one;
  }

  /**
   * Remove permission override
   */
  async removePermissionOverride(overrideId: string): Promise<boolean> {
    const REMOVE_PERMISSION_OVERRIDE = gql`
      mutation RemovePermissionOverride($id: uuid!) {
        delete_permission_overrides_by_pk(id: $id) {
          id
          user_id
        }
      }
    `;

    const result = await adminApolloClient.mutate({
      mutation: REMOVE_PERMISSION_OVERRIDE,
      variables: { id: overrideId },
    });

    if (result.data?.delete_permission_overrides_by_pk) {
      // Clear cache for the affected user
      const userId = result.data.deletepermissionoverridesby_pk.user_id;
      this.clearUserCache(userId);
      return true;
    }

    return false;
  }

  /**
   * Clear cache for a specific user
   */
  clearUserCache(userId: string): void {
    for (const key of permissionCache.keys()) {
      if (key.startsWith(`${userId}:`)) {
        permissionCache.delete(key);
      }
    }
  }

  /**
   * Clear all permission cache
   */
  clearAllCache(): void {
    permissionCache.clear();
  }

  /**
   * Get cache statistics for monitoring
   */
  getCacheStats(): {
    size: number;
    hitRate: number;
    totalCalculations: number;
    cacheHits: number;
  } {
    // This is a simplified version - in production you'd want more detailed metrics
    return {
      size: permissionCache.size,
      hitRate: 0, // Would need to track this over time
      totalCalculations: 0, // Would need to track this
      cacheHits: 0, // Would need to track this
    };
  }
}

// Export singleton instance
export const permissionCalculationService =
  PermissionCalculationService.getInstance();

// Helper functions for backward compatibility
export async function calculateUserPermissions(
  userId: string,
  userRole: UserRole,
  forceRefresh = false
) {
  return permissionCalculationService.calculateUserPermissions(
    userId,
    userRole,
    forceRefresh
  );
}

export async function hasPermission(
  userId: string,
  userRole: UserRole,
  resource: string,
  action: string
) {
  return permissionCalculationService.hasPermission(
    userId,
    userRole,
    resource,
    action
  );
}

export async function hasAnyPermission(
  userId: string,
  userRole: UserRole,
  requiredPermissions: string[]
) {
  return permissionCalculationService.hasAnyPermission(
    userId,
    userRole,
    requiredPermissions
  );
}

export async function hasAllPermissions(
  userId: string,
  userRole: UserRole,
  requiredPermissions: string[]
) {
  return permissionCalculationService.hasAllPermissions(
    userId,
    userRole,
    requiredPermissions
  );
}
