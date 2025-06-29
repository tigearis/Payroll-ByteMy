"use client";

import { useAuth } from "@clerk/nextjs";
import { decodeJWTToken } from "@/lib/auth/client-token-utils";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Code2, 
  Bug, 
  Loader2,
  Copy,
  RotateCcw,
  Shield,
  Database,
  Mail,
  User,
  Key,
  FileText,
  Activity
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserRole } from "@/hooks/use-user-role";

interface TestResult {
  step: string;
  status: "pending" | "running" | "success" | "error";
  message: string;
  details?: any;
  logs?: string[];
  timestamp: string;
}

interface TestFormData {
  name: string;
  email: string;
  role: string;
  managerId: string;
  inviteToClerk: boolean;
}

export default function UserCreationDiagnosticsPage() {
  const { getToken, userId } = useAuth();
  const { userRole, hasPermission } = useUserRole();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [formData, setFormData] = useState<TestFormData>({
    name: "Test User",
    email: `test.user.${Date.now()}@example.com`,
    role: "viewer",
    managerId: "",
    inviteToClerk: false // Default to false for testing
  });

  // Check if user has developer access
  if (userRole !== "developer") {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            This page is only accessible to developers for debugging purposes.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const addResult = (result: Omit<TestResult, "timestamp">) => {
    setTestResults(prev => [...prev, { ...result, timestamp: new Date().toISOString() }]);
  };

  const updateLastResult = (updates: Partial<TestResult>) => {
    setTestResults(prev => {
      const newResults = [...prev];
      if (newResults.length > 0) {
        newResults[newResults.length - 1] = {
          ...newResults[newResults.length - 1],
          ...updates
        };
      }
      return newResults;
    });
  };

  const clearResults = () => {
    setTestResults([]);
    setCurrentStep("");
  };

  // Test Step 1: Environment Check
  const testEnvironment = async () => {
    setCurrentStep("environment");
    addResult({
      step: "Environment Check",
      status: "running",
      message: "Checking environment variables and configuration..."
    });

    try {
      const envCheck = {
        hasClerkPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
        hasGraphQLUrl: !!process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
        nodeEnv: process.env.NODE_ENV,
        currentUserId: userId,
        currentUserRole: userRole
      };

      updateLastResult({
        status: "success",
        message: "Environment configuration verified",
        details: envCheck,
        logs: [
          `✓ Clerk Publishable Key: ${envCheck.hasClerkPublishableKey ? "Present" : "Missing"}`,
          `✓ App URL: ${envCheck.hasAppUrl ? "Present" : "Missing"}`,
          `✓ GraphQL URL: ${envCheck.hasGraphQLUrl ? "Present" : "Missing"}`,
          `✓ Environment: ${envCheck.nodeEnv}`,
          `✓ Current User ID: ${envCheck.currentUserId}`,
          `✓ Current Role: ${envCheck.currentUserRole}`
        ]
      });
    } catch (error: any) {
      updateLastResult({
        status: "error",
        message: "Environment check failed",
        details: { error: error.message }
      });
    }
  };

  // Test Step 2: JWT Token Generation
  const testJWTToken = async () => {
    setCurrentStep("jwt");
    addResult({
      step: "JWT Token Generation",
      status: "running",
      message: "Generating and validating JWT token..."
    });

    try {
      const token = await getToken({ template: "hasura" });
      
      if (!token) {
        throw new Error("Failed to generate JWT token");
      }

      // Use centralized JWT decoding utility
      const decodeResult = decodeJWTToken(token);
      
      // Extract expiry from token for detailed info
      let expiresAt = "Unknown";
      try {
        const parts = token.split('.');
        const payload = JSON.parse(atob(parts[1]));
        expiresAt = new Date(payload.exp * 1000).toISOString();
      } catch (e) {
        console.warn("Could not extract expiry from token");
      }

      updateLastResult({
        status: "success",
        message: "JWT token generated successfully",
        details: {
          tokenLength: token.length,
          hasuraClaims: decodeResult.claims,
          extractedRole: decodeResult.role,
          extractedUserId: decodeResult.userId,
          hasCompleteData: decodeResult.hasCompleteData,
          decodeError: decodeResult.error,
          expiresAt
        },
        logs: [
          `✓ Token generated: ${token.length} characters`,
          `✓ User ID: ${decodeResult.userId || "Not found"}`,
          `✓ Default Role: ${decodeResult.role || "Not found"}`,
          `✓ Allowed Roles: ${JSON.stringify(decodeResult.claims?.["x-hasura-allowed-roles"] || [])}`,
          `✓ Expires: ${expiresAt}`
        ]
      });

      return token;
    } catch (error: any) {
      updateLastResult({
        status: "error",
        message: "JWT token generation failed",
        details: { error: error.message }
      });
      throw error;
    }
  };

  // Test Step 3: API Route Connection
  const testAPIRoute = async (token: string) => {
    setCurrentStep("api");
    addResult({
      step: "API Route Test",
      status: "running",
      message: "Testing connection to /api/staff/create..."
    });

    try {
      // First test GET to ensure route is accessible
      const getResponse = await fetch("/api/staff/create", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const getData = await getResponse.json();

      if (!getResponse.ok) {
        throw new Error(`GET test failed: ${getResponse.status} ${getResponse.statusText}`);
      }

      updateLastResult({
        status: "success",
        message: "API route is accessible",
        details: {
          getStatus: getResponse.status,
          getResponse: getData,
          supportedMethods: getData.methods || ["GET", "POST"]
        },
        logs: [
          `✓ GET /api/staff/create: ${getResponse.status} ${getResponse.statusText}`,
          `✓ Response: ${JSON.stringify(getData)}`,
          `✓ Route is properly configured`
        ]
      });
    } catch (error: any) {
      updateLastResult({
        status: "error",
        message: "API route test failed",
        details: { error: error.message }
      });
      throw error;
    }
  };

  // Test Step 4: Role Authorization
  const testRoleAuthorization = async (token: string) => {
    setCurrentStep("auth");
    addResult({
      step: "Role Authorization",
      status: "running",
      message: "Testing role-based permissions..."
    });

    try {
      const response = await fetch("/api/staff/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          // Intentionally invalid to test auth without creating user
          test: true,
          skipValidation: true
        })
      });

      const data = await response.json();

      // We expect this to fail with validation error, not auth error
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Authorization failed: ${data.error || response.statusText}`);
      }

      updateLastResult({
        status: "success",
        message: "Authorization check passed",
        details: {
          status: response.status,
          response: data,
          currentRole: userRole,
          hasCreatePermission: hasPermission("staff:write")
        },
        logs: [
          `✓ POST request authorized`,
          `✓ Current role: ${userRole}`,
          `✓ Has staff:write permission: ${hasPermission("staff:write")}`,
          `✓ Response status: ${response.status}`
        ]
      });
    } catch (error: any) {
      updateLastResult({
        status: "error",
        message: "Authorization check failed",
        details: { error: error.message }
      });
      throw error;
    }
  };

  // Test Step 5: Input Validation
  const testInputValidation = async (token: string) => {
    setCurrentStep("validation");
    addResult({
      step: "Input Validation",
      status: "running",
      message: "Testing server-side validation..."
    });

    try {
      // Test with invalid data
      const invalidTests = [
        { 
          name: "empty", 
          data: {}, 
          expectedError: "Name is required" 
        },
        { 
          name: "invalid email", 
          data: { name: "Test", email: "invalid" }, 
          expectedError: "Invalid email" 
        },
        { 
          name: "invalid role", 
          data: { name: "Test", email: "test@example.com", role: "invalid" }, 
          expectedError: "Invalid role" 
        }
      ];

      const results = [];

      for (const test of invalidTests) {
        const response = await fetch("/api/staff/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(test.data)
        });

        const data = await response.json();
        results.push({
          test: test.name,
          status: response.status,
          error: data.error || data.details
        });
      }

      updateLastResult({
        status: "success",
        message: "Validation tests completed",
        details: { validationResults: results },
        logs: results.map(r => `✓ ${r.test}: ${r.status} - ${r.error}`)
      });
    } catch (error: any) {
      updateLastResult({
        status: "error",
        message: "Validation test failed",
        details: { error: error.message }
      });
    }
  };

  // Test Step 6: Database Connection
  const testDatabaseConnection = async (token: string) => {
    setCurrentStep("database");
    addResult({
      step: "Database Connection",
      status: "running",
      message: "Testing database connectivity via GraphQL..."
    });

    try {
      // Test GraphQL query
      const response = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            query TestConnection {
              users(limit: 1) {
                id
              }
            }
          `
        })
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL error: ${JSON.stringify(data.errors)}`);
      }

      updateLastResult({
        status: "success",
        message: "Database connection successful",
        details: {
          graphqlEndpoint: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
          response: data
        },
        logs: [
          `✓ GraphQL endpoint reachable`,
          `✓ Authentication successful`,
          `✓ Query executed successfully`
        ]
      });
    } catch (error: any) {
      updateLastResult({
        status: "error",
        message: "Database connection failed",
        details: { error: error.message }
      });
    }
  };

  // Test Step 7: Clerk API Connection
  const testClerkConnection = async (token: string) => {
    setCurrentStep("clerk");
    addResult({
      step: "Clerk API Test",
      status: "running",
      message: "Testing Clerk invitation system..."
    });

    try {
      // Test Clerk through our API
      const response = await fetch("/api/staff/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          testClerkOnly: true // Special flag for testing
        })
      });

      const data = await response.json();

      updateLastResult({
        status: response.ok ? "success" : "error",
        message: response.ok ? "Clerk API connection verified" : "Clerk API test failed",
        details: data,
        logs: [
          `✓ Clerk API endpoint tested`,
          `${response.ok ? '✓' : '✗'} Response: ${JSON.stringify(data)}`
        ]
      });
    } catch (error: any) {
      updateLastResult({
        status: "error",
        message: "Clerk connection test failed",
        details: { error: error.message }
      });
    }
  };

  // Test Step 8: Full User Creation
  const testFullCreation = async (token: string) => {
    setCurrentStep("full");
    addResult({
      step: "Full User Creation",
      status: "running",
      message: "Attempting complete user creation flow..."
    });

    try {
      const response = await fetch("/api/staff/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Request failed: ${response.status}`);
      }

      updateLastResult({
        status: "success",
        message: "User created successfully!",
        details: data,
        logs: [
          `✓ User created: ${data.user?.name}`,
          `✓ Email: ${data.user?.email}`,
          `✓ Role: ${data.user?.role}`,
          `✓ ID: ${data.user?.id}`,
          `✓ Invitation sent: ${data.user?.invitationSent}`
        ]
      });

      return data;
    } catch (error: any) {
      updateLastResult({
        status: "error",
        message: "User creation failed",
        details: { 
          error: error.message,
          response: error.response
        }
      });
      throw error;
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true);
    clearResults();

    try {
      // Step 1: Environment
      await testEnvironment();
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: JWT Token
      const token = await testJWTToken();
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: API Route
      await testAPIRoute(token);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 4: Authorization
      await testRoleAuthorization(token);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 5: Validation
      await testInputValidation(token);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 6: Database
      await testDatabaseConnection(token);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 7: Clerk
      if (formData.inviteToClerk) {
        await testClerkConnection(token);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Step 8: Full Creation
      await testFullCreation(token);

      toast.success("All tests completed!");
    } catch (error: any) {
      toast.error(`Test failed: ${error.message}`);
    } finally {
      setIsRunning(false);
      setCurrentStep("");
    }
  };

  // Copy results to clipboard
  const copyResults = () => {
    const resultsText = testResults.map(r => 
      `${r.step}: ${r.status}\n${r.message}\n${r.logs?.join('\n') || ''}\n---`
    ).join('\n\n');

    navigator.clipboard.writeText(resultsText);
    toast.success("Results copied to clipboard!");
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bug className="h-8 w-8 text-red-500" />
            User Creation Diagnostics
          </h1>
          <Badge variant="destructive" className="text-sm">
            Developer Only - Production Debug Mode
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Test each step of the user creation flow to identify issues
        </p>
      </div>

      {/* Current User Info */}
      <Alert className="mb-6">
        <Shield className="h-4 w-4" />
        <AlertTitle>Current Session</AlertTitle>
        <AlertDescription className="mt-2 space-y-1">
          <div>User ID: <code className="text-xs bg-muted px-1 py-0.5 rounded">{userId}</code></div>
          <div>Role: <code className="text-xs bg-muted px-1 py-0.5 rounded">{userRole}</code></div>
          <div>Environment: <code className="text-xs bg-muted px-1 py-0.5 rounded">{process.env.NODE_ENV}</code></div>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
            <CardDescription>Configure the user to create for testing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Test User"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="test@example.com"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  email: `test.user.${Date.now()}@example.com` 
                }))}
              >
                Generate Unique Email
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="consultant">Consultant</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerId">Manager ID (Optional)</Label>
              <Input
                id="managerId"
                value={formData.managerId}
                onChange={(e) => setFormData(prev => ({ ...prev, managerId: e.target.value }))}
                placeholder="UUID of manager (optional)"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="inviteToClerk"
                checked={formData.inviteToClerk}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, inviteToClerk: checked as boolean }))
                }
              />
              <Label htmlFor="inviteToClerk" className="cursor-pointer">
                Send Clerk invitation email
              </Label>
            </div>

            <div className="pt-4 space-y-2">
              <Button 
                onClick={runAllTests} 
                disabled={isRunning}
                className="w-full"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Activity className="mr-2 h-4 w-4" />
                    Run All Tests
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  onClick={clearResults}
                  disabled={isRunning}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Clear Results
                </Button>
                <Button 
                  variant="outline" 
                  onClick={copyResults}
                  disabled={testResults.length === 0}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Results
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              {testResults.length === 0 
                ? "Click 'Run All Tests' to begin diagnostics" 
                : `${testResults.filter(r => r.status === 'success').length}/${testResults.length} tests passed`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {testResults.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Code2 className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No test results yet</p>
                  </div>
                ) : (
                  testResults.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center gap-2">
                          {result.status === "pending" && <AlertCircle className="h-4 w-4 text-muted-foreground" />}
                          {result.status === "running" && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                          {result.status === "success" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          {result.status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
                          {result.step}
                        </h4>
                        <Badge 
                          variant={
                            result.status === "success" ? "default" :
                            result.status === "error" ? "destructive" :
                            result.status === "running" ? "secondary" :
                            "outline"
                          }
                        >
                          {result.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                      
                      {result.logs && result.logs.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {result.logs.map((log, i) => (
                            <div key={i} className="text-xs font-mono text-muted-foreground">
                              {log}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {result.details && (
                        <details className="mt-2">
                          <summary className="text-xs text-muted-foreground cursor-pointer">
                            View Details
                          </summary>
                          <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Individual Test Buttons */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Individual Tests</CardTitle>
          <CardDescription>Run specific tests to isolate issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={testEnvironment}
              disabled={isRunning}
            >
              <FileText className="mr-2 h-4 w-4" />
              Environment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await testJWTToken();
              }}
              disabled={isRunning}
            >
              <Key className="mr-2 h-4 w-4" />
              JWT Token
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const token = await getToken({ template: "hasura" });
                if (token) await testAPIRoute(token);
              }}
              disabled={isRunning}
            >
              <Activity className="mr-2 h-4 w-4" />
              API Route
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const token = await getToken({ template: "hasura" });
                if (token) await testRoleAuthorization(token);
              }}
              disabled={isRunning}
            >
              <Shield className="mr-2 h-4 w-4" />
              Authorization
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const token = await getToken({ template: "hasura" });
                if (token) await testInputValidation(token);
              }}
              disabled={isRunning}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Validation
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const token = await getToken({ template: "hasura" });
                if (token) await testDatabaseConnection(token);
              }}
              disabled={isRunning}
            >
              <Database className="mr-2 h-4 w-4" />
              Database
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const token = await getToken({ template: "hasura" });
                if (token) await testClerkConnection(token);
              }}
              disabled={isRunning}
            >
              <Mail className="mr-2 h-4 w-4" />
              Clerk API
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const token = await getToken({ template: "hasura" });
                if (token) await testFullCreation(token);
              }}
              disabled={isRunning}
            >
              <User className="mr-2 h-4 w-4" />
              Full Creation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}