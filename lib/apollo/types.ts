/**
 * Apollo Client Types and Interfaces
 * 
 * Centralized type definitions for Apollo Client configuration and operations
 * Consolidates all Apollo-related types to eliminate duplication
 */

import { WatchQueryFetchPolicy } from "@apollo/client";

// ================================
// CLIENT CONFIGURATION
// ================================

/**
 * Unified Apollo client configuration options
 * Supports client-side, server-side, and admin contexts
 */
export interface UnifiedClientOptions {
  /** Client context determines authentication and capabilities */
  context: "client" | "server" | "admin";
  /** Enable WebSocket subscriptions (client context only) */
  enableWebSocket?: boolean;
  /** Enable automatic retry logic */
  enableRetry?: boolean;
  /** Enable audit logging for operations */
  enableAuditLogging?: boolean;
  /** Enable enhanced security features */
  enableSecurity?: boolean;
  /** Security level for enterprise compliance */
  securityLevel?: "standard" | "enterprise";
  /** Default fetch policy for queries */
  fetchPolicy?: WatchQueryFetchPolicy;
}

// ================================
// CACHE CONFIGURATION
// ================================

/**
 * Cache configuration options for Apollo InMemoryCache
 */
export interface CacheOptions {
  /** Enable result caching for performance */
  resultCaching?: boolean;
  /** Enable Apollo DevTools integration */
  enableDevTools?: boolean;
  /** Maximum cache size in MB */
  maxCacheSize?: number;
}

/**
 * Cache invalidation options for strategic cache management
 */
export interface CacheInvalidationOptions {
  /** Whether to broadcast cache updates to all components */
  broadcast?: boolean;
  /** Whether to refetch active queries after invalidation */
  refetchQueries?: boolean;
  /** Specific cache keys to invalidate (for granular control) */
  fields?: string[];
}

// ================================
// SECURITY AND COMPLIANCE
// ================================

/**
 * Security classifications for enterprise mode
 * Used for SOC2 compliance and data classification
 */
export enum SecurityLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM", 
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

/**
 * Authentication context types for different client uses
 */
export type AuthContext = "client" | "server" | "admin";

/**
 * Client context capabilities matrix
 */
export interface ClientCapabilities {
  /** Can make real-time subscriptions */
  subscriptions: boolean;
  /** Has user authentication context */
  userAuth: boolean;
  /** Has admin privileges */
  adminAccess: boolean;
  /** Can perform retry operations */
  retry: boolean;
}