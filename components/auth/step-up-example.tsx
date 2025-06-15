// components/auth/step-up-example.tsx
"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStepUpAuth } from "./step-up-auth";
import { Mail, Lock, CreditCard, Shield } from "lucide-react";
import { toast } from "sonner";

/**
 * Example component showing how to use step-up authentication
 * for sensitive actions in your application.
 */
export function StepUpExample() {
  const { user } = useUser();
  const { requireStepUp } = useStepUpAuth();

  // Example: Adding a new email address (sensitive action)
  const handleAddEmail = async () => {
    const action = async () => {
      // This would be your actual email addition logic
      // Clerk will automatically prompt for step-up auth if needed
      const newEmail = "new-email@example.com"; // This would come from a form
      
      try {
        await user?.createEmailAddress({ emailAddress: newEmail });
        toast.success("Email added successfully");
      } catch (error) {
        console.error("Failed to add email:", error);
        throw error; // Re-throw to be handled by step-up wrapper
      }
    };

    requireStepUp(action, "adding a new email address");
  };

  // Example: Changing password (sensitive action)
  const handleChangePassword = async () => {
    const action = async () => {
      // This would be your actual password change logic
      try {
        await user?.updatePassword({
          currentPassword: "current-password", // This would come from a form
          newPassword: "new-password", // This would come from a form
        });
        toast.success("Password changed successfully");
      } catch (error) {
        console.error("Failed to change password:", error);
        throw error;
      }
    };

    requireStepUp(action, "changing your password");
  };

  // Example: Adding payment method (sensitive action)
  const handleAddPaymentMethod = async () => {
    const action = async () => {
      // This would be your actual payment method addition logic
      // You might integrate with Stripe or another payment processor
      try {
        // Simulated payment method addition
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Payment method added successfully");
      } catch (error) {
        console.error("Failed to add payment method:", error);
        throw error;
      }
    };

    requireStepUp(action, "adding a new payment method");
  };

  // Example: Enabling 2FA (sensitive action)
  const handleEnable2FA = async () => {
    const action = async () => {
      try {
        // This would be your actual 2FA enablement logic
        await user?.create2FABackupCodes();
        toast.success("Two-factor authentication enabled");
      } catch (error) {
        console.error("Failed to enable 2FA:", error);
        throw error;
      }
    };

    requireStepUp(action, "enabling two-factor authentication");
  };

  return (
    <div className="space-y-6 max-w-md mx-auto p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Security Settings</h2>
        <p className="text-muted-foreground">
          These actions require additional verification for your security.
        </p>
      </div>

      <div className="space-y-4">
        {/* Email Management */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Email Management</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Add or remove email addresses from your account.
          </p>
          <Button 
            onClick={handleAddEmail}
            variant="outline"
            className="w-full"
          >
            Add New Email
          </Button>
        </div>

        {/* Password Security */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold">Password Security</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Update your account password for enhanced security.
          </p>
          <Button 
            onClick={handleChangePassword}
            variant="outline"
            className="w-full"
          >
            Change Password
          </Button>
        </div>

        {/* Payment Methods */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">Payment Methods</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Manage your payment methods and billing information.
          </p>
          <Button 
            onClick={handleAddPaymentMethod}
            variant="outline"
            className="w-full"
          >
            Add Payment Method
          </Button>
        </div>

        {/* Two-Factor Authentication */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold">Two-Factor Authentication</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Add an extra layer of security to your account.
          </p>
          <Button 
            onClick={handleEnable2FA}
            variant="outline"
            className="w-full"
            disabled={user?.twoFactorEnabled}
          >
            {user?.twoFactorEnabled ? "2FA Enabled" : "Enable 2FA"}
          </Button>
        </div>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        <Shield className="w-4 h-4 inline mr-1" />
        All sensitive actions are protected by step-up authentication
      </div>
    </div>
  );
}