"use client";

/**
 * Clean Authentication Guard
 * 
 * Simple component that only checks if user is logged in.
 * All legacy permission/role props are ignored.
 */

import { ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  // Legacy props (ignored for backward compatibility)
  permission?: string;
  role?: string;
  requireAll?: boolean;
}

export function PermissionGuard({
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

// Legacy component aliases
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGuard fallback={fallback}>{children}</PermissionGuard>;
}

export function ManagerOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGuard fallback={fallback}>{children}</PermissionGuard>;
}

export function DeveloperOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGuard fallback={fallback}>{children}</PermissionGuard>;
}

export function ConsultantOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGuard fallback={fallback}>{children}</PermissionGuard>;
}

export function LegacyPermissionGuard({
  children,
  fallback = null,
}: {
  permission?: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return <PermissionGuard fallback={fallback}>{children}</PermissionGuard>;
}

export default PermissionGuard;