// components/auth/DatabaseUserGuard.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { AlertTriangle, RefreshCw, UserX, Database } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";

interface DatabaseUserGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Security Guard: Ensures user exists in database before granting access
 *
 * This component prevents the security issue where:
 * 1. User is authenticated with Clerk
 * 2. User doesn't exist in database
 * 3. User still gets access with default permissions
 */
export function DatabaseUserGuard({
  children,
  fallback,
}: DatabaseUserGuardProps) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const {
    currentUser,
    loading: dbUserLoading,
    error: dbUserError,
  } = useCurrentUser();

  // Wait for Clerk to load
  if (!clerkLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated with Clerk - let Clerk handle this
  if (!clerkUser) {
    return <>{children}</>;
  }

  // Still loading database user check
  if (dbUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying user access...</p>
        </div>
      </div>
    );
  }

  // 🚨 SECURITY CHECK: User exists in Clerk but NOT in database
  if (clerkUser && !dbUserLoading && !currentUser) {
    console.error(
      "🚨 SECURITY ALERT: User authenticated with Clerk but not found in database",
      {
        clerkUserId: clerkUser.id,
        userEmail: clerkUser.emailAddresses?.[0]?.emailAddress,
        timestamp: new Date().toISOString(),
        hasDbError: !!dbUserError,
        dbUserLoading,
        currentUser,
      }
    );

    // For debugging: log additional context
    console.error("🔍 Debug info:", {
      clerkUserExists: !!clerkUser,
      dbUserLoading,
      currentUserExists: !!currentUser,
      dbUserError: dbUserError?.message,
    });

    if (fallback) {
      return <>{fallback}</>;
    }

    return <UserNotInDatabaseFallback clerkUser={clerkUser} />;
  }

  // Database error - show error state
  if (dbUserError) {
    console.error("Database user verification error:", dbUserError);
    return <DatabaseErrorFallback error={dbUserError} />;
  }

  // ✅ User exists in both Clerk and database - grant access
  if (clerkUser && currentUser) {
    return <>{children}</>;
  }

  // Fallback for any other edge cases
  return <UnexpectedStateFallback />;
}

/**
 * Fallback component when user exists in Clerk but not in database
 */
function UserNotInDatabaseFallback({ clerkUser }: { clerkUser: any }) {
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleSyncUser = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch("/api/sync-current-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("User synchronized successfully", {
          description: "Please refresh the page to continue.",
        });
        // Refresh the page after successful sync
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const _error = await response.text();
        throw new Error(_error);
      }
    } catch (_error) {
      console.error("Failed to sync user:", _error);
      toast.error("Failed to sync user", {
        description: "Please contact support if this issue persists.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      // This will redirect to Clerk's sign out
      window.location.href = "/sign-out";
    } catch (_error) {
      console.error("Sign out error:", _error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <UserX className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl">Account Setup Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your account is not properly set up in our system. This is a
              security measure to protect unauthorized access.
            </AlertDescription>
          </Alert>

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Account:</strong>{" "}
              {clerkUser.emailAddresses?.[0]?.emailAddress}
            </p>
            <p>
              <strong>Status:</strong> Authenticated but not synchronized
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleSyncUser}
              disabled={isSyncing}
              className="w-full"
            >
              {isSyncing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Synchronizing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Account
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            If the sync fails, please contact support for assistance.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Fallback component for database errors
 */
function DatabaseErrorFallback({ _error }: { error: any }) {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <Database className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle className="text-xl">Connection Issue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Unable to verify your account status. This may be a temporary
              connection issue.
            </AlertDescription>
          </Alert>

          <Button onClick={handleRetry} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Fallback for unexpected authentication states
 */
function UnexpectedStateFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
          <CardTitle className="text-xl">Authentication Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              An unexpected authentication state occurred. Please sign out and
              sign in again.
            </AlertDescription>
          </Alert>

          <Button
            onClick={() => (window.location.href = "/sign-out")}
            className="w-full"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
