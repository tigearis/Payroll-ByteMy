"use client";

import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import {
  useAuthContext,
  ROUTE_PERMISSIONS,
  UserRole,
} from "../../lib/auth-context";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: UserRole[];
  requireAll?: boolean;
  fallbackRoute?: string;
  customFallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export function RouteGuard({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  requireAll = false,
  fallbackRoute = "/dashboard",
  customFallback,
  loadingComponent,
}: RouteGuardProps) {
  const {
    isLoading,
    isAuthenticated,
    hasPermission,
    hasAnyPermission,
    hasRole,
    userRole,
  } = useAuthContext();
  const router = useRouter();

  // Show loading state
  if (isLoading) {
    return (
      loadingComponent || (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-500">Loading...</p>
          </div>
        </div>
      )
    );
  }

  // Check authentication
  if (!isAuthenticated) {
    router.push("/sign-in");
    return null;
  }

  // Check permissions
  let hasRequiredPermissions = true;
  if (requiredPermissions.length > 0) {
    if (requireAll) {
      hasRequiredPermissions = requiredPermissions.every((p) =>
        hasPermission(p)
      );
    } else {
      hasRequiredPermissions = hasAnyPermission(requiredPermissions);
    }
  }

  // Check roles
  let hasRequiredRoles = true;
  if (requiredRoles.length > 0) {
    hasRequiredRoles = hasRole(requiredRoles);
  }

  // Grant access if all checks pass
  const hasAccess = hasRequiredPermissions && hasRequiredRoles;

  if (!hasAccess) {
    // Use custom fallback if provided
    if (customFallback) {
      return <>{customFallback}</>;
    }

    // Default access denied UI
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don&apos;t have permission to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-sm text-slate-600">
              <p>
                Your current role:{" "}
                <span className="font-medium capitalize">{userRole}</span>
              </p>
              {requiredPermissions.length > 0 && (
                <p className="mt-2">
                  Required permissions: {requiredPermissions.join(", ")}
                </p>
              )}
              {requiredRoles.length > 0 && (
                <p className="mt-2">
                  Required roles: {requiredRoles.join(", ")}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
              <Button onClick={() => router.push(fallbackRoute)}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook to check route permissions for current path
export function useRoutePermissions(pathname: string) {
  const { hasAnyPermission } = useAuthContext();

  const requiredPermissions = ROUTE_PERMISSIONS[pathname] || [];
  const hasAccess =
    requiredPermissions.length === 0 || hasAnyPermission(requiredPermissions);

  return {
    hasAccess,
    requiredPermissions,
  };
}

// Higher-order component for page-level protection
export function withRouteGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  guardOptions: Omit<RouteGuardProps, "children">
) {
  return function GuardedComponent(props: P) {
    return (
      <RouteGuard {...guardOptions}>
        <WrappedComponent {...props} />
      </RouteGuard>
    );
  };
}
