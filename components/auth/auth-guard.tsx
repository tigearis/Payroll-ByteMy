"use client";

/**
 * Clean Authentication Guard
 * 
 * Simple component that only checks if user is logged in.
 * Ignores all permission/role props for backward compatibility.
 */

import { ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  // Legacy props (ignored)
  permission?: string;
  role?: string;
  requireAll?: boolean;
}

export function AuthGuard({
  children,
  fallback = null,
}: AuthGuardProps) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Legacy component aliases for backward compatibility
export { AuthGuard as PermissionGuard };
export { AuthGuard as AdminOnly };
export { AuthGuard as ManagerOnly };
export { AuthGuard as DeveloperOnly };
export { AuthGuard as ConsultantOnly };
export { AuthGuard as LegacyPermissionGuard };

export default AuthGuard;