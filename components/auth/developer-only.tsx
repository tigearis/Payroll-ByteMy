"use client";

/**
 * Developer Only Component
 * 
 * Simple component to restrict access to developer-only features.
 */

import { ReactNode } from "react";
import { PermissionGuard } from "./permission-guard";

interface DeveloperOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function DeveloperOnly({ children, fallback }: DeveloperOnlyProps) {
  return (
    <PermissionGuard role="developer" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export default DeveloperOnly;