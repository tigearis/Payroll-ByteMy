/**
 * WebSocket Link for Apollo Client
 * 
 * Provides intelligent WebSocket connection management for real-time subscriptions
 */

import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

import type { UnifiedClientOptions } from "../types";

/**
 * Enhanced WebSocket link with intelligent connection management
 */
export function createWebSocketLink(
  options: UnifiedClientOptions
): GraphQLWsLink | null {
  if (!options.enableWebSocket || typeof window === "undefined") {
    return null;
  }

  const wsUrl = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL?.replace(
    "http",
    "ws"
  );
  if (!wsUrl) {
    console.warn("WebSocket URL not available");
    return null;
  }

  // Enhanced connection management
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 10;
  let isIntentionalClose = false;

  return new GraphQLWsLink(
    createClient({
      url: wsUrl,
      connectionParams: async () => {
        try {
          if ((window as any).Clerk?.session) {
            const token = await (window as any).Clerk.session.getToken({
              template: "hasura",
            });
            return {
              headers: {
                ...(token && { authorization: `Bearer ${token}` }),
              },
            };
          }
          return {};
        } catch (error) {
          console.error("WebSocket auth error:", error);
          return {};
        }
      },
      
      // Optimized retry strategy
      retryAttempts: maxReconnectAttempts,
      shouldRetry: (error) => {
        if (isIntentionalClose) return false;
        
        reconnectAttempts++;
        const shouldRetry = reconnectAttempts <= maxReconnectAttempts;
        
        if (shouldRetry) {
          console.warn(
            `WebSocket reconnection attempt ${reconnectAttempts}/${maxReconnectAttempts}:`,
            error
          );
        } else {
          console.error("WebSocket max reconnection attempts reached");
        }
        
        return shouldRetry;
      },
      
      // Connection timeouts
      connectionAckWaitTimeout: 15000, // Increased for reliability
      keepAlive: 30000, // Keep connection alive
      
      // Enhanced event handling
      on: {
        connected: () => {
          console.log("🔗 WebSocket connected to Hasura");
          reconnectAttempts = 0; // Reset counter on successful connection
        },
        
        error: (error) => {
          console.error("❌ WebSocket error:", error);
        },
        
        closed: (event) => {
          if (!isIntentionalClose) {
            console.warn("🔌 WebSocket connection closed unexpectedly:", event);
          } else {
            console.log("🔌 WebSocket connection closed intentionally");
          }
        },
        
        connecting: () => {
          console.log("🔄 WebSocket connecting...");
        },
        
        opened: () => {
          console.log("✅ WebSocket opened");
        },
        
        ping: (received, payload) => {
          // Log ping/pong for debugging if needed
          if (process.env.NODE_ENV === "development") {
            console.debug("📡 WebSocket ping received:", { received, payload });
          }
        },
        
        pong: (received, payload) => {
          if (process.env.NODE_ENV === "development") {
            console.debug("📡 WebSocket pong received:", { received, payload });
          }
        },
      },
      
      // Lazy connection - only connect when subscriptions are active
      lazy: true,
    })
  );
}