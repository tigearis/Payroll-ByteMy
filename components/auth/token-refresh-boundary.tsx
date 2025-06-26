"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TokenRefreshBoundaryProps {
  children: React.ReactNode;
}

export function TokenRefreshBoundary({ children }: TokenRefreshBoundaryProps) {
  const { getToken, signOut, isSignedIn, isLoaded } = useAuth();
  const [hasTokenError, setHasTokenError] = useState(false);

  // Don't run token checks if user is not signed in
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <>{children}</>;
  }

  useEffect(() => {
    let consecutiveFailures = 0;
    const maxFailures = 3;
    
    const checkToken = async () => {
      try {
        // Try to get hasura template token
        const token = await getToken({ 
          template: "hasura",
          leewayInSeconds: 60
        });
        
        if (!token) {
          consecutiveFailures++;
          console.warn(`⚠️ Hasura token refresh failed (${consecutiveFailures}/${maxFailures})`);
          
          // Only sign out after multiple consecutive failures
          if (consecutiveFailures >= maxFailures) {
            console.error("❌ Too many consecutive token failures, signing out");
            setHasTokenError(true);
            toast.error("Session expired. Please sign in again.");
            await signOut();
          }
        } else {
          // Reset failure count on success
          consecutiveFailures = 0;
          setHasTokenError(false);
        }
      } catch (error) {
        consecutiveFailures++;
        console.error(`❌ Token check failed (${consecutiveFailures}/${maxFailures}):`, error);
        
        // Check if it's a user metadata issue
        if (error.message?.includes('public_metadata') || error.message?.includes('role') || error.message?.includes('databaseId')) {
          console.error("❌ User metadata missing - user needs to complete profile setup");
          toast.error("Please complete your profile setup to continue.");
          // Don't auto-signout for metadata issues - let user fix their profile
          return;
        }
        
        // Only sign out after multiple consecutive failures for other errors
        if (consecutiveFailures >= maxFailures) {
          setHasTokenError(true);
          toast.error("Authentication error. Please sign in again.");
          await signOut();
        }
      }
    };

    // Check token every 2 minutes (less aggressive than before)
    const interval = setInterval(checkToken, 120000);
    
    // Initial check after 5 seconds to let auth settle
    const initialTimeout = setTimeout(checkToken, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [getToken, signOut]);

  if (hasTokenError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Session Expired</h2>
          <p className="text-gray-600 mb-4">Please sign in again to continue.</p>
          <button 
            onClick={() => signOut()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}