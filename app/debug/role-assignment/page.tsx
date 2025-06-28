"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  User, 
  Database, 
  Key, 
  Settings,
  Copy,
  ExternalLink
} from "lucide-react";

interface DebugData {
  timestamp: string;
  authentication: any;
  jwtAnalysis: any;
  roleAnalysis: any;
  databaseAnalysis: any;
  metadataAnalysis: any;
  diagnostics: {
    issues: string[];
    recommendations: string[];
    nextSteps: string[];
  };
  rawData: any;
}

export default function RoleAssignmentDebugPage() {
  const [debugData, setDebugData] = useState<DebugData | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const fetchDebugData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/debug/role-assignment");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDebugData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch debug data");
    } finally {
      setLoading(false);
    }
  };

  const triggerSync = async () => {
    setSyncing(true);
    setError(null);
    
    try {
      const response = await fetch("/api/debug/role-assignment", {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`);
      }
      
      const result = await response.json();
      setDebugData(result.updatedDiagnostics);
      
      // Show success message
      alert("User sync completed! Check the updated diagnostics.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchDebugData();
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access the role assignment debugger.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Role Assignment Debugger</h1>
          <p className="text-gray-600">
            Comprehensive debugging tool for user role assignment issues. 
            This page helps diagnose why users might be getting &quot;viewer&quot; role instead of their proper roles.
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <Button 
            onClick={fetchDebugData} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Debug Data
          </Button>
          
          <Button 
            onClick={triggerSync} 
            disabled={syncing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Trigger User Sync'}
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <XCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {debugData && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="authentication">Auth</TabsTrigger>
              <TabsTrigger value="jwt">JWT</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="raw">Raw Data</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Current Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Authentication:</span>
                        <Badge variant={debugData.authentication.isAuthenticated ? "default" : "destructive"}>
                          {debugData.authentication.isAuthenticated ? "Authenticated" : "Not Authenticated"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Current Role:</span>
                        <Badge variant={debugData.roleAnalysis.finalRole === "viewer" ? "secondary" : "default"}>
                          {debugData.roleAnalysis.finalRole}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Role Consistent:</span>
                        <Badge variant={debugData.roleAnalysis.consistency.isConsistent ? "default" : "destructive"}>
                          {debugData.roleAnalysis.consistency.isConsistent ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Can Access App:</span>
                        <Badge variant={debugData.roleAnalysis.consistency.canAccessConsultantRoutes ? "default" : "destructive"}>
                          {debugData.roleAnalysis.consistency.canAccessConsultantRoutes ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Issues & Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Issues & Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {debugData.diagnostics.issues.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-red-600 mb-2">Issues Found:</h4>
                          <ul className="space-y-1">
                            {debugData.diagnostics.issues.map((issue, index) => (
                              <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                                <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {debugData.diagnostics.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-blue-600 mb-2">Recommendations:</h4>
                          <ul className="space-y-1">
                            {debugData.diagnostics.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Next Steps */}
{debugData.diagnostics.nextSteps.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                    <CardDescription>Follow these steps to resolve the role assignment issues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2">
                      {debugData.diagnostics.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </span>
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="authentication">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Clerk Authentication</h4>
                      <div className="space-y-2 text-sm">
                        <div>Authenticated: {debugData.authentication.isAuthenticated ? "✅" : "❌"}</div>
                        <div>User ID: {debugData.authentication.clerkUserId}</div>
                        <div>Session ID: {debugData.authentication.sessionId}</div>
                        <div>Email: {debugData.authentication.userEmail}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Current User Data</h4>
                      <div className="space-y-2 text-sm">
                        <div>Email: {user?.emailAddresses?.[0]?.emailAddress}</div>
                        <div>Name: {user?.fullName || "Not set"}</div>
                        <div>Public Metadata: {user?.publicMetadata ? "Present" : "Missing"}</div>
                        <div>Database ID: {(user?.publicMetadata as any)?.databaseId || "Not set"}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jwt">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    JWT Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className={`text-2xl mb-2 ${debugData.jwtAnalysis.hasSessionClaims ? 'text-green-600' : 'text-red-600'}`}>
                          {debugData.jwtAnalysis.hasSessionClaims ? '✅' : '❌'}
                        </div>
                        <div className="text-sm font-medium">Session Claims</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl mb-2 ${debugData.jwtAnalysis.hasHasuraClaims ? 'text-green-600' : 'text-red-600'}`}>
                          {debugData.jwtAnalysis.hasHasuraClaims ? '✅' : '❌'}
                        </div>
                        <div className="text-sm font-medium">Hasura Claims</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl mb-2 ${debugData.jwtAnalysis.hasToken ? 'text-green-600' : 'text-red-600'}`}>
                          {debugData.jwtAnalysis.hasToken ? '✅' : '❌'}
                        </div>
                        <div className="text-sm font-medium">JWT Token</div>
                      </div>
                    </div>

                    {debugData.jwtAnalysis.tokenError && (
                      <Alert className="border-red-200 bg-red-50">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <AlertDescription className="text-red-700">
                          Token Error: {debugData.jwtAnalysis.tokenError}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div>
                      <h4 className="font-semibold mb-2">Claims Structure</h4>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <div>Claims Keys: {debugData.jwtAnalysis.claimsStructure.claimsKeys.join(", ")}</div>
                        <div>Hasura Claims Keys: {debugData.jwtAnalysis.claimsStructure.hasuraClaimsKeys.join(", ")}</div>
                        <div>Has Claims at Key: {debugData.jwtAnalysis.claimsStructure.hasClaimsAtKey ? "✅" : "❌"}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roles">
              <Card>
                <CardHeader>
                  <CardTitle>Role Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Role Extraction Sources</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(debugData.roleAnalysis.extraction).map(([source, value]) => (
                          <div key={source} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium">{source}:</span>
                            <Badge variant={value ? "default" : "secondary"}>
                              {String(value || "Not set")}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Final Role: {debugData.roleAnalysis.finalRole}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium mb-2">Permissions</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Consultant Access:</span>
                              <Badge variant={debugData.roleAnalysis.consistency.canAccessConsultantRoutes ? "default" : "destructive"}>
                                {debugData.roleAnalysis.consistency.canAccessConsultantRoutes ? "Yes" : "No"}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Manager Access:</span>
                              <Badge variant={debugData.roleAnalysis.consistency.canAccessManagerRoutes ? "default" : "destructive"}>
                                {debugData.roleAnalysis.consistency.canAccessManagerRoutes ? "Yes" : "No"}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Admin Access:</span>
                              <Badge variant={debugData.roleAnalysis.consistency.canAccessAdminRoutes ? "default" : "destructive"}>
                                {debugData.roleAnalysis.consistency.canAccessAdminRoutes ? "Yes" : "No"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Middleware Simulation</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Would Redirect:</span>
                              <Badge variant={debugData.roleAnalysis.middlewareSimulation.wouldRedirect ? "destructive" : "default"}>
                                {debugData.roleAnalysis.middlewareSimulation.wouldRedirect ? "Yes" : "No"}
                              </Badge>
                            </div>
                            {debugData.roleAnalysis.middlewareSimulation.wouldRedirect && (
                              <div className="text-xs text-gray-600 break-all">
                                Redirect URL: {debugData.roleAnalysis.middlewareSimulation.redirectUrl}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="database">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Database Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span>Database User Found:</span>
                      <Badge variant={debugData.databaseAnalysis.hasUser ? "default" : "destructive"}>
                        {debugData.databaseAnalysis.hasUser ? "Yes" : "No"}
                      </Badge>
                    </div>

                    {debugData.databaseAnalysis.user && (
                      <div>
                        <h4 className="font-semibold mb-2">Database User Details</h4>
                        <div className="bg-gray-50 p-3 rounded space-y-1 text-sm">
                          <div>ID: {debugData.databaseAnalysis.user.id}</div>
                          <div>Email: {debugData.databaseAnalysis.user.email}</div>
                          <div>Name: {debugData.databaseAnalysis.user.firstName} {debugData.databaseAnalysis.user.lastName}</div>
                          <div>Role: <Badge>{debugData.databaseAnalysis.user.role}</Badge></div>
                          <div>Active: {debugData.databaseAnalysis.user.isActive ? "✅" : "❌"}</div>
                          <div>Created: {new Date(debugData.databaseAnalysis.user.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    )}

                    {debugData.databaseAnalysis.error && (
                      <Alert className="border-red-200 bg-red-50">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <AlertDescription className="text-red-700">
                          Database Error: {debugData.databaseAnalysis.error}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="raw">
              <Card>
                <CardHeader>
                  <CardTitle>Raw Debug Data</CardTitle>
                  <CardDescription>
                    Raw data for advanced debugging. Click to copy sections to clipboard.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(debugData.rawData).map(([key, value]) => (
                      <div key={key} className="border rounded">
                        <div className="bg-gray-50 px-3 py-2 border-b flex justify-between items-center">
                          <span className="font-medium">{key}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(JSON.stringify(value, null, 2))}
                            className="flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            Copy
                          </Button>
                        </div>
                        <div className="p-3">
                          <pre className="text-xs overflow-auto max-h-40 bg-gray-100 p-2 rounded">
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common debugging and troubleshooting actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => window.open("/api/debug-user-role", "_blank")}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Check User Role API
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open("/api/check-role", "_blank")}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Check Role API
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open("/api/auth/debug-token", "_blank")}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Debug Token API
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}