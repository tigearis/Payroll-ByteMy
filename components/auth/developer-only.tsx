import React from "react";
import { useEnhancedPermissions } from "@/hooks/use-enhanced-permissions";
import { PermissionDenied } from "./permission-denied";

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
        requiredPermission="system:admin"
        message="This page is only available to developers."
        suggestions={[
          "Contact your system administrator if you need developer access",
          "Use the appropriate user interface for your role level",
        ]}
      />
    );
  }

  return <>{children}</>;
}