"use client";

import { useSubscription, useQuery } from "@apollo/client";
import { formatDistanceToNow, format, subHours, subDays } from "date-fns";
import { useMemo, useState, useEffect } from "react";
import {
  AlertTriangle,
  Shield,
  Activity,
  Users,
  FileText,
  Lock,
  TrendingUp,
  CheckCircle,
  XCircle,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SecurityOverviewDocument,
  SecurityEventsStreamDocument,
  FailedOperationsStreamDocument,
  CriticalDataAccessStreamDocument,
} from "@/domains/audit/graphql/generated/graphql";
import { useAuthContext } from "@/lib/auth";
import { useSecureSubscription } from "@/hooks/use-subscription-permissions";
import { useStrategicQuery } from "@/hooks/use-strategic-query";

export default function SecurityDashboard() {
  // State for WebSocket connection status
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(true);

  // Calculate time ranges - memoized to prevent unnecessary re-subscriptions
  const timeRanges = useMemo(
    () => ({
      twentyFourHoursAgo: subHours(new Date(), 24).toISOString(),
      sevenDaysAgo: subDays(new Date(), 7).toISOString(),
    }),
    []
  );

  // Get permissions from unified auth context
  const { hasPermission, userRole } = useAuthContext();
  
  // Convert to enhanced permission format for backward compatibility
  const securityReadPermission = {
    granted: hasPermission("security:read"),
    requiredRole: "org_admin",
    currentRole: userRole
  };
  const securityManagePermission = {
    granted: hasPermission("security:manage"),
    requiredRole: "org_admin", 
    currentRole: userRole
  };
  const auditReadPermission = {
    granted: hasPermission("audit:read"),
    requiredRole: "org_admin",
    currentRole: userRole
  };

  // Determine which query to use based on permissions
  // For now, always use the basic query until JWT authentication is properly working
  const securityQueryDocument = SecurityOverviewDocument;
  
  // TODO: Re-enable once JWT token passing is fixed
  // const securityQueryDocument = auditReadPermission.granted
  //   ? SecurityOverviewWithDataAccessDocument
  //   : SecurityOverviewDocument;

  // Initial data load using strategic query for security events
  const {
    data: initialData,
    loading: queryLoading,
    error,
    refetch,
  } = useQuery(securityQueryDocument, {
    variables: { timeRange: timeRanges.twentyFourHoursAgo },
    // No polling - subscriptions handle real-time updates
    pollInterval: 0,
    // Skip query if user doesn't have security read permission
    skip: !securityReadPermission.granted,
  });

  // Real-time security events subscription with permission validation
  const securityEventsResult = useSecureSubscription(
    () =>
      useSubscription(SecurityEventsStreamDocument, {
        variables: {},
        onError: error => {
          console.warn("Security events subscription error:", error);
          setIsWebSocketConnected(false);
        },
        onComplete: () => {
          console.log("Security events subscription completed");
        },
      }),
    {
      resource: "security",
      action: "read",
      onPermissionDenied: () => setIsWebSocketConnected(false),
    }
  );
  const {
    data: securityEventsData,
    error: securityEventsError,
    permissionError: securityPermissionError,
  } = securityEventsResult;

  // Real-time failed operations subscription
  const { data: failedOpsData, error: failedOpsError } = useSubscription(
    FailedOperationsStreamDocument,
    {
      variables: {},
      onError: error => {
        console.warn("Failed operations subscription error:", error);
        setIsWebSocketConnected(false);
      },
    }
  );

  // Real-time critical data access subscription - only for roles with permissions
  const { data: criticalDataAccessData, error: criticalDataAccessError } =
    useSubscription(CriticalDataAccessStreamDocument, {
      variables: {},
      // Skip subscription if user doesn't have audit read permissions
      skip: !auditReadPermission.granted,
      onError: error => {
        console.warn("Critical data access subscription error:", error);
        // Don't set WebSocket as disconnected for permission errors
        if (
          !error.message.includes("field") &&
          !error.message.includes("permission")
        ) {
          setIsWebSocketConnected(false);
        }
      },
    });

  // Fallback polling when WebSocket is disconnected
  const { data: fallbackData, loading: fallbackLoading } = useStrategicQuery(
    securityQueryDocument,
    "auditLogs", // Use auditLogs strategy for fallback
    {
      variables: { timeRange: timeRanges.twentyFourHoursAgo },
      // Only poll if WebSocket is disconnected
      skip: isWebSocketConnected,
      pollInterval: isWebSocketConnected ? 0 : 300000, // 5 minutes fallback
      fetchPolicy: "network-only", // Always fetch fresh data for fallback
    }
  );

  // Monitor WebSocket connection status
  useEffect(() => {
    const hasSubscriptionErrors = !!(
      securityEventsError ||
      failedOpsError ||
      criticalDataAccessError
    );
    if (hasSubscriptionErrors) {
      setIsWebSocketConnected(false);
    } else if (securityEventsData || failedOpsData || criticalDataAccessData) {
      setIsWebSocketConnected(true);
    }
  }, [
    securityEventsData,
    failedOpsData,
    criticalDataAccessData,
    securityEventsError,
    failedOpsError,
    criticalDataAccessError,
  ]);

  // Merge initial data with real-time updates
  const data = useMemo(() => {
    const baseData = isWebSocketConnected
      ? initialData
      : fallbackData || initialData;

    if (!baseData) return null;

    return {
      ...baseData,
      // Use real-time data when available, fallback to initial data
      recentAuditLogs:
        securityEventsData?.auditLogs || baseData.recentAuditLogs,
      failedOperations: failedOpsData?.auditLogs || baseData.failedOperations,
      // Safely handle dataAccessLogs field - fallback to empty array if not available
      dataAccessSummary:
        criticalDataAccessData?.auditLogs ||
        baseData.dataAccessSummary ||
        [],
    };
  }, [
    initialData,
    fallbackData,
    securityEventsData,
    failedOpsData,
    criticalDataAccessData,
    isWebSocketConnected,
  ]);


  if (!securityReadPermission.granted) {
    return (
      <div className="container mx-auto py-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to view security information. Required
            role: {securityReadPermission.requiredRole}. Current role:{" "}
            {securityReadPermission.currentRole}.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  const router = useRouter();

  // Enhanced loading state considering subscriptions
  const loading = queryLoading || fallbackLoading;

  // Debug loading states with subscription info
  console.log("🔍 Security Dashboard States:", {
    queryLoading,
    fallbackLoading,
    hasData: !!data,
    hasError: !!error,
    isWebSocketConnected,
    hasSubscriptionData: !!(
      securityEventsData ||
      failedOpsData ||
      criticalDataAccessData
    ),
    subscriptionErrors: {
      securityEvents: !!securityEventsError,
      failedOps: !!failedOpsError,
      criticalDataAccess: !!criticalDataAccessError,
    },
  });

  // Enhanced loading state considering subscriptions
  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-12 w-12 animate-pulse mx-auto mb-4" />
          <p>Loading security dashboard...</p>
          <p className="text-sm text-muted-foreground">
            {!isWebSocketConnected
              ? "Loading security data (fallback mode)..."
              : "Loading security data..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("🔒 Permission Error in SecurityOverview:", error);
    
    // Log specific dataAccessLogs permission error for debugging
    if (error.message.includes("dataAccessLogs") || error.message.includes("field 'dataAccessLogs' not found")) {
      console.warn("🔄 DataAccessLogs permission error detected - user may need different role or JWT authentication issue");
    }
    
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Security Data</AlertTitle>
          <AlertDescription>
            {error.message.includes("permission") ||
            error.message.includes("field") ||
            error.message.includes("dataAccessLogs")
              ? "You don't have permission to access some security data. Please contact your administrator if you need access to detailed audit logs."
              : `Failed to load security data: ${error.message}`}
          </AlertDescription>
          <Button onClick={() => refetch()} className="mt-2" variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  // Calculate security metrics
  const totalOps = data?.totalAuditLogs?.aggregate?.count || 0;
  const failedOps = data?.failedOperations?.length || 0;
  const successRate =
    totalOps > 0
      ? (((totalOps - failedOps) / totalOps) * 100).toFixed(1)
      : "100.0";
  const criticalAccess = data?.dataAccessSummary?.length || 0;

  // Mock compliance status (in production, this would come from a real compliance check)
  const complianceStatus = failedOps > 0 ? "warning" : "passed";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Security & Compliance
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground">
              Monitor security events, audit trails, and compliance status
            </p>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isWebSocketConnected ? "bg-green-500" : "bg-orange-500"
                }`}
              />
              <span className="text-xs text-muted-foreground">
                {isWebSocketConnected ? "Real-time" : "Fallback mode"}
              </span>
            </div>
          </div>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Critical Alerts */}
      {failedOps > 5 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>High Failure Rate Detected</AlertTitle>
          <AlertDescription>
            {failedOps} failed operations in the last 24 hours require
            investigation
          </AlertDescription>
        </Alert>
      )}

      {/* Security Score Card */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-4xl font-bold">{successRate}%</div>
              <p className="text-sm text-muted-foreground">
                Operation Success Rate (24h)
              </p>
            </div>
            <div className="text-right space-y-2">
              <Badge
                variant={
                  complianceStatus === "passed"
                    ? "default"
                    : complianceStatus === "warning"
                      ? "secondary"
                      : "destructive"
                }
                className="text-sm"
              >
                Compliance: {complianceStatus}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Last updated: {format(new Date(), "MMM d, yyyy HH:mm")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Operations
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOps}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Failed Operations
            </CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {failedOps}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires investigation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Access
            </CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalAccess}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.authEventsSummary?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">With access</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="failures" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="failures">Failed Operations</TabsTrigger>
          <TabsTrigger value="critical">Critical Access</TabsTrigger>
          <TabsTrigger value="overview">System Overview</TabsTrigger>
        </TabsList>

        {/* Failed Operations Tab */}
        <TabsContent value="failures" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Failed Operations</CardTitle>
                  <CardDescription>
                    Operations that failed in the last 24 hours
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/security/audit">View Full Audit Log</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!data?.failedOperations?.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No failed operations in the last 24 hours</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.failedOperations.map((op: any) => (
                    <div
                      key={op.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {op.action} {op.resourceType}
                          </span>
                          <Badge variant="destructive">Failed</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {op.eventTime ? formatDistanceToNow(new Date(op.eventTime)) : 'Unknown time'} ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Critical Access Tab */}
        <TabsContent value="critical" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Critical Data Access</CardTitle>
                  <CardDescription>
                    Access to critical classified data in the last 7 days
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!auditReadPermission.granted ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Lock className="h-12 w-12 mx-auto mb-2" />
                  <p>
                    Requires audit read permissions to view critical data access
                    logs
                  </p>
                  <p className="text-sm">
                    Contact your administrator for access
                  </p>
                </div>
              ) : !data?.dataAccessSummary?.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-2" />
                  <p>No critical data access in the last 7 days</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.dataAccessSummary.map((access: any) => (
                    <div
                      key={access.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {access.accessType} {access.resourceType}
                          </span>
                          <Badge variant="destructive">
                            {access.dataClassification || "CRITICAL"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {access.eventTime ? formatDistanceToNow(new Date(access.eventTime)) : 'Unknown time'} ago
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Rows accessed: {access.rowCount || 0}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>
                Current system status and configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Audit Configuration</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✅ Audit logging enabled</li>
                    <li>✅ Real-time monitoring active</li>
                    <li>✅ Failed operation tracking</li>
                    <li>✅ Critical data classification</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Compliance Status</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✅ User access logging</li>
                    <li>✅ Data modification tracking</li>
                    <li>✅ Role-based access control</li>
                    <li>⚠️ Automated compliance checks (planned)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common security and compliance tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/security/audit">
                <FileText className="mr-2 h-4 w-4" />
                View Full Audit Log
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/staff">
                <Users className="mr-2 h-4 w-4" />
                Manage User Access
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/security/reports">
                <TrendingUp className="mr-2 h-4 w-4" />
                Generate Reports
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
