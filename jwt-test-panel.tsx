// components/jwt-test-panel.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface JWTTestResult {
  test: {
    clerkUserId: string;
    userEmail: string;
    userName: string;
    timestamp: string;
  };
  clerkMetadata: {
    publicMetadata: any;
    privateMetadata: any;
    hasDatabaseId: boolean;
    hasRole: boolean;
    metadataKeys: string[];
  };
  databaseUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    clerkId: string;
  } | null;
  databaseError: string | null;
  jwt: {
    hasToken: boolean;
    tokenPreview: string | null;
    analysis: any;
    hasuraClaims: any;
    fullPayload: any;
  };
  systemAnalysis: {
    userExistsInClerk: boolean;
    userExistsInDatabase: boolean;
    jwtTemplateWorking: boolean;
    hasuraClaimsPresent: boolean;
    userIdMappingCorrect: boolean;
    metadataSyncComplete: boolean;
    expectedToWork: boolean;
  };
  issues: string[];
  recommendations: string[];
  verdict: string;
}

export function JWTTestPanel() {
  const { isLoaded, userId } = useAuth();
  const [testResult, setTestResult] = useState<JWTTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runJWTTest = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch("/api/debug/jwt-test");
      const data = await response.json();
      
      if (response.ok) {
        setTestResult(data);
        if (data.systemAnalysis.expectedToWork) {
          toast.success("JWT Test Complete", {
            description: "System is configured correctly!",
          });
        } else {
          toast.warning("Issues Found", {
            description: `${data.issues.length} issue(s) detected`,
          });
        }
      } else {
        setError(data.error || "Test failed");
        toast.error("Test Failed", {
          description: data.error || "Unknown error",
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Network error";
      setError(errorMsg);
      toast.error("Test Failed", {
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const syncUser = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch("/api/sync-current-user", {
        method: "POST",
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("User Synced", {
          description: "User synchronized successfully!",
        });
        // Re-run test after sync
        setTimeout(runJWTTest, 1000);
      } else {
        toast.error("Sync Failed", {
          description: data.error || "Unknown error",
        });
      }
    } catch (err) {
      toast.error("Sync Failed", {
        description: err instanceof Error ? err.message : "Network error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (success: boolean, label: string) => {
    return (
      <Badge variant={success ? "default" : "destructive"} className="flex items-center gap-1">
        {getStatusIcon(success)}
        {label}
      </Badge>
    );
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            JWT Test Panel
          </CardTitle>
          <CardDescription>Please sign in to test JWT configuration</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
            JWT Test Panel
          </CardTitle>
          <CardDescription>
            Test your Clerk + Hasura JWT configuration and user sync
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={runJWTTest} disabled={isLoading}>
              {isLoading ? "Testing..." : "Run JWT Test"}
            </Button>
            <Button onClick={syncUser} variant="outline" disabled={isLoading}>
              Sync User
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">Error:</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {testResult && (
        <>
          {/* System Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {testResult.systemAnalysis.expectedToWork ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border">
                <p className="font-medium mb-2">{testResult.verdict}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {getStatusBadge(testResult.systemAnalysis.userExistsInClerk, "Clerk User")}
                  {getStatusBadge(testResult.systemAnalysis.userExistsInDatabase, "Database User")}
                  {getStatusBadge(testResult.systemAnalysis.jwtTemplateWorking, "JWT Template")}
                  {getStatusBadge(testResult.systemAnalysis.hasuraClaimsPresent, "Hasura Claims")}
                  {getStatusBadge(testResult.systemAnalysis.userIdMappingCorrect, "ID Mapping")}
                  {getStatusBadge(testResult.systemAnalysis.metadataSyncComplete, "Metadata Sync")}
                </div>
              </div>

              {testResult.issues.length > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="font-medium text-yellow-800 mb-2">Issues Found:</p>
                  <ul className="text-yellow-700 space-y-1">
                    {testResult.issues.map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {testResult.recommendations.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-medium text-blue-800 mb-2">Recommendations:</p>
                  <ul className="text-blue-700 space-y-1">
                    {testResult.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* JWT Token Details */}
          <Card>
            <CardHeader>
              <CardTitle>JWT Token Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium mb-2">Token Info:</p>
                  <div className="text-sm space-y-1">
                    <p>Has Token: {testResult.jwt.hasToken ? "✅ Yes" : "❌ No"}</p>
                    <p>Has Claims: {testResult.jwt.analysis.hasHasuraClaims ? "✅ Yes" : "❌ No"}</p>
                    <p>User ID Type: {testResult.jwt.analysis.userIdType || "N/A"}</p>
                    <p>Role: {testResult.jwt.analysis.roleValue || "N/A"}</p>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium mb-2">Hasura Claims:</p>
                  <div className="text-sm bg-gray-50 p-2 rounded font-mono">
                    {testResult.jwt.hasuraClaims ? (
                      <pre>{JSON.stringify(testResult.jwt.hasuraClaims, null, 2)}</pre>
                    ) : (
                      "No Hasura claims found"
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Data Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>User Data Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium mb-2">Clerk User:</p>
                  <div className="text-sm space-y-1">
                    <p>ID: {testResult.test.clerkUserId}</p>
                    <p>Email: {testResult.test.userEmail}</p>
                    <p>Name: {testResult.test.userName}</p>
                    <p>Has DB ID: {testResult.clerkMetadata.hasDatabaseId ? "✅" : "❌"}</p>
                    <p>Has Role: {testResult.clerkMetadata.hasRole ? "✅" : "❌"}</p>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium mb-2">Database User:</p>
                  {testResult.databaseUser ? (
                    <div className="text-sm space-y-1">
                      <p>ID: {testResult.databaseUser.id}</p>
                      <p>Email: {testResult.databaseUser.email}</p>
                      <p>Name: {testResult.databaseUser.name}</p>
                      <p>Role: {testResult.databaseUser.role}</p>
                      <p>Clerk ID: {testResult.databaseUser.clerkId}</p>
                    </div>
                  ) : (
                    <p className="text-red-600">User not found in database</p>
                  )}
                  {testResult.databaseError && (
                    <p className="text-red-600 text-sm mt-2">Error: {testResult.databaseError}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}