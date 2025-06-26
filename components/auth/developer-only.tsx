import React from "react";
import { PermissionDenied } from "./permission-denied";
import { useEnhancedPermissions } from "@/hooks/use-enhanced-permissions";

interface DeveloperOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that only renders its children for developer role users
 * Provides a standardized way to show developer-only content
 */
export function DeveloperOnly({ children, fallback }: DeveloperOnlyProps) {
  const { checkPermission } = useEnhancedPermissions();
  
  const systemAdminPermission = checkPermission("system", "admin");
  
  if (!systemAdminPermission.granted) {
    return fallback || (
      <PermissionDenied 
        result={systemAdminPermission}
      />
    );
  }

  return <>{children}</>;
}