"use client";

import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useInvitationResend } from "@/domains/auth";
import { PermissionGuard } from "@/components/auth/permission-guard";

interface Invitation {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  invitedRole: string;
  status: string;
  expiresAt: string;
}

interface ResendInvitationButtonProps {
  invitation: Invitation;
  onResent?: () => void;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "destructive"
    | "secondary";
  size?: "default" | "sm" | "lg";
  disabled?: boolean;
}

export function ResendInvitationButton({
  invitation,
  onResent,
  variant = "outline",
  size = "sm",
  disabled = false,
}: ResendInvitationButtonProps) {
  return (
    <PermissionGuard permission="staff:write">
      <ResendInvitationButtonInner
        invitation={invitation}
        onResent={onResent}
        variant={variant}
        size={size}
        disabled={disabled}
      />
    </PermissionGuard>
  );
}

function ResendInvitationButtonInner({
  invitation,
  onResent,
  variant = "outline",
  size = "sm",
  disabled = false,
}: ResendInvitationButtonProps) {
  const { resendInvitation, loading } = useInvitationResend();

  const handleResend = async () => {
    // Calculate new expiry date (7 days from now)
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7);

    const result = await resendInvitation({
      invitationId: invitation.id,
      newExpiresAt: newExpiresAt.toISOString(),
    });

    if (result.success) {
      toast.success(`Invitation resent to ${invitation.email}`);
      onResent?.();
    } else {
      toast.error("Failed to resend invitation");
    }
  };

  const canResend = ["pending", "expired"].includes(invitation.status);

  if (!canResend) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleResend}
      disabled={disabled || loading.resend}
      className="gap-2"
    >
      <Send className="h-4 w-4" />
      {loading.resend ? "Resending..." : "Resend"}
    </Button>
  );
}

export default ResendInvitationButton;
