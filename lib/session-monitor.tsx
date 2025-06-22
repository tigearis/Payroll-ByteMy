"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Simple Session Monitor
 *
 * Uses Clerk's native session management and only provides
 * user-friendly notifications when sessions end naturally.
 *
 * Clerk handles all the heavy lifting:
 * - Automatic token refresh
 * - Session expiry detection
 * - JWT validation
 * - Authentication state management
 */
export function SessionMonitor() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only show notification if Clerk has finished loading and user is not signed in
    if (isLoaded && !isSignedIn) {
      // User session ended - Clerk already handled the cleanup
      toast.info("Session ended", {
        description: "Please sign in to continue",
        duration: 8000,
        action: {
          label: "Sign In",
          onClick: () => router.push("/sign-in"),
        },
      });
    }
  }, [isSignedIn, isLoaded, router]);

  // This component doesn't render anything visible
  return null;
}

export default SessionMonitor;
