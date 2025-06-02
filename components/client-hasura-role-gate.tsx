// components/client-hasura-role-gate.tsx
"use client";

import { ReactNode } from "react";
import { useAuthContext, UserRole } from "@/lib/auth-context";

type ClientHasuraRoleGateProps = {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
};

export default function ClientHasuraRoleGate({
  children,
  allowedRoles,
  fallback = <div>You dont have permission to view this content</div>,
}: ClientHasuraRoleGateProps) {
  const { userRole, isLoading } = useAuthContext();

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const hasPermission = allowedRoles.includes(userRole);

  if (!hasPermission) {
    return fallback;
  }

  return <>{children}</>;
}
