// app/(dashboard)/developer/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Copy, Eye, EyeOff, RefreshCw, User, Shield } from "lucide-react";
import { useEnhancedPermissions } from "@/hooks/useEnhancedPermissions";
import { EnhancedPermissionGuard } from "@/components/auth/EnhancedPermissionGuard";
import { Switch } from "@/components/ui/switch";

const features = [
  {
    id: "tax-calculator",
    name: "Tax Calculator",
    description: "Enable the Australian tax calculator feature",
  },
  {
    id: "multi-currency",
    name: "Multi-Currency Support",
    description: "Allow handling multiple currencies in payrolls",
  },
  {
    id: "advanced-reports",
    name: "Advanced Reporting",
    description: "Enable advanced payroll reporting features",
  },
  {
    id: "employee-portal",
    name: "Employee Self-Service Portal",
    description:
      "Provide a portal for employees to access their payroll information",
  },
];

interface TokenData {
  token: string;
  decoded: any;
  userId: string;
  hasuraClaims: {
    "x-hasura-user-id": string;
    "x-hasura-default-role": string;
    "x-hasura-allowed-roles": string[];
  } | null;
}

interface OAuthStatus {
  userId: string;
  currentRole: string;
  hasuraRole: string;
  isOAuth: boolean;
  provider: string | null;
  needsFix: boolean;
}

