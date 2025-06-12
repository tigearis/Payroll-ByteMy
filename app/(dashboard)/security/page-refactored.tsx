"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import {
  AlertTriangle,
  Shield,
  Activity,
  Users,
  FileText,
  Lock,
  Eye,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Define the query directly instead of importing it
const SECURITY_OVERVIEW_QUERY = gql`
  query SecurityOverview {
    # Security metrics for the last 24 hours
    metrics_24h: audit_log_aggregate(
      where: { created_at: { _gte: "now() - interval '24 hours'" } }
    ) {
      aggregate {
        count
      }
      nodes {
        success
        data_classification
        action
      }
    }

    # Failed operations
    failed_operations: audit_log_aggregate(
      where: {
        success: { _eq: false }
        created_at: { _gte: "now() - interval '24 hours'" }
      }
    ) {
      aggregate {
        count
      }
      nodes {
        user {
          email
        }
        entity_type
        action
        error_message
        created_at
      }
    }

    # Critical data access
    critical_access: audit_log_aggregate(
      where: {
        data_classification: { _eq: "CRITICAL" }
        created_at: { _gte: "now() - interval '7 days'" }
      }
    ) {
      aggregate {
        count
      }
      nodes {
        user {
          email
          role
        }
        entity_type
        action
        created_at
      }
    }

    # Unresolved security events
    security_events: security_event_log(
      where: { resolved: { _eq: false } }
      order_by: { created_at: desc }
      limit: 5
    ) {
      id
      event_type
      severity
      details
      created_at
      user {
        email
      }
    }

    # Recent compliance checks
    compliance_checks: compliance_check(
      order_by: { performed_at: desc }
      limit: 1
    ) {
      id
      check_type
      status
      findings
      remediation_required
      performed_at
      next_check_due
    }

    # Data access patterns
    data_access_7d: data_access_log_aggregate(
      where: { accessed_at: { _gte: "now() - interval '7 days'" } }
    ) {
      aggregate {
        count
        sum {
          record_count
        }
      }
      nodes {
        data_classification
        data_type
      }
    }
  }
`;

