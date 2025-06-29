"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { UnauthorizedModal } from "@/components/auth/unauthorized-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUnauthorizedModal } from "@/hooks/use-unauthorized-modal";
import { navigateToUnauthorized } from "@/lib/auth/unauthorized-handler";

/**
 * Example component demonstrating different ways to handle unauthorized access
 * This shows the modal approach which is consistent with the app's UI patterns
 */
export function UnauthorizedExample() {
  const router = useRouter();
  const unauthorizedModal = useUnauthorizedModal();

  // Method 1: Using the hook directly (recommended for interactive components)
  const handleInsufficientPermissions = () => {
    unauthorizedModal.show("insufficient_permissions");
  };

  const handleInactiveAccount = () => {
    unauthorizedModal.show("inactive");
  };

  const handleStaffRequired = () => {
    unauthorizedModal.show("not_staff");
  };

  // Method 2: Using the utility function to redirect to unauthorized page as modal
  const handleModalRedirect = () => {
    navigateToUnauthorized(router, {
      reason: "insufficient_permissions",
      useModal: true,
    });
  };

  // Method 3: Using the utility function to redirect to full unauthorized page
  const handleFullPageRedirect = () => {
    navigateToUnauthorized(router, {
      reason: "insufficient_permissions",
      useModal: false,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Unauthorized Access Modal Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Direct Modal Usage</h3>
              <p className="text-sm text-muted-foreground">
                Best for components that need to handle unauthorized access
                inline
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={handleInsufficientPermissions}
                  className="w-full"
                >
                  Show Insufficient Permissions
                </Button>
                <Button
                  variant="outline"
                  onClick={handleInactiveAccount}
                  className="w-full"
                >
                  Show Inactive Account
                </Button>
                <Button
                  variant="outline"
                  onClick={handleStaffRequired}
                  className="w-full"
                >
                  Show Staff Required
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Navigation-based Usage</h3>
              <p className="text-sm text-muted-foreground">
                Best for route guards and API error handling
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={handleModalRedirect}
                  className="w-full"
                >
                  Navigate to Modal
                </Button>
                <Button
                  variant="outline"
                  onClick={handleFullPageRedirect}
                  className="w-full"
                >
                  Navigate to Full Page
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* The modal component */}
      <UnauthorizedModal
        open={unauthorizedModal.isOpen}
        onOpenChange={open => !open && unauthorizedModal.hide()}
        reason={unauthorizedModal.reason}
        onNavigateHome={unauthorizedModal.handleNavigateHome}
        onGoBack={unauthorizedModal.handleGoBack}
      />
    </div>
  );
}

/**
 * Example of how to integrate with permission guards
 */
export function ProtectedComponentExample() {
  const unauthorizedModal = useUnauthorizedModal();
  const [hasPermission] = useState(false); // This would come from your auth system

  // Show modal when permission check fails
  const handlePermissionCheck = () => {
    if (!hasPermission) {
      unauthorizedModal.show("insufficient_permissions");
      return false;
    }
    return true;
  };

  const handleProtectedAction = () => {
    if (!handlePermissionCheck()) {
      return;
    }

    // Proceed with protected action
    console.log("Performing protected action...");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Protected Component Example</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleProtectedAction}>
          Perform Protected Action
        </Button>

        <UnauthorizedModal
          open={unauthorizedModal.isOpen}
          onOpenChange={open => !open && unauthorizedModal.hide()}
          reason={unauthorizedModal.reason}
        />
      </CardContent>
    </Card>
  );
}
