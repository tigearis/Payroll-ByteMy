"use client";

import { AlertTriangle, ArrowLeft, Shield, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UnauthorizedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: string | undefined;
  onNavigateHome?: () => void;
  onGoBack?: () => void;
}

export function UnauthorizedModal({
  open,
  onOpenChange,
  reason,
  onNavigateHome,
  onGoBack,
}: UnauthorizedModalProps) {
  const router = useRouter();

  const getErrorDetails = () => {
    switch (reason) {
      case "inactive":
        return {
          title: "Account Inactive",
          description:
            "Your account has been deactivated. Please contact an administrator for assistance.",
          icon: <Shield className="h-12 w-12 text-amber-500" />,
          showSupport: true,
        };
      case "insufficient_permissions":
        return {
          title: "Insufficient Permissions",
          description:
            "You don't have the required permissions to access this resource.",
          icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
          showSupport: false,
        };
      case "not_staff":
        return {
          title: "Staff Access Required",
          description: "This resource is only available to staff members.",
          icon: <Shield className="h-12 w-12 text-orange-500" />,
          showSupport: false,
        };
      default:
        return {
          title: "Access Denied",
          description: "You don't have permission to access this resource.",
          icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
          showSupport: false,
        };
    }
  };

  const { title, description, icon, showSupport } = getErrorDetails();

  const handleNavigateHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      router.push("/dashboard");
    }
    onOpenChange(false);
  };

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      router.back();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">{icon}</div>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>

        {showSupport && (
          <div className="text-center text-sm text-muted-foreground border-t pt-4">
            Need help? Contact support at{" "}
            <a
              href="mailto:support@payrollmatrix.com"
              className="text-primary hover:underline font-medium"
            >
              support@payrollmatrix.com
            </a>
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" onClick={handleGoBack} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button onClick={handleNavigateHome} className="flex-1">
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
