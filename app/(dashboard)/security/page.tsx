"use client";

import { useQuery } from "@apollo/client";
import { formatDistanceToNow, format, subHours, subDays } from "date-fns";
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
import { SecurityOverviewDocument } from "@/domains/audit/graphql/generated/graphql";
import { useUserRole } from "@/hooks/use-user-role";

export default function SecurityDashboard() {
  const {
    data,
    loading: queryLoading,
    error,
    refetch,
    networkStatus,
  } = useQuery(SecurityOverviewDocument, {
    variables: {
      twentyFourHoursAgo: subHours(new Date(), 24).toISOString(),
      sevenDaysAgo: subDays(new Date(), 7).toISOString(),
    },
    // Poll every 2 minutes instead of 30 seconds to reduce server load
    // while still maintaining reasonable data freshness for security monitoring
    pollInterval: 120000,
    errorPolicy: "all", // Return partial data even if there are errors
    notifyOnNetworkStatusChange: true, // Important for polling
  });

  const {
    isDeveloper,
    isAdministrator,
    hasAdminAccess,
    isLoading: roleLoading,
    userRole,
  } = useUserRole();
  const router = useRouter();

  // Debug loading states with more detail
  console.log("🔍 Security Dashboard Loading States:", {
    queryLoading,
    roleLoading,
    hasData: !!data,
    hasError: !!error,
    networkStatus, // 1: loading, 2: setVariables, 3: fetchMore, 4: refetch, 6: poll, 7: ready
    isPolling: networkStatus === 6,
    isRefetching: networkStatus === 4,
  });

  // Check if user has access to security features
  if (!roleLoading && !hasAdminAccess && !isDeveloper && !isAdministrator) {
    console.log("🚨 Security page access denied:", {
      roleLoading,
      hasAdminAccess,
      isDeveloper,
      isAdministrator,
      userRole,
    });
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You need administrator privileges to access the security dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show loading state only if we're still loading role information
  // or if we have access and the query is still loading
  if (roleLoading || (hasAdminAccess && queryLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-12 w-12 animate-pulse mx-auto mb-4" />
          <p>Loading security dashboard...</p>
          {roleLoading && (
            <p className="text-sm text-muted-foreground">
              Verifying access permissions...
            </p>
          )}
          {queryLoading && !roleLoading && (
            <p className="text-sm text-muted-foreground">
              {networkStatus === 6
                ? "Refreshing security data..."
                : "Loading security data..."}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    console.error("🔒 Permission Error in SecurityOverview:", error);
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Security Data</AlertTitle>
          <AlertDescription>
            {error.message.includes("permission")
              ? "You don't have permission to access audit logs. Please check your role permissions."
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
  const totalOps = data?.audit_log_count?.aggregate?.count || 0;
  const failedOps = data?.failed_operations?.length || 0;
  const successRate =
    totalOps > 0
      ? (((totalOps - failedOps) / totalOps) * 100).toFixed(1)
      : "100.0";
  const criticalAccess = data?.data_access_summary?.length || 0;

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
          <p className="text-muted-foreground">
            Monitor security events, audit trails, and compliance status
          </p>
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
              {data?.auth_events_summary?.length || 0}
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
              {!data?.failed_operations?.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No failed operations in the last 24 hours</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.failed_operations.map((op: any) => (
                    <div
                      key={op.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {op.action} {op.entity_type}
                          </span>
                          <Badge variant="destructive">Failed</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          User: {op.user_id} ({op.userrole}) •{" "}
                          {formatDistanceToNow(new Date(op.created_at))} ago
                        </p>
                        <p className="text-sm text-destructive">
                          {op.error_message}
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
              {!data?.data_access_summary?.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-2" />
                  <p>No critical data access in the last 7 days</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.data_access_summary.map((access: any) => (
                    <div
                      key={access.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {access.action} {access.entity_type}
                          </span>
                          <Badge variant="destructive">CRITICAL</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          User: {access.user_id} ({access.userrole}) •{" "}
                          {formatDistanceToNow(new Date(access.created_at))} ago
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Entity ID: {access.entity_id}
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
