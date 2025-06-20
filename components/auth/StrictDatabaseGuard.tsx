// components/auth/StrictDatabaseGuard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface StrictDatabaseGuardProps {
  children: React.ReactNode;
}

/**
 * Simplified database guard using native Clerk features
 * Ensures user exists in both Clerk and database
 */
export function StrictDatabaseGuard({ children }: StrictDatabaseGuardProps) {
  const { user: clerkUser, isLoaded } = useUser();
  const { currentUser, loading, error } = useCurrentUser();
  const [shouldBlock, setShouldBlock] = useState(false);

  useEffect(() => {
    if (!isLoaded || loading) return;

    if (!clerkUser) {
      setShouldBlock(false);
      return;
    }

    if (error || (!currentUser && !loading)) {
      setShouldBlock(true);
      return;
    }

    setShouldBlock(false);
  }, [isLoaded, clerkUser, currentUser, loading, error]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (shouldBlock) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center p-6">
          <h1 className="text-xl font-bold text-red-800 mb-4">Access Denied</h1>
          <p className="text-red-700">Account verification failed</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}