export default function SecurityDashboard() {
  const router = useRouter();

  // Use the query directly instead of the generated hook
  const { data, loading, error, refetch } = useQuery(SECURITY_OVERVIEW_QUERY, {
    pollInterval: 30000, // Refresh every 30 seconds
  });

  // Auto-refresh on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load security dashboard: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  // Calculate security health score
  const totalOps = data?.metrics_24h?.aggregate?.count || 0;
  const failedOps = data?.failed_operations?.aggregate?.count || 0;
  const successRate =
    totalOps > 0 ? ((totalOps - failedOps) / totalOps) * 100 : 100;
  const healthScore = Math.round(successRate);

  // Get critical alerts
  const criticalAlerts =
    data?.security_events?.filter(
      (event: any) => event.severity === "critical"
    ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor security events, audit trails, and compliance status
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => router.push("/security/audit")}>
            <FileText className="h-4 w-4 mr-2" />
            View Audit Log
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Critical Security Alerts</AlertTitle>
          <AlertDescription>
            {criticalAlerts.length} critical security{" "}
            {criticalAlerts.length === 1 ? "event" : "events"} require immediate
            attention
          </AlertDescription>
        </Alert>
      )}

      {/* Security Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-4xl font-bold">{healthScore}%</div>
              <p className="text-sm text-muted-foreground">
                Based on operation success rate (24h)
              </p>
            </div>
            <Badge
              variant={
                healthScore >= 95
                  ? "default"
                  : healthScore >= 80
                  ? "secondary"
                  : "destructive"
              }
              className="text-lg px-4 py-2"
            >
              {healthScore >= 95
                ? "Excellent"
                : healthScore >= 80
                ? "Good"
                : "Needs Attention"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Operations (24h)
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalOps.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              All tracked operations
            </p>
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
              Critical Access (7d)
            </CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.critical_access?.aggregate?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              High-security data access
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Data Accessed (7d)
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.data_access_7d?.aggregate?.sum?.record_count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total records accessed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="failed">Failed Operations</TabsTrigger>
          <TabsTrigger value="critical">Critical Access</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unresolved Security Events</CardTitle>
              <CardDescription>
                Security events that require attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data?.security_events?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No unresolved security events</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data?.security_events?.map((event: any) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              event.severity === "critical"
                                ? "destructive"
                                : event.severity === "error"
                                ? "destructive"
                                : event.severity === "warning"
                                ? "secondary"
                                : "default"
                            }
                          >
                            {event.severity}
                          </Badge>
                          <span className="font-medium">
                            {event.event_type.replace(/_/g, " ").toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.user?.email || "System"} •{" "}
                          {formatDistanceToNow(new Date(event.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                        {event.details && (
                          <p className="text-sm">
                            {JSON.stringify(event.details, null, 2)}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(`/security/events/${event.id}`)
                        }
                      >
                        Investigate
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Failed Operations (24h)</CardTitle>
              <CardDescription>
                Operations that failed in the last 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!data?.failed_operations?.nodes?.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No failed operations in the last 24 hours</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.failed_operations.nodes.map((op: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">{op.action}</Badge>
                          <span className="font-medium">{op.entity_type}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {op.user?.email} •{" "}
                          {formatDistanceToNow(new Date(op.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                        {op.error_message && (
                          <p className="text-sm text-destructive">
                            {op.error_message}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Critical Data Access (7 days)</CardTitle>
              <CardDescription>Access to highly sensitive data</CardDescription>
            </CardHeader>
            <CardContent>
              {!data?.critical_access?.nodes?.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Lock className="h-12 w-12 mx-auto mb-4" />
                  <p>No critical data access in the last 7 days</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.critical_access.nodes.map(
                    (access: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">CRITICAL</Badge>
                            <span className="font-medium">
                              {access.action} {access.entity_type}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {access.user?.email} ({access.user?.role}) •{" "}
                            {formatDistanceToNow(new Date(access.created_at), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Latest Compliance Check</CardTitle>
              <CardDescription>
                Most recent compliance assessment results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!data?.compliance_checks?.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                  <p>No compliance checks performed</p>
                  <Button
                    className="mt-4"
                    onClick={() => router.push("/security/compliance/new")}
                  >
                    Run Compliance Check
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.compliance_checks.map((check: any) => (
                    <div key={check.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{check.check_type}</h4>
                          <p className="text-sm text-muted-foreground">
                            Performed{" "}
                            {formatDistanceToNow(new Date(check.performed_at), {
                              addSuffix: true,
                            })}{" "}
                            by {check.performer?.email}
                          </p>
                        </div>
                        <Badge
                          variant={
                            check.status === "passed"
                              ? "default"
                              : check.status === "warning"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {check.status}
                        </Badge>
                      </div>

                      {check.findings && (
                        <div className="p-4 bg-muted rounded-lg">
                          <h5 className="font-medium mb-2">Findings</h5>
                          <pre className="text-sm whitespace-pre-wrap">
                            {JSON.stringify(check.findings, null, 2)}
                          </pre>
                        </div>
                      )}

                      {check.remediation_required && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Remediation Required</AlertTitle>
                          <AlertDescription>
                            {check.remediation_notes ||
                              "Please address the findings above"}
                          </AlertDescription>
                        </Alert>
                      )}

                      {check.next_check_due && (
                        <p className="text-sm text-muted-foreground">
                          Next check due:{" "}
                          {format(new Date(check.next_check_due), "PPP")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/security/audit")}
            >
              <FileText className="h-4 w-4 mr-2" />
              View Full Audit Log
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/security/access-review")}
            >
              <Users className="h-4 w-4 mr-2" />
              Perform Access Review
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/security/reports")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Generate Compliance Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
