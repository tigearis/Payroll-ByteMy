// components/auth/StrictDatabaseGuard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useCurrentUser } from "@/hooks/useCurrentUser";

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
  const { currentUser, loading: dbUserLoading, error: dbUserError } = useCurrentUser();
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState<string>("");

  // Monitor access status
  useEffect(() => {
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

    // Still loading database check OR initial user ID extraction
    if (dbUserLoading) {
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
      console.log("✅ ACCESS GRANTED: User verified in both Clerk and database", {
        clerkUserId: clerkUser.id,
        databaseUserId: currentUser.id,
        userEmail: currentUser.email
      });
      return;
    }

    // 🚨 CRITICAL: User in Clerk but NOT in database
    // Only block if we're definitely done loading and still no user
    if (clerkUser && !currentUser && !dbUserLoading) {
      setIsBlocked(true);
      setBlockReason("User not found in database");
      console.error("🚨 BLOCKING ACCESS: User authenticated with Clerk but not found in database", {
        clerkUserId: clerkUser.id,
        userEmail: clerkUser.emailAddresses?.[0]?.emailAddress,
        timestamp: new Date().toISOString()
      });
      
      // Additional security logging
      console.error("🛡️ ACCESS DENIED - Security violation detected");
      console.error("📧 User email:", clerkUser.emailAddresses?.[0]?.emailAddress);
      console.error("🆔 Clerk ID:", clerkUser.id);
      return;
    }

  }, [clerkLoaded, clerkUser, currentUser, dbUserLoading, dbUserError]);

  // Show loading while verifying
  if (!clerkLoaded || (clerkUser && dbUserLoading)) {
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
                  const response = await fetch("/api/sync-current-user", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                  });
                  
                  if (response.ok) {
                    window.location.reload();
                  } else {
                    console.error("Sync failed:", await response.text());
                  }
                } catch (error) {
                  console.error("Sync error:", error);
                }
              }}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Account Sync
            </button>
            
            <button
              onClick={() => window.location.href = "/sign-out"}
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