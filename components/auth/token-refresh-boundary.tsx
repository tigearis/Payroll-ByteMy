"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TokenRefreshBoundaryProps {
  children: React.ReactNode;
}

export function TokenRefreshBoundary({ children }: TokenRefreshBoundaryProps) {
  const { getToken, signOut } = useAuth();
  const [hasTokenError, setHasTokenError] = useState(false);

  useEffect(() => {
    // Check token validity periodically
    const checkToken = async () => {
      try {
        const token = await getToken({ 
          template: "hasura",
          leewayInSeconds: 60
        });
        
        if (!token) {
          console.warn("⚠️ Token refresh failed");
          setHasTokenError(true);
          toast.error("Session expired. Please sign in again.");
          await signOut();
        } else {
          setHasTokenError(false);
        }
      } catch (error) {
        console.error("❌ Token check failed:", error);
        setHasTokenError(true);
      }
    };

    // Check token every 30 seconds
    const interval = setInterval(checkToken, 30000);
    
    // Initial check
    checkToken();

    return () => clearInterval(interval);
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