function DeveloperPageContent() {
  const { canAccessDeveloperTools } = useEnhancedPermissions();

  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([]);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [oauthStatus, setOAuthStatus] = useState<OAuthStatus | null>(null);
  const [showFullToken, setShowFullToken] = useState(false);
  const [loadingToken, setLoadingToken] = useState(false);
  const [loadingOAuth, setLoadingOAuth] = useState(false);
  const [fixingOAuth, setFixingOAuth] = useState(false);
  const [testUserId, setTestUserId] = useState(
    "user_2uCU9pKf7RP2FiORHJVM5IH0Pd1"
  );

  // Define functions that will be used in useEffect
  const fetchToken = async () => {
    setLoadingToken(true);
    try {
      const response = await fetch("/api/auth/token");
      const data = await response.json();
      setTokenData(data);
    } catch (error) {
      console.error("Error fetching token:", error);
      alert("Error fetching token");
    } finally {
      setLoadingToken(false);
    }
  };

  const checkOAuthStatus = async () => {
    setLoadingOAuth(true);
    try {
      const response = await fetch("/api/fix-oauth-user");
      const data = await response.json();
      setOAuthStatus(data);
    } catch (error) {
      console.error("Error checking OAuth status:", error);
      alert("Error checking OAuth status");
    } finally {
      setLoadingOAuth(false);
    }
  };

  useEffect(() => {
    // This effect only runs when the component is rendered, which is handled by the guard.
    if (canAccessDeveloperTools) {
      fetchToken();
      checkOAuthStatus();
    }
  }, [canAccessDeveloperTools]);

  const toggleFeature = (feature: string) => {
    setEnabledFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSave = () => {
    // Here you would typically save the enabled features to your backend
    console.log("Enabled features:", enabledFeatures);
    alert("Feature toggles saved!");
  };

  const fixOAuthUser = async () => {
    setFixingOAuth(true);
    try {
      const response = await fetch("/api/fix-oauth-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.success) {
        alert(
          `✅ ${data.message}\n\nNext steps:\n${data.instructions.join("\n")}`
        );
        // Refresh the status
        await checkOAuthStatus();
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error fixing OAuth user:", error);
      alert("Error fixing OAuth user");
    } finally {
      setFixingOAuth(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Developer Tools</h1>
        <p className="text-muted-foreground mt-2">
          Development tools and debugging utilities for testing the application.
        </p>
      </div>

      {/* OAuth User Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            OAuth User Status
          </CardTitle>
          <CardDescription>
            Check and fix OAuth user authentication and role issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={checkOAuthStatus}
              disabled={loadingOAuth}
              variant="outline"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loadingOAuth ? "animate-spin" : ""}`}
              />
              Check Status
            </Button>

            {oauthStatus?.needsFix && (
              <Button
                onClick={fixOAuthUser}
                disabled={fixingOAuth}
                variant="default"
              >
                <Shield
                  className={`h-4 w-4 mr-2 ${
                    fixingOAuth ? "animate-spin" : ""
                  }`}
                />
                Fix OAuth User
              </Button>
            )}
          </div>

          {oauthStatus && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <strong>OAuth User:</strong>{" "}
                <Badge variant={oauthStatus.isOAuth ? "default" : "secondary"}>
                  {oauthStatus.isOAuth ? `Yes (${oauthStatus.provider})` : "No"}
                </Badge>
              </div>
              <div>
                <strong>Current Role:</strong>{" "}
                <Badge
                  variant={
                    oauthStatus.currentRole === "developer"
                      ? "default"
                      : "destructive"
                  }
                >
                  {oauthStatus.currentRole}
                </Badge>
              </div>
              <div>
                <strong>Hasura Role:</strong>{" "}
                <Badge
                  variant={
                    oauthStatus.hasuraRole === "developer"
                      ? "default"
                      : "destructive"
                  }
                >
                  {oauthStatus.hasuraRole}
                </Badge>
              </div>
              <div>
                <strong>Needs Fix:</strong>{" "}
                <Badge
                  variant={oauthStatus.needsFix ? "destructive" : "default"}
                >
                  {oauthStatus.needsFix ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          )}

          {/* Test specific user lookup */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium mb-2">Test User Lookup</h4>
            <div className="space-y-3">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label htmlFor="test-user-id" className="text-sm font-medium">
                    Clerk User ID to Test
                  </Label>
                  <Input
                    id="test-user-id"
                    value={testUserId}
                    onChange={(e) => setTestUserId(e.target.value)}
                    placeholder="Enter Clerk user ID (e.g., user_2...)"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (!testUserId.trim()) {
                      alert("Please enter a user ID");
                      return;
                    }
                    fetch(`/api/user/${testUserId}`)
                      .then((res) => res.json())
                      .then((data) => {
                        console.log("User lookup result:", data);
                        alert(JSON.stringify(data, null, 2));
                      })
                      .catch((err) => {
                        console.error("Error:", err);
                        alert("Error: " + err.message);
                      });
                  }}
                  variant="outline"
                  size="sm"
                  disabled={!testUserId.trim()}
                >
                  Lookup User
                </Button>

                <Button
                  onClick={() => {
                    if (!testUserId.trim()) {
                      alert("Please enter a user ID");
                      return;
                    }
                    // Call the fix endpoint for this specific user
                    fetch("/api/fix-oauth-user", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ targetUserId: testUserId }),
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        console.log("Fix result:", data);
                        if (data.success) {
                          alert(
                            `✅ Fixed user role: ${data.user.displayName} (${data.user.role})`
                          );
                        } else {
                          alert(`❌ Error: ${data.error}`);
                        }
                      })
                      .catch((err) => {
                        console.error("Error:", err);
                        alert("Error: " + err.message);
                      });
                  }}
                  variant="default"
                  size="sm"
                  disabled={!testUserId.trim()}
                >
                  Fix This User's Role
                </Button>
              </div>
            </div>
          </div>

          {/* Staff Role Sync Information */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium mb-2">Staff Role Sync</h4>
            <p className="text-sm text-gray-600 mb-3">
              When staff roles are updated through the staff management page,
              both the database and Clerk metadata are automatically
              synchronized.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  fetch("/api/staff/update-role", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      staffId: "test-id",
                      newRole: "developer",
                    }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      console.log("Staff sync test result:", data);
                      alert("Check console for staff sync test results");
                    })
                    .catch((err) => {
                      console.error("Error:", err);
                      alert("Error testing staff sync (expected with test ID)");
                    });
                }}
                variant="outline"
                size="sm"
              >
                Test Staff Sync API
              </Button>
            </div>
          </div>

          {/* Staff CRUD Operations */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium mb-2">Staff CRUD Operations</h4>
            <p className="text-sm text-gray-600 mb-3">
              Test the staff create and delete endpoints that maintain
              synchronization with Clerk.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => {
                  // Test staff creation
                  fetch("/api/staff/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: "Test User",
                      email: "test@example.com",
                      role: "consultant",
                      inviteToClerk: false, // Don't actually create in Clerk for test
                    }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      console.log("Staff creation test result:", data);
                      alert(
                        `Staff creation test: ${
                          data.success ? "Success" : "Error: " + data.error
                        }`
                      );
                    })
                    .catch((err) => {
                      console.error("Error:", err);
                      alert(
                        "Error testing staff creation (expected with test data)"
                      );
                    });
                }}
                variant="outline"
                size="sm"
              >
                Test Staff Create API
              </Button>

              <Button
                onClick={() => {
                  // Test staff deletion preview
                  fetch("/api/staff/delete?staffId=test-id")
                    .then((res) => res.json())
                    .then((data) => {
                      console.log("Staff deletion preview:", data);
                      alert(
                        "Check console for deletion preview (expected error with test ID)"
                      );
                    })
                    .catch((err) => {
                      console.error("Error:", err);
                      alert(
                        "Error testing deletion preview (expected with test ID)"
                      );
                    });
                }}
                variant="outline"
                size="sm"
              >
                Test Delete Preview
              </Button>

              <Button
                onClick={() => {
                  // Test staff deletion
                  fetch("/api/staff/delete", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      staffId: "test-id",
                    }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      console.log("Staff deletion test result:", data);
                      alert(
                        "Check console for deletion test results (expected error with test ID)"
                      );
                    })
                    .catch((err) => {
                      console.error("Error:", err);
                      alert(
                        "Error testing staff deletion (expected with test ID)"
                      );
                    });
                }}
                variant="outline"
                size="sm"
              >
                Test Staff Delete API
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* JWT Token Debug */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            JWT Token Debug
          </CardTitle>
          <CardDescription>
            Inspect your current authentication token and Hasura claims
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={fetchToken}
              disabled={loadingToken}
              variant="outline"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loadingToken ? "animate-spin" : ""}`}
              />
              Refresh Token
            </Button>

            {tokenData && (
              <Button
                onClick={() => setShowFullToken(!showFullToken)}
                variant="outline"
              >
                {showFullToken ? (
                  <EyeOff className="h-4 w-4 mr-2" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                {showFullToken ? "Hide" : "Show"} Full Token
              </Button>
            )}
          </div>

          {tokenData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>User ID:</strong>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted p-1 rounded text-sm">
                      {tokenData.userId}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(tokenData.userId)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <strong>Hasura Claims:</strong>
                  <Badge
                    variant={tokenData.hasuraClaims ? "default" : "destructive"}
                  >
                    {tokenData.hasuraClaims ? "Present" : "Missing"}
                  </Badge>
                </div>
              </div>

              {tokenData.hasuraClaims && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Hasura Claims:</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <strong>User ID:</strong>{" "}
                      {tokenData.hasuraClaims["x-hasura-user-id"]}
                    </div>
                    <div>
                      <strong>Default Role:</strong>{" "}
                      {tokenData.hasuraClaims["x-hasura-default-role"]}
                    </div>
                    <div>
                      <strong>Allowed Roles:</strong>{" "}
                      {tokenData.hasuraClaims["x-hasura-allowed-roles"].join(
                        ", "
                      )}
                    </div>
                  </div>
                </div>
              )}

              {showFullToken && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <strong>Decoded Token:</strong>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(
                          JSON.stringify(tokenData.decoded, null, 2)
                        )
                      }
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-96">
                    {JSON.stringify(tokenData.decoded, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Database Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Database Management
          </CardTitle>
          <CardDescription>
            Tools for managing payroll data, versions, and dates. Use with
            caution in production.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Reset Operations */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              Reset Operations
            </h4>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="destructive"
                size="sm"
                onClick={async () => {
                  if (
                    confirm(
                      "⚠️ This will reset ALL payrolls and clients to their original state. Continue?"
                    )
                  ) {
                    try {
                      const response = await fetch(
                        "/api/developer/reset-to-original",
                        {
                          method: "POST",
                        }
                      );
                      const result = await response.json();
                      if (result.success) {
                        alert(
                          `✅ ${result.message}\n\nDeleted: ${result.deletedVersions} versions\nReset: ${result.resetPayrolls} payrolls`
                        );
                      } else {
                        alert(`❌ Error: ${result.error}`);
                      }
                    } catch (error: any) {
                      alert(`❌ Error: ${error.message}`);
                    }
                  }
                }}
              >
                Reset to Original State
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={async () => {
                  if (
                    confirm(
                      "⚠️ This will DELETE ALL payroll dates and versions. Continue?"
                    )
                  ) {
                    try {
                      const response = await fetch(
                        "/api/developer/clean-all-dates",
                        {
                          method: "POST",
                        }
                      );
                      const result = await response.json();
                      if (result.success) {
                        alert(
                          `✅ ${result.message}\n\nDeleted: ${result.deletedDates} dates, ${result.deletedVersions} versions\nReset: ${result.resetPayrolls} payrolls`
                        );
                      } else {
                        alert(`❌ Error: ${result.error}`);
                      }
                    } catch (error: any) {
                      alert(`❌ Error: ${error.message}`);
                    }
                  }
                }}
              >
                Clean All Dates & Versions
              </Button>
            </div>
          </div>

          <Separator />

          {/* Single Payroll Operations */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              Single Payroll Operations
            </h4>
            <div className="flex gap-2 items-end flex-wrap">
              <div className="space-y-1">
                <Label htmlFor="single-payroll-id" className="text-xs">
                  Payroll ID
                </Label>
                <Input
                  id="single-payroll-id"
                  placeholder="Enter payroll UUID"
                  className="w-80 text-xs"
                  value={testUserId.replace("user_", "")} // Reuse the test input for now
                  onChange={(e) => setTestUserId("user_" + e.target.value)}
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const payrollId = testUserId.replace("user_", "");
                  if (!payrollId || payrollId.length < 10) {
                    alert("Please enter a valid payroll UUID");
                    return;
                  }

                  if (
                    confirm(
                      `⚠️ This will clean dates and versions for payroll: ${payrollId}. Continue?`
                    )
                  ) {
                    try {
                      const response = await fetch(
                        "/api/developer/clean-single-payroll",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ payrollId }),
                        }
                      );
                      const result = await response.json();
                      if (result.success) {
                        alert(
                          `✅ ${result.message}\n\nDeleted: ${result.deletedDates} dates, ${result.deletedVersions} versions`
                        );
                      } else {
                        alert(`❌ Error: ${result.error}`);
                      }
                    } catch (error: any) {
                      alert(`❌ Error: ${error.message}`);
                    }
                  }
                }}
              >
                Clean Single Payroll
              </Button>
            </div>
          </div>

          <Separator />

          {/* Date Regeneration */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              Date Regeneration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* All Payrolls */}
              <div className="space-y-3 p-4 border rounded-lg">
                <h5 className="font-medium text-sm">All Payrolls</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="start-date-all" className="text-xs">
                      Start Date
                    </Label>
                    <Input
                      id="start-date-all"
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="end-date-all" className="text-xs">
                      End Date
                    </Label>
                    <Input
                      id="end-date-all"
                      type="date"
                      defaultValue={
                        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 2)
                          .toISOString()
                          .split("T")[0]
                      }
                      className="text-xs"
                    />
                  </div>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={async () => {
                    const startDate = (
                      document.getElementById(
                        "start-date-all"
                      ) as HTMLInputElement
                    )?.value;
                    const endDate = (
                      document.getElementById(
                        "end-date-all"
                      ) as HTMLInputElement
                    )?.value;

                    if (!startDate || !endDate) {
                      alert("Please select both start and end dates");
                      return;
                    }

                    if (
                      confirm(
                        `🔄 This will regenerate dates for ALL payrolls from ${startDate} to ${endDate}. Continue?`
                      )
                    ) {
                      try {
                        const response = await fetch(
                          "/api/developer/regenerate-all-dates",
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ startDate, endDate }),
                          }
                        );
                        const result = await response.json();
                        if (result.success) {
                          alert(
                            `✅ ${result.message}\n\nProcessed: ${result.successCount}/${result.totalPayrolls} payrolls\nGenerated: ${result.totalGenerated} dates`
                          );
                        } else {
                          alert(`❌ Error: ${result.error}`);
                        }
                      } catch (error: any) {
                        alert(`❌ Error: ${error.message}`);
                      }
                    }
                  }}
                >
                  Regenerate All Dates
                </Button>
              </div>

              {/* Single Payroll */}
              <div className="space-y-3 p-4 border rounded-lg">
                <h5 className="font-medium text-sm">Single Payroll</h5>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="single-payroll-regen" className="text-xs">
                      Payroll ID
                    </Label>
                    <Input
                      id="single-payroll-regen"
                      placeholder="Enter payroll UUID"
                      className="text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="start-date-single" className="text-xs">
                        Start Date
                      </Label>
                      <Input
                        id="start-date-single"
                        type="date"
                        defaultValue={new Date().toISOString().split("T")[0]}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="end-date-single" className="text-xs">
                        End Date
                      </Label>
                      <Input
                        id="end-date-single"
                        type="date"
                        defaultValue={
                          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 2)
                            .toISOString()
                            .split("T")[0]
                        }
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={async () => {
                    const payrollId = (
                      document.getElementById(
                        "single-payroll-regen"
                      ) as HTMLInputElement
                    )?.value;
                    const startDate = (
                      document.getElementById(
                        "start-date-single"
                      ) as HTMLInputElement
                    )?.value;
                    const endDate = (
                      document.getElementById(
                        "end-date-single"
                      ) as HTMLInputElement
                    )?.value;

                    if (!payrollId || !startDate || !endDate) {
                      alert("Please fill in all fields");
                      return;
                    }

                    if (
                      confirm(
                        `🔄 This will regenerate dates for payroll ${payrollId} from ${startDate} to ${endDate}. Continue?`
                      )
                    ) {
                      try {
                        const response = await fetch(
                          "/api/developer/regenerate-single-dates",
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              payrollId,
                              startDate,
                              endDate,
                            }),
                          }
                        );
                        const result = await response.json();
                        if (result.success) {
                          alert(
                            `✅ ${result.message}\n\nDeleted: ${result.deletedDates} old dates\nGenerated: ${result.generatedCount} new dates`
                          );
                        } else {
                          alert(`❌ Error: ${result.error}`);
                        }
                      } catch (error: any) {
                        alert(`❌ Error: ${error.message}`);
                      }
                    }
                  }}
                >
                  Regenerate Single Dates
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Payroll Scheduler */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Advanced Payroll Scheduler (Beta)</CardTitle>
          <CardDescription>
            Test the enhanced drag-and-drop scheduling interface with consultant
            summaries and advanced features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdvancedPayrollScheduler />
        </CardContent>
      </Card> */}

      {/* Fixed Payroll Scheduler */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Fixed Payroll Scheduler</CardTitle>
          <CardDescription>
            Test the fixed payroll scheduling interface with consultant
            summaries and advanced features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FixedPayrollScheduler />
        </CardContent>
      </Card> */}
      {/* Fixed Payroll Scheduler */}
      {/* <Card>
        <CardHeader>
          <CardTitle>V3 Fixed Payroll Scheduler</CardTitle>
          <CardDescription>
            Test the fixed payroll scheduling interface with consultant
            summaries and advanced features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FixedPayrollSchedulerV3 />
        </CardContent>
      </Card> */}

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Toggles</CardTitle>
          <CardDescription>
            Enable or disable experimental features for testing purposes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center justify-between space-x-2"
              >
                <div className="space-y-0.5">
                  <Label htmlFor={feature.id} className="text-base">
                    {feature.name}
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    {feature.description}
                  </div>
                </div>
                <Switch
                  id={feature.id}
                  checked={enabledFeatures.includes(feature.id)}
                  onCheckedChange={() => toggleFeature(feature.id)}
                />
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <div>
              <strong>Enabled Features:</strong>{" "}
              {enabledFeatures.length > 0 ? (
                enabledFeatures.map((featureId) => {
                  const feature = features.find((f) => f.id === featureId);
                  return (
                    <Badge key={featureId} variant="secondary" className="ml-1">
                      {feature?.name}
                    </Badge>
                  );
                })
              ) : (
                <span className="text-muted-foreground">None</span>
              )}
            </div>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DeveloperPage() {
  return (
    <EnhancedPermissionGuard.DeveloperGuard>
      <DeveloperPageContent />
    </EnhancedPermissionGuard.DeveloperGuard>
  );
}
