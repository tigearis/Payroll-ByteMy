/**
 * Apollo Client Types and Interfaces
 * 
 * Shared types for Apollo Client configuration and operations
 */

import { WatchQueryFetchPolicy } from "@apollo/client";

// Client configuration options
export interface UnifiedClientOptions {
  context: "client" | "server" | "admin";
  enableWebSocket?: boolean;
  enableRetry?: boolean;
  enableAuditLogging?: boolean;
  enableSecurity?: boolean;
  securityLevel?: "standard" | "enterprise";
  fetchPolicy?: WatchQueryFetchPolicy;
}

// Security classifications for enterprise mode
export enum SecurityLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}