"use client";

/**
 * Strict Database Guard
 * 
 * Simplified version that ensures users have valid database records.
 * Uses the simplified authentication context.
 */

import { ReactNode } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAuthContext } from "@/lib/auth";
import { Loader2 } from "lucide-react";

interface StrictDatabaseGuardProps {
  children: ReactNode;
}

export function StrictDatabaseGuard({ children }: StrictDatabaseGuardProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const { currentUser, loading: dbLoading, error } = useCurrentUser();

  // Show loading while checking auth and database
  if (authLoading || dbLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Initializing application...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, let Clerk handle it
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // If database error or no user record, show error
  if (error || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Account Setup Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your account needs to be set up in our system. Please contact your administrator or try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // All checks pass, render children
  return <>{children}</>;
}