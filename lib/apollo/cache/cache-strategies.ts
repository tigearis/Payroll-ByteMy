/**
 * Unified Cache Strategy Configuration
 * 
 * Centralized cache strategies that eliminate conflicts between different
 * fetch policies across the application. This ensures consistent caching
 * behavior for all entity types.
 */

import { WatchQueryFetchPolicy } from "@apollo/client";

/**
 * Cache strategy configuration for different entity types
 */
export interface CacheStrategyConfig {
  /** Primary fetch policy for initial loads */
  fetchPolicy: WatchQueryFetchPolicy;
  /** Next fetch policy for subsequent requests */
  nextFetchPolicy?: WatchQueryFetchPolicy;
  /** Error policy for handling GraphQL errors */
  errorPolicy: "none" | "ignore" | "all";
  /** Whether this entity type supports real-time updates */
  realTimeUpdates: boolean;
  /** Cache invalidation strategy */
  invalidationStrategy: "immediate" | "debounced" | "manual";
  /** Poll interval in milliseconds (only used as fallback when WebSocket fails) */
  pollInterval?: number;
  /** Whether to notify on network status change */
  notifyOnNetworkStatusChange?: boolean;
}

/**
 * Unified cache strategies for different entity types
 * This ensures consistent caching behavior across the application
 */
export const cacheStrategies: Record<string, CacheStrategyConfig> = {
  // High-frequency business data with real-time requirements
  payrolls: {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
    realTimeUpdates: true,
    invalidationStrategy: "debounced",
    pollInterval: 45000, // 45 seconds fallback
    notifyOnNetworkStatusChange: true,
  },

  // User data - less frequent updates, cache-preferred
  users: {
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
    realTimeUpdates: false,
    invalidationStrategy: "immediate",
    notifyOnNetworkStatusChange: false,
  },

  // Client data - moderate update frequency
  clients: {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
    realTimeUpdates: false,
    invalidationStrategy: "debounced",
    notifyOnNetworkStatusChange: true,
  },

  // Security events - always fresh, real-time critical
  securityEvents: {
    fetchPolicy: "network-only",
    errorPolicy: "all",
    realTimeUpdates: true,
    invalidationStrategy: "manual", // Handled by subscriptions
    notifyOnNetworkStatusChange: true,
  },

  // Audit logs - semi-fresh with real-time updates
  auditLogs: {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
    realTimeUpdates: true,
    invalidationStrategy: "immediate",
    pollInterval: 300000, // 5 minutes fallback
    notifyOnNetworkStatusChange: true,
  },

  // Invitations - immediate consistency required
  invitations: {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
    realTimeUpdates: false,
    invalidationStrategy: "immediate",
    notifyOnNetworkStatusChange: true,
  },

  // Staff management - cache-preferred with invalidation
  staff: {
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
    realTimeUpdates: false,
    invalidationStrategy: "immediate",
    notifyOnNetworkStatusChange: false,
  },

  // Notes - cache-friendly with debounced updates
  notes: {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
    realTimeUpdates: false,
    invalidationStrategy: "debounced",
    notifyOnNetworkStatusChange: false,
  },

  // Leave data - cache-preferred
  leave: {
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
    realTimeUpdates: false,
    invalidationStrategy: "debounced",
    notifyOnNetworkStatusChange: false,
  },

  // Work schedules - cache-preferred with occasional updates
  workSchedule: {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
    realTimeUpdates: false,
    invalidationStrategy: "debounced",
    notifyOnNetworkStatusChange: false,
  },

  // External systems - cache-preferred, less frequent updates
  externalSystems: {
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
    realTimeUpdates: false,
    invalidationStrategy: "manual",
    notifyOnNetworkStatusChange: false,
  },

  // Billing data - accuracy critical, moderate cache
  billing: {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
    realTimeUpdates: false,
    invalidationStrategy: "immediate",
    notifyOnNetworkStatusChange: true,
  },

  // Permissions - cache-first with immediate invalidation
  permissions: {
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
    realTimeUpdates: false,
    invalidationStrategy: "immediate",
    notifyOnNetworkStatusChange: false,
  },

  // Special case: Always fresh data (version checks, system status)
  versionCheck: {
    fetchPolicy: "network-only",
    errorPolicy: "all",
    realTimeUpdates: false,
    invalidationStrategy: "manual",
    notifyOnNetworkStatusChange: false,
  },

  // Special case: Dashboard aggregates with smart caching
  dashboard: {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
    realTimeUpdates: true,
    invalidationStrategy: "debounced",
    pollInterval: 60000, // 1 minute fallback
    notifyOnNetworkStatusChange: true,
  },
};

/**
 * Get cache strategy for an entity type
 * Provides fallback to default strategy if entity type not found
 */
export function getCacheStrategy(entityType: string): CacheStrategyConfig {
  return cacheStrategies[entityType] || {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
    realTimeUpdates: false,
    invalidationStrategy: "debounced",
    notifyOnNetworkStatusChange: false,
  };
}

/**
 * Check if an entity type supports real-time updates
 */
export function supportsRealTime(entityType: string): boolean {
  return getCacheStrategy(entityType).realTimeUpdates;
}

/**
 * Get poll interval for an entity type (used as WebSocket fallback)
 */
export function getPollInterval(entityType: string): number | undefined {
  return getCacheStrategy(entityType).pollInterval;
}

/**
 * Entity types that require immediate cache invalidation
 */
export const IMMEDIATE_INVALIDATION_ENTITIES = Object.entries(cacheStrategies)
  .filter(([, config]) => config.invalidationStrategy === "immediate")
  .map(([entityType]) => entityType);

/**
 * Entity types that support real-time updates
 */
export const REAL_TIME_ENTITIES = Object.entries(cacheStrategies)
  .filter(([, config]) => config.realTimeUpdates)
  .map(([entityType]) => entityType);

/**
 * Entity types that use debounced invalidation
 */
export const DEBOUNCED_INVALIDATION_ENTITIES = Object.entries(cacheStrategies)
  .filter(([, config]) => config.invalidationStrategy === "debounced")
  .map(([entityType]) => entityType);