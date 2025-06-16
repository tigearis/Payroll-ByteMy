"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthContext } from "./auth-context";
import { SESSION_EXPIRED_EVENT, clearAuthCache } from "./apollo-client";
import { useApolloClient } from "@apollo/client";
import { centralizedTokenManager } from "./auth/centralized-token-manager";

/**
 * Global Session Expiry Handler
 *
 * This component monitors for JWT expiration errors across the application
 * and provides a consistent way to handle session expiry:
 *
 * 1. Detects JWT expiration errors
 * 2. Attempts silent token refresh
 * 3. Shows a user-friendly message if refresh fails
 * 4. Redirects to login when needed
 *
 * Usage:
 * Include this component in your root layout
 */
export function SessionExpiryHandler() {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const router = useRouter();
  const { isAuthenticated, refreshUserData, signOut } = useAuthContext();
  const apolloClient = useApolloClient();
  const handlerIdRef = useRef<string | null>(null);
  const processingEventRef = useRef<boolean>(false);
  
  // Feature flag to disable aggressive error handling temporarily
  const ENABLE_GLOBAL_ERROR_HANDLING = false;

  // Handle session expiry with coordination
  const handleSessionExpiry = useCallback(async (eventDetail?: any) => {
    // Prevent multiple handlers from processing the same event
    if (processingEventRef.current) {
      console.log("⏱️ Session expiry already being processed, skipping");
      return;
    }

    // Check if we're already expired
    if (isSessionExpired) {
      console.log("⏱️ Session already expired, skipping refresh");
      return;
    }

    const handlerId = `session-expiry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    handlerIdRef.current = handlerId;
    processingEventRef.current = true;

    try {
      console.log(`🔄 Session expiry detected, coordinating refresh: ${handlerId}`);
      if (eventDetail) {
        console.log('📜 Event details:', eventDetail);
      }

      // Perform session refresh using the new token manager
      console.log("🔄 Performing session refresh...");

      // Step 1: Clear Apollo cache to remove any stale data
      console.log("🧹 Clearing Apollo cache...");
      await apolloClient.clearStore();
      console.log("✅ Apollo cache cleared");

      // Step 2: Clear token cache to force new token fetch
      console.log("🔑 Clearing token cache...");
      clearAuthCache();
      console.log("✅ Token cache cleared");

      // Step 3: Force token refresh - we'll let the auth context handle this
      console.log("🔑 Token refresh will be handled by auth context...");

      // Step 4: Refresh user data
      console.log("👤 Refreshing user data...");
      try {
        await refreshUserData();
        console.log("✅ User data refreshed");
      } catch (refreshError) {
        console.error("❌ Failed to refresh user data:", refreshError);
        throw refreshError;
      }

      // Give a moment for state to update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = true;

      if (success) {
        console.log(`✅ Session refresh completed successfully: ${handlerId}`);
        toast.success("Session refreshed", {
          description: "Your session has been refreshed successfully.",
          duration: 3000,
        });
      } else {
        console.error(`❌ Session refresh failed: ${handlerId}`);
        setIsSessionExpired(true);
        showSessionExpiredMessage();
      }
    } catch (error) {
      console.error(`❌ Session refresh error: ${handlerId}`, error);
      setIsSessionExpired(true);
      showSessionExpiredMessage();
    } finally {
      processingEventRef.current = false;
      if (handlerIdRef.current === handlerId) {
        handlerIdRef.current = null;
      }
    }
  }, [
    isSessionExpired,
    apolloClient,
    refreshUserData,
  ]);

  // Show session expired message with login option
  const showSessionExpiredMessage = useCallback(() => {
    toast.error("Session Expired", {
      description:
        "Your session has expired. Please sign in again to continue.",
      duration: 10000,
      action: {
        label: "Sign In",
        onClick: () => {
          // Sign out to clear any stale state
          signOut().then(() => {
            // Redirect to login page
            router.push("/sign-in");
          });
        },
      },
    });
  }, [signOut, router]);

  // Listen for session expiry events
  useEffect(() => {
    // Handler for Apollo-specific session expiry events
    const handleSessionExpiredEvent = (event: CustomEvent) => {
      console.log("📣 Received session expired event:", event.detail);
      handleSessionExpiry(event.detail);
    };

    // More specific handler for JWT-related errors (less aggressive)
    const handleError = (event: ErrorEvent) => {
      // Only handle if it's specifically a JWT error and not already handled by Apollo
      const errorMessage = event.error?.message || event.message;
      
      // Be more specific about which errors to handle
      if (
        errorMessage &&
        typeof errorMessage === "string" &&
        (errorMessage.includes("JWTExpired") ||
          errorMessage.includes("Could not verify JWT")) &&
        // Only handle if it's not from Apollo (Apollo has its own error handling)
        !errorMessage.includes("Apollo") &&
        !errorMessage.includes("GraphQL")
      ) {
        console.log("🚨 Global JWT error detected:", errorMessage);
        handleSessionExpiry({ source: 'global_error', message: errorMessage });
      }
    };

    // More specific handler for promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || event.reason;
      
      // Be more specific and avoid interfering with Apollo
      if (
        errorMessage &&
        typeof errorMessage === "string" &&
        (errorMessage.includes("JWTExpired") ||
          errorMessage.includes("Could not verify JWT")) &&
        // Only handle if it's not from Apollo
        !errorMessage.includes("Apollo") &&
        !errorMessage.includes("GraphQL")
      ) {
        console.log("🚨 Global JWT promise rejection detected:", errorMessage);
        handleSessionExpiry({ source: 'global_error', message: errorMessage });
      }
    };

    // Add global error listeners only if enabled
    if (ENABLE_GLOBAL_ERROR_HANDLING) {
      window.addEventListener("error", handleError);
      window.addEventListener("unhandledrejection", handleRejection);
    }

    // Add Apollo-specific session expired event listener
    window.addEventListener(
      SESSION_EXPIRED_EVENT,
      handleSessionExpiredEvent as EventListener
    );

    return () => {
      // Cancel any ongoing refresh on unmount
      if (handlerIdRef.current) {
        console.log(`🧹 Cleaning up session handler: ${handlerIdRef.current}`);
        processingEventRef.current = false;
        handlerIdRef.current = null;
      }
      
      // Only remove listeners if they were added
      if (ENABLE_GLOBAL_ERROR_HANDLING) {
        window.removeEventListener("error", handleError);
        window.removeEventListener("unhandledrejection", handleRejection);
      }
      window.removeEventListener(
        SESSION_EXPIRED_EVENT,
        handleSessionExpiredEvent as EventListener
      );
    };
  }, [handleSessionExpiry]);

  // If session is expired and user hasn't clicked sign in, redirect after delay
  useEffect(() => {
    if (isSessionExpired) {
      const redirectTimeout = setTimeout(() => {
        signOut().then(() => {
          router.push("/sign-in");
        });
      }, 15000); // 15 seconds

      return () => clearTimeout(redirectTimeout);
    }
  }, [isSessionExpired, signOut, router]);

  // This component doesn't render anything visible
  return null;
}

export default SessionExpiryHandler;
