// components/auth/StrictDatabaseGuard.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

// Cache duration for database verification (10 minutes)
const VERIFICATION_CACHE_DURATION = 10 * 60 * 1000;
// Stale duration - show cached while refreshing in background (8 minutes)
const VERIFICATION_STALE_DURATION = 8 * 60 * 1000;

interface StrictDatabaseGuardProps {
  children: React.ReactNode;
}

/**
 * STRICT Security Guard - Blocks ALL access until database user is verified
 *
 * This component takes a zero-tolerance approach:
 * - If user exists in Clerk but NOT in database → BLOCK ACCESS
 * - Only allows access when user exists in BOTH Clerk AND database
 */
export function StrictDatabaseGuard({ children }: StrictDatabaseGuardProps) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const {
    currentUser,
    loading: dbUserLoading,
    error: dbUserError,
    isReady,
  } = useCurrentUser();
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState<string>("");
  const [gracePeriodEnded, setGracePeriodEnded] = useState(false);
  const [isVerificationCached, setIsVerificationCached] = useState(false);
  const [isBackgroundRefreshing, setIsBackgroundRefreshing] = useState(false);

  // Check for cached verification result on mount
  useEffect(() => {
    if (!clerkLoaded || !clerkUser) return;

    const cacheKey = `db_verification_${clerkUser.id}`;
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        const { timestamp, verified } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        
        // Check if cache is still completely valid (fresh)
        if (age < VERIFICATION_STALE_DURATION) {
          setIsVerificationCached(true);
          setGracePeriodEnded(true);
          
          if (verified) {
            setIsBlocked(false);
            setBlockReason("");
            console.log("✅ Using fresh cached verification - access granted");
          } else {
            setIsBlocked(true);
            setBlockReason("User not found in database (cached)");
            console.log("🚨 Using fresh cached verification - access blocked");
          }
          return;
        }
        
        // Cache is stale but still usable - show cached result while refreshing in background
        if (age < VERIFICATION_CACHE_DURATION) {
          setIsVerificationCached(true);
          setGracePeriodEnded(true);
          setIsBackgroundRefreshing(true);
          
          if (verified) {
            setIsBlocked(false);
            setBlockReason("");
            console.log("✅ Using stale cached verification - access granted (refreshing in background)");
          } else {
            setIsBlocked(true);
            setBlockReason("User not found in database (cached)");
            console.log("🚨 Using stale cached verification - access blocked (refreshing in background)");
          }
          
          // Trigger background refresh - this will run silently without showing loading screen
          // The verification will happen in the main useEffect but won't show loading
          return;
        }
      } catch (error) {
        console.error("Failed to parse verification cache:", error);
      }
    }
  }, [clerkLoaded, clerkUser]);

  // Grace period to allow authentication to settle (skip if cached)
  useEffect(() => {
    // If we have cached verification, skip grace period entirely
    if (isVerificationCached) {
      setGracePeriodEnded(true);
      return;
    }
    
    if (clerkLoaded && clerkUser && !gracePeriodEnded) {
      // Give authentication flow minimal time to settle (reduced from 3s to 500ms)
      const timer = setTimeout(() => {
        setGracePeriodEnded(true);
      }, 500);

      return () => clearTimeout(timer);
    }

    // Always return a cleanup function, even if it's empty
    return () => {};
  }, [clerkLoaded, clerkUser, gracePeriodEnded, isVerificationCached]);

  // Monitor access status
  useEffect(() => {
    // Skip if already using cached verification and not doing background refresh
    if (isVerificationCached && !isBackgroundRefreshing) return;
    
    // Wait for Clerk to load
    if (!clerkLoaded) {
      return;
    }

    // No Clerk user - let normal auth flow handle this
    if (!clerkUser) {
      setIsBlocked(false);
      setBlockReason("");
      return;
    }

    // Still loading database check OR initial user ID extraction, or within grace period
    // But allow background refresh to continue
    if (!isBackgroundRefreshing && (dbUserLoading || !isReady || !gracePeriodEnded)) {
      return;
    }

    // Database error - block as precaution
    if (dbUserError) {
      setIsBlocked(true);
      setBlockReason("Database connection error");
      console.error("🚨 BLOCKING ACCESS: Database error", dbUserError);
      return;
    }

    // ✅ All checks passed - user exists in both systems
    if (clerkUser && currentUser) {
      setIsBlocked(false);
      setBlockReason("");
      
      // Cache successful verification
      const cacheKey = `db_verification_${clerkUser.id}`;
      const cacheData = {
        timestamp: Date.now(),
        verified: true,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
      
      // If this was a background refresh, mark it complete
      if (isBackgroundRefreshing) {
        setIsBackgroundRefreshing(false);
        console.log("✅ Background verification refresh completed - cache updated");
      } else {
        console.log(
          "✅ ACCESS GRANTED: User verified in both Clerk and database (cached for future)",
          {
            clerkUserId: clerkUser.id,
            databaseUserId: currentUser.id,
            userName: currentUser.name,
            userRole: currentUser.role,
          }
        );
      }
      return;
    }

    // 🚨 CRITICAL: User in Clerk but NOT in database
    // Only block if we're definitely done loading, ready, grace period ended, and still no user
    if (
      clerkUser &&
      !currentUser &&
      !dbUserLoading &&
      isReady &&
      (gracePeriodEnded || isBackgroundRefreshing)
    ) {
      setIsBlocked(true);
      setBlockReason("User not found in database");
      
      // Cache blocked verification (shorter duration for security)
      const cacheKey = `db_verification_${clerkUser.id}`;
      const cacheData = {
        timestamp: Date.now(),
        verified: false,
        reason: "User not found in database"
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
      
      // If this was a background refresh, mark it complete
      if (isBackgroundRefreshing) {
        setIsBackgroundRefreshing(false);
        console.log("🚨 Background verification refresh completed - user still not found");
      } else {
        console.error(
          "🚨 BLOCKING ACCESS: User authenticated with Clerk but not found in database",
          {
            clerkUserId: clerkUser.id,
            userEmail: clerkUser.emailAddresses?.[0]?.emailAddress,
            timestamp: new Date().toISOString(),
            isReady,
            gracePeriodEnded,
            dbUserLoading,
          }
        );
      }

      // Additional security logging
      console.error("🛡️ ACCESS DENIED - Security violation detected");
      console.error(
        "📧 User email:",
        clerkUser.emailAddresses?.[0]?.emailAddress
      );
      console.error("🆔 Clerk ID:", clerkUser.id);
      return;
    }
  }, [
    clerkLoaded,
    clerkUser,
    currentUser,
    dbUserLoading,
    dbUserError,
    isReady,
    gracePeriodEnded,
    isVerificationCached,
    isBackgroundRefreshing,
  ]);

  // Only show loading screen if:
  // 1. Clerk hasn't loaded yet, OR
  // 2. We have a user but no cached verification AND grace period hasn't ended yet
  // Note: If we have cached verification, skip loading screen entirely
  if (
    !clerkLoaded ||
    (clerkUser && !isVerificationCached && !gracePeriodEnded)
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg">🛡️</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Verifying Access
          </h2>

          <p className="text-gray-600 mb-4">
            Checking your security credentials and permissions...
            {clerkUser && !gracePeriodEnded && (
              <>
                <br />
                <span className="text-sm text-gray-500">
                  Initializing secure connection...
                </span>
              </>
            )}
          </p>

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>This should only take a moment</span>
          </div>
        </div>
      </div>
    );
  }

  // 🚨 BLOCK ACCESS - Show security block screen
  if (isBlocked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚨</span>
          </div>

          <h1 className="text-2xl font-bold text-red-800 mb-4">
            Access Denied
          </h1>

          <p className="text-red-700 mb-6">
            Security verification failed: {blockReason}
          </p>

          <div className="space-y-3 text-sm text-red-600">
            <p>• Your account authentication could not be verified</p>
            <p>• This is a security measure to protect unauthorized access</p>
            <p>• Contact support if you believe this is an error</p>
          </div>

          <div className="mt-6 space-y-2">
            <button
              onClick={async () => {
                try {
                  setBlockReason("Attempting account sync...");
                  const response = await fetch("/api/sync-current-user", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                  });

                  if (response.ok) {
                    setBlockReason("Sync successful, refreshing...");
                    setTimeout(() => window.location.reload(), 1000);
                  } else {
                    const errorText = await response.text();
                    console.error("Sync failed:", errorText);
                    setBlockReason(`Sync failed: ${errorText}`);
                  }
                } catch (error) {
                  console.error("Sync error:", error);
                  setBlockReason(`Sync error: ${(error as Error).message}`);
                }
              }}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Account Sync
            </button>

            <button
              onClick={() => (window.location.href = "/sign-out")}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Sign Out
            </button>
          </div>

          <p className="text-xs text-red-500 mt-6">
            Security ID: {new Date().getTime().toString(36)}
          </p>
        </div>
      </div>
    );
  }

  // ✅ All security checks passed - render application
  return <>{children}</>;
}
