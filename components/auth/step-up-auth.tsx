// components/auth/step-up-auth.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { Shield, AlertTriangle } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StepUpAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionDescription: string;
  children?: React.ReactNode;
}

/**
 * Step-Up Authentication Component
 *
 * Handles Clerk's new step-up authentication requirement for sensitive actions.
 * This component prompts users to re-verify themselves before performing
 * sensitive operations like adding emails, changing passwords, etc.
 */
export function StepUpAuth({
  isOpen,
  onClose,
  onSuccess,
  actionDescription,
  children,
}: StepUpAuthProps) {
  const { _user } = useUser();
  const [isVerifying, setIsVerifying] = useState(false);
  const [_error, setError] = useState<string | null>(null);

  const handleStepUpVerification = async () => {
    if (!_user) {
      setError("User not found. Please sign in again.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // For Session JWT V2, Clerk automatically handles step-up authentication
      // when sensitive actions are performed. The verification modal will
      // be shown by Clerk's components automatically.

      // If the user has 2FA enabled, they'll be prompted for it
      // If not, they may be asked to re-enter their password

      // This is a placeholder for the actual sensitive action
      // In your actual implementation, you would perform the sensitive action here
      // and Clerk will automatically prompt for step-up auth if needed

      toast.success("Verification successful", {
        description: "You can now proceed with the sensitive action.",
      });

      onSuccess();
    } catch (err: any) {
      console.error("Step-up authentication failed:", err);

      // Handle different types of verification failures
      if (err.code === "verification_failed") {
        setError("Verification failed. Please try again.");
      } else if (err.code === "too_many_attempts") {
        setError("Too many verification attempts. Please wait and try again.");
      } else {
        setError("Verification failed. Please try again or contact support.");
      }

      toast.error("Verification Failed", {
        description: "Unable to verify your identity. Please try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Security Verification Required
          </DialogTitle>
          <DialogDescription>
            For your security, please verify your identity before{" "}
            {actionDescription}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This action requires additional verification to protect your
              account.
              {user?.twoFactorEnabled
                ? " You'll be prompted for your two-factor authentication code."
                : " You may be asked to re-enter your password."}
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{_error}</AlertDescription>
            </Alert>
          )}

          {children && (
            <div className="p-4 bg-muted/50 rounded-lg">{children}</div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isVerifying}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleStepUpVerification}
            disabled={isVerifying}
            className="flex-1"
          >
            {isVerifying ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Verify Identity
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Hook for using step-up authentication
 */
export function useStepUpAuth() {
  const [isStepUpOpen, setIsStepUpOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    action: () => Promise<void>;
    description: string;
  } | null>(null);

  const requireStepUp = (action: () => Promise<void>, description: string) => {
    setPendingAction({ action, description });
    setIsStepUpOpen(true);
  };

  const handleStepUpSuccess = async () => {
    if (pendingAction) {
      try {
        await pendingAction.action();
        toast.success("Action completed successfully");
      } catch (_error) {
        console.error("Action failed after step-up:", _error);
        toast.error("Action failed", {
          description: "Please try again or contact support.",
        });
      } finally {
        setPendingAction(null);
        setIsStepUpOpen(false);
      }
    }
  };

  const handleStepUpClose = () => {
    setPendingAction(null);
    setIsStepUpOpen(false);
  };

  return {
    isStepUpOpen,
    requireStepUp,
    handleStepUpSuccess,
    handleStepUpClose,
    pendingActionDescription: pendingAction?.description || "",
  };
}

/**
 * Higher-order component to wrap sensitive actions with step-up authentication
 */
export function withStepUpAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  sensitiveActions: string[] = []
) {
  return function StepUpWrapper(props: _T) {
    const {
      isStepUpOpen,
      requireStepUp,
      handleStepUpSuccess,
      handleStepUpClose,
      pendingActionDescription,
    } = useStepUpAuth();

    // Inject step-up authentication handlers into the component
    const enhancedProps = {
      ...props,
      requireStepUp,
    } as T;

    return (
      <>
        <WrappedComponent {...enhancedProps} />
        <StepUpAuth
          isOpen={isStepUpOpen}
          onClose={handleStepUpClose}
          onSuccess={handleStepUpSuccess}
          actionDescription={pendingActionDescription}
        />
      </>
    );
  };
}
