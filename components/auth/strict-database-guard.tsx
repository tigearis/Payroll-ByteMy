"use client";

/**
 * Strict Database Guard
 *
 * Simplified version - just passes through children.
 * Database checks are moved to individual pages that need them.
 */

import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { ReactNode } from "react";
import { QuickLoading } from "@/components/ui/smart-loading";

interface StrictDatabaseGuardProps {
  children: ReactNode;
}

export function StrictDatabaseGuard({ children }: StrictDatabaseGuardProps) {
  return (
    <>
      {/* Show loading while checking auth */}
      <ClerkLoading>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <QuickLoading.Page
            title="Authenticating..."
            description="Verifying your credentials"
          />
        </div>
      </ClerkLoading>
      {/* Just render children - let individual pages handle database checks */}
      <ClerkLoaded>{children}</ClerkLoaded>
    </>
  );
}
