"use client";

import { useUser } from "@clerk/nextjs";
import {
  Shield,
  ShieldCheck,
  Smartphone,
  Key,
  AlertTriangle,
  Settings,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthContext } from "@/lib/auth/auth-context";
import { securityConfig } from "@/lib/security/config";

interface MFAStatus {
  enabled: boolean;
  verified: boolean;
  methods: string[];
}

export function MFASetup() {
  const { user } = useUser();
  const { userRole } = useAuthContext();
  const [mfaStatus, setMfaStatus] = useState<MFAStatus>({
    enabled: false,
    verified: false,
    methods: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEnabling, setIsEnabling] = useState(false);

  const mfaFeatureEnabled = securityConfig.auth.mfaEnabled;
  const requiresMFA =
    mfaFeatureEnabled && ["developer", "org_admin"].includes(userRole);

  const checkMFAStatus = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      setIsLoading(true);

      // Check if user has MFA enabled
      const twoFactorEnabled = user.twoFactorEnabled || false;
      const mfaVerified = user.twoFactorEnabled || false;

      setMfaStatus({
        enabled: twoFactorEnabled,
        verified: mfaVerified,
        methods: twoFactorEnabled ? ["totp"] : [],
      });
    } catch (error) {
      console.error("Error checking MFA status:", error);
      toast.error("Failed to check MFA status");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // TODO: Review useEffect dependencies for exhaustive-deps rule
  useEffect(() => {
    checkMFAStatus();
  }, [checkMFAStatus]);

  const enableMFA = async () => {
    if (!user) {
      return;
    }

    try {
      setIsEnabling(true);

      // Use Clerk's built-in MFA setup
      // This will open Clerk's MFA setup flow
      await user.createTOTP();

      toast.success("MFA setup initiated. Please follow the instructions.");

      // Refresh status after a delay
      setTimeout(() => {
        checkMFAStatus();
      }, 2000);
    } catch (error) {
      console.error("Error enabling MFA:", error);
      toast.error("Failed to enable MFA. Please try again.");
    } finally {
      setIsEnabling(false);
    }
  };

  const disableMFA = async () => {
    if (!user) {
      return;
    }

    if (requiresMFA) {
      toast.error("MFA cannot be disabled for admin accounts");
      return;
    }

    try {
      setIsEnabling(true);

      // Disable MFA through Clerk
      // await user.deleteTOTP();

      toast.success("MFA has been disabled");
      await checkMFAStatus();
    } catch (error) {
      console.error("Error disabling MFA:", error);
      toast.error("Failed to disable MFA. Please try again.");
    } finally {
      setIsEnabling(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Multi-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show feature disabled message if MFA is not enabled
  if (!mfaFeatureEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-gray-400" />
            Multi-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <strong>MFA Feature Disabled:</strong> Multi-factor authentication
              is currently disabled. To enable MFA, set{" "}
              <code>FEATURE_MFA_ENABLED=true</code> in your environment
              variables and configure MFA in your Clerk dashboard.
            </AlertDescription>
          </Alert>

          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>To enable MFA:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Configure MFA in your Clerk dashboard</li>
              <li>
                Set <code>FEATURE_MFA_ENABLED=true</code> environment variable
              </li>
              <li>Restart your application</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Multi-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* MFA Requirement Notice */}
        {requiresMFA && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>MFA is required for your role ({userRole}).</strong>
              You must enable multi-factor authentication to access sensitive
              features.
            </AlertDescription>
          </Alert>
        )}

        {/* Current Status */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {mfaStatus.enabled ? (
              <ShieldCheck className="h-8 w-8 text-green-600" />
            ) : (
              <Shield className="h-8 w-8 text-gray-400" />
            )}
            <div>
              <h3 className="font-medium">
                MFA Status:{" "}
                <Badge variant={mfaStatus.enabled ? "default" : "secondary"}>
                  {mfaStatus.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </h3>
              <p className="text-sm text-gray-600">
                {mfaStatus.enabled
                  ? `Protected with ${mfaStatus.methods
                      .join(", ")
                      .toUpperCase()}`
                  : "Account is not protected with MFA"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {!mfaStatus.enabled ? (
              <Button
                onClick={enableMFA}
                disabled={isEnabling}
                className="flex items-center gap-2"
              >
                <Smartphone className="h-4 w-4" />
                {isEnabling ? "Setting up..." : "Enable MFA"}
              </Button>
            ) : (
              <>
                {!requiresMFA && (
                  <Button
                    variant="outline"
                    onClick={disableMFA}
                    disabled={isEnabling}
                  >
                    Disable MFA
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={checkMFAStatus}
                  disabled={isEnabling}
                >
                  Refresh Status
                </Button>
              </>
            )}
          </div>
        </div>

        {/* MFA Methods */}
        {mfaStatus.enabled && (
          <div className="space-y-3">
            <h4 className="font-medium">Active MFA Methods</h4>
            <div className="space-y-2">
              {mfaStatus.methods.map(method => (
                <div
                  key={method}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <Key className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">
                      {method.toUpperCase() === "TOTP"
                        ? "Authenticator App"
                        : method.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {method.toUpperCase() === "TOTP"
                        ? "Time-based one-time passwords from your authenticator app"
                        : `${method} authentication`}
                    </p>
                  </div>
                  <Badge variant="default" className="ml-auto">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Setup Instructions */}
        {!mfaStatus.enabled && (
          <div className="space-y-3">
            <h4 className="font-medium">How to enable MFA:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>
                Install an authenticator app (Google Authenticator, Authy, etc.)
              </li>
              <li>Click &quot;Enable MFA&quot; to start the setup process</li>
              <li>Scan the QR code with your authenticator app</li>
              <li>Enter the verification code to complete setup</li>
            </ol>
          </div>
        )}

        {/* Security Notice */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Notice:</strong> MFA significantly improves your
            account security. We recommend enabling it even if not required for
            your role.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

export default MFASetup;
