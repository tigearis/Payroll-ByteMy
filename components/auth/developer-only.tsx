import React from "react";
import { useAuthContext } from "@/lib/auth/enhanced-auth-context";

interface DeveloperOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that only renders its children for developer role users
 * Provides a standardized way to show developer-only content
 */
export function DeveloperOnly({ children, fallback }: DeveloperOnlyProps) {
  const { userRole } = useAuthContext();
  
  if (userRole !== "developer") {
    return fallback || null;
  }

  return <>{children}</>;
}