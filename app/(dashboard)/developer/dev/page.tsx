"use client";

import { AlertTriangle, Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUserRole } from "@/hooks/use-user-role";
import { UnifiedDevDashboard } from "@/lib/dev";

export default function DevToolsPage() {
  // SECURITY: Verify user has developer permissions
  const { userRole, isLoading: roleLoading } = useUserRole();
  const isDeveloper = userRole === "developer";

  // SECURITY: Block access for non-developers
  if (!roleLoading && !isDeveloper) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You need developer privileges to access the development dashboard.
            Only users with the 'developer' role can access these tools.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show loading state while checking permissions
  if (roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-12 w-12 animate-pulse mx-auto mb-4" />
          <p>Verifying developer access...</p>
        </div>
      </div>
    );
  }

  return <UnifiedDevDashboard />;
}